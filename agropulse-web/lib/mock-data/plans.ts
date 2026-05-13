/**
 * AgroPulse — Planes SaaS.
 *
 * Precios en USD como base (single source of truth). La UI convierte a la
 * moneda seleccionada por el usuario usando `convertCurrency()` de
 * `lib/currency/rates.ts`.
 *
 * Mantenemos `PLANS` como nombre exportado para no romper imports legacy.
 * `plans` se conserva como alias.
 */

export interface PlanPricing {
  /** precio mensual en USD */
  monthlyUsd: number;
  /** precio anual en USD (debe ser <= 12 * monthlyUsd; aplica descuento) */
  annualUsd: number;
  /** descuento anual mostrado como % entero, ej 15, 17 */
  annualDiscountPct: number;
}

export interface PlanV2 {
  id: "basico" | "pro" | "enterprise";
  nombre: string;
  /** null para enterprise ("a cotizar") */
  pricing: PlanPricing | null;
  sensores: string;
  destacado: boolean;
  features: string[];
  cta: string;
  descripcion: string;
}

const PRO_DISCOUNT = 0.17;
const BASIC_DISCOUNT = 0.15;

function annualFromMonthly(monthly: number, discount: number): number {
  return Math.round(monthly * 12 * (1 - discount));
}

export const PLANS_V2: PlanV2[] = [
  {
    id: "basico",
    nombre: "Básico",
    pricing: {
      monthlyUsd: 79,
      annualUsd: annualFromMonthly(79, BASIC_DISCOUNT),
      annualDiscountPct: Math.round(BASIC_DISCOUNT * 100),
    },
    sensores: "3 sensores incluidos",
    destacado: false,
    features: [
      "Dashboard analítico web",
      "Monitoreo IoT en tiempo real",
      "Alertas básicas por email",
      "Trazabilidad por lote con QR",
      "Hasta 50 lotes activos",
      "Soporte por correo (24h)",
    ],
    cta: "Comenzar prueba 30 días",
    descripcion:
      "Ideal para pequeños productores que arrancan con monitoreo IoT.",
  },
  {
    id: "pro",
    nombre: "Pro",
    pricing: {
      monthlyUsd: 199,
      annualUsd: annualFromMonthly(199, PRO_DISCOUNT),
      annualDiscountPct: Math.round(PRO_DISCOUNT * 100),
    },
    sensores: "10 sensores + pronóstico ML",
    destacado: true,
    features: [
      "Todo lo del plan Básico",
      "Pronóstico de demanda con ML",
      "Integración con transportistas",
      "Reportes ESG mensuales",
      "Lotes ilimitados",
      "Soporte prioritario (4h)",
      "Capacitación al equipo",
    ],
    cta: "Empezar prueba 14 días",
    descripcion:
      "Para cooperativas y productores medianos con varias fincas.",
  },
  {
    id: "enterprise",
    nombre: "Enterprise",
    pricing: null,
    sensores: "Sensores ilimitados + API",
    destacado: false,
    features: [
      "Todo lo del plan Pro",
      "API completa para integración",
      "Multi-finca / multi-bodega",
      "Soporte 24/7 con SLA",
      "Consultoría dedicada (CSM)",
      "Certificaciones digitales premium",
      "On-premise opcional",
    ],
    cta: "Hablar con ventas",
    descripcion:
      "Personalizado para agroindustrias y operaciones multipaís.",
  },
];

/**
 * Compat: forma legacy con campos `precio`/`precioRaw`/`periodo` (en USD).
 * Permite que componentes antiguos sigan compilando mientras migran al V2.
 */
export interface Plan extends PlanV2 {
  precio: string;
  precioRaw: number | null;
  periodo: string;
}

function legacyShape(p: PlanV2): Plan {
  if (!p.pricing) {
    return {
      ...p,
      precio: "A cotizar",
      precioRaw: null,
      periodo: "según volumen",
    };
  }
  return {
    ...p,
    precio: `$${p.pricing.monthlyUsd}`,
    precioRaw: p.pricing.monthlyUsd,
    periodo: "USD / mes",
  };
}

export const PLANS: Plan[] = PLANS_V2.map(legacyShape);

/** Alias en minúscula para compat con código anterior. */
export const plans: Plan[] = PLANS;
