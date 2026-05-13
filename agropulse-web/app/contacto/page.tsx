import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock, MessageCircle, Languages } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "./ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";
import { HEADQUARTERS } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Contacto — AgroPulse Costa Rica",
  description:
    "Hablemos. AgroPulse, AgriTech costarricense con sede en San José. Atención de lunes a viernes 8:00 a 18:00 hora Costa Rica, soporte para 10 países LATAM.",
};

type ContactCard = {
  icon: typeof MapPin;
  label: string;
  valor: string;
  sub: string;
  href?: string;
  external?: boolean;
};

const contactInfo: ContactCard[] = [
  {
    icon: MapPin,
    label: "Sede principal",
    valor: "San José, Costa Rica",
    sub: "🇨🇷 Hecho en Costa Rica",
  },
  {
    icon: Mail,
    label: "Email",
    valor: HEADQUARTERS.email,
    sub: "Respondemos en menos de 24h",
    href: `mailto:${HEADQUARTERS.email}`,
  },
  {
    icon: Phone,
    label: "Teléfono / WhatsApp",
    valor: HEADQUARTERS.phone,
    sub: "Llamadas y WhatsApp Business",
    href: `tel:${HEADQUARTERS.phoneE164}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp directo",
    valor: "Escríbenos ahora",
    sub: "Chat inmediato con el equipo",
    href: HEADQUARTERS.whatsapp,
    external: true,
  },
  {
    icon: Clock,
    label: "Horario",
    valor: "Lun – Vie · 8:00 – 18:00 hora CR",
    sub: "Soporte 24/7 para Enterprise",
  },
  {
    icon: Languages,
    label: "Idiomas",
    valor: "Español · Inglés",
    sub: "Equipo bilingüe en San José",
  },
];

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="border-b border-border-soft">
          <Container className="py-16 sm:py-20">
            <div className="max-w-2xl">
              <Badge variant="brand">🇨🇷 Contacto · Sede Costa Rica</Badge>
              <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
                Hablemos del{" "}
                <span className="text-brand-gradient">futuro de tu cosecha.</span>
              </h1>
              <p className="mt-5 text-lg text-muted leading-relaxed">
                Somos una empresa costarricense con sede en San José. Atendemos
                productores y compradores en 10 países LATAM. Nuestro equipo
                comercial responde personalmente en menos de 24 horas; para
                consultas urgentes, escríbenos directo por WhatsApp al{" "}
                <a
                  href={HEADQUARTERS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand hover:text-brand-dark"
                >
                  {HEADQUARTERS.phone}
                </a>
                .
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-16">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10">
            {/* Form */}
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">
                Envíanos un mensaje
              </h2>
              <p className="text-sm text-muted mb-6">
                Todos los campos son requeridos.
              </p>
              <ContactForm />
            </div>

            {/* Info + Map */}
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-3">
                {contactInfo.map((c) => {
                  const Icon = c.icon;
                  const cardContent = (
                    <>
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">
                        <Icon size={16} />
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                        {c.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink break-words">
                        {c.valor}
                      </p>
                      <p className="text-xs text-muted">{c.sub}</p>
                    </>
                  );

                  if (c.href) {
                    return (
                      <a
                        key={c.label}
                        href={c.href}
                        target={c.external ? "_blank" : undefined}
                        rel={c.external ? "noopener noreferrer" : undefined}
                        className="rounded-2xl border border-border-soft bg-surface p-5 hover:border-brand/40 hover:bg-brand/[0.03] transition-colors block"
                      >
                        {cardContent}
                      </a>
                    );
                  }
                  return (
                    <div
                      key={c.label}
                      className="rounded-2xl border border-border-soft bg-surface p-5"
                    >
                      {cardContent}
                    </div>
                  );
                })}
              </div>
              <div className="rounded-2xl overflow-hidden border border-border-soft h-80">
                <ContactMap />
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
