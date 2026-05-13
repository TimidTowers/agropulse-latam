import type { Product, ProductoCategoria, Urgencia } from "../types";
import type { CountryCode } from "../countries";

// Use a fixed reference date so SSR/CSR match deterministically.
const REFERENCE_DATE = new Date("2026-05-12T00:00:00Z");
function addDays(days: number) {
  const d = new Date(REFERENCE_DATE);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
const FIXED_LECTURA = "2026-05-12T08:00:00Z";

// Curated, hand-verified Unsplash photos for each generic produce type.
// All URLs auditadas para reflejar exactamente el producto agrícola descrito.
const IMG = {
  // Aguacate / palta
  aguacate:
    "https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=1200&q=80",
  palta:
    "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=1200&q=80",
  // Mango
  mango:
    "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1200&q=80",
  // Café (plantación y granos)
  cafe:
    "https://images.unsplash.com/photo-1452696193712-6cabf5103b63?auto=format&fit=crop&w=1200&q=80",
  cafeGrano:
    "https://images.unsplash.com/photo-1559525839-d9acfd0b8978?auto=format&fit=crop&w=1200&q=80",
  // Hortalizas
  tomate:
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
  fresa:
    "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=1200&q=80",
  limon:
    "https://images.unsplash.com/photo-1582287014914-1db836066f73?auto=format&fit=crop&w=1200&q=80",
  lechuga:
    "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?auto=format&fit=crop&w=1200&q=80",
  espinaca:
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=80",
  chile:
    "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=1200&q=80",
  hortalizas:
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
  // Tubérculos
  papa:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80",
  yuca:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80",
  // Berries
  zarzamora:
    "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=1200&q=80",
  arandano:
    "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=1200&q=80",
  // Cacao
  cacao:
    "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1200&q=80",
  cacaoFruto:
    "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=1200&q=80",
  // Banano y plátano
  banano:
    "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?auto=format&fit=crop&w=1200&q=80",
  platano:
    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=1200&q=80",
  // Piña
  pina:
    "https://images.unsplash.com/photo-1550828520-4cb496926fc9?auto=format&fit=crop&w=1200&q=80",
  // Frutas tropicales
  papaya:
    "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=1200&q=80",
  maracuya:
    "https://images.unsplash.com/photo-1604495772376-9657f0035eb5?auto=format&fit=crop&w=1200&q=80",
  gulupa:
    "https://images.unsplash.com/photo-1604495772376-9657f0035eb5?auto=format&fit=crop&w=1200&q=80",
  tomateArbol:
    "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=1200&q=80",
  kiwi:
    "https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=1200&q=80",
  manzana:
    "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=1200&q=80",
  naranja:
    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?auto=format&fit=crop&w=1200&q=80",
  acai:
    "https://images.unsplash.com/photo-1572441710174-9adf81a78c91?auto=format&fit=crop&w=1200&q=80",
  // Lácteos
  leche:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80",
  queso:
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1200&q=80",
  // Carnes y pescado
  carne:
    "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1200&q=80",
  salmon:
    "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=1200&q=80",
  // Apicultura y otros
  miel:
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80",
  yerba:
    "https://images.unsplash.com/photo-1612883540434-c70a59e9af90?auto=format&fit=crop&w=1200&q=80",
  // Uva y cerezas
  uva:
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1200&q=80",
  cereza:
    "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=1200&q=80",
  // Granos
  quinua:
    "https://images.unsplash.com/photo-1565895405127-481853366cf8?auto=format&fit=crop&w=1200&q=80",
  soja:
    "https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1200&q=80",
  granos:
    "https://images.unsplash.com/photo-1592035659284-3b39971c1107?auto=format&fit=crop&w=1200&q=80",
  // Hortalizas verdes
  esparragos:
    "https://images.unsplash.com/photo-1515471209610-dae1c92d8777?auto=format&fit=crop&w=1200&q=80",
  arveja:
    "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1200&q=80",
  cebollaLarga:
    "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=1200&q=80",
  // Especias
  cardamomo:
    "https://images.unsplash.com/photo-1599909533730-d2efbf6c20e7?auto=format&fit=crop&w=1200&q=80",
  guarana:
    "https://images.unsplash.com/photo-1599909533730-d2efbf6c20e7?auto=format&fit=crop&w=1200&q=80",
  // Flores (rosa)
  rosa:
    "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80",
} as const;

function gallery(img: string): string[] {
  return [img];
}

// Helper to keep declarations terse.
interface ProductSeed {
  slug: string;
  nombre: string;
  categoria: ProductoCategoria;
  productorNombre: string;
  region: string;
  estado: string;
  certs: string[];
  rating: number;
  years: number;
  precio: number;
  unidad: string;
  stock: number;
  diasCosecha: number; // negative offset from today
  vidaUtilDias: number;
  urgencia: Urgencia;
  imagen: string;
  tempBase: number;
  humBase: number;
  rangoTemp: [number, number];
  rangoHum: [number, number];
  descripcion: string;
}

let lastProductIndex = 0;
let lastLote = 200;

function build(country: CountryCode, seed: ProductSeed): Product {
  lastProductIndex += 1;
  const idx = String(lastProductIndex).padStart(3, "0");
  const id = `p-${country.toLowerCase()}-${idx}`;
  const sensorId = `S-${country}-${idx}`;
  lastLote += 1;
  const loteId = `L-2026-${String(lastLote).padStart(4, "0")}`;

  return {
    id,
    slug: seed.slug,
    nombre: seed.nombre,
    categoria: seed.categoria,
    country,
    productor: {
      id: `pr-${country.toLowerCase()}-${idx}`,
      nombre: seed.productorNombre,
      region: seed.region,
      estado: seed.estado,
      certificaciones: seed.certs,
      rating: seed.rating,
      yearsActive: seed.years,
    },
    precio: seed.precio,
    unidad: seed.unidad,
    stock: seed.stock,
    fechaCosecha: addDays(seed.diasCosecha),
    vidaUtilDias: seed.vidaUtilDias,
    urgencia: seed.urgencia,
    imagen: seed.imagen,
    galeria: gallery(seed.imagen),
    certificaciones: seed.certs,
    condicionesIoT: {
      temperaturaC: seed.tempBase,
      humedadPct: seed.humBase,
      ultimaLectura: FIXED_LECTURA,
      rangoOptimoTemp: seed.rangoTemp,
      rangoOptimoHumedad: seed.rangoHum,
    },
    descripcion: seed.descripcion,
    sensorId,
    loteId,
  };
}

// ---------- MÉXICO ----------
const mxSeeds: ProductSeed[] = [
  { slug: "tomate-saladette-bajio", nombre: "Tomate Saladette", categoria: "Hortalizas", productorNombre: "Invernaderos La Esperanza", region: "Bajío", estado: "Querétaro", certs: ["GLOBALG.A.P.", "México Calidad Suprema"], rating: 4.8, years: 12, precio: 38, unidad: "kg", stock: 4200, diasCosecha: -2, vidaUtilDias: 8, urgencia: "media", imagen: IMG.tomate, tempBase: 8.2, humBase: 88, rangoTemp: [7, 10], rangoHum: [85, 95], descripcion: "Tomate saladette tipo Roma cultivado en invernadero. Calibre M-L, color rojo intenso, ideal para HORECA y supermercado." },
  { slug: "aguacate-hass-michoacan", nombre: "Aguacate Hass", categoria: "Frutas", productorNombre: "Aguacates del Valle", region: "Uruapan", estado: "Michoacán", certs: ["USDA Organic", "APEAM"], rating: 4.9, years: 18, precio: 110, unidad: "kg", stock: 2800, diasCosecha: -4, vidaUtilDias: 6, urgencia: "alta", imagen: IMG.aguacate, tempBase: 6.4, humBase: 82, rangoTemp: [5, 8], rangoHum: [80, 90], descripcion: "Aguacate Hass de altura, calibre 48-60. Materia seca >23%, listo para maduración controlada con trazabilidad APEAM." },
  { slug: "fresa-zamora", nombre: "Fresa Camarosa", categoria: "Frutas", productorNombre: "Berries del Bajío", region: "Zamora", estado: "Michoacán", certs: ["PrimusGFS", "SENASICA"], rating: 4.7, years: 9, precio: 95, unidad: "kg", stock: 980, diasCosecha: -1, vidaUtilDias: 5, urgencia: "alta", imagen: IMG.fresa, tempBase: 2.1, humBase: 92, rangoTemp: [0, 4], rangoHum: [90, 95], descripcion: "Fresa variedad Camarosa, calibre 25-32 mm, color rojo brillante. Empaque en clamshell de 250 g listo para retail." },
  { slug: "limon-persa-colima", nombre: "Limón Persa", categoria: "Frutas", productorNombre: "Citrícolas del Pacífico", region: "Tecomán", estado: "Colima", certs: ["GLOBALG.A.P.", "USDA"], rating: 4.6, years: 15, precio: 32, unidad: "kg", stock: 3600, diasCosecha: -2, vidaUtilDias: 14, urgencia: "baja", imagen: IMG.limon, tempBase: 11.5, humBase: 85, rangoTemp: [10, 13], rangoHum: [85, 90], descripcion: "Limón persa sin semilla, calibre 110-150, color verde intenso, alta jugosidad. Apto para exportación." },
  { slug: "mango-ataulfo-chiapas", nombre: "Mango Ataúlfo", categoria: "Frutas", productorNombre: "Frutícola Tapachula", region: "Soconusco", estado: "Chiapas", certs: ["USDA", "GLOBALG.A.P."], rating: 4.8, years: 14, precio: 45, unidad: "kg", stock: 1500, diasCosecha: -3, vidaUtilDias: 9, urgencia: "alta", imagen: IMG.mango, tempBase: 12.8, humBase: 88, rangoTemp: [10, 13], rangoHum: [85, 90], descripcion: "Mango Ataúlfo selección export, calibre 12 piezas, Brix 16°. Tratamiento hidrotérmico para exportación." },
  { slug: "cafe-veracruz-coatepec", nombre: "Café Coatepec Arábica", categoria: "Café", productorNombre: "Finca El Chorro", region: "Coatepec", estado: "Veracruz", certs: ["Rainforest Alliance", "UTZ"], rating: 4.9, years: 22, precio: 220, unidad: "kg", stock: 540, diasCosecha: -8, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.cafe, tempBase: 18.0, humBase: 60, rangoTemp: [15, 22], rangoHum: [55, 65], descripcion: "Café arábica de altura cultivado en Coatepec. Notas a chocolate, caramelo y cítricos. Tueste medio." },
  { slug: "queso-fresco-jalisco", nombre: "Queso Fresco Ranchero", categoria: "Lácteos", productorNombre: "Quesos Hacienda San Miguel", region: "Altos de Jalisco", estado: "Jalisco", certs: ["TIF", "Marca Colectiva"], rating: 4.9, years: 28, precio: 165, unidad: "kg", stock: 320, diasCosecha: -1, vidaUtilDias: 14, urgencia: "media", imagen: IMG.queso, tempBase: 4.1, humBase: 80, rangoTemp: [2, 5], rangoHum: [75, 85], descripcion: "Queso fresco 100% leche de vaca pasteurizada. Sabor suave y cremoso, ideal para antojitos." },
  { slug: "chile-jalapeno-sinaloa", nombre: "Chile Jalapeño", categoria: "Hortalizas", productorNombre: "Hortalizas Culiacán", region: "Culiacán", estado: "Sinaloa", certs: ["GLOBALG.A.P."], rating: 4.5, years: 7, precio: 28, unidad: "kg", stock: 1850, diasCosecha: -3, vidaUtilDias: 12, urgencia: "baja", imagen: IMG.chile, tempBase: 9.2, humBase: 86, rangoTemp: [7, 10], rangoHum: [85, 95], descripcion: "Chile jalapeño verde, calibre M, picor medio. Apto para industria y mercado fresco." },
  { slug: "leche-fresca-jalisco", nombre: "Leche Fresca Pasteurizada", categoria: "Lácteos", productorNombre: "Lácteos Los Alamos", region: "Altos de Jalisco", estado: "Jalisco", certs: ["TIF", "ISO 22000"], rating: 4.8, years: 22, precio: 24, unidad: "L", stock: 5400, diasCosecha: 0, vidaUtilDias: 7, urgencia: "media", imagen: IMG.leche, tempBase: 3.8, humBase: 78, rangoTemp: [2, 4], rangoHum: [70, 80], descripcion: "Leche bovina pasteurizada HTST, 3.2% grasa, envase pouch 1 L. Origen Altos de Jalisco." },
  { slug: "lechuga-romana-guanajuato", nombre: "Lechuga Romana Hidropónica", categoria: "Hortalizas", productorNombre: "Hidroponía Celaya", region: "Bajío", estado: "Guanajuato", certs: ["GAP", "Orgánico SAGARPA"], rating: 4.7, years: 5, precio: 42, unidad: "kg", stock: 720, diasCosecha: 0, vidaUtilDias: 10, urgencia: "media", imagen: IMG.lechuga, tempBase: 1.8, humBase: 95, rangoTemp: [0, 3], rangoHum: [90, 98], descripcion: "Lechuga romana en sistema NFT con agua reciclada al 95%. Hojas crujientes, sin pesticidas." },
];

// ---------- COSTA RICA ----------
const crSeeds: ProductSeed[] = [
  { slug: "pina-dorada-pital", nombre: "Piña Dorada MD-2", categoria: "Frutas", productorNombre: "Piñas del Norte SRL", region: "Pital", estado: "Alajuela", certs: ["GLOBALG.A.P.", "Rainforest Alliance"], rating: 4.8, years: 16, precio: 980, unidad: "kg", stock: 5200, diasCosecha: -2, vidaUtilDias: 14, urgencia: "media", imagen: IMG.pina, tempBase: 8.0, humBase: 85, rangoTemp: [7, 13], rangoHum: [85, 95], descripcion: "Piña MD-2 dorada, calibre 5-6, Brix 13°. Cultivada en suelos volcánicos del norte de Costa Rica." },
  { slug: "cafe-tarrazu-finca", nombre: "Café Tarrazú SHB", categoria: "Café", productorNombre: "Finca La Candelilla", region: "Tarrazú", estado: "San José", certs: ["SCAA", "Bird Friendly"], rating: 4.9, years: 35, precio: 3800, unidad: "kg", stock: 380, diasCosecha: -12, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.cafeGrano, tempBase: 19.0, humBase: 58, rangoTemp: [15, 22], rangoHum: [55, 65], descripcion: "Café arábica Strictly Hard Bean de Tarrazú, beneficio honey, notas a manzana y miel." },
  { slug: "banano-cavendish-limon", nombre: "Banano Cavendish", categoria: "Frutas", productorNombre: "Bananeras del Caribe", region: "Limón", estado: "Limón", certs: ["GLOBALG.A.P.", "Rainforest Alliance"], rating: 4.7, years: 25, precio: 750, unidad: "caja 18kg", stock: 3200, diasCosecha: -3, vidaUtilDias: 12, urgencia: "media", imagen: IMG.banano, tempBase: 13.5, humBase: 90, rangoTemp: [13, 15], rangoHum: [85, 95], descripcion: "Banano Cavendish calibre primera, racimo seleccionado. Exportación a USA y Europa." },
  { slug: "papaya-roja-guanacaste", nombre: "Papaya Roja Maradol", categoria: "Frutas", productorNombre: "Frutas Guanacaste", region: "Liberia", estado: "Guanacaste", certs: ["GLOBALG.A.P."], rating: 4.6, years: 8, precio: 1200, unidad: "kg", stock: 1800, diasCosecha: -2, vidaUtilDias: 9, urgencia: "alta", imagen: IMG.papaya, tempBase: 10.5, humBase: 88, rangoTemp: [10, 13], rangoHum: [85, 95], descripcion: "Papaya Maradol madurez controlada, peso 1.2-1.8 kg, pulpa roja firme y dulce." },
  { slug: "aguacate-orgánico-cr", nombre: "Aguacate Orgánico", categoria: "Frutas", productorNombre: "Cooperativa Valle Central", region: "Cartago", estado: "Cartago", certs: ["USDA Organic", "EU Organic"], rating: 4.8, years: 14, precio: 4200, unidad: "kg", stock: 540, diasCosecha: -3, vidaUtilDias: 7, urgencia: "alta", imagen: IMG.aguacate, tempBase: 6.0, humBase: 82, rangoTemp: [5, 8], rangoHum: [80, 90], descripcion: "Aguacate Hass orgánico, calibre 50-60, libre de químicos sintéticos. Trazabilidad blockchain." },
  { slug: "cacao-criollo-puntarenas", nombre: "Cacao Criollo Fermentado", categoria: "Cacao", productorNombre: "Chocolatera Talamanca", region: "Talamanca", estado: "Puntarenas", certs: ["Fair Trade", "Orgánico"], rating: 4.9, years: 20, precio: 4500, unidad: "kg", stock: 240, diasCosecha: -10, vidaUtilDias: 180, urgencia: "baja", imagen: IMG.cacao, tempBase: 22.0, humBase: 55, rangoTemp: [18, 24], rangoHum: [50, 60], descripcion: "Cacao criollo fermentado y secado al sol. Notas a frutos rojos y avellana. Premio nacional 2024." },
  { slug: "yuca-fresca-cr", nombre: "Yuca Fresca", categoria: "Tubérculos", productorNombre: "Productores San Carlos", region: "San Carlos", estado: "Alajuela", certs: ["BPA"], rating: 4.4, years: 11, precio: 600, unidad: "kg", stock: 2400, diasCosecha: -5, vidaUtilDias: 14, urgencia: "media", imagen: IMG.yuca, tempBase: 8.0, humBase: 88, rangoTemp: [5, 10], rangoHum: [85, 95], descripcion: "Yuca fresca calidad export, peso medio 1 kg por raíz, sin manchas ni picaduras." },
  { slug: "miel-tropical-puntarenas", nombre: "Miel Tropical Multifloral", categoria: "Especias", productorNombre: "Apícolas del Pacífico", region: "Puntarenas", estado: "Puntarenas", certs: ["Orgánico", "ISO 22000"], rating: 4.8, years: 18, precio: 2800, unidad: "kg", stock: 420, diasCosecha: -15, vidaUtilDias: 730, urgencia: "baja", imagen: IMG.miel, tempBase: 20.0, humBase: 35, rangoTemp: [18, 24], rangoHum: [30, 45], descripcion: "Miel multifloral del bosque tropical seco. Color ámbar claro, cristalización lenta." },
];

// ---------- COLOMBIA ----------
const coSeeds: ProductSeed[] = [
  { slug: "cafe-excelso-eje-cafetero", nombre: "Café Excelso Eje Cafetero", categoria: "Café", productorNombre: "Federación Cafeteros Quindío", region: "Eje Cafetero", estado: "Quindío", certs: ["FNC", "Rainforest Alliance"], rating: 4.9, years: 40, precio: 22000, unidad: "kg", stock: 850, diasCosecha: -15, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.cafeGrano, tempBase: 19.0, humBase: 60, rangoTemp: [15, 22], rangoHum: [55, 65], descripcion: "Café Excelso de origen Eje Cafetero. Cuerpo medio, acidez balanceada, notas a chocolate y caramelo." },
  { slug: "cacao-fino-aroma-co", nombre: "Cacao Fino de Aroma", categoria: "Cacao", productorNombre: "Cacaoteros del Tolima", region: "Tolima", estado: "Tolima", certs: ["Fair Trade", "USDA Organic"], rating: 4.8, years: 18, precio: 24000, unidad: "kg", stock: 320, diasCosecha: -12, vidaUtilDias: 180, urgencia: "baja", imagen: IMG.cacao, tempBase: 22.0, humBase: 55, rangoTemp: [18, 24], rangoHum: [50, 60], descripcion: "Cacao fino de aroma certificado origen Tolima. Fermentación controlada 6 días. Pre-cosecha para chocolate fino." },
  { slug: "gulupa-cundinamarca", nombre: "Gulupa Premium", categoria: "Frutas", productorNombre: "Frutas Andinas Boyacá", region: "Boyacá", estado: "Boyacá", certs: ["GLOBALG.A.P.", "EU Organic"], rating: 4.8, years: 9, precio: 15000, unidad: "kg", stock: 680, diasCosecha: -2, vidaUtilDias: 11, urgencia: "media", imagen: IMG.gulupa, tempBase: 7.0, humBase: 90, rangoTemp: [5, 10], rangoHum: [85, 95], descripcion: "Gulupa morada premium, calibre 60-80, Brix 16°. Producto estrella de exportación a Europa." },
  { slug: "aguacate-hass-antioquia", nombre: "Aguacate Hass Antioquia", categoria: "Frutas", productorNombre: "Aguacates de Oriente", region: "Oriente Antioqueño", estado: "Antioquia", certs: ["GLOBALG.A.P.", "USDA"], rating: 4.7, years: 11, precio: 9500, unidad: "kg", stock: 2200, diasCosecha: -4, vidaUtilDias: 7, urgencia: "alta", imagen: IMG.aguacate, tempBase: 6.5, humBase: 83, rangoTemp: [5, 8], rangoHum: [80, 90], descripcion: "Aguacate Hass calidad exportación, calibre 50-60. Producción del trópico alto antioqueño." },
  { slug: "banano-uraba-co", nombre: "Banano de Urabá", categoria: "Frutas", productorNombre: "Cooperativa Banaurabá", region: "Urabá", estado: "Antioquia", certs: ["GLOBALG.A.P.", "SA8000"], rating: 4.6, years: 30, precio: 8500, unidad: "caja 18kg", stock: 4100, diasCosecha: -3, vidaUtilDias: 12, urgencia: "media", imagen: IMG.banano, tempBase: 13.5, humBase: 90, rangoTemp: [13, 15], rangoHum: [85, 95], descripcion: "Banano Cavendish de Urabá, calidad export, racimos verde claro listos para maduración." },
  { slug: "tomate-arbol-boyaca", nombre: "Tomate de Árbol", categoria: "Frutas", productorNombre: "Cosecha Andina", region: "Boyacá", estado: "Boyacá", certs: ["BPA"], rating: 4.5, years: 7, precio: 6800, unidad: "kg", stock: 1400, diasCosecha: -2, vidaUtilDias: 10, urgencia: "media", imagen: IMG.tomateArbol, tempBase: 8.5, humBase: 88, rangoTemp: [7, 10], rangoHum: [85, 95], descripcion: "Tomate de árbol amarillo y rojo de la región andina. Calibre primera, ideal para jugos." },
  { slug: "platano-hartón-co", nombre: "Plátano Hartón", categoria: "Tubérculos", productorNombre: "Plataneros del Quindío", region: "Quindío", estado: "Quindío", certs: ["GLOBALG.A.P."], rating: 4.5, years: 14, precio: 4200, unidad: "kg", stock: 3100, diasCosecha: -5, vidaUtilDias: 21, urgencia: "baja", imagen: IMG.platano, tempBase: 14.0, humBase: 88, rangoTemp: [12, 15], rangoHum: [85, 95], descripcion: "Plátano Hartón verde para fritura, calibre primera, racimo de 10-12 unidades." },
  { slug: "rosa-corte-co", nombre: "Rosa Roja de Exportación", categoria: "Especias", productorNombre: "Flores de la Sabana", region: "Sabana de Bogotá", estado: "Cundinamarca", certs: ["Florverde", "Rainforest"], rating: 4.9, years: 22, precio: 18000, unidad: "kg", stock: 280, diasCosecha: -1, vidaUtilDias: 14, urgencia: "alta", imagen: IMG.rosa, tempBase: 2.0, humBase: 90, rangoTemp: [0, 4], rangoHum: [85, 95], descripcion: "Rosa roja tallo largo 70cm, botón cerrado. Producto principal de exportación a USA." },
  { slug: "cebolla-larga-co", nombre: "Cebolla Larga Junca", categoria: "Hortalizas", productorNombre: "Hortalizas Boyacá Verde", region: "Boyacá", estado: "Boyacá", certs: ["BPA"], rating: 4.4, years: 10, precio: 3800, unidad: "kg", stock: 2200, diasCosecha: -3, vidaUtilDias: 14, urgencia: "baja", imagen: IMG.cebollaLarga, tempBase: 4.0, humBase: 90, rangoTemp: [0, 5], rangoHum: [85, 95], descripcion: "Cebolla larga junca calibre primera, hojas verdes intensas. Producción intensiva." },
];

// ---------- ARGENTINA ----------
const arSeeds: ProductSeed[] = [
  { slug: "yerba-mate-misiones", nombre: "Yerba Mate Tradicional", categoria: "Especias", productorNombre: "Yerbatera Andresito", region: "Andresito", estado: "Misiones", certs: ["INYM", "Orgánico"], rating: 4.8, years: 38, precio: 2400, unidad: "kg", stock: 1800, diasCosecha: -20, vidaUtilDias: 730, urgencia: "baja", imagen: IMG.yerba, tempBase: 18.0, humBase: 55, rangoTemp: [15, 22], rangoHum: [50, 60], descripcion: "Yerba mate estacionada 24 meses, molienda tradicional misionera. Sabor intenso y persistente." },
  { slug: "limon-tucumano", nombre: "Limón Tucumano", categoria: "Frutas", productorNombre: "Citrícolas del NOA", region: "Famaillá", estado: "Tucumán", certs: ["GLOBALG.A.P.", "EU"], rating: 4.7, years: 28, precio: 1200, unidad: "kg", stock: 6400, diasCosecha: -3, vidaUtilDias: 21, urgencia: "baja", imagen: IMG.limon, tempBase: 11.5, humBase: 85, rangoTemp: [10, 13], rangoHum: [85, 90], descripcion: "Limón Eureka tucumano, calibre 100-150, alto contenido de jugo. Primer exportador mundial." },
  { slug: "miel-pampa", nombre: "Miel de Pradera Pampeana", categoria: "Especias", productorNombre: "Apícolas La Pampa", region: "Pampa Húmeda", estado: "Buenos Aires", certs: ["Orgánica Argentina"], rating: 4.8, years: 25, precio: 3600, unidad: "kg", stock: 580, diasCosecha: -10, vidaUtilDias: 730, urgencia: "baja", imagen: IMG.miel, tempBase: 20.0, humBase: 35, rangoTemp: [18, 24], rangoHum: [30, 45], descripcion: "Miel multifloral de la pradera pampeana. Color claro ámbar, textura cremosa, sabor delicado." },
  { slug: "manzana-rio-negro", nombre: "Manzana Red Delicious", categoria: "Frutas", productorNombre: "Frutas del Alto Valle", region: "Valle del Río Negro", estado: "Río Negro", certs: ["GLOBALG.A.P.", "EU"], rating: 4.6, years: 32, precio: 1800, unidad: "kg", stock: 3800, diasCosecha: -6, vidaUtilDias: 60, urgencia: "baja", imagen: IMG.manzana, tempBase: 1.5, humBase: 92, rangoTemp: [0, 3], rangoHum: [90, 95], descripcion: "Manzana Red Delicious calibre 80-90, color rojo intenso, almacenamiento controlado." },
  { slug: "carne-vacuna-pampa", nombre: "Carne Vacuna Premium", categoria: "Carnes", productorNombre: "Estancia Don José", region: "Pampa", estado: "Buenos Aires", certs: ["Angus", "Hilton Quota"], rating: 4.9, years: 45, precio: 5800, unidad: "kg", stock: 220, diasCosecha: -1, vidaUtilDias: 14, urgencia: "media", imagen: IMG.carne, tempBase: 2.0, humBase: 75, rangoTemp: [0, 4], rangoHum: [70, 80], descripcion: "Carne vacuna Angus criada en pradera, sin hormonas. Cortes premium con maduración 21 días." },
  { slug: "uva-malbec-mendoza", nombre: "Uva Malbec", categoria: "Frutas", productorNombre: "Viñedos Luján de Cuyo", region: "Mendoza", estado: "Mendoza", certs: ["EU Organic", "INV"], rating: 4.9, years: 28, precio: 2800, unidad: "kg", stock: 1100, diasCosecha: -4, vidaUtilDias: 21, urgencia: "media", imagen: IMG.uva, tempBase: 6.0, humBase: 85, rangoTemp: [4, 8], rangoHum: [80, 90], descripcion: "Uva Malbec de Luján de Cuyo a 1100 msnm. Brix 24°, calidad enológica premium." },
  { slug: "soja-organica-pampa", nombre: "Soja Orgánica", categoria: "Granos", productorNombre: "Cooperativa Pergamino", region: "Pergamino", estado: "Buenos Aires", certs: ["USDA Organic", "EU"], rating: 4.7, years: 18, precio: 1100, unidad: "kg", stock: 8200, diasCosecha: -30, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.soja, tempBase: 18.0, humBase: 50, rangoTemp: [15, 22], rangoHum: [40, 60], descripcion: "Soja orgánica certificada, calidad export Hilton Quota. Bolsas de 25 kg." },
  { slug: "arandano-tucuman", nombre: "Arándano Premium", categoria: "Frutas", productorNombre: "Berries del Norte", region: "Tucumán", estado: "Tucumán", certs: ["GLOBALG.A.P.", "EU"], rating: 4.8, years: 14, precio: 5400, unidad: "kg", stock: 380, diasCosecha: -1, vidaUtilDias: 7, urgencia: "alta", imagen: IMG.arandano, tempBase: 1.5, humBase: 92, rangoTemp: [0, 4], rangoHum: [90, 95], descripcion: "Arándano variedad Emerald, calibre 14-18mm. Vuelo express a Europa y USA." },
];

// ---------- CHILE ----------
const clSeeds: ProductSeed[] = [
  { slug: "cereza-curico", nombre: "Cereza Premium Bing", categoria: "Frutas", productorNombre: "Frutícola del Maule", region: "Curicó", estado: "Maule", certs: ["GLOBALG.A.P.", "China Export"], rating: 4.9, years: 18, precio: 7800, unidad: "kg", stock: 920, diasCosecha: -1, vidaUtilDias: 21, urgencia: "alta", imagen: IMG.cereza, tempBase: 0.5, humBase: 92, rangoTemp: [-1, 2], rangoHum: [90, 95], descripcion: "Cereza Bing calibre J/XL, firmeza alta, Brix 18°. Producto estrella de exportación a China." },
  { slug: "uva-mesa-thompson", nombre: "Uva de Mesa Thompson", categoria: "Frutas", productorNombre: "Viñedos Aconcagua", region: "Valle Central", estado: "Valparaíso", certs: ["GLOBALG.A.P.", "USDA"], rating: 4.7, years: 24, precio: 3200, unidad: "kg", stock: 2100, diasCosecha: -3, vidaUtilDias: 30, urgencia: "media", imagen: IMG.uva, tempBase: 1.0, humBase: 90, rangoTemp: [-1, 3], rangoHum: [85, 95], descripcion: "Uva Thompson Seedless, racimos compactos, sin semilla. Calibre 17-19mm, exportación premium." },
  { slug: "palta-hass-quillota", nombre: "Palta Hass Quillota", categoria: "Frutas", productorNombre: "Avocados del Valle", region: "Quillota", estado: "Valparaíso", certs: ["GLOBALG.A.P.", "Rainforest"], rating: 4.8, years: 16, precio: 5400, unidad: "kg", stock: 1800, diasCosecha: -4, vidaUtilDias: 7, urgencia: "alta", imagen: IMG.palta, tempBase: 6.5, humBase: 83, rangoTemp: [5, 8], rangoHum: [80, 90], descripcion: "Palta Hass chilena, calibre 50-60. Materia seca 24%, alta calidad para retail europeo." },
  { slug: "arandano-ohiggins", nombre: "Arándano O'Higgins", categoria: "Frutas", productorNombre: "Berries Chile Sur", region: "Rancagua", estado: "O'Higgins", certs: ["GLOBALG.A.P.", "ASOEX"], rating: 4.8, years: 12, precio: 6800, unidad: "kg", stock: 540, diasCosecha: -1, vidaUtilDias: 14, urgencia: "alta", imagen: IMG.arandano, tempBase: 1.5, humBase: 93, rangoTemp: [0, 4], rangoHum: [90, 95], descripcion: "Arándano variedad Duke, calibre Jumbo, vuelo express. Embalaje en clamshells de 125g." },
  { slug: "salmon-puerto-montt", nombre: "Salmón Atlántico Premium", categoria: "Carnes", productorNombre: "Acuícola Puerto Montt", region: "Los Lagos", estado: "Los Lagos", certs: ["ASC", "BAP"], rating: 4.7, years: 22, precio: 12500, unidad: "kg", stock: 480, diasCosecha: -1, vidaUtilDias: 7, urgencia: "alta", imagen: IMG.salmon, tempBase: 0.5, humBase: 80, rangoTemp: [-1, 2], rangoHum: [75, 85], descripcion: "Salmón Atlántico fresco, calibre 4-5kg, certificación ASC. Cosecha sustentable." },
  { slug: "kiwi-curico", nombre: "Kiwi Hayward", categoria: "Frutas", productorNombre: "Frutícola Sur", region: "Curicó", estado: "Maule", certs: ["GLOBALG.A.P."], rating: 4.6, years: 14, precio: 2400, unidad: "kg", stock: 2400, diasCosecha: -5, vidaUtilDias: 60, urgencia: "baja", imagen: IMG.kiwi, tempBase: 0.5, humBase: 92, rangoTemp: [-1, 2], rangoHum: [90, 95], descripcion: "Kiwi Hayward calibre 27-30, firmeza alta. Almacenamiento atmósfera controlada." },
  { slug: "manzana-gala-maule", nombre: "Manzana Gala Premium", categoria: "Frutas", productorNombre: "Pomáceas del Maule", region: "Talca", estado: "Maule", certs: ["GLOBALG.A.P.", "Tesco Nurture"], rating: 4.7, years: 30, precio: 1800, unidad: "kg", stock: 3200, diasCosecha: -7, vidaUtilDias: 90, urgencia: "baja", imagen: IMG.manzana, tempBase: 1.0, humBase: 92, rangoTemp: [0, 3], rangoHum: [90, 95], descripcion: "Manzana Gala calibre 75-85, color rojo brillante. Atmósfera controlada para envío marítimo." },
  { slug: "vino-cabernet-maipo", nombre: "Uva Cabernet Sauvignon", categoria: "Frutas", productorNombre: "Viñedos Alto Maipo", region: "Maipo Alto", estado: "Metropolitana", certs: ["Orgánico", "Sustainability"], rating: 4.9, years: 32, precio: 4200, unidad: "kg", stock: 680, diasCosecha: -3, vidaUtilDias: 14, urgencia: "media", imagen: IMG.uva, tempBase: 5.0, humBase: 85, rangoTemp: [3, 8], rangoHum: [80, 90], descripcion: "Cabernet Sauvignon de Alto Maipo a 800 msnm. Calidad enológica premium para vinos de guarda." },
];

// ---------- PERÚ ----------
const peSeeds: ProductSeed[] = [
  { slug: "quinua-real-puno", nombre: "Quinua Real Blanca", categoria: "Granos", productorNombre: "Cooperativa Andina Puno", region: "Puno", estado: "Puno", certs: ["USDA Organic", "Fair Trade"], rating: 4.9, years: 22, precio: 22, unidad: "kg", stock: 4200, diasCosecha: -30, vidaUtilDias: 730, urgencia: "baja", imagen: IMG.quinua, tempBase: 18.0, humBase: 45, rangoTemp: [15, 22], rangoHum: [40, 55], descripcion: "Quinua Real blanca del altiplano peruano, 4200 msnm. Grano grande, alto contenido proteico." },
  { slug: "esparrago-ica", nombre: "Espárrago Verde", categoria: "Hortalizas", productorNombre: "Agroexportadora Ica", region: "Ica", estado: "Ica", certs: ["GLOBALG.A.P.", "HACCP"], rating: 4.8, years: 28, precio: 18, unidad: "kg", stock: 2600, diasCosecha: -1, vidaUtilDias: 14, urgencia: "alta", imagen: IMG.esparragos, tempBase: 2.0, humBase: 95, rangoTemp: [0, 4], rangoHum: [90, 98], descripcion: "Espárrago verde calibre Jumbo/XL, manojos de 500g. Líder mundial en exportación." },
  { slug: "cafe-chanchamayo", nombre: "Café Chanchamayo Arábica", categoria: "Café", productorNombre: "Caficultores Pichanaki", region: "Chanchamayo", estado: "Junín", certs: ["Rainforest", "Orgánico"], rating: 4.8, years: 16, precio: 42, unidad: "kg", stock: 720, diasCosecha: -15, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.cafe, tempBase: 19.0, humBase: 60, rangoTemp: [15, 22], rangoHum: [55, 65], descripcion: "Café arábica de Chanchamayo, beneficio lavado. Notas a frutos cítricos y chocolate amargo." },
  { slug: "palta-hass-peru", nombre: "Palta Hass Peruana", categoria: "Frutas", productorNombre: "Avocados del Pacífico", region: "Trujillo", estado: "La Libertad", certs: ["GLOBALG.A.P.", "USDA"], rating: 4.7, years: 11, precio: 14, unidad: "kg", stock: 3400, diasCosecha: -4, vidaUtilDias: 7, urgencia: "alta", imagen: IMG.palta, tempBase: 6.5, humBase: 83, rangoTemp: [5, 8], rangoHum: [80, 90], descripcion: "Palta Hass peruana calibre 50-60, materia seca 24%. Calidad exportación premium." },
  { slug: "mango-piura", nombre: "Mango Kent Piura", categoria: "Frutas", productorNombre: "Frutas del Norte", region: "Piura", estado: "Piura", certs: ["GLOBALG.A.P."], rating: 4.7, years: 14, precio: 9, unidad: "kg", stock: 2800, diasCosecha: -3, vidaUtilDias: 12, urgencia: "media", imagen: IMG.mango, tempBase: 12.5, humBase: 88, rangoTemp: [10, 13], rangoHum: [85, 90], descripcion: "Mango Kent variedad export, calibre 8-10, Brix 16°. Pulpa firme sin fibra." },
  { slug: "cacao-san-martin", nombre: "Cacao Aromático San Martín", categoria: "Cacao", productorNombre: "Cooperativa Acopagro", region: "Juanjuí", estado: "San Martín", certs: ["Fair Trade", "USDA Organic"], rating: 4.9, years: 25, precio: 38, unidad: "kg", stock: 540, diasCosecha: -12, vidaUtilDias: 180, urgencia: "baja", imagen: IMG.cacao, tempBase: 22.0, humBase: 55, rangoTemp: [18, 24], rangoHum: [50, 60], descripcion: "Cacao aromático de la Amazonía peruana, post-cocaleros. Notas frutales intensas." },
  { slug: "uva-red-globe-piura", nombre: "Uva Red Globe", categoria: "Frutas", productorNombre: "Viñedos Piuranos", region: "Piura", estado: "Piura", certs: ["GLOBALG.A.P.", "China Export"], rating: 4.7, years: 12, precio: 16, unidad: "kg", stock: 1800, diasCosecha: -3, vidaUtilDias: 35, urgencia: "media", imagen: IMG.uva, tempBase: 1.5, humBase: 90, rangoTemp: [0, 3], rangoHum: [85, 95], descripcion: "Uva Red Globe calibre 22-24mm, color rojo intenso. Exportación a China y Asia." },
  { slug: "pisco-grape-ica", nombre: "Uva Quebranta Pisco", categoria: "Frutas", productorNombre: "Pisqueros del Sur", region: "Ica", estado: "Ica", certs: ["Denominación Origen Pisco"], rating: 4.8, years: 35, precio: 24, unidad: "kg", stock: 920, diasCosecha: -5, vidaUtilDias: 14, urgencia: "media", imagen: IMG.uva, tempBase: 7.0, humBase: 85, rangoTemp: [5, 10], rangoHum: [80, 90], descripcion: "Uva Quebranta variedad pisquera con Denominación de Origen. Cosecha manual seleccionada." },
];

// ---------- ECUADOR ----------
const ecSeeds: ProductSeed[] = [
  { slug: "cacao-arriba-ec", nombre: "Cacao Nacional Arriba", categoria: "Cacao", productorNombre: "Cooperativa Cacao Fino", region: "Esmeraldas", estado: "Esmeraldas", certs: ["USDA Organic", "Fair Trade"], rating: 4.9, years: 30, precio: 6.5, unidad: "kg", stock: 680, diasCosecha: -10, vidaUtilDias: 180, urgencia: "baja", imagen: IMG.cacaoFruto, tempBase: 22.0, humBase: 55, rangoTemp: [18, 24], rangoHum: [50, 60], descripcion: "Cacao Nacional Arriba, mejor cacao fino de aroma del mundo. Notas a flores y frutos rojos." },
  { slug: "banano-cavendish-ec", nombre: "Banano Cavendish Premium", categoria: "Frutas", productorNombre: "Bananeras El Oro", region: "Machala", estado: "El Oro", certs: ["GLOBALG.A.P.", "Rainforest"], rating: 4.7, years: 35, precio: 0.8, unidad: "kg", stock: 8200, diasCosecha: -3, vidaUtilDias: 12, urgencia: "media", imagen: IMG.banano, tempBase: 13.5, humBase: 90, rangoTemp: [13, 15], rangoHum: [85, 95], descripcion: "Banano Cavendish ecuatoriano, calidad export. Primer exportador mundial." },
  { slug: "maracuya-amarillo-ec", nombre: "Maracuyá Amarillo", categoria: "Frutas", productorNombre: "Frutas Tropicales Manabí", region: "Manabí", estado: "Manabí", certs: ["GLOBALG.A.P."], rating: 4.7, years: 12, precio: 1.8, unidad: "kg", stock: 1400, diasCosecha: -2, vidaUtilDias: 14, urgencia: "media", imagen: IMG.maracuya, tempBase: 8.0, humBase: 88, rangoTemp: [7, 10], rangoHum: [85, 95], descripcion: "Maracuyá amarillo, calibre 6-8 cm, pulpa amarilla aromática. Para jugo y pulpa export." },
  { slug: "pina-md2-ec", nombre: "Piña MD-2 Ecuador", categoria: "Frutas", productorNombre: "Piñeras Costa Verde", region: "Santo Domingo", estado: "Santo Domingo", certs: ["GLOBALG.A.P.", "Rainforest"], rating: 4.6, years: 14, precio: 2.2, unidad: "kg", stock: 2400, diasCosecha: -2, vidaUtilDias: 14, urgencia: "media", imagen: IMG.pina, tempBase: 8.5, humBase: 85, rangoTemp: [7, 13], rangoHum: [85, 95], descripcion: "Piña MD-2 ecuatoriana calibre 5-6, Brix 13°. Calidad exportación a Europa y USA." },
  { slug: "rosa-corte-ec", nombre: "Rosa Roja Ecuatoriana", categoria: "Especias", productorNombre: "Florícola Tabacundo", region: "Cayambe", estado: "Pichincha", certs: ["Florverde", "Fair Trade"], rating: 4.9, years: 24, precio: 5.5, unidad: "kg", stock: 380, diasCosecha: -1, vidaUtilDias: 14, urgencia: "alta", imagen: IMG.rosa, tempBase: 2.0, humBase: 90, rangoTemp: [0, 4], rangoHum: [85, 95], descripcion: "Rosa Freedom, tallo 70-80cm, botón grande. Las mejores rosas del mundo, exportación premium." },
  { slug: "platano-baraona", nombre: "Plátano Barraganete", categoria: "Tubérculos", productorNombre: "Plataneros Manabí", region: "Manabí", estado: "Manabí", certs: ["GLOBALG.A.P."], rating: 4.5, years: 18, precio: 0.9, unidad: "kg", stock: 3400, diasCosecha: -5, vidaUtilDias: 18, urgencia: "baja", imagen: IMG.platano, tempBase: 14.0, humBase: 88, rangoTemp: [12, 15], rangoHum: [85, 95], descripcion: "Plátano Barraganete verde para fritura. Calibre primera, racimo de 12-14 unidades." },
  { slug: "quinua-sierra-ec", nombre: "Quinua Andina", categoria: "Granos", productorNombre: "Cooperativa Sierra Norte", region: "Carchi", estado: "Carchi", certs: ["USDA Organic"], rating: 4.7, years: 10, precio: 4.2, unidad: "kg", stock: 580, diasCosecha: -25, vidaUtilDias: 730, urgencia: "baja", imagen: IMG.quinua, tempBase: 18.0, humBase: 45, rangoTemp: [15, 22], rangoHum: [40, 55], descripcion: "Quinua blanca andina de altura, 2800 msnm. Sin saponinas, libre de gluten." },
  { slug: "cafe-loja-ec", nombre: "Café Loja Specialty", categoria: "Café", productorNombre: "Caficultores de Loja", region: "Loja", estado: "Loja", certs: ["SCAA", "Rainforest"], rating: 4.8, years: 16, precio: 8.5, unidad: "kg", stock: 320, diasCosecha: -12, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.cafeGrano, tempBase: 19.0, humBase: 60, rangoTemp: [15, 22], rangoHum: [55, 65], descripcion: "Café arábica de altura Loja, beneficio lavado. Puntaje SCAA 86, notas frutales." },
];

// ---------- URUGUAY ----------
const uySeeds: ProductSeed[] = [
  { slug: "arandano-salto-uy", nombre: "Arándano Premium Salto", categoria: "Frutas", productorNombre: "Berries del Litoral", region: "Salto", estado: "Salto", certs: ["GLOBALG.A.P.", "EU"], rating: 4.8, years: 14, precio: 280, unidad: "kg", stock: 480, diasCosecha: -1, vidaUtilDias: 14, urgencia: "alta", imagen: IMG.arandano, tempBase: 1.5, humBase: 92, rangoTemp: [0, 4], rangoHum: [90, 95], descripcion: "Arándano variedad Emerald, calibre 14-18mm. Exportación a USA y Europa." },
  { slug: "miel-pradera-uy", nombre: "Miel Pradera Uruguaya", categoria: "Especias", productorNombre: "Apícolas Tacuarembó", region: "Tacuarembó", estado: "Tacuarembó", certs: ["Orgánica", "EU Organic"], rating: 4.8, years: 18, precio: 220, unidad: "kg", stock: 620, diasCosecha: -8, vidaUtilDias: 730, urgencia: "baja", imagen: IMG.miel, tempBase: 20.0, humBase: 35, rangoTemp: [18, 24], rangoHum: [30, 45], descripcion: "Miel multifloral pradera, color ámbar claro. Sin tratamiento térmico, cristalización natural." },
  { slug: "queso-colonia-uy", nombre: "Queso Colonia Artesanal", categoria: "Lácteos", productorNombre: "Quesería Suiza Nueva Helvecia", region: "Colonia", estado: "Colonia", certs: ["DOP Colonia"], rating: 4.9, years: 32, precio: 380, unidad: "kg", stock: 280, diasCosecha: -2, vidaUtilDias: 60, urgencia: "media", imagen: IMG.queso, tempBase: 4.0, humBase: 80, rangoTemp: [2, 5], rangoHum: [75, 85], descripcion: "Queso semi-duro estilo colonia, maduración mínima 60 días. Producción artesanal suiza." },
  { slug: "carne-vacuna-uy", nombre: "Carne Vacuna Hereford", categoria: "Carnes", productorNombre: "Estancia La Encantada", region: "Tacuarembó", estado: "Tacuarembó", certs: ["Carne Natural", "Hilton"], rating: 4.9, years: 50, precio: 420, unidad: "kg", stock: 320, diasCosecha: -1, vidaUtilDias: 14, urgencia: "media", imagen: IMG.carne, tempBase: 2.0, humBase: 75, rangoTemp: [0, 4], rangoHum: [70, 80], descripcion: "Carne Hereford pradera natural, 100% pasturas. Maduración 21 días, calidad export." },
  { slug: "soja-canelones", nombre: "Soja Premium", categoria: "Granos", productorNombre: "Cooperativa Canelones", region: "Canelones", estado: "Canelones", certs: ["GMO-Free"], rating: 4.6, years: 14, precio: 95, unidad: "kg", stock: 6800, diasCosecha: -28, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.soja, tempBase: 18.0, humBase: 50, rangoTemp: [15, 22], rangoHum: [40, 60], descripcion: "Soja no transgénica, calidad export a Europa. Bolsas grandes de 50 kg." },
  { slug: "naranja-salto-uy", nombre: "Naranja Valencia", categoria: "Frutas", productorNombre: "Citrícolas Salto", region: "Salto", estado: "Salto", certs: ["GLOBALG.A.P."], rating: 4.6, years: 22, precio: 110, unidad: "kg", stock: 4200, diasCosecha: -3, vidaUtilDias: 21, urgencia: "baja", imagen: IMG.naranja, tempBase: 7.0, humBase: 85, rangoTemp: [5, 10], rangoHum: [80, 90], descripcion: "Naranja Valencia calibre 80-100, alto contenido de jugo, ideal para industria." },
  { slug: "mandioca-uy", nombre: "Mandioca Fresca", categoria: "Tubérculos", productorNombre: "Productores Litoral Norte", region: "Bella Unión", estado: "Artigas", certs: ["BPA"], rating: 4.4, years: 10, precio: 75, unidad: "kg", stock: 1800, diasCosecha: -5, vidaUtilDias: 12, urgencia: "media", imagen: IMG.yuca, tempBase: 8.0, humBase: 88, rangoTemp: [5, 10], rangoHum: [85, 95], descripcion: "Mandioca fresca calidad primera, peso medio 1 kg. Producción del norte litoral." },
  { slug: "tomate-cherry-uy", nombre: "Tomate Cherry Hidropónico", categoria: "Hortalizas", productorNombre: "Hidropónicos Maldonado", region: "Maldonado", estado: "Maldonado", certs: ["GAP"], rating: 4.7, years: 8, precio: 180, unidad: "kg", stock: 720, diasCosecha: 0, vidaUtilDias: 10, urgencia: "media", imagen: IMG.tomate, tempBase: 8.5, humBase: 88, rangoTemp: [7, 10], rangoHum: [85, 95], descripcion: "Tomate cherry rojo en racimo, Brix 8°. Sistema NFT con riego inteligente." },
];

// ---------- GUATEMALA ----------
const gtSeeds: ProductSeed[] = [
  { slug: "cafe-antigua-gt", nombre: "Café Antigua Strictly Hard Bean", categoria: "Café", productorNombre: "Finca El Injerto", region: "Huehuetenango", estado: "Huehuetenango", certs: ["SCAA", "Rainforest"], rating: 4.9, years: 45, precio: 95, unidad: "kg", stock: 380, diasCosecha: -15, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.cafeGrano, tempBase: 19.0, humBase: 60, rangoTemp: [15, 22], rangoHum: [55, 65], descripcion: "Café SHB de Huehuetenango, 1700 msnm. Puntaje SCAA 90, notas a chocolate y frutas tropicales." },
  { slug: "cardamomo-coban-gt", nombre: "Cardamomo Verde Cobán", categoria: "Especias", productorNombre: "Cardamomos Alta Verapaz", region: "Cobán", estado: "Alta Verapaz", certs: ["Orgánico", "Fair Trade"], rating: 4.8, years: 25, precio: 110, unidad: "kg", stock: 540, diasCosecha: -20, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.cardamomo, tempBase: 18.0, humBase: 60, rangoTemp: [15, 22], rangoHum: [55, 65], descripcion: "Cardamomo verde primera calidad. Guatemala es el principal exportador mundial." },
  { slug: "cacao-criollo-gt", nombre: "Cacao Criollo Suchitepéquez", categoria: "Cacao", productorNombre: "Cacao Maya", region: "Suchitepéquez", estado: "Suchitepéquez", certs: ["Fair Trade", "Orgánico"], rating: 4.9, years: 18, precio: 75, unidad: "kg", stock: 280, diasCosecha: -10, vidaUtilDias: 180, urgencia: "baja", imagen: IMG.cacao, tempBase: 22.0, humBase: 55, rangoTemp: [18, 24], rangoHum: [50, 60], descripcion: "Cacao criollo ancestral maya, fermentación 7 días. Notas a frutos rojos y panela." },
  { slug: "aguacate-hass-gt", nombre: "Aguacate Hass Guatemala", categoria: "Frutas", productorNombre: "Aguacates Sololá", region: "Sololá", estado: "Sololá", certs: ["GLOBALG.A.P.", "USDA"], rating: 4.7, years: 12, precio: 38, unidad: "kg", stock: 1400, diasCosecha: -4, vidaUtilDias: 7, urgencia: "alta", imagen: IMG.aguacate, tempBase: 6.5, humBase: 83, rangoTemp: [5, 8], rangoHum: [80, 90], descripcion: "Aguacate Hass altura, calibre 50-60. Producción del altiplano centroamericano." },
  { slug: "banano-izabal-gt", nombre: "Banano Izabal", categoria: "Frutas", productorNombre: "Bananeras Izabal", region: "Izabal", estado: "Izabal", certs: ["GLOBALG.A.P.", "Rainforest"], rating: 4.6, years: 22, precio: 28, unidad: "caja 18kg", stock: 4200, diasCosecha: -3, vidaUtilDias: 12, urgencia: "media", imagen: IMG.banano, tempBase: 13.5, humBase: 90, rangoTemp: [13, 15], rangoHum: [85, 95], descripcion: "Banano Cavendish del Caribe guatemalteco, calidad export USA y Europa." },
  { slug: "arveja-china-gt", nombre: "Arveja China", categoria: "Hortalizas", productorNombre: "Hortalizas Chimaltenango", region: "Chimaltenango", estado: "Chimaltenango", certs: ["GLOBALG.A.P."], rating: 4.7, years: 14, precio: 65, unidad: "kg", stock: 820, diasCosecha: -1, vidaUtilDias: 10, urgencia: "alta", imagen: IMG.arveja, tempBase: 2.0, humBase: 92, rangoTemp: [0, 4], rangoHum: [90, 95], descripcion: "Arveja china calidad export, vainas dulces y crujientes. Manojos de 250g." },
  { slug: "limon-persa-gt", nombre: "Limón Persa", categoria: "Frutas", productorNombre: "Citrícolas Escuintla", region: "Escuintla", estado: "Escuintla", certs: ["GLOBALG.A.P."], rating: 4.5, years: 16, precio: 22, unidad: "kg", stock: 2800, diasCosecha: -2, vidaUtilDias: 21, urgencia: "baja", imagen: IMG.limon, tempBase: 11.5, humBase: 85, rangoTemp: [10, 13], rangoHum: [85, 90], descripcion: "Limón persa sin semilla, calibre 110-150, jugoso. Exportación a USA y Canadá." },
  { slug: "miel-peten-gt", nombre: "Miel Selvática Petén", categoria: "Especias", productorNombre: "Apícolas Petén", region: "Petén", estado: "Petén", certs: ["Orgánico", "Fair Trade"], rating: 4.8, years: 14, precio: 95, unidad: "kg", stock: 380, diasCosecha: -12, vidaUtilDias: 730, urgencia: "baja", imagen: IMG.miel, tempBase: 22.0, humBase: 35, rangoTemp: [18, 26], rangoHum: [30, 45], descripcion: "Miel multifloral de la selva del Petén, color ámbar oscuro intenso. Cosecha sustentable." },
];

// ---------- BRASIL ----------
const brSeeds: ProductSeed[] = [
  { slug: "cafe-bourbon-br", nombre: "Café Bourbon Sul de Minas", categoria: "Café", productorNombre: "Fazenda Santa Inês", region: "Sul de Minas", estado: "Minas Gerais", certs: ["UTZ", "Rainforest"], rating: 4.9, years: 65, precio: 38, unidad: "kg", stock: 1200, diasCosecha: -15, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.cafeGrano, tempBase: 19.0, humBase: 60, rangoTemp: [15, 22], rangoHum: [55, 65], descripcion: "Café Bourbon amarillo, beneficio natural. Notas a caramelo, chocolate y nueces. Cuerpo intenso." },
  { slug: "acai-organico-br", nombre: "Açaí Orgánico", categoria: "Frutas", productorNombre: "Cooperativa Açaí Pará", region: "Belém", estado: "Pará", certs: ["USDA Organic", "Fair Trade"], rating: 4.8, years: 18, precio: 28, unidad: "kg", stock: 680, diasCosecha: -3, vidaUtilDias: 14, urgencia: "media", imagen: IMG.acai, tempBase: -18.0, humBase: 80, rangoTemp: [-20, -15], rangoHum: [75, 85], descripcion: "Pulpa de açaí congelada IQF, orgánico certificado. Antioxidante natural del Amazonas." },
  { slug: "mango-tommy-br", nombre: "Mango Tommy Atkins", categoria: "Frutas", productorNombre: "Frutas Petrolina", region: "Petrolina", estado: "Pernambuco", certs: ["GLOBALG.A.P.", "USDA"], rating: 4.7, years: 22, precio: 18, unidad: "kg", stock: 3200, diasCosecha: -3, vidaUtilDias: 14, urgencia: "media", imagen: IMG.mango, tempBase: 12.5, humBase: 88, rangoTemp: [10, 13], rangoHum: [85, 90], descripcion: "Mango Tommy Atkins calibre 8-10, color rojo intenso. Exportación a Europa todo el año." },
  { slug: "naranja-jugo-sao-paulo", nombre: "Naranja Pera para Jugo", categoria: "Frutas", productorNombre: "Citrosuco São Paulo", region: "Bebedouro", estado: "São Paulo", certs: ["GLOBALG.A.P.", "SAI"], rating: 4.6, years: 38, precio: 12, unidad: "kg", stock: 9200, diasCosecha: -4, vidaUtilDias: 21, urgencia: "baja", imagen: IMG.naranja, tempBase: 8.0, humBase: 85, rangoTemp: [5, 10], rangoHum: [80, 90], descripcion: "Naranja Pera Rio, alta extracción de jugo. Brasil es líder mundial en exportación de jugo." },
  { slug: "soja-cerrado-br", nombre: "Soja Cerrado", categoria: "Granos", productorNombre: "Fazendeiros Cerrado", region: "Cerrado", estado: "Mato Grosso", certs: ["GMP+", "ProTerra"], rating: 4.5, years: 28, precio: 14, unidad: "kg", stock: 12500, diasCosecha: -45, vidaUtilDias: 365, urgencia: "baja", imagen: IMG.soja, tempBase: 18.0, humBase: 50, rangoTemp: [15, 22], rangoHum: [40, 60], descripcion: "Soja del Cerrado brasileño, no transgénica para mercado europeo. Bolsas de 50 kg." },
  { slug: "guaraná-amazonas-br", nombre: "Guaraná Seco", categoria: "Especias", productorNombre: "Tribus Sateré-Mawé", region: "Amazonas", estado: "Amazonas", certs: ["Fair Trade", "Orgánico"], rating: 4.9, years: 30, precio: 75, unidad: "kg", stock: 240, diasCosecha: -25, vidaUtilDias: 730, urgencia: "baja", imagen: IMG.guarana, tempBase: 22.0, humBase: 45, rangoTemp: [18, 26], rangoHum: [35, 50], descripcion: "Guaraná seco amazónico, alto contenido cafeína natural. Producción ancestral indígena." },
  { slug: "papaya-formosa-br", nombre: "Papaya Formosa", categoria: "Frutas", productorNombre: "Frutas do Norte", region: "Espírito Santo", estado: "Espírito Santo", certs: ["GLOBALG.A.P."], rating: 4.7, years: 16, precio: 22, unidad: "kg", stock: 2100, diasCosecha: -2, vidaUtilDias: 10, urgencia: "media", imagen: IMG.papaya, tempBase: 10.5, humBase: 88, rangoTemp: [10, 13], rangoHum: [85, 95], descripcion: "Papaya Formosa peso 1.5-2 kg, pulpa anaranjada dulce. Exportación a Europa y USA." },
  { slug: "cacao-bahia-br", nombre: "Cacao Bahía", categoria: "Cacao", productorNombre: "Cacau Sul Bahia", region: "Itabuna", estado: "Bahia", certs: ["Fair Trade", "Orgánico"], rating: 4.8, years: 35, precio: 32, unidad: "kg", stock: 580, diasCosecha: -12, vidaUtilDias: 180, urgencia: "baja", imagen: IMG.cacao, tempBase: 22.0, humBase: 55, rangoTemp: [18, 24], rangoHum: [50, 60], descripcion: "Cacao bahiano sistema cabruca, sombra natural. Fermentación 6 días, secado al sol." },
];

// Assemble all products in country order
export const products: Product[] = [
  ...mxSeeds.map((s) => build("MX", s)),
  ...crSeeds.map((s) => build("CR", s)),
  ...coSeeds.map((s) => build("CO", s)),
  ...arSeeds.map((s) => build("AR", s)),
  ...clSeeds.map((s) => build("CL", s)),
  ...peSeeds.map((s) => build("PE", s)),
  ...ecSeeds.map((s) => build("EC", s)),
  ...uySeeds.map((s) => build("UY", s)),
  ...gtSeeds.map((s) => build("GT", s)),
  ...brSeeds.map((s) => build("BR", s)),
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id || p.slug === id);
}

export function getProductByLoteId(loteId: string): Product | undefined {
  return products.find((p) => p.loteId === loteId);
}

export function filterProducts(opts: {
  country?: CountryCode;
  categoria?: string;
  region?: string;
  urgencia?: string;
  precioMax?: number;
  precioMin?: number;
  q?: string;
}): Product[] {
  return products.filter((p) => {
    if (opts.country && p.country !== opts.country) return false;
    if (opts.categoria && opts.categoria !== "todas" && p.categoria !== opts.categoria)
      return false;
    if (
      opts.region &&
      opts.region !== "todas" &&
      p.productor.estado !== opts.region &&
      p.productor.region !== opts.region
    )
      return false;
    if (opts.urgencia && opts.urgencia !== "todas" && p.urgencia !== opts.urgencia)
      return false;
    if (opts.precioMax !== undefined && p.precio > opts.precioMax) return false;
    if (opts.precioMin !== undefined && p.precio < opts.precioMin) return false;
    if (opts.q) {
      const q = opts.q.toLowerCase();
      if (
        !p.nombre.toLowerCase().includes(q) &&
        !p.productor.nombre.toLowerCase().includes(q) &&
        !p.categoria.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export const categorias: string[] = [
  "todas",
  "Hortalizas",
  "Frutas",
  "Lácteos",
  "Granos",
  "Carnes",
  "Café",
  "Cacao",
  "Especias",
  "Tubérculos",
];

// Returns all regions present for a given country, or all global if no country.
export function getRegionsForCountry(country?: CountryCode): string[] {
  const set = new Set<string>();
  for (const p of products) {
    if (country && p.country !== country) continue;
    set.add(p.productor.estado);
  }
  return ["todas", ...Array.from(set).sort()];
}

export const regiones: string[] = (() => {
  const set = new Set<string>();
  for (const p of products) set.add(p.productor.estado);
  return ["todas", ...Array.from(set).sort()];
})();

export const urgencias: string[] = ["todas", "alta", "media", "baja"];
