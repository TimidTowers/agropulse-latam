import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { requireProductorDashboard } from "@/lib/dashboard-guard";
import { getCountry } from "@/lib/countries";
import { LotForm } from "@/components/dashboard-lots/LotForm";

export const metadata: Metadata = {
  title: "Nuevo lote — AgroPulse",
};

export default async function NewLotPage() {
  const user = await requireProductorDashboard("/dashboard/lotes/nuevo");
  const country = getCountry(user.country);

  return (
    <Container className="py-10">
      <Link
        href="/dashboard/lotes"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-3"
      >
        <ArrowLeft size={14} /> Volver a mis lotes
      </Link>

      <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
        Crear lote
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
        Publica un nuevo lote
      </h1>
      <p className="mt-2 text-muted max-w-2xl">
        Cada lote refleja una cosecha o producción específica. Indica
        cantidad, precio y certificaciones para que los compradores de{" "}
        {country.flag} {country.name} puedan encontrarte en el marketplace.
      </p>

      <div className="mt-8 max-w-3xl">
        <LotForm
          mode="create"
          userCountry={user.country}
          cooperativa={user.cooperativa ?? ""}
          productorName={user.name}
          regions={country.regions}
          currency={country.currency}
        />
      </div>
    </Container>
  );
}
