/**
 * Casos de éxito de AgroPulse — 30 historias ficticias pero verosímiles,
 * exactamente 3 por cada uno de los 10 países donde operamos.
 * Costa Rica (país de origen) siempre va primero en el array.
 */

import type { CountryCode } from "@/lib/countries";
import { resolveProductImage } from "@/lib/product-images";

export interface SuccessCaseMetric {
  label: string;
  value: string;
}

export interface SuccessCase {
  id: string;
  slug: string;
  country: CountryCode;
  productorName: string;
  cooperativa: string;
  /** Región agrícola real del país. */
  region: string;
  producto: string;
  categoria: string;
  /** Headline con resultado concreto. */
  titulo: string;
  /** 2-3 oraciones del antes/después con AgroPulse. */
  resumen: string;
  /** 1-2 oraciones en primera persona. */
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  /** Exactamente 3 métricas de resultado. */
  metrics: [SuccessCaseMetric, SuccessCaseMetric, SuccessCaseMetric];
  imagen: string;
  year: 2025 | 2026;
}

function c(
  data: Omit<SuccessCase, "imagen">,
): SuccessCase {
  return { ...data, imagen: resolveProductImage(data.producto, data.categoria) };
}

export const SUCCESS_CASES: SuccessCase[] = [
  // ——————————————— Costa Rica (origen) ———————————————
  c({
    id: "caso-cr-01",
    slug: "cafe-tarrazu-hermanos-navarro",
    country: "CR",
    productorName: "Hermanos Navarro",
    cooperativa: "CoopeTarrazú R.L.",
    region: "Tarrazú, Los Santos",
    producto: "Café Tarrazú",
    categoria: "Café",
    titulo: "De perder 3 de cada 10 quintales a exportar café de especialidad",
    resumen:
      "Los Navarro perdían casi el 30% de su cosecha por fermentaciones descontroladas en el beneficio húmedo. Con los sensores de humedad y temperatura de AgroPulse ajustaron el secado en tiempo real y hoy venden microlotes a tostadores de especialidad en tres continentes.",
    quote:
      "Antes adivinábamos el punto de secado; ahora lo vemos en el teléfono. Ese cambio nos abrió la puerta del café de especialidad.",
    quoteAuthor: "Marco Navarro",
    quoteRole: "Productor y jefe de beneficio",
    metrics: [
      { label: "Reducción de mermas", value: "-32%" },
      { label: "Ingreso adicional anual", value: "+27%" },
      { label: "Retorno de inversión", value: "4 meses" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-cr-02",
    slug: "pina-dorada-huetar-norte",
    country: "CR",
    productorName: "Finca El Roble",
    cooperativa: "ProPiña Huetar Norte",
    region: "Región Huetar Norte, San Carlos",
    producto: "Piña Dorada",
    categoria: "Frutas",
    titulo: "Piña que llegaba golpeada ahora viaja con trazabilidad completa",
    resumen:
      "El 25% de la piña de Finca El Roble se rechazaba en destino por golpes de calor durante el transporte. Con el monitoreo de cadena de frío y las alertas de AgroPulse renegociaron rutas y hoy sus contenedores llegan con menos del 5% de rechazo.",
    quote:
      "El comprador en Rotterdam ve la misma temperatura que yo veo en Pital. Esa transparencia nos ganó el contrato anual.",
    quoteAuthor: "Gabriela Rojas",
    quoteRole: "Gerente de exportaciones",
    metrics: [
      { label: "Reducción de mermas", value: "-28%" },
      { label: "Rechazos en destino", value: "-80%" },
      { label: "Ingreso adicional anual", value: "+22%" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-cr-03",
    slug: "banano-caribe-limon",
    country: "CR",
    productorName: "Bananera Río Estrella",
    cooperativa: "Coopebana Caribe",
    region: "Limón, Caribe",
    producto: "Banano Cavendish",
    categoria: "Frutas",
    titulo: "El banano del Caribe que dejó de madurar antes de tiempo",
    resumen:
      "Las lluvias del Caribe adelantaban la maduración y obligaban a vender a precio de descarte. Con los sensores de etileno y el pronóstico de demanda de AgroPulse, Río Estrella sincroniza corte y despacho, y coloca la fruta en el marketplace antes de cosecharla.",
    quote:
      "Pasamos de rogar por compradores de última hora a tener la fruta vendida ocho días antes del corte.",
    quoteAuthor: "Luis Fernando Brenes",
    quoteRole: "Administrador de finca",
    metrics: [
      { label: "Reducción de mermas", value: "-35%" },
      { label: "Precio promedio por caja", value: "+18%" },
      { label: "Retorno de inversión", value: "5 meses" },
    ],
    year: 2026,
  }),

  // ——————————————— México ———————————————
  c({
    id: "caso-mx-01",
    slug: "aguacate-hass-michoacan",
    country: "MX",
    productorName: "Huerta San Cristóbal",
    cooperativa: "Unión Aguacatera de Uruapan",
    region: "Uruapan, Michoacán",
    producto: "Aguacate Hass",
    categoria: "Frutas",
    titulo: "Aguacate Hass con maduración controlada rumbo a Norteamérica",
    resumen:
      "La huerta perdía camiones completos por maduración irregular en tránsito. Con la telemetría de AgroPulse en cada tráiler y el matching con compradores certificados, ahora programan cortes por índice de materia seca y venden el 96% de la producción.",
    quote:
      "Cada tarima lleva su historia: cuándo se cortó, a qué temperatura viajó. El importador paga más por esa certeza.",
    quoteAuthor: "Alejandra Cortés",
    quoteRole: "Directora de la huerta",
    metrics: [
      { label: "Reducción de mermas", value: "-41%" },
      { label: "Ingreso adicional anual", value: "+31%" },
      { label: "Retorno de inversión", value: "3 meses" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-mx-02",
    slug: "mango-ataulfo-soconusco",
    country: "MX",
    productorName: "Ejido La Primavera",
    cooperativa: "Mangos del Soconusco S.C.",
    region: "Soconusco, Chiapas",
    producto: "Mango Ataulfo",
    categoria: "Frutas",
    titulo: "El Ataulfo del Soconusco que conquistó supermercados sin coyotes",
    resumen:
      "Los intermediarios pagaban el mango Ataulfo a mitad de precio y aun así se perdía fruta esperando comprador. Con el marketplace B2B de AgroPulse el ejido vende directo a dos cadenas de autoservicio y planifica el corte con demanda confirmada.",
    quote:
      "Por primera vez en veinte años el precio lo ponemos nosotros, no el coyote en la puerta del ejido.",
    quoteAuthor: "Ramiro Estrada",
    quoteRole: "Presidente del ejido",
    metrics: [
      { label: "Reducción de mermas", value: "-24%" },
      { label: "Precio de venta directa", value: "+45%" },
      { label: "Nuevos compradores B2B", value: "7" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-mx-03",
    slug: "cafe-veracruz-coatepec",
    country: "MX",
    productorName: "Finca Las Nubes",
    cooperativa: "Café de Altura de Coatepec",
    region: "Coatepec, Veracruz",
    producto: "Café de Veracruz",
    categoria: "Café",
    titulo: "Café de Veracruz: del secado a cielo abierto al perfil de taza estable",
    resumen:
      "La humedad de la sierra veracruzana arruinaba lotes enteros en patio. Con sensores en camas africanas y alertas tempranas de AgroPulse, Las Nubes estabilizó el perfil de taza y firmó su primer contrato de exportación con prima de calidad.",
    quote:
      "El sensor me avisa antes de que la lluvia llegue al patio. Ese margen de una hora vale toda la cosecha.",
    quoteAuthor: "Rosario Méndez",
    quoteRole: "Caficultora, tercera generación",
    metrics: [
      { label: "Reducción de mermas", value: "-29%" },
      { label: "Prima de calidad", value: "+19%" },
      { label: "Retorno de inversión", value: "6 meses" },
    ],
    year: 2026,
  }),

  // ——————————————— Colombia ———————————————
  c({
    id: "caso-co-01",
    slug: "cafe-excelso-quindio",
    country: "CO",
    productorName: "Finca La Esmeralda",
    cooperativa: "Cooperativa de Caficultores del Quindío",
    region: "Eje Cafetero, Quindío",
    producto: "Café Excelso",
    categoria: "Café",
    titulo: "Trazabilidad QR que triplicó los compradores de un café del Quindío",
    resumen:
      "La Esmeralda producía café excelso de altura pero lo vendía como carga estándar. Con la trazabilidad por QR de AgroPulse cada saco cuenta su origen, y el pronóstico de demanda le permitió pasar de un comprador único a un portafolio de nueve tostadores.",
    quote:
      "El QR en el saco hizo lo que veinte años de ferias no lograron: que el tostador conociera nuestra finca.",
    quoteAuthor: "Julián Restrepo",
    quoteRole: "Caficultor y administrador",
    metrics: [
      { label: "Reducción de mermas", value: "-26%" },
      { label: "Compradores activos", value: "9" },
      { label: "Ingreso adicional anual", value: "+34%" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-co-02",
    slug: "cacao-fino-santander",
    country: "CO",
    productorName: "Asociación El Carmen",
    cooperativa: "Cacaoteros de San Vicente de Chucurí",
    region: "San Vicente de Chucurí, Santander",
    producto: "Cacao Fino de Aroma",
    categoria: "Cacao",
    titulo: "Fermentación monitoreada: el cacao de Santander que exporta a chocolaterías",
    resumen:
      "La fermentación irregular castigaba el precio del cacao fino de aroma de El Carmen. Con sondas de temperatura en los cajones fermentadores y protocolos guiados por AgroPulse, la asociación estandarizó la calidad y hoy exporta a chocolaterías bean-to-bar europeas.",
    quote:
      "Cada cajón fermenta igual que el anterior. Esa consistencia fue lo que pidió el comprador belga para firmar.",
    quoteAuthor: "Nelly Quintero",
    quoteRole: "Líder de poscosecha",
    metrics: [
      { label: "Reducción de mermas", value: "-33%" },
      { label: "Precio por kilo exportado", value: "+38%" },
      { label: "Retorno de inversión", value: "5 meses" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-co-03",
    slug: "gulupa-cundinamarca",
    country: "CO",
    productorName: "Frutales de Tierra Fría",
    cooperativa: "AsoGulupa Cundinamarca",
    region: "Granada, Cundinamarca",
    producto: "Gulupa",
    categoria: "Frutas",
    titulo: "Gulupa premium: de rechazo aéreo a cliente fijo en Europa",
    resumen:
      "Los envíos aéreos de gulupa llegaban con arrugamiento prematuro y rechazos del 20%. Con la cadena de frío monitoreada y las ventanas de cosecha que sugiere AgroPulse, Frutales de Tierra Fría redujo los rechazos a un dígito y consolidó un cliente fijo en Alemania.",
    quote:
      "La gulupa es delicada como el cristal. Ahora sabemos exactamente en qué punto cortarla para que aguante el vuelo.",
    quoteAuthor: "Andrés Felipe Herrera",
    quoteRole: "Gerente comercial",
    metrics: [
      { label: "Reducción de mermas", value: "-21%" },
      { label: "Rechazos en destino", value: "-72%" },
      { label: "Ingreso adicional anual", value: "+24%" },
    ],
    year: 2026,
  }),

  // ——————————————— Argentina ———————————————
  c({
    id: "caso-ar-01",
    slug: "yerba-mate-misiones",
    country: "AR",
    productorName: "Establecimiento Don Aníbal",
    cooperativa: "Cooperativa Yerbatera de Andresito",
    region: "Andresito, Misiones",
    producto: "Yerba Mate",
    categoria: "Especias",
    titulo: "Yerba mate con secanza controlada y venta directa a molinos",
    resumen:
      "El secado a barbacuá sin control quemaba hoja y bajaba el precio en el molino. Con sensores de temperatura en la secanza y el marketplace de AgroPulse, Don Aníbal estabilizó la calidad de la hoja canchada y negocia directo con tres molinos sin acopiador.",
    quote:
      "La hoja sale pareja, verde y sin humo. El molino lo nota y lo paga; el sensor se pagó solo en una zafra.",
    quoteAuthor: "Aníbal Kowalski",
    quoteRole: "Productor yerbatero",
    metrics: [
      { label: "Reducción de mermas", value: "-27%" },
      { label: "Precio por kilo canchada", value: "+21%" },
      { label: "Retorno de inversión", value: "4 meses" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-ar-02",
    slug: "limon-tucuman",
    country: "AR",
    productorName: "Citrícola El Naranjal",
    cooperativa: "Citricultores del Sur Tucumano",
    region: "Famaillá, Tucumán",
    producto: "Limón Tucumano",
    categoria: "Frutas",
    titulo: "Limón de Tucumán: empaque sincronizado con la demanda del hemisferio norte",
    resumen:
      "El Naranjal empacaba a ciegas y el limón esperaba semanas en cámara perdiendo calidad. Con el pronóstico de demanda de AgroPulse alinearon cosecha, empaque y buque, bajando el tiempo en cámara de 21 a 8 días y las mermas por deshidratación a menos de la mitad.",
    quote:
      "Antes la cámara era un cementerio de fruta. Hoy es sólo una escala de dos días antes del puerto.",
    quoteAuthor: "María Eugenia Paz",
    quoteRole: "Jefa de empaque",
    metrics: [
      { label: "Reducción de mermas", value: "-38%" },
      { label: "Días en cámara", value: "-62%" },
      { label: "Ingreso adicional anual", value: "+26%" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-ar-03",
    slug: "miel-pampa-humeda",
    country: "AR",
    productorName: "Apícola Los Tréboles",
    cooperativa: "Cooperativa Apícola de la Pampa Húmeda",
    region: "Pampa Húmeda, Buenos Aires",
    producto: "Miel de Pradera",
    categoria: "Especias",
    titulo: "Miel de pradera con lote trazable que duplicó los canales de venta",
    resumen:
      "Los Tréboles vendía toda la miel a granel a un solo exportador. Con la trazabilidad por lote y el marketplace B2B de AgroPulse fraccionan parte de la producción con QR de origen y venden a tiendas gourmet, duplicando los canales y capturando mejor precio.",
    quote:
      "El frasco con QR cuenta de qué colmenar salió la miel. Los clientes gourmet pagan esa historia.",
    quoteAuthor: "Sergio Aguirre",
    quoteRole: "Apicultor y socio fundador",
    metrics: [
      { label: "Reducción de mermas", value: "-19%" },
      { label: "Canales de venta", value: "x2" },
      { label: "Ingreso adicional anual", value: "+29%" },
    ],
    year: 2026,
  }),

  // ——————————————— Chile ———————————————
  c({
    id: "caso-cl-01",
    slug: "cerezas-maule",
    country: "CL",
    productorName: "Agrícola Santa Amalia",
    cooperativa: "Cerezas del Maule A.G.",
    region: "Valle del Maule",
    producto: "Cerezas Premium",
    categoria: "Frutas",
    titulo: "Cerezas para Asia: cadena de frío perfecta en 34 días de tránsito",
    resumen:
      "Un solo quiebre de frío arruinaba contenedores de cereza rumbo a Asia. Santa Amalia instaló la telemetría de AgroPulse en cada reefer y hoy documenta la cadena de frío completa ante el importador, cobrando la prima de la fruta que llega impecable al Año Nuevo chino.",
    quote:
      "Treinta y cuatro días de viaje y podemos probar que la fruta nunca superó los 0,5 °C. Eso vale oro en Shanghái.",
    quoteAuthor: "Cristóbal Fuentes",
    quoteRole: "Gerente de exportaciones",
    metrics: [
      { label: "Reducción de mermas", value: "-36%" },
      { label: "Prima por calidad de arribo", value: "+23%" },
      { label: "Retorno de inversión", value: "1 temporada" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-cl-02",
    slug: "uva-mesa-coquimbo",
    country: "CL",
    productorName: "Viña del Sol Parronales",
    cooperativa: "Uva de Mesa Elqui-Limarí",
    region: "Valle del Limarí, Coquimbo",
    producto: "Uva de Mesa",
    categoria: "Frutas",
    titulo: "Uva de mesa con riego y cosecha guiados por datos en plena sequía",
    resumen:
      "Con la mega sequía, cada riego cuenta. Viña del Sol combinó sensores de humedad de suelo de AgroPulse con ventanas de cosecha por demanda, ahorrando un tercio del agua y despachando racimos más firmes que soportan mejor el tránsito a Estados Unidos.",
    quote:
      "Riego cuando la planta lo pide, no cuando toca por calendario. La uva llega más firme y el agua alcanza.",
    quoteAuthor: "Paulina Araya",
    quoteRole: "Ingeniera agrónoma jefa",
    metrics: [
      { label: "Reducción de mermas", value: "-22%" },
      { label: "Ahorro de agua", value: "-31%" },
      { label: "Ingreso adicional anual", value: "+17%" },
    ],
    year: 2026,
  }),
  c({
    id: "caso-cl-03",
    slug: "palta-aconcagua",
    country: "CL",
    productorName: "Huerto Los Espinos",
    cooperativa: "Paltas del Aconcagua",
    region: "Valle del Aconcagua, Quillota",
    producto: "Palta Hass",
    categoria: "Frutas",
    titulo: "Palta chilena con materia seca certificada lote por lote",
    resumen:
      "Los Espinos cosechaba palta con materia seca dispareja y sufría castigos de precio. Con el registro por lote de AgroPulse certifican madurez antes del corte y el packing recibe fruta homogénea, reduciendo el descarte y asegurando programas anuales con retail.",
    quote:
      "El comprador ya no muestrea a ciegas: ve la materia seca de cada lote en la plataforma antes de que el camión salga.",
    quoteAuthor: "Rodrigo Salinas",
    quoteRole: "Administrador del huerto",
    metrics: [
      { label: "Reducción de mermas", value: "-30%" },
      { label: "Descarte en packing", value: "-58%" },
      { label: "Retorno de inversión", value: "6 meses" },
    ],
    year: 2025,
  }),

  // ——————————————— Perú ———————————————
  c({
    id: "caso-pe-01",
    slug: "quinua-puno",
    country: "PE",
    productorName: "Comunidad de Cabana",
    cooperativa: "Cooperativa Agraria Quinua Real del Altiplano",
    region: "Altiplano de Puno",
    producto: "Quinua Real",
    categoria: "Granos",
    titulo: "Quinua del altiplano con almacenamiento que venció a la helada",
    resumen:
      "Las heladas y la humedad del altiplano dañaban el grano almacenado en los depósitos comunales. Con sensores de humedad y alertas de AgroPulse, la comunidad de Cabana ventila y rota el grano a tiempo, conservando quinua exportable durante todo el año.",
    quote:
      "El celular suena cuando el depósito se humedece. Antes lo descubríamos cuando el grano ya estaba perdido.",
    quoteAuthor: "Faustino Mamani",
    quoteRole: "Presidente de la cooperativa",
    metrics: [
      { label: "Reducción de mermas", value: "-39%" },
      { label: "Grano exportable", value: "+35%" },
      { label: "Retorno de inversión", value: "7 meses" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-pe-02",
    slug: "esparragos-ica",
    country: "PE",
    productorName: "Fundo Santa Catalina",
    cooperativa: "Espárragos del Valle de Ica",
    region: "Valle de Ica",
    producto: "Espárragos Verdes",
    categoria: "Hortalizas",
    titulo: "Espárragos de Ica: seis horas menos entre corte y frío",
    resumen:
      "El espárrago pierde calidad hora a hora después del corte. Santa Catalina usó la logística coordinada de AgroPulse para reducir de nueve a tres horas el tiempo entre campo e hidrocooling, y la vida útil ganada le abrió el mercado aéreo premium de Europa.",
    quote:
      "Seis horas ganadas al sol de Ica son días de vida en la góndola europea. Esa es toda la diferencia del negocio.",
    quoteAuthor: "Carmen Yupanqui",
    quoteRole: "Jefa de operaciones de campo",
    metrics: [
      { label: "Reducción de mermas", value: "-25%" },
      { label: "Tiempo campo-frío", value: "-66%" },
      { label: "Ingreso adicional anual", value: "+28%" },
    ],
    year: 2026,
  }),
  c({
    id: "caso-pe-03",
    slug: "cafe-chanchamayo",
    country: "PE",
    productorName: "Finca Alto Palomar",
    cooperativa: "Cafetaleros de Chanchamayo",
    region: "Chanchamayo, Junín",
    producto: "Café Chanchamayo",
    categoria: "Café",
    titulo: "Café de selva central que pasó de carga a microlotes puntuados",
    resumen:
      "Alto Palomar mezclaba toda su cosecha y la vendía como café corriente. Con el control de fermentación y secado de AgroPulse separó microlotes por parcela, obtuvo puntuaciones sobre 84 en catación y multiplicó el precio de su mejor café.",
    quote:
      "Descubrimos que teníamos café de 85 puntos escondido dentro de la carga. Los datos nos lo mostraron.",
    quoteAuthor: "Elmer Ríos",
    quoteRole: "Caficultor",
    metrics: [
      { label: "Reducción de mermas", value: "-23%" },
      { label: "Precio del microlote", value: "+52%" },
      { label: "Retorno de inversión", value: "1 cosecha" },
    ],
    year: 2025,
  }),

  // ——————————————— Ecuador ———————————————
  c({
    id: "caso-ec-01",
    slug: "cacao-arriba-los-rios",
    country: "EC",
    productorName: "Hacienda La Esperanza",
    cooperativa: "Cacao Arriba de Vinces",
    region: "Vinces, Los Ríos",
    producto: "Cacao Nacional Arriba",
    categoria: "Cacao",
    titulo: "Cacao Arriba con perfil aromático protegido desde la mazorca",
    resumen:
      "El fino aroma del cacao Nacional se perdía por secado apurado y mezclas con CCN-51. La Esperanza separó lotes con la trazabilidad de AgroPulse, controló fermentación y secado con sensores, y hoy sus sacos llevan certificado de pureza que los chocolateros premian.",
    quote:
      "El aroma floral del Arriba es nuestra herencia. La tecnología nos ayudó a que llegue intacto hasta el chocolate.",
    quoteAuthor: "Vicente Zambrano",
    quoteRole: "Productor cacaotero",
    metrics: [
      { label: "Reducción de mermas", value: "-31%" },
      { label: "Prima por pureza Arriba", value: "+42%" },
      { label: "Retorno de inversión", value: "5 meses" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-ec-02",
    slug: "banano-el-oro",
    country: "EC",
    productorName: "Bananera San Isidro",
    cooperativa: "Asociación Bananera de El Oro",
    region: "Machala, El Oro",
    producto: "Banano Cavendish",
    categoria: "Frutas",
    titulo: "Banano de Machala con cero cajas rechazadas en tres meses",
    resumen:
      "San Isidro acumulaba rechazos por corona podrida y fruta sobre-grado. Con el control de calidad digital en empacadora y las alertas de cadena de frío de AgroPulse, encadenó tres meses sin una sola caja rechazada y renovó contrato con su naviera con mejor tarifa.",
    quote:
      "Cero rechazos era una meta que sonaba imposible en el banano. Los datos semana a semana nos llevaron ahí.",
    quoteAuthor: "Diana Espinoza",
    quoteRole: "Jefa de calidad",
    metrics: [
      { label: "Reducción de mermas", value: "-34%" },
      { label: "Cajas rechazadas", value: "0 en 3 meses" },
      { label: "Ingreso adicional anual", value: "+20%" },
    ],
    year: 2026,
  }),
  c({
    id: "caso-ec-03",
    slug: "maracuya-manabi",
    country: "EC",
    productorName: "Finca Costa Verde",
    cooperativa: "Maracuyá de Manabí",
    region: "Portoviejo, Manabí",
    producto: "Maracuyá Amarillo",
    categoria: "Frutas",
    titulo: "Maracuyá que llega a la procesadora el mismo día del corte",
    resumen:
      "La fruta esperaba hasta tres días al borde de la carretera y fermentaba antes de llegar a la procesadora. Con la coordinación logística del marketplace de AgroPulse, Costa Verde agrupa la carga con fincas vecinas y entrega el maracuyá el mismo día, cobrando por grados Brix reales.",
    quote:
      "Ya no vendemos fruta fermentada a precio de lástima. El camión llega cuando la fruta está lista, ni antes ni después.",
    quoteAuthor: "Jacinto Cedeño",
    quoteRole: "Productor y coordinador de acopio",
    metrics: [
      { label: "Reducción de mermas", value: "-40%" },
      { label: "Tiempo finca-planta", value: "-70%" },
      { label: "Ingreso adicional anual", value: "+25%" },
    ],
    year: 2025,
  }),

  // ——————————————— Uruguay ———————————————
  c({
    id: "caso-uy-01",
    slug: "arandanos-salto",
    country: "UY",
    productorName: "Berries del Litoral",
    cooperativa: "Arándanos de Salto Grande",
    region: "Salto",
    producto: "Arándano Premium",
    categoria: "Frutas",
    titulo: "Arándanos uruguayos con ventana aérea optimizada a Estados Unidos",
    resumen:
      "Berries del Litoral competía en la misma semana pico que Perú y Chile, saturando el mercado. Con el pronóstico de demanda de AgroPulse adelantó variedades tempranas y reservó carga aérea con anticipación, vendiendo en la ventana de mejor precio del hemisferio.",
    quote:
      "Salir diez días antes que la ola peruana cambió el número final de la temporada por completo.",
    quoteAuthor: "Federico Techera",
    quoteRole: "Director comercial",
    metrics: [
      { label: "Reducción de mermas", value: "-20%" },
      { label: "Precio promedio por kilo", value: "+33%" },
      { label: "Retorno de inversión", value: "1 temporada" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-uy-02",
    slug: "miel-canelones",
    country: "UY",
    productorName: "Apiario Cerro Pelado",
    cooperativa: "Sociedad Apícola del Sur",
    region: "Canelones",
    producto: "Miel de Pradera",
    categoria: "Especias",
    titulo: "Miel uruguaya trazable que superó la auditoría europea a la primera",
    resumen:
      "La exportación de miel a Europa exige trazabilidad estricta de residuos y origen floral. Cerro Pelado documentó cada tambor con AgroPulse desde el colmenar hasta el contenedor y pasó la auditoría europea sin observaciones, asegurando un contrato de tres años.",
    quote:
      "El auditor pidió la historia de un tambor al azar y la tuvimos en pantalla en veinte segundos. Ahí se cerró el contrato.",
    quoteAuthor: "Estela Viera",
    quoteRole: "Apicultora y responsable de calidad",
    metrics: [
      { label: "Reducción de mermas", value: "-18%" },
      { label: "Contrato de exportación", value: "3 años" },
      { label: "Ingreso adicional anual", value: "+23%" },
    ],
    year: 2026,
  }),
  c({
    id: "caso-uy-03",
    slug: "lacteos-san-jose",
    country: "UY",
    productorName: "Tambo La Serena",
    cooperativa: "Lácteos Artesanales del Sur",
    region: "San José",
    producto: "Lácteos Artesanales",
    categoria: "Lácteos",
    titulo: "Quesería artesanal con frío monitoreado y cero partidas perdidas",
    resumen:
      "Un corte eléctrico nocturno podía arruinar la maduración de meses de queso artesanal. La Serena instaló sensores de temperatura de AgroPulse en cámaras y salas de maduración y en un año no perdió una sola partida, ampliando la producción a dos nuevas líneas.",
    quote:
      "Dormimos tranquilos: si la cámara sube medio grado a las tres de la mañana, el teléfono nos despierta.",
    quoteAuthor: "Gustavo Perdomo",
    quoteRole: "Maestro quesero",
    metrics: [
      { label: "Reducción de mermas", value: "-37%" },
      { label: "Partidas perdidas", value: "0 en 12 meses" },
      { label: "Retorno de inversión", value: "4 meses" },
    ],
    year: 2025,
  }),

  // ——————————————— Guatemala ———————————————
  c({
    id: "caso-gt-01",
    slug: "cafe-antigua-sacatepequez",
    country: "GT",
    productorName: "Finca San Rafael Urías",
    cooperativa: "Café de Antigua, Sacatepéquez",
    region: "Antigua Guatemala, Sacatepéquez",
    producto: "Café Antigua",
    categoria: "Café",
    titulo: "Café de Antigua con subasta directa que rompió su récord de precio",
    resumen:
      "San Rafael Urías vendía su café de sombra volcánica a través de tres intermediarios. Publicando microlotes con trazabilidad completa en el marketplace de AgroPulse, recibió ofertas directas de tostadores de Asia y Norteamérica y rompió su récord histórico de precio.",
    quote:
      "El lote que antes se diluía en un contenedor anónimo hoy tiene nombre, altura y puntaje. Y se paga como se debe.",
    quoteAuthor: "José Miguel Del Valle",
    quoteRole: "Administrador de la finca",
    metrics: [
      { label: "Reducción de mermas", value: "-24%" },
      { label: "Récord de precio por quintal", value: "+48%" },
      { label: "Retorno de inversión", value: "1 cosecha" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-gt-02",
    slug: "cardamomo-alta-verapaz",
    country: "GT",
    productorName: "Asociación Q'eqchi' de Cardamomo",
    cooperativa: "Cardamomeros de Cobán",
    region: "Cobán, Alta Verapaz",
    producto: "Cardamomo Verde",
    categoria: "Especias",
    titulo: "Cardamomo de Alta Verapaz con secado que conserva el color verde",
    resumen:
      "El secado con leña a temperatura irregular manchaba el grano y bajaba el grado de exportación. Con sensores en las secadoras y curvas de secado guiadas por AgroPulse, la asociación conserva el codiciado verde intenso y vende grado premium a Medio Oriente.",
    quote:
      "El verde del cardamomo es el precio del cardamomo. Ahora cada quintal sale del color que el mercado paga mejor.",
    quoteAuthor: "Domingo Caal",
    quoteRole: "Presidente de la asociación",
    metrics: [
      { label: "Reducción de mermas", value: "-42%" },
      { label: "Grano grado premium", value: "+39%" },
      { label: "Ingreso adicional anual", value: "+30%" },
    ],
    year: 2026,
  }),
  c({
    id: "caso-gt-03",
    slug: "cacao-criollo-suchitepequez",
    country: "GT",
    productorName: "Finca Los Tarrales",
    cooperativa: "Cacao Criollo del Pacífico",
    region: "Suchitepéquez, Boca Costa",
    producto: "Cacao Criollo",
    categoria: "Cacao",
    titulo: "Cacao criollo ancestral que ahora exporta a chocolaterías de origen",
    resumen:
      "Los Tarrales cultivaba cacao criollo ancestral pero lo vendía mezclado al precio del cacao común. Con fermentación controlada y lotes trazados por AgroPulse, certificó la genética criolla de sus árboles y exporta directamente a chocolaterías de origen en Japón y Francia.",
    quote:
      "Nuestros abuelos sembraron estos árboles. La plataforma nos ayudó a demostrar al mundo lo que valen.",
    quoteAuthor: "Silvia Ixchel Monterroso",
    quoteRole: "Gerente de la finca",
    metrics: [
      { label: "Reducción de mermas", value: "-28%" },
      { label: "Precio por kilo criollo", value: "+55%" },
      { label: "Retorno de inversión", value: "6 meses" },
    ],
    year: 2025,
  }),

  // ——————————————— Brasil ———————————————
  c({
    id: "caso-br-01",
    slug: "cafe-bourbon-sul-de-minas",
    country: "BR",
    productorName: "Fazenda Boa Vista",
    cooperativa: "Cooperativa dos Cafeicultores do Sul de Minas",
    region: "Sul de Minas, Minas Gerais",
    producto: "Café Bourbon",
    categoria: "Café",
    titulo: "Bourbon amarillo del Sul de Minas con secado de precisión en terreiro",
    resumen:
      "Las lluvias fuera de época sorprendían al café en el terreiro y degradaban lotes enteros. Boa Vista cruzó las alertas meteorológicas de AgroPulse con sensores de humedad del grano y hoy decide por datos cuándo cubrir, mover o recoger, protegiendo su Bourbon amarillo premium.",
    quote:
      "El terreiro ya no depende del ojo y la suerte. La alerta llega dos horas antes que la lluvia, siempre.",
    quoteAuthor: "Antonio Carlos Ferreira",
    quoteRole: "Productor, cuarta generación",
    metrics: [
      { label: "Reducción de mermas", value: "-30%" },
      { label: "Lotes calidad especial", value: "+37%" },
      { label: "Retorno de inversión", value: "5 meses" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-br-02",
    slug: "acai-para",
    country: "BR",
    productorName: "Cooperativa Ribeirinha do Marajó",
    cooperativa: "Açaí Nativo do Pará",
    region: "Isla de Marajó, Pará",
    producto: "Açaí Orgánico",
    categoria: "Frutas",
    titulo: "Açaí del Marajó: de la palmera a la pulpadora en menos de 24 horas",
    resumen:
      "El açaí fermenta en horas y las comunidades ribereñas perdían casi la mitad de la cosecha en el trayecto fluvial. Coordinando barcos de acopio con las rutas optimizadas de AgroPulse, la cooperativa lleva el fruto a la pulpadora en menos de un día y congela con calidad exportable.",
    quote:
      "El río es nuestro camino y ahora también tiene horario. El açaí llega vivo a la pulpadora, como debe ser.",
    quoteAuthor: "Raimunda Nascimento",
    quoteRole: "Coordinadora de la cooperativa",
    metrics: [
      { label: "Reducción de mermas", value: "-45%" },
      { label: "Fruto procesado en 24 h", value: "92%" },
      { label: "Ingreso adicional anual", value: "+40%" },
    ],
    year: 2025,
  }),
  c({
    id: "caso-br-03",
    slug: "mango-vale-sao-francisco",
    country: "BR",
    productorName: "Fazenda Rio Doce",
    cooperativa: "Fruticultores do Vale do São Francisco",
    region: "Vale do São Francisco, Bahia",
    producto: "Mango Tommy",
    categoria: "Frutas",
    titulo: "Mango del semiárido con dos cosechas anuales vendidas por anticipado",
    resumen:
      "Rio Doce produce mango todo el año con riego del São Francisco, pero vendía cada cosecha a último momento. Con el pronóstico de demanda y las preventas del marketplace de AgroPulse, ahora coloca el 85% de la fruta antes del corte y programa el empaque sin picos ni descartes.",
    quote:
      "Vender la fruta antes de cortarla nos cambió el flujo de caja y la tranquilidad. Nunca más cosechamos a ciegas.",
    quoteAuthor: "Joana Batista",
    quoteRole: "Directora comercial",
    metrics: [
      { label: "Reducción de mermas", value: "-26%" },
      { label: "Fruta prevendida", value: "85%" },
      { label: "Retorno de inversión", value: "4 meses" },
    ],
    year: 2026,
  }),
];

/** Total de países representados en los casos. */
export function countCaseCountries(): number {
  return new Set(SUCCESS_CASES.map((sc) => sc.country)).size;
}

/**
 * Promedio de reducción de mermas calculado a partir de la métrica
 * "Reducción de mermas" de cada caso (valores tipo "-32%").
 * Devuelve un entero positivo (ej. 30 → mostrar como "-30%").
 */
export function averageMermaReduction(): number {
  const values = SUCCESS_CASES.flatMap((sc) =>
    sc.metrics
      .filter((m) => m.label.toLowerCase().includes("mermas"))
      .map((m) => Math.abs(parseInt(m.value.replace(/[^\d-]/g, ""), 10)))
      .filter((n) => Number.isFinite(n)),
  );
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/** Casos filtrados por país. */
export function casesByCountry(code: CountryCode): SuccessCase[] {
  return SUCCESS_CASES.filter((sc) => sc.country === code);
}
