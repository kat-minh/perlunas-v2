import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { TOURS } from "@/lib/catalog";
import { SceneImage } from "@/components/site/SceneImage";
import { LeadButton } from "@/components/site/LeadButton";

export function generateStaticParams() {
  return TOURS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = TOURS.find((x) => x.slug === slug);
  return { title: t ? t.name : "Tour trọn gói" };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = TOURS.find((t) => t.slug === slug);
  if (!tour) notFound();

  return (
    <main className="pb-24">
      <section className="relative flex min-h-[64vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <SceneImage seed={`perlunas-tour-${tour.slug}`} alt={tour.name} w={2000} h={1100} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        </div>
        <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-12 text-paper sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/75">
            {tour.region} · {tour.nights}
          </p>
          <h1 className="display mt-4 max-w-3xl text-5xl sm:text-7xl">{tour.name}</h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-[100rem] gap-12 px-6 pt-16 sm:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="text-pretty text-lg leading-relaxed text-ink/80">{tour.teaser}</p>

          <h2 className="mt-12 font-serif text-2xl text-ink">Điểm nhấn hành trình</h2>
          <ul className="mt-5 space-y-3">
            {tour.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-ink/80">
                <Check className="mt-1 h-4 w-4 shrink-0 text-ink/50" />
                {h}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm leading-relaxed text-mute">
            Lịch trình chi tiết theo ngày sẽ được Perlunas gửi và điều chỉnh theo
            số khách, ngày đi và sở thích của bạn.
          </p>
        </div>

        {/* booking card */}
        <aside className="lg:col-span-5">
          <div className="border border-[var(--line)] bg-paper-2 p-8 lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.2em] text-mute">Giá trọn gói</p>
            <p className="mt-2 font-serif text-3xl text-ink">{tour.price}</p>
            <p className="mt-1 text-sm text-mute">/ khách · {tour.nights}</p>
            <p className="mt-5 text-sm leading-relaxed text-ink/65">
              Đã gồm di chuyển, lưu trú, ăn theo chương trình và hướng dẫn viên.
            </p>
            <LeadButton service={`Tour ${tour.name}`} className="mt-7 w-full justify-center">
              Nhận tư vấn và báo giá
            </LeadButton>
            <p className="mt-5 text-center text-xs text-mute">
              <Link href="/tour-tron-goi" className="link-underline">Xem các hành trình khác</Link>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
