import Link from "next/link";
import { Globe, AtSign, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { HEADQUARTERS } from "@/lib/countries";

const cols = [
  {
    title: "Producto",
    links: [
      { href: "/marketplace", label: "Marketplace B2B" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/sensores", label: "IoT en tiempo real" },
      { href: "/planes", label: "Planes y precios" },
    ],
  },
  {
    title: "LATAM",
    links: [
      { href: "/paises", label: "Países donde operamos" },
      { href: "/productores", label: "Productores" },
      { href: "/sustentabilidad", label: "Sustentabilidad" },
      { href: "/carrito", label: "Carrito" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/blog", label: "Blog" },
      { href: "/contacto", label: "Contacto" },
      { href: "/casos-de-exito", label: "Casos de éxito" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terminos", label: "Términos de servicio" },
      { href: "/legal/privacidad", label: "Política de privacidad" },
      { href: "/legal/cookies", label: "Aviso de cookies" },
      { href: "/legal/contacto-dpo", label: "Contacto DPO" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-surface mt-24">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-flex" aria-label="AgroPulse">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
              El pulso inteligente de tu cosecha. AgriTech costarricense que
              reduce las pérdidas post-cosecha con IoT, ML y un marketplace B2B.
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <p className="inline-flex items-center gap-2 font-medium text-ink">
                <span aria-hidden="true">🇨🇷</span>
                <span>Hecho en Costa Rica · Pura Vida AgriTech</span>
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
                aria-label="WhatsApp AgroPulse"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-muted hover:bg-surface-2 hover:text-ink transition-colors"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={`mailto:${HEADQUARTERS.email}`}
                aria-label="Email"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-muted hover:bg-surface-2 hover:text-ink transition-colors"
              >
                <Mail size={16} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-muted hover:bg-surface-2 hover:text-ink transition-colors"
              >
                <AtSign size={16} />
              </a>
              <a
                href="#"
                aria-label="Sitio"
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
            © {new Date().getFullYear()} AgroPulse Technologies S.A. · Hecho en
            San José, Costa Rica 🇨🇷 · Operamos en 10 países LATAM.
          </p>
          <p className="text-xs text-muted">
            ODS 2 · ODS 12 · ODS 13 — Comprometidos con la sostenibilidad.
          </p>
        </div>
      </Container>
    </footer>
  );
}
