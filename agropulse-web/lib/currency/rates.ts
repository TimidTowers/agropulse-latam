/**
 * AgroPulse — Tipos de cambio fijos (1 USD = N moneda local).
 *
 * Para demo académico usamos tasas estáticas representativas de Mayo 2026.
 * En producción real: integrar una API (exchangerate.host, openexchangerates,
 * fixer.io) con caché de 1h. La API pública de exchangerate.host es gratuita
 * y no requiere API key.
 *
 * Toda conversión pasa por USD como pivote:
 *   amountInTarget = amountInSource / rates[source] * rates[target]
 */
import type { CountryCode } from "@/lib/countries";

/** ISO 4217 currency codes presentes en el sistema + USD. */
export type CurrencyCode =
  | "USD"
  | "MXN"
  | "CRC"
  | "COP"
  | "ARS"
  | "CLP"
  | "PEN"
  | "UYU"
  | "GTQ"
  | "BRL";

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  /** Cuántos decimales mostrar en la UI por defecto */
  decimals: number;
  /** Locale BCP-47 para Intl.NumberFormat */
  locale: string;
  /** Banderitas para selector */
  flag: string;
}

/** Catálogo de monedas soportadas. */
export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: "USD", name: "Dólar estadounidense", symbol: "$", decimals: 2, locale: "en-US", flag: "🇺🇸" },
  MXN: { code: "MXN", name: "Peso mexicano", symbol: "$", decimals: 2, locale: "es-MX", flag: "🇲🇽" },
  CRC: { code: "CRC", name: "Colón costarricense", symbol: "₡", decimals: 0, locale: "es-CR", flag: "🇨🇷" },
  COP: { code: "COP", name: "Peso colombiano", symbol: "$", decimals: 0, locale: "es-CO", flag: "🇨🇴" },
  ARS: { code: "ARS", name: "Peso argentino", symbol: "$", decimals: 0, locale: "es-AR", flag: "🇦🇷" },
  CLP: { code: "CLP", name: "Peso chileno", symbol: "$", decimals: 0, locale: "es-CL", flag: "🇨🇱" },
  PEN: { code: "PEN", name: "Sol peruano", symbol: "S/", decimals: 2, locale: "es-PE", flag: "🇵🇪" },
  UYU: { code: "UYU", name: "Peso uruguayo", symbol: "$U", decimals: 0, locale: "es-UY", flag: "🇺🇾" },
  GTQ: { code: "GTQ", name: "Quetzal guatemalteco", symbol: "Q", decimals: 2, locale: "es-GT", flag: "🇬🇹" },
  BRL: { code: "BRL", name: "Real brasileño", symbol: "R$", decimals: 2, locale: "pt-BR", flag: "🇧🇷" },
};

/**
 * Tasas de cambio: 1 USD = N unidades de la moneda objetivo.
 * Actualizado: aproximación Mayo 2026.
 * NOTA: tasas estáticas para demo. Producción debería refrescar 1×/hora.
 */
export const USD_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  MXN: 17.5,
  CRC: 530,
  COP: 4100,
  ARS: 950,
  CLP: 940,
  PEN: 3.75,
  UYU: 39,
  GTQ: 7.75,
  BRL: 5.05,
};

/** Última actualización mostrada en UI. */
export const RATES_UPDATED_AT = "2026-05-12T08:00:00Z";

/** Mapa CountryCode → CurrencyCode oficial del país. */
export const COUNTRY_TO_CURRENCY: Record<CountryCode, CurrencyCode> = {
  MX: "MXN",
  CR: "CRC",
  CO: "COP",
  AR: "ARS",
  CL: "CLP",
  PE: "PEN",
  EC: "USD",
  UY: "UYU",
  GT: "GTQ",
  BR: "BRL",
};

/**
 * Convierte un monto desde su moneda origen a otra moneda.
 * @param amount monto en `from`
 * @param from moneda origen
 * @param to moneda destino
 * @returns monto en `to`
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  if (from === to) return amount;
  const inUsd = amount / USD_RATES[from];
  return inUsd * USD_RATES[to];
}

/**
 * Formatea un monto en la moneda dada usando Intl.NumberFormat.
 * Acepta opciones de override de decimales.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  options: { maximumFractionDigits?: number; minimumFractionDigits?: number } = {},
): string {
  const info = CURRENCIES[currency];
  const decimals = options.maximumFractionDigits ?? info.decimals;
  return new Intl.NumberFormat(info.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: options.minimumFractionDigits ?? decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Helper compacto: convierte y formatea en un paso.
 */
export function convertAndFormat(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): string {
  return formatCurrency(convertCurrency(amount, from, to), to);
}

/** Devuelve la moneda preferida del usuario o del país por defecto. */
export function resolveUserCurrency(
  preferred: CurrencyCode | undefined | null,
  country: CountryCode,
): CurrencyCode {
  if (preferred && preferred in USD_RATES) return preferred;
  return COUNTRY_TO_CURRENCY[country];
}
