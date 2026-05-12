"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mt-5 max-w-md mx-auto flex gap-2 flex-wrap justify-center"
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.p
            key="ok"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700"
          >
            <Check size={16} /> ¡Listo! Te enviamos un correo de confirmación.
          </motion.p>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2 flex-wrap justify-center w-full"
          >
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              className="flex-1 min-w-[220px] rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
            <button
              type="submit"
              className="rounded-xl bg-brand text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-dark transition-colors"
            >
              Suscribirme
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
