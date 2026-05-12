import type { NextRequest } from "next/server";

interface ContactBody {
  nombre?: string;
  empresa?: string;
  email?: string;
  telefono?: string;
  rol?: string;
  hectareas?: string;
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

  // In a real app: send email via Resend / Postmark / etc., persist to DB.
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
