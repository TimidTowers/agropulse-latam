"use client";

// Convertido a client component para soportar i18n (useT). No usa APIs
// server-only; el SSR sigue emitiendo ES por el patrón hydration-safe.

import Link from "next/link";
import { Globe, AtSign, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { HEADQUARTERS } from "@/lib/countries";
import { useT } from "@/lib/i18n/store";

export function Footer() {
  const t = useT();

  const cols = [
    {
      title: t("footer", "colProducto"),
      links: [
        { href: "/marketplace", label: t("footer", "linkMarketplaceB2b") },
        { href: "/dashboard", label: t("footer", "linkDashboard") },
        { href: "/dashboard/sensores", label: t("footer", "linkIot") },
        { href: "/planes", label: t("footer", "linkPlanes") },
      ],
    },
    {
      title: t("footer", "colLatam"),
      links: [
        { href: "/paises", label: t("footer", "linkPaises") },
        { href: "/productores", label: t("footer", "linkProductores") },
        { href: "/sustentabilidad", label: t("footer", "linkSustentabilidad") },
        { href: "/carrito", label: t("footer", "linkCarrito") },
      ],
    },
    {
      title: t("footer", "colEmpresa"),
      links: [
        { href: "/nosotros", label: t("footer", "linkNosotros") },
        { href: "/blog", label: t("footer", "linkBlog") },
        { href: "/contacto", label: t("footer", "linkContacto") },
        { href: "/casos-de-exito", label: t("footer", "linkCasos") },
      ],
    },
    {
      title: t("footer", "colLegal"),
      links: [
        { href: "/legal/terminos", label: t("footer", "linkTerminos") },
        { href: "/legal/privacidad", label: t("footer", "linkPrivacidad") },
        { href: "/legal/cookies", label: t("footer", "linkCookies") },
        { href: "/legal/contacto-dpo", label: t("footer", "linkDpo") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border-soft bg-surface mt-24">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-flex" aria-label="AgroPulse">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
              {t("footer", "tagline")}
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <p className="inline-flex items-center gap-2 font-medium text-ink">
                <span aria-hidden="true">🇨🇷</span>
                <span>{t("footer", "madeIn")}</span>
              </p>
              <p className="inline-flex items-center gap-2 text-muted">
                <MapPin size={14} className="text-brand" />
                <span>{HEADQUARTERS.fullAddress}</span>
              </p>
              <p>
                <a
                  href={`mailto:${HEADQUARTERS.email}`}
                  className="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors"
                >
                  <Mail size={14} className="text-brand" />
                  <span>{HEADQUARTERS.email}</span>
                </a>
              </p>
              <p>
                <a
                  href={`tel:${HEADQUARTERS.phoneE164}`}
                  className="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors"
                >
                  <Phone size={14} className="text-brand" />
                  <span>{HEADQUARTERS.phone}</span>
                </a>
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <a
                href={HEADQUARTERS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer", "ariaWhatsapp")}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-muted hover:bg-surface-2 hover:text-ink transition-colors"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={`mailto:${HEADQUARTERS.email}`}
                aria-label={t("footer", "ariaEmail")}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-muted hover:bg-surface-2 hover:text-ink transition-colors"
              >
                <Mail size={16} />
              </a>
              <a
                href="#"
                aria-label={t("footer", "ariaLinkedin")}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-muted hover:bg-surface-2 hover:text-ink transition-colors"
              >
                <AtSign size={16} />
              </a>
              <a
                href="#"
                aria-label={t("footer", "ariaSitio")}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-muted hover:bg-surface-2 hover:text-ink transition-colors"
              >
                <Globe size={16} />
              </a>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-ink tracking-tight mb-3">
                {c.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted hover:text-ink transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border-soft pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {t("footer", "copyright").replace(
              "{year}",
              String(new Date().getFullYear()),
            )}
          </p>
          <p className="text-xs text-muted">{t("footer", "ods")}</p>
        </div>
      </Container>
    </footer>
  );
}
