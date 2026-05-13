import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getCountry } from "@/lib/countries";
import { lotsDb } from "@/lib/db/store";
import { LotForm } from "@/components/dashboard-lots/LotForm";

export const metadata: Metadata = {
  title: "Editar lote — AgroPulse",
};

export default async function EditLotPage(
  props: PageProps<"/dashboard/lotes/[id]">,
) {
  const user = await getCurrentUser();
  const { id } = await props.params;
  if (!user) redirect(`/login?from=/dashboard/lotes/${id}`);
  if (user.role !== "productor" && user.role !== "admin") {
    redirect("/dashboard");
  }

  const lot = lotsDb.findById(id);
  if (!lot) notFound();

  // permisos: dueño o admin
  if (user.role !== "admin" && lot.productorId !== user.id) {
    redirect("/dashboard/lotes");
  }

  const country = getCountry(lot.country);

  return (
    <Container className="py-10">
      <Link
        href="/dashboard/lotes"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-3"
      >
        <ArrowLeft size={14} /> Volver a mis lotes
      </Link>

      <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
        Editar lote
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
        {lot.productName}
      </h1>
      <p className="mt-2 text-muted">
        Actualiza cantidad, precio o detalles del lote.
      </p>

      <div className="mt-8 max-w-3xl">
        <LotForm
          mode="edit"
          lotId={lot.id}
          initial={{
            productName: lot.productName,
            productSlug: lot.productSlug,
            category: lot.category as never,
            region: lot.region,
            quantity: lot.quantity,
            unit: lot.unit as never,
            pricePerUnit: lot.pricePerUnit,
            harvestDate: lot.harvestDate.slice(0, 10),
            vidaUtilDias: Math.max(
              1,
              Math.round(
                (new Date(lot.expirationDate).getTime() -
                  new Date(lot.harvestDate).getTime()) /
                  86_400_000,
              ),
            ),
            certifications: lot.certifications,
            description: lot.description,
            imageUrl: lot.images[0] ?? "",
            status: lot.status === "borrador" ? "borrador" : "activo",
          }}
          userCountry={lot.country}
          cooperativa={lot.cooperativa}
          productorName={lot.productorName}
          regions={country.regions}
          currency={country.currency}
        />
      </div>
    </Container>
  );
}
