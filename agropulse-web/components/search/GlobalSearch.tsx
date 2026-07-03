"use client";

/**
 * GlobalSearch — command palette global (Ctrl/Cmd+K).
 *
 * - Listener global de teclado: Ctrl+K / Cmd+K abre-cierra, Escape cierra.
 * - Botón flotante discreto (abajo a la derecha) como acceso alternativo.
 * - Modal centrado con backdrop blur (framer-motion scale+fade).
 * - Debounce 250 ms → GET /api/search?q=
 * - Resultados agrupados por tipo con navegación por teclado
 *   (↑/↓ + Enter, aria-activedescendant) y click (router.push).
 * - Accesible: role=dialog aria-modal, focus trap simple, focus al input.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Package,
  PackageSearch,
  Trophy,
  FileText,
  CornerDownLeft,
  Loader2,
} from "lucide-react";
import { ProductImage } from "@/components/marketplace/ProductImage";
import type { SearchResult, SearchResultType } from "./search-types";

const TYPE_META: Record<
  SearchResultType,
  { label: string; Icon: typeof Package }
> = {
  producto: { label: "Productos", Icon: Package },
  lote: { label: "Lotes activos", Icon: PackageSearch },
  caso: { label: "Casos de éxito", Icon: Trophy },
  pagina: { label: "Páginas", Icon: FileText },
};

const QUICK_LINKS = [
  { label: "Marketplace", href: "/marketplace", Icon: Package },
  { label: "Planes", href: "/planes", Icon: FileText },
  { label: "Casos de éxito", href: "/casos-de-exito", Icon: Trophy },
];

const MIN_QUERY = 2;

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  // Atajo global Ctrl+K / Cmd+K (toggle).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Focus al input al abrir + bloquear scroll del body.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Debounce 250ms → fetch /api/search.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < MIN_QUERY) {
      setResults([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data: { ok: boolean; results: SearchResult[] } =
          await res.json();
        const next = data.ok && Array.isArray(data.results) ? data.results : [];
        setResults(next);
        setActiveIndex(next.length > 0 ? 0 : -1);
        setLoading(false);
      } catch {
        if (!ctrl.signal.aborted) {
          setResults([]);
          setActiveIndex(-1);
          setLoading(false);
        }
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, open]);

  // Mantiene la opción activa visible al navegar con flechas.
  useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`gs-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Grupos contiguos por tipo (la API ya devuelve agrupado); conserva el
  // índice plano de cada resultado para la navegación con flechas.
  const groups = useMemo(() => {
    const out: {
      type: SearchResultType;
      items: { result: SearchResult; flatIndex: number }[];
    }[] = [];
    results.forEach((result, flatIndex) => {
      const last = out[out.length - 1];
      if (last && last.type === result.type) {
        last.items.push({ result, flatIndex });
      } else {
        out.push({ type: result.type, items: [{ result, flatIndex }] });
      }
    });
    return out;
  }, [results]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length > 0)
        setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0)
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target =
        activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) go(target.href);
    }
  }

  // Focus trap simple: Tab cicla dentro del modal.
  function onDialogKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled])',
      ),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const showEmptyState = query.trim().length < MIN_QUERY;
  const showNoResults =
    !showEmptyState && !loading && results.length === 0;

  return (
    <>
      {/* Botón flotante discreto */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar en AgroPulse (Ctrl+K)"
        title="Buscar (Ctrl+K)"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/90 px-3.5 py-2.5 text-sm font-medium text-muted shadow-lg backdrop-blur transition-all hover:text-ink hover:shadow-xl hover:border-brand/40"
      >
        <Search size={16} aria-hidden="true" />
        <kbd className="hidden sm:inline rounded border border-border-soft bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
          Ctrl K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[120] bg-ink/40 backdrop-blur-sm"
            onClick={close}
          >
            <div className="flex min-h-full items-start justify-center p-4 pt-[12vh] sm:pt-[16vh]">
              <motion.div
                ref={dialogRef}
                initial={{ scale: 0.95, opacity: 0, y: -8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.97, opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                role="dialog"
                aria-modal="true"
                aria-label="Búsqueda global"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={onDialogKeyDown}
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-2xl"
              >
                {/* Input */}
                <div className="flex items-center gap-3 border-b border-border-soft px-4">
                  {loading ? (
                    <Loader2
                      size={20}
                      className="shrink-0 animate-spin text-brand"
                      aria-hidden="true"
                    />
                  ) : (
                    <Search
                      size={20}
                      className="shrink-0 text-muted"
                      aria-hidden="true"
                    />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    placeholder="Buscar productos, lotes, casos, páginas..."
                    role="combobox"
                    aria-expanded={results.length > 0}
                    aria-controls="gs-results"
                    aria-activedescendant={
                      activeIndex >= 0 ? `gs-option-${activeIndex}` : undefined
                    }
                    aria-autocomplete="list"
                    autoComplete="off"
                    spellCheck={false}
                    className="h-14 w-full bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
                  />
                  <kbd className="hidden sm:inline shrink-0 rounded border border-border-soft bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                    Esc
                  </kbd>
                </div>

                {/* Cuerpo */}
                <div
                  id="gs-results"
                  role="listbox"
                  aria-label="Resultados de búsqueda"
                  className="max-h-[50vh] overflow-y-auto overscroll-contain p-2"
                >
                  {/* Estado vacío: sugerencias rápidas */}
                  {showEmptyState && !loading && (
                    <div className="px-2 py-3">
                      <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted">
                        Sugerencias rápidas
                      </p>
                      <div className="mt-2 flex flex-col gap-1">
                        {QUICK_LINKS.map(({ label, href, Icon }) => (
                          <button
                            key={href}
                            type="button"
                            onClick={() => go(href)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-surface-2"
                          >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                              <Icon size={15} aria-hidden="true" />
                            </span>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skeleton de carga sutil */}
                  {loading && results.length === 0 && (
                    <div className="animate-pulse space-y-2 px-2 py-3" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 px-2 py-1.5">
                          <div className="h-9 w-9 rounded-lg bg-surface-2" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-3 w-2/5 rounded bg-surface-2" />
                            <div className="h-2.5 w-3/5 rounded bg-surface-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sin resultados */}
                  {showNoResults && (
                    <div className="px-4 py-10 text-center">
                      <PackageSearch
                        size={28}
                        className="mx-auto text-muted/60"
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-sm font-medium text-ink">
                        Sin resultados para «{query.trim()}»
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Prueba con otro producto, productor, región o página.
                      </p>
                    </div>
                  )}

                  {/* Resultados agrupados por tipo */}
                  {groups.map(({ type, items }) => {
                    const { label, Icon } = TYPE_META[type];
                    return (
                      <div key={type} className="mb-1">
                        <p
                          className="flex items-center gap-1.5 px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted"
                          aria-hidden="true"
                        >
                          <Icon size={12} />
                          {label}
                        </p>
                        {items.map(({ result, flatIndex }) => {
                          const active = flatIndex === activeIndex;
                          return (
                            <button
                              key={`${result.type}-${result.id}`}
                              type="button"
                              id={`gs-option-${flatIndex}`}
                              role="option"
                              aria-selected={active}
                              onClick={() => go(result.href)}
                              onMouseMove={() => setActiveIndex(flatIndex)}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                                active ? "bg-brand/10" : "hover:bg-surface-2"
                              }`}
                            >
                              {result.image ? (
                                <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                                  <ProductImage
                                    src={result.image}
                                    alt=""
                                    productKey={result.id}
                                    width={36}
                                    height={36}
                                    className="h-full w-full object-cover"
                                  />
                                </span>
                              ) : (
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
                                  <Icon size={16} aria-hidden="true" />
                                </span>
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-ink">
                                  {result.flag && (
                                    <span className="mr-1.5" aria-hidden="true">
                                      {result.flag}
                                    </span>
                                  )}
                                  {result.title}
                                </span>
                                <span className="block truncate text-xs text-muted">
                                  {result.subtitle}
                                </span>
                              </span>
                              {active && (
                                <CornerDownLeft
                                  size={14}
                                  className="shrink-0 text-muted"
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Footer: hints de teclado */}
                <div className="flex items-center gap-4 border-t border-border-soft bg-surface-2/40 px-4 py-2.5 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-border-soft bg-surface px-1 py-0.5 font-semibold">
                      ↑↓
                    </kbd>
                    navegar
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-border-soft bg-surface px-1 py-0.5 font-semibold">
                      Enter
                    </kbd>
                    abrir
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-border-soft bg-surface px-1 py-0.5 font-semibold">
                      Esc
                    </kbd>
                    cerrar
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
