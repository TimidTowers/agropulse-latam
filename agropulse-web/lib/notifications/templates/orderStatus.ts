/**
 * Plantilla — Cambio de estado de pedido.
 * Incluye timeline visual con el estado actual destacado.
 */
import type { OrderExtended, OrderStatus } from "@/lib/db/types";
import { ORDER_STATUS_FLOW } from "@/lib/db/types";
import { ctaButton, emailLayout, esc, noteCard, TOKENS } from "./_layout";

const STATUS_LABEL: Record<OrderStatus, string> = {
  recibido: "Recibido",
  confirmado_productor: "Confirmado",
  preparando: "Preparando",
  empacado: "Empacado",
  en_transito: "En tránsito",
  ultima_milla: "Última milla",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const STATUS_COPY: Record<OrderStatus, string> = {
  recibido: "Hemos recibido tu pedido. Los productores ya están notificados.",
  confirmado_productor:
    "El productor confirmó tu pedido y comienza a prepararlo.",
  preparando: "Tu pedido se está empacando con cuidado.",
  empacado: "Listo para ser recogido por logística.",
  en_transito: "Tu pedido está en camino.",
  ultima_milla: "¡Casi! Está en el último tramo hacia tu dirección.",
  entregado: "¡Pedido entregado! Esperamos que disfrutes los productos.",
  cancelado: "Tu pedido fue cancelado.",
};

const STATUS_EMOJI: Record<OrderStatus, string> = {
  recibido: "📨",
  confirmado_productor: "✅",
  preparando: "📦",
  empacado: "🎁",
  en_transito: "🚚",
  ultima_milla: "📍",
  entregado: "🎉",
  cancelado: "❌",
};

export interface OrderStatusEmailOpts {
  order: OrderExtended;
  newStatus: OrderStatus;
  note?: string;
}

function renderTimeline(currentStatus: OrderStatus): string {
  const currentIdx = ORDER_STATUS_FLOW.indexOf(currentStatus);

  // Si está cancelado, mostramos solo "Cancelado"
  if (currentStatus === "cancelado") {
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #FEF2F2; border-radius: 12px; margin: 16px 0;">
        <tr>
          <td style="padding: 16px 18px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; color: #991B1B; font-weight: 600;">
            ❌ Pedido cancelado
          </td>
        </tr>
      </table>
    `;
  }

  const cells = ORDER_STATUS_FLOW.map((status, idx) => {
    const done = idx <= currentIdx;
    const isCurrent = idx === currentIdx;
    const bg = isCurrent
      ? TOKENS.brand
      : done
      ? "#86EFAC"
      : TOKENS.border;
    const color = isCurrent ? "#FFFFFF" : done ? "#14532D" : TOKENS.muted;
    const label = STATUS_LABEL[status];

    return `
      <td valign="top" align="center" style="padding: 0 2px;">
        <div style="background: ${bg}; color: ${color}; border-radius: 999px; padding: 5px 8px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; ${isCurrent ? "box-shadow: 0 2px 6px rgba(21, 128, 61, 0.35);" : ""}">
          ${idx + 1}
        </div>
        <p style="margin: 6px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; color: ${isCurrent ? TOKENS.brand : TOKENS.muted}; font-weight: ${isCurrent ? "700" : "500"}; line-height: 1.3;">
          ${esc(label)}
        </p>
      </td>
    `;
  }).join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0; background: #F8FAFC; border-radius: 12px; padding: 0;">
      <tr>
        <td style="padding: 18px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>${cells}</tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export function orderStatusEmail(opts: OrderStatusEmailOpts): {
  subject: string;
  html: string;
  text: string;
} {
  const { order, newStatus, note } = opts;
  const statusLabel = STATUS_LABEL[newStatus];
  const emoji = STATUS_EMOJI[newStatus];
  let copy = STATUS_COPY[newStatus];

  // Customizaciones contextuales
  if (newStatus === "en_transito" && order.logisticaUserId) {
    copy = `${copy} Tu pedido va con nuestro equipo de logística asignado.`;
  }

  const orderUrl = `https://agropulse-web.vercel.app/pedidos/${order.id}`;

  const bodyHtml = `
    <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${TOKENS.brand};">
      Pedido ${esc(order.shortCode)}
    </p>
    <h1 class="ap-h1" style="margin: 4px 0 8px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.25; color: ${TOKENS.ink};">
      ${esc(emoji)} ${esc(`Tu pedido ahora está ${statusLabel.toLowerCase()}`)}
    </h1>
    <p style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; color: ${TOKENS.muted}; line-height: 1.6;">
      ${esc(copy)}
    </p>

    ${renderTimeline(newStatus)}

    ${note ? noteCard(note) : ""}

    ${ctaButton({ href: orderUrl, label: "Ver detalles del pedido" })}

    <p style="margin: 16px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; color: ${TOKENS.muted}; line-height: 1.6;">
      ¿Necesitas ayuda? Responde a este correo o escríbenos a
      <a href="mailto:sebastorresagropulse@gmail.com" style="color: ${TOKENS.brand};">sebastorresagropulse@gmail.com</a>.
    </p>
  `;

  const subject = `Tu pedido ${order.shortCode} ahora está ${statusLabel.toLowerCase()}`;
  const text = `${emoji} ${subject}

${copy}
${note ? `\nNota: ${note}\n` : ""}
Ver detalles: ${orderUrl}`;

  return {
    subject,
    html: emailLayout({
      title: subject,
      preheader: `Estado actualizado: ${statusLabel} — ${order.shortCode}`,
      bodyHtml,
    }),
    text,
  };
}
