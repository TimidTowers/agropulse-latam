/**
 * AgroPulse — Layout HTML compartido para todos los emails transaccionales.
 *
 * Diseño:
 *  - Header banner verde #15803D con logo textual + tagline.
 *  - Body fondo crema #FAFAF9, card blanca centrada max-width 600px.
 *  - Footer con info de contacto y enlaces legales.
 *
 * Compatibilidad: tablas anidadas con inline CSS (Outlook, Gmail, Apple Mail,
 * Yahoo). Sin flexbox ni grid. Media queries solo para móvil.
 */

const BRAND = "#15803D";
const BRAND_DARK = "#14532D";
const BG = "#FAFAF9";
const SURFACE = "#FFFFFF";
const INK = "#0F172A";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";
const ACCENT = "#FBBF24";

export interface EmailLayoutOptions {
  /** Título del email (aparece en <title>; útil para preview) */
  title: string;
  /** Texto invisible que muestran clientes de correo como preview */
  preheader?: string;
  /** HTML del cuerpo del card central */
  bodyHtml: string;
  /** Hide header/footer (raro) */
  bare?: boolean;
}

/** Escapa HTML para evitar inyección. */
export function esc(s: string | number | undefined | null): string {
  if (s === undefined || s === null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Botón CTA reutilizable como tabla (compatible Outlook). */
export function ctaButton(opts: {
  href: string;
  label: string;
  background?: string;
  color?: string;
}): string {
  const bg = opts.background ?? BRAND;
  const fg = opts.color ?? "#FFFFFF";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background: ${bg};">
          <a href="${esc(opts.href)}" target="_blank"
             style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 15px; font-weight: 600; color: ${fg}; text-decoration: none; border-radius: 12px;">
            ${esc(opts.label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

/** Card informativa amarilla (ej. notas) */
export function noteCard(text: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0;">
      <tr>
        <td style="background: #FEF3C7; border-left: 4px solid ${ACCENT}; padding: 14px 16px; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: #78350F; line-height: 1.55;">
          <strong style="color:#92400E;">Nota:</strong> ${esc(text)}
        </td>
      </tr>
    </table>
  `;
}

/** Tabla de 2 columnas para datos clave-valor. */
export function infoTable(rows: { label: string; value: string }[]): string {
  const tr = rows
    .map(
      (r) => `
        <tr>
          <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${MUTED}; width: 40%;">${esc(r.label)}</td>
          <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${INK}; font-weight: 500;">${r.value}</td>
        </tr>
      `,
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER}; margin: 16px 0;">
      ${tr}
    </table>
  `;
}

/** Renderiza el HTML completo del email. */
export function emailLayout({
  title,
  preheader,
  bodyHtml,
  bare,
}: EmailLayoutOptions): string {
  const safePreheader = preheader ? esc(preheader) : "";
  const headerHtml = bare ? "" : renderHeader();
  const footerHtml = bare ? "" : renderFooter();

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <title>${esc(title)}</title>
  <style type="text/css">
    /* Reset básico */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a { color: ${BRAND}; }
    /* Mobile */
    @media only screen and (max-width: 620px) {
      .ap-container { width: 100% !important; max-width: 100% !important; }
      .ap-card { padding: 24px 18px !important; }
      .ap-header-title { font-size: 22px !important; }
      .ap-h1 { font-size: 22px !important; }
      .ap-hidden-sm { display: none !important; }
      .ap-stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BG}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: ${INK};">
  ${
    safePreheader
      ? `<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; visibility:hidden; opacity:0;">${safePreheader}</div>`
      : ""
  }
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${BG};">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" class="ap-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
          ${headerHtml}
          <tr>
            <td align="center" style="padding: 24px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${SURFACE}; border: 1px solid ${BORDER}; border-radius: 16px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);">
                <tr>
                  <td class="ap-card" style="padding: 36px 36px;">
                    ${bodyHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${footerHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderHeader(): string {
  return `
    <tr>
      <td align="center" style="background: ${BRAND}; background-image: linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%); padding: 32px 16px; border-radius: 0 0 24px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: #FFFFFF;" class="ap-header-title">
                AgroPulse
              </p>
              <p style="margin: 6px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.85); letter-spacing: 0.01em;">
                El pulso inteligente de tu cosecha
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function renderFooter(): string {
  return `
    <tr>
      <td align="center" style="padding: 8px 24px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 16px 0; border-top: 1px solid ${BORDER};">
              <p style="margin: 0 0 10px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; color: ${MUTED}; line-height: 1.6;">
                AgroPulse · San José, Costa Rica<br />
                <a href="mailto:sebastorresagropulse@gmail.com" style="color: ${BRAND}; text-decoration: none;">sebastorresagropulse@gmail.com</a>
                &nbsp;·&nbsp;
                <a href="tel:+50683378828" style="color: ${BRAND}; text-decoration: none;">+506 8337 8828</a>
                &nbsp;·&nbsp;
                <a href="https://agropulse-web.vercel.app" style="color: ${BRAND}; text-decoration: none;">agropulse-web.vercel.app</a>
              </p>
              <p style="margin: 12px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; color: ${MUTED};">
                <a href="https://agropulse-web.vercel.app/legal/privacidad" style="color: ${MUTED}; text-decoration: underline;">Privacidad</a>
                &nbsp;·&nbsp;
                <a href="https://agropulse-web.vercel.app/legal/terminos" style="color: ${MUTED}; text-decoration: underline;">Términos</a>
              </p>
              <p style="margin: 16px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; color: ${MUTED};">
                © ${new Date().getFullYear()} AgroPulse. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

/** Tokens del brand exportados para componentes individuales. */
export const TOKENS = {
  brand: BRAND,
  brandDark: BRAND_DARK,
  bg: BG,
  surface: SURFACE,
  ink: INK,
  muted: MUTED,
  border: BORDER,
  accent: ACCENT,
};
