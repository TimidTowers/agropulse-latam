import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative">
      <Container className="py-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient text-white p-10 sm:p-14 lg:p-20 shadow-xl">
          <div
            className="absolute inset-0 opacity-20"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 40%)",
            }}
          />
          <div className="relative max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              ¿Listo para reducir tus pérdidas post-cosecha?
            </h2>
            <p className="mt-5 text-white/85 text-lg leading-relaxed max-w-2xl">
              Agenda una demo personalizada de 30 minutos. Te mostramos cómo
              AgroPulse se adapta a tu operación específica.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contacto">
                <Button
                  size="xl"
                  className="bg-white text-brand-dark hover:bg-white/90"
                >
                  Agendar demo
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/planes">
                <Button
                  size="xl"
                  className="bg-white/10 text-white border border-white/30 hover:bg-white/20"
                >
                  Ver planes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
