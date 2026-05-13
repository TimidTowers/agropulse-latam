"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/marketplace/ProductCard";
import {
  products,
  filterProducts,
  categorias,
  urgencias,
  getRegionsForCountry,
} from "@/lib/mock-data/products";
import { COUNTRIES, getCountry, type CountryCode } from "@/lib/countries";
import { useCountryStore } from "@/lib/stores/country-store";
import type { Product, ProductoCategoria, Urgencia } from "@/lib/types";
import type { Lot } from "@/lib/db/types";

const PER_PAGE = 12;

/** Convierte un lote dinámico al shape de Product para reutilizar ProductCard */
function lotToProduct(lot: Lot): Product {
  const country = getCountry(lot.country);
  const daysToExpiry = Math.max(
    0,
    Math.floor(
      (new Date(lot.expirationDate).getTime() - Date.now()) / 86_400_000,
    ),
  );
  return {
    id: lot.id,
    slug: lot.productSlug,
    nombre: lot.productName,
    categoria: lot.category as ProductoCategoria,
    country: lot.country,
    productor: {
      id: lot.productorId,
      nombre: lot.productorName,
      region: lot.region,
      estado: lot.region,
      certificaciones: lot.certifications,
      rating: 4.7,
      yearsActive: 5,
    },
    precio: lot.pricePerUnit,
    unidad: lot.unit,
    stock: lot.quantity,
    fechaCosecha: lot.harvestDate,
    vidaUtilDias: daysToExpiry,
    urgencia: lot.urgencia as Urgencia,
    imagen: lot.images[0] ?? "",
    galeria: lot.images,
    certificaciones: lot.certifications,
    condicionesIoT: {
      temperaturaC: 14,
      humedadPct: 80,
      ultimaLectura: new Date().toISOString(),
      rangoOptimoTemp: [10, 18],
      rangoOptimoHumedad: [70, 90],
    },
    descripcion: lot.description,
    sensorId: lot.sensorId ?? "—",
    loteId: lot.id,
    /** flag interno usado por MarketplaceClient para marcar como recién publicado */
    ...({ _isFresh: country && Date.now() - new Date(lot.createdAt).getTime() < 48 * 3600 * 1000 } as object),
  } as Product & { _isFresh?: boolean };
}

export function MarketplaceClient() {
  const { country, setCountry, markSelected } = useCountryStore();
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [region, setRegion] = useState("todas");
  const [urgencia, setUrgencia] = useState("todas");
  const [page, setPage] = useState(1);
  const [dynamicLots, setDynamicLots] = useState<Lot[]>([]);

  useEffect(() => setMounted(true), []);

  // Cargar lotes dinámicos del backend
  useEffect(() => {
    if (!mounted) return;
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`/api/lots?status=activo&country=${country}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancel && data?.ok && Array.isArray(data.lots)) {
          setDynamicLots(data.lots);
        }
      } catch {
        // silent: marketplace sigue funcionando con productos estáticos
      }
    })();
    return () => {
      cancel = true;
    };
  }, [country, mounted]);

  // Reset region when country changes
  useEffect(() => {
    setRegion("todas");
    setPage(1);
  }, [country]);

  useEffect(() => {
    setPage(1);
  }, [q, categoria, urgencia, region]);

  const effectiveCountry: CountryCode = mounted ? country : "MX";

  const staticFiltered = useMemo(
    () =>
      filterProducts({
        country: effectiveCountry,
        categoria,
        region,
        urgencia,
        q: q.trim() || undefined,
      }),
    [effectiveCountry, categoria, region, urgencia, q],
  );

  const dynamicAsProducts = useMemo(
    () =>
      dynamicLots
        .filter((l) => l.country === effectiveCountry)
        .map(lotToProduct),
    [dynamicLots, effectiveCountry],
  );

  const dynamicFiltered = useMemo(() => {
    return dynamicAsProducts.filter((p) => {
      if (categoria !== "todas" && p.categoria !== categoria) return false;
      if (region !== "todas" && p.productor.estado !== region && p.productor.region !== region) {
        return false;
      }
      if (urgencia !== "todas" && p.urgencia !== urgencia) return false;
      if (q.trim()) {
        const qLow = q.toLowerCase();
        if (
          !p.nombre.toLowerCase().includes(qLow) &&
          !p.productor.nombre.toLowerCase().includes(qLow)
        )
          return false;
      }
      return true;
    });
  }, [dynamicAsProducts, categoria, region, urgencia, q]);

  // Lotes dinámicos primero (suelen ser más frescos)
  const combined = useMemo(
    () => [...dynamicFiltered, ...staticFiltered],
    [dynamicFiltered, staticFiltered],
  );

  const totalPages = Math.max(1, Math.ceil(combined.length / PER_PAGE));
  const visible = combined.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalGlobal = products.length + dynamicLots.length;
  const regionOptions = getRegionsForCountry(effectiveCountry);
  const activeCountry = COUNTRIES.find((c) => c.code === effectiveCountry) ?? COUNTRIES[0];

  function clearFilters() {
    setQ("");
    setCategoria("todas");
    setRegion("todas");
    setUrgencia("todas");
  }

  const hasFilters =
    q.length > 0 ||
    categoria !== "todas" ||
    region !== "todas" ||
    urgencia !== "todas";

  return (
    <>
      <section className="border-b border-border-soft bg-surface">
        <Container className="py-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
            Marketplace B2B · LATAM
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Productos perecederos directos del productor.
          </h1>
          <p className="mt-3 max-w-2xl text-muted leading-relaxed">
            Cada lote incluye condiciones IoT en vivo, certificaciones
            verificadas y trazabilidad QR para tu consumidor final. Selecciona
            tu país para ver oferta y precios locales.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            {[
              { v: totalGlobal, l: "lotes en LATAM" },
              { v: 10, l: "países" },
              { v: 10, l: "monedas locales" },
              { v: "98%", l: "cadena de frío" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-full bg-surface-2 px-3 py-1.5 text-muted"
              >
                <strong className="text-ink">{s.v}</strong> {s.l}
              </div>
            ))}
          </div>

          {/* Country tabs */}
          <div className="mt-8 -mx-1 overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 px-1 min-w-max">
              {COUNTRIES.map((c) => {
                const active = c.code === effectiveCountry;
                return (
                  <motion.button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountry(c.code);
                      markSelected();
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                      active
                        ? "border-brand bg-brand text-white shadow-sm"
                        : "border-border-soft bg-surface text-ink hover:border-brand/40"
                    }`}
                  >
                    <span aria-hidden="true" className="text-base leading-none">
                      {c.flag}
                    </span>
                    <span className="font-medium">{c.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <Container className="relative py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Filters
              FIX (mobile overlap bug): el contenedor de filtros debe quedar
              SIEMPRE por encima de la lista al hacer scroll.
              - `sticky top-16 sm:top-20` mantiene los filtros fijos bajo el navbar.
              - `z-30` garantiza que el listado no se superponga (los products
                cards usan motion + backdrop-blur badges que sin z-index explícito
                creaban stacking contexts compitiendo con el aside).
              - `shadow-sm` + `bg-surface` aseguran contraste visual sobre el
                contenido que pasa por debajo.
              - En mobile el aside tiene altura máxima del viewport con scroll
                interno propio para no tapar todo el screen. */}
          <aside className="rounded-2xl border border-border-soft bg-surface shadow-sm lg:shadow-none p-5 sticky top-16 sm:top-20 z-30 max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] overflow-y-auto h-fit lg:h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ink">Filtros</h2>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted hover:text-ink inline-flex items-center gap-1"
                >
                  <X size={12} /> Limpiar
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="q"
                  className="block text-xs font-medium text-muted mb-1.5"
                >
                  Buscar
                </label>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <Input
                    id="q"
                    type="search"
                    placeholder="Producto, productor…"
                    className="pl-9"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="categoria"
                  className="block text-xs font-medium text-muted mb-1.5"
                >
                  Categoría
                </label>
                <Select
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c === "todas" ? "Todas las categorías" : c}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-xs font-medium text-muted mb-1.5"
                >
                  Región de {activeCountry.name}
                </label>
                <Select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {regionOptions.map((c) => (
                    <option key={c} value={c}>
                      {c === "todas" ? "Todas las regiones" : c}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label
                  htmlFor="urgencia"
                  className="block text-xs font-medium text-muted mb-1.5"
                >
                  Urgencia
                </label>
                <Select
                  id="urgencia"
                  value={urgencia}
                  onChange={(e) => setUrgencia(e.target.value)}
                >
                  {urgencias.map((c) => (
                    <option key={c} value={c}>
                      {c === "todas"
                        ? "Cualquiera"
                        : c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="rounded-xl bg-brand/5 p-4 mt-2">
                <p className="text-xs font-medium text-brand-dark">
                  ¿Eres productor en {activeCountry.name}?
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Publica tus lotes directamente desde tu dashboard.
                </p>
                <Button size="sm" variant="outline" className="mt-3 w-full">
                  Aprender más
                </Button>
              </div>
            </div>
          </aside>

          {/* Listing */}
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-sm text-muted">
                <span aria-hidden="true" className="mr-1">
                  {activeCountry.flag}
                </span>
                Mostrando <strong className="text-ink">{combined.length}</strong>{" "}
                lote{combined.length !== 1 && "s"} en {activeCountry.name}
                {dynamicFiltered.length > 0 && (
                  <span className="ml-2 text-brand">
                    ({dynamicFiltered.length} recién publicado{dynamicFiltered.length !== 1 && "s"})
                  </span>
                )}
              </p>
              <p className="text-xs text-muted">
                Página {page} de {totalPages}
              </p>
            </div>

            {combined.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-soft bg-surface p-16 text-center">
                <p className="text-ink font-medium">Sin resultados</p>
                <p className="mt-1 text-sm text-muted">
                  Ajusta los filtros o cambia de país para ver más opciones.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${effectiveCountry}-${page}-${categoria}-${region}-${urgencia}-${q}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {visible.map((p) => {
                    const fresh = (p as Product & { _isFresh?: boolean })._isFresh === true;
                    return <ProductCard key={p.id} product={p} freshBadge={fresh} />;
                  })}
                </motion.div>
              </AnimatePresence>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`grid h-9 min-w-[36px] place-items-center rounded-lg px-2 text-sm font-medium transition-colors ${
                      n === page
                        ? "bg-brand text-white"
                        : "border border-border-soft hover:bg-surface-2"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
