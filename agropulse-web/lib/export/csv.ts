/**
 * Utilidades de exportación CSV — client-safe (sin imports server-only).
 *
 * - toCsv(rows, headers): genera CSV con BOM UTF-8 (U+FEFF) para que Excel
 *   detecte la codificación y muestre bien acentos/₡. Separador coma y escape
 *   de comillas según RFC 4180 (CRLF).
 * - downloadCsv(filename, csv): crea un Blob y dispara la descarga.
 */

export interface CsvHeader {
  /** clave de la fila */
  key: string;
  /** etiqueta visible en la primera fila del CSV */
  label: string;
}

/** BOM UTF-8 (U+FEFF) — hace que Excel abra el CSV con la codificación correcta. */
export const CSV_BOM = String.fromCharCode(0xfeff);

/** Escapa un valor CSV: envuelve en comillas si contiene coma/comilla/salto. */
export function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Convierte filas + headers a CSV. Por defecto antepone el BOM UTF-8;
 * `bom: false` permite componer varias secciones en un solo archivo
 * (el BOM solo debe ir una vez, al inicio).
 */
export function toCsv<T extends object>(
  rows: ReadonlyArray<T>,
  headers: CsvHeader[],
  opts: { bom?: boolean } = {},
): string {
  const { bom = true } = opts;
  const lines: string[] = [];
  lines.push(headers.map((h) => csvEscape(h.label)).join(","));
  for (const row of rows) {
    lines.push(
      headers
        .map((h) => csvEscape((row as Record<string, unknown>)[h.key]))
        .join(","),
    );
  }
  return (bom ? CSV_BOM : "") + lines.join("\r\n");
}

/** Descarga un CSV en el navegador (crea un Blob + <a download>). */
export function downloadCsv(filename: string, csv: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
