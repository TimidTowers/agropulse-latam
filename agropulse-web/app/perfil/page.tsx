import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";
import { sessionsDb } from "@/lib/db/store";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ProfileForm } from "./ProfileForm";
import { CurrencyPreference } from "@/components/perfil/CurrencyPreference";
import { getCountry } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Mi perfil — AgroPulse",
};

export default async function PerfilPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login?from=/perfil");
  const sessions = sessionsDb.listByUser(me.id);
  const country = getCountry(me.country);

  return (
    <main className="min-h-screen bg-background py-10">
      <Container>
        <header className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              Mi perfil
            </h1>
            <p className="mt-1 text-sm text-muted">
              {me.name} · {me.email} · {country.flag} {country.name}
            </p>
          </div>
          <Badge>
            {me.role === "admin" && "Administrador"}
            {me.role === "productor" && "Productor"}
            {me.role === "cliente" && "Cliente"}
            {me.role === "logistica" && "Logística"}
          </Badge>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ProfileForm user={me} />
            <CurrencyPreference
              userCountry={me.country}
              initialCurrency={me.preferredCurrency}
            />
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-ink">
                Autenticación en dos pasos
              </h2>
              <p className="mt-1 text-xs text-muted">
                {me.twoFactorEnabled
                  ? "Tu cuenta tiene 2FA activo. Cada inicio de sesión requerirá un código de 6 dígitos."
                  : "Refuerza tu cuenta con un código de 6 dígitos generado por una app autenticadora."}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {!me.twoFactorEnabled ? (
                  <Link
                    href="/2fa/setup"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-dark"
                  >
                    Activar 2FA
                  </Link>
                ) : (
                  <span className="rounded-lg bg-brand/10 text-brand text-xs font-medium text-center py-2">
                    2FA activo
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-ink">
                Sesiones activas
              </h2>
              <p className="mt-1 text-xs text-muted">
                Dispositivos donde tu cuenta está iniciada.
              </p>
              <ul className="mt-4 space-y-2 text-xs">
                {sessions.length === 0 && (
                  <li className="text-muted">
                    No hay sesiones registradas en este demo. Tu sesión actual
                    está gestionada por NextAuth JWT.
                  </li>
                )}
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-lg bg-surface-2 px-3 py-2"
                  >
                    <p className="font-medium text-ink">
                      {s.userAgent ?? "Dispositivo desconocido"}
                    </p>
                    <p className="text-muted">
                      Iniciada {new Date(s.createdAt).toLocaleString("es-CR")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm text-xs text-muted">
              <p>
                <strong>Privacidad:</strong> AgroPulse protege tus datos según
                nuestra{" "}
                <Link
                  href="/legal/privacidad"
                  className="underline text-brand"
                >
                  política de privacidad
                </Link>
                . Podés solicitar la eliminación de tu cuenta al{" "}
                <a
                  href="mailto:sebastorresagropulse@gmail.com"
                  className="underline"
                >
                  DPO
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
