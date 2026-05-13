/**
 * Email service — Resend con fallback graceful.
 *
 * - Si RESEND_API_KEY está set, envía email real.
 * - Si no, guarda la notificación en la queue (notificationsDb) con
 *   status='deshabilitado' para que el admin la vea.
 *
 * Usar siempre via `sendEmail()` (no instanciar Resend directamente).
 */
import { Resend } from "resend";
import { notificationsDb } from "@/lib/db/store";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
/**
 * Sender. Sin verificación de dominio, debe ser onboarding@resend.dev.
 * Configurable vía EMAIL_FROM (ej. "AgroPulse <hola@agropulse.cr>")
 */
const EMAIL_FROM = process.env.EMAIL_FROM ?? "AgroPulse <onboarding@resend.dev>";
/**
 * Dirección a la que se envían los emails internos (contacto, alertas, etc).
 * El email "oficial" de AgroPulse para recepción.
 */
export const AGROPULSE_INBOX = process.env.AGROPULSE_INBOX ?? "sebastorresagropulse@gmail.com";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  /** template id opcional para audit log */
  templateId?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
  /** true cuando Resend no está configurado y el mensaje quedó en la queue */
  queued?: boolean;
}

/** Envía un email vía Resend, con fallback a queue local si no hay API key. */
export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  const recipient = Array.isArray(msg.to) ? msg.to.join(", ") : msg.to;

  // Si no hay Resend, encolar y reportar deshabilitado
  if (!resend) {
    const n = notificationsDb.add({
      channel: "email",
      to: recipient,
      subject: msg.subject,
      body: msg.text ?? msg.html ?? "",
      templateId: msg.templateId,
      status: "deshabilitado",
      attempts: 0,
      metadata: { ...msg.metadata, reason: "RESEND_API_KEY no configurada" },
    });
    return { ok: true, queued: true, id: n.id };
  }

  // Crear notificación pendiente
  const n = notificationsDb.add({
    channel: "email",
    to: recipient,
    subject: msg.subject,
    body: msg.text ?? msg.html ?? "",
    templateId: msg.templateId,
    status: "pendiente",
    attempts: 0,
    metadata: msg.metadata,
  });

  try {
    const res = await resend.emails.send({
      from: EMAIL_FROM,
      to: msg.to,
      subject: msg.subject,
      html: msg.html ?? `<p>${msg.text ?? ""}</p>`,
      text: msg.text,
    });
    if (res.error) {
      notificationsDb.markFailed(n.id, res.error.message ?? "Resend error");
      return { ok: false, error: res.error.message };
    }
    notificationsDb.markSent(n.id);
    return { ok: true, id: res.data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    notificationsDb.markFailed(n.id, message);
    return { ok: false, error: message };
  }
}

/** ¿Está Resend activo? Útil para mostrar badges en admin panel. */
export function isEmailEnabled(): boolean {
  return Boolean(RESEND_API_KEY);
}
