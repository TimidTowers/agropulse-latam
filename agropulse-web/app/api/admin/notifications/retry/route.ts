/**
 * POST /api/admin/notifications/retry?id=...
 * Reintenta una notificación que está en estado fallido o deshabilitada.
 * (En modo demo, sólo marca como enviado si Resend está activo).
 */
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { notificationsDb } from "@/lib/db/store";
import { sendEmail, isEmailEnabled } from "@/lib/notifications/email";

export async function POST(req: Request) {
  try {
    await requireRole(["admin"]);
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id requerido" }, { status: 400 });
  }
  const all = await notificationsDb.list(500);
  const target = all.find((n) => n.id === id);
  if (!target) {
    return NextResponse.json({ ok: false, error: "Notificación no encontrada" }, { status: 404 });
  }
  if (target.channel === "email" && isEmailEnabled()) {
    const r = await sendEmail({
      to: target.to,
      subject: target.subject ?? "(reintento)",
      text: target.body,
      metadata: { retryOf: target.id },
    });
    return NextResponse.json({ ok: r.ok, retried: true });
  }
  return NextResponse.json({
    ok: true,
    retried: false,
    reason: target.channel === "email" ? "Resend no configurado" : "Canal sin handler de retry",
  });
}
