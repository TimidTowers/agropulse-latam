export type CountryCode =
  | "MX"
  | "CR"
  | "CO"
  | "AR"
  | "CL"
  | "PE"
  | "EC"
  | "UY"
  | "GT"
  | "BR";

export interface Country {
  code: CountryCode;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  flag: string;
  capital: string;
  capitalCoords: [number, number]; // [lat, lng]
  productors: number;
  regions: string[];
  topProducts: string[];
  hectareas: number;
  taglineLocal: string;
  /**
   * Marca el país de origen / sede operativa de AgroPulse.
   * Solo Costa Rica debe llevar este flag en true.
   */
  isOrigin?: boolean;
}

export const COUNTRIES: Country[] = [
  {
    code: "CR",
    name: "Costa Rica",
    currency: "CRC",
    currencySymbol: "₡",
    locale: "es-CR",
    flag: "🇨🇷",
    capital: "San José",
    capitalCoords: [9.9281, -84.0907],
    productors: 3200,
    regions: ["Valle Central", "Guanacaste", "Limón", "Puntarenas"],
    topProducts: ["Piña Dorada", "Café Tarrazú", "Banano Cavendish"],
    hectareas: 240000,
    taglineLocal: "Pura vida para tu cosecha. Hecho en Costa Rica.",
    isOrigin: true,
  },
  {
    code: "MX",
    name: "México",
    currency: "MXN",
    currencySymbol: "$",
    locale: "es-MX",
    flag: "🇲🇽",
    capital: "Ciudad de México",
    capitalCoords: [19.4326, -99.1332],
    productors: 12400,
    regions: ["Bajío", "Michoacán", "Veracruz", "Sinaloa", "Jalisco"],
    topProducts: ["Aguacate Hass", "Mango Ataulfo", "Café de Veracruz"],
    hectareas: 920000,
    taglineLocal: "El pulso inteligente del campo mexicano.",
  },
  {
    code: "CO",
    name: "Colombia",
    currency: "COP",
    currencySymbol: "$",
    locale: "es-CO",
    flag: "🇨🇴",
    capital: "Bogotá",
    capitalCoords: [4.711, -74.0721],
    productors: 8900,
    regions: [
      "Eje Cafetero",
      "Antioquia",
      "Valle del Cauca",
      "Boyacá",
      "Cundinamarca",
    ],
    topProducts: ["Café Excelso", "Cacao Fino de Aroma", "Gulupa"],
    hectareas: 680000,
    taglineLocal: "Tradición cafetera con inteligencia digital.",
  },
  {
    code: "AR",
    name: "Argentina",
    currency: "ARS",
    currencySymbol: "$",
    locale: "es-AR",
    flag: "🇦🇷",
    capital: "Buenos Aires",
    capitalCoords: [-34.6037, -58.3816],
    productors: 5100,
    regions: ["Pampa Húmeda", "Mendoza", "Tucumán", "Misiones"],
    topProducts: ["Yerba Mate", "Limón Tucumano", "Miel de Pradera"],
    hectareas: 540000,
    taglineLocal: "Del campo argentino, directo al mundo.",
  },
  {
    code: "CL",
    name: "Chile",
    currency: "CLP",
    currencySymbol: "$",
    locale: "es-CL",
    flag: "🇨🇱",
    capital: "Santiago",
    capitalCoords: [-33.4489, -70.6693],
    productors: 4700,
    regions: ["Valle Central", "Maule", "O'Higgins", "Coquimbo"],
    topProducts: ["Cerezas Premium", "Uva de Mesa", "Paltas"],
    hectareas: 410000,
    taglineLocal: "La frescura del Pacífico en cada lote.",
  },
  {
    code: "PE",
    name: "Perú",
    currency: "PEN",
    currencySymbol: "S/",
    locale: "es-PE",
    flag: "🇵🇪",
    capital: "Lima",
    capitalCoords: [-12.0464, -77.0428],
    productors: 6800,
    regions: ["Costa Norte", "Sierra Sur", "Selva Central", "Ica"],
    topProducts: ["Quinua Real", "Espárragos", "Café Chanchamayo"],
    hectareas: 470000,
    taglineLocal: "Superalimentos andinos, trazabilidad global.",
  },
  {
    code: "EC",
    name: "Ecuador",
    currency: "USD",
    currencySymbol: "$",
    locale: "es-EC",
    flag: "🇪🇨",
    capital: "Quito",
    capitalCoords: [-0.1807, -78.4678],
    productors: 2900,
    regions: ["Costa", "Sierra", "Amazonía", "Manabí"],
    topProducts: ["Cacao Nacional Arriba", "Banano Cavendish", "Maracuyá Amarillo"],
    hectareas: 210000,
    taglineLocal: "Cacao y banano de origen verificado.",
  },
  {
    code: "UY",
    name: "Uruguay",
    currency: "UYU",
    currencySymbol: "$",
    locale: "es-UY",
    flag: "🇺🇾",
    capital: "Montevideo",
    capitalCoords: [-34.9011, -56.1645],
    productors: 1400,
    regions: ["Salto", "Canelones", "Maldonado", "Tacuarembó"],
    topProducts: ["Arándano Premium", "Miel Pradera", "Lácteos Artesanales"],
    hectareas: 130000,
    taglineLocal: "Pradera fértil, datos confiables.",
  },
  {
    code: "GT",
    name: "Guatemala",
    currency: "GTQ",
    currencySymbol: "Q",
    locale: "es-GT",
    flag: "🇬🇹",
    capital: "Ciudad de Guatemala",
    capitalCoords: [14.6349, -90.5069],
    productors: 3800,
    regions: ["Antigua", "Cobán", "Atitlán", "Huehuetenango"],
    topProducts: ["Café Antigua", "Cardamomo", "Cacao Criollo"],
    hectareas: 290000,
    taglineLocal: "Café de altura con tecnología de punta.",
  },
  {
    code: "BR",
    name: "Brasil",
    currency: "BRL",
    currencySymbol: "R$",
    locale: "pt-BR",
    flag: "🇧🇷",
    capital: "Brasilia",
    capitalCoords: [-15.7942, -47.8822],
    productors: 14200,
    regions: ["Cerrado", "Sul de Minas", "Bahia", "Espírito Santo"],
    topProducts: ["Café Bourbon", "Açaí Orgánico", "Mango Tommy"],
    hectareas: 1080000,
    taglineLocal: "Agroindustria sustentável e conectada.",
  },
];

export const DEFAULT_COUNTRY: CountryCode = "CR";

/** Mercado origen (sede principal de AgroPulse). */
export const ORIGIN_COUNTRY: CountryCode = "CR";

/** Detalle de la sede operativa (San José, Costa Rica). */
export const HEADQUARTERS = {
  country: "CR" as CountryCode,
  city: "San José",
  fullAddress: "San José, Costa Rica",
  coords: [9.9281, -84.0907] as [number, number],
  email: "sebastorresagropulse@gmail.com",
  phone: "+506 8337 8828",
  phoneE164: "+50683378828",
  whatsapp: "https://wa.me/50683378828?text=Hola%20AgroPulse%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20plataforma.",
} as const;

export function getCountry(code: CountryCode): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function formatPrice(amount: number, country: Country): string {
  try {
    return new Intl.NumberFormat(country.locale, {
      style: "currency",
      currency: country.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${country.currencySymbol}${amount.toLocaleString()}`;
  }
}

export function formatPriceByCode(amount: number, code: CountryCode): string {
  return formatPrice(amount, getCountry(code));
}

export function totalProductors(): number {
  return COUNTRIES.reduce((acc, c) => acc + c.productors, 0);
}

export function totalHectareas(): number {
  return COUNTRIES.reduce((acc, c) => acc + c.hectareas, 0);
}
