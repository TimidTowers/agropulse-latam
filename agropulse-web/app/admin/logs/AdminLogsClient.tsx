"use client";

import { useMemo, useState } from "react";
import { Search, Filter, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AuditLog } from "@/lib/db/types";

const PAGE_SIZE = 25;

export function AdminLogsClient({ logs }: { logs: AuditLog[] }) {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState<string>("all");
  const [success, setSuccess] = useState<"all" | "ok" | "fail">("all");
  const [page, setPage] = useState(1);

  const actions = useMemo(() => {
    const set = new Set(logs.map((l) => l.action));
    return Array.from(set);
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (action !== "all" && l.action !== action) return false;
      if (success === "ok" && !l.success) return false;
      if (success === "fail" && l.success) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !l.message.toLowerCase().includes(s) &&
          !(l.userEmail ?? "").toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [logs, search, action, success]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <section className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs text-muted mb-1">
            <Search size={12} className="inline mr-1" /> Buscar
          </label>
          <Input
            placeholder="Mensaje o email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-56">
          <label className="block text-xs text-muted mb-1">
            <Filter size={12} className="inline mr-1" /> Acción
          </label>
          <Select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Todas</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-36">
          <label className="block text-xs text-muted mb-1">Resultado</label>
          <Select
            value={success}
            onChange={(e) => {
              setSuccess(e.target.value as "all" | "ok" | "fail");
              setPage(1);
            }}
          >
            <option value="all">Todos</option>
            <option value="ok">Éxitos</option>
            <option value="fail">Fallos</option>
          </Select>
        </div>
      </section>

      <section className="mt-6 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Resultado
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Mensaje
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Acción
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Usuario
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Sin logs que coincidan.
                </td>
              </tr>
            )}
            {pageItems.map((l) => (
              <tr key={l.id} className="border-t border-border-soft">
                <td className="px-4 py-3">
                  {l.success ? (
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  ) : (
                    <XCircle size={14} className="text-danger" />
                  )}
                </td>
                <td className="px-4 py-3 text-xs">{l.message}</td>
                <td className="px-4 py-3 text-xs font-mono">{l.action}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {l.userEmail ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {new Date(l.timestamp).toLocaleString("es-CR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {totalPages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-xs text-muted">
          <p>
            Mostrando {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border-soft px-2 py-1 disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="px-2 py-1">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-border-soft px-2 py-1 disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
