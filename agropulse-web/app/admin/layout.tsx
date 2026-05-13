import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Users,
  Package,
  ScrollText,
  Bell,
  Sprout,
  LogOut,
} from "lucide-react";
import { AdminSignOut } from "./AdminSignOut";

const nav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/pedidos", label: "Pedidos", icon: Package },
  { href: "/admin/lotes", label: "Lotes", icon: Sprout },
  { href: "/admin/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/admin/logs", label: "Audit logs", icon: ScrollText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/login?from=/admin");
  if (me.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:flex flex-col border-r border-border-soft bg-surface px-4 py-6 sticky top-0 h-screen">
        <Link href="/" aria-label="Inicio" className="px-2">
          <Logo />
        </Link>
        <nav className="mt-8 flex-1">
          <ul className="space-y-1">
            {nav.map((n) => {
              const Icon = n.icon;
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink hover:bg-surface-2"
                  >
                    <Icon size={16} />
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border-soft pt-4">
          <p className="text-xs font-medium text-ink truncate">{me.name}</p>
          <p className="text-[11px] text-muted truncate">{me.email}</p>
          <AdminSignOut />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="lg:hidden border-b border-border-soft bg-surface px-4 py-3 flex items-center gap-3">
          <Logo />
          <span className="text-xs font-semibold text-brand uppercase tracking-wider">
            Admin
          </span>
        </header>
        <nav className="lg:hidden flex gap-1 overflow-x-auto bg-surface border-b border-border-soft px-4 py-2">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface-2 whitespace-nowrap"
              >
                <Icon size={12} /> {n.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </div>
  );
}
