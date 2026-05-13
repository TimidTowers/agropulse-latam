"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-3 w-full inline-flex items-center gap-2 rounded-lg border border-border-soft px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface-2"
    >
      <LogOut size={12} /> Cerrar sesión
    </button>
  );
}
