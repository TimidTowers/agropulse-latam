/**
 * AgroPulse — Supabase client singleton (SERVER-ONLY).
 *
 * IMPORTANTE: este módulo NO debe importarse desde client components ni desde
 * código edge (proxy.ts / auth.config.ts). Solo route handlers, server
 * components y libs server-side (lib/db/store.ts).
 *
 * Credenciales: SUPABASE_URL + SUPABASE_ANON_KEY en .env.local — sin prefijo
 * NEXT_PUBLIC_ a propósito, para que nunca lleguen al bundle del navegador.
 *
 * Si las envs faltan, getSupabase() devuelve null y la store cae al modo
 * in-memory (demo degradado pero funcional).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    client = null;
    return client;
  }
  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
