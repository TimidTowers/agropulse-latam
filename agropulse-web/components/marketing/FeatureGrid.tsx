"use client";

// Convertido a client component para soportar i18n (useT).

import {
  Radio,
  Brain,
  ShoppingBag,
  QrCode,
  Zap,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useT } from "@/lib/i18n/store";

export function FeatureGrid() {
  const t = useT();

  const features = [
    {
      icon: Radio,
      titulo: t("features", "f1Title"),
      descripcion: t("features", "f1Desc"),
      pill: t("features", "f1Pill"),
    },
    {
      icon: Brain,
      titulo: t("features", "f2Title"),
      descripcion: t("features", "f2Desc"),
      pill: t("features", "f2Pill"),
    },
    {
      icon: ShoppingBag,
      titulo: t("features", "f3Title"),
      descripcion: t("features", "f3Desc"),
      pill: t("features", "f3Pill"),
    },
    {
      icon: QrCode,
      titulo: t("features", "f4Title"),
      descripcion: t("features", "f4Desc"),
      pill: t("features", "f4Pill"),
    },
    {
      icon: Zap,
      titulo: t("features", "f5Title"),
      descripcion: t("features", "f5Desc"),
      pill: t("features", "f5Pill"),
    },
    {
      icon: Truck,
      titulo: t("features", "f6Title"),
      descripcion: t("features", "f6Desc"),
      pill: t("features", "f6Pill"),
    },
  ];

  return (
    <section id="solucion" className="relative">
      <Container className="py-24">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
            {t("features", "kicker")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            {t("features", "title")}
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            {t("features", "lead")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.titulo}
                className="group rounded-2xl border border-border-soft bg-surface p-6 hover:shadow-md hover:border-brand/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
                    {f.pill}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink tracking-tight">
                  {f.titulo}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {f.descripcion}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
