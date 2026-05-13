/**
 * AgroPulse — In-memory data store (demo persistence).
 *
 * Design notes:
 * - Single source of truth en runtime. Cada serverless function tiene su propia
 *   instancia; en dev sobrevive HMR via globalThis.
 * - Para producción real, swap implementations a Supabase/Postgres manteniendo
 *   la misma API pública.
 * - Lecturas y escrituras síncronas (in-memory). Las acciones async expuestas
 *   son por compatibilidad futura.
 */
import { SEED_USERS, SEED_PAYMENT_METHODS } from "./seed";
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
} from "./types";
import { toPublicUser } from "./types";

// ============================================================================
// STATE — globalThis-backed para sobrevivir HMR en dev
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
      seeded: false,
    };
  }
  return globalThis.__agropulseState;
}

function seedIfNeeded(): void {
  const s = getState();
  if (s.seeded) return;
  for (const u of SEED_USERS) s.users.set(u.id, u);
  for (const pm of SEED_PAYMENT_METHODS) s.paymentMethods.set(pm.id, pm);
  s.seeded = true;
}

// ============================================================================
// USERS
// ============================================================================

export const usersDb = {
  findById(id: string): User | undefined {
    seedIfNeeded();
    return getState().users.get(id);
  },
  findByEmail(email: string): User | undefined {
    seedIfNeeded();
    const normalized = email.trim().toLowerCase();
    for (const u of getState().users.values()) {
      if (u.email.toLowerCase() === normalized) return u;
    }
    return undefined;
  },
  list(): User[] {
    seedIfNeeded();
    return Array.from(getState().users.values());
  },
  listPublic(): PublicUser[] {
    return this.list().map(toPublicUser);
  },
  create(user: User): User {
    seedIfNeeded();
    getState().users.set(user.id, user);
    return user;
  },
  update(id: string, patch: Partial<User>): User | undefined {
    seedIfNeeded();
    const existing = getState().users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    getState().users.set(id, updated);
    return updated;
  },
  delete(id: string): boolean {
    seedIfNeeded();
    return getState().users.delete(id);
  },
  count(): number {
    seedIfNeeded();
    return getState().users.size;
  },
};

// ============================================================================
// AUTH ATTEMPTS — rate limiting (5 intentos, lockout 15 min)
// ============================================================================

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export const authAttemptsDb = {
  get(email: string): AuthAttempt | undefined {
    return getState().authAttempts.get(email.toLowerCase());
  },
  isLocked(email: string): { locked: boolean; until?: string } {
    const a = this.get(email);
    if (!a?.lockedUntil) return { locked: false };
    const until = new Date(a.lockedUntil).getTime();
    if (until > Date.now()) return { locked: true, until: a.lockedUntil };
    // expired lockout — reset
    getState().authAttempts.delete(email.toLowerCase());
    return { locked: false };
  },
  registerFailure(email: string): { attempts: number; locked: boolean; until?: string } {
    const key = email.toLowerCase();
    const now = new Date().toISOString();
    const current = getState().authAttempts.get(key);
    const attempts = (current?.attempts ?? 0) + 1;
    const shouldLock = attempts >= MAX_LOGIN_ATTEMPTS;
    const until = shouldLock
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
      : undefined;
    getState().authAttempts.set(key, {
      email: key,
      attempts,
      lastAttemptAt: now,
      lockedUntil: until,
    });
    return { attempts, locked: shouldLock, until };
  },
  reset(email: string): void {
    getState().authAttempts.delete(email.toLowerCase());
  },
};

// ============================================================================
// ORDERS
// ============================================================================

export const ordersDb = {
  findById(id: string): OrderExtended | undefined {
    return getState().orders.get(id);
  },
  findByShortCode(code: string): OrderExtended | undefined {
    for (const o of getState().orders.values()) {
      if (o.shortCode === code) return o;
    }
    return undefined;
  },
  listByCustomer(customerId: string): OrderExtended[] {
    return Array.from(getState().orders.values()).filter(
      (o) => o.customerId === customerId,
    );
  },
  listByProductor(productorId: string): OrderExtended[] {
    return Array.from(getState().orders.values()).filter((o) =>
      o.items.some((i) => i.productorId === productorId),
    );
  },
  listByLogistica(logisticaUserId: string): OrderExtended[] {
    return Array.from(getState().orders.values()).filter(
      (o) => o.logisticaUserId === logisticaUserId,
    );
  },
  listAll(): OrderExtended[] {
    return Array.from(getState().orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
  create(order: OrderExtended): OrderExtended {
    getState().orders.set(order.id, order);
    return order;
  },
  updateStatus(
    id: string,
    status: OrderStatus,
    note?: string,
    by?: string,
    byRole?: User["role"],
  ): OrderExtended | undefined {
    const o = getState().orders.get(id);
    if (!o) return undefined;
    const updated: OrderExtended = {
      ...o,
      status,
      statusHistory: [
        ...o.statusHistory,
        { status, timestamp: new Date().toISOString(), note, by, byRole },
      ],
    };
    getState().orders.set(id, updated);
    return updated;
  },
  update(id: string, patch: Partial<OrderExtended>): OrderExtended | undefined {
    const existing = getState().orders.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    getState().orders.set(id, updated);
    return updated;
  },
  count(): number {
    return getState().orders.size;
  },
};

// ============================================================================
// LOTS — productores crean lotes nuevos
// ============================================================================

export const lotsDb = {
  findById(id: string): Lot | undefined {
    return getState().lots.get(id);
  },
  listByProductor(productorId: string): Lot[] {
    return Array.from(getState().lots.values())
      .filter((l) => l.productorId === productorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  listAll(): Lot[] {
    return Array.from(getState().lots.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
  listActive(country?: User["country"]): Lot[] {
    return this.listAll().filter(
      (l) => l.status === "activo" && (!country || l.country === country),
    );
  },
  create(lot: Lot): Lot {
    getState().lots.set(lot.id, lot);
    return lot;
  },
  update(id: string, patch: Partial<Lot>): Lot | undefined {
    const existing = getState().lots.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    getState().lots.set(id, updated);
    return updated;
  },
  delete(id: string): boolean {
    return getState().lots.delete(id);
  },
};

// ============================================================================
// AUDIT LOG
// ============================================================================

export const auditDb = {
  list(limit = 100): AuditLog[] {
    const all = getState().auditLogs;
    return all.slice(-limit).reverse();
  },
  listByUser(userId: string, limit = 50): AuditLog[] {
    return getState()
      .auditLogs.filter((l) => l.userId === userId)
      .slice(-limit)
      .reverse();
  },
  listByAction(action: AuditLog["action"], limit = 50): AuditLog[] {
    return getState()
      .auditLogs.filter((l) => l.action === action)
      .slice(-limit)
      .reverse();
  },
  add(log: Omit<AuditLog, "id" | "timestamp"> & { id?: string; timestamp?: string }): AuditLog {
    const entry: AuditLog = {
      id: log.id ?? `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: log.timestamp ?? new Date().toISOString(),
      ...log,
    };
    getState().auditLogs.push(entry);
    // keep last 1000 in memory
    if (getState().auditLogs.length > 1000) {
      getState().auditLogs = getState().auditLogs.slice(-1000);
    }
    return entry;
  },
  count(): number {
    return getState().auditLogs.length;
  },
};

// ============================================================================
// NOTIFICATIONS — email/whatsapp queue
// ============================================================================

export const notificationsDb = {
  list(limit = 100): Notification[] {
    return getState().notifications.slice(-limit).reverse();
  },
  add(n: Omit<Notification, "id" | "createdAt"> & { id?: string }): Notification {
    const entry: Notification = {
      id: n.id ?? `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...n,
    };
    getState().notifications.push(entry);
    if (getState().notifications.length > 500) {
      getState().notifications = getState().notifications.slice(-500);
    }
    return entry;
  },
  markSent(id: string): void {
    const arr = getState().notifications;
    const idx = arr.findIndex((n) => n.id === id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], status: "enviado", sentAt: new Date().toISOString() };
    }
  },
  markFailed(id: string, error: string): void {
    const arr = getState().notifications;
    const idx = arr.findIndex((n) => n.id === id);
    if (idx >= 0) {
      arr[idx] = {
        ...arr[idx],
        status: "fallido",
        attempts: arr[idx].attempts + 1,
        lastError: error,
      };
    }
  },
};

// ============================================================================
// PAYMENT METHODS
// ============================================================================

export const paymentMethodsDb = {
  list(): PaymentMethod[] {
    seedIfNeeded();
    return Array.from(getState().paymentMethods.values()).filter((p) => p.enabled);
  },
  listByCountry(country: User["country"]): PaymentMethod[] {
    return this.list().filter((p) => p.countries.includes(country));
  },
  findById(id: string): PaymentMethod | undefined {
    seedIfNeeded();
    return getState().paymentMethods.get(id);
  },
};

// ============================================================================
// SESSIONS (NextAuth handles JWT itself; this is for audit/listing)
// ============================================================================

export const sessionsDb = {
  create(s: SessionRecord): SessionRecord {
    getState().sessions.set(s.id, s);
    return s;
  },
  findById(id: string): SessionRecord | undefined {
    return getState().sessions.get(id);
  },
  listByUser(userId: string): SessionRecord[] {
    return Array.from(getState().sessions.values()).filter((s) => s.userId === userId);
  },
  invalidate(id: string): void {
    getState().sessions.delete(id);
  },
};
