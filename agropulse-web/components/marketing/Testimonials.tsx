import { Container } from "@/components/ui/Container";
import { Quote, Star } from "lucide-react";

const testimonios = [
  {
    cita:
      "En seis meses bajamos las mermas de café de 18% a 7%. AgroPulse cambió la forma en que tomamos decisiones cada mañana en la finca.",
    nombre: "Carolina Solís",
    cargo: "Gerente de operaciones",
    empresa: "Finca La Candelilla · Tarrazú, Costa Rica 🇨🇷",
    avatar: "https://i.pravatar.cc/200?img=5",
  },
  {
    cita:
      "Vendemos a tres cadenas de supermercados sin intermediarios. La trazabilidad por QR fue lo que nos abrió esas puertas.",
    nombre: "Roberto Salinas",
    cargo: "Productor / CEO",
    empresa: "Invernaderos La Esperanza · Querétaro, México 🇲🇽",
    avatar: "https://i.pravatar.cc/200?img=15",
  },
  {
    cita:
      "El pronóstico de demanda nos ayudó a planear ciclos completos de piña. Ya no cosechamos a ciegas. Es el futuro del agro latinoamericano.",
    nombre: "Lucía Mora",
    cargo: "Coordinadora agrícola",
    empresa: "Piñas del Norte · Pital, Costa Rica 🇨🇷",
    avatar: "https://i.pravatar.cc/200?img=49",
  },
];

export function Testimonials() {
  return (
    <section className="relative">
      <Container className="py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
            Casos reales
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Productores que ya están transformando su negocio.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonios.map((t) => (
            <figure
              key={t.nombre}
              className="rounded-2xl border border-border-soft bg-surface p-7 shadow-sm flex flex-col"
            >
              <Quote size={24} className="text-brand/30" />
              <blockquote className="mt-3 text-ink leading-relaxed flex-1">
                {t.cita}
              </blockquote>
              <div className="mt-5 flex items-center gap-1 text-warm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" stroke="none" />
                ))}
              </div>
              <figcaption className="mt-4 flex items-center gap-3 pt-4 border-t border-border-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">{t.nombre}</p>
                  <p className="text-xs text-muted">
                    {t.cargo} · {t.empresa}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
