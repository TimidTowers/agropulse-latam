import type { ForecastEntry } from "../types";
import type { CountryCode } from "../countries";

interface ForecastSeed {
  producto: string;
  region: string;
  baseDemand: number;
  basePrice: number;
}

const seedsByCountry: Record<CountryCode, ForecastSeed[]> = {
  MX: [
    { producto: "Aguacate Hass", region: "Michoacán", baseDemand: 2200, basePrice: 110 },
    { producto: "Tomate Saladette", region: "Bajío", baseDemand: 1400, basePrice: 38 },
    { producto: "Café Coatepec", region: "Veracruz", baseDemand: 480, basePrice: 220 },
  ],
  CR: [
    { producto: "Piña MD-2", region: "Pital", baseDemand: 1800, basePrice: 980 },
    { producto: "Café Tarrazú", region: "Tarrazú", baseDemand: 420, basePrice: 3800 },
  ],
  CO: [
    { producto: "Café Excelso", region: "Eje Cafetero", baseDemand: 1900, basePrice: 22000 },
    { producto: "Gulupa", region: "Boyacá", baseDemand: 540, basePrice: 15000 },
  ],
  AR: [
    { producto: "Yerba Mate", region: "Misiones", baseDemand: 1200, basePrice: 2400 },
    { producto: "Uva Malbec", region: "Mendoza", baseDemand: 980, basePrice: 2800 },
  ],
  CL: [
    { producto: "Cereza Bing", region: "Curicó", baseDemand: 1400, basePrice: 7800 },
    { producto: "Uva Thompson", region: "Valle Central", baseDemand: 2100, basePrice: 3200 },
  ],
  PE: [
    { producto: "Quinua Real", region: "Puno", baseDemand: 680, basePrice: 22 },
    { producto: "Espárrago", region: "Ica", baseDemand: 1600, basePrice: 18 },
  ],
  EC: [
    { producto: "Cacao Arriba", region: "Esmeraldas", baseDemand: 720, basePrice: 6.5 },
    { producto: "Banano Cavendish", region: "Machala", baseDemand: 5800, basePrice: 0.8 },
  ],
  UY: [
    { producto: "Arándano", region: "Salto", baseDemand: 380, basePrice: 280 },
    { producto: "Carne Hereford", region: "Tacuarembó", baseDemand: 260, basePrice: 420 },
  ],
  GT: [
    { producto: "Café Antigua", region: "Huehuetenango", baseDemand: 580, basePrice: 95 },
    { producto: "Cardamomo", region: "Cobán", baseDemand: 420, basePrice: 110 },
  ],
  BR: [
    { producto: "Café Bourbon", region: "Sul de Minas", baseDemand: 3200, basePrice: 38 },
    { producto: "Açaí Orgánico", region: "Pará", baseDemand: 1100, basePrice: 28 },
  ],
};

const TRIM_FACTORS = [1.0, 1.18, 1.32, 0.88];
const TRIMS = ["Q1-2026", "Q2-2026", "Q3-2026", "Q4-2026"];

function generateForecast(): ForecastEntry[] {
  const out: ForecastEntry[] = [];
  (Object.keys(seedsByCountry) as CountryCode[]).forEach((country) => {
    seedsByCountry[country].forEach((seed) => {
      TRIMS.forEach((trim, i) => {
        out.push({
          trimestre: trim,
          producto: seed.producto,
          region: seed.region,
          country,
          demandaProyectadaTon: Math.round(seed.baseDemand * TRIM_FACTORS[i]),
          precioEsperadoMxnPorKg: Math.round(seed.basePrice * (0.9 + 0.1 * i) * 100) / 100,
        });
      });
    });
  });
  return out;
}

export const forecast: ForecastEntry[] = generateForecast();

export function getForecast(opts: {
  country?: CountryCode;
  producto?: string;
  region?: string;
} = {}): ForecastEntry[] {
  return forecast.filter((f) => {
    if (opts.country && f.country !== opts.country) return false;
    if (opts.producto && f.producto !== opts.producto) return false;
    if (opts.region && f.region !== opts.region) return false;
    return true;
  });
}
