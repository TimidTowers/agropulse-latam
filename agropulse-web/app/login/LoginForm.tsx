"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginInput } from "@/lib/auth-schemas";
import { USER_CREDENTIALS_HINT } from "@/lib/db/seed";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginInput>,
    defaultValues: { email: "", password: "" },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  function prefill(email: string, password: string) {
    setValue("email", email);
    setValue("password", password);
    setServerError(null);
  }

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (!res || res.error) {
      if (res?.error === "CredentialsSignin") {
        setServerError(
          "Credenciales incorrectas. Tras 5 intentos fallidos la cuenta queda bloqueada 15 minutos.",
        );
      } else {
        setServerError(
          res?.error ??
            "No se pudo iniciar sesión. Revisa tu correo o contraseña.",
        );
      }
      return;
    }
    router.replace(from);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
        aria-label="Iniciar sesión"
      >
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
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-muted"
            >
              Contraseña
            </label>
            <span className="text-xs text-muted inline-flex items-center gap-1">
              <ShieldCheck size={12} /> Conexión segura
            </span>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <div
            role="alert"
            className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger border border-danger/20"
          >
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Entrando…
            </>
          ) : (
            <>Iniciar sesión</>
          )}
        </Button>

        <p className="text-[11px] text-muted text-center">
          Al continuar aceptas nuestros{" "}
          <a href="/legal/terminos" className="underline">
            Términos
          </a>{" "}
          y{" "}
          <a href="/legal/privacidad" className="underline">
            Política de privacidad
          </a>
          .
        </p>
      </form>

      <div className="rounded-2xl border border-border-soft bg-surface-2 p-4">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound size={14} className="text-brand" />
          <h2 className="text-sm font-semibold text-ink">Cuentas demo</h2>
        </div>
        <p className="text-[11px] text-muted mb-3">
          Click en cualquier cuenta para precargar las credenciales.
        </p>
        <ul className="space-y-1.5">
          {USER_CREDENTIALS_HINT.map((c) => (
            <li key={c.email}>
              <button
                type="button"
                onClick={() => prefill(c.email, c.password)}
                className="w-full flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-left text-xs hover:bg-brand/5 border border-border-soft transition-colors"
              >
                <span className="flex flex-col">
                  <span className="font-medium text-ink">{c.email}</span>
                  <span className="text-muted text-[10px]">{c.role}</span>
                </span>
                <span className="text-brand font-semibold">Probar</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
