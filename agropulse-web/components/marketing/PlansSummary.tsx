import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { plans } from "@/lib/mock-data/plans";
import { cn } from "@/lib/utils";

export function PlansSummary() {
  return (
    <section className="relative border-t border-border-soft bg-surface-2/30">
      <Container className="py-24">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
            Planes
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Empieza pequeño. Crece a tu ritmo.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Todos los planes incluyen 30 días de prueba sin tarjeta. Sin
            penalidades por cancelar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative rounded-2xl border bg-surface p-7 flex flex-col",
                p.destacado
                  ? "border-brand shadow-lg ring-1 ring-brand/20"
                  : "border-border-soft shadow-sm",
              )}
            >
              {p.destacado && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand text-white text-xs font-medium px-3 py-1">
                  Más popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-ink tracking-tight">
                {p.nombre}
              </h3>
              <p className="text-sm text-muted mt-1">{p.sensores}</p>
              <p className="mt-5">
                <span className="text-3xl font-semibold text-ink tracking-tight">
                  {p.precio}
                </span>
                <span className="ml-1 text-sm text-muted">{p.periodo}</span>
              </p>
              <ul className="mt-6 flex flex-col gap-2.5 flex-1">
                {p.features.slice(0, 5).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-ink/85"
                  >
                    <Check
                      size={14}
                      className="mt-1 text-brand flex-shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/planes" className="mt-7">
                <Button
                  className="w-full"
                  variant={p.destacado ? "primary" : "outline"}
                >
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
