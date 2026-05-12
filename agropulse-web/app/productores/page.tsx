import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProductoresGrid } from "@/components/productores/ProductoresGrid";
import { products } from "@/lib/mock-data/products";

export const metadata: Metadata = {
  title: "Conoce a nuestros productores — AgroPulse",
  description:
    "Productores agrícolas en 10 países LATAM que trabajan con AgroPulse. Filtra por país, categoría y certificaciones.",
};

interface UnifiedProductor {
  id: string;
  nombre: string;
  region: string;
  estado: string;
  country: (typeof products)[number]["country"];
  rating: number;
  yearsActive: number;
  certificaciones: string[];
  productos: string[];
  categorias: string[];
  imagen: string;
  productoEjemploId: string;
}

function buildProductores(): UnifiedProductor[] {
  const map = new Map<string, UnifiedProductor>();
  for (const p of products) {
    const key = p.productor.nombre + p.country;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        id: p.productor.id,
        nombre: p.productor.nombre,
        region: p.productor.region,
        estado: p.productor.estado,
        country: p.country,
        rating: p.productor.rating,
        yearsActive: p.productor.yearsActive,
        certificaciones: [...new Set(p.productor.certificaciones)],
        productos: [p.nombre],
        categorias: [p.categoria],
        imagen: p.imagen,
        productoEjemploId: p.id,
      });
    } else {
      if (!existing.productos.includes(p.nombre))
        existing.productos.push(p.nombre);
      if (!existing.categorias.includes(p.categoria))
        existing.categorias.push(p.categoria);
      for (const c of p.productor.certificaciones) {
        if (!existing.certificaciones.includes(c))
          existing.certificaciones.push(c);
      }
    }
  }
  return Array.from(map.values());
}

export default function ProductoresPage() {
  const productores = buildProductores();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="border-b border-border-soft bg-surface">
          <Container className="py-14">
            <Reveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Red de productores
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
                Conoce a nuestros{" "}
                <span className="text-brand-gradient">productores.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-muted text-lg leading-relaxed">
                Fincas, cooperativas y agroindustrias verificadas en 10 países
                LATAM. Cada productor pasa por nuestro proceso de onboarding y
                certificación digital.
              </p>
            </Reveal>
          </Container>
        </section>

        <Container className="py-12">
          <ProductoresGrid productores={productores} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
