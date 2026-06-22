import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HOTELS, PROVINCES } from "@/lib/catalog";
import { getHotel } from "@/lib/api";
import { SceneImage } from "@/components/site/SceneImage";
import { LeadButton } from "@/components/site/LeadButton";

const citySlug = Object.fromEntries(PROVINCES.map((p) => [p.name, p.slug]));

// Shared Footer reads live content at request time → render dynamically (ISR).
export const revalidate = 300;

export function generateStaticParams() {
  return HOTELS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const h = await getHotel(slug);
  return h
    ? { title: `${h.name} — ${h.city}`, description: `${h.type} tại ${h.city}. Giá từ ${h.price}.` }
    : { title: "Khách sạn" };
}

/** Tailwind-v4 arbitrary-variant prose styling for the admin's rich-text HTML. */
const prose =
  "max-w-2xl text-pretty leading-relaxed text-ink/75 " +
  "[&_h2]:display [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-ink " +
  "[&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-ink " +
  "[&_p]:mt-4 [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 " +
  "[&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-ink/30 [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_img]:mt-6 [&_img]:w-full";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hotel = await getHotel(slug);
  if (!hotel) notFound();

  const provinceSlug = citySlug[hotel.city];

  return (
    <main className="pb-24">
      {/* hero */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <SceneImage seed={`perlunas-hotel-${hotel.slug}`} alt={hotel.name} w={2000} h={1100} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        </div>
        <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-12 text-paper sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/80">
            {hotel.type} · {hotel.city}
          </p>
          <h1 className="display mt-4 text-4xl sm:text-6xl">{hotel.name}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[100rem] px-6 pt-12 sm:px-10">
        <Link href="/khach-san" className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          Tất cả khách sạn
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          {/* description (rich text) */}
          <div
            className={prose}
            dangerouslySetInnerHTML={{ __html: hotel.desc || "" }}
          />

          {/* price + CTA */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-[var(--line)] bg-paper-2 p-8">
              <p className="text-sm text-mute">Giá tham khảo</p>
              <p className="mt-1 font-serif text-3xl text-ink">{hotel.price}</p>
              <p className="mt-6 text-sm leading-relaxed text-ink/70">
                Để lại thông tin, Perlunas báo giá và giữ phòng theo đúng ngày bạn cần.
              </p>
              <LeadButton service="Khách sạn" className="mt-7 w-full justify-center">
                Nhận tư vấn & báo giá
              </LeadButton>
              {provinceSlug && (
                <Link
                  href={`/combo?noi-den=${provinceSlug}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm text-ink link-underline"
                >
                  Xem combo ở {hotel.city}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
