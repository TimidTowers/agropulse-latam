import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Sprout, Users, Globe, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { LatamMap } from "@/components/paises/LatamMap";
import { CountryGridClient } from "@/components/paises/CountryGridClient";
import {
  COUNTRIES,
  totalHectareas,
  totalProductors,
} from "@/lib/countries";

export const metadata: Metadata = {
  title: "AgroPulse en LATAM — 10 países conectados",
  description:
    "Conoce la presencia de AgroPulse en los 10 países LATAM: productores, hectáreas bajo monitoreo y productos exportables por región.",
};

export default function PaisesPage() {
  const totalP = totalProductors();
  const totalH = totalHectareas();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="border-b border-border-soft bg-surface">
          <Container className="py-16">
            <Reveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Presencia regional
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
                AgroPulse en{" "}
                <span className="text-brand-gradient">Latinoamérica.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-muted text-lg leading-relaxed">
                Operamos en 10 países con datos, sensores y precios en moneda
                local. Conoce el ecosistema de productores con quienes ya
                trabajamos.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Combined figures */}
        <section className="border-b border-border-soft bg-surface-2/40">
          <Container className="py-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Reveal>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Globe size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    <Counter value={COUNTRIES.length} />
                  </p>
                  <p className="mt-1 text-sm text-muted">Países activos</p>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Users size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    <Counter value={totalP} />
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Productores en la red
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Sprout size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    <Counter value={totalH} />
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Hectáreas monitorizadas
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <MapPin size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    <Counter
                      value={COUNTRIES.reduce(
                        (a, c) => a + c.regions.length,
                        0,
                      )}
                    />
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Regiones agrícolas cubiertas
                  </p>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* Map + grid */}
        <Container className="py-16">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 mb-16">
            <Reveal>
              <div className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
                <div className="p-5 border-b border-border-soft">
                  <h2 className="font-semibold text-ink">Mapa LATAM</h2>
                  <p className="text-sm text-muted mt-0.5">
                    Capitales de los 10 países activos.
                  </p>
                </div>
                <div className="h-[520px]">
                  <LatamMap />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border-soft bg-surface p-6">
                <h2 className="font-semibold text-ink text-lg">
                  Datos por país
                </h2>
                <p className="text-sm text-muted mt-0.5 mb-4">
                  Productores y hectáreas registrados en cada mercado.
                </p>
                <ul className="space-y-2.5 max-h-[440px] overflow-y-auto pr-2">
                  {COUNTRIES.map((c) => (
                    <li
                      key={c.code}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border-soft hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="text-2xl leading-none"
                          aria-hidden="true"
                        >
                          {c.flag}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-ink truncate">
                            {c.name}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {c.capital} · {c.currency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-ink tabular-nums">
                          {c.productors.toLocaleString("es-MX")}
                        </p>
                        <p className="text-xs text-muted tabular-nums">
                          {c.hectareas.toLocaleString("es-MX")} ha
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Country grid */}
          <div className="mb-10">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Conoce cada mercado
              </h2>
              <p className="text-muted mt-1">
                Productos top y regiones agrícolas por país.
              </p>
            </Reveal>
          </div>

          <CountryGridClient />

          <Reveal>
            <div className="mt-16 rounded-2xl border border-brand/20 bg-brand/5 p-8 grid md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <h3 className="text-xl font-semibold text-ink">
                  ¿Quieres operar en otro país LATAM?
                </h3>
                <p className="text-muted mt-1.5 max-w-xl">
                  Estamos sumando nuevos mercados. Cuéntanos en qué país
                  produces o compras y te avisamos cuando AgroPulse esté
                  disponible.
                </p>
              </div>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
              >
                Contactar al equipo <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </Container>
      </main>
      <Footer />
    </>
  );
}
