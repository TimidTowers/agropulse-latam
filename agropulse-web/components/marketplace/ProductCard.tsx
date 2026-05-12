import Link from "next/link";
import { MapPin, Clock, Package } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPriceByCode, getCountry } from "@/lib/countries";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

function urgenciaToBadge(u: Product["urgencia"]) {
  switch (u) {
    case "alta":
      return { variant: "danger" as const, label: "Vida útil corta" };
    case "media":
      return { variant: "warning" as const, label: "Vender pronto" };
    case "baja":
    default:
      return { variant: "success" as const, label: "Stock fresco" };
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const badge = urgenciaToBadge(product.urgencia);
  const country = getCountry(product.country);

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="group rounded-2xl overflow-hidden border border-border-soft bg-surface shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-brand/30 transition-all flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imagen}
          alt={product.nombre}
          className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <Badge variant="default" className="bg-white/90 backdrop-blur">
            {product.categoria}
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur border border-border-soft px-2 py-0.5 text-[10px] font-medium text-ink">
            <span aria-hidden="true">{country.flag}</span>
            {country.code}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-ink tracking-tight">
          {product.nombre}
        </h3>
        <p className="mt-0.5 text-xs text-muted">
          {product.productor.nombre}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} className="text-brand" />
            {product.productor.estado}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} className="text-brand" />
            {product.vidaUtilDias} días vida útil
          </span>
          <span className="inline-flex items-center gap-1">
            <Package size={12} className="text-brand" />
            {product.stock.toLocaleString(country.locale)} {product.unidad}
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            ★ {product.productor.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between pt-4 border-t border-border-soft">
          <div>
            <p className="text-xl font-semibold text-ink tracking-tight">
              {formatPriceByCode(product.precio, product.country)}
            </p>
            <p className="text-xs text-muted">por {product.unidad}</p>
          </div>
          <span className="text-sm font-medium text-brand group-hover:underline">
            Ver lote →
          </span>
        </div>
      </div>
    </Link>
  );
}
