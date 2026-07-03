/**
 * GET    /api/lots/[id]   — público si activo, owner/admin si no
 * PATCH  /api/lots/[id]   — dueño o admin
 * DELETE /api/lots/[id]   — admin (soft delete: status=retirado)
 */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { lotsDb, auditDb } from "@/lib/db/store";
import { getCountry } from "@/lib/countries";
import type { Lot } from "@/lib/db/types";

const patchSchema = z.object({
  productName: z.string().min(3).optional(),
  productSlug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  category: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  quantity: z.coerce.number().positive().optional(),
  unit: z.string().min(1).optional(),
  pricePerUnit: z.coerce.number().positive().optional(),
  harvestDate: z.string().min(1).optional(),
  vidaUtilDias: z.coerce.number().int().positive().max(365).optional(),
  certifications: z.array(z.string()).optional(),
  description: z.string().min(50).optional(),
  imageUrl: z.string().url().or(z.literal("")).optional(),
  status: z
    .enum(["borrador", "activo", "agotado", "expirado", "retirado"])
    .optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const lot = await lotsDb.findById(id);
  if (!lot) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (lot.status !== "activo") {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    if (session.user.id !== lot.productorId && session.user.role !== "admin") {
      return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
  }
  return Response.json({ ok: true, lot });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lot = await lotsDb.findById(id);
  if (!lot) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (session.user.role !== "admin" && session.user.id !== lot.productorId) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const countryDef = getCountry(lot.country);
  const patch: Partial<Lot> = {};
  if (data.productName !== undefined) patch.productName = data.productName;
  if (data.productSlug !== undefined) patch.productSlug = data.productSlug;
  if (data.category !== undefined) patch.category = data.category;
  if (data.region !== undefined) patch.region = data.region;
  if (data.quantity !== undefined) patch.quantity = data.quantity;
  if (data.unit !== undefined) patch.unit = data.unit;
  if (data.pricePerUnit !== undefined) {
    patch.pricePerUnit = data.pricePerUnit;
    patch.currency = countryDef.currency;
  }
  if (data.harvestDate !== undefined) {
    patch.harvestDate = new Date(data.harvestDate).toISOString();
  }
  if (data.harvestDate !== undefined || data.vidaUtilDias !== undefined) {
    const baseHarvest = data.harvestDate
      ? new Date(data.harvestDate).getTime()
      : new Date(lot.harvestDate).getTime();
    const daysShelf =
      data.vidaUtilDias ??
      Math.max(
        1,
        Math.round(
          (new Date(lot.expirationDate).getTime() -
            new Date(lot.harvestDate).getTime()) /
            86_400_000,
        ),
      );
    patch.expirationDate = new Date(
      baseHarvest + daysShelf * 86_400_000,
    ).toISOString();
    const daysUntil = Math.floor(
      (new Date(patch.expirationDate).getTime() - Date.now()) / 86_400_000,
    );
    patch.urgencia =
      daysUntil < 7 ? "alta" : daysUntil < 21 ? "media" : "baja";
  }
  if (data.certifications !== undefined)
    patch.certifications = data.certifications;
  if (data.description !== undefined) patch.description = data.description;
  if (data.imageUrl !== undefined) {
    patch.images = data.imageUrl ? [data.imageUrl] : [];
  }
  if (data.status !== undefined) patch.status = data.status;

  const updated = await lotsDb.update(id, patch);
  await auditDb.add({
    userId: session.user.id,
    userEmail: session.user.email,
    userRole: session.user.role,
    action: "lot.update",
    resource: id,
    success: true,
    message: `Lote actualizado: ${updated?.productName ?? id}`,
    metadata: { patch: Object.keys(patch) },
  });
  return Response.json({ ok: true, lot: updated });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const lot = await lotsDb.findById(id);
  if (!lot) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  await lotsDb.update(id, { status: "retirado" });
  await auditDb.add({
    userId: session.user.id,
    userEmail: session.user.email,
    userRole: "admin",
    action: "lot.retire",
    resource: id,
    success: true,
    message: `Lote retirado: ${lot.productName}`,
  });
  return Response.json({ ok: true });
}
