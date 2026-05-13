import type { NextRequest } from "next/server";
import { sendEmail, AGROPULSE_INBOX } from "@/lib/notifications/email";
import { contactNotificationEmail } from "@/lib/notifications/templates";
import { auditDb } from "@/lib/db/store";

interface ContactBody {
  nombre?: string;
  empresa?: string;
  email?: string;
  telefono?: string;
  rol?: string;
  hectareas?: string;
  asunto?: string;
  mensaje?: string;
}

export async function POST(req: NextRequest) {
  let body: ContactBody = {};
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return Response.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  // Basic validation
  if (!body.nombre || !body.email || !body.empresa || !body.mensaje) {
    return Response.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return Response.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }

  const tpl = contactNotificationEmail({
    fromName: body.nombre,
    fromEmail: body.email,
    phone: body.telefono,
    subject: body.asunto,
    message: body.mensaje,
    company: body.empresa,
    role: body.rol,
    hectareas: body.hectareas,
  });

  void sendEmail({
    to: AGROPULSE_INBOX,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    templateId: "contact.message",
    metadata: { fromEmail: body.email },
  });

  auditDb.add({
    userEmail: body.email,
    action: "contact.message",
    success: true,
    message: `Contacto desde sitio: ${body.nombre} (${body.empresa})`,
    metadata: { empresa: body.empresa, rol: body.rol },
  });

  return Response.json(
    {
      ok: true,
      mensaje:
        "Mensaje recibido. Te contactaremos en menos de 24h hábiles.",
      ticketId: `CT-${Date.now().toString(36).toUpperCase()}`,
    },
    { status: 200 },
  );
}
