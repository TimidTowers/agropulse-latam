/**
 * Augment NextAuth v5 types con los campos AgroPulse.
 */
import type { UserRole } from "@/lib/db/types";
import type { CountryCode } from "@/lib/countries";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      country: CountryCode;
    };
  }
  interface User {
    id?: string;
    role?: UserRole;
    country?: CountryCode;
    name?: string | null;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    country?: CountryCode;
  }
}
