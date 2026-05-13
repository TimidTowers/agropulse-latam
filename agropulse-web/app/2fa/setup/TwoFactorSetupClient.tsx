"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Copy, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SetupData {
  secret: string;
  qr: string;
  otpauth: string;
}

export function TwoFactorSetupClient({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void fetch("/api/auth/2fa/setup", { method: "POST" })
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setSetupData(j as SetupData);
        else setError(j.error ?? "No se pudo generar el secreto");
      })
      .catch(() => setError("Error de red"));
  }, []);

  async function activate() {
    setError(null);
    if (!/^\d{6}$/.test(code)) {
      setError("Código de 6 dígitos requerido");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/2fa/verify?mode=activate", {
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
      router.replace("/perfil");
      router.refresh();
    } catch {
      setError("Error de red");
      setBusy(false);
    }
  }

  async function copySecret() {
    if (!setupData) return;
    await navigator.clipboard.writeText(setupData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!setupData && !error) {
    return (
      <div className="mt-8 flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Generando secreto seguro…
      </div>
    );
  }

  if (error && !setupData) {
    return (
      <div className="mt-8 text-sm text-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">1. Escanear con tu app</h2>
        <p className="mt-1 text-xs text-muted">
          Cuenta: <strong>{userEmail}</strong>
        </p>
        {setupData && (
          <div className="mt-4 flex flex-col sm:flex-row items-start gap-6">
            <Image
              src={setupData.qr}
              alt="Código QR para 2FA"
              width={200}
              height={200}
              unoptimized
              className="rounded-lg border border-border-soft"
            />
            <div className="flex-1 space-y-2">
              <p className="text-xs text-muted">
                ¿No podés escanear? Ingresá este código manualmente:
              </p>
              <div className="flex items-center gap-2">
                <code className="rounded-lg bg-surface-2 px-3 py-2 text-xs font-mono break-all">
                  {setupData.secret}
                </code>
                <button
                  type="button"
                  onClick={copySecret}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border-soft hover:bg-surface-2"
                  aria-label="Copiar secreto"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">
          2. Ingresá el código de 6 dígitos
        </h2>
        <p className="mt-1 text-xs text-muted">
          Después de escanear, tu app generará un código de 6 dígitos que cambia
          cada 30 segundos.
        </p>
        <div className="mt-4 flex gap-3 items-start">
          <Input
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="text-center tracking-[0.5em] font-mono text-lg"
            aria-label="Código de 6 dígitos"
          />
          <Button onClick={activate} disabled={busy || code.length !== 6}>
            {busy ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Activando…
              </>
            ) : (
              <>
                <ShieldCheck size={14} /> Activar
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
    </div>
  );
}
