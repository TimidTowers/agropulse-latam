import type { Metadata } from "next";
import { notificationsDb } from "@/lib/db/store";
import { isEmailEnabled } from "@/lib/notifications/email";
import { isWhatsAppEnabled } from "@/lib/notifications/whatsapp";
import { Badge } from "@/components/ui/Badge";
import { AdminNotifsClient } from "./AdminNotifsClient";

export const metadata: Metadata = {
  title: "Notificaciones — Admin AgroPulse",
};

export default async function AdminNotifsPage() {
  const notifs = await notificationsDb.list(200);
  const emailOn = isEmailEnabled();
  const waOn = isWhatsAppEnabled();
  return (
    <main className="p-6 lg:p-10">
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Notificaciones
          </h1>
          <p className="mt-1 text-sm text-muted">
            Cola unificada de email + WhatsApp.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={emailOn ? "success" : "warning"}>
            Resend {emailOn ? "OK" : "OFF"}
          </Badge>
          <Badge variant={waOn ? "success" : "warning"}>
            Twilio {waOn ? "OK" : "OFF"}
          </Badge>
        </div>
      </header>
      <AdminNotifsClient notifs={notifs} />
    </main>
  );
}
