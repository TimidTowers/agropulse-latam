"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { COUNTRIES, getCountry, type CountryCode } from "@/lib/countries";
import { SUCCESS_CASES, type SuccessCase } from "@/lib/mock-data/success-cases";
import { ProductImage } from "@/components/marketplace/ProductImage";

type Filter = "all" | CountryCode;

function CaseCard({ sc }: { sc: SuccessCase }) {
  const country = getCountry(sc.country);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-44 overflow-hidden bg-surface-2">
        <ProductImage
          src={sc.imagen}
          alt={`${sc.producto} — ${sc.productorName}`}
          productKey={sc.slug}
          className="h-full w-full object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute top-3 right-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
          {sc.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <span aria-hidden="true">{country.flag}</span>
          <span className="font-medium text-ink">{country.name}</span>
          <span aria-hidden="true">·</span>
          <span>{sc.region}</span>
        </p>

        <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink leading-snug">
          {sc.titulo}
        </h3>

        <p className="mt-2 text-sm text-muted leading-relaxed">{sc.resumen}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {sc.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl bg-surface-2/60 border border-border-soft px-2 py-2.5 text-center"
            >
              <p className="text-sm font-semibold tracking-tight text-brand">
                {m.value}
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        <figure className="mt-4 flex-1 border-t border-border-soft pt-4">
          <Quote size={16} className="text-brand/40" aria-hidden="true" />
          <blockquote className="mt-1.5 text-sm italic text-ink leading-relaxed">
            “{sc.quote}”
          </blockquote>
          <figcaption className="mt-2 text-xs text-muted">
            <span className="font-semibold text-ink">{sc.quoteAuthor}</span> ·{" "}
            {sc.quoteRole} · {sc.cooperativa}
          </figcaption>
        </figure>
      </div>
    </motion.article>
  );
}

export function CasesGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? SUCCESS_CASES
        : SUCCESS_CASES.filter((sc) => sc.country === filter),
    [filter],
  );

  return (
    <div>
      {/* Chips de filtro por país (Todos + CR primero) */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filtrar casos de éxito por país"
      >
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            filter === "all"
              ? "border-brand bg-brand text-white shadow-sm"
              : "border-border-soft bg-surface text-muted hover:bg-surface-2 hover:text-ink"
          }`}
        >
          Todos
        </button>
        {COUNTRIES.map((country) => (
          <button
            key={country.code}
            type="button"
            onClick={() => setFilter(country.code)}
            aria-pressed={filter === country.code}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === country.code
                ? "border-brand bg-brand text-white shadow-sm"
                : "border-border-soft bg-surface text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <span aria-hidden="true">{country.flag}</span>
            {country.name}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        Mostrando{" "}
        <span className="font-semibold text-ink">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "caso" : "casos"}
        {filter !== "all" && (
          <>
            {" "}
            de{" "}
            <span className="font-medium text-ink">
              {getCountry(filter).name}
            </span>
          </>
        )}
        .
      </p>

      <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((sc) => (
            <CaseCard key={sc.id} sc={sc} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
