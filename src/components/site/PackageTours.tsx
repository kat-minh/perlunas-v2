"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SceneImage } from "./SceneImage";
import { pc, type PageContentMap } from "@/lib/page-content";
import type { ApiTour } from "@/lib/api";

/**
 * Tour trọn gói. Modelled on the client's reference (Black Tomato "Explore our
 * trips"): a side title, then a horizontal rail of tall image cards. Each card
 * shows a nights badge + region + name over the photo; on hover the photo dims
 * for legibility and reveals a teaser, the price and a "Xem chi tiết" button.
 * Copy comes from page content; the tour list comes from the API (entities).
 */
export function PackageTours({
  map,
  tours,
}: {
  map: PageContentMap;
  tours: ApiTour[];
}) {
  const railRef = useRef<HTMLDivElement>(null);

  // Scroll the rail by one card width (card + the 20px gap-5 gutter).
  const scroll = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="tour-tron-goi" className="relative bg-ink py-14 text-paper sm:py-20">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        {/* side title */}
        <div className="mb-10 shrink-0 px-6 sm:px-10 lg:mb-0 lg:flex lg:w-[22rem] lg:flex-col lg:justify-center lg:pl-10 lg:pr-0">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/50">
              {pc(map, "home.packagetours.eyebrow")}
            </p>
            <h2 className="display mt-5 text-4xl text-paper sm:text-5xl">
              {pc(map, "home.packagetours.title")}
            </h2>
            <p className="mt-4 max-w-xs text-lg font-light text-paper/65">
              {pc(map, "home.packagetours.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* rail + controls */}
        <div className="min-w-0 flex-1">
          <div
            ref={railRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:px-10 lg:pl-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tours.map((t, i) => (
              <Reveal key={t.slug} delay={i * 60} className="shrink-0 snap-start">
                <Link
                  href={`/tour/${t.slug}`}
                  className="group relative block h-[32rem] w-[78vw] overflow-hidden sm:w-[20rem]"
                >
                  <SceneImage
                    seed={`perlunas-tour-${t.slug}`}
                    alt={t.name}
                    w={760}
                    h={1010}
                    className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                  {/* bottom gradient for the always-on title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-ink/10" />
                  {/* hover: dim the whole photo so the revealed copy reads clearly */}
                  <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 ease-out group-hover:bg-ink/45" />

                  {/* nights badge */}
                  <span className="absolute right-4 top-4 text-[0.7rem] uppercase tracking-[0.18em] text-paper/85">
                    {t.nights}
                  </span>

                  {/* bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                    <p className="text-[0.7rem] uppercase tracking-[0.22em] text-paper/70">
                      {t.region}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl leading-snug">{t.name}</h3>

                    {/* hover reveal: teaser + price + button */}
                    <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="pt-3 text-sm leading-relaxed text-paper/85">{t.teaser}</p>
                        <p className="mt-3 text-sm font-medium text-paper">{t.price}</p>
                        <span className="btn-paper mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em]">
                          {pc(map, "home.packagetours.cta")}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* rail controls — kept below the cards, not over them */}
          <div className="mt-6 flex gap-3 px-6 sm:px-10 lg:pl-12">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Xem tour trước"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Xem tour tiếp theo"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
