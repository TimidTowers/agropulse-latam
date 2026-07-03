/**
 * POST /api/auth/2fa/verify
 * Verifica un código TOTP. Tiene dos modos:
 *   - mode=activate: activa el 2FA (después del setup)
 *   - mode=challenge (default): marca la sesión con cookie 2FA OK
 */
import { NextResponse } from "next/server";
import { verify as verifyOtp } from "otplib";
import { getCurrentUser } from "@/lib/auth-helpers";
import { usersDb, auditDb } from "@/lib/db/store";
import { twoFactorVerifySchema } from "@/lib/auth-schemas";
import { mark2faConfirmed } from "@/lib/auth-2fa-session";

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

  const parsed = twoFactorVerifySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Código inválido (6 dígitos)" },
      { status: 400 },
    );
  }
  const { code } = parsed.data;
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "challenge";

  const fresh = await usersDb.findById(me.id);
  if (!fresh?.twoFactorSecret) {
    return NextResponse.json(
      { ok: false, error: "No hay 2FA configurado" },
      { status: 400 },
    );
  }

  const result = await verifyOtp({ secret: fresh.twoFactorSecret, token: code });
  if (!result.valid) {
    await auditDb.add({
      userId: me.id,
      userEmail: me.email,
      userRole: me.role,
      action: "auth.login_failed",
      success: false,
      message: `Código 2FA inválido (${mode})`,
    });
    return NextResponse.json(
      { ok: false, error: "Código incorrecto" },
      { status: 400 },
    );
  }

  if (mode === "activate") {
    await usersDb.update(me.id, { twoFactorEnabled: true });
    await auditDb.add({
      userId: me.id,
      userEmail: me.email,
      userRole: me.role,
      action: "auth.2fa_enabled",
      success: true,
      message: "2FA activado correctamente",
    });
  }

  await mark2faConfirmed(me.id);

  return NextResponse.json({ ok: true });
}
