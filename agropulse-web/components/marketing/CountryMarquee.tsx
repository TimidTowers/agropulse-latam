"use client";

import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/countries";

export function CountryMarquee() {
  // Duplicate the list so the loop is seamless
  const items = [...COUNTRIES, ...COUNTRIES];

  return (
    <section
      aria-label="Países donde opera AgroPulse"
      className="border-y border-border-soft bg-surface/60 overflow-hidden"
    >
      <div className="py-7 relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
        <motion.div
          className="flex gap-10 whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {items.map((c, i) => (
            <div
              key={`${c.code}-${i}`}
              className="inline-flex items-center gap-3 text-sm"
            >
              <span className="text-3xl leading-none" aria-hidden="true">
                {c.flag}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="text-xs text-muted">
                  {c.productors.toLocaleString("es-MX")} productores
                </span>
              </div>
              <span className="ml-8 h-1.5 w-1.5 rounded-full bg-border-soft" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
