import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth-helpers";
import { Container } from "@/components/ui/Container";
import { TwoFactorVerifyClient } from "./TwoFactorVerifyClient";

export const metadata: Metadata = {
  title: "Verificación 2FA — AgroPulse",
};

export default async function Verify2FAPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login?from=/2fa/verify");
  return (
    <main className="min-h-screen bg-background py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Verificación adicional
          </h1>
          <p className="mt-2 text-sm text-muted">
            Tu cuenta tiene autenticación en dos pasos activa. Ingresá el código
            de 6 dígitos de tu app autenticadora.
          </p>
          <Suspense>
            <TwoFactorVerifyClient />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
