import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getHotelsPaged, getCities, getTaxonomyNames } from "@/lib/api";
import { getPageContentMap, pc } from "@/lib/page-content";
import { stripHtml } from "@/lib/text";
import { SceneImage } from "@/components/site/SceneImage";
import { PageHero } from "@/components/site/PageHero";
import { PerlunasMark } from "@/components/site/PerlunasMark";
import { CatalogControls, Pagination } from "@/components/site/CatalogControls";
import { PURPOSES, hotelPurposes, purposeColor } from "@/lib/purposes";

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
    purpose: str(sp.purpose),
  };

  const result = await getHotelsPaged(params);

  return (
    <main className="pb-24">
      <PageHero
        eyebrow={pc(map, "hotelspage.eyebrow")}
        title={pc(map, "hotelspage.hero.title")}
        intro={pc(map, "hotelspage.hero.intro")}
        image={pc(map, "hotelspage.hero.image")}
        alt="Lưu trú cao cấp Perlunas"
      />
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        {/* editorial ngắn: vì sao quan trọng + tiêu chuẩn chọn đối tác */}
        <section className="grid gap-10 pt-14 sm:pt-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="display text-2xl text-ink sm:text-3xl">
              Tầm quan trọng của nơi lưu trú cho một chuyến đi
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-ink/70">
              Một chỗ nghỉ đúng giúp bạn nạp lại năng lượng và cảm nhận trọn vẹn không
              khí của điểm đến — Perlunas xem đây là một phần quan trọng của trải nghiệm.
            </p>
          </div>

          <div>
            <h2 className="display text-2xl text-ink sm:text-3xl">
              Tiêu chuẩn chọn đối tác lưu trú cao cấp
            </h2>
            <ul className="mt-4 space-y-2.5">
              {[
                "Vị trí thuận tiện, an toàn.",
                "Chất lượng và tiện nghi đạt chuẩn 4 - 5 sao.",
                "Dịch vụ tận tâm, không gian tinh tế.",
              ].map((c) => (
                <li key={c} className="flex gap-3 text-pretty leading-relaxed text-ink/75">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-ink/50" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CatalogControls
          className="mt-16"
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
            {
              param: "purpose",
              label: "Mục đích chuyến đi",
              allLabel: "Tất cả mục đích",
              options: PURPOSES.map((p) => ({ value: p.key, label: p.key })),
            },
          ]}
        />

        {/* chú thích màu logo PERLUNAS theo mục đích chuyến đi */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/70">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-mute">
            Chú thích
          </span>
          {PURPOSES.map((p) => (
            <span key={p.key} className="inline-flex items-center gap-2">
              <PerlunasMark color={p.color} title={p.key} className="h-4 w-4" />
              {p.key}
            </span>
          ))}
        </div>

        <p className="mt-8 text-sm text-mute">{result.total} chỗ nghỉ</p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {result.items.map((h) => (
            <Link key={h.slug} href={`/khach-san/${h.slug}`} className="group block">
              <div className="relative aspect-[3/2] overflow-hidden">
                <SceneImage
                  src={h.cover}
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
                {h.city}
              </p>
              <h3 className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-serif text-2xl text-ink">
                <span className="group-hover:underline group-hover:underline-offset-4">{h.name}</span>
                <span className="flex items-center gap-1">
                  {hotelPurposes(h.slug).map((p) => (
                    <PerlunasMark key={p} color={purposeColor(p)} title={`Phù hợp: ${p}`} className="h-4 w-4" />
                  ))}
                </span>
              </h3>
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
