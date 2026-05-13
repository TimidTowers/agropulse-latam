"use client";

import {
  useState,
  useEffect,
  useRef,
  useId,
  useCallback,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

/* ----------------------------------------------------------------- */
/* Helpers de unidad                                                  */
/* ----------------------------------------------------------------- */
function isWeightUnit(unit: string): boolean {
  const u = unit.toLowerCase();
  return (
    u.includes("kg") &&
    !u.includes("caja") &&
    !u.includes("bolsa") &&
    !u.includes("saco")
  );
}
function isToneladaUnit(unit: string): boolean {
  return unit.toLowerCase().includes("tonelada");
}
function isLbUnit(unit: string): boolean {
  const u = unit.toLowerCase();
  return u === "lb" || u.includes("libra");
}

/** Step según unidad. */
export function getStepFor(unit: string): number {
  if (isToneladaUnit(unit)) return 0.1;
  if (isWeightUnit(unit) || isLbUnit(unit)) return 0.5;
  return 1;
}

/** Mínimo según unidad. */
export function getMinFor(unit: string): number {
  if (isToneladaUnit(unit)) return 0.1;
  if (isWeightUnit(unit) || isLbUnit(unit)) return 0.5;
  return 1;
}

/** Decimales a mostrar según unidad. */
function decimalsFor(unit: string): number {
  if (isToneladaUnit(unit)) return 1;
  if (isWeightUnit(unit) || isLbUnit(unit)) return 1;
  return 0;
}

function formatQty(value: number, unit: string): string {
  const d = decimalsFor(unit);
  return value.toLocaleString("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: d,
  });
}

/** Redondea a múltiplos de step para evitar floats raros (2.4999999). */
function snapToStep(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

/* ----------------------------------------------------------------- */
/* Componente                                                         */
/* ----------------------------------------------------------------- */

export interface QuantityInputProps {
  /** Valor actual */
  value: number;
  /** Unidad ("kg", "tonelada", "caja 10kg", "lb", "saco"...) */
  unit: string;
  /** Stock máximo disponible */
  maxStock: number;
  /** Nombre del producto (para aria-label y toast) */
  productName: string;
  /** Disparado en cada cambio válido. Si va a 0, parent decide remover. */
  onChange: (qty: number) => void;
  /** Cuando se intenta exceder stock; útil para mostrar toast externo. */
  onExceedStock?: (max: number, unit: string) => void;
  /** Cuando llega a 0 o menor, parent suele llamar removeItem. */
  onRequestRemove?: () => void;
  /** Override de step/min */
  step?: number;
  min?: number;
}

export function QuantityInput({
  value,
  unit,
  maxStock,
  productName,
  onChange,
  onExceedStock,
  onRequestRemove,
  step: stepOverride,
  min: minOverride,
}: QuantityInputProps) {
  const step = stepOverride ?? getStepFor(unit);
  const min = minOverride ?? getMinFor(unit);
  const id = useId();
  const labelId = `qty-${id}`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Input controlado por string para permitir edición libre (vaciar antes de tipear)
  const [draft, setDraft] = useState<string>(() => formatQty(value, unit));

  // Sincroniza draft cuando value externo cambia (ej. otra UI cambia stock)
  useEffect(() => {
    setDraft(formatQty(value, unit));
  }, [value, unit]);

  const commit = useCallback(
    (raw: number) => {
      if (Number.isNaN(raw) || raw <= 0) {
        if (onRequestRemove) onRequestRemove();
        else onChange(0);
        return;
      }
      let next = snapToStep(raw, step);
      if (next < min) next = min;
      if (next > maxStock) {
        next = maxStock;
        onExceedStock?.(maxStock, unit);
      }
      // round a precisión de step
      next = Number(next.toFixed(decimalsFor(unit) + 2));
      onChange(next);
      setDraft(formatQty(next, unit));
    },
    [step, min, maxStock, onExceedStock, onChange, onRequestRemove, unit],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Permitir tipear libremente; commit en blur o Enter
    const v = e.target.value;
    setDraft(v);
  };

  const handleBlur = () => {
    const parsed = parseFloat(draft.replace(",", "."));
    commit(parsed);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const parsed = parseFloat(draft.replace(",", "."));
      commit(parsed);
      inputRef.current?.blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      commit(value + step);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      commit(value - step);
    }
  };

  const decrement = () => commit(value - step);
  const increment = () => commit(value + step);

  // Para animación: cambia con la "parte entera" para no flickerear cada decimal
  const motionKey = Math.floor(value);

  const atMax = value >= maxStock;
  const atMin = value <= min;

  return (
    <div className="w-full space-y-1.5">
      <span id={labelId} className="sr-only">
        Cantidad de {productName} en {unit}
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="inline-flex items-center rounded-xl border border-border-soft bg-surface overflow-hidden">
          <button
            type="button"
            onClick={decrement}
            disabled={atMin && (onRequestRemove === undefined)}
            aria-label={`Restar ${step} ${unit}`}
            className="grid h-9 w-9 place-items-center text-ink hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
          >
            <Minus size={14} />
          </button>
          <div className="relative h-9 w-[88px] border-x border-border-soft overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={motionKey}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.14 }}
                className="absolute inset-0 grid place-items-center pointer-events-none"
                aria-hidden="true"
              />
            </AnimatePresence>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={draft}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKey}
              aria-labelledby={labelId}
              aria-valuemin={min}
              aria-valuemax={maxStock}
              aria-valuenow={value}
              role="spinbutton"
              className="relative z-10 h-full w-full bg-transparent text-center text-sm font-semibold text-ink tabular-nums focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={increment}
            disabled={atMax}
            aria-label={`Sumar ${step} ${unit}`}
            className="grid h-9 w-9 place-items-center text-ink hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
          >
            <Plus size={14} />
          </button>
        </div>
        <p className="text-[11px] text-muted whitespace-nowrap">
          <span className="font-medium text-ink">{unit}</span> · Stock:{" "}
          <span className="tabular-nums">
            {maxStock.toLocaleString("es-CR")}
          </span>{" "}
          {unit}
        </p>
      </div>
      {atMax && (
        <p className="text-[11px] text-amber-700">
          Has alcanzado el stock máximo disponible.
        </p>
      )}
    </div>
  );
}
