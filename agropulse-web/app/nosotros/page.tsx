import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Compass,
  Leaf,
  Eye,
  Heart,
  Sparkles,
  AtSign,
  TreeDeciduous,
  Recycle,
  Earth,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { team } from "@/lib/mock-data/team";

export const metadata: Metadata = {
  title: "Nosotros — AgroPulse",
  description:
    "AgroPulse Technologies S.A. de C.V. es una empresa AgriTech mexicana que reduce las pérdidas post-cosecha con tecnología IoT y un marketplace B2B.",
};

const valores = [
  {
    icon: Leaf,
    titulo: "Sostenibilidad",
    descripcion:
      "Cada decisión técnica considera el impacto en el suelo, el agua y la huella de carbono de la cadena alimentaria.",
  },
  {
    icon: Eye,
    titulo: "Transparencia",
    descripcion:
      "Datos abiertos para productor y comprador. Sin caja negra. La trazabilidad va hasta el consumidor final.",
  },
  {
    icon: Sparkles,
    titulo: "Innovación",
    descripcion:
      "ML, IoT y blockchain ligera aplicados al problema real: que se pierdan menos toneladas de alimentos.",
  },
  {
    icon: Heart,
    titulo: "Equidad",
    descripcion:
      "Diseñamos para el pequeño productor, no solo para grandes corporativos. La tecnología debe llegar a todos.",
  },
  {
    icon: Compass,
    titulo: "Trazabilidad",
    descripcion:
      "Cada lote tiene su historia verificable: dónde nació, cómo se manejó, hasta dónde llegó.",
  },
];

const ods = [
  {
    n: 2,
    titulo: "Hambre Cero",
    descripcion:
      "Reducir las pérdidas post-cosecha equivale a producir más alimento sin sembrar más hectáreas.",
    icon: Leaf,
    color: "bg-amber-100 text-amber-900",
  },
  {
    n: 12,
    titulo: "Producción y Consumo Responsables",
    descripcion:
      "El desperdicio alimentario es uno de los blancos directos del ODS 12.3 de la ONU.",
    icon: Recycle,
    color: "bg-orange-100 text-orange-900",
  },
  {
    n: 13,
    titulo: "Acción por el Clima",
    descripcion:
      "Cada tonelada de alimento perdida genera ~2.5 tCO₂e de emisiones evitables.",
    icon: Earth,
    color: "bg-emerald-100 text-emerald-900",
  },
];

const historia = [
  {
    year: "2023",
    titulo: "La chispa",
    descripcion:
      "Sebastián, durante una visita a productores de Querétaro, ve hortalizas perdiéndose por falta de cadena de frío. Empieza a investigar.",
  },
  {
    year: "2024",
    titulo: "Fundación",
    descripcion:
      "Junto con María Fernanda (CTO), constituyen AgroPulse Technologies. Primer piloto con 3 productores del Bajío.",
  },
  {
    year: "2025",
    titulo: "Levantamiento Seed",
    descripcion:
      "USD 1.8M en ronda seed liderada por fondos AgriTech regionales. Sumamos a Diego, Ana Sofía y Luis al equipo fundador.",
  },
  {
    year: "2026",
    titulo: "Lanzamiento público",
    descripcion:
      "Marketplace abierto. 500+ productores onboarded. Operación en Querétaro, Guanajuato, Michoacán y Jalisco.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative border-b border-border-soft">
          <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
          <Container className="relative py-20 sm:py-28">
            <div className="max-w-3xl">
              <Badge variant="brand">Nuestra historia</Badge>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
                Hacemos que cada{" "}
                <span className="text-brand-gradient">tonelada cuente.</span>
              </h1>
              <p className="mt-6 text-lg text-muted leading-relaxed">
                AgroPulse Technologies S.A. de C.V. nació en Querétaro en 2024
                con una convicción simple: el desperdicio alimentario es uno de
                los problemas más resolubles del siglo, y la tecnología debe
                estar al alcance del productor mexicano promedio, no solo del
                gigante exportador.
              </p>
            </div>
          </Container>
        </section>

        {/* Misión / Visión */}
        <section className="bg-surface-2/40">
          <Container className="py-20">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border-soft bg-surface p-8 shadow-sm">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Target size={22} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
                  Misión
                </h2>
                <p className="mt-3 text-muted leading-relaxed">
                  Reducir las pérdidas post-cosecha de productores agrícolas
                  mediante una plataforma E-business que integra IoT, analítica
                  predictiva y un marketplace B2B.
                </p>
              </div>
              <div className="rounded-2xl border border-border-soft bg-surface p-8 shadow-sm">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-emerald-800">
                  <Compass size={22} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
                  Visión
                </h2>
                <p className="mt-3 text-muted leading-relaxed">
                  Ser la plataforma líder en LATAM para la gestión inteligente
                  de productos perecederos al 2030, eliminando un millón de
                  toneladas de desperdicio alimentario al año.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Valores */}
        <section className="border-y border-border-soft">
          <Container className="py-20">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Nuestros valores
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                Cinco principios que rigen cada producto, contrato y
                contratación.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {valores.map((v) => {
                const Icon = v.icon;
                return (
                  <article
                    key={v.titulo}
                    className="rounded-2xl border border-border-soft bg-surface p-6"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 font-semibold text-ink">{v.titulo}</h3>
                    <p className="mt-1.5 text-sm text-muted leading-relaxed">
                      {v.descripcion}
                    </p>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Equipo */}
        <section id="equipo" className="bg-surface-2/40">
          <Container className="py-20">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Equipo fundador
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                Operadores, técnicos y agrónomos que llevan toda su carrera en
                el sector.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map((m) => (
                <article
                  key={m.id}
                  className="rounded-2xl border border-border-soft bg-surface overflow-hidden shadow-sm"
                >
                  <div className="aspect-[4/3] bg-surface-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.avatar}
                      alt={m.nombre}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-ink">{m.nombre}</h3>
                    <p className="text-sm text-brand">{m.rol}</p>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {m.bio}
                    </p>
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink"
                        aria-label={`LinkedIn de ${m.nombre}`}
                      >
                        <AtSign size={13} /> LinkedIn
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Historia */}
        <section className="border-t border-border-soft">
          <Container className="py-20">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Cronología
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                De una idea en una bodega a una plataforma regional.
              </h2>
            </div>
            <ol className="relative space-y-8 max-w-3xl">
              <span
                className="absolute left-5 top-3 bottom-3 w-px bg-border-soft"
                aria-hidden="true"
              />
              {historia.map((h) => (
                <li key={h.year} className="relative pl-14">
                  <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-brand text-white text-xs font-mono font-semibold">
                    {h.year}
                  </span>
                  <h3 className="font-semibold text-ink">{h.titulo}</h3>
                  <p className="mt-1.5 text-muted leading-relaxed">
                    {h.descripcion}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* ODS */}
        <section id="ods" className="bg-ink text-white relative overflow-hidden border-t border-border-soft">
          <Container className="relative py-20">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
                ODS impactados
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Tres Objetivos de Desarrollo Sostenible en el corazón del
                producto.
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                Nuestro modelo de negocio está alineado con los compromisos de
                la Agenda 2030 de la ONU. Reportamos avances trimestralmente a
                clientes Enterprise.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {ods.map((o) => {
                const Icon = o.icon;
                return (
                  <article
                    key={o.n}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur"
                  >
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${o.color}`}
                    >
                      <Icon size={22} />
                    </div>
                    <p className="mt-5 text-xs font-bold tracking-widest uppercase text-accent">
                      ODS {o.n}
                    </p>
                    <h3 className="mt-1 font-semibold text-lg tracking-tight">
                      {o.titulo}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">
                      {o.descripcion}
                    </p>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Cta */}
        <section>
          <Container className="py-20">
            <div className="rounded-3xl border border-border-soft bg-surface p-10 sm:p-14 text-center">
              <TreeDeciduous size={36} className="mx-auto text-brand" />
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
                ¿Te sumas a la operación?
              </h2>
              <p className="mt-3 text-muted max-w-xl mx-auto">
                Buscamos talento técnico, agrónomo y comercial. Si crees en la
                agricultura digital justa, escríbenos.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/contacto">
                  <Button size="lg">Hablemos</Button>
                </Link>
                <Link href="/planes">
                  <Button size="lg" variant="outline">
                    Conocer el producto
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
