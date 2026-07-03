/**
 * Helpers de autorización server-side. Otros subagentes importan desde aquí.
 *
 *  - getSession()      → Session | null
 *  - getCurrentUser()  → PublicUser | null (lee el user fresco de la store)
 *  - requireSession()  → throws si no hay sesión
 *  - requireRole(r)    → throws si el rol no coincide
 */
import { auth } from "./auth";
import { usersDb } from "./db/store";
import { toPublicUser, type PublicUser, type UserRole } from "./db/types";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const s = await auth();
  if (!s?.user?.id) return null;
  const u = await usersDb.findById(s.user.id);
  return u ? toPublicUser(u) : null;
}

export async function requireSession() {
  const s = await auth();
  if (!s?.user) throw new Error("UNAUTHENTICATED");
  return s.user;
}

export async function requireRole(roles: UserRole[]) {
  const s = await auth();
  if (!s?.user) throw new Error("UNAUTHENTICATED");
  if (!roles.includes(s.user.role)) throw new Error("FORBIDDEN");
  return s.user;
}

/** Verifica si el usuario actual completó el challenge 2FA en esta sesión. */
export async function has2FAConfirmed(): Promise<boolean> {
  // Implementado en lib/auth-2fa-session.ts vía cookie HTTP-only.
  // Esta función está reexportada para conveniencia; ver `is2faConfirmed`.
  const { is2faConfirmed } = await import("./auth-2fa-session");
  return is2faConfirmed();
}
