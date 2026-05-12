import Link from "next/link";
import { Globe, AtSign, MessageCircle, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

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
      { href: "#", label: "Casos de éxito" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Términos de servicio" },
      { href: "#", label: "Política de privacidad" },
      { href: "#", label: "Aviso de cookies" },
      { href: "#", label: "Acuerdo SLA" },
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
              El pulso inteligente de tu cosecha. Reducimos las pérdidas
              post-cosecha con IoT, ML y un marketplace B2B.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: Globe, href: "#", label: "Sitio" },
                { Icon: AtSign, href: "#", label: "X / Twitter" },
                { Icon: MessageCircle, href: "#", label: "LinkedIn" },
                { Icon: Mail, href: "mailto:hola@agropulse.mx", label: "Email" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft text-muted hover:bg-surface-2 hover:text-ink transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
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
            © {new Date().getFullYear()} AgroPulse Technologies S.A. de C.V.
            Hecho en Querétaro, México. Presente en 10 países LATAM.
          </p>
          <p className="text-xs text-muted">
            ODS 2 · ODS 12 · ODS 13 — Comprometidos con la sostenibilidad.
          </p>
        </div>
      </Container>
    </footer>
  );
}
