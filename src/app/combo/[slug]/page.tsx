import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { PROVINCES, TIERS } from "@/lib/catalog";
import { SceneImage } from "@/components/site/SceneImage";
import { LeadButton } from "@/components/site/LeadButton";

const TIER_PRICE = ["từ 3.500.000đ", "từ 5.900.000đ", "từ 9.500.000đ"];

export function generateStaticParams() {
  return PROVINCES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PROVINCES.find((x) => x.slug === slug);
  return { title: p ? `Combo ${p.name}` : "Combo du lịch" };
}

export default async function ProvinceComboPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const province = PROVINCES.find((p) => p.slug === slug);
  if (!province) notFound();

  return (
    <main className="pb-24">
      {/* hero */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <SceneImage seed={`perlunas-place-${province.slug}`} alt={province.name} w={2000} h={1100} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        </div>
        <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-12 text-paper sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/75">
            Combo du lịch
          </p>
          <h1 className="display mt-4 text-5xl sm:text-7xl">{province.name}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[100rem] px-6 pt-16 sm:px-10">
        <p className="max-w-2xl text-pretty leading-relaxed text-ink/70">
          Ba gói combo cho hành trình {province.name}, theo mức độ trải nghiệm bạn
          mong muốn. Giá dưới đây là mức khởi điểm cho mỗi khách, lịch trình chi
          tiết sẽ được Perlunas may đo theo nhu cầu của bạn.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <article
              key={t.name}
              className="flex flex-col border border-[var(--line)] bg-paper-2 p-8"
            >
              <h2 className="font-serif text-3xl text-ink">{t.name}</h2>
              <p className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-mute">
                {t.tagline}
              </p>
              <p className="mt-5 text-sm font-medium text-ink">{TIER_PRICE[i]} / khách</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {t.includes.map((it) => (
                  <li key={it} className="flex gap-2.5 text-sm text-ink/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink/50" />
                    {it}
                  </li>
                ))}
              </ul>
              <LeadButton
                service={`Combo ${province.name} - ${t.name}`}
                className="mt-8 justify-center"
              >
                Chọn gói {t.name}
              </LeadButton>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-mute">
          <Link href="/combo" className="link-underline">Vì sao chia theo ba dòng ngọc trai?</Link>
        </p>
      </div>
    </main>
  );
}
