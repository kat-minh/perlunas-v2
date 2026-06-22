import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHotelsPaged, getCities, getTaxonomyNames } from "@/lib/api";
import { getPageContentMap, pc } from "@/lib/page-content";
import { stripHtml } from "@/lib/text";
import { SceneImage } from "@/components/site/SceneImage";
import { CatalogControls, Pagination } from "@/components/site/CatalogControls";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Khách sạn",
  description:
    "Chỗ nghỉ tuyển chọn trên khắp Việt Nam — resort, boutique, retreat và wellness.",
};

const PAGE_SIZE = 9;
const str = (v: string | string[] | undefined) =>
  typeof v === "string" && v.trim() ? v : undefined;

export default async function KhachSanPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const [cityList, types, map] = await Promise.all([
    getCities(),
    getTaxonomyNames("stay-type"),
    getPageContentMap(),
  ]);
  const cityFromSlug = cityList.find((c) => c.slug === str(sp["noi-den"]))?.name;

  const params = {
    page: Number(str(sp.page)) || 1,
    pageSize: PAGE_SIZE,
    search: str(sp.search),
    city: str(sp.city) ?? cityFromSlug,
    type: str(sp.type),
  };

  const result = await getHotelsPaged(params);

  return (
    <main className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[100rem]">
        <header className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            {pc(map, "hotelspage.eyebrow")}
          </p>
          <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
            {pc(map, "hotelspage.hero.title")}
          </h1>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-ink/70">
            {pc(map, "hotelspage.hero.intro")}
          </p>
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
              param: "type",
              label: "Loại hình",
              allLabel: "Tất cả loại hình",
              options: types.map((t) => ({ value: t, label: t })),
            },
          ]}
        />

        <p className="mt-8 text-sm text-mute">{result.total} chỗ nghỉ</p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {result.items.map((h) => (
            <Link key={h.slug} href={`/khach-san/${h.slug}`} className="group block">
              <div className="relative aspect-[3/2] overflow-hidden">
                <SceneImage
                  seed={`perlunas-hotel-${h.slug}`}
                  alt={h.name}
                  w={1000}
                  h={667}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute right-3 top-3 bg-ink px-3 py-1.5 text-xs font-medium text-paper">
                  Từ {h.price}
                </span>
              </div>
              <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                {h.type} · {h.city}
              </p>
              <h3 className="mt-2 font-serif text-2xl text-ink group-hover:underline group-hover:underline-offset-4">{h.name}</h3>
              <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-ink/65">
                {stripHtml(h.desc, 120)}
              </p>
            </Link>
          ))}
        </div>

        {result.items.length === 0 && (
          <p className="mt-6 text-ink/60">
            Chưa có chỗ nghỉ phù hợp với bộ lọc này. Bạn thử bỏ bớt một tiêu chí nhé.
          </p>
        )}

        <Pagination page={result.page} total={result.total} pageSize={result.pageSize} />

        {/* upsell to Combo */}
        <div className="mt-24 border-t border-[var(--line)] pt-14">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              {pc(map, "hotelspage.upsell.eyebrow")}
            </p>
            <h2 className="display mt-5 text-3xl text-ink sm:text-4xl">
              {pc(map, "hotelspage.upsell.title")}
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-ink/70">
              {pc(map, "hotelspage.upsell.body")}
            </p>
            <Link
              href="/combo"
              className="btn-ink mt-7 inline-flex items-center gap-2 rounded-[3px] px-7 py-3.5 text-sm font-medium"
            >
              {pc(map, "hotelspage.upsell.button")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
