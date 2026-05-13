/**
 * Plantilla — Email de bienvenida tras signup.
 */
import type { UserRole } from "@/lib/db/types";
import { getCountry, type CountryCode } from "@/lib/countries";
import {
  ctaButton,
  emailLayout,
  esc,
  infoTable,
  TOKENS,
} from "./_layout";

export interface WelcomeEmailOpts {
  name: string;
  role: UserRole;
  country: CountryCode;
}

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Administrador",
  productor: "Productor",
  cliente: "Cliente",
  logistica: "Logística",
};

const STEPS: Record<UserRole, { title: string; body: string }[]> = {
  cliente: [
    {
      title: "Explora el marketplace",
      body: "Descubre lotes verificados de productores en 10 países LATAM, con trazabilidad por sensor IoT.",
    },
    {
      title: "Agrega productos al carrito",
      body: "Selecciona la cantidad exacta en kg, tonelada o caja. Solo puedes comprar de productores de tu país.",
    },
    {
      title: "Completa tu primer pedido",
      body: "Paga con tarjeta, transferencia o efectivo (según país). Te avisamos en cada cambio de estado.",
    },
  ],
  productor: [
    {
      title: "Completa tu perfil",
      body: "Añade tu cooperativa, hectáreas y certificaciones. Los compradores valoran productores verificados.",
    },
    {
      title: "Crea tu primer lote",
      body: "Sube fotos, define precio, unidad y stock. Asigna un sensor IoT para monitoreo en tiempo real.",
    },
    {
      title: "Recibe tus primeros pedidos",
      body: "Los clientes locales te encuentran por categoría y región. Comisión solo 4% al cerrar venta.",
    },
  ],
  logistica: [
    {
      title: "Configura tu vehículo",
      body: "Indica capacidad, placa y zona de cobertura para que el sistema te asigne rutas óptimas.",
    },
    {
      title: "Acepta pedidos",
      body: "Revisa los pedidos disponibles en tu región y asígnatelos con un click.",
    },
    {
      title: "Entrega y reporta",
      body: "Actualiza el estado del pedido (en tránsito, última milla, entregado) desde tu panel.",
    },
  ],
  admin: [
    {
      title: "Panel administrativo",
      body: "Accede a /admin para gestionar usuarios, pedidos, lotes y notificaciones del sistema.",
    },
    {
      title: "Audit logs",
      body: "Cada acción crítica queda registrada. Revisa /admin/logs para auditoría.",
    },
    {
      title: "Notificaciones",
      body: "Monitorea el estado de emails y mensajes WhatsApp en /admin/notificaciones.",
    },
  ],
};

const CTA_BY_ROLE: Record<UserRole, { href: string; label: string }> = {
  cliente: {
    href: "https://agropulse-web.vercel.app/marketplace",
    label: "Explorar marketplace",
  },
  productor: {
    href: "https://agropulse-web.vercel.app/dashboard-lots",
    label: "Crear mi primer lote",
  },
  logistica: {
    href: "https://agropulse-web.vercel.app/dashboard",
    label: "Ir al panel",
  },
  admin: {
    href: "https://agropulse-web.vercel.app/admin",
    label: "Ir al admin",
  },
};

export function welcomeEmail(opts: WelcomeEmailOpts): {
  subject: string;
  html: string;
  text: string;
} {
  const country = getCountry(opts.country);
  const roleLabel = ROLE_LABEL[opts.role];
  const steps = STEPS[opts.role] ?? STEPS.cliente;
  const cta = CTA_BY_ROLE[opts.role] ?? CTA_BY_ROLE.cliente;

  const stepsHtml = steps
    .map(
      (s, idx) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${TOKENS.border};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="top" width="40" style="width: 40px;">
                  <div style="width: 32px; height: 32px; background: ${TOKENS.brand}; color: #fff; border-radius: 50%; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; font-weight: 700; line-height: 32px; text-align: center;">
                    ${idx + 1}
                  </div>
                </td>
                <td valign="top" style="padding-left: 12px;">
                  <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${TOKENS.ink};">
                    ${esc(s.title)}
                  </p>
                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.muted}; line-height: 1.55;">
                    ${esc(s.body)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `,
    )
    .join("");

  const bodyHtml = `
    <h1 class="ap-h1" style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 26px; font-weight: 700; line-height: 1.25; color: ${TOKENS.ink};">
      Bienvenido a AgroPulse, ${esc(opts.name)}
    </h1>
    <p style="margin: 0 0 18px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 15px; color: ${TOKENS.muted}; line-height: 1.6;">
      Tu cuenta como <strong style="color:${TOKENS.ink};">${esc(roleLabel)}</strong> en
      ${esc(country.flag)} ${esc(country.name)} fue creada con éxito.
      Estos son tus próximos pasos:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 16px;">
      ${stepsHtml}
    </table>

    ${ctaButton({ href: cta.href, label: cta.label })}

    <p style="margin: 16px 0 8px; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.muted}; font-weight: 600;">
      Detalles de tu cuenta
    </p>
    ${infoTable([
      { label: "Nombre", value: esc(opts.name) },
      { label: "Rol", value: esc(roleLabel) },
      { label: "País", value: `${esc(country.flag)} ${esc(country.name)}` },
    ])}

    <p style="margin: 20px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: ${TOKENS.muted}; line-height: 1.6;">
      ¿Tenés dudas? Escribinos a
      <a href="mailto:sebastorresagropulse@gmail.com" style="color: ${TOKENS.brand};">sebastorresagropulse@gmail.com</a>
      o por WhatsApp al
      <a href="tel:+50683378828" style="color: ${TOKENS.brand};">+506 8337 8828</a>.
    </p>
    <p style="margin: 12px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; color: ${TOKENS.muted};">
      Si no creaste esta cuenta, ignorá este correo o repórtanos el incidente.
    </p>
  `;

  const subject = `Bienvenido a AgroPulse, ${opts.name}`;
  const text = `Bienvenido a AgroPulse, ${opts.name}.

Tu cuenta como ${roleLabel} en ${country.name} fue creada con éxito.

Próximos pasos:
${steps.map((s, i) => `  ${i + 1}. ${s.title}: ${s.body}`).join("\n")}

Accede a tu panel: ${cta.href}

¿Dudas? Escribinos a sebastorresagropulse@gmail.com o WhatsApp +506 8337 8828.`;

  return {
    subject,
    html: emailLayout({
      title: subject,
      preheader: `Tu cuenta de ${roleLabel} ya está activa en AgroPulse ${country.flag}`,
      bodyHtml,
    }),
    text,
  };
}
