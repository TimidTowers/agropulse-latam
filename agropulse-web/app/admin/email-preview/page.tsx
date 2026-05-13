/**
 * Admin · Email preview — renderiza cada plantilla con datos mock en iframes.
 * Solo accesible por rol admin (el layout ya valida).
 */
import type { Metadata } from "next";
import { Mail } from "lucide-react";
import {
  welcomeEmail,
  orderConfirmationEmail,
  orderStatusEmail,
  contactNotificationEmail,
  passwordChangedEmail,
} from "@/lib/notifications/templates";
import type { OrderExtended } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "Vista previa de emails — Admin",
};

const mockOrder: OrderExtended = {
  id: "o-preview-001",
  shortCode: "AP-2026-0042",
  customerId: "u-cli-cr-001",
  customerInfo: {
    name: "María Fernández Rojas",
    email: "maria.fernandez@example.com",
    phone: "+506 8765 4321",
    address: {
      line1: "Av. Central 1234",
      line2: "Edificio Aurora, oficina 502",
      city: "San José",
      state: "San José",
      postalCode: "10101",
      country: "CR",
    },
    country: "CR",
  },
  items: [
    {
      productId: "p-cafe",
      productSlug: "cafe-tarrazu-finca",
      productName: "Café Tarrazú SHB",
      productImage: "",
      productorId: "u-prod-cr-001",
      productorName: "Sofía Castro Jiménez",
      quantity: 10,
      unit: "kg",
      unitPrice: 3800,
      subtotal: 38000,
    },
    {
      productId: "p-pina",
      productSlug: "pina-dorada-costa",
      productName: "Piña Dorada MD-2",
      productImage: "",
      productorId: "u-prod-cr-002",
      productorName: "Cooperativa Coopepiña",
      quantity: 25,
      unit: "kg",
      unitPrice: 850,
      subtotal: 21250,
    },
  ],
  currency: "CRC",
  subtotal: 59250,
  commissionFee: 2370,
  shippingFee: 4500,
  total: 66120,
  paymentMethodId: "pm-card",
  paymentMethodLabel: "Tarjeta de crédito Visa/Mastercard",
  paymentStatus: "pagado",
  status: "preparando",
  statusHistory: [],
  estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
  notes: undefined,
  createdAt: new Date().toISOString(),
  country: "CR",
};

const previews = [
  {
    key: "welcome",
    label: "Bienvenida (cliente)",
    description:
      "Email enviado tras registro exitoso. Personalizado por rol y país.",
    rendered: welcomeEmail({
      name: "María Fernández",
      role: "cliente",
      country: "CR",
    }),
  },
  {
    key: "welcome-productor",
    label: "Bienvenida (productor)",
    description: "Variante para productores: steps enfocados en crear lotes.",
    rendered: welcomeEmail({
      name: "Sofía Castro",
      role: "productor",
      country: "CR",
    }),
  },
  {
    key: "order-cliente",
    label: "Confirmación de pedido (cliente)",
    description: "Email tras crear un pedido. Folio, items, totales y CTA.",
    rendered: orderConfirmationEmail({
      order: mockOrder,
      recipientRole: "cliente",
    }),
  },
  {
    key: "order-productor",
    label: "Confirmación de pedido (productor)",
    description: "Variante para productor: notificación de nuevo pedido.",
    rendered: orderConfirmationEmail({
      order: mockOrder,
      recipientRole: "productor",
    }),
  },
  {
    key: "status-preparando",
    label: "Cambio de estado · Preparando",
    description: "Timeline visual con el estado actual destacado.",
    rendered: orderStatusEmail({
      order: mockOrder,
      newStatus: "preparando",
      note: "El productor identificó tu pedido como prioritario.",
    }),
  },
  {
    key: "status-transito",
    label: "Cambio de estado · En tránsito",
    description: "Variante con timeline más avanzado.",
    rendered: orderStatusEmail({
      order: { ...mockOrder, status: "en_transito" },
      newStatus: "en_transito",
    }),
  },
  {
    key: "status-entregado",
    label: "Cambio de estado · Entregado",
    description: "Estado final, agradecimiento al cliente.",
    rendered: orderStatusEmail({
      order: { ...mockOrder, status: "entregado" },
      newStatus: "entregado",
    }),
  },
  {
    key: "contact",
    label: "Notificación de contacto",
    description: "Email interno al inbox AgroPulse desde el form de contacto.",
    rendered: contactNotificationEmail({
      fromName: "Andrés Mora",
      fromEmail: "andres.mora@cooperativa.com",
      phone: "+506 7777 8888",
      subject: "Interés en plan Pro para 12 fincas",
      message:
        "Hola,\n\nSomos una cooperativa de café en Tarrazú con 12 fincas asociadas (~85 hectáreas). Nos interesa migrar al plan Pro para integrar sensores IoT en los lotes premium.\n\n¿Podríamos agendar una demo la próxima semana?\n\nSaludos,\nAndrés",
      company: "Cooperativa Tarrazú Verde",
      role: "Gerente comercial",
      hectareas: "85",
    }),
  },
  {
    key: "password",
    label: "Contraseña cambiada",
    description: "Aviso de seguridad tras cambio de password.",
    rendered: passwordChangedEmail({
      name: "María Fernández",
      email: "maria.fernandez@example.com",
      changedAt: new Date().toISOString(),
      ipAddress: "190.45.123.45",
      userAgent: "Chrome 142 · macOS",
    }),
  },
];

export default function EmailPreviewPage() {
  return (
    <main className="p-6 lg:p-10">
      <header className="flex items-start gap-3 max-w-3xl">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand flex-shrink-0">
          <Mail size={18} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Vista previa de emails
          </h1>
          <p className="mt-1 text-sm text-muted">
            Cada plantilla se renderiza dentro de un iframe aislado para
            mostrar el HTML real que reciben los usuarios. Usa esta vista para
            validar diseño, copia y compatibilidad antes de cambios mayores.
          </p>
        </div>
      </header>

      <section className="mt-10 space-y-10">
        {previews.map((p) => (
          <article
            key={p.key}
            className="rounded-2xl border border-border-soft bg-surface overflow-hidden shadow-sm"
          >
            <header className="px-5 py-4 border-b border-border-soft bg-surface-2/40 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-brand">
                  Plantilla · {p.key}
                </p>
                <h2 className="mt-0.5 text-lg font-semibold text-ink">
                  {p.label}
                </h2>
                <p className="mt-1 text-xs text-muted max-w-2xl">
                  {p.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-muted uppercase tracking-wider">
                  Subject
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink max-w-md break-words">
                  {p.rendered.subject}
                </p>
              </div>
            </header>
            <div className="bg-[#FAFAF9]">
              <iframe
                title={`Preview ${p.label}`}
                srcDoc={p.rendered.html}
                sandbox=""
                className="block w-full"
                style={{ height: 760, border: 0 }}
              />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
