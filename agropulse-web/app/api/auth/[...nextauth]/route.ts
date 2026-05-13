/**
 * NextAuth v5 — Route Handlers (App Router).
 * Maneja /api/auth/signin, /api/auth/signout, /api/auth/session, etc.
 */
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
