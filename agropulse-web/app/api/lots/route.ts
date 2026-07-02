/**
 * GET   /api/lots — lista filtrada (lots activos públicos sin auth)
 * POST  /api/lots — crea lote (rol productor o admin)
 */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { lotsDb, auditDb, usersDb } from "@/lib/db/store";
import { COUNTRIES, type CountryCode, getCountry } from "@/lib/countries";
import type { Lot, LotStatus } from "@/lib/db/types";
import { sendEmail, AGROPULSE_INBOX } from "@/lib/notifications/email";
import { resolveProductImage } from "@/lib/product-images";

const createLotSchema = z.object({
  productName: z.string().min(3),
  productSlug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/),
  category: z.string().min(1),
  region: z.string().min(1),
  quantity: z.coerce.number().positive(),
  unit: z.string().min(1),
  pricePerUnit: z.coerce.number().positive(),
  harvestDate: z.string().min(1),
  vidaUtilDias: z.coerce.number().int().positive().max(365),
  certifications: z.array(z.string()).default([]),
  description: z.string().min(50),
  imageUrl: z.string().url().or(z.literal("")),
  status: z.enum(["borrador", "activo"]),
});

const VALID_STATUS: LotStatus[] = [
  "borrador",
  "activo",
  "agotado",
  "expirado",
  "retirado",
];

function urgenciaFromShelf(daysUntilExpiry: number): Lot["urgencia"] {
  if (daysUntilExpiry < 7) return "alta";
  if (daysUntilExpiry < 21) return "media";
  return "baja";
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productorId = url.searchParams.get("productorId");
  const countryParam = url.searchParams.get("country");
  const statusParam = url.searchParams.get("status");
  const categoryParam = url.searchParams.get("category");

  let lots = lotsDb.listAll();

  if (productorId) lots = lots.filter((l) => l.productorId === productorId);
  if (countryParam && COUNTRIES.some((c) => c.code === countryParam)) {
    lots = lots.filter((l) => l.country === countryParam);
  }
  if (statusParam && VALID_STATUS.includes(statusParam as LotStatus)) {
    lots = lots.filter((l) => l.status === statusParam);
  } else {
    // si no se pide status específico → solo activos para no autenticados
    const session = await auth();
    if (!session?.user) lots = lots.filter((l) => l.status === "activo");
  }
  if (categoryParam) lots = lots.filter((l) => l.category === categoryParam);

  return Response.json({ ok: true, lots });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  if (session.user.role !== "productor" && session.user.role !== "admin") {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = createLotSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const user = usersDb.findById(session.user.id);
  if (!user) {
    return Response.json({ ok: false, error: "user_not_found" }, { status: 401 });
  }

  const country = user.country as CountryCode;
  const countryDef = getCountry(country);
  const id = `lot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const harvestDate = new Date(data.harvestDate).toISOString();
  const expirationDate = new Date(
    new Date(data.harvestDate).getTime() + data.vidaUtilDias * 86_400_000,
  ).toISOString();
  const daysUntil = Math.floor(
    (new Date(expirationDate).getTime() - Date.now()) / 86_400_000,
  );

  const lot: Lot = {
    id,
    productSlug: data.productSlug,
    productName: data.productName,
    category: data.category,
    productorId: user.id,
    productorName: user.name,
    cooperativa: user.cooperativa ?? "",
    country,
    region: data.region,
    quantity: data.quantity,
    unit: data.unit,
    pricePerUnit: data.pricePerUnit,
    currency: countryDef.currency,
    harvestDate,
    expirationDate,
    certifications: data.certifications,
    description: data.description,
    // Si el productor no aporta URL (o es inválida/vacía), se asigna la
    // imagen automática por nombre + categoría (lib/product-images.ts).
    images: [
      data.imageUrl && /^https?:\/\//i.test(data.imageUrl.trim())
        ? data.imageUrl.trim()
        : resolveProductImage(data.productName, data.category),
    ],
    status: data.status,
    urgencia: urgenciaFromShelf(daysUntil),
    createdAt: new Date().toISOString(),
    createdBy: user.id,
  };

  lotsDb.create(lot);

  auditDb.add({
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: "lot.create",
    resource: lot.id,
    success: true,
    message: `Lote creado: ${lot.productName} (${lot.quantity} ${lot.unit})`,
    metadata: { country, status: lot.status },
  });

  // Notificar al equipo admin
  await sendEmail({
    to: AGROPULSE_INBOX,
    subject: `Nuevo lote publicado — ${lot.productName}`,
    html: `
      <h1>Nuevo lote en AgroPulse</h1>
      <p>Productor: ${user.name} (${user.email})</p>
      <p>Producto: <strong>${lot.productName}</strong> · ${lot.category}</p>
      <p>Cantidad: ${lot.quantity} ${lot.unit} · Precio: ${lot.pricePerUnit} ${countryDef.currency}</p>
      <p>País: ${country} · Región: ${lot.region}</p>
    `,
    templateId: "lot.created",
    metadata: { lotId: lot.id },
  });

  return Response.json({ ok: true, lot }, { status: 201 });
}
