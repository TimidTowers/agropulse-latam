/**
 * GET /api/admin/users
 * Lista todos los usuarios. Solo admin.
 */
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { usersDb } from "@/lib/db/store";
import { toPublicUser } from "@/lib/db/types";

export async function GET() {
  try {
    await requireRole(["admin"]);
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const users = usersDb.list().map(toPublicUser);
  return NextResponse.json({ ok: true, users });
}
