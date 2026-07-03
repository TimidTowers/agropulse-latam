"use client";

/**
 * Botones de exportación del dashboard del productor (mejora #8):
 *  - "Exportar Excel (.csv)": un archivo combinado con secciones KPIs / Lotes /
 *    Pedidos, con BOM UTF-8 para que Excel lo abra bien (lib/export/csv.ts).
 *    Montos ya convertidos a la moneda preferida del productor (server-side).
 *  - "Exportar PDF": window.print() sobre una vista imprimible propia — un
 *    @media print inline oculta navbar/sidebar/dashboard y muestra un reporte
 *    con logo textual AgroPulse + fecha + nombre del productor. El usuario
 *    elige "Guardar como PDF" en el diálogo de impresión.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, FileText } from "lucide-react";
import { CSV_BOM, downloadCsv, toCsv, type CsvHeader } from "@/lib/export/csv";

export interface ExportKpiRow {
  indicador: string;
  valor: string;
}

export interface ExportLotRow {
  id: string;
  producto: string;
  region: string;
  estado: string;
  stock: number;
  unidad: string;
  precioUnitario: string;
  valorEstimado: string;
  cosecha: string;
  expira: string;
}

export interface ExportOrderRow {
  folio: string;
  fecha: string;
  comprador: string;
  productos: string;
  total: string;
  estado: string;
  pago: string;
}

interface ExportButtonsProps {
  producerName: string;
  /** cooperativa · país — subtítulo del reporte */
  producerOrg: string;
  /** moneda en la que están expresados los montos (ej. "CRC") */
  currency: string;
  kpis: ExportKpiRow[];
  lots: ExportLotRow[];
  orders: ExportOrderRow[];
}

const KPI_HEADERS: CsvHeader[] = [
  { key: "indicador", label: "Indicador" },
  { key: "valor", label: "Valor" },
];

const LOT_HEADERS: CsvHeader[] = [
  { key: "id", label: "ID lote" },
  { key: "producto", label: "Producto" },
  { key: "region", label: "Región" },
  { key: "estado", label: "Estado" },
  { key: "stock", label: "Stock" },
  { key: "unidad", label: "Unidad" },
  { key: "precioUnitario", label: "Precio unitario" },
  { key: "valorEstimado", label: "Valor estimado" },
  { key: "cosecha", label: "Cosecha" },
  { key: "expira", label: "Expira" },
];

const ORDER_HEADERS: CsvHeader[] = [
  { key: "folio", label: "Folio" },
  { key: "fecha", label: "Fecha" },
  { key: "comprador", label: "Comprador" },
  { key: "productos", label: "Productos" },
  { key: "total", label: "Total" },
  { key: "estado", label: "Estado" },
  { key: "pago", label: "Pago" },
];

export function ExportButtons({
  producerName,
  producerOrg,
  currency,
  kpis,
  lots,
  orders,
}: ExportButtonsProps) {
  // Montado + fecha client-side (el reporte se inyecta con portal a <body>
  // para escapar de ancestros con display:none como el header print:hidden).
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState("");
  useEffect(() => {
    setMounted(true);
    setToday(
      new Date().toLocaleDateString("es", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  function handleExcel() {
    const meta = toCsv(
      [
        { indicador: "Productor", valor: producerName },
        { indicador: "Organización", valor: producerOrg },
        { indicador: "Moneda", valor: currency },
        { indicador: "Generado", valor: new Date().toLocaleString("es") },
      ],
      [
        { key: "indicador", label: "AgroPulse — Reporte del productor" },
        { key: "valor", label: "" },
      ],
      { bom: false },
    );
    const kpiSection = toCsv(kpis, KPI_HEADERS, { bom: false });
    const lotSection = toCsv(lots, LOT_HEADERS, { bom: false });
    const orderSection = toCsv(orders, ORDER_HEADERS, { bom: false });

    // Un solo archivo con secciones (BOM una única vez al inicio).
    const csv =
      CSV_BOM +
      [
        meta,
        `KPIs (${currency})`,
        kpiSection,
        "Lotes",
        lotSection,
        "Pedidos",
        orderSection,
      ].join("\r\n\r\n");

    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`agropulse-reporte-${stamp}.csv`, csv);
  }

  function handlePdf() {
    window.print();
  }

  return (
    <>
      <div className="flex items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={handleExcel}
          className="inline-flex items-center gap-1.5 h-9 rounded-lg border border-border-soft bg-surface px-3 text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
          title="Descarga KPIs, lotes y pedidos en CSV compatible con Excel"
        >
          <Download size={14} className="text-brand" />
          <span className="hidden md:inline">Exportar Excel (.csv)</span>
          <span className="md:hidden">Excel</span>
        </button>
        <button
          type="button"
          onClick={handlePdf}
          className="inline-flex items-center gap-1.5 h-9 rounded-lg border border-border-soft bg-surface px-3 text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
          title="Abre el diálogo de impresión — elige “Guardar como PDF”"
        >
          <FileText size={14} className="text-brand" />
          <span className="hidden md:inline">Exportar PDF</span>
          <span className="md:hidden">PDF</span>
        </button>
      </div>

      {/* Vista imprimible: oculta en pantalla; en print se vuelve la única
          capa visible (truco de visibility para no tocar navbar/sidebar,
          que pertenecen a otros componentes). Se monta con portal a <body>
          para escapar de ancestros con display:none (header print:hidden). */}
      {mounted &&
        createPortal(
          <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #agropulse-print-report, #agropulse-print-report * { visibility: visible !important; }
          #agropulse-print-report {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff;
            color: #111827;
          }
          @page { margin: 14mm; }
        }
      `}</style>
      <div id="agropulse-print-report" className="hidden" aria-hidden>
        {/* Header del reporte: logo textual + fecha + productor */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: "2px solid #16a34a",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          <div>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
              Agro<span style={{ color: "#16a34a" }}>Pulse</span>
            </p>
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>
              Reporte del productor · {producerOrg}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{producerName}</p>
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>
              {today} · Moneda: {currency}
            </p>
          </div>
        </div>

        <PrintSection title={`KPIs (${currency})`}>
          <PrintTable
            headers={KPI_HEADERS}
            rows={kpis as unknown as Array<Record<string, unknown>>}
          />
        </PrintSection>

        <PrintSection title={`Lotes (${lots.length})`}>
          <PrintTable
            headers={LOT_HEADERS}
            rows={lots as unknown as Array<Record<string, unknown>>}
          />
        </PrintSection>

        <PrintSection title={`Pedidos (${orders.length})`}>
          <PrintTable
            headers={ORDER_HEADERS}
            rows={orders as unknown as Array<Record<string, unknown>>}
          />
        </PrintSection>

        <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 18 }}>
          Generado desde el dashboard de AgroPulse — datos demo del proyecto
          académico. agropulse-web.vercel.app
        </p>
      </div>
          </>,
          document.body,
        )}
    </>
  );
}

function PrintSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 18 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          margin: "0 0 6px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function PrintTable({
  headers,
  rows,
}: {
  headers: CsvHeader[];
  rows: Array<Record<string, unknown>>;
}) {
  if (rows.length === 0) {
    return (
      <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Sin registros.</p>
    );
  }
  const cell: React.CSSProperties = {
    border: "1px solid #d1d5db",
    padding: "4px 6px",
    fontSize: 10,
    textAlign: "left",
    verticalAlign: "top",
  };
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h.key} style={{ ...cell, background: "#f3f4f6", fontWeight: 700 }}>
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {headers.map((h) => (
              <td key={h.key} style={cell}>
                {String(row[h.key] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
