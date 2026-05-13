/**
 * POST /api/auth/2fa/disable
 * Pide password + código TOTP, desactiva 2FA y borra el secret.
 */
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { verify as verifyOtp } from "otplib";
import { getCurrentUser } from "@/lib/auth-helpers";
import { usersDb, auditDb } from "@/lib/db/store";
import { twoFactorDisableSchema } from "@/lib/auth-schemas";
import { clear2faConfirmed } from "@/lib/auth-2fa-session";

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = twoFactorDisableSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos" },
      { status: 400 },
    );
  }

  const fresh = usersDb.findById(me.id);
  if (!fresh || !fresh.twoFactorSecret) {
    return NextResponse.json(
      { ok: false, error: "2FA no está activo" },
      { status: 400 },
    );
  }

  const pwOk = await compare(parsed.data.password, fresh.passwordHash);
  if (!pwOk) {
    return NextResponse.json(
      { ok: false, error: "Contraseña incorrecta" },
      { status: 400 },
    );
  }

  const codeRes = await verifyOtp({
    secret: fresh.twoFactorSecret,
    token: parsed.data.code,
  });
  if (!codeRes.valid) {
    return NextResponse.json(
      { ok: false, error: "Código incorrecto" },
      { status: 400 },
    );
  }

  usersDb.update(me.id, { twoFactorEnabled: false, twoFactorSecret: undefined });
  await clear2faConfirmed();

  auditDb.add({
    userId: me.id,
    userEmail: me.email,
    userRole: me.role,
    action: "auth.2fa_disabled",
    success: true,
    message: "2FA desactivado por el usuario",
  });

  return NextResponse.json({ ok: true });
}
