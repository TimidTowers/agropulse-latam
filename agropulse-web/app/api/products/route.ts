import type { NextRequest } from "next/server";
import { filterProducts } from "@/lib/mock-data/products";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const productos = filterProducts({
    categoria: sp.get("categoria") ?? undefined,
    region: sp.get("region") ?? undefined,
    urgencia: sp.get("urgencia") ?? undefined,
    precioMax: sp.get("precioMax") ? Number(sp.get("precioMax")) : undefined,
    precioMin: sp.get("precioMin") ? Number(sp.get("precioMin")) : undefined,
    q: sp.get("q") ?? undefined,
  });
  return Response.json({
    ok: true,
    count: productos.length,
    products: productos,
  });
}
