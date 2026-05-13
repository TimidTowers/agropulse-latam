import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Crear cuenta — AgroPulse",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      <section className="flex flex-col p-6 sm:p-10">
        <Link href="/" aria-label="Inicio" className="self-start">
          <Logo />
        </Link>
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-xl">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              Crea tu cuenta en AgroPulse
            </h1>
            <p className="mt-2 text-sm text-muted">
              Únete a la red AgriTech LATAM. Sin tarjeta, sin compromiso.
            </p>
            <SignupForm />
            <p className="mt-6 text-xs text-muted text-center">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-brand font-medium hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} AgroPulse Technologies S.A. de C.V.
        </p>
      </section>

      <aside className="hidden lg:block relative bg-brand-gradient overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, white 0%, transparent 40%), radial-gradient(circle at 70% 80%, white 0%, transparent 40%)",
          }}
        />
        <div className="relative h-full p-14 flex flex-col justify-between text-white">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/70">
              Tu cuenta en 60 segundos
            </p>
            <p className="mt-6 text-3xl font-semibold tracking-tight leading-snug max-w-md">
              Cliente o productor, accedes al mismo ecosistema con
              trazabilidad punta a punta.
            </p>
            <p className="mt-3 text-white/85 text-sm">
              Plataforma activa en 10 países LATAM
            </p>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>✔ Marketplace B2B con 83 productos</li>
            <li>✔ IoT y analítica predictiva incluida</li>
            <li>✔ Pagos locales: SINPE, SPEI, PIX, PSE y +12</li>
            <li>✔ Soporte 2FA y cumplimiento GDPR-style</li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
