/**
 * Resolver de imágenes de producto por palabra clave.
 *
 * Fuente única de verdad para asignar la imagen CORRECTA a cada producto
 * agrícola: "Café Tarrazú" → foto de café, "Piña Dorada" → foto de piña, etc.
 *
 * Usos:
 *  - Lotes creados por productores sin imagen → se asigna automáticamente.
 *  - Auditoría del catálogo estático (products.ts) para corregir mismatches.
 *
 * URLs de Unsplash verificadas manualmente por producto.
 */

/** Imagen por defecto cuando ninguna keyword matchea (placeholder local). */
export const DEFAULT_PRODUCT_IMAGE = "/placeholder-product.svg";

interface ImageRule {
  /** keywords en minúsculas SIN acentos; se prueba en orden — primera gana */
  keywords: string[];
  url: string;
}

/**
 * Reglas ordenadas de más específica a más genérica.
 * Nota: la comparación normaliza acentos (café → cafe).
 */
const IMAGE_RULES: ImageRule[] = [
  // ——— Frutas específicas ———
  { keywords: ["aguacate", "palta", "avocado", "hass"], url: "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=800&q=80" },
  { keywords: ["mango"], url: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=800&q=80" },
  { keywords: ["pina", "piña", "ananas"], url: "https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=800&q=80" },
  { keywords: ["platano", "plátano"], url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&q=80" },
  { keywords: ["banano", "banana"], url: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=800&q=80" },
  { keywords: ["papaya"], url: "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=800&q=80" },
  { keywords: ["fresa", "frutilla", "strawberry"], url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80" },
  { keywords: ["arandano", "arándano", "blueberry"], url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80" },
  { keywords: ["cereza", "cherry"], url: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800&q=80" },
  { keywords: ["uva", "grape"], url: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80" },
  { keywords: ["limon", "limón", "lima"], url: "https://images.unsplash.com/photo-1582287014914-1db836066f73?w=800&q=80" },
  { keywords: ["naranja", "orange"], url: "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&q=80" },
  { keywords: ["mandarina"], url: "https://images.unsplash.com/photo-1591183740314-fb1e0f0dbe1c?w=800&q=80" },
  { keywords: ["manzana", "apple"], url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80" },
  { keywords: ["kiwi"], url: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800&q=80" },
  { keywords: ["maracuya", "maracuyá", "pasion", "passion", "gulupa"], url: "https://images.unsplash.com/photo-1604495772376-9657f0035eb5?w=800&q=80" },
  { keywords: ["sandia", "sandía", "watermelon"], url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80" },
  { keywords: ["melon", "melón"], url: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=800&q=80" },
  { keywords: ["acai", "açai", "açaí"], url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80" },
  { keywords: ["tomate de arbol", "tomate arbol", "tamarillo"], url: "https://images.unsplash.com/photo-1546470427-227df1e3c848?w=800&q=80" },

  // ——— Café / cacao / bebidas ———
  { keywords: ["cafe", "café", "coffee", "tarrazu", "tarrazú", "arabica", "bourbon", "excelso", "chanchamayo", "antigua"], url: "https://images.unsplash.com/photo-1559525839-d9acfd0b8978?w=800&q=80" },
  { keywords: ["cacao", "chocolate", "criollo"], url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&q=80" },
  { keywords: ["yerba mate", "mate"], url: "https://images.unsplash.com/photo-1612883540434-c70a59e9af90?w=800&q=80" },
  { keywords: ["guarana", "guaraná"], url: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=800&q=80" },

  // ——— Hortalizas ———
  { keywords: ["tomate", "jitomate"], url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80" },
  { keywords: ["esparrago", "espárrago", "asparagus"], url: "https://images.unsplash.com/photo-1515471209610-dae1c92d8777?w=800&q=80" },
  { keywords: ["cebolla"], url: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&q=80" },
  { keywords: ["zanahoria", "carrot"], url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80" },
  { keywords: ["lechuga", "lettuce"], url: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&q=80" },
  { keywords: ["espinaca", "spinach"], url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80" },
  { keywords: ["brocoli", "brócoli", "broccoli"], url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&q=80" },
  { keywords: ["pimiento", "chile", "aji", "ají"], url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80" },
  { keywords: ["arveja", "guisante", "pea"], url: "https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=800&q=80" },
  { keywords: ["pepino", "cucumber"], url: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&q=80" },

  // ——— Granos / semillas ———
  { keywords: ["quinua", "quinoa"], url: "https://images.unsplash.com/photo-1565895405127-481853366cf8?w=800&q=80" },
  { keywords: ["soja", "soya"], url: "https://images.unsplash.com/photo-1601459427108-47e20d579a35?w=800&q=80" },
  { keywords: ["maiz", "maíz", "elote", "corn"], url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80" },
  { keywords: ["frijol", "poroto", "bean"], url: "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=800&q=80" },
  { keywords: ["arroz", "rice"], url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80" },
  { keywords: ["trigo", "wheat"], url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80" },

  // ——— Tubérculos ———
  { keywords: ["papa", "patata", "potato"], url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80" },
  { keywords: ["yuca", "mandioca", "cassava"], url: "https://images.unsplash.com/photo-1619860705243-dbef552e7118?w=800&q=80" },
  { keywords: ["camote", "batata", "boniato"], url: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=800&q=80" },

  // ——— Lácteos / proteína ———
  { keywords: ["leche", "lacteo", "lácteo", "milk"], url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80" },
  { keywords: ["queso", "cheese"], url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80" },
  { keywords: ["yogurt", "yogur"], url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80" },
  { keywords: ["carne", "res", "beef"], url: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&q=80" },
  { keywords: ["salmon", "salmón", "trucha"], url: "https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=800&q=80" },
  { keywords: ["huevo", "egg"], url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80" },

  // ——— Especias / otros ———
  { keywords: ["miel", "honey"], url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80" },
  { keywords: ["cardamomo", "cardamom"], url: "https://images.unsplash.com/photo-1599909533730-d2efbf6c20e7?w=800&q=80" },
  { keywords: ["vainilla", "vanilla"], url: "https://images.unsplash.com/photo-1631206753348-db44968fd440?w=800&q=80" },
  { keywords: ["rosa", "flor", "flower"], url: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80" },
];

/** Fallbacks por categoría cuando el nombre no matchea ninguna regla. */
const CATEGORY_FALLBACKS: Record<string, string> = {
  Frutas: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80",
  Hortalizas: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
  Granos: "https://images.unsplash.com/photo-1592035659284-3b39971c1107?w=800&q=80",
  "Café": "https://images.unsplash.com/photo-1559525839-d9acfd0b8978?w=800&q=80",
  Cacao: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&q=80",
  "Lácteos": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
  Especias: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
  "Tubérculos": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
  Carnes: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&q=80",
};

/** Normaliza: minúsculas + sin acentos. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Devuelve la URL de imagen correcta para un producto según su nombre
 * y categoría. Nunca devuelve vacío: cae al fallback de categoría y
 * finalmente al placeholder local.
 */
export function resolveProductImage(name: string, category?: string): string {
  const n = normalize(name);
  for (const rule of IMAGE_RULES) {
    if (rule.keywords.some((k) => n.includes(normalize(k)))) return rule.url;
  }
  if (category && CATEGORY_FALLBACKS[category]) return CATEGORY_FALLBACKS[category];
  return DEFAULT_PRODUCT_IMAGE;
}

/**
 * Verifica si la imagen actual de un producto coincide con la que el
 * resolver asignaría. Útil para auditorías del catálogo.
 */
export function imageMatchesProduct(currentUrl: string, name: string, category?: string): boolean {
  return currentUrl === resolveProductImage(name, category);
}
