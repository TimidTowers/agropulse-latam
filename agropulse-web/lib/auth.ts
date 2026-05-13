/**
 * AgroPulse — NextAuth v5 instance (node runtime).
 *
 * Aquí cargamos el Credentials provider con bcrypt. Otros subagentes
 * deben importar `auth`, `signIn`, `signOut` desde aquí.
 *
 * Exportaciones públicas (contract):
 *  - `auth()`  → obtiene la sesión en server components / route handlers
 *  - `signIn`  → server action para iniciar sesión
 *  - `signOut` → server action para cerrar sesión
 *  - `handlers` → { GET, POST } montados en /api/auth/[...nextauth]/route.ts
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { authConfig } from "../auth.config";
import { usersDb, authAttemptsDb, auditDb } from "./db/store";
import { toPublicUser } from "./db/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        // 1. Rate limit: si está bloqueado, rechazar inmediatamente
        const locked = authAttemptsDb.isLocked(email);
        if (locked.locked) {
          auditDb.add({
            userEmail: email,
            action: "auth.locked",
            success: false,
            message: `Intento de login en cuenta bloqueada: ${email}`,
            metadata: { lockedUntil: locked.until },
          });
          return null;
        }

        // 2. Buscar usuario
        const user = usersDb.findByEmail(email);
        if (!user) {
          authAttemptsDb.registerFailure(email);
          auditDb.add({
            userEmail: email,
            action: "auth.login_failed",
            success: false,
            message: `Email no registrado: ${email}`,
          });
          return null;
        }

        // 3. Verificar password
        const ok = await compare(password, user.passwordHash);
        if (!ok) {
          const r = authAttemptsDb.registerFailure(email);
          auditDb.add({
            userId: user.id,
            userEmail: email,
            userRole: user.role,
            action: r.locked ? "auth.locked" : "auth.login_failed",
            success: false,
            message: r.locked
              ? `Cuenta bloqueada tras ${r.attempts} intentos fallidos`
              : `Credenciales inválidas (intento ${r.attempts})`,
            metadata: { attempts: r.attempts, lockedUntil: r.until },
          });
          return null;
        }

        // 4. Éxito — reset rate limit + audit + lastLogin
        authAttemptsDb.reset(email);
        usersDb.update(user.id, { lastLoginAt: new Date().toISOString() });
        auditDb.add({
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          action: "auth.login",
          success: true,
          message: `Login exitoso de ${user.email}`,
        });

        const pub = toPublicUser(user);
        return {
          id: pub.id,
          email: pub.email,
          name: pub.name,
          role: pub.role,
          country: pub.country,
        };
      },
    }),
  ],
});
