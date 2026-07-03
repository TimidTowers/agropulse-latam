import type { Metadata } from "next";
import { usersDb } from "@/lib/db/store";
import { toPublicUser } from "@/lib/db/types";
import { AdminUsersClient } from "./AdminUsersClient";

export const metadata: Metadata = {
  title: "Usuarios — Admin AgroPulse",
};

export default async function AdminUsersPage() {
  const users = (await usersDb.list()).map(toPublicUser);
  return (
    <main className="p-6 lg:p-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Usuarios
        </h1>
        <p className="mt-1 text-sm text-muted">
          Gestiona roles, bloqueos y permisos.
        </p>
      </header>
      <AdminUsersClient initialUsers={users} />
    </main>
  );
}
