/**
 * Plantilla — Confirmación de pedido (versión cliente o productor).
 */
import type { OrderExtended } from "@/lib/db/types";
import { getCountry } from "@/lib/countries";
import { ctaButton, emailLayout, esc, TOKENS } from "./_layout";

const STATUS_LABEL: Record<string, string> = {
  recibido: "Recibido",
  confirmado_productor: "Confirmado",
  preparando: "Preparando",
  empacado: "Empacado",
  en_transito: "En tránsito",
  ultima_milla: "Última milla",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("es-CR")}`;
  }
}

export interface OrderConfirmationOpts {
  order: OrderExtended;
  recipientRole: "cliente" | "productor";
}

export function orderConfirmationEmail(opts: OrderConfirmationOpts): {
  subject: string;
  html: string;
  text: string;
} {
  const { order, recipientRole } = opts;
  const country = getCountry(order.country);
  const statusLabel = STATUS_LABEL[order.status] ?? order.status;

  const itemsRowsHtml = order.items
    .map(
      (it) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${TOKENS.border}; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink};">
            <p style="margin: 0 0 2px; font-weight: 600;">${esc(it.productName)}</p>
            <p style="margin: 0; font-size: 12px; color: ${TOKENS.muted};">${esc(it.productorName)}</p>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid ${TOKENS.border}; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink}; text-align: right; white-space: nowrap;">
            ${esc(String(it.quantity))} ${esc(it.unit)}
          </td>
          <td style="padding: 12px 0 12px 8px; border-bottom: 1px solid ${TOKENS.border}; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink}; text-align: right; white-space: nowrap; font-weight: 600;">
            ${formatMoney(it.subtotal, order.currency)}
          </td>
        </tr>
      `,
    )
    .join("");

  const orderUrl = `https://agropulse-web.vercel.app/pedidos/${order.id}`;
  const cliCtaUrl =
    recipientRole === "productor"
      ? "https://agropulse-web.vercel.app/dashboard"
      : orderUrl;
  const ctaLabel =
    recipientRole === "productor"
      ? "Ir a mis pedidos"
      : "Ver estado en vivo";

  const heroText =
    recipientRole === "productor"
      ? `Tienes un nuevo pedido por confirmar`
      : `¡Gracias por tu pedido, ${esc(order.customerInfo.name)}!`;
  const heroSubtext =
    recipientRole === "productor"
      ? `Confirma el pedido cuanto antes para iniciar la preparación.`
      : `Te avisaremos por correo en cada cambio de estado.`;

  // Header card con shortCode y status
  const headerCardHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%); border-radius: 12px; margin: 4px 0 20px;">
      <tr>
        <td style="padding: 18px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${TOKENS.brand};">
                  Folio del pedido
                </p>
                <p style="margin: 4px 0 0; font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 22px; font-weight: 700; color: ${TOKENS.ink};">
                  ${esc(order.shortCode)}
                </p>
              </td>
              <td align="right">
                <span style="display: inline-block; background: ${TOKENS.brand}; color: #fff; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 999px;">
                  ${esc(statusLabel)}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  // Totales — retrocompatible con pedidos sin descuentos (campos opcionales)
  const discountLines = order.discountLines ?? [];
  const discountTotal = order.discountTotal ?? 0;
  // total = (subtotal − descuentos) + comisión + envío + fee de pago
  const paymentFee = Math.max(
    0,
    order.total -
      order.subtotal +
      discountTotal -
      order.commissionFee -
      order.shippingFee,
  );

  const discountRowsHtml = discountLines
    .map(
      (l) => `
    <tr>
      <td colspan="2" style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.brand}; font-weight: 600;">${esc(l.label)}</td>
      <td style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.brand}; font-weight: 600; text-align: right; white-space: nowrap;">${l.amount > 0 ? `&minus;${formatMoney(l.amount, order.currency)}` : "Gratis"}</td>
    </tr>
  `,
    )
    .join("");

  const totalsRows = `
    <tr>
      <td colspan="2" style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.muted};">Subtotal</td>
      <td style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink}; text-align: right; white-space: nowrap;">${formatMoney(order.subtotal, order.currency)}</td>
    </tr>
    ${discountRowsHtml}
    <tr>
      <td colspan="2" style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.muted};">Comisión AgroPulse (4%)</td>
      <td style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink}; text-align: right; white-space: nowrap;">${formatMoney(order.commissionFee, order.currency)}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.muted};">Envío</td>
      <td style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink}; text-align: right; white-space: nowrap;">${formatMoney(order.shippingFee, order.currency)}</td>
    </tr>
    ${
      paymentFee > 0
        ? `<tr>
        <td colspan="2" style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.muted};">Comisión método de pago</td>
        <td style="padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink}; text-align: right; white-space: nowrap;">${formatMoney(paymentFee, order.currency)}</td>
      </tr>`
        : ""
    }
    <tr>
      <td colspan="2" style="padding: 14px 0 0; border-top: 2px solid ${TOKENS.ink}; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 15px; font-weight: 700; color: ${TOKENS.ink};">Total</td>
      <td style="padding: 14px 0 0; border-top: 2px solid ${TOKENS.ink}; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 18px; font-weight: 700; color: ${TOKENS.brand}; text-align: right; white-space: nowrap;">${formatMoney(order.total, order.currency)}</td>
    </tr>
  `;

  const addrLine = order.customerInfo.address;
  const addrHtml = `
    ${esc(addrLine.line1)}${addrLine.line2 ? `, ${esc(addrLine.line2)}` : ""}<br />
    ${esc(addrLine.city)}, ${esc(addrLine.state)} ${esc(addrLine.postalCode)}<br />
    ${esc(country.flag)} ${esc(country.name)}
  `;

  const bodyHtml = `
    <h1 class="ap-h1" style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 24px; font-weight: 700; color: ${TOKENS.ink}; line-height: 1.25;">
      ${heroText}
    </h1>
    <p style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; color: ${TOKENS.muted}; line-height: 1.6;">
      ${heroSubtext}
    </p>

    ${headerCardHtml}

    <p style="margin: 18px 0 8px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; font-weight: 600; color: ${TOKENS.muted}; text-transform: uppercase; letter-spacing: 0.06em;">
      Productos (${order.items.length})
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid ${TOKENS.border};">
      ${itemsRowsHtml}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 18px 0 8px;">
      ${totalsRows}
    </table>

    ${ctaButton({ href: cliCtaUrl, label: ctaLabel })}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 0;">
      <tr>
        <td class="ap-stack" valign="top" width="50%" style="padding-right: 12px;">
          <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${TOKENS.muted};">
            Datos del cliente
          </p>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink}; line-height: 1.6;">
            <strong>${esc(order.customerInfo.name)}</strong><br />
            <a href="mailto:${esc(order.customerInfo.email)}" style="color: ${TOKENS.brand};">${esc(order.customerInfo.email)}</a><br />
            ${esc(order.customerInfo.phone)}
          </p>
        </td>
        <td class="ap-stack" valign="top" width="50%" style="padding-left: 12px;">
          <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${TOKENS.muted};">
            Dirección de entrega
          </p>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink}; line-height: 1.6;">
            ${addrHtml}
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 18px 0 0; border-top: 1px solid ${TOKENS.border}; padding-top: 16px;">
      <tr>
        <td>
          <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${TOKENS.muted};">
            Método de pago
          </p>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.ink};">
            ${esc(order.paymentMethodLabel)} ·
            <span style="color: ${order.paymentStatus === "pagado" ? TOKENS.brand : TOKENS.muted};">
              ${esc(order.paymentStatus)}
            </span>
          </p>
        </td>
      </tr>
    </table>
  `;

  const subject =
    recipientRole === "productor"
      ? `Nuevo pedido ${order.shortCode} — AgroPulse`
      : `Pedido confirmado — ${order.shortCode}`;

  const text = `${recipientRole === "productor" ? "Nuevo pedido en AgroPulse" : `Gracias por tu pedido, ${order.customerInfo.name}`}.

Folio: ${order.shortCode}
Estado actual: ${statusLabel}
${order.items.length} producto(s) · Total: ${formatMoney(order.total, order.currency)}

Items:
${order.items
  .map(
    (it) =>
      `  - ${it.productName} (${it.productorName}): ${it.quantity} ${it.unit} = ${formatMoney(it.subtotal, order.currency)}`,
  )
  .join("\n")}

Subtotal: ${formatMoney(order.subtotal, order.currency)}
${discountLines
  .map(
    (l) =>
      `${l.label}: ${l.amount > 0 ? `-${formatMoney(l.amount, order.currency)}` : "Gratis"}`,
  )
  .join("\n")}${discountLines.length > 0 ? "\n" : ""}Comisión AgroPulse: ${formatMoney(order.commissionFee, order.currency)}
Envío: ${formatMoney(order.shippingFee, order.currency)}
TOTAL: ${formatMoney(order.total, order.currency)}

Método de pago: ${order.paymentMethodLabel} (${order.paymentStatus})

Ver detalle: ${cliCtaUrl}`;

  return {
    subject,
    html: emailLayout({
      title: subject,
      preheader: `${order.shortCode} · ${order.items.length} producto(s) · ${formatMoney(order.total, order.currency)}`,
      bodyHtml,
    }),
    text,
  };
}
