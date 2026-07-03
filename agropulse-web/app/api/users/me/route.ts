/**
 * GET/PATCH /api/users/me
 * GET    → datos del perfil del usuario actual.
 * PATCH  → actualiza nombre, teléfono, dirección, cooperativa, hectáreas,
 *          marketingOptIn, preferredCurrency, y/o cambia password
 *          (currentPassword + newPassword).
 */
import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth-helpers";
import { usersDb, auditDb } from "@/lib/db/store";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/auth-schemas";
import { toPublicUser, type UserAddress } from "@/lib/db/types";

const CURRENCY_CODES = [
  "USD",
  "MXN",
  "CRC",
  "COP",
  "ARS",
  "CLP",
  "PEN",
  "UYU",
  "GTQ",
  "BRL",
] as const;

const preferredCurrencySchema = z
  .object({
    preferredCurrency: z.enum(CURRENCY_CODES).optional(),
  })
  .passthrough();

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

  const fresh = await usersDb.findById(me.id);
  if (!fresh) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  // ---- moneda preferida (opcional) ------------------------------------
  const currencyParsed = preferredCurrencySchema.safeParse(payload);
  if (!currencyParsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Moneda inválida",
        issues: currencyParsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  // Si el cliente sólo manda preferredCurrency (sin otros campos), lo
  // aplicamos y devolvemos sin pasar por updateProfileSchema (ese schema
  // valida campos opcionales pero rechazaría payloads parciales por
  // extrañeza si tuvieran tipos malos en otros lados).
  const isCurrencyOnly =
    Object.keys(payload).length === 1 &&
    "preferredCurrency" in payload &&
    currencyParsed.data.preferredCurrency !== undefined;

  if (isCurrencyOnly) {
    const updated = await usersDb.update(me.id, {
      preferredCurrency: currencyParsed.data.preferredCurrency,
    });
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "No se pudo actualizar" },
        { status: 500 },
      );
    }
    await auditDb.add({
      userId: me.id,
      userEmail: me.email,
      userRole: me.role,
      action: "admin.user_update",
      success: true,
      message: `Preferencia de moneda → ${currencyParsed.data.preferredCurrency}`,
      metadata: { preferredCurrency: currencyParsed.data.preferredCurrency },
    });
    return NextResponse.json({ ok: true, user: toPublicUser(updated) });
  }

  // ---- resto del perfil (camino tradicional) ---------------------------
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

  // moneda preferida también puede venir junto a otros campos
  if (currencyParsed.data.preferredCurrency !== undefined) {
    patch.preferredCurrency = currencyParsed.data.preferredCurrency;
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

  const updated = await usersDb.update(me.id, patch);
  if (!updated) {
    return NextResponse.json({ ok: false, error: "No se pudo actualizar" }, { status: 500 });
  }

  await auditDb.add({
    userId: me.id,
    userEmail: me.email,
    userRole: me.role,
    action: "admin.user_update",
    success: true,
    message: `Perfil actualizado por ${me.email}`,
  });

  return NextResponse.json({ ok: true, user: toPublicUser(updated) });
}
