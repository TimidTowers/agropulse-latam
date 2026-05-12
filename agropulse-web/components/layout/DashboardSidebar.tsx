"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Radio,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/sensores", label: "Sensores IoT", icon: Radio },
  { href: "/dashboard/inventario", label: "Inventario", icon: Boxes },
];

const secondaryItems = [
  { href: "/marketplace", label: "Ir al marketplace", icon: TrendingUp },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border-soft bg-surface sticky top-0 h-screen">
      <div className="flex h-16 items-center px-6 border-b border-border-soft">
        <Link href="/" aria-label="AgroPulse">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
          Productor
        </p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((it) => {
            const Icon = it.icon;
            const active = pathname === it.href;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-brand/10 text-brand-dark"
                      : "text-muted hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <Icon size={18} />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
          Otros
        </p>
        <ul className="flex flex-col gap-0.5">
          {secondaryItems.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink"
                >
                  <Icon size={18} />
                  {it.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
              <Settings size={18} />
              Configuración
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink">
              <HelpCircle size={18} />
              Ayuda
            </button>
          </li>
        </ul>
      </nav>

      <div className="border-t border-border-soft p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted hover:text-ink"
        >
          <ChevronLeft size={14} />
          Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
