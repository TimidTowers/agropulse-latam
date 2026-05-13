/**
 * AgroPulse — NextAuth v5 config edge-safe.
 *
 * Este archivo NO importa bcrypt ni nada de Node-only.
 * Se usa desde `proxy.ts` (edge runtime). El provider Credentials
 * con bcrypt vive en `lib/auth.ts`.
 */
import type { NextAuthConfig } from "next-auth";

const ADMIN_PREFIX = "/admin";
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/perfil",
  "/pedidos",
  "/checkout",
  "/2fa",
];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
      const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        return auth?.user?.role === "admin";
      }
      if (isProtected && !isLoggedIn) return false;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        const u = user as {
          id?: string;
          role?: string;
          country?: string;
          name?: string;
          email?: string;
        };
        if (u.id) token.id = u.id;
        if (u.role) token.role = u.role;
        if (u.country) token.country = u.country;
        if (u.name) token.name = u.name;
        if (u.email) token.email = u.email;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.role) session.user.role = token.role as never;
      if (token.country) session.user.country = token.country as never;
      if (token.name) session.user.name = token.name as string;
      return session;
    },
  },
  providers: [], // se completa en lib/auth.ts (node runtime)
  session: { strategy: "jwt" },
  trustHost: true,
} satisfies NextAuthConfig;
