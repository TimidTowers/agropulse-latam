"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function TwoFactorVerifyClient() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/dashboard";
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    setError(null);
    if (!/^\d{6}$/.test(code)) {
      setError("Código de 6 dígitos requerido");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/auth/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const j = await res.json();
    if (!res.ok || !j.ok) {
      setError(j.error ?? "Código incorrecto");
      setBusy(false);
      return;
    }
    router.replace(from);
    router.refresh();
  }

  return (
    <div className="mt-8 rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
      <div className="flex gap-3 items-start">
        <Input
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          className="text-center tracking-[0.5em] font-mono text-lg"
          aria-label="Código de 6 dígitos"
          autoFocus
        />
        <Button onClick={verify} disabled={busy || code.length !== 6}>
          {busy ? (
            <>
              <Loader2 size={14} className="animate-spin" />
            </>
          ) : (
            <>
              <ShieldCheck size={14} /> Verificar
            </>
          )}
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
