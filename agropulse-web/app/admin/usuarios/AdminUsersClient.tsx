"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock, Trash2, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { COUNTRIES } from "@/lib/countries";
import type { PublicUser, UserRole } from "@/lib/db/types";

export function AdminUsersClient({
  initialUsers,
}: {
  initialUsers: PublicUser[];
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (countryFilter !== "all" && u.country !== countryFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !u.email.toLowerCase().includes(s) &&
          !u.name.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [users, search, roleFilter, countryFilter]);

  async function changeRole(id: string, role: UserRole) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((arr) => arr.map((u) => (u.id === id ? { ...u, role } : u)));
      router.refresh();
    }
  }

  async function block(id: string, blocked: boolean) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocked, unlock: !blocked }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) {
      return;
    }
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((arr) => arr.filter((u) => u.id !== id));
      router.refresh();
    }
  }

  return (
    <>
      <section className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-muted mb-1">
            <Search size={12} className="inline mr-1" /> Buscar
          </label>
          <Input
            placeholder="Email o nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-44">
          <label className="block text-xs text-muted mb-1">
            <Filter size={12} className="inline mr-1" /> Rol
          </label>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)}
          >
            <option value="all">Todos</option>
            <option value="admin">Admin</option>
            <option value="productor">Productor</option>
            <option value="cliente">Cliente</option>
            <option value="logistica">Logística</option>
          </Select>
        </div>
        <div className="w-48">
          <label className="block text-xs text-muted mb-1">País</label>
          <Select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="mt-6 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Usuario
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">Rol</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                País
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">2FA</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="border-t border-border-soft hover:bg-surface-2/40"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={u.role}
                    onChange={(e) =>
                      changeRole(u.id, e.target.value as UserRole)
                    }
                    className="h-8 text-xs"
                  >
                    <option value="admin">admin</option>
                    <option value="productor">productor</option>
                    <option value="cliente">cliente</option>
                    <option value="logistica">logistica</option>
                  </Select>
                </td>
                <td className="px-4 py-3 text-xs">{u.country}</td>
                <td className="px-4 py-3">
                  {u.twoFactorEnabled ? (
                    <Badge variant="success">Activo</Badge>
                  ) : (
                    <Badge>Inactivo</Badge>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => block(u.id, true)}
                    title="Bloquear"
                  >
                    <Lock size={12} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => block(u.id, false)}
                    title="Desbloquear"
                  >
                    <Unlock size={12} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => remove(u.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={12} />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}
