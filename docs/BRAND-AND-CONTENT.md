# AgroPulse — Brand & Content Reference (Source of Truth)

> Fuente de verdad para el sitio web, el documento Word y la presentación PowerPoint. Todos los entregables deben mantener consistencia con este documento. Última actualización: Julio 2026 (versión con plataforma completa: auth, Supabase, pagos test, chat, i18n, stock en vivo).

---

## 1. Identidad de la empresa

- **Nombre:** AgroPulse
- **Razón social ficticia:** AgroPulse Technologies S.A.
- **País / Sede:** San José, Costa Rica 🇨🇷 (campus corporativo con paneles solares y techos verdes — ver imágenes `docs/campus-aereo.jpg` y `docs/campus-interior.jpg`)
- **Fundación (ficticia):** 2024 en San José, Costa Rica
- **Sector:** AgriTech / Cadena de suministro agroalimentaria / E-business B2B
- **Tagline:** *"El pulso inteligente de tu cosecha."*
- **Tagline secundario:** *"Made in Costa Rica · Pura Vida AgriTech."*
- **Email oficial:** sebastorresagropulse@gmail.com
- **Teléfono / WhatsApp:** +506 8337 8828
- **Sitio en producción:** https://agropulse-web.vercel.app
- **Repositorio:** https://github.com/TimidTowers/agropulse-latam
- **Misión:** Reducir las pérdidas post-cosecha de productores agrícolas mediante una plataforma E-business que integra IoT, analítica predictiva y un marketplace B2B.
- **Visión:** Ser la plataforma líder en LATAM para la gestión inteligente de productos perecederos al 2030, eliminando un millón de toneladas de desperdicio alimentario al año.
- **Valores:** Sostenibilidad · Transparencia · Innovación · Equidad · Trazabilidad.

## 2. Fundador

**Sebastián Torres** — Fundador, CEO y arquitecto técnico. Estudiante de Ingeniería en Sistemas Informáticos de la **Universidad Latina de Costa Rica (ULatina)**. La sección "Nosotros" del sitio muestra únicamente su perfil.

**Certificaciones (ficticias para el proyecto):**

| Certificación | Institución | Fecha | Área |
|---|---|---|---|
| CompTIA Security+ (SY0-701) | CompTIA | Marzo 2024 | Ciberseguridad |
| Google Data Analytics Professional Certificate | Google · Coursera | Julio 2024 | Análisis de datos |
| ISO/IEC 27001:2022 Foundation | TÜV Rheinland Costa Rica | Octubre 2024 | Auditoría de sistemas |
| Cisco Certified Network Associate (CCNA) | Cisco Networking Academy | Enero 2025 | Redes |
| AWS Certified Cloud Practitioner (CLF-C02) | Amazon Web Services | Abril 2025 | Cloud |
| Certified Ethical Hacker (CEH v13) | EC-Council | Agosto 2025 | Hacking ético |

## 3. Modelo de negocio (E-business)

- **B2B Marketplace:** Productores ↔ Compradores (supermercados, restaurantes, distribuidores, agroindustrias). Los productores también pueden comprar entre sí con 8% de descuento automático.
- **SaaS — Suscripción IoT:** Planes en USD con conversión dinámica a 10 monedas: Básico USD 79/mes, Pro USD 199/mes (destacado), Enterprise a cotizar. Facturación mensual o anual con 15-17% de descuento anual.
- **Comisión por transacción:** 4% sobre cada venta (calculada sobre el subtotal después de descuentos).
- **Servicios logísticos integrados:** cadena de frío, tracking en mapa en tiempo real, rol de logística dedicado.
- **Cupones promocionales:** generales (PURAVIDA10 10%, BIENVENIDA 12%, TICO25 25% solo CR), de envío (ENVIOGRATIS), por categoría (FRUTAS15, CAFE20, HORTALIZAS10) y por rol (PRODUCTOR5).
- **Servicios premium:** Reportes ESG, certificaciones digitales, consultoría.

## 4. Problemática

### 4.1 Contexto
La FAO estima que entre **30 % y 40 %** de la producción agrícola en países en desarrollo se pierde entre la cosecha y el consumidor final. En Costa Rica y Centroamérica, la cifra supera el **35 %** de la producción perecedera, afectando cadenas de café, piña, banano y hortalizas del Valle Central. En Latinoamérica esto equivale a más de **127 millones de toneladas anuales** y un costo estimado de **USD 38 mil millones**.

### 4.2 Problemas tecnológicos identificados
1. **Falta de visibilidad en tiempo real** del inventario perecedero (temperatura, humedad, vida útil).
2. **Cadena de frío sin monitoreo** continuo: rupturas no detectadas que aceleran el deterioro.
3. **Ausencia de pronóstico de demanda** basado en datos.
4. **Desconexión digital** entre productor y comprador: dependencia de intermediarios.
5. **Procesos manuales** de inventario, inspección y comercialización.
6. **Falta de trazabilidad** verificable hacia el consumidor final.

### 4.3 Causas raíz
- Baja adopción de IoT en el campo (costo, capacitación).
- ERP/CRM caros e inaccesibles para pequeños/medianos productores.
- Plataformas existentes diseñadas para retail, no para perecederos.
- Datos dispersos en hojas de cálculo, WhatsApp y libretas.

## 5. Objetivos

### 5.1 Objetivo general
Diseñar e implementar una plataforma E-business llamada **AgroPulse** que integre IoT, analítica predictiva y un marketplace B2B para **reducir las pérdidas post-cosecha en al menos 30 %** durante el primer año de operación.

### 5.2 Objetivos específicos
1. Monitoreo IoT en tiempo real (temperatura, humedad, vida útil) con streaming SSE.
2. Predicción de demanda por región/temporada/producto con Machine Learning.
3. Marketplace B2B multi-país con stock en vivo, reservas temporales y matching oferta-demanda.
4. Trazabilidad por lote con QR público y tracking de pedidos en mapa en tiempo real.
5. Dashboard analítico por productor con KPIs en su moneda local y reportes exportables.
6. Sistema seguro de cuentas con roles, 2FA y auditoría completa de transacciones.

## 6. Propuesta de valor

| Para Productores | Para Compradores |
|---|---|
| Reducción 30% de pérdidas | Productos frescos verificados |
| +25% margen al eliminar intermediarios | Trazabilidad QR completa |
| Publicación de lotes desde su dashboard | Stock en vivo con reserva de 2 horas |
| 8% de descuento como compradores | Cadena de frío monitoreada |
| Dashboard en su moneda local + export | Tracking del pedido en mapa en vivo |
| Chat directo con compradores | Cupones y pagos locales por país |

## 7. Mercado objetivo

- **Mercado origen y prioritario:** Costa Rica (Valle Central, Guanacaste, Limón, Puntarenas). Sede en San José.
- **Expansión LATAM (10 países):** México, Colombia, Argentina, Chile, Perú, Ecuador, Uruguay, Guatemala, Brasil.
- **Productores objetivo:** ~64,000 unidades productivas en LATAM; énfasis inicial en ~3,200 productores costarricenses.
- **TAM:** USD 8,500M en LATAM. **SOM inicial:** USD 85M (Valle Central CR + corredor cafetero centroamericano).

## 8. Stack tecnológico (implementado en el sitio)

### Frontend
- **Next.js 16** (App Router) + **TypeScript** — 220+ rutas generadas
- **Tailwind CSS 4** + **framer-motion** (animaciones) + **Lucide-react** (iconos)
- **Recharts** (gráficas) · **Leaflet/react-leaflet** (mapas)
- **Zustand** (estado cliente: carrito, país, preferencias)
- **Internacionalización ES/EN/PT** con selector de idioma

### Backend
- **Next.js Route Handlers** — 35+ endpoints REST
- **Supabase (PostgreSQL)** — persistencia real: usuarios, pedidos, lotes, reservas, cupones, chat, auditoría
- **Server-Sent Events (SSE)** — IoT en vivo, stock en vivo, tracking de pedidos (arquitectura compatible con serverless de Vercel)
- **NextAuth v5** — credenciales + JWT, 4 roles (admin, productor, cliente, logística), 2FA TOTP, rate limiting (5 intentos/lockout 15 min)
- **Stripe (modo test)** — checkout con tarjeta de prueba (activable por variable de entorno; convive con métodos de pago locales simulados por país)
- **Resend** — emails transaccionales HTML reales (bienvenida, confirmación, cambios de estado)

### Calidad y operación
- **Playwright** — tests E2E de los flujos críticos
- **GitHub Actions** — CI: lint + build + tests en cada push
- **Auditoría** — log de todas las acciones sensibles visible en panel admin

### Representadas en la narrativa (no implementadas)
- Sensores IoT LoRaWAN físicos · Modelos ML XGBoost/Prophet en producción · Blockchain de trazabilidad

### Deploy
- **Vercel** (producción: https://agropulse-web.vercel.app) · **GitHub** (CI/CD)

## 9. Identidad visual

### 9.1 Paleta

| Token | HEX | Uso |
|---|---|---|
| `--brand-primary` | `#15803D` | Verde Cosecha — principal |
| `--brand-primary-dark` | `#14532D` | Hover, footer |
| `--brand-accent` | `#84CC16` | Verde Lima — highlights |
| `--brand-warm` | `#F59E0B` | Ámbar — alertas suaves |
| `--brand-danger` | `#DC2626` | Rojo — alertas críticas |
| `--brand-info` | `#0EA5E9` | Azul — datos IoT |
| `--brand-ink` | `#0F172A` | Texto principal |
| `--brand-bg` | `#FAFAF9` | Fondo |

### 9.2 Tipografía
Geist Sans (headings 600-700 tracking-tight; body 400-500) · Geist Mono para códigos.

### 9.3 Imágenes del campus (IA, para docs/pptx/sitio)
- `docs/campus-aereo.jpg` — vista aérea nocturna del campus AgroPulse en San José: 3 edificios con paneles solares, bandera de Costa Rica, letrero "AgroPulse — El pulso inteligente de tu cosecha", montañas del Valle Central al fondo.
- `docs/campus-interior.jpg` — lobby interior: muro verde vivo con logo, pantalla "Trazabilidad en tiempo real" con mapa de Costa Rica, open office con equipo trabajando en dashboards.
- En el sitio web: `/campus-aereo.webp` y `/campus-interior.webp` (public/).

## 10. Estructura del sitio (rutas principales)

| Ruta | Descripción |
|---|---|
| `/` | Landing con IoT en vivo (SSE), stats, casos, CTA |
| `/nosotros` | Perfil del fundador (ULatina) + certificaciones + sede con fotos del campus |
| `/marketplace` | Catálogo 83 productos + lotes dinámicos, stock EN VIVO, filtros por país/región/categoría |
| `/marketplace/[id]` | Detalle producto o lote dinámico, stock live, agregar al carrito |
| `/carrito` | Cantidades por peso, cupones, descuento productor, reserva 2h |
| `/checkout` | 4 pasos, métodos de pago por país + Stripe test, descuentos |
| `/pedidos` | Tabs Activos/Historial, filtros, búsqueda |
| `/pedidos/[id]` | Tracking en vivo: timeline + mapa con camión animado + chat comprador↔productor |
| `/dashboard` | Panel productor personalizado en su moneda, export Excel/PDF |
| `/dashboard/lotes` | CRUD de lotes del productor |
| `/dashboard/sensores` | IoT en vivo por sensor (SSE) |
| `/planes` | USD base + selector de 10 monedas + toggle mensual/anual (-15/17%) |
| `/paises` | 10 países LATAM con mapa |
| `/casos-de-exito` | 30 casos (3 por país) filtrables |
| `/trazabilidad/[loteId]` | QR público del lote |
| `/admin/*` | Panel admin: usuarios, pedidos, lotes, logs, notificaciones, previews de email |
| `/login` `/signup` `/2fa/*` `/perfil` | Autenticación completa |
| `/legal/*` | Términos, privacidad, cookies, DPO |

## 11. Cuentas demo

| Email | Contraseña | Rol |
|---|---|---|
| admin@agropulse.cr | Admin#2026 | Admin |
| sofia@tarrazu.cr | Productor#2026 | Productor (CR) |
| raul@uruapan.mx | Productor#2026 | Productor (MX) |
| maria@cliente.cr | Cliente#2026 | Cliente (CR) |
| carlos@cliente.co | Cliente#2026 | Cliente (CO) |
| diego@logistica.cr | Logistica#2026 | Logística (CR) |

## 12. Flujo de compra (E-commerce completo)

1. Registro con país de origen (restricción: solo compras de productos del propio país).
2. Marketplace con stock en vivo — al agregar al carrito se **reserva stock por 2 horas** (se reintegra si no se paga).
3. Carrito con cantidades por peso/unidad + cupones + descuento productor 8%.
4. Checkout con métodos de pago del país (SINPE Móvil CR, SPEI/OXXO MX, PIX BR, Yape PE, etc.) o **Stripe en modo test**.
5. Confirmación → emails HTML al cliente y productor → stock descontado definitivamente.
6. Tracking: 7 estados con progresión determinística (nunca retrocede) + mapa en vivo con la posición del envío + chat con el productor.

## 13. Métricas y KPIs proyectados

- Reducción de mermas: 30 % año 1, 45 % año 3 (casos de éxito reales del sitio promedian −30 %).
- Productores onboarded: 500 año 1 (Costa Rica), 5,000 año 3 (LATAM).
- GMV anual proyectado: USD 12M año 1, USD 80M año 3.
- 10 países, 10 monedas locales, 64,000+ productores direccionables.

## 14. Referencias (APA 7)

- FAO (2023). *The State of Food and Agriculture: Food Loss and Waste.*
- MAG Costa Rica (2024). *Diagnóstico de pérdidas post-cosecha en el sector hortifrutícola.*
- McKinsey & Company (2023). *Agriculture 4.0: The future of AgriTech in Latin America.*
- Banco Mundial (2024). *Reducing food loss for sustainable food systems.*
- Deloitte (2024). *IoT in Agriculture: Market Outlook.*
- CEPAL (2024). *Comercio electrónico y transformación digital en América Latina.*
- Vercel (2026). *Serverless streaming architectures.* Documentación técnica.
- Supabase (2026). *PostgreSQL for modern applications.* Documentación técnica.
