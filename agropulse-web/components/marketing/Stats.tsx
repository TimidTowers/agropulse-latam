import { Container } from "@/components/ui/Container";
import {
  TrendingDown,
  AlertOctagon,
  DollarSign,
  Globe,
  Users,
  Map as MapIcon,
  Sprout,
  Languages,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { COUNTRIES, totalHectareas, totalProductors } from "@/lib/countries";

const problemStats = [
  {
    icon: AlertOctagon,
    valor: "30-40%",
    etiqueta:
      "de la producción agrícola se pierde en países en desarrollo (FAO).",
  },
  {
    icon: TrendingDown,
    valor: "20M ton",
    etiqueta:
      "de alimentos desperdiciados al año solo en México y Centroamérica.",
  },
  {
    icon: DollarSign,
    valor: "USD 38 mil M",
    etiqueta: "en costo económico anual de las pérdidas en toda LATAM.",
  },
  {
    icon: Globe,
    valor: "USD 8,500M",
    etiqueta: "TAM regional gestionable digitalmente.",
  },
];

export function Stats() {
  const productors = totalProductors();
  const hectareas = totalHectareas();

  return (
    <section className="relative border-y border-border-soft bg-surface-2/40">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
              Presencia en 10 países LATAM
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Una sola plataforma,{" "}
              <span className="text-brand-gradient">toda Latinoamérica.</span>
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              AgroPulse opera con precios y datos locales en {COUNTRIES.length}{" "}
              países, conectando a más de {productors.toLocaleString("es-MX")}{" "}
              productores con compradores B2B en todo el continente.
            </p>
          </div>
        </Reveal>

        {/* LATAM aggregate counters */}
        <Reveal delay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <MapIcon size={20} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                <Counter value={COUNTRIES.length} />
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Países LATAM activos en la plataforma.
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Users size={20} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                <Counter value={productors} />
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Productores conectados con datos en tiempo real.
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Sprout size={20} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                <Counter value={hectareas} /> ha
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Hectáreas bajo monitoreo en LATAM.
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Languages size={20} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                <Counter value={10} /> monedas
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Precios en moneda local: MXN, COP, ARS, BRL, USD y más.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Problem stats */}
        <Reveal>
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-warm mb-3">
              El problema
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Cada año se pierden millones de toneladas de alimentos
              <span className="text-muted">
                {" "}
                entre la cosecha y la mesa del consumidor.
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problemStats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.valor} delay={0.05 + idx * 0.07}>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm h-full">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    {s.valor}
                  </p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {s.etiqueta}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted">
          Fuentes: FAO (2023), SADER México (2024), Banco Mundial (2024).
        </p>
      </Container>
    </section>
  );
}
