"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tractor, ShoppingBag, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Role = "productor" | "comprador";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("productor");
  const [email, setEmail] = useState("demo@agropulse.mx");
  const [password, setPassword] = useState("agropulse");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }
    setLoading(true);
    // Simulate auth latency
    await new Promise((r) => setTimeout(r, 700));
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "agropulse-session",
          JSON.stringify({ email, role, ts: Date.now() }),
        );
      }
      router.push(role === "productor" ? "/dashboard" : "/marketplace");
    } catch {
      setError("Hubo un error iniciando sesión");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      {/* Role tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-2 p-1">
        {(
          [
            {
              v: "productor" as Role,
              label: "Productor",
              icon: Tractor,
              desc: "Acceso al dashboard",
            },
            {
              v: "comprador" as Role,
              label: "Comprador",
              icon: ShoppingBag,
              desc: "Acceso al marketplace",
            },
          ]
        ).map((r) => {
          const Icon = r.icon;
          const active = role === r.v;
          return (
            <button
              key={r.v}
              type="button"
              onClick={() => setRole(r.v)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg py-3 px-2 text-sm font-medium transition-all",
                active
                  ? "bg-surface text-ink shadow-sm"
                  : "text-muted hover:text-ink",
              )}
            >
              <Icon size={18} />
              {r.label}
              <span
                className={cn(
                  "text-[10px] font-normal",
                  active ? "text-muted" : "text-muted/70",
                )}
              >
                {r.desc}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-muted mb-1.5"
        >
          Correo electrónico
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-muted"
          >
            Contraseña
          </label>
          <button
            type="button"
            className="text-xs text-brand font-medium hover:underline"
          >
            ¿La olvidaste?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="rounded-lg bg-brand/5 px-3 py-2 text-xs text-brand-dark">
        <strong>Demo:</strong> Cualquier email/contraseña funciona. Se simula
        sesión con localStorage.
      </div>

      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Entrando…
          </>
        ) : (
          <>Entrar como {role}</>
        )}
      </Button>
    </form>
  );
}
