"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { useCountryStore } from "@/lib/stores/country-store";

export function CountryGridClient() {
  const { setCountry, markSelected } = useCountryStore();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {COUNTRIES.map((c, i) => (
        <motion.div
          key={c.code}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: i * 0.05 }}
          whileHover={{ y: -4 }}
          className={`group relative rounded-2xl border p-6 transition-all flex flex-col ${
            c.isOrigin
              ? "border-brand bg-brand/5 ring-2 ring-brand/30 hover:shadow-lg hover:bg-brand/10"
              : "border-border-soft bg-surface hover:shadow-md hover:border-brand/30"
          }`}
        >
          {c.isOrigin && (
            <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              🇨🇷 País de origen
            </span>
          )}
          <div className="flex items-start justify-between mb-4">
            <span
              className="text-5xl leading-none"
              role="img"
              aria-label={c.name}
            >
              {c.flag}
            </span>
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted">
              {c.code} · {c.currency}
            </span>
          </div>
          <h3 className="font-semibold text-ink text-lg">{c.name}</h3>
          <p className="text-xs text-muted">{c.capital}</p>

          <p className="mt-3 text-sm text-muted italic leading-snug">
            “{c.taglineLocal}”
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface-2/60 p-2.5">
              <p className="font-semibold text-ink tabular-nums">
                {c.productors.toLocaleString("es-MX")}
              </p>
              <p className="text-muted">Productores</p>
            </div>
            <div className="rounded-lg bg-surface-2/60 p-2.5">
              <p className="font-semibold text-ink tabular-nums">
                {c.hectareas.toLocaleString("es-MX")}
              </p>
              <p className="text-muted">Hectáreas</p>
            </div>
          </div>

          <div className="mt-4 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-muted mb-1.5">
              Top productos
            </p>
            <ul className="text-xs text-ink space-y-1">
              {c.topProducts.slice(0, 3).map((p) => (
                <li key={p} className="inline-flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-brand" /> {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-border-soft flex items-center justify-between">
            <span className="text-xs text-muted">
              {c.regions.length} regiones
            </span>
            <Link
              href="/marketplace"
              onClick={() => {
                setCountry(c.code);
                markSelected();
              }}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              Ver productores
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
