/**
 * stock-utils — helpers SERVER-ONLY de stock efectivo.
 *
 * Stock efectivo = stock base (catálogo estático o lote runtime)
 *                  − vendido confirmado − reservado activo (TTL 2h).
 *
 * NO importar desde componentes client: depende de lib/db/store (async/Supabase).
 */
import { products } from "@/lib/mock-data/products";
import { lotsDb, stockDb } from "@/lib/db/store";
import type { CountryCode } from "@/lib/countries";

/**
 * Stock base de un producto: catálogo estático (campo stock) o lote
 * dinámico (quantity). null si el id no existe en ninguna fuente.
 */
export async function getBaseStock(productId: string): Promise<number | null> {
  const p = products.find((x) => x.id === productId || x.slug === productId);
  if (p) return p.stock;
  const lot = await lotsDb.findById(productId);
  if (lot) return lot.quantity;
  return null;
}

/** Stock efectivo de un producto/lote. null si el id no existe. */
export async function getEffectiveStockFor(productId: string): Promise<number | null> {
  const base = await getBaseStock(productId);
  if (base === null) return null;
  return await stockDb.getEffective(productId, base);
}

/**
 * Mapa { productId → stock efectivo } de todos los productos estáticos
 * de un país + sus lotes dinámicos activos.
 */
export async function getStocksForCountry(
  country: CountryCode,
): Promise<Record<string, number>> {
  const stocks: Record<string, number> = {};
  const staticProducts = products.filter((p) => p.country === country);
  const activeLots = await lotsDb.listActive(country);
  const entries = await Promise.all([
    ...staticProducts.map(
      async (p) => [p.id, await stockDb.getEffective(p.id, p.stock)] as const,
    ),
    ...activeLots.map(
      async (lot) => [lot.id, await stockDb.getEffective(lot.id, lot.quantity)] as const,
    ),
  ]);
  for (const [id, stock] of entries) stocks[id] = stock;
  return stocks;
}
