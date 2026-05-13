/**
 * Plantilla — Confirmación de cambio de contraseña.
 * Aviso de seguridad: incluye instrucción de contacto si no fue el usuario.
 */
import { ctaButton, emailLayout, esc, infoTable, TOKENS } from "./_layout";

export interface PasswordChangedOpts {
  name: string;
  /** Email del usuario, mostrado en la tabla de detalles */
  email: string;
  /** Fecha-hora del cambio (ISO o human-readable) */
  changedAt?: string;
  /** IP origen (opcional) */
  ipAddress?: string;
  /** Navegador / agente (opcional) */
  userAgent?: string;
}

function fmtDate(iso?: string): string {
  if (!iso) return new Date().toLocaleString("es-CR");
  try {
    return new Date(iso).toLocaleString("es-CR", {
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function passwordChangedEmail(opts: PasswordChangedOpts): {
  subject: string;
  html: string;
  text: string;
} {
  const meta: { label: string; value: string }[] = [
    { label: "Cuenta", value: esc(opts.email) },
    { label: "Fecha", value: esc(fmtDate(opts.changedAt)) },
  ];
  if (opts.ipAddress)
    meta.push({ label: "IP origen", value: esc(opts.ipAddress) });
  if (opts.userAgent)
    meta.push({ label: "Dispositivo", value: esc(opts.userAgent) });

  const bodyHtml = `
    <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${TOKENS.brand};">
      Seguridad de la cuenta
    </p>
    <h1 class="ap-h1" style="margin: 4px 0 10px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 24px; font-weight: 700; color: ${TOKENS.ink}; line-height: 1.25;">
      Tu contraseña fue actualizada
    </h1>
    <p style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; color: ${TOKENS.muted}; line-height: 1.6;">
      Hola ${esc(opts.name)}, te confirmamos que la contraseña de tu cuenta AgroPulse fue cambiada correctamente.
    </p>

    ${infoTable(meta)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 18px 0 0; background: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 4px;">
      <tr>
        <td style="padding: 16px 18px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: #991B1B; line-height: 1.6;">
          <strong style="color: #7F1D1D;">¿No fuiste tú?</strong><br />
          Si no realizaste este cambio, tu cuenta puede estar comprometida.
          Contáctanos inmediatamente para asegurarla:
          <a href="mailto:sebastorresagropulse@gmail.com" style="color: #7F1D1D; font-weight: 600;">
            sebastorresagropulse@gmail.com
          </a>
          o WhatsApp
          <a href="tel:+50683378828" style="color: #7F1D1D; font-weight: 600;">+506 8337 8828</a>.
        </td>
      </tr>
    </table>

    ${ctaButton({
      href: "https://agropulse-web.vercel.app/perfil",
      label: "Revisar mi cuenta",
    })}

    <p style="margin: 12px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; color: ${TOKENS.muted}; line-height: 1.6;">
      Recomendaciones de seguridad:
    </p>
    <ul style="margin: 8px 0 0; padding-left: 18px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; color: ${TOKENS.muted}; line-height: 1.6;">
      <li>Activa la autenticación en dos pasos (2FA).</li>
      <li>Usa una contraseña única y robusta para AgroPulse.</li>
      <li>Nunca compartas tu contraseña por correo o WhatsApp.</li>
    </ul>
  `;

  const subject = "Tu contraseña en AgroPulse fue actualizada";
  const text = `Hola ${opts.name},

Tu contraseña de AgroPulse fue actualizada el ${fmtDate(opts.changedAt)}.

Si no fuiste tú, contáctanos inmediatamente:
  - Email: sebastorresagropulse@gmail.com
  - WhatsApp: +506 8337 8828

Revisar mi cuenta: https://agropulse-web.vercel.app/perfil`;

  return {
    subject,
    html: emailLayout({
      title: subject,
      preheader: "Confirmación de cambio de contraseña — AgroPulse",
      bodyHtml,
    }),
    text,
  };
}
