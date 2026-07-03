/**
 * Server-side guard para todas las páginas bajo `/dashboard/*`.
 *
 * Reglas:
 *   - cliente   → redirige a `/pedidos`
 *   - logistica → redirige a `/pedidos`
 *   - admin     → redirige a `/admin`
 *   - productor → permitido
 *
 * Además registra un `auth.access_denied` en el audit log cuando un rol
 * NO autorizado intenta acceder, para que quede traza.
 *
 * Uso típico al inicio de un `page.tsx` server component:
 *
 *   const user = await requireProductorDashboard("/dashboard");
 *   // a partir de aquí: user.role === "productor" | "admin"
 */
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-helpers";
import { auditDb } from "./db/store";
import type { PublicUser } from "./db/types";

export async function requireProductorDashboard(
  path: string,
): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?from=${encodeURIComponent(path)}`);
  }
  if (user.role === "productor" || user.role === "admin") {
    return user;
  }

  // rol prohibido → registrar y redirigir
  await auditDb.add({
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: "auth.access_denied",
    resource: path,
    success: false,
    message: `Acceso denegado a ${path} para rol ${user.role} (${user.email})`,
    metadata: { path, role: user.role },
  });

  if (user.role === "cliente" || user.role === "logistica") {
    redirect("/pedidos");
  }
  redirect("/");
}
