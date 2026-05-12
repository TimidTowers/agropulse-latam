import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — AgroPulse",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left: form */}
      <section className="flex flex-col p-6 sm:p-10">
        <Link href="/" aria-label="Inicio" className="self-start">
          <Logo />
        </Link>

        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              Bienvenido de vuelta
            </h1>
            <p className="mt-2 text-sm text-muted">
              Accede a tu panel o explora el marketplace.
            </p>
            <LoginForm />
            <p className="mt-8 text-xs text-muted text-center">
              ¿Eres nuevo en AgroPulse?{" "}
              <Link
                href="/planes"
                className="text-brand font-medium hover:underline"
              >
                Crea una cuenta
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted">
          © {new Date().getFullYear()} AgroPulse Technologies S.A. de C.V.
        </p>
      </section>

      {/* Right: visual */}
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
              Productores que ya transforman su operación
            </p>
            <p className="mt-6 text-3xl font-semibold tracking-tight leading-snug max-w-md">
              “Reducimos nuestras mermas de 18% a 7% en seis meses.”
            </p>
            <p className="mt-3 text-white/85 text-sm">
              Carolina Vázquez · Frutícola del Centro
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-md">
            <div>
              <p className="text-2xl font-semibold">500+</p>
              <p className="text-xs text-white/70">productores</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">12M</p>
              <p className="text-xs text-white/70">GMV USD</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">30%</p>
              <p className="text-xs text-white/70">menos mermas</p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
