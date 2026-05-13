"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper so we can use `dynamic({ ssr: false })`. This avoids
 * Recharts and EventSource initialization on the server, which would
 * otherwise produce hydration warnings.
 */
const IoTLive = dynamic(() => import("./IoTLive"), {
  ssr: false,
  loading: () => (
    <section className="relative border-y border-border-soft bg-surface">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 py-16 sm:py-20">
        <div className="rounded-3xl border border-border-soft bg-surface-2/30 p-8 h-[460px] animate-pulse" />
      </div>
    </section>
  ),
});

export function IoTLiveSection() {
  return <IoTLive />;
}
