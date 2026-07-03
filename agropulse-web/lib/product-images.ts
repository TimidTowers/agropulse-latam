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
 * URLs (Unsplash + Wikimedia Commons) verificadas visualmente por producto.
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
  // ——— Frutas específicas ——— (verificada 2026-07)
  { keywords: ["aguacate", "palta", "avocado", "hass"], url: "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=800&q=80" },
  { keywords: ["mango"], url: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=800&q=80" },
  { keywords: ["pina", "piña", "ananas"], url: "https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=800&q=80" },
  { keywords: ["platano", "plátano"], url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&q=80" },
  { keywords: ["banano", "banana"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Bunch_of_bananas_on_sale.jpg/960px-Bunch_of_bananas_on_sale.jpg" },
  { keywords: ["papaya"], url: "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=800&q=80" },
  { keywords: ["fresa", "frutilla", "strawberry"], url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80" },
  { keywords: ["arandano", "arándano", "blueberry"], url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80" },
  { keywords: ["cereza", "cherry"], url: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800&q=80" },
  { keywords: ["uva", "grape"], url: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80" },
  { keywords: ["limon", "limón", "lima"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lemon_-_whole_and_split.jpg/960px-Lemon_-_whole_and_split.jpg" },
  { keywords: ["naranja", "orange"], url: "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&q=80" },
  { keywords: ["mandarina"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Mandarin_Oranges_%28Citrus_Reticulata%29.jpg/960px-Mandarin_Oranges_%28Citrus_Reticulata%29.jpg" },
  { keywords: ["manzana", "apple"], url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80" },
  { keywords: ["kiwi"], url: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800&q=80" },
  { keywords: ["maracuya", "maracuyá", "pasion", "passion", "gulupa"], url: "https://images.unsplash.com/photo-1604495772376-9657f0035eb5?w=800&q=80" },
  { keywords: ["sandia", "sandía", "watermelon"], url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80" },
  { keywords: ["melon", "melón"], url: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=800&q=80" },
  { keywords: ["acai", "açai", "açaí"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Acai_berry_bowl_%2842019112550%29.jpg/960px-Acai_berry_bowl_%2842019112550%29.jpg" },
  { keywords: ["tomate de arbol", "tomate arbol", "tamarillo"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Red_tamarillo_fruit.jpg/960px-Red_tamarillo_fruit.jpg" },

  // ——— Café / cacao / bebidas ——— (verificada 2026-07)
  { keywords: ["cafe", "café", "coffee", "tarrazu", "tarrazú", "arabica", "bourbon", "excelso", "chanchamayo", "antigua"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Roasted_coffee_beans.jpg/960px-Roasted_coffee_beans.jpg" },
  { keywords: ["cacao", "chocolate", "criollo"], url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&q=80" },
  { keywords: ["yerba mate", "mate"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Mate_criollo.JPG/960px-Mate_criollo.JPG" },
  { keywords: ["guarana", "guaraná"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Flickr_-_ggallice_-_Guarana_%281%29.jpg/960px-Flickr_-_ggallice_-_Guarana_%281%29.jpg" },

  // ——— Hortalizas ——— (verificada 2026-07)
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

  // ——— Granos / semillas ——— (verificada 2026-07)
  { keywords: ["quinua", "quinoa"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Quinoa_grain_bowl_brunch_at_Caravan_Bankside%2C_London%2C_UK_%2836736487911%29.jpg/960px-Quinoa_grain_bowl_brunch_at_Caravan_Bankside%2C_London%2C_UK_%2836736487911%29.jpg" },
  { keywords: ["soja", "soya"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Soybeans_at_Harvest_%2810138603386%29.jpg/960px-Soybeans_at_Harvest_%2810138603386%29.jpg" },
  { keywords: ["maiz", "maíz", "elote", "corn"], url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80" },
  { keywords: ["frijol", "poroto", "bean"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Dry_beans.jpg/960px-Dry_beans.jpg" },
  { keywords: ["arroz", "rice"], url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80" },
  { keywords: ["trigo", "wheat"], url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80" },

  // ——— Tubérculos ——— (verificada 2026-07)
  { keywords: ["papa", "patata", "potato"], url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80" },
  { keywords: ["yuca", "mandioca", "cassava"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Harvested_cassava_roots_03.jpg/960px-Harvested_cassava_roots_03.jpg" },
  { keywords: ["camote", "batata", "boniato"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ipomoea_batatas_006.JPG/960px-Ipomoea_batatas_006.JPG" },

  // ——— Lácteos / proteína ——— (verificada 2026-07)
  { keywords: ["leche", "lacteo", "lácteo", "milk"], url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80" },
  { keywords: ["queso", "cheese"], url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80" },
  { keywords: ["yogurt", "yogur"], url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80" },
  { keywords: ["carne", "res", "beef"], url: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&q=80" },
  { keywords: ["salmon", "salmón", "trucha"], url: "https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=800&q=80" },
  { keywords: ["huevo", "egg"], url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80" },

  // ——— Especias / otros ——— (verificada 2026-07)
  { keywords: ["miel", "honey"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Dipper_stick_and_honey_in_a_jar.jpg/960px-Dipper_stick_and_honey_in_a_jar.jpg" },
  { keywords: ["cardamomo", "cardamom"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Cardamom_pods_-_Green_BNC.jpg/960px-Cardamom_pods_-_Green_BNC.jpg" },
  { keywords: ["vainilla", "vanilla"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Vanilla_6beans.JPG/960px-Vanilla_6beans.JPG" },
  { keywords: ["rosa", "flor", "flower"], url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Bouquet_of_red_roses.jpg/960px-Bouquet_of_red_roses.jpg" },
];

/** Fallbacks por categoría cuando el nombre no matchea ninguna regla. (verificada 2026-07) */
const CATEGORY_FALLBACKS: Record<string, string> = {
  Frutas: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80",
  Hortalizas: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
  Granos: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/GrainProducts.jpg/960px-GrainProducts.jpg",
  "Café": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Roasted_coffee_beans.jpg/960px-Roasted_coffee_beans.jpg",
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
