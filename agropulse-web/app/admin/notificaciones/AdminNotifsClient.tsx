"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Mail, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Notification } from "@/lib/db/types";

export function AdminNotifsClient({ notifs }: { notifs: Notification[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function retry(id: string) {
    setBusy(id);
    await fetch(`/api/admin/notifications/retry?id=${id}`, { method: "POST" });
    setBusy(null);
    router.refresh();
  }

  return (
    <section className="mt-6 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
      <table className="w-full text-sm">
        <thead className="bg-surface-2 text-left">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold text-muted">
              Canal
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-muted">
              Destino
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-muted">
              Asunto / Cuerpo
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-muted">
              Estado
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-muted">
              Fecha
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-muted">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {notifs.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-muted">
                Sin notificaciones aún.
              </td>
            </tr>
          )}
          {notifs.map((n) => (
            <tr key={n.id} className="border-t border-border-soft">
              <td className="px-4 py-3">
                {n.channel === "email" ? (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Mail size={12} /> Email
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <MessageCircle size={12} /> WhatsApp
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-xs">{n.to}</td>
              <td className="px-4 py-3 text-xs max-w-md">
                <p className="font-medium text-ink truncate">
                  {n.subject ?? "(sin asunto)"}
                </p>
                <p className="text-muted truncate">{n.body}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant={notifVariant(n.status)}>{n.status}</Badge>
                {n.lastError && (
                  <p className="text-[10px] text-danger mt-1">
                    {n.lastError}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-muted">
                {new Date(n.createdAt).toLocaleString("es-CR")}
              </td>
              <td className="px-4 py-3">
                {(n.status === "fallido" || n.status === "deshabilitado") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => retry(n.id)}
                    disabled={busy === n.id}
                  >
                    <RotateCcw size={12} /> Reintentar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function notifVariant(
  s: string,
): "default" | "success" | "warning" | "danger" {
  if (s === "enviado") return "success";
  if (s === "fallido") return "danger";
  if (s === "deshabilitado") return "warning";
  return "default";
}
