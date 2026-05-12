import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, MapPin, Calendar, QrCode, Award, Leaf } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Timeline } from "@/components/trazabilidad/Timeline";
import { Map } from "@/components/trazabilidad/Map";
import { getTrazabilidad, getAllLoteIds } from "@/lib/mock-data/trazabilidad";
import { getProductByLoteId } from "@/lib/mock-data/products";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllLoteIds().map((loteId) => ({ loteId }));
}

export async function generateMetadata(
  props: PageProps<"/trazabilidad/[loteId]">,
): Promise<Metadata> {
  const { loteId } = await props.params;
  const t = getTrazabilidad(loteId);
  if (!t) return { title: "Lote no encontrado" };
  return {
    title: `Trazabilidad ${t.loteId} — ${t.producto} | AgroPulse`,
    description: `Historia verificable del lote ${t.loteId}. Producto: ${t.producto}.`,
  };
}

export default async function TrazabilidadPage(
  props: PageProps<"/trazabilidad/[loteId]">,
) {
  const { loteId } = await props.params;
  const t = getTrazabilidad(loteId);
  if (!t) notFound();
  const producto = getProductByLoteId(loteId);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        {/* Banner */}
        <section className="relative border-b border-border-soft bg-surface">
          <Container className="py-12">
            <div className="grid lg:grid-cols-[1fr_auto] items-start gap-8">
              <div>
                <Badge variant="accent" className="mb-3">
                  <Leaf size={11} />
                  Trazabilidad pública
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                  {t.producto}
                </h1>
                <p className="mt-2 text-muted">
                  Lote{" "}
                  <span className="font-mono text-ink">{t.loteId}</span> ·{" "}
                  Producido por{" "}
                  <strong className="text-ink">{t.productor.nombre}</strong>
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand" />
                    Siembra: {formatDate(t.fechaSiembra)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand" />
                    Cosecha: {formatDate(t.fechaCosecha)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-brand" />
                    {t.productor.region}, {t.productor.estado}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.certificaciones.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1 text-xs text-ink/80"
                    >
                      <ShieldCheck size={12} className="text-brand" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-border-soft p-6 grid place-items-center bg-surface-2/40">
                <div className="grid h-32 w-32 place-items-center rounded-xl bg-white border border-border-soft">
                  <QrCode size={80} className="text-ink" />
                </div>
                <p className="mt-3 text-xs text-muted font-mono">
                  {t.loteId}
                </p>
                {producto && (
                  <Link
                    href={`/marketplace/${producto.id}`}
                    className="mt-3 text-xs text-brand hover:underline font-medium"
                  >
                    Ver lote comercial →
                  </Link>
                )}
              </div>
            </div>
          </Container>
        </section>

        <Container className="py-14">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* Timeline */}
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink mb-6">
                Historia del lote
              </h2>
              <Timeline eventos={t.eventos} />
            </div>

            {/* Mapa + productor */}
            <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
                <div className="p-5 border-b border-border-soft">
                  <h3 className="font-semibold text-ink">Recorrido geográfico</h3>
                  <p className="text-sm text-muted mt-0.5">
                    De la parcela al punto de venta.
                  </p>
                </div>
                <div className="h-80">
                  <Map eventos={t.eventos} />
                </div>
              </div>

              <div className="rounded-2xl border border-border-soft bg-surface p-6">
                <h3 className="font-semibold text-ink flex items-center gap-2">
                  <Award size={16} className="text-brand" />
                  Sobre el productor
                </h3>
                <p className="mt-3 text-sm text-ink">{t.productor.nombre}</p>
                <p className="text-xs text-muted">
                  {t.productor.region}, {t.productor.estado}
                </p>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  Productor con <strong>{t.productor.yearsActive}</strong> años
                  de experiencia, calificación promedio de{" "}
                  <strong>{t.productor.rating.toFixed(1)}/5</strong> en
                  AgroPulse y certificaciones activas:{" "}
                  {t.productor.certificaciones.join(", ")}.
                </p>
              </div>

              <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-dark">
                  Verificación blockchain
                </p>
                <p className="mt-2 text-sm text-ink leading-relaxed">
                  Cada evento de esta cadena de trazabilidad se ancla en una red
                  blockchain ligera. Los hashes son inmutables y verificables
                  por terceros.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
