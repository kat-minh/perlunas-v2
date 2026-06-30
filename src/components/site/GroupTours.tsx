import { Reveal } from "./Reveal";
import { LeadButton } from "./LeadButton";
import { SceneImage } from "./SceneImage";
import { pc, type PageContentMap } from "@/lib/page-content";
import type { ApiHighlightCard } from "@/lib/api";

/**
 * Tour đoàn. Two columns: the philosophy/CTA text on the left (page content), a
 * small photo collage on the right. The collage photos come from the API
 * (group-tours entities): the first is the wide hero, the rest are squares.
 */
export function GroupTours({
  map,
  moments,
}: {
  map: PageContentMap;
  moments: ApiHighlightCard[];
}) {
  // 2×2 collage — exactly four equal photos.
  const grid = moments.slice(0, 4);

  return (
    <section id="tour-doan" className="relative border-t border-[var(--line-soft)] px-6 pb-16 pt-10 sm:px-10 sm:pb-24 sm:pt-12">
      <div className="mx-auto grid max-w-[100rem] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* left — text */}
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-lg font-medium uppercase tracking-[0.22em] text-ink sm:text-2xl">
              {pc(map, "home.grouptours.title")}
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-[1.7] text-ink/80">
              <p>{pc(map, "home.grouptours.p1")}</p>
              <p>{pc(map, "home.grouptours.p2")}</p>
              <p>{pc(map, "home.grouptours.p3")}</p>
            </div>
            <div className="mt-9">
              <LeadButton service="Tour đoàn">{pc(map, "home.grouptours.cta")}</LeadButton>
            </div>
          </div>
        </Reveal>

        {/* right — 2×2 photo collage (four equal squares) */}
        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {grid.map((m) => (
              <figure key={m.id ?? m.title} className="group relative aspect-square overflow-hidden">
                <SceneImage
                  src={m.image}
                  alt={m.description || m.title}
                  w={700}
                  h={700}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                <figcaption className="absolute bottom-3 left-4 text-sm uppercase tracking-[0.2em] text-paper">
                  {m.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
