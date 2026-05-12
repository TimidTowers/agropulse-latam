import {
  Radio,
  Brain,
  ShoppingBag,
  QrCode,
  Zap,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const features = [
  {
    icon: Radio,
    titulo: "IoT en tiempo real",
    descripcion:
      "Sensores LoRaWAN miden temperatura, humedad y vida útil cada minuto en bodegas, cámaras frigoríficas y transporte.",
    pill: "Hardware incluido",
  },
  {
    icon: Brain,
    titulo: "Pronóstico ML",
    descripcion:
      "Modelos XGBoost y Prophet pronostican demanda por región, temporada y tipo de producto con +85% de precisión.",
    pill: "Sin código",
  },
  {
    icon: ShoppingBag,
    titulo: "Marketplace B2B",
    descripcion:
      "Matching automático oferta-demanda priorizando productos con menor vida útil restante para evitar mermas.",
    pill: "Comisión 4%",
  },
  {
    icon: QrCode,
    titulo: "Trazabilidad QR",
    descripcion:
      "Cada lote recibe un código QR público con la historia completa: siembra, cosecha, transporte y punto de venta.",
    pill: "Blockchain ligera",
  },
  {
    icon: Zap,
    titulo: "Alertas tempranas",
    descripcion:
      "Notificaciones instantáneas si la temperatura, humedad o vida útil salen de rango. Antes de que sea pérdida.",
    pill: "Multicanal",
  },
  {
    icon: Truck,
    titulo: "Logística integrada",
    descripcion:
      "Red de transportistas aliados con cadena de frío certificada. Ruteo optimizado y telemetría continua.",
    pill: "Aliados regionales",
  },
];

export function FeatureGrid() {
  return (
    <section id="solucion" className="relative">
      <Container className="py-24">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
            La solución
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Una plataforma integral para gestionar el ciclo de vida del perecedero.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            AgroPulse combina hardware, software y un marketplace para que el
            productor venda más, pierda menos y comparta los datos correctos con
            sus compradores.
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
