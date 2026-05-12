import type { Metadata } from "next";
import {
  Leaf,
  Droplets,
  Recycle,
  Sprout,
  FileText,
  Download,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { COUNTRIES } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Sustentabilidad — AgroPulse",
  description:
    "Impacto ambiental y social de AgroPulse en LATAM: toneladas salvadas, CO₂ evitado y agua ahorrada al reducir las pérdidas post-cosecha.",
};

const odsList = [
  {
    code: "ODS 2",
    titulo: "Hambre cero",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    desc: "Al reducir 30-40% las pérdidas post-cosecha estamos rescatando alimento equivalente a la dieta anual de millones de personas en LATAM. Cada lote que evita el desperdicio aporta directamente a la disponibilidad de alimentos.",
  },
  {
    code: "ODS 12",
    titulo: "Producción y consumo responsables",
    color: "bg-yellow-100 text-yellow-900 border-yellow-300",
    desc: "Optimizamos la cadena entre productor y comprador mediante IoT y matching algorítmico, eliminando intermediarios y reduciendo el envío de productos a destinos donde se descartarán por baja demanda.",
  },
  {
    code: "ODS 13",
    titulo: "Acción por el clima",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    desc: "Reducir el desperdicio alimentario disminuye las emisiones de metano de los residuos orgánicos y los gases de efecto invernadero asociados a la producción agrícola innecesaria. AgroPulse contribuye a las metas climáticas LATAM 2030.",
  },
];

const reportes = [
  {
    titulo: "Reporte ESG 2025",
    desc: "Indicadores ambientales, sociales y de gobernanza del año fiscal.",
    fecha: "Marzo 2026",
    pages: "48 páginas",
  },
  {
    titulo: "Memoria de sostenibilidad 2025",
    desc: "Análisis del impacto positivo en los 10 países LATAM.",
    fecha: "Febrero 2026",
    pages: "62 páginas",
  },
  {
    titulo: "Reporte de huella de carbono",
    desc: "Medición de emisiones evitadas por uso de la plataforma.",
    fecha: "Enero 2026",
    pages: "24 páginas",
  },
  {
    titulo: "Auditoría externa GLOBALG.A.P. 2025",
    desc: "Verificación independiente de productores onboarded.",
    fecha: "Diciembre 2025",
    pages: "36 páginas",
  },
];

export default function SustentabilidadPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="border-b border-border-soft bg-surface relative overflow-hidden">
          <div
            className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #15803D 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <Container className="relative py-16">
            <Reveal>
              <Badge variant="accent" className="mb-3">
                <Leaf size={11} /> Impacto verificable
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
                Sustentabilidad{" "}
                <span className="text-brand-gradient">con datos.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-muted text-lg leading-relaxed">
                Reducir las pérdidas post-cosecha no es sólo ahorrar dinero: es
                evitar emisiones, ahorrar agua y rescatar alimento que vuelve a
                la mesa. Aquí mostramos el impacto real medido en LATAM.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Impact counters */}
        <section className="border-b border-border-soft">
          <Container className="py-14">
            <Reveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Impacto agregado LATAM (estimado 2025)
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-ink">
                Cifras de regeneración.
              </h2>
            </Reveal>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Reveal>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Sprout size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    <Counter value={84500} /> t
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Toneladas de alimento rescatadas.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.07}>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-info/10 text-info">
                    <Recycle size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    <Counter value={210000} /> t CO₂e
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Emisiones evitadas equivalentes.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-info/10 text-info">
                    <Droplets size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    <Counter value={1380} /> millones L
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Agua ahorrada por menor producción descartada.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.21}>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/30 text-emerald-800">
                    <Globe size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    <Counter value={64400} />
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Productores con ingresos más estables.
                  </p>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ODS extendido */}
        <section className="border-b border-border-soft bg-surface-2/40">
          <Container className="py-16">
            <Reveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Objetivos de Desarrollo Sostenible
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-ink max-w-3xl">
                Alineamos cada feature de AgroPulse con tres ODS de la ONU.
              </h2>
            </Reveal>

            <div className="mt-10 grid lg:grid-cols-3 gap-5">
              {odsList.map((o, i) => (
                <Reveal key={o.code} delay={i * 0.08}>
                  <div className="rounded-2xl border border-border-soft bg-surface p-7 h-full">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${o.color}`}
                    >
                      {o.code}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">
                      {o.titulo}
                    </h3>
                    <p className="mt-3 text-muted leading-relaxed text-sm">
                      {o.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Tabla impacto por país */}
        <section className="border-b border-border-soft">
          <Container className="py-16">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Impacto por país
              </h2>
              <p className="text-muted mt-1">
                Hectáreas y productores con métricas de impacto estimado.
              </p>
            </Reveal>

            <div className="mt-8 rounded-2xl border border-border-soft bg-surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border-soft bg-surface-2/40">
                    <tr className="text-left text-xs uppercase tracking-wider text-muted">
                      <th className="px-5 py-3 font-medium">País</th>
                      <th className="px-5 py-3 font-medium text-right">
                        Productores
                      </th>
                      <th className="px-5 py-3 font-medium text-right">
                        Hectáreas
                      </th>
                      <th className="px-5 py-3 font-medium text-right">
                        Toneladas salvadas
                      </th>
                      <th className="px-5 py-3 font-medium text-right">
                        CO₂e evitado (t)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRIES.map((c) => {
                      // Estimated values proportional to size
                      const ton = Math.round(c.productors * 0.65);
                      const co2 = Math.round(ton * 2.5);
                      return (
                        <tr
                          key={c.code}
                          className="border-b border-border-soft last:border-0 hover:bg-surface-2/40 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center gap-2">
                              <span aria-hidden="true">{c.flag}</span>
                              <span className="font-medium text-ink">
                                {c.name}
                              </span>
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-ink">
                            {c.productors.toLocaleString("es-MX")}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-ink">
                            {c.hectareas.toLocaleString("es-MX")}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-emerald-700 font-medium">
                            {ton.toLocaleString("es-MX")}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-info font-medium">
                            {co2.toLocaleString("es-MX")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* Reportes */}
        <section>
          <Container className="py-16">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Reportes y documentos
              </h2>
              <p className="text-muted mt-1">
                Acceso público a nuestros reportes ESG y de sostenibilidad.
              </p>
            </Reveal>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportes.map((r, i) => (
                <Reveal key={r.titulo} delay={i * 0.06}>
                  <div className="rounded-2xl border border-border-soft bg-surface p-5 hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col">
                    <FileText size={22} className="text-brand" />
                    <h3 className="mt-4 font-semibold text-ink leading-tight">
                      {r.titulo}
                    </h3>
                    <p className="mt-2 text-xs text-muted leading-relaxed flex-1">
                      {r.desc}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border-soft flex items-center justify-between text-xs text-muted">
                      <span>
                        {r.fecha} · {r.pages}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-brand hover:text-brand-dark font-medium"
                      >
                        Descargar
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
