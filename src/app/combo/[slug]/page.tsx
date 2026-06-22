import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { COMBOS, PROVINCES } from "@/lib/catalog";
import { getCombo, getCombos, getComboTiers } from "@/lib/api";
import { SceneImage } from "@/components/site/SceneImage";
import { PearlIcon } from "@/components/site/PearlIcon";
import { LeadButton } from "@/components/site/LeadButton";

const slugByCity = Object.fromEntries(PROVINCES.map((p) => [p.name, p.slug]));

// The shared Footer reads live page content at request time, so this route can't
// be fully static — render it dynamically (keeps generateStaticParams for paths).
export const revalidate = 300;

export function generateStaticParams() {
  return COMBOS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const combo = await getCombo(slug);
  if (!combo) return { title: "Combo du lịch" };
  return {
    title: `${combo.tier.toUpperCase()} - ${combo.hotelName}`,
    description: `Combo ${combo.tier} tại ${combo.hotelName}, ${combo.city} — ${combo.nights} đêm, giá từ ${combo.price}.`,
  };
}

export default async function ComboDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [combo, all, tiers] = await Promise.all([
    getCombo(slug),
    getCombos(),
    getComboTiers(),
  ]);
  if (!combo) notFound();

  const tier = tiers.find((t) => t.name === combo.tier);
  const citySlug = slugByCity[combo.city] ?? "";
  // Other combos at the same hotel (often different tier / nights / price).
  const related = all.filter(
    (c) => c.hotelName === combo.hotelName && c.slug !== combo.slug,
  );

  return (
    <main className="pb-24">
      {/* hero */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <SceneImage seed={`perlunas-place-${citySlug}`} alt={combo.city} w={2000} h={1100} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        </div>
        <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-12 text-paper sm:px-10">
          <div className="flex items-center gap-2.5">
            <PearlIcon tier={combo.tier} className="h-7 w-7" />
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/80">
              Combo {combo.tier}
            </p>
          </div>
          <h1 className="display mt-4 text-4xl sm:text-6xl">{combo.hotelName}</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-paper/75">
            {combo.stayType} · {combo.city} · {combo.nights} đêm
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[100rem] px-6 pt-12 sm:px-10">
        <Link
          href="/combo"
          className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tất cả combo
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          {/* left — what the package includes */}
          <div>
            {tier && (
              <>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
                  {tier.tagline}
                </p>
                <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-ink/70">
                  {tier.story}
                </p>

                <h2 className="display mt-12 text-2xl text-ink sm:text-3xl">Gói gồm có</h2>
                <ul className="mt-6 max-w-2xl space-y-3">
                  {tier.includes.map((it) => (
                    <li key={it} className="flex gap-3 text-ink/80">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-ink/50" />
                      <span className="leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 max-w-2xl text-sm leading-relaxed text-mute">
                  {tier.pearl}{" "}
                  <Link href="/combo/phan-loai" className="link-underline text-ink">
                    Tìm hiểu ba dòng ngọc trai
                  </Link>
                </p>
              </>
            )}
          </div>

          {/* right — price + CTA */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-[var(--line)] bg-paper-2 p-8">
              <p className="text-sm text-mute">Giá từ</p>
              <p className="mt-1 font-serif text-4xl text-ink">{combo.price}</p>
              <p className="mt-6 text-sm leading-relaxed text-ink/70">
                Lịch trình chi tiết sẽ được Perlunas may đo theo nhu cầu của bạn.
              </p>
              <LeadButton
                service={`${combo.tier.toUpperCase()} - ${combo.hotelName}`}
                className="mt-7 w-full justify-center"
              >
                Nhận tư vấn combo này
              </LeadButton>
            </div>
          </aside>
        </div>

        {/* other combos at this hotel */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-[var(--line)] pt-14">
            <h2 className="display text-2xl text-ink sm:text-3xl">
              Gói khác tại {combo.hotelName}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <Link key={c.slug} href={`/combo/${c.slug}`} className="group block">
                  <div className="flex items-center gap-2.5">
                    <PearlIcon tier={c.tier} className="h-5 w-5" />
                    <span className="text-[0.7rem] font-medium uppercase tracking-[0.15em] text-mute">
                      {c.tier} · {c.nights} đêm
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-lg leading-snug text-ink group-hover:underline group-hover:underline-offset-4">
                    {c.tier.toUpperCase()} - {c.hotelName} {c.nights} ĐÊM
                  </h3>
                  <p className="mt-1 text-sm text-ink/70">Giá từ {c.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
