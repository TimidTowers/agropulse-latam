/**
 * AgroPulse — Auth & business entity types
 * Shared contract used by all subagents (auth, cart, producer lots, logs, admin).
 * Keep this in sync with seed data and store.
 */
import type { CountryCode } from "@/lib/countries";
import type { CurrencyCode } from "@/lib/currency/rates";

// ============================================================================
// USERS & AUTH
// ============================================================================

export type UserRole = "admin" | "productor" | "cliente" | "logistica";

export interface UserAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: CountryCode;
}

export interface User {
  id: string;
  email: string;
  /** bcrypt hash — never expose to client */
  passwordHash: string;
  name: string;
  role: UserRole;
  country: CountryCode;
  phone?: string;
  address?: UserAddress;
  /** Producer-only fields */
  cooperativa?: string;
  hectareas?: number;
  /** Logistica-only fields */
  vehicleType?: string;
  licensePlate?: string;
  /** 2FA */
  twoFactorEnabled: boolean;
  /** base32 secret for TOTP */
  twoFactorSecret?: string;
  /** UI/email flags */
  emailVerified: boolean;
  marketingOptIn?: boolean;
  /**
   * Moneda preferida del usuario para visualización de precios.
   * Si no se define, se usa la moneda oficial del país (COUNTRY_TO_CURRENCY).
   */
  preferredCurrency?: CurrencyCode;
  /** timestamps */
  createdAt: string;
  lastLoginAt?: string;
}

/** Safe user shape (no password hash, no 2fa secret) — what we put in JWT / send to client */
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  country: CountryCode;
  phone?: string;
  address?: UserAddress;
  cooperativa?: string;
  hectareas?: number;
  twoFactorEnabled: boolean;
  preferredCurrency?: CurrencyCode;
}

export function toPublicUser(u: User): PublicUser {
  const {
    passwordHash: _ph,
    twoFactorSecret: _ts,
    emailVerified: _ev,
    marketingOptIn: _mo,
    createdAt: _ca,
    lastLoginAt: _ll,
    vehicleType: _vt,
    licensePlate: _lp,
    ...rest
  } = u;
  void _ph;
  void _ts;
  void _ev;
  void _mo;
  void _ca;
  void _ll;
  void _vt;
  void _lp;
  return rest;
}

// ============================================================================
// AUTH ATTEMPTS — rate limiting
// ============================================================================

export interface AuthAttempt {
  email: string;
  attempts: number;
  /** ISO timestamp until which the account is locked */
  lockedUntil?: string;
  lastAttemptAt: string;
}

// ============================================================================
// ORDERS — extended for checkout, tracking, payments
// ============================================================================

export type OrderStatus =
  | "recibido" // creado por el cliente
  | "confirmado_productor" // productor aceptó
  | "preparando" // productor empaca
  | "empacado" // listo para recoger
  | "en_transito" // logistica lo lleva
  | "ultima_milla" // último tramo
  | "entregado" // cliente lo recibió
  | "cancelado";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "recibido",
  "confirmado_productor",
  "preparando",
  "empacado",
  "en_transito",
  "ultima_milla",
  "entregado",
];

export interface OrderItem {
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  productorId: string;
  productorName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  /** quién hizo el cambio */
  by?: string;
  byRole?: UserRole;
}

export interface OrderExtended {
  id: string;
  /** human-readable code, ej. AP-2026-0001 */
  shortCode: string;
  customerId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: UserAddress;
    country: CountryCode;
  };
  items: OrderItem[];
  /** moneda del país del cliente */
  currency: string;
  subtotal: number;
  /** comisión 4% AgroPulse */
  commissionFee: number;
  shippingFee: number;
  total: number;
  paymentMethodId: string;
  paymentMethodLabel: string;
  paymentStatus: "pendiente" | "pagado" | "reembolsado";
  status: OrderStatus;
  statusHistory: OrderStatusHistoryEntry[];
  /** asignación logística */
  logisticaUserId?: string;
  /** número de seguimiento del transportista */
  trackingNumber?: string;
  /** estimación */
  estimatedDelivery: string;
  notes?: string;
  createdAt: string;
  country: CountryCode;
}

// ============================================================================
// LOTS — productor crea lotes
// ============================================================================

export type LotStatus = "borrador" | "activo" | "agotado" | "expirado" | "retirado";

export interface Lot {
  id: string;
  /** id del producto en catalog (puede ser nuevo lote de producto existente) */
  productId?: string;
  productSlug: string;
  productName: string;
  category: string;
  productorId: string;
  productorName: string;
  cooperativa: string;
  country: CountryCode;
  region: string;
  /** stock disponible */
  quantity: number;
  unit: string;
  pricePerUnit: number;
  currency: string;
  harvestDate: string;
  expirationDate: string;
  /** sensor IoT asignado al lote */
  sensorId?: string;
  certifications: string[];
  description: string;
  images: string[];
  status: LotStatus;
  urgencia: "alta" | "media" | "baja";
  createdAt: string;
  createdBy: string; // userId
}

// ============================================================================
// AUDIT LOG
// ============================================================================

export type AuditAction =
  | "auth.signup"
  | "auth.login"
  | "auth.login_failed"
  | "auth.logout"
  | "auth.2fa_enabled"
  | "auth.2fa_disabled"
  | "auth.locked"
  | "auth.access_denied"
  | "order.create"
  | "order.status_change"
  | "order.cancel"
  | "lot.create"
  | "lot.update"
  | "lot.retire"
  | "cart.add"
  | "cart.remove"
  | "contact.message"
  | "admin.user_update"
  | "admin.user_delete";

export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  userRole?: UserRole;
  action: AuditAction;
  resource?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  success: boolean;
  /** mensaje human-readable para el panel admin */
  message: string;
}

// ============================================================================
// NOTIFICATIONS — email / whatsapp queue
// ============================================================================

export type NotificationChannel = "email" | "whatsapp";
export type NotificationStatus = "pendiente" | "enviado" | "fallido" | "deshabilitado";

export interface Notification {
  id: string;
  channel: NotificationChannel;
  to: string;
  subject?: string;
  body: string;
  templateId?: string;
  status: NotificationStatus;
  attempts: number;
  lastError?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  sentAt?: string;
}

// ============================================================================
// PAYMENT METHODS — por país
// ============================================================================

export type PaymentMethodType =
  | "card"
  | "bank_transfer"
  | "mobile_money"
  | "cash"
  | "wallet"
  | "installments";

export interface PaymentMethod {
  id: string;
  name: string;
  /** ISO country codes that support this method */
  countries: CountryCode[];
  type: PaymentMethodType;
  /** lucide-react icon name o emoji */
  icon: string;
  description: string;
  /** comisión adicional % */
  feePct?: number;
  enabled: boolean;
}

// ============================================================================
// SESSIONS (simplified for demo — real auth uses JWT cookie)
// ============================================================================

export interface SessionRecord {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  userAgent?: string;
  ipAddress?: string;
}
