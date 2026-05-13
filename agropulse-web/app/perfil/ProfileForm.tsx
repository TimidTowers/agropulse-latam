"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import type { PublicUser } from "@/lib/db/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FormValues {
  name: string;
  phone: string;
  cooperativa?: string;
  hectareas?: number;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  marketingOptIn: boolean;
}

export function ProfileForm({ user }: { user: PublicUser }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      cooperativa: user.cooperativa ?? "",
      hectareas: user.hectareas,
      address: {
        line1: user.address?.line1 ?? "",
        line2: user.address?.line2 ?? "",
        city: user.address?.city ?? "",
        state: user.address?.state ?? "",
        postalCode: user.address?.postalCode ?? "",
      },
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      marketingOptIn: false,
    },
  });

  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  async function onSubmit(data: FormValues) {
    setMsg(null);
    const wantsPwChange =
      data.currentPassword || data.newPassword || data.confirmPassword;
    if (wantsPwChange && data.newPassword !== data.confirmPassword) {
      setMsg({ kind: "err", text: "Las contraseñas nuevas no coinciden" });
      return;
    }
    const payload: Record<string, unknown> = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      marketingOptIn: data.marketingOptIn,
    };
    if (user.role === "productor") {
      payload.cooperativa = data.cooperativa;
      payload.hectareas = data.hectareas;
    }
    if (wantsPwChange) {
      payload.currentPassword = data.currentPassword;
      payload.newPassword = data.newPassword;
      payload.confirmPassword = data.confirmPassword;
    }
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    if (!res.ok || !j.ok) {
      setMsg({ kind: "err", text: j.error ?? "Error al guardar" });
      return;
    }
    setMsg({ kind: "ok", text: "Perfil actualizado" });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
    >
      <section className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Datos personales</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Field id="name" label="Nombre completo" error={errors.name?.message}>
            <Input id="name" {...register("name", { required: true })} />
          </Field>
          <Field id="phone" label="Teléfono" error={errors.phone?.message}>
            <Input id="phone" {...register("phone")} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Dirección</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Field
            id="line1"
            label="Dirección"
            className="sm:col-span-2"
            error={errors.address?.line1?.message}
          >
            <Input id="line1" {...register("address.line1")} />
          </Field>
          <Field
            id="line2"
            label="Detalle"
            className="sm:col-span-2"
            error={errors.address?.line2?.message}
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
      </section>

      {user.role === "productor" && (
        <section className="rounded-2xl border border-brand/20 bg-brand/5 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">
            Datos de productor
          </h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <Field
              id="cooperativa"
              label="Cooperativa / Finca"
              error={errors.cooperativa?.message}
            >
              <Input id="cooperativa" {...register("cooperativa")} />
            </Field>
            <Field
              id="hectareas"
              label="Hectáreas"
              error={errors.hectareas?.message}
            >
              <Input
                id="hectareas"
                type="number"
                step="0.1"
                {...register("hectareas", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Cambiar contraseña</h2>
        <p className="mt-1 text-xs text-muted">
          Dejá los campos vacíos si no querés cambiarla.
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <Field id="currentPassword" label="Contraseña actual">
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...register("currentPassword")}
            />
          </Field>
          <Field id="newPassword" label="Nueva contraseña">
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...register("newPassword")}
            />
          </Field>
          <Field id="confirmPassword" label="Confirmar nueva">
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
          </Field>
        </div>
      </section>

      <label className="flex items-start gap-2 text-xs cursor-pointer text-muted">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-brand"
          {...register("marketingOptIn")}
        />
        Quiero recibir novedades por correo.
      </label>

      {msg && (
        <div
          role="alert"
          className={
            msg.kind === "ok"
              ? "rounded-lg bg-brand/10 px-3 py-2 text-xs text-brand-dark"
              : "rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger"
          }
        >
          {msg.text}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Guardando…
            </>
          ) : (
            <>
              <Save size={14} /> Guardar cambios
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut size={14} /> Cerrar sesión
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
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
      {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
    </div>
  );
}
