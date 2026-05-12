"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { COUNTRIES, getCountry, type CountryCode } from "@/lib/countries";

interface Productor {
  id: string;
  nombre: string;
  region: string;
  estado: string;
  country: CountryCode;
  rating: number;
  yearsActive: number;
  certificaciones: string[];
  productos: string[];
  categorias: string[];
  imagen: string;
  productoEjemploId: string;
}

export function ProductoresGrid({
  productores,
}: {
  productores: Productor[];
}) {
  const [country, setCountry] = useState<string>("todos");
  const [categoria, setCategoria] = useState<string>("todas");
  const [cert, setCert] = useState<string>("todas");

  const allCategorias = useMemo(() => {
    const set = new Set<string>();
    productores.forEach((p) => p.categorias.forEach((c) => set.add(c)));
    return ["todas", ...Array.from(set).sort()];
  }, [productores]);

  const allCerts = useMemo(() => {
    const set = new Set<string>();
    productores.forEach((p) => p.certificaciones.forEach((c) => set.add(c)));
    return ["todas", ...Array.from(set).sort()];
  }, [productores]);

  const filtered = useMemo(() => {
    return productores.filter((p) => {
      if (country !== "todos" && p.country !== country) return false;
      if (categoria !== "todas" && !p.categorias.includes(categoria)) return false;
      if (cert !== "todas" && !p.certificaciones.includes(cert)) return false;
      return true;
    });
  }, [productores, country, categoria, cert]);

  return (
    <>
      <div className="rounded-2xl border border-border-soft bg-surface p-5 mb-8">
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor="prod-country"
              className="block text-xs font-medium text-muted mb-1.5"
            >
              País
            </label>
            <Select
              id="prod-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="todos">Todos los países</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label
              htmlFor="prod-cat"
              className="block text-xs font-medium text-muted mb-1.5"
            >
              Categoría
            </label>
            <Select
              id="prod-cat"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {allCategorias.map((c) => (
                <option key={c} value={c}>
                  {c === "todas" ? "Todas las categorías" : c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label
              htmlFor="prod-cert"
              className="block text-xs font-medium text-muted mb-1.5"
            >
              Certificación
            </label>
            <Select
              id="prod-cert"
              value={cert}
              onChange={(e) => setCert(e.target.value)}
            >
              {allCerts.map((c) => (
                <option key={c} value={c}>
                  {c === "todas" ? "Todas las certificaciones" : c}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Mostrando <strong className="text-ink">{filtered.length}</strong>{" "}
          productor{filtered.length !== 1 && "es"} de los{" "}
          {productores.length} registrados.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p, i) => {
          const c = getCountry(p.country);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: (i % 12) * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border-soft bg-surface overflow-hidden flex flex-col hover:shadow-md hover:border-brand/30 transition-all"
            >
              <div className="relative aspect-[16/9] bg-surface-2 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur border border-border-soft px-2 py-1 text-[10px] font-medium text-ink">
                  <span aria-hidden="true">{c.flag}</span>
                  {c.name}
                </span>
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur border border-border-soft px-2 py-1 text-[10px] font-medium text-ink">
                  <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
                  {p.rating.toFixed(1)}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-ink tracking-tight">
                  {p.nombre}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                  <MapPin size={12} className="text-brand" />
                  {p.region}, {p.estado}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {p.yearsActive} años de experiencia ·{" "}
                  {p.productos.length} producto
                  {p.productos.length !== 1 && "s"}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.categorias.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.certificaciones.slice(0, 3).map((cer) => (
                    <span
                      key={cer}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700"
                    >
                      <ShieldCheck size={10} />
                      {cer}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-5 border-t border-border-soft mt-5 flex items-center justify-between">
                  <span className="text-xs text-muted truncate max-w-[60%]">
                    {p.productos[0]}
                    {p.productos.length > 1 && ` +${p.productos.length - 1}`}
                  </span>
                  <Link
                    href={`/marketplace/${p.productoEjemploId}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
                  >
                    Ver perfil
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border-soft bg-surface p-16 text-center">
          <p className="text-ink font-medium">Sin productores</p>
          <p className="mt-1 text-sm text-muted">
            Ajusta los filtros para ver otros productores.
          </p>
        </div>
      )}
    </>
  );
}
