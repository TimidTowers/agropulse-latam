/**
 * Seed data — usuarios, métodos de pago, configuración inicial.
 * Cargado al inicializar la store en memoria.
 */
import type { User, PaymentMethod } from "./types";

/** Hashes pre-computados (bcrypt 10 rounds). Plaintext en USER_CREDENTIALS_HINT. */
const HASHES = {
  admin: "$2b$10$Jkwl4aNi/8aSTxLnkU74.uPjV1Nb9ETeSn9T5AxKbLk7Dzqk6/OWO",
  productor: "$2b$10$TnEvC/oju/WjgY46/7dBUOfdu8louQUnTbpNdxcumyLdpUVtLLT0O",
  cliente: "$2b$10$YFcUHCzYjpfT.Om3VPEWd.aFNK6hdrcFTEvrxhw1w1QdvsjIMY6sy",
  logistica: "$2b$10$t.lWHBcMVoGvkX6m29XftuxAS5WKKGfQ9AMCYr3CWxYiZMPKD5iN2",
};

/** Mostrar en el dashboard de admin / página de login para demo. */
export const USER_CREDENTIALS_HINT = [
  { email: "admin@agropulse.cr", password: "Admin#2026", role: "admin" },
  { email: "sofia@tarrazu.cr", password: "Productor#2026", role: "productor (CR)" },
  { email: "raul@uruapan.mx", password: "Productor#2026", role: "productor (MX)" },
  { email: "maria@cliente.cr", password: "Cliente#2026", role: "cliente (CR)" },
  { email: "carlos@cliente.co", password: "Cliente#2026", role: "cliente (CO)" },
  { email: "diego@logistica.cr", password: "Logistica#2026", role: "logística (CR)" },
];

export const SEED_USERS: User[] = [
  {
    id: "u-admin-001",
    email: "admin@agropulse.cr",
    passwordHash: HASHES.admin,
    name: "Equipo AgroPulse",
    role: "admin",
    country: "CR",
    phone: "+506 8337 8828",
    address: {
      line1: "Edificio AgroHub, piso 4",
      city: "San José",
      state: "San José",
      postalCode: "10101",
      country: "CR",
    },
    twoFactorEnabled: false,
    emailVerified: true,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "u-prod-cr-001",
    email: "sofia@tarrazu.cr",
    passwordHash: HASHES.productor,
    name: "Sofía Castro Jiménez",
    role: "productor",
    country: "CR",
    phone: "+506 8721 5544",
    cooperativa: "Cooperativa Tarrazú R.L.",
    hectareas: 42,
    address: {
      line1: "Finca La Esperanza, km 4",
      city: "San Marcos de Tarrazú",
      state: "San José",
      postalCode: "10301",
      country: "CR",
    },
    twoFactorEnabled: false,
    emailVerified: true,
    createdAt: "2024-03-12T08:00:00Z",
  },
  {
    id: "u-prod-mx-001",
    email: "raul@uruapan.mx",
    passwordHash: HASHES.productor,
    name: "Raúl Hernández García",
    role: "productor",
    country: "MX",
    phone: "+52 452 524 1234",
    cooperativa: "Aguacateros de Uruapan S.P.R.",
    hectareas: 85,
    address: {
      line1: "Carretera Uruapan-Pátzcuaro km 12",
      city: "Uruapan",
      state: "Michoacán",
      postalCode: "60000",
      country: "MX",
    },
    twoFactorEnabled: false,
    emailVerified: true,
    createdAt: "2024-04-02T08:00:00Z",
  },
  {
    id: "u-cli-cr-001",
    email: "maria@cliente.cr",
    passwordHash: HASHES.cliente,
    name: "María Fernanda Solís",
    role: "cliente",
    country: "CR",
    phone: "+506 8444 9012",
    address: {
      line1: "Avenida Escazú, Torre 2 of. 1205",
      city: "Escazú",
      state: "San José",
      postalCode: "10201",
      country: "CR",
    },
    twoFactorEnabled: false,
    emailVerified: true,
    createdAt: "2025-09-04T08:00:00Z",
  },
  {
    id: "u-cli-co-001",
    email: "carlos@cliente.co",
    passwordHash: HASHES.cliente,
    name: "Carlos Andrés Vargas",
    role: "cliente",
    country: "CO",
    phone: "+57 310 555 4488",
    address: {
      line1: "Calle 93 #11-30, Of. 502",
      city: "Bogotá",
      state: "Cundinamarca",
      postalCode: "110221",
      country: "CO",
    },
    twoFactorEnabled: false,
    emailVerified: true,
    createdAt: "2025-11-18T08:00:00Z",
  },
  {
    id: "u-log-cr-001",
    email: "diego@logistica.cr",
    passwordHash: HASHES.logistica,
    name: "Diego Mora Quesada",
    role: "logistica",
    country: "CR",
    phone: "+506 8123 7766",
    vehicleType: "Camión refrigerado 3 ton",
    licensePlate: "CR-LOG-4421",
    twoFactorEnabled: false,
    emailVerified: true,
    createdAt: "2024-05-20T08:00:00Z",
  },
];

// ============================================================================
// PAYMENT METHODS por país
// ============================================================================

export const SEED_PAYMENT_METHODS: PaymentMethod[] = [
  // Tarjeta global
  {
    id: "card-international",
    name: "Tarjeta crédito/débito",
    countries: ["MX", "CR", "CO", "AR", "CL", "PE", "EC", "UY", "GT", "BR"],
    type: "card",
    icon: "💳",
    description: "Visa, MasterCard, American Express",
    feePct: 2.9,
    enabled: true,
  },

  // Costa Rica
  {
    id: "sinpe-movil",
    name: "SINPE Móvil",
    countries: ["CR"],
    type: "mobile_money",
    icon: "📱",
    description: "Transferencia inmediata BCR/BAC/BNCR",
    feePct: 0,
    enabled: true,
  },
  {
    id: "iban-cr",
    name: "Transferencia IBAN",
    countries: ["CR"],
    type: "bank_transfer",
    icon: "🏦",
    description: "Transferencia bancaria SINPE",
    feePct: 0,
    enabled: true,
  },

  // México
  {
    id: "spei",
    name: "SPEI",
    countries: ["MX"],
    type: "bank_transfer",
    icon: "🏦",
    description: "Transferencia interbancaria SPEI",
    feePct: 0,
    enabled: true,
  },
  {
    id: "oxxo",
    name: "OXXO Pay",
    countries: ["MX"],
    type: "cash",
    icon: "🏪",
    description: "Pago en efectivo en tiendas OXXO",
    feePct: 0,
    enabled: true,
  },
  {
    id: "mercadopago-mx",
    name: "Mercado Pago",
    countries: ["MX", "AR", "CO", "CL", "PE", "UY", "BR"],
    type: "wallet",
    icon: "💰",
    description: "Cartera Mercado Pago",
    feePct: 3.5,
    enabled: true,
  },

  // Colombia
  {
    id: "pse",
    name: "PSE",
    countries: ["CO"],
    type: "bank_transfer",
    icon: "🏦",
    description: "Pagos Seguros en Línea — bancos colombianos",
    feePct: 1.8,
    enabled: true,
  },
  {
    id: "nequi",
    name: "Nequi",
    countries: ["CO"],
    type: "mobile_money",
    icon: "📱",
    description: "Cartera digital Bancolombia",
    feePct: 0,
    enabled: true,
  },

  // Argentina
  {
    id: "rapipago",
    name: "Rapipago / Pago Fácil",
    countries: ["AR"],
    type: "cash",
    icon: "🏪",
    description: "Pago en efectivo en sucursales",
    feePct: 0,
    enabled: true,
  },

  // Chile
  {
    id: "webpay",
    name: "Webpay Plus",
    countries: ["CL"],
    type: "card",
    icon: "💳",
    description: "Transbank Webpay (tarjetas chilenas)",
    feePct: 2.95,
    enabled: true,
  },
  {
    id: "khipu",
    name: "Khipu",
    countries: ["CL"],
    type: "bank_transfer",
    icon: "🏦",
    description: "Transferencia bancaria simplificada",
    feePct: 1.5,
    enabled: true,
  },

  // Perú
  {
    id: "yape",
    name: "Yape",
    countries: ["PE"],
    type: "mobile_money",
    icon: "📱",
    description: "Cartera móvil BCP",
    feePct: 0,
    enabled: true,
  },
  {
    id: "pagoefectivo",
    name: "PagoEfectivo",
    countries: ["PE"],
    type: "cash",
    icon: "🏪",
    description: "Cupón de pago en agentes",
    feePct: 0,
    enabled: true,
  },

  // Brasil
  {
    id: "pix",
    name: "Pix",
    countries: ["BR"],
    type: "bank_transfer",
    icon: "⚡",
    description: "Pagamento instantâneo Banco Central",
    feePct: 0,
    enabled: true,
  },
  {
    id: "boleto",
    name: "Boleto Bancário",
    countries: ["BR"],
    type: "cash",
    icon: "📄",
    description: "Pago en agencias o online",
    feePct: 0,
    enabled: true,
  },

  // Ecuador
  {
    id: "transferencia-ec",
    name: "Transferencia bancaria",
    countries: ["EC"],
    type: "bank_transfer",
    icon: "🏦",
    description: "Banco Pichincha, Pacífico, Guayaquil",
    feePct: 0,
    enabled: true,
  },

  // Guatemala
  {
    id: "tigo-money",
    name: "Tigo Money",
    countries: ["GT"],
    type: "mobile_money",
    icon: "📱",
    description: "Cartera móvil Tigo",
    feePct: 0,
    enabled: true,
  },

  // Uruguay
  {
    id: "redpagos",
    name: "RedPagos",
    countries: ["UY"],
    type: "cash",
    icon: "🏪",
    description: "Red de cobranzas Uruguay",
    feePct: 0,
    enabled: true,
  },

  // Crédito 3-12 meses (cross-country premium)
  {
    id: "agropulse-credito",
    name: "AgroPulse Crédito 3-12 meses",
    countries: ["MX", "CR", "CO", "AR", "CL", "PE", "EC", "UY", "GT", "BR"],
    type: "installments",
    icon: "📅",
    description: "Financiamiento directo para pedidos B2B (sujeto a aprobación)",
    feePct: 4.5,
    enabled: true,
  },
];
