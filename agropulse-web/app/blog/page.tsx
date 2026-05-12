import type { Metadata } from "next";
import { Calendar, Clock, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/blog/NewsletterForm";

export const metadata: Metadata = {
  title: "Blog AgroPulse — Tendencias AgriTech LATAM",
  description:
    "Artículos sobre IoT, machine learning, casos de éxito y sostenibilidad en la cadena de suministro agroalimentaria.",
};

interface Article {
  id: string;
  titulo: string;
  extracto: string;
  categoria:
    | "Tendencias AgriTech"
    | "Casos de éxito"
    | "Tecnología IoT"
    | "Sostenibilidad";
  fecha: string;
  autor: string;
  readMin: number;
  imagen: string;
  destacado?: boolean;
}

const articulos: Article[] = [
  {
    id: "a-001",
    titulo: "Cómo el IoT redujo 38% las mermas en una cooperativa de Antigua",
    extracto:
      "Un caso real del programa piloto AgroPulse Guatemala: sensores LoRaWAN, alertas tempranas y matching B2B en una finca cafetalera centenaria.",
    categoria: "Casos de éxito",
    fecha: "2026-04-28",
    autor: "Diego Ramírez",
    readMin: 7,
    imagen:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    destacado: true,
  },
  {
    id: "a-002",
    titulo: "Las 5 tendencias AgriTech que dominarán LATAM en 2026",
    extracto:
      "Desde drones autónomos hasta blockchain ligero para trazabilidad: el roadmap del sector agro digital en la región según McKinsey y Deloitte.",
    categoria: "Tendencias AgriTech",
    fecha: "2026-04-15",
    autor: "María Fernanda López",
    readMin: 9,
    imagen:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a-003",
    titulo: "Cadena de frío sin rupturas: cómo lo hicimos para Banano de Urabá",
    extracto:
      "Lo que aprendimos al instalar 240 sensores en transporte marítimo Colombia-Hamburgo y mantener temperatura constante durante 18 días.",
    categoria: "Tecnología IoT",
    fecha: "2026-04-02",
    autor: "Luis Mendoza",
    readMin: 6,
    imagen:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a-004",
    titulo: "Quinua peruana: trazabilidad QR del Altiplano a Whole Foods",
    extracto:
      "Cómo cooperativas de Puno usan AgroPulse para certificar origen, fair trade y rendir reportes ESG a sus compradores internacionales.",
    categoria: "Casos de éxito",
    fecha: "2026-03-20",
    autor: "Ana Sofía Hernández",
    readMin: 8,
    imagen:
      "https://images.unsplash.com/photo-1612257999691-c08d8b8c80b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a-005",
    titulo: "Sostenibilidad: 84,500 toneladas de alimento rescatadas en 2025",
    extracto:
      "Reporte anual de impacto AgroPulse: equivalente a la alimentación de 230,000 familias durante un año en toda LATAM.",
    categoria: "Sostenibilidad",
    fecha: "2026-03-10",
    autor: "Luis Mendoza",
    readMin: 5,
    imagen:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a-006",
    titulo: "Machine Learning aplicado al pronóstico de demanda de paltas",
    extracto:
      "Detrás de las gráficas: cómo combinamos XGBoost y Prophet para anticipar consumo y reducir overstock de productos perecederos.",
    categoria: "Tecnología IoT",
    fecha: "2026-02-28",
    autor: "María Fernanda López",
    readMin: 11,
    imagen:
      "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a-007",
    titulo: "Mercado Brasileño: el siguiente paso de AgroPulse",
    extracto:
      "Açaí, café Bourbon y soja del Cerrado: nuestra estrategia de expansión y los retos regulatorios de operar en Brasil.",
    categoria: "Tendencias AgriTech",
    fecha: "2026-02-12",
    autor: "Sebastián Torres",
    readMin: 6,
    imagen:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a-008",
    titulo: "ESG y agricultura: la regulación europea CSRD llega al campo",
    extracto:
      "Qué deben preparar productores LATAM exportadores a la UE en 2026 y cómo AgroPulse automatiza el reporte de Scope 3.",
    categoria: "Sostenibilidad",
    fecha: "2026-01-30",
    autor: "Ana Sofía Hernández",
    readMin: 8,
    imagen:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  },
];

const categoriaColor = {
  "Tendencias AgriTech": "info" as const,
  "Casos de éxito": "success" as const,
  "Tecnología IoT": "brand" as const,
  Sostenibilidad: "accent" as const,
};

function fmtFecha(d: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(d));
}

export default function BlogPage() {
  const destacado = articulos.find((a) => a.destacado) ?? articulos[0];
  const resto = articulos.filter((a) => a.id !== destacado.id);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="border-b border-border-soft bg-surface">
          <Container className="py-14">
            <Reveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Blog AgroPulse
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
                Tendencias AgriTech{" "}
                <span className="text-brand-gradient">LATAM.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-muted text-lg leading-relaxed">
                Casos, datos y reflexiones sobre tecnología aplicada a la
                cadena de suministro agroalimentaria.
              </p>
            </Reveal>
          </Container>
        </section>

        <Container className="py-12">
          {/* Featured */}
          <Reveal>
            <article className="rounded-2xl border border-border-soft bg-surface overflow-hidden mb-10 grid lg:grid-cols-[1.1fr_1fr] hover:shadow-md transition-all">
              <div className="aspect-[16/10] lg:aspect-auto bg-surface-2 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={destacado.imagen}
                  alt={destacado.titulo}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <Badge variant={categoriaColor[destacado.categoria]}>
                  Destacado · {destacado.categoria}
                </Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink leading-tight">
                  {destacado.titulo}
                </h2>
                <p className="mt-3 text-muted leading-relaxed">
                  {destacado.extracto}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={12} /> {destacado.autor}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={12} /> {fmtFecha(destacado.fecha)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} /> {destacado.readMin} min lectura
                  </span>
                </div>
                <span className="mt-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand cursor-pointer hover:text-brand-dark">
                  Leer más →
                </span>
              </div>
            </article>
          </Reveal>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resto.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <article className="rounded-2xl border border-border-soft bg-surface overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col">
                  <div className="aspect-[16/9] bg-surface-2 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.imagen}
                      alt={a.titulo}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <Badge variant={categoriaColor[a.categoria]}>
                      {a.categoria}
                    </Badge>
                    <h3 className="mt-3 font-semibold text-ink tracking-tight leading-snug">
                      {a.titulo}
                    </h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed flex-1">
                      {a.extracto}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border-soft flex items-center justify-between text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={11} /> {fmtFecha(a.fecha)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} /> {a.readMin} min
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 rounded-2xl border border-brand/20 bg-brand/5 p-8 text-center">
              <h3 className="text-xl font-semibold text-ink">
                Suscríbete al newsletter
              </h3>
              <p className="text-muted mt-1.5 text-sm">
                Una vez al mes: tendencias AgriTech LATAM, casos prácticos y
                lanzamientos AgroPulse.
              </p>
              <NewsletterForm />
            </div>
          </Reveal>
        </Container>
      </main>
      <Footer />
    </>
  );
}
