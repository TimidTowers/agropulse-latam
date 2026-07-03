"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Leaf } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/store";

export function Hero() {
  const t = useT();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <motion.div
        className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, #84CC16 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 30, -10, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute -top-20 left-0 h-[380px] w-[380px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #15803D 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -20, 20, 0],
          y: [0, 30, -10, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <Container className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand shadow-sm"
            >
              <span aria-hidden="true">🇨🇷</span>
              {t("hero", "badge")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-[1.05]"
            >
              {t("hero", "title1")}
              <span className="text-brand-gradient">
                {t("hero", "titleHighlight")}
              </span>
              <br />
              {t("hero", "title2")}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-muted shadow-sm"
            >
              <Sparkles size={13} className="text-warm" />
              {t("hero", "meta")}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg text-muted leading-relaxed"
            >
              {t("hero", "sub1")}
              <strong className="text-ink">{t("hero", "subStrong")}</strong>
              {t("hero", "sub2")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/planes">
                <Button size="xl">
                  {t("hero", "ctaPrimary")}
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="xl" variant="outline">
                  {t("hero", "ctaSecondary")}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted"
            >
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-brand" />
                <span>{t("hero", "trustProducers")}</span>
              </div>
              <div className="h-4 w-px bg-border-soft" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">
                  {t("hero", "trustGmvValue")}
                </span>
                <span>{t("hero", "trustGmvLabel")}</span>
              </div>
            </motion.div>
          </div>

          {/* Hero visual: dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="absolute -inset-4 bg-brand-gradient opacity-10 rounded-3xl blur-2xl"
              aria-hidden="true"
            />
            <div className="relative rounded-2xl border border-border-soft bg-surface shadow-xl overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-border-soft px-4 py-2.5 bg-surface-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs text-muted font-mono">
                  app.agropulse.io/dashboard
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border-soft p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      {t("hero", "mockMermas")}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-ink">6.4%</p>
                    <p className="text-xs text-emerald-700 font-medium">-28%</p>
                  </div>
                  <div className="rounded-xl border border-border-soft p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      {t("hero", "mockVentas")}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-ink">$412k</p>
                    <p className="text-xs text-emerald-700 font-medium">+14%</p>
                  </div>
                </div>
                <div className="rounded-xl border border-border-soft p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-ink">
                      {t("hero", "mockTemp")}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t("hero", "mockEnRango")}
                    </span>
                  </div>
                  <svg viewBox="0 0 300 80" className="w-full h-16">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#15803D" stopOpacity="0.3" />
                        <stop offset="1" stopColor="#15803D" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,55 C30,40 60,50 90,42 C120,34 150,45 180,30 C210,18 240,28 270,22 L300,20 L300,80 L0,80 Z"
                      fill="url(#chart-grad)"
                    />
                    <path
                      d="M0,55 C30,40 60,50 90,42 C120,34 150,45 180,30 C210,18 240,28 270,22 L300,20"
                      stroke="#15803D"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-amber-900">
                      {t("hero", "mockLote")}
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {t("hero", "mockPriorizar")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
