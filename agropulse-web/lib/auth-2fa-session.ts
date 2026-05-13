/**
 * Helper para marcar la sesión como "2FA confirmada" via cookie HTTP-only.
 * Se usa después de verificar correctamente el código TOTP.
 */
import { cookies } from "next/headers";

const COOKIE = "agropulse_2fa";

export async function mark2faConfirmed(userId: string) {
  const c = await cookies();
  c.set({
    name: COOKIE,
    value: `${userId}:ok`,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  });
}

export async function is2faConfirmed(userId?: string): Promise<boolean> {
  const c = await cookies();
  const val = c.get(COOKIE)?.value;
  if (!val) return false;
  if (!userId) return val.endsWith(":ok");
  return val === `${userId}:ok`;
}

export async function clear2faConfirmed() {
  const c = await cookies();
  c.delete(COOKIE);
}
