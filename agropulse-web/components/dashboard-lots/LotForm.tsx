"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { resolveProductImage } from "@/lib/product-images";
import type { CountryCode } from "@/lib/countries";

const CATEGORIES = [
  "Hortalizas",
  "Frutas",
  "Lácteos",
  "Granos",
  "Carnes",
  "Café",
  "Cacao",
  "Especias",
  "Tubérculos",
] as const;

const UNITS = ["kg", "lb", "tonelada", "caja 5kg", "caja 10kg", "caja 18kg", "saco 50kg"] as const;

const CERTIFICATIONS = [
  "Orgánico",
  "GLOBALG.A.P.",
  "Rainforest",
  "Fair Trade",
  "USDA Organic",
  "EU Organic",
  "GMO-Free",
  "Comercio Justo",
];

const lotSchema = z.object({
  productName: z.string().min(3, "Mínimo 3 caracteres"),
  productSlug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  category: z.enum(CATEGORIES),
  region: z.string().min(1, "Selecciona una región"),
  quantity: z.number().positive("Debe ser mayor a 0"),
  unit: z.enum(UNITS),
  pricePerUnit: z.number().positive("Debe ser mayor a 0"),
  harvestDate: z.string().min(1, "Requerido"),
  vidaUtilDias: z.number().int().positive().max(365),
  certifications: z.array(z.string()),
  description: z.string().min(50, "Mínimo 50 caracteres"),
  imageUrl: z
    .string()
    .url("URL inválida")
    .or(z.literal("")),
  status: z.enum(["borrador", "activo"]),
});

type LotFormData = z.infer<typeof lotSchema>;

interface LotFormProps {
  mode: "create" | "edit";
  lotId?: string;
  initial?: Partial<LotFormData>;
  userCountry: CountryCode;
  cooperativa: string;
  productorName: string;
  regions: string[];
  currency: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function LotForm({
  mode,
  lotId,
  initial,
  userCountry,
  cooperativa,
  productorName,
  regions,
  currency,
}: LotFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LotFormData>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      productName: initial?.productName ?? "",
      productSlug: initial?.productSlug ?? "",
      category: (initial?.category as (typeof CATEGORIES)[number]) ?? "Frutas",
      region: initial?.region ?? regions[0] ?? "",
      quantity: initial?.quantity ?? 100,
      unit: (initial?.unit as (typeof UNITS)[number]) ?? "kg",
      pricePerUnit: initial?.pricePerUnit ?? 1000,
      harvestDate: initial?.harvestDate ?? today,
      vidaUtilDias: initial?.vidaUtilDias ?? 14,
      certifications: initial?.certifications ?? [],
      description: initial?.description ?? "",
      imageUrl: initial?.imageUrl ?? "",
      status: initial?.status ?? "activo",
    },
  });

  const productName = watch("productName");
  const imageUrl = watch("imageUrl");
  const category = watch("category");
  const certifications = watch("certifications") ?? [];

  // Imagen automática que asignará el API si el campo URL queda vacío:
  // resuelta por keywords del nombre + categoría (lib/product-images.ts).
  const suggestedImage =
    !imageUrl && productName.trim().length >= 3
      ? resolveProductImage(productName, category)
      : null;
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-generar slug cuando cambia el nombre y el campo slug está vacío
  useEffect(() => {
    const currentSlug = watch("productSlug");
    if (mode === "create" && productName && (!currentSlug || currentSlug === "")) {
      setValue("productSlug", slugify(productName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productName]);

  function toggleCert(cert: string) {
    const has = certifications.includes(cert);
    setValue(
      "certifications",
      has ? certifications.filter((c) => c !== cert) : [...certifications, cert],
    );
  }

  async function onSubmit(data: LotFormData) {
    setServerError(null);
    try {
      const url = mode === "create" ? "/api/lots" : `/api/lots/${lotId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.message ?? json.error ?? "Error al guardar");
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/lotes"), 1100);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-border-soft bg-surface p-6"
    >
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 flex items-center gap-2 text-sm text-emerald-900"
          >
            <CheckCircle2 size={16} />
            Lote guardado. Redirigiendo…
          </motion.div>
        )}
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-300 bg-red-50 p-3 flex items-center gap-2 text-sm text-red-900"
          >
            <AlertCircle size={16} />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <Field label="Nombre del producto" error={errors.productName?.message}>
        <Input placeholder="Ej. Aguacate Hass Premium" {...register("productName")} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Slug (URL)" error={errors.productSlug?.message}>
          <Input placeholder="aguacate-hass-premium" {...register("productSlug")} />
        </Field>
        <Field label="Categoría" error={errors.category?.message}>
          <Select {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label={`Región de origen (${userCountry})`} error={errors.region?.message}>
        <Select {...register("region")}>
          <option value="">Selecciona…</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Cantidad disponible" error={errors.quantity?.message}>
          <Input
            type="number"
            step="0.5"
            min="0"
            {...register("quantity", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Unidad" error={errors.unit?.message}>
          <Select {...register("unit")}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label={`Precio (${currency} por unidad)`}
          error={errors.pricePerUnit?.message}
        >
          <Input
            type="number"
            step="0.01"
            min="0"
            {...register("pricePerUnit", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Fecha de cosecha" error={errors.harvestDate?.message}>
          <Input type="date" {...register("harvestDate")} />
        </Field>
        <Field
          label="Vida útil (días desde cosecha)"
          error={errors.vidaUtilDias?.message}
        >
          <Input
            type="number"
            min="1"
            max="365"
            {...register("vidaUtilDias", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Certificaciones
        </label>
        <div className="flex flex-wrap gap-2">
          {CERTIFICATIONS.map((c) => {
            const active = certifications.includes(c);
            return (
              <button
                type="button"
                key={c}
                onClick={() => toggleCert(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                  active
                    ? "bg-brand text-white border-brand"
                    : "bg-surface border-border-soft text-muted hover:text-ink hover:border-brand/40"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Descripción" error={errors.description?.message}>
        <Textarea
          placeholder="Describe el producto, técnica de cultivo, sabor, certificaciones, recomendaciones de uso… (mín 50 caracteres)"
          rows={5}
          {...register("description")}
        />
      </Field>

      <Field label="URL de imagen (opcional)" error={errors.imageUrl?.message}>
        <Input
          type="url"
          placeholder="https://images.unsplash.com/... (déjalo vacío para asignación automática)"
          {...register("imageUrl")}
        />
      </Field>

      {imageUrl && (
        <div className="rounded-xl overflow-hidden border border-border-soft max-w-md aspect-video bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
        </div>
      )}
      {!imageUrl && suggestedImage && (
        <div className="max-w-md">
          <div className="rounded-xl overflow-hidden border border-border-soft aspect-video bg-surface-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={suggestedImage}
              alt={`Imagen automática sugerida para ${productName}`}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2 text-xs text-muted inline-flex items-center gap-1.5">
            <ImagePlus size={13} className="text-brand" />
            <span>
              <strong className="text-ink">Imagen automática sugerida</strong>{" "}
              según nombre y categoría. Puedes publicar sin URL: se asignará
              esta imagen.
            </span>
          </p>
        </div>
      )}
      {!imageUrl && !suggestedImage && (
        <div className="rounded-xl border border-dashed border-border-soft p-8 max-w-md grid place-items-center text-muted">
          <ImagePlus size={28} />
          <p className="text-xs mt-2 text-center">
            Escribe el nombre del producto para ver la imagen automática, o
            pega una URL propia para previsualizar.
          </p>
        </div>
      )}

      <Field label="Status">
        <Select {...register("status")}>
          <option value="activo">Activo (visible en marketplace)</option>
          <option value="borrador">Borrador (no visible)</option>
        </Select>
      </Field>

      <div className="rounded-xl bg-surface-2/40 border border-border-soft p-3 text-xs text-muted">
        Productor: <strong className="text-ink">{productorName}</strong> ·{" "}
        Cooperativa: <strong className="text-ink">{cooperativa || "—"}</strong> ·{" "}
        País: <strong className="text-ink">{userCountry}</strong>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-soft">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || success}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Save size={16} />
              {mode === "create" ? "Publicar lote" : "Guardar cambios"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
