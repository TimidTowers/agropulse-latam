/**
 * WhatsApp service — scaffold para Twilio.
 *
 * Activable con TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_WHATSAPP_FROM.
 * Si no están set, encola la notificación con status='deshabilitado' (visible
 * en admin panel) y devuelve { ok:true, queued:true }.
 *
 * Para activar:
 *   1. Crear cuenta Twilio (free trial)
 *   2. Activar WhatsApp Sandbox
 *   3. Exportar las 3 envs anteriores
 */
import { notificationsDb } from "@/lib/db/store";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_WHATSAPP_FROM; // ej. "whatsapp:+14155238886"

export const WHATSAPP_ENABLED = Boolean(TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM);
/** Número oficial AgroPulse Costa Rica para recibir mensajes. */
export const AGROPULSE_WHATSAPP = "+506 8337 8828";

export interface WhatsAppMessage {
  to: string;
  body: string;
  templateId?: string;
  metadata?: Record<string, unknown>;
}

export interface WhatsAppResult {
  ok: boolean;
  id?: string;
  error?: string;
  queued?: boolean;
}

export async function sendWhatsApp(msg: WhatsAppMessage): Promise<WhatsAppResult> {
  if (!WHATSAPP_ENABLED) {
    const n = await notificationsDb.add({
      channel: "whatsapp",
      to: msg.to,
      body: msg.body,
      templateId: msg.templateId,
      status: "deshabilitado",
      attempts: 0,
      metadata: { ...msg.metadata, reason: "Twilio no configurado" },
    });
    return { ok: true, queued: true, id: n.id };
  }

  const n = await notificationsDb.add({
    channel: "whatsapp",
    to: msg.to,
    body: msg.body,
    templateId: msg.templateId,
    status: "pendiente",
    attempts: 0,
    metadata: msg.metadata,
  });

  try {
    // Twilio HTTP API directo (sin SDK para mantener bundle ligero)
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
    const body = new URLSearchParams({
      From: TWILIO_FROM!,
      To: msg.to.startsWith("whatsapp:") ? msg.to : `whatsapp:${msg.to}`,
      Body: msg.body,
    });
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (!res.ok) {
      const text = await res.text();
      await notificationsDb.markFailed(n.id, `${res.status} ${text}`);
      return { ok: false, error: `${res.status} ${text}` };
    }
    const data = (await res.json()) as { sid?: string };
    await notificationsDb.markSent(n.id);
    return { ok: true, id: data.sid };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    await notificationsDb.markFailed(n.id, message);
    return { ok: false, error: message };
  }
}

export function isWhatsAppEnabled(): boolean {
  return WHATSAPP_ENABLED;
}
