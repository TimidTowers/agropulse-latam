"use client";

// Convertido a client component para soportar i18n (useT). Solo consume
// datos puros de lib/countries y componentes ya client (Reveal, Counter).

import { Container } from "@/components/ui/Container";
import {
  TrendingDown,
  AlertOctagon,
  DollarSign,
  Globe,
  Users,
  Map as MapIcon,
  Sprout,
  Languages,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { COUNTRIES, totalHectareas, totalProductors } from "@/lib/countries";
import { LOCALE_TAGS } from "@/lib/i18n/dictionaries";
import { useLocale, useT } from "@/lib/i18n/store";

export function Stats() {
  const t = useT();
  const { locale } = useLocale();
  const productors = totalProductors();
  const hectareas = totalHectareas();

  const problemStats = [
    { icon: AlertOctagon, valor: t("stats", "stat1Value"), etiqueta: t("stats", "stat1Label") },
    { icon: TrendingDown, valor: t("stats", "stat2Value"), etiqueta: t("stats", "stat2Label") },
    { icon: DollarSign, valor: t("stats", "stat3Value"), etiqueta: t("stats", "stat3Label") },
    { icon: Globe, valor: t("stats", "stat4Value"), etiqueta: t("stats", "stat4Label") },
  ];

  const lead = t("stats", "lead")
    .replace("{paises}", String(COUNTRIES.length))
    .replace("{productores}", productors.toLocaleString(LOCALE_TAGS[locale]));

  return (
    <section className="relative border-y border-border-soft bg-surface-2/40">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
              {t("stats", "kicker")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              {t("stats", "title1")}
              <span className="text-brand-gradient">
                {t("stats", "titleHighlight")}
              </span>
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">{lead}</p>
          </div>
        </Reveal>

        {/* LATAM aggregate counters */}
        <Reveal delay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <MapIcon size={20} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                <Counter value={COUNTRIES.length} />
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {t("stats", "counterPaises")}
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Users size={20} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                <Counter value={productors} />
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {t("stats", "counterProductores")}
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Sprout size={20} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                <Counter value={hectareas} /> ha
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {t("stats", "counterHectareas")}
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Languages size={20} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                <Counter value={10} /> {t("stats", "monedasSuffix")}
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {t("stats", "counterMonedas")}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Problem stats */}
        <Reveal>
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-warm mb-3">
              {t("stats", "problemKicker")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              {t("stats", "problemTitle1")}
              <span className="text-muted">{t("stats", "problemTitle2")}</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problemStats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.valor} delay={0.05 + idx * 0.07}>
                <div className="rounded-2xl bg-surface border border-border-soft p-6 shadow-sm h-full">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon size={20} />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                    {s.valor}
                  </p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {s.etiqueta}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted">{t("stats", "sources")}</p>
      </Container>
    </section>
  );
}
