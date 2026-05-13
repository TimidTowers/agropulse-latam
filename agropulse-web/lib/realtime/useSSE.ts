"use client";

import { useEffect, useRef, useState } from "react";

export interface UseSseResult<T> {
  /** Last data received from the stream, or null until first event. */
  data: T | null;
  /** True while the EventSource is open. */
  connected: boolean;
}

/**
 * React hook that connects to a Server-Sent Events endpoint and exposes
 * the last received payload. Auto-reconnects on error after 1s.
 *
 * Pass `null` as `url` to disable the hook (no connection).
 */
export function useSSE<T>(
  url: string | null,
  eventName = "tick",
): UseSseResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!url) return;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        if (!cancelled) setConnected(true);
      };

      es.addEventListener(eventName, (e: MessageEvent) => {
        try {
          setData(JSON.parse(e.data) as T);
        } catch {
          /* malformed payload */
        }
      });

      es.onerror = () => {
        if (cancelled) return;
        setConnected(false);
        try {
          es.close();
        } catch {
          /* ignore */
        }
        // reconnect after a short backoff
        reconnectTimeout = setTimeout(connect, 1000);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      try {
        esRef.current?.close();
      } catch {
        /* ignore */
      }
      setConnected(false);
    };
  }, [url, eventName]);

  return { data, connected };
}
