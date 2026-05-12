# Proyecto Final · Comercio y Negocios Digitales

## AgroPulse — Plataforma E-business para reducir pérdidas post-cosecha

> *"El pulso inteligente de tu cosecha."*

**Sitio en producción:** **https://agropulse-web.vercel.app**

Proyecto final de la materia **Comercio y Negocios Digitales** (SATM).
Empresa ficticia **AgroPulse Technologies S.A. de C.V.** — plataforma AgriTech B2B que combina **IoT + Machine Learning + Marketplace digital** para reducir hasta **40 % las pérdidas post-cosecha** en pequeños y medianos productores agrícolas en LATAM.

---

## Contenido del entregable

| Carpeta / archivo | Descripción |
|---|---|
| `agropulse-web/` | Sitio web E-business en **Next.js 16 + TypeScript + Tailwind 4** (sitio + API simulada). |
| `docs/BRAND-AND-CONTENT.md` | Fuente de verdad del proyecto: identidad, problemática, objetivos, modelo de negocio, paleta. |
| `docs/AgroPulse-Documentacion.docx` | Documento académico formal (~30 páginas, capítulos completos). |
| `docs/AgroPulse-Presentacion.pptx` | Presentación ejecutiva (~17 diapositivas). |
| `README.md` | Este archivo. |

---

## Cómo ejecutar el sitio en VS Code

### Requisitos
- Node.js **18+** (probado en Node 24).
- npm **9+** (probado en npm 11).
- Visual Studio Code con la extensión recomendada **ES7+ React/Redux/React-Native snippets** (opcional).

### Pasos

```bash
# 1. Abre la carpeta del proyecto en VS Code
code .

# 2. Entra a la carpeta del sitio web
cd agropulse-web

# 3. Instala dependencias (solo la primera vez)
npm install

# 4. Levanta el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts disponibles dentro de `agropulse-web/`

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload (Turbopack). |
| `npm run build` | Build de producción. |
| `npm start` | Sirve el build de producción. |
| `npm run lint` | Ejecuta ESLint. |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 (tokens en `app/globals.css`) |
| UI | Componentes custom + Lucide React |
| Gráficas | Recharts |
| Mapas | Leaflet + react-leaflet |
| Backend simulado | Next.js Route Handlers (`app/api/*`) |
| Datos | Mock data en `lib/mock-data/` |
| Deploy | Vercel |

---

## Estructura del sitio

```
agropulse-web/
├── app/
│   ├── (público) /              landing, /nosotros, /planes, /contacto
│   ├── marketplace/             catálogo B2B + detalle de lote
│   ├── trazabilidad/[loteId]/   vista QR pública del lote
│   ├── dashboard/               panel productor (KPIs, sensores, inventario)
│   ├── login/                   acceso simulado por roles
│   └── api/                     route handlers (products, sensors, forecast, orders, contact)
├── components/                  UI, layout, marketing, marketplace, dashboard, trazabilidad
├── lib/
│   ├── mock-data/               productos, sensores, pronóstico, equipo, KPIs
│   ├── types.ts                 tipos compartidos
│   └── utils.ts                 helper cn()
└── public/                      assets estáticos
```

---

## Deploy en Vercel

El sitio ya está desplegado en producción:

- **URL pública:** https://agropulse-web.vercel.app
- **Inspector de despliegues:** https://vercel.com/dontorrinis-projects/agropulse-web
- **Proyecto Vercel:** `dontorrinis-projects/agropulse-web`

### Re-desplegar

```bash
cd agropulse-web
vercel deploy --prod
```

### Despliegues automáticos (recomendado)

1. Sube el repo a GitHub.
2. Conecta el repo en [vercel.com/new](https://vercel.com/new).
3. Cada `git push` a `main` redeploya automáticamente.

---

## Autor

**Sebastián Torres** — Mayo 2026
Materia: Comercio y Negocios Digitales · SATM
