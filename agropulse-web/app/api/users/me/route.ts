/**
 * GET/PATCH /api/users/me
 * GET    → datos del perfil del usuario actual.
 * PATCH  → actualiza nombre, teléfono, dirección, cooperativa, hectáreas,
 *          marketingOptIn y/o cambia password (currentPassword + newPassword).
 */
import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { getCurrentUser } from "@/lib/auth-helpers";
import { usersDb, auditDb } from "@/lib/db/store";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/auth-schemas";
import { toPublicUser, type UserAddress } from "@/lib/db/types";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  return NextResponse.json({ ok: true, user: me });
}

export async function PATCH(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });

  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const fresh = usersDb.findById(me.id);
  if (!fresh) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  // Profile fields
  const profile = updateProfileSchema.safeParse(payload);
  if (!profile.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Datos inválidos",
        issues: profile.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const patch: Partial<typeof fresh> = {};
  if (profile.data.name !== undefined) patch.name = profile.data.name;
  if (profile.data.phone !== undefined) patch.phone = profile.data.phone;
  if (profile.data.cooperativa !== undefined && fresh.role === "productor") {
    patch.cooperativa = profile.data.cooperativa;
  }
  if (profile.data.hectareas !== undefined && fresh.role === "productor") {
    patch.hectareas = profile.data.hectareas;
  }
  if (profile.data.marketingOptIn !== undefined) {
    patch.marketingOptIn = profile.data.marketingOptIn;
  }
  if (profile.data.address) {
    const addr: UserAddress = {
      ...profile.data.address,
      line2: profile.data.address.line2 || undefined,
      country: fresh.country,
    };
    patch.address = addr;
  }

  // Password change (opcional, en el mismo PATCH)
  if (payload.newPassword || payload.currentPassword) {
    const pw = changePasswordSchema.safeParse(payload);
    if (!pw.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Contraseña inválida",
          issues: pw.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }
    const ok = await compare(pw.data.currentPassword, fresh.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Contraseña actual incorrecta" },
        { status: 400 },
      );
    }
    patch.passwordHash = await hash(pw.data.newPassword, 10);
  }

  const updated = usersDb.update(me.id, patch);
  if (!updated) {
    return NextResponse.json({ ok: false, error: "No se pudo actualizar" }, { status: 500 });
  }

  auditDb.add({
    userId: me.id,
    userEmail: me.email,
    userRole: me.role,
    action: "admin.user_update",
    success: true,
    message: `Perfil actualizado por ${me.email}`,
  });

  return NextResponse.json({ ok: true, user: toPublicUser(updated) });
}
