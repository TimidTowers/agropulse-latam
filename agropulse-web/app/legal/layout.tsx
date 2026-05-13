import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] py-12">
        <Container>
          <article className="mx-auto max-w-3xl text-sm leading-relaxed text-muted [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-ink [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:text-ink [&_a]:text-brand [&_a]:underline [&_a:hover]:text-brand-dark [&_table]:w-full [&_table]:text-xs [&_table]:my-4 [&_th]:bg-surface-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink [&_td]:px-3 [&_td]:py-2 [&_td]:border-t [&_td]:border-border-soft">
            {children}
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
