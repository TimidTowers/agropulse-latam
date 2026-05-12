# AgroPulse — Brand & Content Reference (Source of Truth)

> Este documento es la fuente de verdad para el sitio web, el documento Word y la presentación PowerPoint. Todos los entregables deben mantener consistencia con el contenido y la identidad visual definidos aquí.

---

## 1. Identidad de la empresa

- **Nombre:** AgroPulse
- **Razón social ficticia:** AgroPulse Technologies S.A. de C.V.
- **País / Sede:** Querétaro, México
- **Fundación (ficticia):** 2024
- **Sector:** AgriTech / Cadena de suministro agroalimentaria
- **Tagline:** *"El pulso inteligente de tu cosecha."*
- **Tagline EN:** *"Smart pulse for your harvest."*
- **Misión:** Reducir las pérdidas post-cosecha de productores agrícolas mediante una plataforma E-business que integra IoT, analítica predictiva y un marketplace B2B.
- **Visión:** Ser la plataforma líder en LATAM para la gestión inteligente de productos perecederos al 2030, eliminando un millón de toneladas de desperdicio alimentario al año.
- **Valores:** Sostenibilidad · Transparencia · Innovación · Equidad · Trazabilidad.

## 2. Modelo de negocio (E-business)

- **B2B Marketplace:** Productores ↔ Compradores (supermercados, restaurantes, distribuidores, agroindustrias).
- **SaaS — Suscripción IoT:** Renta mensual de sensores + plataforma analítica (3 planes: Básico, Pro, Enterprise).
- **Servicios logísticos integrados:** Cadena de frío, ruteo y matching con transportistas aliados.
- **Comisión por transacción:** 4% sobre cada venta cerrada en el marketplace.
- **Servicios premium:** Reportes ESG, certificaciones digitales (orgánico, GAP), consultoría.

## 3. Problemática

### 3.1 Contexto
La FAO estima que entre **30 % y 40 %** de la producción agrícola en países en desarrollo se pierde entre la cosecha y el consumidor final. En México, esa cifra equivale a más de **20 millones de toneladas anuales** de alimentos desperdiciados, con un costo económico estimado en **$491 mil millones de pesos**.

### 3.2 Problemas tecnológicos identificados
1. **Falta de visibilidad en tiempo real** del estado del inventario perecedero (temperatura, humedad, vida útil restante).
2. **Cadena de frío sin monitoreo** continuo: rupturas no detectadas que aceleran el deterioro.
3. **Ausencia de pronóstico de demanda** basado en datos: los productores cosechan "a ciegas".
4. **Desconexión digital** entre productor y comprador: alta dependencia de intermediarios.
5. **Procesos manuales** de registro de inventario, inspección y comercialización.
6. **Falta de trazabilidad** verificable hacia el consumidor final.

### 3.3 Causas raíz
- Baja adopción de IoT en el campo (costo, falta de capacitación).
- Sistemas ERP/CRM caros e inaccesibles para pequeños/medianos productores.
- Plataformas digitales existentes están diseñadas para retail, no para productos perecederos.
- Datos dispersos en hojas de cálculo, WhatsApp y libretas físicas.

## 4. Objetivos

### 4.1 Objetivo general
Diseñar e implementar una plataforma E-business llamada **AgroPulse** que integre IoT, analítica predictiva y un marketplace B2B para **reducir las pérdidas post-cosecha en al menos 30 %** durante el primer año de operación.

### 4.2 Objetivos específicos
1. **Monitoreo IoT en tiempo real** de variables críticas (temperatura, humedad, vida útil) en almacenes, cámaras frigoríficas y transporte.
2. **Predicción de demanda** por región, temporada y tipo de producto con modelos de Machine Learning.
3. **Marketplace B2B** con matching automático oferta-demanda priorizando productos con menor vida útil restante.
4. **Trazabilidad por lote** mediante QR público para el consumidor final.
5. **Dashboard analítico** con KPIs (mermas, ventas, rotación) y alertas tempranas.
6. **Integración logística** con transportistas aliados de cadena de frío.

## 5. Propuesta de valor

| Para Productores | Para Compradores |
|---|---|
| Reducción 30% de pérdidas | Productos frescos verificados |
| +25% margen al eliminar coyotes | Trazabilidad QR completa |
| Predicción de demanda | Cadena de frío garantizada |
| Acceso directo a retail/HORECA | Catálogo en tiempo real |
| Reportes para certificaciones | Pago seguro y facturación |

## 6. Mercado objetivo

- **Productores objetivo:** ~50,000 pequeñas y medianas unidades de producción de hortalizas, frutas y lácteos en el centro-norte de México.
- **Compradores objetivo:** Cadenas regionales de supermercados, restaurantes (HORECA), agroindustrias procesadoras.
- **Tamaño de mercado (TAM):** USD 8,500M en LATAM (mercado de pérdidas post-cosecha gestionable digitalmente).
- **Segmento inicial (SOM):** USD 120M en el Bajío mexicano (Querétaro, Guanajuato, Michoacán, Jalisco).

## 7. Stack tecnológico

### Frontend
- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** (configuración inline `@theme`)
- **Recharts** para gráficas
- **Lucide-react** para iconografía
- **Leaflet / react-leaflet** para mapas

### Backend simulado
- **Next.js Route Handlers** (`app/api/*/route.ts`)
- **Mock data** en archivos JSON dentro de `lib/mock-data/`

### Tecnologías que el producto representa (no implementadas reales, son parte del relato)
- **IoT:** sensores LoRaWAN de temperatura/humedad en almacenes y transporte.
- **Machine Learning:** modelos de pronóstico de demanda con XGBoost/Prophet.
- **Blockchain ligera (opcional):** registro inmutable de eventos de trazabilidad.

### Deploy
- **Vercel** (producción)
- **GitHub** (control de versiones)

## 8. Identidad visual

### 8.1 Paleta de colores

| Token | HEX | Uso |
|---|---|---|
| `--brand-primary` | `#15803D` | Verde Cosecha — color principal, botones, links |
| `--brand-primary-dark` | `#14532D` | Hover, navbar, footer |
| `--brand-accent` | `#84CC16` | Verde Lima — frescura, badges, highlights |
| `--brand-warm` | `#F59E0B` | Ámbar Cosecha — alertas suaves, CTAs secundarios |
| `--brand-danger` | `#DC2626` | Rojo — alertas críticas, mermas |
| `--brand-info` | `#0EA5E9` | Azul — datos, IoT, gráficas |
| `--brand-ink` | `#0F172A` | Texto principal |
| `--brand-muted` | `#64748B` | Texto secundario |
| `--brand-bg` | `#FAFAF9` | Fondo principal |
| `--brand-surface` | `#FFFFFF` | Cards, modales |
| `--brand-border` | `#E2E8F0` | Bordes, divisores |

### 8.2 Tipografía
- **Headings:** Geist Sans, weight 600-700, tracking-tight
- **Body:** Geist Sans, weight 400-500
- **Mono / códigos:** Geist Mono

### 8.3 Personalidad visual
- **Estilo:** Moderno minimalista con acentos orgánicos.
- **Imaginería:** Fotografía real de campo + ilustraciones isométricas para procesos tecnológicos.
- **Iconografía:** Lucide-react (línea, 1.5 stroke).
- **Bordes:** redondeados (rounded-xl, 12px) consistentes.
- **Sombras:** suaves, no exageradas (`shadow-sm`, `shadow-md`).
- **Layout:** containers de 1280px max, espaciado generoso (py-16 a py-24).

## 9. Estructura del sitio web (E-business)

| Ruta | Página | Tipo |
|---|---|---|
| `/` | Landing pública (hero, problema, solución, cómo funciona, planes, CTA) | Pública |
| `/nosotros` | Sobre la empresa, misión, visión, equipo ficticio | Pública |
| `/marketplace` | Catálogo B2B con filtros (producto, región, urgencia, precio) | Pública* |
| `/marketplace/[id]` | Detalle de lote (productor, fechas, certificaciones, comprar) | Pública* |
| `/trazabilidad/[loteId]` | Página pública QR — historia del lote | Pública |
| `/dashboard` | Panel productor (KPIs, sensores IoT, alertas, pronóstico) | Simulada |
| `/dashboard/inventario` | Listado de lotes con sensores | Simulada |
| `/dashboard/sensores` | Vista detallada IoT con gráficas en vivo | Simulada |
| `/planes` | Planes SaaS (Básico, Pro, Enterprise) | Pública |
| `/contacto` | Formulario de contacto | Pública |
| `/login` | Login simulado con roles (productor / comprador) | Pública |

\* La compra real está simulada.

## 10. API simulada (Route Handlers)

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/products` | GET | Lista de lotes disponibles en marketplace |
| `/api/products/[id]` | GET | Detalle de un lote |
| `/api/sensors` | GET | Lecturas recientes de sensores IoT |
| `/api/forecast` | GET | Pronóstico de demanda (mock) |
| `/api/orders` | POST | Crear pedido (simulado) |
| `/api/contact` | POST | Recibir mensaje de contacto |

## 11. Equipo ficticio fundador

- **CEO:** Sebastián Torres (founder, Ing. Industrial, ex-Heineken)
- **CTO:** María Fernanda López (PhD CS, especialista en ML aplicado a agro)
- **COO:** Diego Ramírez (15 años en operaciones agrícolas)
- **CFO:** Ana Sofía Hernández (ex-banca, fintech)
- **Head of Sustainability:** Luis Mendoza (Ing. Agrónomo, certificador GLOBALG.A.P.)

## 12. Planes SaaS

| Plan | Precio mensual | Sensores incluidos | Características |
|---|---|---|---|
| **Básico** | $1,490 MXN | 3 | Dashboard, alertas básicas, soporte email |
| **Pro** | $3,990 MXN | 10 | + Pronóstico demanda, integración logística, reportes |
| **Enterprise** | A cotizar | Ilimitados | API, multi-finca, soporte 24/7, consultoría dedicada |

## 13. Métricas y KPIs proyectados

- **Reducción de mermas:** 30 % en año 1, 45 % en año 3.
- **Productores onboarded:** 500 en año 1, 5,000 en año 3.
- **GMV anual proyectado:** USD 12M en año 1, USD 80M en año 3.
- **Tasa de adopción IoT por productor:** 70 % en año 2.

## 14. Bibliografía / Referencias

- FAO (2023). *State of Food and Agriculture: Food Loss and Waste.*
- SADER México (2024). *Diagnóstico de pérdidas y desperdicios alimentarios.*
- McKinsey (2023). *Agriculture 4.0: The future of AgriTech.*
- Banco Mundial (2024). *Reducing food loss for sustainable food systems.*
- Deloitte (2024). *IoT in Agriculture: Market Outlook.*
