import type { NextRequest } from "next/server";
import { getProductById } from "@/lib/mock-data/products";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/products/[id]">,
) {
  const { id } = await ctx.params;
  const p = getProductById(id);
  if (!p) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return Response.json({ ok: true, product: p });
}
