/**
 * AgroPulse — Data store con persistencia real (Supabase Postgres) y
 * fallback in-memory.
 *
 * Design notes:
 * - Contrato 100% ASYNC: todos los métodos devuelven Promise, sin importar
 *   el backend. Los call-sites siempre hacen `await`.
 * - Modo dual: si SUPABASE_URL/SUPABASE_ANON_KEY están configuradas se usa
 *   Postgres (patrón documento: id + data jsonb); si faltan, se usa la
 *   implementación in-memory original (demo degradado pero funcional).
 * - SERVER-ONLY: este módulo importa supabase-js — NUNCA importarlo desde
 *   client components ni desde código edge (proxy.ts / auth.config.ts).
 * - Seeding: en Supabase, `ensureSeeded()` corre lazy una vez por instancia
 *   (usuarios, cupones y pedidos demo se insertan solo si la tabla users
 *   está vacía). En in-memory se conserva `seedIfNeeded()`.
 */
import { SEED_USERS, SEED_PAYMENT_METHODS } from "./seed";
import { SEED_ORDERS } from "./seed-orders";
import { SEED_COUPONS } from "./seed-coupons";
import { getSupabase } from "./supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  User,
  PublicUser,
  AuthAttempt,
  OrderExtended,
  OrderStatus,
  Lot,
  AuditLog,
  Notification,
  PaymentMethod,
  SessionRecord,
  StockReservation,
  Coupon,
  ChatMessage,
  UserRole,
} from "./types";
import { toPublicUser } from "./types";

// ============================================================================
// STATE in-memory — globalThis-backed para sobrevivir HMR en dev (fallback)
// ============================================================================

interface AgroPulseState {
  users: Map<string, User>;
  authAttempts: Map<string, AuthAttempt>;
  orders: Map<string, OrderExtended>;
  lots: Map<string, Lot>;
  auditLogs: AuditLog[];
  notifications: Notification[];
  paymentMethods: Map<string, PaymentMethod>;
  sessions: Map<string, SessionRecord>;
  /** reservas temporales de stock (carrito en vivo) */
  reservations: Map<string, StockReservation>;
  /** cupones de descuento, key = code en MAYÚSCULAS */
  coupons: Map<string, Coupon>;
  /** unidades vendidas (confirmadas) acumuladas por productId */
  stockSold: Map<string, number>;
  /** mensajes de chat por pedido (fallback in-memory) */
  messages: Map<string, ChatMessage[]>;
  seeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __agropulseState: AgroPulseState | undefined;
}

function getState(): AgroPulseState {
  if (!globalThis.__agropulseState) {
    globalThis.__agropulseState = {
      users: new Map(),
      authAttempts: new Map(),
      orders: new Map(),
      lots: new Map(),
      auditLogs: [],
      notifications: [],
      paymentMethods: new Map(),
      sessions: new Map(),
      reservations: new Map(),
      coupons: new Map(),
      stockSold: new Map(),
      messages: new Map(),
      seeded: false,
    };
  }
  const s = globalThis.__agropulseState;
  // Migración suave para instancias creadas antes de añadir estos campos (HMR dev)
  if (!s.reservations) s.reservations = new Map();
  if (!s.coupons) s.coupons = new Map();
  if (!s.stockSold) s.stockSold = new Map();
  if (!s.messages) s.messages = new Map();
  return s;
}

function seedIfNeeded(): void {
  const s = getState();
  if (s.seeded) return;
  for (const u of SEED_USERS) s.users.set(u.id, u);
  for (const pm of SEED_PAYMENT_METHODS) s.paymentMethods.set(pm.id, pm);
  // Pedidos demo persistentes (IDs determinísticos, NO sobrescriben si ya existen)
  for (const o of SEED_ORDERS) {
    if (!s.orders.has(o.id)) s.orders.set(o.id, o);
  }
  for (const c of SEED_COUPONS) {
    if (!s.coupons.has(c.code)) s.coupons.set(c.code, c);
  }
  s.seeded = true;
}

// ============================================================================
// SUPABASE helpers — patrón documento { id, data jsonb }
// ============================================================================

function logDbError(scope: string, error: unknown): void {
  const msg =
    error && typeof error === "object" && "message" in error
      ? (error as { message: string }).message
      : String(error);
  console.error(`[agropulse-db] ${scope}: ${msg}`);
}

/** Fila genérica del patrón documento. */
interface DocRow<T> {
  data: T;
}

/**
 * Seeding lazy en Supabase: si la tabla users está vacía, inserta usuarios,
 * cupones y pedidos demo (upsert ignorando conflictos). Flag module-level
 * para no repetir por instancia; en error se resetea para reintentar.
 */
let seedPromise: Promise<void> | null = null;
let seededSupabase = false;

async function ensureSeeded(sb: SupabaseClient): Promise<void> {
  if (seededSupabase) return;
  if (!seedPromise) {
    seedPromise = (async () => {
      const { count, error } = await sb
        .from("users")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      if ((count ?? 0) === 0) {
        const { error: e1 } = await sb
          .from("users")
          .upsert(
            SEED_USERS.map((u) => ({ id: u.id, data: u })),
            { ignoreDuplicates: true },
          );
        if (e1) throw e1;
        const { error: e2 } = await sb
          .from("coupons")
          .upsert(
            SEED_COUPONS.map((c) => ({ code: c.code, data: c })),
            { ignoreDuplicates: true },
          );
        if (e2) throw e2;
        const { error: e3 } = await sb
          .from("orders")
          .upsert(
            SEED_ORDERS.map((o) => ({ id: o.id, data: o })),
            { ignoreDuplicates: true },
          );
        if (e3) throw e3;
      }
      seededSupabase = true;
    })();
  }
  try {
    await seedPromise;
  } catch (err) {
    // permitir reintento en la próxima llamada
    seedPromise = null;
    logDbError("ensureSeeded", err);
  }
}

// ============================================================================
// USERS
// ============================================================================

export const usersDb = {
  async findById(id: string): Promise<User | undefined> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return getState().users.get(id);
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("users")
      .select("data")
      .eq("id", id)
      .maybeSingle<DocRow<User>>();
    if (error) {
      logDbError("users.findById", error);
      return undefined;
    }
    return data?.data;
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      for (const u of getState().users.values()) {
        if (u.email.toLowerCase() === normalized) return u;
      }
      return undefined;
    }
    await ensureSeeded(sb);
    // Los emails se guardan siempre en minúsculas (seed + signup)
    const { data, error } = await sb
      .from("users")
      .select("data")
      .eq("data->>email", normalized)
      .limit(1)
      .returns<DocRow<User>[]>();
    if (error) {
      logDbError("users.findByEmail", error);
      return undefined;
    }
    return data?.[0]?.data;
  },

  async list(): Promise<User[]> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return Array.from(getState().users.values());
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("users")
      .select("data")
      .returns<DocRow<User>[]>();
    if (error) {
      logDbError("users.list", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async listPublic(): Promise<PublicUser[]> {
    const users = await usersDb.list();
    return users.map(toPublicUser);
  },

  async create(user: User): Promise<User> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      getState().users.set(user.id, user);
      return user;
    }
    await ensureSeeded(sb);
    const { error } = await sb.from("users").upsert({ id: user.id, data: user });
    if (error) logDbError("users.create", error);
    return user;
  },

  async update(id: string, patch: Partial<User>): Promise<User | undefined> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      const existing = getState().users.get(id);
      if (!existing) return undefined;
      const updated = { ...existing, ...patch };
      getState().users.set(id, updated);
      return updated;
    }
    const existing = await usersDb.findById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    const { error } = await sb.from("users").upsert({ id, data: updated });
    if (error) {
      logDbError("users.update", error);
      return undefined;
    }
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return getState().users.delete(id);
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("users")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) {
      logDbError("users.delete", error);
      return false;
    }
    return (data?.length ?? 0) > 0;
  },

  async count(): Promise<number> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return getState().users.size;
    }
    await ensureSeeded(sb);
    const { count, error } = await sb
      .from("users")
      .select("id", { count: "exact", head: true });
    if (error) {
      logDbError("users.count", error);
      return 0;
    }
    return count ?? 0;
  },
};

// ============================================================================
// AUTH ATTEMPTS — rate limiting (5 intentos, lockout 15 min)
// ============================================================================

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export const authAttemptsDb = {
  async get(email: string): Promise<AuthAttempt | undefined> {
    const key = email.toLowerCase();
    const sb = getSupabase();
    if (!sb) return getState().authAttempts.get(key);
    const { data, error } = await sb
      .from("auth_attempts")
      .select("data")
      .eq("email", key)
      .maybeSingle<DocRow<AuthAttempt>>();
    if (error) {
      logDbError("authAttempts.get", error);
      return undefined;
    }
    return data?.data;
  },

  async isLocked(email: string): Promise<{ locked: boolean; until?: string }> {
    const a = await authAttemptsDb.get(email);
    if (!a?.lockedUntil) return { locked: false };
    const until = new Date(a.lockedUntil).getTime();
    if (until > Date.now()) return { locked: true, until: a.lockedUntil };
    // expired lockout — reset
    await authAttemptsDb.reset(email);
    return { locked: false };
  },

  async registerFailure(
    email: string,
  ): Promise<{ attempts: number; locked: boolean; until?: string }> {
    const key = email.toLowerCase();
    const now = new Date().toISOString();
    const current = await authAttemptsDb.get(key);
    const attempts = (current?.attempts ?? 0) + 1;
    const shouldLock = attempts >= MAX_LOGIN_ATTEMPTS;
    const until = shouldLock
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
      : undefined;
    const entry: AuthAttempt = {
      email: key,
      attempts,
      lastAttemptAt: now,
      lockedUntil: until,
    };
    const sb = getSupabase();
    if (!sb) {
      getState().authAttempts.set(key, entry);
    } else {
      const { error } = await sb
        .from("auth_attempts")
        .upsert({ email: key, data: entry });
      if (error) logDbError("authAttempts.registerFailure", error);
    }
    return { attempts, locked: shouldLock, until };
  },

  async reset(email: string): Promise<void> {
    const key = email.toLowerCase();
    const sb = getSupabase();
    if (!sb) {
      getState().authAttempts.delete(key);
      return;
    }
    const { error } = await sb.from("auth_attempts").delete().eq("email", key);
    if (error) logDbError("authAttempts.reset", error);
  },
};

// ============================================================================
// ORDERS
// ============================================================================

export const ordersDb = {
  async findById(id: string): Promise<OrderExtended | undefined> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return getState().orders.get(id);
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("orders")
      .select("data")
      .eq("id", id)
      .maybeSingle<DocRow<OrderExtended>>();
    if (error) {
      logDbError("orders.findById", error);
      return undefined;
    }
    return data?.data;
  },

  async findByShortCode(code: string): Promise<OrderExtended | undefined> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      for (const o of getState().orders.values()) {
        if (o.shortCode === code) return o;
      }
      return undefined;
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("orders")
      .select("data")
      .eq("data->>shortCode", code)
      .limit(1)
      .returns<DocRow<OrderExtended>[]>();
    if (error) {
      logDbError("orders.findByShortCode", error);
      return undefined;
    }
    return data?.[0]?.data;
  },

  async listByCustomer(customerId: string): Promise<OrderExtended[]> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return Array.from(getState().orders.values()).filter(
        (o) => o.customerId === customerId,
      );
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("orders")
      .select("data")
      .eq("data->>customerId", customerId)
      .order("data->>createdAt", { ascending: false })
      .returns<DocRow<OrderExtended>[]>();
    if (error) {
      logDbError("orders.listByCustomer", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async listByProductor(productorId: string): Promise<OrderExtended[]> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return Array.from(getState().orders.values()).filter((o) =>
        o.items.some((i) => i.productorId === productorId),
      );
    }
    await ensureSeeded(sb);
    // items es jsonb array — containment @> con objeto parcial
    const { data, error } = await sb
      .from("orders")
      .select("data")
      .contains("data->items", JSON.stringify([{ productorId }]))
      .order("data->>createdAt", { ascending: false })
      .returns<DocRow<OrderExtended>[]>();
    if (error) {
      logDbError("orders.listByProductor", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async listByLogistica(logisticaUserId: string): Promise<OrderExtended[]> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return Array.from(getState().orders.values()).filter(
        (o) => o.logisticaUserId === logisticaUserId,
      );
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("orders")
      .select("data")
      .eq("data->>logisticaUserId", logisticaUserId)
      .order("data->>createdAt", { ascending: false })
      .returns<DocRow<OrderExtended>[]>();
    if (error) {
      logDbError("orders.listByLogistica", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async listAll(): Promise<OrderExtended[]> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return Array.from(getState().orders.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("orders")
      .select("data")
      .order("data->>createdAt", { ascending: false })
      .returns<DocRow<OrderExtended>[]>();
    if (error) {
      logDbError("orders.listAll", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async create(order: OrderExtended): Promise<OrderExtended> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      getState().orders.set(order.id, order);
      return order;
    }
    await ensureSeeded(sb);
    const { error } = await sb
      .from("orders")
      .upsert({ id: order.id, data: order });
    if (error) logDbError("orders.create", error);
    return order;
  },

  async updateStatus(
    id: string,
    status: OrderStatus,
    note?: string,
    by?: string,
    byRole?: User["role"],
  ): Promise<OrderExtended | undefined> {
    const o = await ordersDb.findById(id);
    if (!o) return undefined;
    const updated: OrderExtended = {
      ...o,
      status,
      statusHistory: [
        ...o.statusHistory,
        { status, timestamp: new Date().toISOString(), note, by, byRole },
      ],
    };
    const sb = getSupabase();
    if (!sb) {
      getState().orders.set(id, updated);
      return updated;
    }
    const { error } = await sb.from("orders").upsert({ id, data: updated });
    if (error) {
      logDbError("orders.updateStatus", error);
      return undefined;
    }
    return updated;
  },

  async update(
    id: string,
    patch: Partial<OrderExtended>,
  ): Promise<OrderExtended | undefined> {
    const existing = await ordersDb.findById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    const sb = getSupabase();
    if (!sb) {
      getState().orders.set(id, updated);
      return updated;
    }
    const { error } = await sb.from("orders").upsert({ id, data: updated });
    if (error) {
      logDbError("orders.update", error);
      return undefined;
    }
    return updated;
  },

  async count(): Promise<number> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return getState().orders.size;
    }
    await ensureSeeded(sb);
    const { count, error } = await sb
      .from("orders")
      .select("id", { count: "exact", head: true });
    if (error) {
      logDbError("orders.count", error);
      return 0;
    }
    return count ?? 0;
  },
};

// ============================================================================
// LOTS — productores crean lotes nuevos
// ============================================================================

export const lotsDb = {
  async findById(id: string): Promise<Lot | undefined> {
    const sb = getSupabase();
    if (!sb) return getState().lots.get(id);
    const { data, error } = await sb
      .from("lots")
      .select("data")
      .eq("id", id)
      .maybeSingle<DocRow<Lot>>();
    if (error) {
      logDbError("lots.findById", error);
      return undefined;
    }
    return data?.data;
  },

  async listByProductor(productorId: string): Promise<Lot[]> {
    const sb = getSupabase();
    if (!sb) {
      return Array.from(getState().lots.values())
        .filter((l) => l.productorId === productorId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
    const { data, error } = await sb
      .from("lots")
      .select("data")
      .eq("data->>productorId", productorId)
      .order("data->>createdAt", { ascending: false })
      .returns<DocRow<Lot>[]>();
    if (error) {
      logDbError("lots.listByProductor", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async listAll(): Promise<Lot[]> {
    const sb = getSupabase();
    if (!sb) {
      return Array.from(getState().lots.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    const { data, error } = await sb
      .from("lots")
      .select("data")
      .order("data->>createdAt", { ascending: false })
      .returns<DocRow<Lot>[]>();
    if (error) {
      logDbError("lots.listAll", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async listActive(country?: User["country"]): Promise<Lot[]> {
    const sb = getSupabase();
    if (!sb) {
      const all = await lotsDb.listAll();
      return all.filter(
        (l) => l.status === "activo" && (!country || l.country === country),
      );
    }
    let query = sb
      .from("lots")
      .select("data")
      .eq("data->>status", "activo");
    if (country) query = query.eq("data->>country", country);
    const { data, error } = await query
      .order("data->>createdAt", { ascending: false })
      .returns<DocRow<Lot>[]>();
    if (error) {
      logDbError("lots.listActive", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async create(lot: Lot): Promise<Lot> {
    const sb = getSupabase();
    if (!sb) {
      getState().lots.set(lot.id, lot);
      return lot;
    }
    const { error } = await sb.from("lots").upsert({ id: lot.id, data: lot });
    if (error) logDbError("lots.create", error);
    return lot;
  },

  async update(id: string, patch: Partial<Lot>): Promise<Lot | undefined> {
    const existing = await lotsDb.findById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    const sb = getSupabase();
    if (!sb) {
      getState().lots.set(id, updated);
      return updated;
    }
    const { error } = await sb.from("lots").upsert({ id, data: updated });
    if (error) {
      logDbError("lots.update", error);
      return undefined;
    }
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const sb = getSupabase();
    if (!sb) return getState().lots.delete(id);
    const { data, error } = await sb
      .from("lots")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) {
      logDbError("lots.delete", error);
      return false;
    }
    return (data?.length ?? 0) > 0;
  },
};

// ============================================================================
// AUDIT LOG
// ============================================================================

export const auditDb = {
  async list(limit = 100): Promise<AuditLog[]> {
    const sb = getSupabase();
    if (!sb) {
      const all = getState().auditLogs;
      return all.slice(-limit).reverse();
    }
    const { data, error } = await sb
      .from("audit_logs")
      .select("data")
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<DocRow<AuditLog>[]>();
    if (error) {
      logDbError("audit.list", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async listByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    const sb = getSupabase();
    if (!sb) {
      return getState()
        .auditLogs.filter((l) => l.userId === userId)
        .slice(-limit)
        .reverse();
    }
    const { data, error } = await sb
      .from("audit_logs")
      .select("data")
      .eq("data->>userId", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<DocRow<AuditLog>[]>();
    if (error) {
      logDbError("audit.listByUser", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async listByAction(
    action: AuditLog["action"],
    limit = 50,
  ): Promise<AuditLog[]> {
    const sb = getSupabase();
    if (!sb) {
      return getState()
        .auditLogs.filter((l) => l.action === action)
        .slice(-limit)
        .reverse();
    }
    const { data, error } = await sb
      .from("audit_logs")
      .select("data")
      .eq("data->>action", action)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<DocRow<AuditLog>[]>();
    if (error) {
      logDbError("audit.listByAction", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async add(
    log: Omit<AuditLog, "id" | "timestamp"> & { id?: string; timestamp?: string },
  ): Promise<AuditLog> {
    const entry: AuditLog = {
      id: log.id ?? `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: log.timestamp ?? new Date().toISOString(),
      ...log,
    };
    const sb = getSupabase();
    if (!sb) {
      getState().auditLogs.push(entry);
      // keep last 1000 in memory
      if (getState().auditLogs.length > 1000) {
        getState().auditLogs = getState().auditLogs.slice(-1000);
      }
      return entry;
    }
    const { error } = await sb
      .from("audit_logs")
      .insert({ log_id: entry.id, data: entry });
    if (error) logDbError("audit.add", error);
    return entry;
  },

  async count(): Promise<number> {
    const sb = getSupabase();
    if (!sb) return getState().auditLogs.length;
    const { count, error } = await sb
      .from("audit_logs")
      .select("id", { count: "exact", head: true });
    if (error) {
      logDbError("audit.count", error);
      return 0;
    }
    return count ?? 0;
  },
};

// ============================================================================
// NOTIFICATIONS — email/whatsapp queue
// ============================================================================

export const notificationsDb = {
  async list(limit = 100): Promise<Notification[]> {
    const sb = getSupabase();
    if (!sb) return getState().notifications.slice(-limit).reverse();
    const { data, error } = await sb
      .from("notifications")
      .select("data")
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<DocRow<Notification>[]>();
    if (error) {
      logDbError("notifications.list", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async findById(id: string): Promise<Notification | undefined> {
    const sb = getSupabase();
    if (!sb) return getState().notifications.find((n) => n.id === id);
    const { data, error } = await sb
      .from("notifications")
      .select("data")
      .eq("id", id)
      .maybeSingle<DocRow<Notification>>();
    if (error) {
      logDbError("notifications.findById", error);
      return undefined;
    }
    return data?.data;
  },

  async add(
    n: Omit<Notification, "id" | "createdAt"> & { id?: string },
  ): Promise<Notification> {
    const entry: Notification = {
      id: n.id ?? `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...n,
    };
    const sb = getSupabase();
    if (!sb) {
      getState().notifications.push(entry);
      if (getState().notifications.length > 500) {
        getState().notifications = getState().notifications.slice(-500);
      }
      return entry;
    }
    const { error } = await sb
      .from("notifications")
      .upsert({ id: entry.id, data: entry });
    if (error) logDbError("notifications.add", error);
    return entry;
  },

  async markSent(id: string): Promise<void> {
    const sb = getSupabase();
    if (!sb) {
      const arr = getState().notifications;
      const idx = arr.findIndex((n) => n.id === id);
      if (idx >= 0) {
        arr[idx] = { ...arr[idx], status: "enviado", sentAt: new Date().toISOString() };
      }
      return;
    }
    const existing = await notificationsDb.findById(id);
    if (!existing) return;
    const updated: Notification = {
      ...existing,
      status: "enviado",
      sentAt: new Date().toISOString(),
    };
    const { error } = await sb
      .from("notifications")
      .upsert({ id, data: updated });
    if (error) logDbError("notifications.markSent", error);
  },

  async markFailed(id: string, errorMsg: string): Promise<void> {
    const sb = getSupabase();
    if (!sb) {
      const arr = getState().notifications;
      const idx = arr.findIndex((n) => n.id === id);
      if (idx >= 0) {
        arr[idx] = {
          ...arr[idx],
          status: "fallido",
          attempts: arr[idx].attempts + 1,
          lastError: errorMsg,
        };
      }
      return;
    }
    const existing = await notificationsDb.findById(id);
    if (!existing) return;
    const updated: Notification = {
      ...existing,
      status: "fallido",
      attempts: existing.attempts + 1,
      lastError: errorMsg,
    };
    const { error } = await sb
      .from("notifications")
      .upsert({ id, data: updated });
    if (error) logDbError("notifications.markFailed", error);
  },
};

// ============================================================================
// PAYMENT METHODS — config estática (in-memory siempre, contrato async)
// ============================================================================

export const paymentMethodsDb = {
  async list(): Promise<PaymentMethod[]> {
    seedIfNeeded();
    return Array.from(getState().paymentMethods.values()).filter((p) => p.enabled);
  },
  async listByCountry(country: User["country"]): Promise<PaymentMethod[]> {
    const all = await paymentMethodsDb.list();
    return all.filter((p) => p.countries.includes(country));
  },
  async findById(id: string): Promise<PaymentMethod | undefined> {
    seedIfNeeded();
    return getState().paymentMethods.get(id);
  },
};

// ============================================================================
// SESSIONS (NextAuth maneja JWT; esto es demo/audit — in-memory, contrato async)
// ============================================================================

export const sessionsDb = {
  async create(s: SessionRecord): Promise<SessionRecord> {
    getState().sessions.set(s.id, s);
    return s;
  },
  async findById(id: string): Promise<SessionRecord | undefined> {
    return getState().sessions.get(id);
  },
  async listByUser(userId: string): Promise<SessionRecord[]> {
    return Array.from(getState().sessions.values()).filter(
      (s) => s.userId === userId,
    );
  },
  async invalidate(id: string): Promise<void> {
    getState().sessions.delete(id);
  },
};

// ============================================================================
// STOCK RESERVATIONS — stock en vivo con reserva temporal (TTL 2h)
// ============================================================================

export const RESERVATION_TTL_HOURS = 2;

function isActiveNow(r: StockReservation, nowMs: number = Date.now()): boolean {
  return r.status === "activa" && new Date(r.expiresAt).getTime() > nowMs;
}

/** Marca expiradas las reservas activas cuyo expiresAt ya pasó. */
async function sweepExpiredReservations(): Promise<void> {
  const sb = getSupabase();
  const nowIso = new Date().toISOString();
  if (!sb) {
    const now = Date.now();
    for (const [id, r] of getState().reservations) {
      if (r.status === "activa" && new Date(r.expiresAt).getTime() <= now) {
        getState().reservations.set(id, { ...r, status: "expirada" });
      }
    }
    return;
  }
  const { data, error } = await sb
    .from("reservations")
    .select("id, data")
    .eq("data->>status", "activa")
    .lt("data->>expiresAt", nowIso)
    .returns<{ id: string; data: StockReservation }[]>();
  if (error) {
    logDbError("reservations.sweep", error);
    return;
  }
  for (const row of data ?? []) {
    const { error: upErr } = await sb
      .from("reservations")
      .upsert({ id: row.id, data: { ...row.data, status: "expirada" } });
    if (upErr) logDbError("reservations.sweep.upsert", upErr);
  }
}

export const reservationsDb = {
  /** Reserva activa de un usuario para un producto (si existe). */
  async findActiveByUserProduct(
    userId: string,
    productId: string,
  ): Promise<StockReservation | undefined> {
    await sweepExpiredReservations();
    const sb = getSupabase();
    if (!sb) {
      for (const r of getState().reservations.values()) {
        if (isActiveNow(r) && r.userId === userId && r.productId === productId) {
          return r;
        }
      }
      return undefined;
    }
    const { data, error } = await sb
      .from("reservations")
      .select("data")
      .eq("id", `rsv-${userId}-${productId}`)
      .maybeSingle<DocRow<StockReservation>>();
    if (error) {
      logDbError("reservations.findActiveByUserProduct", error);
      return undefined;
    }
    const r = data?.data;
    return r && isActiveNow(r) ? r : undefined;
  },

  async listActiveByUser(userId: string): Promise<StockReservation[]> {
    await sweepExpiredReservations();
    const sb = getSupabase();
    if (!sb) {
      return Array.from(getState().reservations.values()).filter(
        (r) => isActiveNow(r) && r.userId === userId,
      );
    }
    const { data, error } = await sb
      .from("reservations")
      .select("data")
      .eq("data->>status", "activa")
      .eq("data->>userId", userId)
      .returns<DocRow<StockReservation>[]>();
    if (error) {
      logDbError("reservations.listActiveByUser", error);
      return [];
    }
    return (data ?? []).map((r) => r.data).filter((r) => isActiveNow(r));
  },

  /**
   * Crea o actualiza (upsert) la reserva del usuario para un producto.
   * quantity <= 0 libera la reserva. Renueva el TTL en cada cambio.
   */
  async upsert(
    userId: string,
    productId: string,
    quantity: number,
    unit: string,
  ): Promise<StockReservation | null> {
    const existing = await reservationsDb.findActiveByUserProduct(
      userId,
      productId,
    );
    const sb = getSupabase();
    if (quantity <= 0) {
      if (existing) {
        const released = { ...existing, status: "liberada" as const };
        if (!sb) {
          getState().reservations.set(existing.id, released);
        } else {
          const { error } = await sb
            .from("reservations")
            .upsert({ id: existing.id, data: released });
          if (error) logDbError("reservations.release", error);
        }
      }
      return null;
    }
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + RESERVATION_TTL_HOURS * 3600_000,
    ).toISOString();
    const r: StockReservation = existing
      ? { ...existing, quantity, unit, expiresAt }
      : {
          id: `rsv-${userId}-${productId}`,
          productId,
          userId,
          quantity,
          unit,
          createdAt: now.toISOString(),
          expiresAt,
          status: "activa",
        };
    if (!sb) {
      getState().reservations.set(r.id, r);
      return r;
    }
    const { error } = await sb
      .from("reservations")
      .upsert({ id: r.id, data: r });
    if (error) {
      logDbError("reservations.upsert", error);
      return null;
    }
    return r;
  },

  /** Confirma la reserva del usuario al crear el pedido (deja de expirar). */
  async confirmByUserProduct(
    userId: string,
    productId: string,
    orderId: string,
  ): Promise<void> {
    const r = await reservationsDb.findActiveByUserProduct(userId, productId);
    if (!r) return;
    const confirmed = { ...r, status: "confirmada" as const, orderId };
    const sb = getSupabase();
    if (!sb) {
      getState().reservations.set(r.id, confirmed);
      return;
    }
    const { error } = await sb
      .from("reservations")
      .upsert({ id: r.id, data: confirmed });
    if (error) logDbError("reservations.confirm", error);
  },

  /** Libera todas las reservas activas de un usuario (ej. carrito vaciado). */
  async releaseAllByUser(userId: string): Promise<void> {
    const active = await reservationsDb.listActiveByUser(userId);
    const sb = getSupabase();
    for (const r of active) {
      const released = { ...r, status: "liberada" as const };
      if (!sb) {
        getState().reservations.set(r.id, released);
      } else {
        const { error } = await sb
          .from("reservations")
          .upsert({ id: r.id, data: released });
        if (error) logDbError("reservations.releaseAll", error);
      }
    }
  },

  /** Cantidad total reservada (activa, no expirada) para un producto. */
  async getReservedQuantity(productId: string): Promise<number> {
    const sb = getSupabase();
    if (!sb) {
      await sweepExpiredReservations();
      let total = 0;
      for (const r of getState().reservations.values()) {
        if (isActiveNow(r) && r.productId === productId) total += r.quantity;
      }
      return total;
    }
    // No hace falta sweep aquí: filtramos por expiresAt client-side.
    const { data, error } = await sb
      .from("reservations")
      .select("data")
      .eq("data->>status", "activa")
      .eq("data->>productId", productId)
      .returns<DocRow<StockReservation>[]>();
    if (error) {
      logDbError("reservations.getReservedQuantity", error);
      return 0;
    }
    let total = 0;
    for (const row of data ?? []) {
      if (isActiveNow(row.data)) total += row.data.quantity;
    }
    return total;
  },
};

// ============================================================================
// STOCK — ventas confirmadas + stock efectivo
// ============================================================================

export const stockDb = {
  /** Unidades ya vendidas (pedidos confirmados) de un producto. */
  async getSold(productId: string): Promise<number> {
    const sb = getSupabase();
    if (!sb) return getState().stockSold.get(productId) ?? 0;
    const { data, error } = await sb
      .from("stock_sold")
      .select("sold")
      .eq("product_id", productId)
      .maybeSingle<{ sold: number | string }>();
    if (error) {
      logDbError("stock.getSold", error);
      return 0;
    }
    return data ? Number(data.sold) || 0 : 0;
  },

  /** Registra unidades vendidas al confirmar un pedido. */
  async addSold(productId: string, quantity: number): Promise<void> {
    const sb = getSupabase();
    if (!sb) {
      const current = getState().stockSold.get(productId) ?? 0;
      getState().stockSold.set(productId, current + quantity);
      return;
    }
    // leer + sumar + upsert (suficiente para el demo)
    const current = await stockDb.getSold(productId);
    const { error } = await sb
      .from("stock_sold")
      .upsert({ product_id: productId, sold: current + quantity });
    if (error) logDbError("stock.addSold", error);
  },

  /**
   * Stock efectivo = stock base − vendido − reservado activo.
   * El caller provee el stock base (products.ts o lot.quantity).
   */
  async getEffective(productId: string, baseStock: number): Promise<number> {
    const [sold, reserved] = await Promise.all([
      stockDb.getSold(productId),
      reservationsDb.getReservedQuantity(productId),
    ]);
    return Math.max(0, baseStock - sold - reserved);
  },
};

// ============================================================================
// COUPONS — cupones de descuento
// ============================================================================

export const couponsDb = {
  async findByCode(code: string): Promise<Coupon | undefined> {
    const normalized = code.trim().toUpperCase();
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return getState().coupons.get(normalized);
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("coupons")
      .select("data")
      .eq("code", normalized)
      .maybeSingle<DocRow<Coupon>>();
    if (error) {
      logDbError("coupons.findByCode", error);
      return undefined;
    }
    return data?.data;
  },

  async list(): Promise<Coupon[]> {
    const sb = getSupabase();
    if (!sb) {
      seedIfNeeded();
      return Array.from(getState().coupons.values());
    }
    await ensureSeeded(sb);
    const { data, error } = await sb
      .from("coupons")
      .select("data")
      .returns<DocRow<Coupon>[]>();
    if (error) {
      logDbError("coupons.list", error);
      return [];
    }
    return (data ?? []).map((r) => r.data);
  },

  async incrementUse(code: string): Promise<void> {
    const c = await couponsDb.findByCode(code);
    if (!c) return;
    const updated = { ...c, usedCount: c.usedCount + 1 };
    const sb = getSupabase();
    if (!sb) {
      getState().coupons.set(c.code, updated);
      return;
    }
    const { error } = await sb
      .from("coupons")
      .upsert({ code: c.code, data: updated });
    if (error) logDbError("coupons.incrementUse", error);
  },
};

// ============================================================================
// MESSAGES — chat por pedido (tabla con columnas reales, no jsonb)
// ============================================================================

interface MessageRow {
  id: string;
  order_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  body: string;
  created_at: string;
}

function rowToChatMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    orderId: row.order_id,
    senderId: row.sender_id,
    senderName: row.sender_name,
    senderRole: row.sender_role as UserRole,
    body: row.body,
    createdAt: row.created_at,
  };
}

export const messagesDb = {
  /** Mensajes de un pedido, ordenados ascendente (los `limit` más recientes). */
  async listByOrder(orderId: string, limit = 100): Promise<ChatMessage[]> {
    const sb = getSupabase();
    if (!sb) {
      const all = getState().messages.get(orderId) ?? [];
      return all.slice(-limit);
    }
    const { data, error } = await sb
      .from("messages")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<MessageRow[]>();
    if (error) {
      logDbError("messages.listByOrder", error);
      return [];
    }
    return (data ?? []).map(rowToChatMessage).reverse();
  },

  async add(msg: {
    orderId: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    body: string;
  }): Promise<ChatMessage> {
    const sb = getSupabase();
    if (!sb) {
      const entry: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        orderId: msg.orderId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        body: msg.body,
        createdAt: new Date().toISOString(),
      };
      const arr = getState().messages.get(msg.orderId) ?? [];
      arr.push(entry);
      getState().messages.set(msg.orderId, arr);
      return entry;
    }
    const { data, error } = await sb
      .from("messages")
      .insert({
        order_id: msg.orderId,
        sender_id: msg.senderId,
        sender_name: msg.senderName,
        sender_role: msg.senderRole,
        body: msg.body,
      })
      .select("*")
      .single<MessageRow>();
    if (error || !data) {
      logDbError("messages.add", error ?? "no data returned");
      // devolver un mensaje efímero para no romper la UX del chat
      return {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        orderId: msg.orderId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        body: msg.body,
        createdAt: new Date().toISOString(),
      };
    }
    return rowToChatMessage(data);
  },
};
