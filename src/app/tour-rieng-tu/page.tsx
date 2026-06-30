import type { Metadata } from "next";
import { SceneImage } from "@/components/site/SceneImage";
import { PageHero } from "@/components/site/PageHero";
import { LeadButton } from "@/components/site/LeadButton";
import { getPageContentMap, pc } from "@/lib/page-content";
import { getPrivateTours } from "@/lib/api";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tour riêng tư",
  description:
    "Tour riêng tư may đo theo yêu cầu: gia đình, cặp đôi, nhóm bạn, trăng mật — lịch trình thiết kế riêng cho mỗi hành trình.",
};

/**
 * Trang Tour riêng tư. Header giới thiệu, dải ảnh theo nhóm khách (private-tours
 * entities), khối nội dung + ảnh, và CTA — text/ảnh lấy từ page content.
 */
export default async function TourRiengTuPage() {
  const [map, segments] = await Promise.all([
    getPageContentMap(),
    getPrivateTours(),
  ]);

  return (
    <main className="pb-24">
      <PageHero
        eyebrow={pc(map, "privatepage.eyebrow")}
        title={pc(map, "privatepage.hero.title")}
        intro={pc(map, "privatepage.hero.intro")}
        image={pc(map, "privatepage.hero.image")}
        alt="Tour riêng tư Perlunas"
      />
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        {/* dải ảnh theo nhóm khách */}
        <div className="mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {segments.map((s) => (
            <figure key={s.id ?? s.title} className="group relative aspect-[2/3] overflow-hidden">
              <SceneImage
                src={s.image}
                alt={`Tour riêng — ${s.title}`}
                w={600}
                h={900}
                className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-5 translate-y-2 text-center text-sm uppercase tracking-[0.2em] text-paper opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                {s.title}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* khối nội dung + ảnh */}
        <div className="mt-24 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              {pc(map, "privatepage.block.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
              {pc(map, "privatepage.block.title")}
            </h2>
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-ink/70">
              {pc(map, "privatepage.block.body")}
            </p>
            <div className="mt-8">
              <LeadButton service="Tour riêng">{pc(map, "privatepage.block.button")}</LeadButton>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <SceneImage
              src={pc(map, "privatepage.block.image")}
              alt="Tư vấn tour riêng tư"
              w={1000}
              h={750}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 border-t border-[var(--line-soft)] pt-14 text-center">
          <h2 className="display text-3xl text-ink sm:text-4xl">
            {pc(map, "privatepage.cta.title")}
          </h2>
          <div className="mt-8 flex justify-center">
            <LeadButton service="Tour riêng">{pc(map, "privatepage.cta.button")}</LeadButton>
          </div>
        </div>
      </div>
    </main>
  );
}
