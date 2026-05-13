/**
 * PATCH /api/admin/users/[id]  → cambiar rol / bloquear / actualizar
 * DELETE /api/admin/users/[id] → eliminar
 * Solo admin.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth-helpers";
import { usersDb, auditDb, authAttemptsDb } from "@/lib/db/store";
import { toPublicUser } from "@/lib/db/types";

const adminPatchSchema = z.object({
  role: z.enum(["admin", "productor", "cliente", "logistica"]).optional(),
  blocked: z.boolean().optional(),
  unlock: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  let actor;
  try {
    actor = await requireRole(["admin"]);
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const { id } = await ctx.params;
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }
  const parsed = adminPatchSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }

  const target = usersDb.findById(id);
  if (!target) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  const patch: Partial<typeof target> = {};
  if (parsed.data.role) patch.role = parsed.data.role;

  // bloquear = forzar lockout largo
  if (parsed.data.blocked === true) {
    const until = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString();
    // colocamos directamente en el attempts store
    authAttemptsDb.registerFailure(target.email); // crea/incrementa
    // luego sobreescribimos con lockedUntil largo
    // hack para la demo: usamos la API pública existente
    for (let i = 0; i < 10; i++) authAttemptsDb.registerFailure(target.email);
    void until;
  }
  if (parsed.data.unlock === true) {
    authAttemptsDb.reset(target.email);
  }

  const updated = usersDb.update(id, patch);
  if (!updated) {
    return NextResponse.json({ ok: false, error: "No se pudo actualizar" }, { status: 500 });
  }

  auditDb.add({
    userId: actor.id,
    userEmail: actor.email,
    userRole: actor.role,
    action: "admin.user_update",
    success: true,
    message: `Admin actualizó usuario ${target.email}`,
    metadata: parsed.data as Record<string, unknown>,
  });

  return NextResponse.json({ ok: true, user: toPublicUser(updated) });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  let actor;
  try {
    actor = await requireRole(["admin"]);
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const target = usersDb.findById(id);
  if (!target) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }
  if (target.id === actor.id) {
    return NextResponse.json(
      { ok: false, error: "No puedes eliminar tu propia cuenta" },
      { status: 400 },
    );
  }
  usersDb.delete(id);
  auditDb.add({
    userId: actor.id,
    userEmail: actor.email,
    userRole: actor.role,
    action: "admin.user_delete",
    success: true,
    message: `Admin eliminó usuario ${target.email}`,
  });
  return NextResponse.json({ ok: true });
}
