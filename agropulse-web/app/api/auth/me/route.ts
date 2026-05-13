/**
 * GET /api/auth/me
 * Devuelve el PublicUser del usuario actual. Útil para hooks cliente.
 */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false, user: null }, { status: 200 });
  return NextResponse.json({ ok: true, user: me });
}
