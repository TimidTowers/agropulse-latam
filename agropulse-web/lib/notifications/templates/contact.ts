/**
 * Plantilla — Notificación interna por formulario de contacto.
 * Se envía a AGROPULSE_INBOX (sebastorresagropulse@gmail.com).
 */
import { emailLayout, esc, infoTable, TOKENS } from "./_layout";

export interface ContactEmailOpts {
  fromName: string;
  fromEmail: string;
  phone?: string;
  subject?: string;
  message: string;
  /** Campos extra opcionales del form (empresa, rol, hectáreas) */
  company?: string;
  role?: string;
  hectareas?: string;
}

export function contactNotificationEmail(opts: ContactEmailOpts): {
  subject: string;
  html: string;
  text: string;
} {
  const subj =
    opts.subject?.trim() ||
    `Nuevo mensaje de ${opts.fromName} — Contacto sitio`;

  // El mensaje del usuario va con line-breaks preservados como HTML <br />
  const messageHtml = esc(opts.message).replace(/\n/g, "<br />");

  const meta: { label: string; value: string }[] = [
    { label: "Nombre", value: esc(opts.fromName) },
    {
      label: "Email",
      value: `<a href="mailto:${esc(opts.fromEmail)}" style="color: ${TOKENS.brand};">${esc(opts.fromEmail)}</a>`,
    },
  ];
  if (opts.phone) {
    meta.push({
      label: "Teléfono",
      value: `<a href="tel:${esc(opts.phone)}" style="color: ${TOKENS.brand};">${esc(opts.phone)}</a>`,
    });
  }
  if (opts.company) meta.push({ label: "Empresa", value: esc(opts.company) });
  if (opts.role) meta.push({ label: "Rol", value: esc(opts.role) });
  if (opts.hectareas)
    meta.push({ label: "Hectáreas", value: esc(opts.hectareas) });

  const bodyHtml = `
    <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${TOKENS.brand};">
      Nuevo mensaje · Formulario de contacto
    </p>
    <h1 class="ap-h1" style="margin: 4px 0 14px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 22px; font-weight: 700; color: ${TOKENS.ink}; line-height: 1.3;">
      ${esc(opts.fromName)}
    </h1>

    ${infoTable(meta)}

    <p style="margin: 22px 0 8px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${TOKENS.muted};">
      Mensaje
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #F8FAFC; border-left: 4px solid ${TOKENS.brand}; border-radius: 4px;">
      <tr>
        <td style="padding: 18px 20px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; color: ${TOKENS.ink}; line-height: 1.65; white-space: pre-wrap;">
          ${messageHtml}
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 22px 0 0;">
      <tr>
        <td style="border-radius: 12px; background: ${TOKENS.brand};">
          <a href="mailto:${esc(opts.fromEmail)}?subject=${encodeURIComponent("Re: " + (opts.subject ?? "Tu mensaje a AgroPulse"))}"
             style="display: inline-block; padding: 14px 24px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 12px;">
            Responder a ${esc(opts.fromName)}
          </a>
        </td>
      </tr>
    </table>
  `;

  const text = `Nuevo mensaje de contacto en AgroPulse

De: ${opts.fromName} <${opts.fromEmail}>
${opts.phone ? `Teléfono: ${opts.phone}\n` : ""}${opts.company ? `Empresa: ${opts.company}\n` : ""}${opts.role ? `Rol: ${opts.role}\n` : ""}${opts.hectareas ? `Hectáreas: ${opts.hectareas}\n` : ""}
Mensaje:
${opts.message}

Responder: ${opts.fromEmail}`;

  return {
    subject: subj,
    html: emailLayout({
      title: subj,
      preheader: `De ${opts.fromName} (${opts.fromEmail})`,
      bodyHtml,
    }),
    text,
  };
}
