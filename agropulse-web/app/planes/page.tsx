import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Check, X, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { plans } from "@/lib/mock-data/plans";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Planes y precios — AgroPulse",
  description:
    "Planes SaaS para productores agrícolas en LATAM. Desde $1,490 MXN/mes incluyendo sensores IoT.",
};

const comparativa = [
  {
    cat: "Plataforma",
    items: [
      { f: "Dashboard analítico", basico: true, pro: true, enterprise: true },
      { f: "Lotes activos", basico: "50", pro: "Ilimitados", enterprise: "Ilimitados" },
      { f: "Usuarios", basico: "3", pro: "10", enterprise: "Ilimitados" },
      { f: "Histórico de datos", basico: "6 meses", pro: "24 meses", enterprise: "Ilimitado" },
    ],
  },
  {
    cat: "IoT",
    items: [
      { f: "Sensores incluidos", basico: "3", pro: "10", enterprise: "Ilimitados" },
      { f: "Lecturas por sensor / día", basico: "144", pro: "1440", enterprise: "Custom" },
      { f: "Alertas tiempo real", basico: true, pro: true, enterprise: true },
      { f: "Multi-finca", basico: false, pro: true, enterprise: true },
    ],
  },
  {
    cat: "Inteligencia",
    items: [
      { f: "Pronóstico de demanda ML", basico: false, pro: true, enterprise: true },
      { f: "Recomendador de precios", basico: false, pro: true, enterprise: true },
      { f: "Reportes ESG", basico: false, pro: true, enterprise: true },
      { f: "Datos crudos vía API", basico: false, pro: false, enterprise: true },
    ],
  },
  {
    cat: "Operación",
    items: [
      { f: "Marketplace B2B", basico: true, pro: true, enterprise: true },
      { f: "Integración logística", basico: false, pro: true, enterprise: true },
      { f: "Soporte", basico: "Email 24h", pro: "Prioritario 4h", enterprise: "24/7 SLA" },
      { f: "Consultoría dedicada (CSM)", basico: false, pro: false, enterprise: true },
    ],
  },
];

const faqs = [
  {
    q: "¿Qué pasa si necesito más sensores?",
    a: "Puedes añadir sensores individuales a tu plan por $390 MXN/mes cada uno. En Enterprise no hay tope.",
  },
  {
    q: "¿Hay periodo de prueba?",
    a: "Sí, todos los planes incluyen 30 días gratis sin tarjeta. Solo se cobran los sensores físicos enviados.",
  },
  {
    q: "¿Cuál es la comisión del marketplace?",
    a: "4% sobre cada transacción cerrada, independiente del plan. No hay comisión de listado.",
  },
  {
    q: "¿Puedo cambiar de plan?",
    a: "Sí, en cualquier momento. Si subes de plan, se prorratea la diferencia. Si bajas, aplica al ciclo siguiente.",
  },
  {
    q: "¿Los sensores son míos o rentados?",
    a: "En Básico y Pro están en modalidad SaaS (incluidos). En Enterprise puedes optar por compra directa con descuento.",
  },
  {
    q: "¿Cómo se factura?",
    a: "Facturación electrónica CFDI 4.0 mensual. Aceptamos transferencia, tarjeta corporativa y domiciliación bancaria.",
  },
];

function FeatureValue({
  v,
}: {
  v: string | boolean;
}) {
  if (v === true)
    return <Check size={16} className="text-brand mx-auto" />;
  if (v === false)
    return <X size={16} className="text-muted/50 mx-auto" />;
  return <span className="text-sm text-ink">{v}</span>;
}

export default function PlanesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="border-b border-border-soft relative">
          <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
          <Container className="relative py-20 text-center">
            <Badge variant="brand">Planes y precios</Badge>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
              Empieza pequeño.{" "}
              <span className="text-brand-gradient">Crece a tu ritmo.</span>
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-muted">
              Todos los planes incluyen sensores IoT, plataforma web, marketplace
              B2B y 30 días de prueba sin compromiso.
            </p>
          </Container>
        </section>

        {/* Plans cards */}
        <Container className="py-14">
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "relative rounded-2xl border bg-surface p-8 flex flex-col",
                  p.destacado
                    ? "border-brand shadow-lg ring-1 ring-brand/20"
                    : "border-border-soft shadow-sm",
                )}
              >
                {p.destacado && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand text-white text-xs font-medium px-3 py-1">
                    Más popular
                  </span>
                )}
                <h2 className="text-xl font-semibold text-ink tracking-tight">
                  {p.nombre}
                </h2>
                <p className="text-sm text-muted mt-1">{p.sensores}</p>
                <p className="mt-6">
                  <span className="text-4xl font-semibold text-ink tracking-tight">
                    {p.precio}
                  </span>
                  <span className="ml-2 text-sm text-muted">{p.periodo}</span>
                </p>
                <ul className="mt-6 flex flex-col gap-2.5 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-ink/85"
                    >
                      <Check
                        size={14}
                        className="mt-1 text-brand flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contacto" className="mt-8">
                  <Button
                    className="w-full"
                    variant={p.destacado ? "primary" : "outline"}
                    size="lg"
                  >
                    {p.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Container>

        {/* Comparison table */}
        <section className="border-y border-border-soft bg-surface-2/30">
          <Container className="py-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-ink">
                Comparativa detallada
              </h2>
              <p className="mt-3 text-muted">
                Todo lo que incluye cada plan, en un solo lugar.
              </p>
            </div>
            <div className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-2/40 border-b border-border-soft">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-ink">
                        Características
                      </th>
                      <th className="px-6 py-4 font-semibold text-ink text-center">
                        Básico
                      </th>
                      <th className="px-6 py-4 font-semibold text-brand text-center bg-brand/5">
                        Pro
                      </th>
                      <th className="px-6 py-4 font-semibold text-ink text-center">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparativa.map((cat) => (
                      <Fragment key={cat.cat}>
                        <tr className="bg-surface-2/30">
                          <td
                            colSpan={4}
                            className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted"
                          >
                            {cat.cat}
                          </td>
                        </tr>
                        {cat.items.map((it) => (
                          <tr
                            key={it.f}
                            className="border-t border-border-soft"
                          >
                            <td className="px-6 py-3 text-ink">{it.f}</td>
                            <td className="px-6 py-3 text-center">
                              <FeatureValue v={it.basico} />
                            </td>
                            <td className="px-6 py-3 text-center bg-brand/5">
                              <FeatureValue v={it.pro} />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <FeatureValue v={it.enterprise} />
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section>
          <Container className="py-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-ink">
                Preguntas frecuentes
              </h2>
              <p className="mt-3 text-muted">
                Si no encuentras lo que buscas, escríbenos a hola@agropulse.mx
              </p>
            </div>
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-border-soft bg-surface p-5 open:shadow-sm"
                >
                  <summary className="cursor-pointer font-medium text-ink text-sm select-none flex items-start justify-between gap-3">
                    {f.q}
                    <span className="text-muted text-lg leading-none mt-0.5 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact CTA */}
        <section>
          <Container className="pb-20">
            <div className="rounded-3xl bg-ink text-white p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  ¿Necesitas un plan a medida?
                </h2>
                <p className="mt-2 text-white/70">
                  Para operaciones &gt;50 hectáreas o multi-bodega, agenda una
                  llamada con nuestro equipo de ventas.
                </p>
              </div>
              <Link href="/contacto">
                <Button size="lg" className="bg-white text-ink hover:bg-white/90">
                  <MessageCircle size={16} />
                  Agendar llamada
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
