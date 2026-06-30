import { Reveal } from "./Reveal";
import { LeadButton } from "./LeadButton";
import { SceneImage } from "./SceneImage";
import { pc, type PageContentMap } from "@/lib/page-content";
import type { ApiHighlightCard } from "@/lib/api";

/**
 * Tour riêng tư. A centred title (page content) then a single row of tall image
 * cards, one per guest segment (private-tours entities), and a CTA below that
 * opens the shared enquiry form (service preset to "Tour riêng").
 */
export function PrivateTour({
  map,
  segments,
}: {
  map: PageContentMap;
  segments: ApiHighlightCard[];
}) {
  return (
    <section id="tour-rieng" className="relative border-t border-[var(--line-soft)] px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[100rem]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">{pc(map, "home.privatetour.eyebrow")}</p>
          <h2 className="display mt-5 text-4xl text-ink sm:text-5xl">
            {pc(map, "home.privatetour.title")}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {segments.map((s, i) => (
            <Reveal key={s.id ?? s.title} delay={i * 80}>
              <figure className="group relative aspect-[2/3] overflow-hidden">
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
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex justify-center">
            <LeadButton service="Tour riêng">{pc(map, "home.privatetour.cta")}</LeadButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
