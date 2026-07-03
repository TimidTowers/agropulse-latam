/**
 * GET /api/search?q= — búsqueda global pública (command palette Ctrl/Cmd+K).
 *
 * Busca en paralelo sobre 4 fuentes:
 *   1. Productos estáticos del catálogo (lib/mock-data/products.ts)
 *   2. Lotes activos creados por productores (lotsDb.listActive — Supabase)
 *   3. Casos de éxito (lib/mock-data/success-cases.ts)
 *   4. Páginas estáticas del sitio (array hardcodeado)
 *
 * Matching: normaliza acentos + lowercase, substring. Score simple:
 * empieza-con > contiene; campo primario (nombre/título) > secundario.
 * Devuelve máx. 12 resultados agrupados por tipo.
 */
import type { NextRequest } from "next/server";
import { products } from "@/lib/mock-data/products";
import { SUCCESS_CASES } from "@/lib/mock-data/success-cases";
import { lotsDb } from "@/lib/db/store";
import { getCountry } from "@/lib/countries";
import type {
  SearchResult,
  SearchResultType,
} from "@/components/search/search-types";

/** Normaliza para matching: sin acentos, lowercase, sin espacios extremos. */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Score simple de relevancia:
 *   100 primario empieza con q · 80 primario contiene q
 *    60 secundario empieza con q · 40 secundario contiene q · 0 sin match
 */
function scoreMatch(q: string, primary: string, secondary: string[]): number {
  const np = normalize(primary);
  if (np.startsWith(q)) return 100;
  if (np.includes(q)) return 80;
  let best = 0;
  for (const field of secondary) {
    const nf = normalize(field);
    if (nf.startsWith(q)) best = Math.max(best, 60);
    else if (nf.includes(q)) best = Math.max(best, 40);
    if (best === 60) break;
  }
  return best;
}

interface StaticPage {
  title: string;
  href: string;
  subtitle: string;
  keywords: string;
}

const STATIC_PAGES: StaticPage[] = [
  { title: "Marketplace", href: "/marketplace", subtitle: "Catálogo B2B de productos frescos con IoT", keywords: "comprar productos catalogo mercado tienda" },
  { title: "Planes", href: "/planes", subtitle: "Suscripciones y precios de la plataforma", keywords: "precios suscripcion pricing sensores membresia" },
  { title: "Países", href: "/paises", subtitle: "Presencia en 10 países de LATAM", keywords: "cobertura operaciones latam donde estamos" },
  { title: "Productores", href: "/productores", subtitle: "Únete como productor a AgroPulse", keywords: "vender cooperativas agricultores registrarse" },
  { title: "Casos de éxito", href: "/casos-de-exito", subtitle: "Historias reales de productores LATAM", keywords: "testimonios resultados historias clientes" },
  { title: "Sustentabilidad", href: "/sustentabilidad", subtitle: "Impacto ambiental y compromiso ODS", keywords: "medio ambiente ods impacto verde carbono" },
  { title: "Blog", href: "/blog", subtitle: "Noticias y guías AgriTech", keywords: "articulos noticias guias novedades" },
  { title: "Nosotros", href: "/nosotros", subtitle: "Equipo e historia de AgroPulse", keywords: "empresa equipo historia mision quienes somos" },
  { title: "Contacto", href: "/contacto", subtitle: "Escríbenos, estamos para ayudarte", keywords: "soporte ayuda correo formulario telefono" },
  { title: "Dashboard", href: "/dashboard", subtitle: "Monitoreo IoT en tiempo real", keywords: "sensores iot panel metricas telemetria" },
  { title: "Mis pedidos", href: "/pedidos", subtitle: "Historial y seguimiento de tus pedidos", keywords: "ordenes compras seguimiento tracking envios" },
  { title: "Carrito", href: "/carrito", subtitle: "Tu carrito de compras", keywords: "checkout compra cesta pagar" },
];

interface Scored {
  score: number;
  result: SearchResult;
}

async function searchProducts(q: string): Promise<Scored[]> {
  const out: Scored[] = [];
  for (const p of products) {
    const score = scoreMatch(q, p.nombre, [
      p.productor.nombre,
      p.categoria,
      p.productor.region,
      p.productor.estado,
    ]);
    if (score === 0) continue;
    const country = getCountry(p.country);
    out.push({
      score,
      result: {
        type: "producto",
        id: p.id,
        title: p.nombre,
        subtitle: `${p.productor.nombre} · ${p.categoria} · ${p.productor.region}`,
        href: `/marketplace/${p.id}`,
        flag: country.flag,
        image: p.imagen,
      },
    });
  }
  return out;
}

async function searchLots(q: string): Promise<Scored[]> {
  let lots: Awaited<ReturnType<typeof lotsDb.listActive>> = [];
  try {
    lots = await lotsDb.listActive();
  } catch {
    // Fuente dinámica no disponible: la búsqueda global sigue funcionando.
    lots = [];
  }
  const out: Scored[] = [];
  for (const lot of lots) {
    const score = scoreMatch(q, lot.productName, [
      lot.productorName,
      lot.category,
      lot.region,
      lot.cooperativa,
    ]);
    if (score === 0) continue;
    const country = getCountry(lot.country);
    out.push({
      score,
      result: {
        type: "lote",
        id: lot.id,
        title: lot.productName,
        subtitle: `${lot.productorName} · ${lot.region} · ${lot.quantity} ${lot.unit}`,
        href: `/marketplace/${lot.id}`,
        flag: country.flag,
        image: lot.images[0],
      },
    });
  }
  return out;
}

async function searchCases(q: string): Promise<Scored[]> {
  const out: Scored[] = [];
  for (const sc of SUCCESS_CASES) {
    const score = scoreMatch(q, sc.titulo, [
      sc.producto,
      sc.productorName,
      sc.cooperativa,
      sc.region,
      sc.categoria,
    ]);
    if (score === 0) continue;
    const country = getCountry(sc.country);
    out.push({
      score,
      result: {
        type: "caso",
        id: sc.id,
        title: sc.titulo,
        subtitle: `${sc.productorName} · ${sc.producto} · ${sc.region}`,
        href: "/casos-de-exito",
        flag: country.flag,
        image: sc.imagen,
      },
    });
  }
  return out;
}

async function searchPages(q: string): Promise<Scored[]> {
  const out: Scored[] = [];
  for (const page of STATIC_PAGES) {
    const score = scoreMatch(q, page.title, [page.keywords, page.subtitle]);
    if (score === 0) continue;
    out.push({
      score,
      result: {
        type: "pagina",
        id: page.href,
        title: page.title,
        subtitle: page.subtitle,
        href: page.href,
      },
    });
  }
  return out;
}

const MAX_RESULTS = 12;
const TYPE_ORDER: SearchResultType[] = ["producto", "lote", "caso", "pagina"];

export async function GET(req: NextRequest) {
  const q = normalize(req.nextUrl.searchParams.get("q") ?? "");
  if (q.length === 0) {
    return Response.json({ ok: true, results: [] });
  }

  // Las 4 fuentes se consultan en paralelo (lotes es la única realmente async).
  const [prods, lots, cases, pages] = await Promise.all([
    searchProducts(q),
    searchLots(q),
    searchCases(q),
    searchPages(q),
  ]);

  const top = [...prods, ...lots, ...cases, ...pages]
    .sort(
      (a, b) =>
        b.score - a.score || a.result.title.localeCompare(b.result.title, "es"),
    )
    .slice(0, MAX_RESULTS);

  // Agrupados por tipo (orden fijo), preservando el ranking dentro de cada grupo.
  const results: SearchResult[] = TYPE_ORDER.flatMap((type) =>
    top.filter((s) => s.result.type === type).map((s) => s.result),
  );

  return Response.json({ ok: true, results });
}
