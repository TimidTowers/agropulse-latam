"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
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
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-ink px-3 py-2"
            >
              Iniciar sesión
            </Link>
            <Link href="/planes">
              <Button size="md">Comenzar gratis</Button>
            </Link>
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
                <Link href="/planes" onClick={() => setOpen(false)}>
                  <Button className="w-full" size="md">
                    Comenzar gratis
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}
