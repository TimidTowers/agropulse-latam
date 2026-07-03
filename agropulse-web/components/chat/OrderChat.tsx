"use client";

/**
 * OrderChat — mensajería comprador ↔ productor ↔ logística por pedido.
 *
 * - Carga inicial vía GET /api/messages?orderId=
 * - Refresco por POLLING cada 4s (pausado cuando la pestaña está oculta)
 * - Optimistic update al enviar + auto-scroll al fondo
 * - Enter envía · Shift+Enter inserta salto de línea
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import type { ChatMessage, UserRole } from "@/lib/db/types";

const POLL_MS = 4000;

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  productor: "Productor",
  cliente: "Cliente",
  logistica: "Logística",
};

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  productor: "bg-emerald-100 text-emerald-700",
  cliente: "bg-blue-100 text-blue-700",
  logistica: "bg-amber-100 text-amber-700",
  admin: "bg-gray-200 text-gray-600",
};

/** Hora relativa en español: "ahora", "hace 5 min", "hace 2 h", fecha corta. */
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  return new Date(iso).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface OrderChatProps {
  orderId: string;
}

export function OrderChat({ orderId }: OrderChatProps) {
  const { data: session } = useSession();
  const myId = session?.user?.id;
  const myRole = session?.user?.role;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevCountRef = useRef(0);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/messages?orderId=${encodeURIComponent(orderId)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = await res.json();
      if (!data.ok || !Array.isArray(data.messages)) return;
      const server: ChatMessage[] = data.messages;
      setMessages((prev) => {
        // Conserva los mensajes optimistas aún no confirmados por el server.
        const serverIds = new Set(server.map((m) => m.id));
        const pending = prev.filter(
          (m) => m.id.startsWith("optimistic-") && !serverIds.has(m.id),
        );
        return [...server, ...pending];
      });
      setLoaded(true);
    } catch {
      // silencioso — el polling reintenta
    }
  }, [orderId]);

  // Carga inicial + polling cada 4s (pausa cuando la pestaña está oculta)
  useEffect(() => {
    void fetchMessages();
    const interval = setInterval(() => {
      if (!document.hidden) void fetchMessages();
    }, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) void fetchMessages();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchMessages]);

  // Auto-scroll al fondo con mensajes nuevos (si estaba cerca del fondo)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (messages.length !== prevCountRef.current) {
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 160;
      const lastIsMine =
        messages.length > 0 &&
        messages[messages.length - 1].senderId === myId;
      if (nearBottom || lastIsMine || prevCountRef.current === 0) {
        el.scrollTop = el.scrollHeight;
      }
      prevCountRef.current = messages.length;
    }
  }, [messages, myId]);

  function autosize() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }

  async function send() {
    const body = draft.trim();
    if (!body || sending || !myId) return;
    setSending(true);
    setError(null);

    // Optimistic update
    const optimistic: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      orderId,
      senderId: myId,
      senderName: session?.user?.name ?? "Yo",
      senderRole: (myRole ?? "cliente") as UserRole,
      body,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    requestAnimationFrame(autosize);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, body }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "send_failed");
      }
      // Reemplaza el mensaje optimista por el confirmado
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? data.message : m)),
      );
    } catch {
      // Revierte el optimista y restaura el borrador
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setDraft(body);
      setError("No se pudo enviar el mensaje. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  const emptyHint =
    myRole === "cliente"
      ? "Inicia la conversación con el productor"
      : "Inicia la conversación con el comprador";

  return (
    <div className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border-soft px-5 py-3.5">
        <p className="text-sm font-semibold text-ink flex items-center gap-2">
          <MessageCircle size={15} className="text-brand" />
          Chat del pedido
        </p>
        <p className="text-[11px] text-muted inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          En línea (demo)
        </p>
      </div>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-4 py-4 space-y-3 bg-surface"
        aria-live="polite"
      >
        {!loaded ? (
          <div className="h-full grid place-items-center text-muted">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full grid place-items-center text-center px-6">
            <div>
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
                <MessageCircle size={18} />
              </div>
              <p className="text-sm text-muted">{emptyHint}</p>
              <p className="text-xs text-muted/70 mt-1">
                Los mensajes son visibles para todos los involucrados en el
                pedido.
              </p>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === myId;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                    mine
                      ? "bg-brand text-white rounded-br-md"
                      : "bg-surface-2 text-ink rounded-bl-md"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[11px] font-semibold ${
                        mine ? "text-white/90" : "text-ink"
                      }`}
                    >
                      {mine ? "Tú" : m.senderName}
                    </span>
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wide rounded-full px-1.5 py-0.5 ${
                        mine
                          ? "bg-white/20 text-white"
                          : ROLE_BADGE_CLASSES[m.senderRole]
                      }`}
                    >
                      {ROLE_LABELS[m.senderRole]}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {m.body}
                  </p>
                  <p
                    className={`mt-1 text-[10px] ${
                      mine ? "text-white/70" : "text-muted"
                    }`}
                  >
                    {timeAgo(m.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border-soft px-4 py-3">
        {error && (
          <p className="mb-2 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              autosize();
            }}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={2000}
            placeholder="Escribe un mensaje… (Enter envía, Shift+Enter salto)"
            className="flex-1 resize-none rounded-xl border border-border-soft bg-surface-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40"
            aria-label="Mensaje del chat"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={sending || !draft.trim()}
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-brand text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Enviar mensaje"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
