import { Container } from "@/components/ui/Container";

const steps = [
  {
    n: "01",
    titulo: "Conecta tus bodegas",
    descripcion:
      "Instalamos los sensores LoRaWAN y los emparejamos con tu plataforma en menos de 48 horas. Sin obras ni costos ocultos.",
  },
  {
    n: "02",
    titulo: "Monitorea y publica",
    descripcion:
      "Tus datos IoT alimentan el dashboard en vivo. Publica tus lotes en el marketplace con un par de clics.",
  },
  {
    n: "03",
    titulo: "Vende y reduce mermas",
    descripcion:
      "Los compradores reciben matching automático. Los datos de trazabilidad acompañan al producto hasta su destino.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border-soft bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <Container className="relative py-24">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            Cómo funciona
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Tres pasos para transformar tu operación post-cosecha.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-7 left-16 right-0 h-px bg-white/10"
                  aria-hidden="true"
                />
              )}
              <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white text-sm font-semibold font-mono">
                {s.n}
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {s.titulo}
              </h3>
              <p className="mt-2.5 text-sm text-white/70 leading-relaxed">
                {s.descripcion}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
