import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "./ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";

export const metadata: Metadata = {
  title: "Contacto — AgroPulse",
  description:
    "Hablemos. Equipo AgroPulse, oficinas en Querétaro, México. Atención de lunes a viernes 9-19 hrs.",
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Oficinas",
    valor: "Centro Histórico, Querétaro, México",
    sub: "C.P. 76000",
  },
  {
    icon: Mail,
    label: "Email",
    valor: "hola@agropulse.mx",
    sub: "Respondemos en menos de 24h",
  },
  {
    icon: Phone,
    label: "Teléfono",
    valor: "+52 442 123 4567",
    sub: "WhatsApp Business",
  },
  {
    icon: Clock,
    label: "Horario",
    valor: "Lun – Vie · 9:00 – 19:00",
    sub: "Soporte 24/7 para Enterprise",
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
              <Badge variant="brand">Contacto</Badge>
              <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
                Hablemos del{" "}
                <span className="text-brand-gradient">futuro de tu cosecha.</span>
              </h1>
              <p className="mt-5 text-lg text-muted leading-relaxed">
                Nuestro equipo comercial responde personalmente en menos de 24
                horas. Para emergencias técnicas, escríbenos por WhatsApp.
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
                  return (
                    <div
                      key={c.label}
                      className="rounded-2xl border border-border-soft bg-surface p-5"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">
                        <Icon size={16} />
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                        {c.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {c.valor}
                      </p>
                      <p className="text-xs text-muted">{c.sub}</p>
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
