/**
 * stock-utils — helpers SERVER-ONLY de stock efectivo.
 *
 * Stock efectivo = stock base (catálogo estático o lote runtime)
 *                  − vendido confirmado − reservado activo (TTL 2h).
 *
 * NO importar desde componentes client: depende de lib/db/store (in-memory).
 */
import { products } from "@/lib/mock-data/products";
import { lotsDb, stockDb } from "@/lib/db/store";
import type { CountryCode } from "@/lib/countries";

/**
 * Stock base de un producto: catálogo estático (campo stock) o lote
 * dinámico (quantity). null si el id no existe en ninguna fuente.
 */
export function getBaseStock(productId: string): number | null {
  const p = products.find((x) => x.id === productId || x.slug === productId);
  if (p) return p.stock;
  const lot = lotsDb.findById(productId);
  if (lot) return lot.quantity;
  return null;
}

/** Stock efectivo de un producto/lote. null si el id no existe. */
export function getEffectiveStockFor(productId: string): number | null {
  const base = getBaseStock(productId);
  if (base === null) return null;
  return stockDb.getEffective(productId, base);
}

/**
 * Mapa { productId → stock efectivo } de todos los productos estáticos
 * de un país + sus lotes dinámicos activos.
 */
export function getStocksForCountry(
  country: CountryCode,
): Record<string, number> {
  const stocks: Record<string, number> = {};
  for (const p of products) {
    if (p.country !== country) continue;
    stocks[p.id] = stockDb.getEffective(p.id, p.stock);
  }
  for (const lot of lotsDb.listActive(country)) {
    stocks[lot.id] = stockDb.getEffective(lot.id, lot.quantity);
  }
  return stocks;
}
