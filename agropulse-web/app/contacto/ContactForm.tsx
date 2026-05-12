"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "loading" | "ok" | "error";

interface FormState {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  rol: string;
  hectareas: string;
  mensaje: string;
}

const initial: FormState = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  rol: "Productor",
  hectareas: "",
  mensaje: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.email.trim()) e.email = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email inválido";
    if (!form.empresa.trim()) e.empresa = "Requerido";
    if (!form.mensaje.trim()) e.mensaje = "Requerido";
    else if (form.mensaje.trim().length < 10)
      e.mensaje = "Mínimo 10 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("err");
      setStatus("ok");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
        <h3 className="mt-3 text-lg font-semibold text-emerald-900">
          ¡Mensaje recibido!
        </h3>
        <p className="mt-1.5 text-sm text-emerald-800">
          Te contactaremos por correo en menos de 24 horas hábiles.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-emerald-700 hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Nombre completo"
          name="nombre"
          required
          error={errors.nombre}
          value={form.nombre}
          onChange={(v) => setForm((s) => ({ ...s, nombre: v }))}
        />
        <Field
          label="Empresa / Productor"
          name="empresa"
          required
          error={errors.empresa}
          value={form.empresa}
          onChange={(v) => setForm((s) => ({ ...s, empresa: v }))}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Correo electrónico"
          name="email"
          type="email"
          required
          error={errors.email}
          value={form.email}
          onChange={(v) => setForm((s) => ({ ...s, email: v }))}
        />
        <Field
          label="Teléfono / WhatsApp"
          name="telefono"
          type="tel"
          value={form.telefono}
          onChange={(v) => setForm((s) => ({ ...s, telefono: v }))}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="rol"
            className="block text-xs font-medium text-muted mb-1.5"
          >
            ¿Cuál es tu rol? <span className="text-danger">*</span>
          </label>
          <Select
            id="rol"
            value={form.rol}
            onChange={(e) => setForm((s) => ({ ...s, rol: e.target.value }))}
          >
            <option>Productor</option>
            <option>Comprador (HORECA / Retail)</option>
            <option>Distribuidor / Agroindustria</option>
            <option>Inversionista</option>
            <option>Otro</option>
          </Select>
        </div>
        <Field
          label="Hectáreas o volumen aprox."
          name="hectareas"
          placeholder="ej. 50 ha / 100 ton/mes"
          value={form.hectareas}
          onChange={(v) => setForm((s) => ({ ...s, hectareas: v }))}
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="block text-xs font-medium text-muted mb-1.5"
        >
          ¿En qué podemos ayudarte? <span className="text-danger">*</span>
        </label>
        <Textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          placeholder="Cuéntanos sobre tu operación y qué buscas resolver…"
          value={form.mensaje}
          onChange={(e) => setForm((s) => ({ ...s, mensaje: e.target.value }))}
          aria-invalid={!!errors.mensaje}
          aria-describedby={errors.mensaje ? "mensaje-err" : undefined}
        />
        {errors.mensaje && (
          <p
            id="mensaje-err"
            className="mt-1 text-xs text-danger"
            role="alert"
          >
            {errors.mensaje}
          </p>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted max-w-sm">
          Al enviar aceptas nuestra política de privacidad. No compartimos tu
          información con terceros.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="min-w-[160px]"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              <Send size={14} />
              Enviar mensaje
            </>
          )}
        </Button>
      </div>

      {status === "error" && (
        <p className="text-sm text-danger" role="alert">
          Hubo un error. Intenta de nuevo en un momento.
        </p>
      )}
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  value,
  error,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-medium text-muted mb-1.5"
      >
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
      />
      {error && (
        <p id={`${name}-err`} className="mt-1 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
