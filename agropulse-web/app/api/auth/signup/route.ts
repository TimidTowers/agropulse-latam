/**
 * POST /api/auth/signup
 * Crea un usuario nuevo (rol cliente o productor). Hashea password con bcrypt,
 * genera audit log, envía email de bienvenida (Resend o queue).
 */
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { signupSchema } from "@/lib/auth-schemas";
import { usersDb, auditDb } from "@/lib/db/store";
import { sendEmail } from "@/lib/notifications/email";
import { welcomeEmail } from "@/lib/notifications/templates";
import type { User, UserAddress } from "@/lib/db/types";
import type { CountryCode } from "@/lib/countries";
import { getCountry } from "@/lib/countries";

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cuerpo JSON inválido" },
      { status: 400 },
    );
  }

  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Datos inválidos",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const email = d.email.trim().toLowerCase();

  if (usersDb.findByEmail(email)) {
    auditDb.add({
      userEmail: email,
      action: "auth.login_failed",
      success: false,
      message: `Intento de registro con email ya existente: ${email}`,
    });
    return NextResponse.json(
      { ok: false, error: "Ya existe una cuenta con ese correo" },
      { status: 409 },
    );
  }

  const passwordHash = await hash(d.password, 10);
  const country = d.country as CountryCode;
  const address: UserAddress = {
    line1: d.address.line1.trim(),
    line2: d.address.line2 ? d.address.line2.trim() : undefined,
    city: d.address.city.trim(),
    state: d.address.state.trim(),
    postalCode: d.address.postalCode.trim(),
    country,
  };

  const user: User = {
    id: genId(d.role === "productor" ? "u-prod" : "u-cli"),
    email,
    passwordHash,
    name: d.name.trim(),
    role: d.role,
    country,
    phone: d.phone.trim(),
    address,
    cooperativa: d.role === "productor" ? d.cooperativa?.trim() : undefined,
    hectareas: d.role === "productor" ? d.hectareas : undefined,
    twoFactorEnabled: false,
    emailVerified: false,
    marketingOptIn: Boolean(d.marketingOptIn),
    createdAt: new Date().toISOString(),
  };

  usersDb.create(user);

  auditDb.add({
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: "auth.signup",
    success: true,
    message: `Nuevo registro (${user.role}) desde ${getCountry(country).name}`,
    metadata: { country, role: user.role },
  });

  // Email de bienvenida (queue si no hay Resend)
  const welcome = welcomeEmail({
    name: user.name,
    role: user.role,
    country,
  });
  void sendEmail({
    to: user.email,
    subject: welcome.subject,
    html: welcome.html,
    text: welcome.text,
    templateId: "auth.welcome",
    metadata: { userId: user.id, kind: "welcome" },
  });

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      country: user.country,
    },
  });
}
