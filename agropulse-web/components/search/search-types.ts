/**
 * Tipos compartidos de la búsqueda global (Ctrl/Cmd+K).
 * Usados por app/api/search/route.ts (server) y GlobalSearch.tsx (client).
 */

export type SearchResultType = "producto" | "lote" | "caso" | "pagina";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** Emoji de bandera del país (productos, lotes y casos). */
  flag?: string;
  /** URL de imagen (productos, lotes y casos). */
  image?: string;
}

export interface SearchResponse {
  ok: boolean;
  results: SearchResult[];
}
