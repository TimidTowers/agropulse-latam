import type { NextRequest } from "next/server";

interface CreateOrderBody {
  productoId?: string;
  cantidad?: number;
  comprador?: string;
  notas?: string;
}

export async function POST(req: NextRequest) {
  let body: CreateOrderBody = {};
  try {
    body = (await req.json()) as CreateOrderBody;
  } catch {
    return Response.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!body.productoId || !body.cantidad || !body.comprador) {
    return Response.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  const orderId = `OR-${Math.floor(3300 + Math.random() * 9999)}`;
  return Response.json(
    {
      ok: true,
      order: {
        id: orderId,
        ...body,
        estado: "pendiente",
        creadoEn: new Date().toISOString(),
        comisionMxn: Math.round((body.cantidad ?? 0) * 0.04 * 18),
      },
      mensaje:
        "Pedido recibido. Te confirmaremos por email cuando el productor lo apruebe.",
    },
    { status: 201 },
  );
}
