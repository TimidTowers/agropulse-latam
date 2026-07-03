/**
 * POST /api/auth/2fa/setup
 * Genera un secreto TOTP nuevo (no activado todavía) y devuelve la otpauth URL
 * + un QR data URL. El secret se guarda en User.twoFactorSecret pero
 * twoFactorEnabled queda en false hasta que /verify lo confirme.
 */
import { NextResponse } from "next/server";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";
import { getCurrentUser } from "@/lib/auth-helpers";
import { usersDb } from "@/lib/db/store";

export async function POST() {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const secret = generateSecret();
  const otpauth = generateURI({
    issuer: "AgroPulse",
    label: me.email,
    secret,
  });
  const qrDataUrl = await QRCode.toDataURL(otpauth, { margin: 1, width: 240 });

  // Guardar secret pero NO activar todavía
  await usersDb.update(me.id, { twoFactorSecret: secret, twoFactorEnabled: false });

  return NextResponse.json({ ok: true, secret, otpauth, qr: qrDataUrl });
}
