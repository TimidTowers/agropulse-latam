"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Sprout,
  ShieldCheck,
  Package,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { CountrySwitcher } from "@/components/country/CountrySwitcher";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/paises", label: "Países" },
  { href: "/productores", label: "Productores" },
  { href: "/planes", label: "Planes" },
  { href: "/nosotros", label: "Nosotros" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const itemsCount = useCartStore((s) => s.items.length);
  const { data: session, status } = useSession();
  const authed = status === "authenticated" && !!session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft/80 bg-surface/85 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="AgroPulse">
            <Logo />
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium text-muted hover:text-ink transition-colors rounded-lg hover:bg-surface-2",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-2">
            <CountrySwitcher />
            <Link
              href="/carrito"
              aria-label="Carrito"
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-border-soft hover:bg-surface-2"
            >
              <ShoppingCart size={16} />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-brand text-white text-[10px] font-semibold px-1">
                  {itemsCount}
                </span>
              )}
            </Link>
            {authed ? (
              <UserMenu
                name={session.user.name ?? "Mi cuenta"}
                email={session.user.email ?? ""}
                role={session.user.role}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted hover:text-ink px-3 py-2"
                >
                  Iniciar sesión
                </Link>
                <Link href="/signup">
                  <Button size="md">Comenzar gratis</Button>
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <CountrySwitcher compact />
            <Link
              href="/carrito"
              aria-label="Carrito"
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-border-soft"
            >
              <ShoppingCart size={16} />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-brand text-white text-[10px] font-semibold px-1">
                  {itemsCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-surface-2"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden pb-4">
            <ul className="flex flex-col gap-1 pt-2 border-t border-border-soft">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 rounded-lg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contacto"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 rounded-lg"
                >
                  Contacto
                </Link>
              </li>
              {authed ? (
                <>
                  <li>
                    <Link
                      href="/perfil"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 rounded-lg"
                    >
                      Mi perfil
                    </Link>
                  </li>
                  <li className="pt-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-danger hover:bg-surface-2 rounded-lg"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="pt-2">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-2 rounded-lg"
                    >
                      Iniciar sesión
                    </Link>
                  </li>
                  <li className="pt-1">
                    <Link href="/signup" onClick={() => setOpen(false)}>
                      <Button className="w-full" size="md">
                        Comenzar gratis
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}

function UserMenu({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const links: { href: string; label: string; icon: typeof UserIcon }[] = [
    { href: "/perfil", label: "Mi perfil", icon: UserIcon },
  ];
  if (role === "cliente") {
    links.push({ href: "/pedidos", label: "Mis pedidos", icon: Package });
  }
  if (role === "productor") {
    links.push({ href: "/dashboard", label: "Mis lotes", icon: Sprout });
  }
  if (role === "logistica") {
    links.push({ href: "/dashboard", label: "Mis envíos", icon: Truck });
  }
  if (role === "admin") {
    links.push({ href: "/admin", label: "Panel admin", icon: ShieldCheck });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-surface-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white text-xs font-semibold">
          {initials || "AP"}
        </span>
        <span className="hidden xl:flex flex-col text-left">
          <span className="text-xs font-medium text-ink leading-tight max-w-[120px] truncate">
            {name}
          </span>
          <span className="text-[10px] text-muted leading-tight">
            {role}
          </span>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-xl border border-border-soft bg-surface shadow-xl p-2"
            role="menu"
          >
            <div className="px-3 py-2 border-b border-border-soft mb-1">
              <p className="text-xs font-semibold text-ink truncate">{name}</p>
              <p className="text-[11px] text-muted truncate">{email}</p>
            </div>
            <ul>
              {links.map((l) => {
                const Icon = l.icon;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-2 rounded-lg"
                      role="menuitem"
                    >
                      <Icon size={14} className="text-muted" /> {l.label}
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-border-soft mt-1 pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5 rounded-lg"
                  role="menuitem"
                >
                  <LogOut size={14} /> Cerrar sesión
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
