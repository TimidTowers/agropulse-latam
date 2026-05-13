/**
 * Next.js 16 renamed `middleware.ts` → `proxy.ts`.
 *
 * Este archivo corre antes de cada request. Usa la config edge-safe
 * de NextAuth para verificar el JWT y autorizar rutas.
 */
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { pathname, search } = req.nextUrl;

  const PROTECTED = [
    "/dashboard",
    "/admin",
    "/perfil",
    "/pedidos",
    "/checkout",
    "/2fa",
  ];

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAdmin = pathname.startsWith("/admin");

  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("from", pathname + search);
    return NextResponse.redirect(url);
  }

  if (isAdmin && isLoggedIn && req.auth?.user?.role !== "admin") {
    const url = new URL("/", req.nextUrl);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Corre en todo salvo /api, _next y assets estáticos
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
