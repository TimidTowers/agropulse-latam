import type { Metadata } from "next";
import { auditDb } from "@/lib/db/store";
import { AdminLogsClient } from "./AdminLogsClient";

export const metadata: Metadata = {
  title: "Audit logs — Admin AgroPulse",
};

export default async function AdminLogsPage() {
  const logs = await auditDb.list(500);
  return (
    <main className="p-6 lg:p-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Audit logs
        </h1>
        <p className="mt-1 text-sm text-muted">
          Registro inmutable de eventos de seguridad y operación.
        </p>
      </header>
      <AdminLogsClient logs={logs} />
    </main>
  );
}
