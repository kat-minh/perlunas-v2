import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PROVINCES } from "@/lib/catalog";
import { getTour, getHotels } from "@/lib/api";
import { SceneImage } from "@/components/site/SceneImage";
import { LeadButton } from "@/components/site/LeadButton";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTour(slug);
  return { title: t ? t.name : "Tour trọn gói" };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  const hotels = await getHotels();

  // Destination(s) of this tour → suggest hotels there (all stay types).
  const stayProvinces = tour.stays
    .map((s) => PROVINCES.find((p) => p.slug === s))
    .filter((p): p is (typeof PROVINCES)[number] => Boolean(p));
  const stayNames = stayProvinces.map((p) => p.name).join(" & ");
  const suggestedHotels = hotels
    .filter((h) => stayProvinces.some((p) => p.name === h.city))
    .slice(0, 3);

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

      {/* Gợi ý lưu trú tại điểm đến của tour (đủ mọi loại hình) */}
      {stayProvinces.length > 0 && (
        <section className="mx-auto mt-20 max-w-[100rem] border-t border-[var(--line)] px-6 pt-14 sm:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              Gợi ý lưu trú
            </p>
            <h2 className="display mt-5 text-3xl text-ink sm:text-4xl">
              Ở lại trọn vẹn tại {stayNames}.
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-ink/70">
              Sau hành trình, chọn cho mình một chỗ nghỉ ưng ý — đủ mọi loại hình
              lưu trú — ngay tại {stayNames}.
            </p>
          </div>

          {suggestedHotels.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
              {suggestedHotels.map((h) => (
                <Link
                  key={h.slug}
                  href={`/khach-san/${h.slug}`}
                  className="group block"
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <SceneImage
                      seed={`perlunas-hotel-${h.slug}`}
                      alt={h.name}
                      w={800}
                      h={533}
                      className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-4 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                    {h.type} · {h.city}
                  </p>
                  <h3 className="mt-1.5 font-serif text-xl text-ink">{h.name}</h3>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {stayProvinces.map((p) => (
              <Link
                key={p.slug}
                href={`/khach-san?noi-den=${p.slug}`}
                className="btn-ink inline-flex items-center gap-2 rounded-[3px] px-7 py-3.5 text-sm font-medium"
              >
                Khách sạn ở {p.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
