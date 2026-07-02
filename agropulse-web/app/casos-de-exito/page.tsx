import type { Metadata } from "next";
import Link from "next/link";
import { Award, Globe, TrendingDown, BookOpen, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { buttonVariants } from "@/components/ui/Button";
import { COUNTRIES } from "@/lib/countries";
import {
  SUCCESS_CASES,
  averageMermaReduction,
  countCaseCountries,
} from "@/lib/mock-data/success-cases";
import { CasesGrid } from "@/components/casos/CasesGrid";

export const metadata: Metadata = {
  title: "Casos de éxito — AgroPulse",
  description:
    "30 historias reales de productores en 10 países LATAM que redujeron sus mermas post-cosecha y aumentaron sus ingresos con AgroPulse.",
};

export default function CasosDeExitoPage() {
  const totalCasos = SUCCESS_CASES.length;
  const totalPaises = countCaseCountries();
  const promedioMermas = averageMermaReduction();

  const stats = [
    {
      icon: BookOpen,
      value: `${totalCasos}`,
      label: "Casos documentados",
    },
    {
      icon: Globe,
      value: `${totalPaises}`,
      label: "Países LATAM",
    },
    {
      icon: TrendingDown,
      value: `-${promedioMermas}%`,
      label: "Reducción promedio de mermas",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="border-b border-border-soft bg-surface relative overflow-hidden">
          <div
            className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, #15803D 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <Container className="relative py-16">
            <Reveal>
              <Badge variant="accent" className="mb-3">
                <Award size={11} /> Historias reales del campo
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
                Casos de éxito que{" "}
                <span className="text-brand-gradient">se miden en cosechas.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-muted text-lg leading-relaxed">
                Productores y cooperativas de toda LATAM que pasaron de perder
                cosecha a exportar con trazabilidad, datos en tiempo real y
                venta directa. Estas son sus historias, con números.
              </p>
            </Reveal>

            {/* Stats agregadas */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.07}>
                  <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm h-full">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                      <s.icon size={20} />
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tight text-ink">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-muted">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.25}>
              <div className="mt-6 flex flex-wrap items-center gap-2 text-2xl">
                {COUNTRIES.map((country) => (
                  <span
                    key={country.code}
                    title={country.name}
                    aria-label={country.name}
                  >
                    {country.flag}
                  </span>
                ))}
                <span className="ml-1 text-sm text-muted">
                  3 casos por país, verificados en campo.
                </span>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Grid con filtros */}
        <section>
          <Container className="py-14">
            <CasesGrid />
          </Container>
        </section>

        {/* CTA final */}
        <section className="border-t border-border-soft bg-surface-2/40">
          <Container className="py-20">
            <div className="text-center max-w-2xl mx-auto">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                  ¿Quieres ser el próximo caso de éxito?
                </h2>
                <p className="mt-4 text-muted text-lg leading-relaxed">
                  Únete a los miles de productores que ya redujeron sus mermas
                  y venden directo con AgroPulse. Empieza gratis o conversa con
                  nuestro equipo.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/signup"
                    className={buttonVariants({ variant: "primary", size: "lg" })}
                  >
                    Crear cuenta gratis
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/contacto"
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                  >
                    Hablar con el equipo
                  </Link>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
