import type { Metadata } from "next";
import {
  usersDb,
  ordersDb,
  lotsDb,
  auditDb,
  notificationsDb,
} from "@/lib/db/store";
import { Users, Package, Sprout, AlertTriangle, Mail } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Admin — AgroPulse",
};

export default function AdminHomePage() {
  const users = usersDb.list();
  const orders = ordersDb.listAll();
  const lots = lotsDb.listAll();
  const notifs = notificationsDb.list(500);
  const recentLogs = auditDb.list(20);

  const failedNotifs = notifs.filter(
    (n) => n.status === "fallido" || n.status === "deshabilitado",
  ).length;

  const signupsByCountry = COUNTRIES.map((c) => ({
    country: c.name,
    flag: c.flag,
    count: users.filter((u) => u.country === c.code).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <main className="p-6 lg:p-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Panel administrativo
        </h1>
        <p className="mt-1 text-sm text-muted">
          Vista general de AgroPulse en todos los países.
        </p>
      </header>

      <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          label="Usuarios"
          value={users.length}
          icon={<Users size={18} className="text-brand" />}
        />
        <Kpi
          label="Pedidos"
          value={orders.length}
          icon={<Package size={18} className="text-brand" />}
        />
        <Kpi
          label="Lotes activos"
          value={lots.filter((l) => l.status === "activo").length}
          icon={<Sprout size={18} className="text-brand" />}
        />
        <Kpi
          label="Notif. con fallo"
          value={failedNotifs}
          icon={<AlertTriangle size={18} className="text-warm" />}
          tone={failedNotifs > 0 ? "warning" : "default"}
        />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">
              Usuarios por país
            </h2>
            <Mail size={14} className="text-muted" />
          </header>
          <ul className="mt-4 space-y-2">
            {signupsByCountry.map((c) => (
              <li
                key={c.country}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-ink">
                  {c.flag} {c.country}
                </span>
                <span className="font-mono text-brand">{c.count}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">
            Actividad reciente
          </h2>
          <ul className="mt-4 space-y-2.5">
            {recentLogs.length === 0 && (
              <li className="text-xs text-muted">Sin actividad aún.</li>
            )}
            {recentLogs.map((l) => (
              <li
                key={l.id}
                className="rounded-lg bg-surface-2 px-3 py-2 text-xs"
              >
                <p className="font-medium text-ink">{l.message}</p>
                <p className="text-muted">
                  {l.action} · {new Date(l.timestamp).toLocaleString("es-CR")}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

function Kpi({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "default" | "warning";
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        tone === "warning"
          ? "border-warm/40 bg-warm/5"
          : "border-border-soft bg-surface"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}
