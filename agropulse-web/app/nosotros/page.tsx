import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Compass,
  Leaf,
  Eye,
  Heart,
  Sparkles,
  TreeDeciduous,
  Recycle,
  Earth,
  MapPin,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  FileSearch,
  Cloud,
  Network,
  Award,
  Briefcase,
  BookOpen,
  Code2,
  Database,
  Server,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HEADQUARTERS } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Sobre nosotros — Sebastián Torres · Fundador de AgroPulse",
  description:
    "Sebastián Torres, estudiante de Ingeniería en Sistemas de la Universidad Latina de Costa Rica (ULatina) y fundador de AgroPulse. Especializado en ciberseguridad, análisis de datos y auditoría de sistemas.",
};

// ============================================================================
// CERTIFICACIONES DEL FUNDADOR
// ============================================================================

type CertArea =
  | "Ciberseguridad"
  | "Análisis de datos"
  | "Auditoría de sistemas"
  | "Cloud computing"
  | "Redes y conectividad"
  | "Hacking ético";

interface Certification {
  id: string;
  nombre: string;
  institucion: string;
  fecha: string;
  area: CertArea;
  icon: typeof ShieldCheck;
  credentialId?: string;
}

const CERTIFICACIONES: Certification[] = [
  {
    id: "comptia-security-plus",
    nombre: "CompTIA Security+ (SY0-701)",
    institucion: "CompTIA",
    fecha: "Marzo 2024",
    area: "Ciberseguridad",
    icon: ShieldCheck,
    credentialId: "COMP001020449304",
  },
  {
    id: "google-data-analytics",
    nombre: "Google Data Analytics Professional Certificate",
    institucion: "Google · Coursera",
    fecha: "Julio 2024",
    area: "Análisis de datos",
    icon: BarChart3,
    credentialId: "9XK4FZ8MQRPC",
  },
  {
    id: "iso-27001-foundation",
    nombre: "ISO/IEC 27001:2022 Foundation",
    institucion: "TÜV Rheinland Costa Rica",
    fecha: "Octubre 2024",
    area: "Auditoría de sistemas",
    icon: FileSearch,
    credentialId: "TRCR-27001-2024-0488",
  },
  {
    id: "ccna",
    nombre: "Cisco Certified Network Associate (CCNA)",
    institucion: "Cisco Networking Academy",
    fecha: "Enero 2025",
    area: "Redes y conectividad",
    icon: Network,
    credentialId: "CCNA-202501-CR-7714",
  },
  {
    id: "aws-cloud-practitioner",
    nombre: "AWS Certified Cloud Practitioner (CLF-C02)",
    institucion: "Amazon Web Services",
    fecha: "Abril 2025",
    area: "Cloud computing",
    icon: Cloud,
    credentialId: "AWS-CLF-3M2KQHPV9D",
  },
  {
    id: "ceh-v13",
    nombre: "Certified Ethical Hacker (CEH v13)",
    institucion: "EC-Council",
    fecha: "Agosto 2025",
    area: "Hacking ético",
    icon: ShieldCheck,
    credentialId: "ECC78992-2025",
  },
];

const AREA_COLORS: Record<CertArea, string> = {
  Ciberseguridad: "bg-rose-100 text-rose-900 ring-rose-200",
  "Análisis de datos": "bg-sky-100 text-sky-900 ring-sky-200",
  "Auditoría de sistemas": "bg-violet-100 text-violet-900 ring-violet-200",
  "Cloud computing": "bg-orange-100 text-orange-900 ring-orange-200",
  "Redes y conectividad": "bg-emerald-100 text-emerald-900 ring-emerald-200",
  "Hacking ético": "bg-zinc-900 text-white ring-zinc-700",
};

// ============================================================================
// HABILIDADES TÉCNICAS
// ============================================================================

const SKILL_GROUPS = [
  {
    titulo: "Lenguajes",
    icon: Code2,
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Bash", "C#"],
  },
  {
    titulo: "Frameworks & UI",
    icon: Sparkles,
    items: ["Next.js", "React", "Tailwind CSS", "Node.js", "Express", "FastAPI"],
  },
  {
    titulo: "Datos & BI",
    icon: Database,
    items: [
      "PostgreSQL",
      "MongoDB",
      "Power BI",
      "Pandas",
      "NumPy",
      "Excel avanzado",
    ],
  },
  {
    titulo: "Infraestructura",
    icon: Server,
    items: ["AWS", "Vercel", "Docker", "Linux", "GitHub Actions", "Cisco IOS"],
  },
];

// ============================================================================
// CONTENIDO ESTÁTICO (resto del sitio)
// ============================================================================

const valores = [
  {
    icon: Leaf,
    titulo: "Sostenibilidad",
    descripcion:
      "Cada decisión técnica considera el impacto en el suelo, el agua y la huella de carbono de la cadena alimentaria.",
  },
  {
    icon: Eye,
    titulo: "Transparencia",
    descripcion:
      "Datos abiertos para productor y comprador. Sin caja negra. La trazabilidad va hasta el consumidor final.",
  },
  {
    icon: Sparkles,
    titulo: "Innovación",
    descripcion:
      "ML, IoT y blockchain ligera aplicados al problema real: que se pierdan menos toneladas de alimentos.",
  },
  {
    icon: Heart,
    titulo: "Equidad",
    descripcion:
      "Diseñamos para el pequeño productor, no solo para grandes corporativos. La tecnología debe llegar a todos.",
  },
  {
    icon: Compass,
    titulo: "Trazabilidad",
    descripcion:
      "Cada lote tiene su historia verificable: dónde nació, cómo se manejó, hasta dónde llegó.",
  },
];

const ods = [
  {
    n: 2,
    titulo: "Hambre Cero",
    descripcion:
      "Reducir las pérdidas post-cosecha equivale a producir más alimento sin sembrar más hectáreas.",
    icon: Leaf,
    color: "bg-amber-100 text-amber-900",
  },
  {
    n: 12,
    titulo: "Producción y Consumo Responsables",
    descripcion:
      "El desperdicio alimentario es uno de los blancos directos del ODS 12.3 de la ONU.",
    icon: Recycle,
    color: "bg-orange-100 text-orange-900",
  },
  {
    n: 13,
    titulo: "Acción por el Clima",
    descripcion:
      "Cada tonelada de alimento perdida genera ~2.5 tCO₂e de emisiones evitables.",
    icon: Earth,
    color: "bg-emerald-100 text-emerald-900",
  },
];

const historia = [
  {
    year: "2023",
    titulo: "La chispa",
    descripcion:
      "Sebastián, durante su carrera de Ingeniería en Sistemas en la Universidad Latina, recorre fincas de café en Tarrazú y plantaciones de piña en el norte de Costa Rica. Observa cómo se pierden cosechas enteras por rupturas de cadena de frío y falta de visibilidad. Empieza a investigar y prototipar.",
  },
  {
    year: "2024",
    titulo: "Fundación en San José",
    descripcion:
      "Sebastián constituye AgroPulse Technologies S.A. en San José, Costa Rica. Primer piloto con 5 productores del Valle Central y Tarrazú combinando sensores IoT, dashboard analítico y trazabilidad QR.",
  },
  {
    year: "2025",
    titulo: "Crecimiento y reconocimientos",
    descripcion:
      "AgroPulse gana espacio en aceleradoras AgriTech regionales y suma certificaciones técnicas (AWS, CEH, ISO 27001) para reforzar la seguridad y escalabilidad de la plataforma.",
  },
  {
    year: "2026",
    titulo: "Lanzamiento regional",
    descripcion:
      "Marketplace abierto desde San José. 500+ productores onboarded en Valle Central, Guanacaste, Limón y Puntarenas; expansión simultánea a 9 países LATAM más.",
  },
];

// ============================================================================
// PAGE
// ============================================================================

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative border-b border-border-soft">
          <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
          <Container className="relative py-20 sm:py-28">
            <div className="max-w-3xl">
              <Badge variant="brand">🇨🇷 Sobre nosotros · Hecho en Costa Rica</Badge>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
                Una sola persona, una sola{" "}
                <span className="text-brand-gradient">misión.</span>
              </h1>
              <p className="mt-6 text-lg text-muted leading-relaxed">
                AgroPulse Technologies S.A. nació en{" "}
                <strong className="text-ink">San José, Costa Rica</strong> en
                2024 como un proyecto personal de Sebastián Torres, estudiante
                de Ingeniería en Sistemas de la Universidad Latina de Costa
                Rica (ULatina). Una convicción simple: el desperdicio
                alimentario es uno de los problemas más resolubles del siglo, y
                la tecnología debe estar al alcance del pequeño cafetalero de
                Tarrazú o del piñero de Pital, no solo del gigante exportador.
              </p>
            </div>
          </Container>
        </section>

        {/* Fundador */}
        <section id="fundador" className="bg-surface-2/40">
          <Container className="py-20">
            <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">
              {/* Avatar + datos rápidos */}
              <div className="space-y-5">
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-border-soft shadow-md bg-brand-gradient">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://i.pravatar.cc/600?img=12"
                    alt="Sebastián Torres, fundador de AgroPulse"
                    className="h-full w-full object-cover mix-blend-multiply"
                  />
                </div>
                <div className="rounded-2xl border border-border-soft bg-surface p-5">
                  <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                    Datos rápidos
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2.5">
                      <GraduationCap size={16} className="text-brand mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-ink">
                          Universidad Latina de Costa Rica
                        </p>
                        <p className="text-xs text-muted">
                          Ingeniería en Sistemas Informáticos · ULatina
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Award size={16} className="text-brand mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-ink">
                          6 certificaciones técnicas activas
                        </p>
                        <p className="text-xs text-muted">
                          Ciberseguridad, datos, auditoría y cloud
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-brand mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-ink">
                          San José, Costa Rica
                        </p>
                        <p className="text-xs text-muted">🇨🇷 Pura Vida AgriTech</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href="https://www.linkedin.com/in/sebastian-torres-agropulse"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:border-brand/40 transition-colors"
                      aria-label="LinkedIn de Sebastián Torres"
                    >
                      <Briefcase size={13} /> LinkedIn
                    </a>
                    <a
                      href="https://github.com/TimidTowers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:border-brand/40 transition-colors"
                      aria-label="GitHub de Sebastián Torres"
                    >
                      <BookOpen size={13} /> GitHub
                    </a>
                    <a
                      href={`mailto:${HEADQUARTERS.email}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:border-brand/40 transition-colors"
                      aria-label="Email"
                    >
                      <Mail size={13} /> Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                  El fundador
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                  Sebastián Torres
                </h2>
                <p className="mt-2 text-lg text-brand font-medium">
                  Fundador, CEO &amp; arquitecto técnico
                </p>
                <Badge variant="default" className="mt-3">
                  <GraduationCap size={12} /> Estudiante de Ingeniería en
                  Sistemas · Universidad Latina (ULatina)
                </Badge>

                <div className="mt-7 space-y-4 text-muted leading-relaxed">
                  <p>
                    Sebastián es estudiante de Ingeniería en Sistemas
                    Informáticos de la{" "}
                    <strong className="text-ink">
                      Universidad Latina de Costa Rica (ULatina)
                    </strong>
                    , una de las universidades privadas con mayor trayectoria
                    en ingenierías de la región. Desde su segundo año empezó a
                    explorar la intersección entre tecnología y agricultura
                    costarricense.
                  </p>
                  <p>
                    Su área de expertise combina{" "}
                    <strong className="text-ink">ciberseguridad</strong>,{" "}
                    <strong className="text-ink">análisis de datos</strong> y{" "}
                    <strong className="text-ink">auditoría de sistemas</strong>
                    , con una visión particular: las plataformas que manejan
                    cadenas alimentarias necesitan ser tan rigurosas con la
                    seguridad de la información como las plataformas
                    financieras. Eso definió el ADN técnico de AgroPulse desde
                    el primer commit.
                  </p>
                  <p>
                    Fuera del código, Sebastián camina cafetales en Tarrazú,
                    visita plantaciones en Guanacaste y conversa con productores
                    para entender qué problema real hay que resolver. La
                    plataforma es una respuesta concreta a lo que vio en el
                    campo.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                  <div className="rounded-xl border border-border-soft bg-surface p-4 text-center">
                    <p className="text-2xl font-semibold tracking-tight text-ink">
                      6
                    </p>
                    <p className="mt-1 text-xs text-muted">Certificaciones</p>
                  </div>
                  <div className="rounded-xl border border-border-soft bg-surface p-4 text-center">
                    <p className="text-2xl font-semibold tracking-tight text-ink">
                      3
                    </p>
                    <p className="mt-1 text-xs text-muted">Áreas técnicas</p>
                  </div>
                  <div className="rounded-xl border border-border-soft bg-surface p-4 text-center">
                    <p className="text-2xl font-semibold tracking-tight text-ink">
                      10
                    </p>
                    <p className="mt-1 text-xs text-muted">Países LATAM</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Certificaciones */}
        <section id="certificaciones" className="border-y border-border-soft">
          <Container className="py-20">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Certificaciones técnicas
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                Formación continua en ciberseguridad, datos, auditoría y cloud.
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Cada certificación está verificable por su credential ID con la
                institución otorgante.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CERTIFICACIONES.map((c) => {
                const Icon = c.icon;
                return (
                  <article
                    key={c.id}
                    className="group rounded-2xl border border-border-soft bg-surface p-6 hover:shadow-md hover:border-brand/30 transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand shrink-0">
                        <Icon size={20} />
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${AREA_COLORS[c.area]}`}
                      >
                        {c.area}
                      </span>
                    </div>
                    <h3 className="mt-5 font-semibold text-ink leading-snug tracking-tight">
                      {c.nombre}
                    </h3>
                    <dl className="mt-3 space-y-1.5 text-sm flex-1">
                      <div className="flex items-start gap-2">
                        <dt className="text-xs font-medium text-muted shrink-0 w-24">
                          Institución
                        </dt>
                        <dd className="text-ink font-medium">{c.institucion}</dd>
                      </div>
                      <div className="flex items-start gap-2">
                        <dt className="text-xs font-medium text-muted shrink-0 w-24">
                          Obtenida
                        </dt>
                        <dd className="text-ink">{c.fecha}</dd>
                      </div>
                      {c.credentialId && (
                        <div className="flex items-start gap-2">
                          <dt className="text-xs font-medium text-muted shrink-0 w-24">
                            Credential
                          </dt>
                          <dd className="text-ink font-mono text-xs break-all">
                            {c.credentialId}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Habilidades técnicas */}
        <section className="bg-surface-2/40">
          <Container className="py-20">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Stack técnico
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                Las herramientas detrás de AgroPulse.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SKILL_GROUPS.map((g) => {
                const Icon = g.icon;
                return (
                  <div
                    key={g.titulo}
                    className="rounded-2xl border border-border-soft bg-surface p-6"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 font-semibold text-ink">{g.titulo}</h3>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {g.items.map((item) => (
                        <li
                          key={item}
                          className="inline-flex items-center rounded-md bg-surface-2 px-2 py-1 text-xs font-medium text-ink"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Misión / Visión */}
        <section className="border-t border-border-soft">
          <Container className="py-20">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border-soft bg-surface p-8 shadow-sm">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Target size={22} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
                  Misión
                </h2>
                <p className="mt-3 text-muted leading-relaxed">
                  Reducir las pérdidas post-cosecha de productores agrícolas
                  mediante una plataforma E-business que integra IoT, analítica
                  predictiva y un marketplace B2B.
                </p>
              </div>
              <div className="rounded-2xl border border-border-soft bg-surface p-8 shadow-sm">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-emerald-800">
                  <Compass size={22} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
                  Visión
                </h2>
                <p className="mt-3 text-muted leading-relaxed">
                  Ser la plataforma líder en LATAM para la gestión inteligente
                  de productos perecederos al 2030, eliminando un millón de
                  toneladas de desperdicio alimentario al año.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Valores */}
        <section className="border-y border-border-soft bg-surface-2/40">
          <Container className="py-20">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Valores
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                Cinco principios que rigen cada producto, contrato y línea de
                código.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {valores.map((v) => {
                const Icon = v.icon;
                return (
                  <article
                    key={v.titulo}
                    className="rounded-2xl border border-border-soft bg-surface p-6"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 font-semibold text-ink">{v.titulo}</h3>
                    <p className="mt-1.5 text-sm text-muted leading-relaxed">
                      {v.descripcion}
                    </p>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Sede Costa Rica */}
        <section id="sede" className="border-b border-border-soft">
          <Container className="py-20">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                  🇨🇷 Nuestra sede
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                  Operamos desde{" "}
                  <span className="text-brand-gradient">San José, Costa Rica.</span>
                </h2>
                <p className="mt-5 text-muted leading-relaxed">
                  Costa Rica es nuestro hogar y nuestro primer mercado. Desde
                  San José coordinamos los pilotos en el Valle Central,
                  Tarrazú, Guanacaste, Limón y Puntarenas. El país combina
                  tradición agrícola exportadora, fuerte vocación sustentable y
                  un ecosistema AgriTech en crecimiento. Pura Vida AgriTech,
                  hecho en Costa Rica para toda Latinoamérica.
                </p>

                <ul className="mt-7 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand shrink-0">
                      <MapPin size={16} />
                    </span>
                    <div>
                      <p className="font-medium text-ink">Head office</p>
                      <p className="text-muted">{HEADQUARTERS.fullAddress}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand shrink-0">
                      <Mail size={16} />
                    </span>
                    <div>
                      <p className="font-medium text-ink">Email oficial</p>
                      <a
                        href={`mailto:${HEADQUARTERS.email}`}
                        className="text-muted hover:text-brand transition-colors break-all"
                      >
                        {HEADQUARTERS.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand shrink-0">
                      <Phone size={16} />
                    </span>
                    <div>
                      <p className="font-medium text-ink">Teléfono · WhatsApp</p>
                      <a
                        href={`tel:${HEADQUARTERS.phoneE164}`}
                        className="text-muted hover:text-brand transition-colors"
                      >
                        {HEADQUARTERS.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand shrink-0">
                      <Globe size={16} />
                    </span>
                    <div>
                      <p className="font-medium text-ink">Cobertura</p>
                      <p className="text-muted">
                        10 países LATAM · operación bilingüe ES/EN
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border-soft shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1518630904902-9e3a26e88c3a?auto=format&fit=crop&w=1200&q=80"
                  alt="Vista del Valle Central de Costa Rica desde San José"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-xl bg-ink/80 backdrop-blur px-4 py-3 text-white">
                  <p className="text-xs uppercase tracking-wider text-accent">
                    🇨🇷 San José · Valle Central
                  </p>
                  <p className="text-sm font-medium mt-0.5">
                    Sede operativa de AgroPulse desde 2024
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Historia */}
        <section className="border-b border-border-soft">
          <Container className="py-20">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                Cronología
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                De una idea en una bodega a una plataforma regional.
              </h2>
            </div>
            <ol className="relative space-y-8 max-w-3xl">
              <span
                className="absolute left-5 top-3 bottom-3 w-px bg-border-soft"
                aria-hidden="true"
              />
              {historia.map((h) => (
                <li key={h.year} className="relative pl-14">
                  <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-brand text-white text-xs font-mono font-semibold">
                    {h.year}
                  </span>
                  <h3 className="font-semibold text-ink">{h.titulo}</h3>
                  <p className="mt-1.5 text-muted leading-relaxed">
                    {h.descripcion}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* ODS */}
        <section
          id="ods"
          className="bg-ink text-white relative overflow-hidden border-b border-border-soft"
        >
          <Container className="relative py-20">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
                ODS impactados
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Tres Objetivos de Desarrollo Sostenible en el corazón del
                producto.
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                El modelo de negocio está alineado con los compromisos de la
                Agenda 2030 de la ONU. Reportamos avances trimestralmente a
                clientes Enterprise.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {ods.map((o) => {
                const Icon = o.icon;
                return (
                  <article
                    key={o.n}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur"
                  >
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${o.color}`}
                    >
                      <Icon size={22} />
                    </div>
                    <p className="mt-5 text-xs font-bold tracking-widest uppercase text-accent">
                      ODS {o.n}
                    </p>
                    <h3 className="mt-1 font-semibold text-lg tracking-tight">
                      {o.titulo}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">
                      {o.descripcion}
                    </p>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section>
          <Container className="py-20">
            <div className="rounded-3xl border border-border-soft bg-surface p-10 sm:p-14 text-center">
              <TreeDeciduous size={36} className="mx-auto text-brand" />
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
                ¿Te suena lo que hacemos?
              </h2>
              <p className="mt-3 text-muted max-w-xl mx-auto">
                Si crees en la agricultura digital justa, hablemos. Estoy
                abierto a colaboraciones técnicas, alianzas con cooperativas y
                conversaciones con productores.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/contacto">
                  <Button size="lg">Hablemos</Button>
                </Link>
                <Link href="/planes">
                  <Button size="lg" variant="outline">
                    Conocer el producto
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
