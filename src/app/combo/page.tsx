import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCombosPaged, getComboTiers, getCities, getTaxonomyNames } from "@/lib/api";
import { getPageContentMap, pc } from "@/lib/page-content";
import { SceneImage } from "@/components/site/SceneImage";
import { PearlIcon } from "@/components/site/PearlIcon";
import { LeadButton } from "@/components/site/LeadButton";
import { CatalogControls, Pagination } from "@/components/site/CatalogControls";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Combo du lịch",
  description:
    "Combo trọn gói khắp Việt Nam theo ba chuẩn dịch vụ Akoya, Tahiti và South Sea.",
};

const PAGE_SIZE = 9;
const str = (v: string | string[] | undefined) =>
  typeof v === "string" && v.trim() ? v : undefined;

export default async function ComboPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // Option lists + slug map come from the API (admin-managed taxonomies).
  const [cityList, stayTypes, tiers, map] = await Promise.all([
    getCities(),
    getTaxonomyNames("stay-type"),
    getComboTiers(),
    getPageContentMap(),
  ]);
  const slugByCity = Object.fromEntries(cityList.map((c) => [c.name, c.slug]));
  // Support arriving from the homepage tiles via ?noi-den=<slug>.
  const cityFromSlug = cityList.find((c) => c.slug === str(sp["noi-den"]))?.name;

  const params = {
    page: Number(str(sp.page)) || 1,
    pageSize: PAGE_SIZE,
    search: str(sp.search),
    city: str(sp.city) ?? cityFromSlug,
    tier: str(sp.tier),
    stayType: str(sp.stayType),
  };

  const result = await getCombosPaged(params);

  return (
    <main className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[100rem]">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              {pc(map, "combopage.eyebrow")}
            </p>
            <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
              {pc(map, "combopage.hero.title")}
            </h1>
            <p className="mt-6 text-pretty leading-relaxed text-ink/70">
              {pc(map, "combopage.hero.intro")}
            </p>
          </div>
          <Link
            href="/combo/phan-loai"
            className="inline-flex shrink-0 items-center gap-2 rounded-[3px] border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Phân loại Combo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <CatalogControls
          className="mt-12"
          searchPlaceholder="Tên khách sạn hoặc nơi đến…"
          selects={[
            {
              param: "city",
              label: "Nơi đến",
              allLabel: "Tất cả nơi đến",
              options: cityList.map((c) => ({ value: c.name, label: c.name })),
            },
            {
              param: "stayType",
              label: "Loại hình",
              allLabel: "Tất cả loại hình",
              options: stayTypes.map((t) => ({ value: t, label: t })),
            },
            {
              param: "tier",
              label: "Phân loại",
              allLabel: "Tất cả phân loại",
              options: tiers.map((t) => ({ value: t.name, label: t.name })),
            },
          ]}
        />

        <p className="mt-8 text-sm text-mute">{result.total} combo</p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((c) => (
            <Link key={c.slug} href={`/combo/${c.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <SceneImage
                  seed={`perlunas-place-${slugByCity[c.city] ?? ""}`}
                  alt={c.hotelName}
                  w={900}
                  h={675}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <PearlIcon tier={c.tier} className="h-6 w-6" />
                  <span className="bg-ink/65 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.15em] text-paper backdrop-blur-sm">
                    {c.tier}
                  </span>
                </div>
                <span className="absolute right-3 top-3 bg-ink px-3 py-1.5 text-xs font-medium text-paper">
                  Giá từ {c.price}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-xl leading-snug text-ink group-hover:underline group-hover:underline-offset-4">
                {c.tier.toUpperCase()} - {c.hotelName} {c.nights} ĐÊM
              </h3>
              <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-mute">
                {c.stayType} · {c.city}
              </p>
            </Link>
          ))}
        </div>

        {result.items.length === 0 && (
          <p className="mt-6 text-ink/60">
            Chưa có combo phù hợp với bộ lọc này. Bạn thử bỏ bớt một tiêu chí nhé.
          </p>
        )}

        <Pagination page={result.page} total={result.total} pageSize={result.pageSize} />

        {/* CTA — "Chưa biết chọn combo nào?" */}
        <div className="mt-24 border-t border-[var(--line)] pt-14">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="display text-2xl text-ink sm:text-3xl">
                {pc(map, "combopage.cta.title")}
              </h2>
              <p className="mt-2 text-ink/70">{pc(map, "combopage.cta.body")}</p>
            </div>
            <LeadButton service="Combo du lịch">
              {pc(map, "combopage.cta.button")}
            </LeadButton>
          </div>
        </div>
      </div>
    </main>
  );
}
