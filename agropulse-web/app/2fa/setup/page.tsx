import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";
import { TwoFactorSetupClient } from "./TwoFactorSetupClient";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Configurar 2FA — AgroPulse",
};

export default async function Setup2FAPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login?from=/2fa/setup");
  return (
    <main className="min-h-screen bg-background py-12">
      <Container>
        <div className="max-w-xl mx-auto">
          <Link href="/perfil" className="text-xs text-brand hover:underline">
            ← Volver al perfil
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
            Configurar autenticación en dos pasos
          </h1>
          <p className="mt-2 text-sm text-muted">
            Vincula AgroPulse con tu app autenticadora (Google Authenticator,
            Authy o 1Password). Después de escanear el QR, ingresá el código
            de 6 dígitos para activar.
          </p>
          <TwoFactorSetupClient userEmail={me.email} />
        </div>
      </Container>
    </main>
  );
}
