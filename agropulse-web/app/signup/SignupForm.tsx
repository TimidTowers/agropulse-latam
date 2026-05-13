"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2, Tractor, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { signupSchema, type SignupInput } from "@/lib/auth-schemas";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema) as unknown as Resolver<SignupInput>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "cliente",
      country: "CR",
      phone: "",
      address: { line1: "", line2: "", city: "", state: "", postalCode: "" },
      cooperativa: "",
      hectareas: undefined,
      acceptTerms: undefined,
      marketingOptIn: false,
    },
  });

  const role = watch("role");
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(data: SignupInput) {
    setServerError(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as {
      ok: boolean;
      error?: string;
      issues?: Array<{ path: string; message: string }>;
    };
    if (!res.ok || !json.ok) {
      setServerError(json.error ?? "No se pudo crear la cuenta");
      return;
    }
    // Auto-login con NextAuth
    const signed = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (signed?.error) {
      setServerError(
        "Cuenta creada, pero falló el inicio de sesión automático. Inicia sesión manualmente.",
      );
      router.push("/login");
      return;
    }
    router.replace(data.role === "productor" ? "/dashboard" : "/marketplace");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-8 space-y-5"
      aria-label="Formulario de registro"
    >
      {/* Role tabs */}
      <fieldset className="grid grid-cols-2 gap-2 rounded-xl bg-surface-2 p-1">
        <legend className="sr-only">Tipo de cuenta</legend>
        {(
          [
            {
              v: "cliente",
              label: "Soy comprador",
              icon: ShoppingBag,
              desc: "Acceso al marketplace",
            },
            {
              v: "productor",
              label: "Soy productor",
              icon: Tractor,
              desc: "Dashboard y lotes",
            },
          ] as const
        ).map((r) => {
          const Icon = r.icon;
          const active = role === r.v;
          return (
            <button
              key={r.v}
              type="button"
              onClick={() => setValue("role", r.v)}
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
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="name" label="Nombre completo" error={errors.name?.message}>
          <Input id="name" autoComplete="name" {...register("name")} />
        </Field>
        <Field id="email" label="Correo electrónico" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </Field>
        <Field id="phone" label="Teléfono" error={errors.phone?.message}>
          <Input
            id="phone"
            autoComplete="tel"
            placeholder="+506 8888 8888"
            {...register("phone")}
          />
        </Field>
        <Field id="country" label="País" error={errors.country?.message}>
          <Select id="country" {...register("country")}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          id="password"
          label="Contraseña"
          error={errors.password?.message}
          hint="8+ caracteres, mayúscula, número y especial"
          className="sm:col-span-2"
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </Field>
      </div>

      <div className="rounded-xl border border-border-soft p-4 space-y-4">
        <h2 className="text-sm font-semibold text-ink">Dirección</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            id="line1"
            label="Dirección"
            error={errors.address?.line1?.message}
            className="sm:col-span-2"
          >
            <Input id="line1" {...register("address.line1")} />
          </Field>
          <Field
            id="line2"
            label="Detalle (opcional)"
            error={errors.address?.line2?.message}
            className="sm:col-span-2"
          >
            <Input id="line2" {...register("address.line2")} />
          </Field>
          <Field id="city" label="Ciudad" error={errors.address?.city?.message}>
            <Input id="city" {...register("address.city")} />
          </Field>
          <Field
            id="state"
            label="Estado / Departamento"
            error={errors.address?.state?.message}
          >
            <Input id="state" {...register("address.state")} />
          </Field>
          <Field
            id="postalCode"
            label="Código postal"
            error={errors.address?.postalCode?.message}
          >
            <Input id="postalCode" {...register("address.postalCode")} />
          </Field>
        </div>
      </div>

      {role === "productor" && (
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 space-y-4">
          <h2 className="text-sm font-semibold text-ink">
            Datos del productor
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              id="cooperativa"
              label="Cooperativa / Finca"
              error={errors.cooperativa?.message}
            >
              <Input id="cooperativa" {...register("cooperativa")} />
            </Field>
            <Field
              id="hectareas"
              label="Hectáreas cultivadas"
              error={errors.hectareas?.message}
            >
              <Input
                id="hectareas"
                type="number"
                min={0}
                step="0.1"
                {...register("hectareas")}
              />
            </Field>
          </div>
        </div>
      )}

      <div className="space-y-2 text-xs">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-brand"
            {...register("acceptTerms")}
          />
          <span className="text-muted">
            Acepto los{" "}
            <a
              href="/legal/terminos"
              target="_blank"
              className="underline text-brand"
            >
              términos y condiciones
            </a>{" "}
            y la{" "}
            <a
              href="/legal/privacidad"
              target="_blank"
              className="underline text-brand"
            >
              política de privacidad
            </a>
            .
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="ml-6 text-danger">{errors.acceptTerms.message}</p>
        )}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-brand"
            {...register("marketingOptIn")}
          />
          <span className="text-muted">
            Quiero recibir novedades de AgroPulse por correo (opcional).
          </span>
        </label>
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
            <Loader2 size={16} className="animate-spin" /> Creando cuenta…
          </>
        ) : (
          <>Crear cuenta gratis</>
        )}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-muted mb-1.5"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
    </div>
  );
}
