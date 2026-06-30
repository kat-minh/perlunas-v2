import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { SceneImage } from "@/components/site/SceneImage";
import { PageHero } from "@/components/site/PageHero";
import { getPageContentMap, pc } from "@/lib/page-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Perlunas thiết kế những hành trình du lịch trong nước tinh tế và trọn vẹn. Tên thương hiệu, triết lý, giá trị cốt lõi, tầm nhìn và sứ mệnh.",
};

export default async function VeChungToiPage() {
  const map = await getPageContentMap();

  // Each block is its own row with an image slot — alternating sides. Content
  // (kicker / title / body / image) comes from page content.
  const BLOCKS = [
    { kicker: pc(map, "about.pearl.eyebrow"), title: pc(map, "about.pearl.title"), body: pc(map, "about.pearl.body"), image: pc(map, "about.pearl.image") },
    { kicker: pc(map, "about.luna.eyebrow"), title: pc(map, "about.luna.title"), body: pc(map, "about.luna.body"), image: pc(map, "about.luna.image") },
    { kicker: pc(map, "about.vision.eyebrow"), title: "", body: pc(map, "about.vision.body"), image: pc(map, "about.vision.image") },
    { kicker: pc(map, "about.mission.eyebrow"), title: "", body: pc(map, "about.mission.body"), image: pc(map, "about.mission.image") },
    { kicker: pc(map, "about.philosophy.eyebrow"), title: "", body: pc(map, "about.philosophy.body"), image: pc(map, "about.philosophy.image") },
  ];

  const VALUES = [1, 2, 3, 4].map((n) => ({
    title: pc(map, `about.values.${n}.title`),
    desc: pc(map, `about.values.${n}.desc`),
  }));

  return (
    <main className="pb-24">
      <PageHero
        title={pc(map, "about.eyebrow")}
        intro={pc(map, "about.hero.intro")}
        image={pc(map, "about.hero.image")}
        alt="Về chúng tôi — Perlunas"
      />
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        {/* content blocks — each on its own row, image alternating */}
        <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
          {BLOCKS.map((b, i) => (
            <article
              key={b.title || b.kicker}
              className="grid items-center gap-8 border-t border-[var(--line)] pt-12 lg:grid-cols-2 lg:gap-16"
            >
              <div className={clsx("group", i % 2 === 1 && "lg:order-2")}>
                <div className="aspect-[4/3] overflow-hidden bg-[var(--surface)]">
                  <SceneImage
                    src={b.image}
                    alt={b.title || b.kicker}
                    w={1000}
                    h={750}
                    className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
                  {b.kicker}
                </p>
                {b.title && (
                  <h2 className="display mt-3 text-3xl text-ink sm:text-4xl">{b.title}</h2>
                )}
                <p
                  className={clsx(
                    "text-pretty leading-relaxed",
                    b.title
                      ? "mt-4 text-ink/75"
                      : "mt-4 text-2xl font-light text-ink sm:text-3xl",
                  )}
                >
                  {b.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* values */}
        <p className="mt-20 text-xs font-medium uppercase tracking-[0.3em] text-mute">
          {pc(map, "about.values.eyebrow")}
        </p>
        <div className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="border-t border-[var(--line)] pt-5">
              <h3 className="font-serif text-xl text-ink">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 flex flex-col items-start gap-6 border-t border-[var(--line)] pt-14 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="display text-2xl text-ink sm:text-3xl">
            {pc(map, "about.cta.title")}
          </h2>
          <Link href="/lien-he" className="btn-ink inline-flex items-center gap-2 rounded-[3px] px-7 py-3.5 text-sm font-medium">
            {pc(map, "about.cta.button")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
