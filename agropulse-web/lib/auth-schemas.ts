/**
 * Esquemas zod compartidos por client + server (formularios + endpoints).
 */
import { z } from "zod";

export const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{8,}$/;

export const COUNTRY_CODES = [
  "MX",
  "CR",
  "CO",
  "AR",
  "CL",
  "PE",
  "EC",
  "UY",
  "GT",
  "BR",
] as const;

export const loginSchema = z.object({
  email: z.string().email("Correo inválido").max(120),
  password: z.string().min(1, "La contraseña es obligatoria").max(120),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nombre demasiado corto")
      .max(80, "Nombre demasiado largo"),
    email: z.string().email("Correo inválido").max(120),
    password: z
      .string()
      .regex(
        STRONG_PASSWORD,
        "Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial",
      ),
    role: z.enum(["cliente", "productor"], {
      message: "Selecciona un rol válido",
    }),
    country: z.enum(COUNTRY_CODES, { message: "País inválido" }),
    phone: z.string().min(6, "Teléfono inválido").max(30),
    address: z.object({
      line1: z.string().min(3, "Dirección obligatoria").max(120),
      line2: z.string().max(120).optional().or(z.literal("")),
      city: z.string().min(2, "Ciudad obligatoria").max(80),
      state: z.string().min(2, "Estado/Departamento obligatorio").max(80),
      postalCode: z.string().min(2, "Código postal obligatorio").max(20),
    }),
    cooperativa: z.string().max(120).optional().or(z.literal("")),
    hectareas: z.coerce.number().min(0).max(100000).optional(),
    acceptTerms: z.literal(true, { message: "Debes aceptar los términos" }),
    marketingOptIn: z.boolean().optional(),
  })
  .refine(
    (d) =>
      d.role !== "productor" ||
      (typeof d.cooperativa === "string" && d.cooperativa.length >= 2),
    {
      message: "Cooperativa obligatoria para productores",
      path: ["cooperativa"],
    },
  );
export type SignupInput = z.infer<typeof signupSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().min(6).max(30).optional(),
  cooperativa: z.string().max(120).optional(),
  hectareas: z.coerce.number().min(0).max(100000).optional(),
  address: z
    .object({
      line1: z.string().min(3).max(120),
      line2: z.string().max(120).optional().or(z.literal("")),
      city: z.string().min(2).max(80),
      state: z.string().min(2).max(80),
      postalCode: z.string().min(2).max(20),
    })
    .optional(),
  marketingOptIn: z.boolean().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().regex(STRONG_PASSWORD, "Contraseña débil"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const twoFactorVerifySchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Código de 6 dígitos"),
});

export const twoFactorDisableSchema = z.object({
  password: z.string().min(1),
  code: z.string().regex(/^\d{6}$/, "Código de 6 dígitos"),
});
