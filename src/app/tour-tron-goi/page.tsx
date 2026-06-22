import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToursPaged, getTaxonomyNames } from "@/lib/api";
import { getPageContentMap, pc } from "@/lib/page-content";
import { SceneImage } from "@/components/site/SceneImage";
import { CatalogControls, Pagination } from "@/components/site/CatalogControls";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tour trọn gói",
  description:
    "Những hành trình du lịch trong nước được thiết kế sẵn, chỉ việc khởi hành.",
};

const PAGE_SIZE = 9;
const str = (v: string | string[] | undefined) =>
  typeof v === "string" && v.trim() ? v : undefined;

export default async function TourTronGoiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = {
    page: Number(str(sp.page)) || 1,
    pageSize: PAGE_SIZE,
    search: str(sp.search),
    region: str(sp.region),
  };

  const [result, map, regions] = await Promise.all([
    getToursPaged(params),
    getPageContentMap(),
    getTaxonomyNames("region"),
  ]);

  return (
    <main className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[100rem]">
        <header className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            {pc(map, "tourspage.eyebrow")}
          </p>
          <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
            {pc(map, "tourspage.hero.title")}
          </h1>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-ink/70">
            {pc(map, "tourspage.hero.intro")}
          </p>
        </header>

        <CatalogControls
          className="mt-12"
          searchPlaceholder="Tên tour hoặc vùng miền…"
          selects={[
            {
              param: "region",
              label: "Vùng miền",
              allLabel: "Tất cả vùng miền",
              options: regions.map((r) => ({ value: r, label: r })),
            },
          ]}
        />

        <p className="mt-8 text-sm text-mute">{result.total} tour</p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((t) => (
            <Link key={t.slug} href={`/tour/${t.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden">
                <SceneImage
                  seed={`perlunas-tour-${t.slug}`}
                  alt={t.name}
                  w={1000}
                  h={750}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                {t.region} · {t.nights}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{t.name}</h2>
              <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-ink/65">
                {t.teaser}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{t.price}</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                  Xem chi tiết
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {result.items.length === 0 && (
          <p className="mt-6 text-ink/60">Chưa có tour phù hợp. Bạn thử từ khóa khác nhé.</p>
        )}

        <Pagination page={result.page} total={result.total} pageSize={result.pageSize} />
      </div>
    </main>
  );
}
