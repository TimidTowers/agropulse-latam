import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Package,
  PackageSearch,
  ShieldCheck,
  Sprout,
  Star,
  Thermometer,
  Droplets,
  QrCode,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getProductById, products } from "@/lib/mock-data/products";
import { lotsDb } from "@/lib/db/store";
import { lotToProductView } from "@/lib/lot-utils";
import { formatDate } from "@/lib/utils";
import { formatPrice, getCountry } from "@/lib/countries";
import { AddToCartButton } from "@/components/marketplace/AddToCartButton";
import { LiveStock } from "@/components/marketplace/LiveStock";
import { ProductImage } from "@/components/marketplace/ProductImage";
import type { Product } from "@/lib/types";

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

/**
 * Resuelve el id contra el catálogo estático y, si no existe, contra los
 * lotes dinámicos creados por productores (lotsDb). Los IDs desconocidos
 * se renderizan on-demand en el server (dynamicParams=true por defecto),
 * donde lotsDb SÍ está disponible.
 */
async function resolveProductOrLot(id: string): Promise<{
  product: Product | undefined;
  isDynamicLot: boolean;
}> {
  const staticProduct = getProductById(id);
  if (staticProduct) return { product: staticProduct, isDynamicLot: false };
  const lot = await lotsDb.findById(id);
  if (lot) return { product: lotToProductView(lot), isDynamicLot: true };
  return { product: undefined, isDynamicLot: false };
}

export async function generateMetadata(
  props: PageProps<"/marketplace/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const { product: p } = await resolveProductOrLot(id);
  if (!p) return { title: "Lote no encontrado — AgroPulse" };
  return {
    title: `${p.nombre} — ${p.productor.nombre} | AgroPulse`,
    description: p.descripcion,
  };
}

function LotNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <Container className="py-24">
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border-soft bg-surface p-12 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-muted">
              <PackageSearch size={26} />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
              Lote no encontrado
            </h1>
            <p className="mt-2 text-muted leading-relaxed">
              Puede haber expirado de la memoria demo o el enlace es
              incorrecto. Los lotes publicados por productores viven en
              memoria y se reinician periódicamente.
            </p>
            <Link href="/marketplace" className="inline-block mt-7">
              <Button size="lg">
                <ArrowLeft size={16} /> Volver al marketplace
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default async function ProductPage(
  props: PageProps<"/marketplace/[id]">,
) {
  const { id } = await props.params;
  const { product: p, isDynamicLot } = await resolveProductOrLot(id);
  if (!p) return <LotNotFound />;

  const urgVariant =
    p.urgencia === "alta"
      ? "danger"
      : p.urgencia === "media"
        ? "warning"
        : "success";
  const country = getCountry(p.country);

  const tempOk =
    p.condicionesIoT.temperaturaC >= p.condicionesIoT.rangoOptimoTemp[0] &&
    p.condicionesIoT.temperaturaC <= p.condicionesIoT.rangoOptimoTemp[1];
  const humOk =
    p.condicionesIoT.humedadPct >= p.condicionesIoT.rangoOptimoHumedad[0] &&
    p.condicionesIoT.humedadPct <= p.condicionesIoT.rangoOptimoHumedad[1];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <Container className="py-10">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-3"
          >
            <ArrowLeft size={14} /> Volver al marketplace
          </Link>
          <nav className="mb-5 text-xs text-muted flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
            <Link href="/marketplace" className="hover:text-ink">Marketplace</Link>
            <span>/</span>
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">{country.flag}</span>
              {country.name}
            </span>
            <span>/</span>
            <span>{p.categoria}</span>
            <span>/</span>
            <span className="text-ink font-medium">{p.nombre}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10">
            {/* Galería */}
            <div className="space-y-3">
              <div className="aspect-[5/4] rounded-2xl overflow-hidden bg-surface-2 border border-border-soft">
                <ProductImage
                  src={p.imagen}
                  alt={`${p.nombre} — ${p.productor.nombre}`}
                  productKey={p.id}
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {p.galeria.map((g, i) => (
                  <div
                    key={`${p.id}-gallery-${i}`}
                    className="aspect-square rounded-xl overflow-hidden bg-surface-2 border border-border-soft"
                  >
                    <ProductImage
                      src={g}
                      alt={`${p.nombre} - vista ${i + 1}`}
                      productKey={`${p.id}-${i}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      sizes="(max-width: 1024px) 33vw, 18vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Detalle */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="brand">{p.categoria}</Badge>
                <Badge variant={urgVariant}>
                  {p.urgencia === "alta"
                    ? "Vida útil corta · priorizar"
                    : p.urgencia === "media"
                      ? "Vender pronto"
                      : "Stock fresco"}
                </Badge>
                {isDynamicLot && (
                  <Badge variant="brand" className="bg-brand text-white">
                    <Sprout size={11} /> Lote publicado por productor
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                {p.nombre}
              </h1>
              <p className="mt-2 text-muted">
                Lote{" "}
                <span className="font-mono text-ink">{p.loteId}</span>
              </p>

              <div className="mt-5 flex items-end gap-2">
                <p className="text-4xl font-semibold tracking-tight text-ink">
                  {formatPrice(p.precio, country)}
                </p>
                <p className="pb-1.5 text-muted">por {p.unidad}</p>
              </div>
              <LiveStock
                productId={p.id}
                unit={p.unidad}
                initialStock={p.stock}
                locale={country.locale}
              />

              <p className="mt-6 text-ink/85 leading-relaxed">{p.descripcion}</p>

              <div className="mt-7 flex flex-wrap gap-2">
                {p.certificaciones.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1 text-xs text-ink/80"
                  >
                    <ShieldCheck size={12} className="text-brand" />
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <AddToCartButton product={p} />
                {isDynamicLot ? (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface-2 px-4 py-2.5 text-sm text-muted">
                    <Info size={15} className="text-brand shrink-0" />
                    Trazabilidad disponible tras la primera venta
                  </div>
                ) : (
                  <Link href={`/trazabilidad/${p.loteId}`}>
                    <Button size="xl" variant="outline">
                      <QrCode size={16} />
                      Ver trazabilidad
                    </Button>
                  </Link>
                )}
              </div>

              {/* Productor */}
              <div className="mt-8 rounded-2xl border border-border-soft bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                      Productor
                    </p>
                    <h3 className="mt-1 font-semibold text-ink">
                      {p.productor.nombre}
                    </h3>
                    <p className="text-sm text-muted">
                      {p.productor.region}, {p.productor.estado} ·{" "}
                      {p.productor.yearsActive} años de operación
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-warm">
                    <Star size={14} fill="currentColor" stroke="none" />
                    <strong className="text-ink text-sm">
                      {p.productor.rating.toFixed(1)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border-soft bg-surface p-5">
              <Calendar size={18} className="text-brand" />
              <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                Fecha cosecha
              </p>
              <p className="mt-1 font-semibold text-ink">
                {formatDate(p.fechaCosecha)}
              </p>
            </div>
            <div className="rounded-2xl border border-border-soft bg-surface p-5">
              <Clock size={18} className="text-brand" />
              <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                Vida útil
              </p>
              <p className="mt-1 font-semibold text-ink">
                {p.vidaUtilDias} días
              </p>
            </div>
            <div className="rounded-2xl border border-border-soft bg-surface p-5">
              <Package size={18} className="text-brand" />
              <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                Stock total
              </p>
              <p className="mt-1 font-semibold text-ink">
                {p.stock.toLocaleString(country.locale)} {p.unidad}
              </p>
            </div>
            <div className="rounded-2xl border border-border-soft bg-surface p-5">
              <MapPin size={18} className="text-brand" />
              <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                Origen
              </p>
              <p className="mt-1 font-semibold text-ink">
                {p.productor.estado}
              </p>
            </div>
          </div>

          {/* Trazabilidad (solo aviso para lotes runtime) */}
          {isDynamicLot && (
            <section className="mt-12 rounded-2xl border border-dashed border-border-soft bg-surface p-7">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                  <QrCode size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-ink">
                    Trazabilidad disponible tras la primera venta
                  </h2>
                  <p className="mt-1 text-sm text-muted leading-relaxed max-w-2xl">
                    Este lote fue publicado recientemente por el productor y
                    aún no registra eventos de cadena de suministro. En cuanto
                    se confirme la primera venta, AgroPulse generará el QR de
                    trazabilidad con cosecha, almacén, transporte y punto de
                    venta.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Condiciones IoT en vivo */}
          <section className="mt-12 rounded-2xl border border-border-soft bg-surface p-7">
            <div className="flex items-center justify-between mb-6 gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  Condiciones IoT del lote
                </h2>
                <p className="text-sm text-muted">
                  {isDynamicLot ? (
                    <>Condiciones estimadas por categoría · el sensor se asigna al confirmar la primera venta</>
                  ) : (
                    <>
                      Sensor{" "}
                      <span className="font-mono text-ink">{p.sensorId}</span> ·
                      última lectura{" "}
                      {new Date(p.condicionesIoT.ultimaLectura).toLocaleString(
                        "es-MX",
                      )}
                    </>
                  )}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                En vivo
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div
                className={`rounded-xl border p-5 ${tempOk ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer
                      size={18}
                      className={tempOk ? "text-emerald-700" : "text-amber-700"}
                    />
                    <span className="text-sm font-medium text-ink">
                      Temperatura
                    </span>
                  </div>
                  <Badge variant={tempOk ? "success" : "warning"}>
                    {tempOk ? "Óptima" : "Atención"}
                  </Badge>
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-ink">
                  {p.condicionesIoT.temperaturaC.toFixed(1)}°C
                </p>
                <p className="text-xs text-muted mt-1">
                  Rango óptimo: {p.condicionesIoT.rangoOptimoTemp[0]}°C –{" "}
                  {p.condicionesIoT.rangoOptimoTemp[1]}°C
                </p>
              </div>
              <div
                className={`rounded-xl border p-5 ${humOk ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets
                      size={18}
                      className={humOk ? "text-emerald-700" : "text-amber-700"}
                    />
                    <span className="text-sm font-medium text-ink">
                      Humedad
                    </span>
                  </div>
                  <Badge variant={humOk ? "success" : "warning"}>
                    {humOk ? "Óptima" : "Atención"}
                  </Badge>
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-ink">
                  {p.condicionesIoT.humedadPct.toFixed(0)}%
                </p>
                <p className="text-xs text-muted mt-1">
                  Rango óptimo: {p.condicionesIoT.rangoOptimoHumedad[0]}% –{" "}
                  {p.condicionesIoT.rangoOptimoHumedad[1]}%
                </p>
              </div>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
