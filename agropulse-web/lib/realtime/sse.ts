/**
 * AgroPulse — Server-Sent Events (SSE) helper for Route Handlers.
 *
 * Vercel serverless functions have a ~10s timeout in hobby tier. To stay within
 * that limit while giving the perception of a continuous stream, we cap each
 * stream at ~9s and rely on the EventSource auto-reconnect behavior on the
 * client. Each "session" is a short-lived burst of ticks.
 */

export interface SseOptions {
  /** Max duration of the stream in ms. Default 9000 (under Vercel's 10s limit). */
  maxDurationMs?: number;
  /** Heartbeat comment interval in ms to keep proxies alive. Default 15000. */
  heartbeatMs?: number;
}

/**
 * Crea un ReadableStream para Server-Sent Events.
 *
 * El `produce` callback recibe `send(event, data)` y `close()`. El stream se
 * cerrará automáticamente al alcanzar `maxDurationMs`, o cuando `produce`
 * resuelva.
 */
export function createSseStream<T>(
  produce: (
    send: (event: string, data: T) => void,
    close: () => void,
  ) => Promise<void> | void,
  options: SseOptions = {},
): Response {
  const maxDuration = options.maxDurationMs ?? 9000;
  const heartbeat = options.heartbeatMs ?? 15000;
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: T) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`event: ${event}\n`));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          /* controller closed */
        }
      };

      const close = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      const timeout = setTimeout(close, maxDuration);
      const hb = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          /* closed */
        }
      }, heartbeat);

      try {
        await produce(send, close);
      } catch (err) {
        // Never let producer errors bring down the function — just close.
        console.error("[sse] producer error:", err);
      } finally {
        clearTimeout(timeout);
        clearInterval(hb);
        close();
      }
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

/** Sleep helper for stream producers. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
