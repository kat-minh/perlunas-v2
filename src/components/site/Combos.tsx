import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SceneImage } from "./SceneImage";
import { pc, type PageContentMap } from "@/lib/page-content";
import type { ApiCity } from "@/lib/api";

/**
 * Combo du lịch. A uniform grid of tall tiles with the destination name centred
 * over each image, and a "Xem tất cả" tile at the end. Destinations come from
 * the admin-managed city taxonomy (API); copy comes from page content.
 */
export function Combos({ map, cities }: { map: PageContentMap; cities: ApiCity[] }) {
  const provinces = cities;
  return (
    <section id="combo" className="relative border-t border-[var(--line-soft)] px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">{pc(map, "home.combos.eyebrow")}</p>
            <h2 className="display mt-5 max-w-2xl text-4xl text-ink sm:text-5xl">
              {pc(map, "home.combos.title")}
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink/65">
              {pc(map, "home.combos.text")}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Link href="/combo" className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink">
              <span className="link-underline">{pc(map, "home.combos.link")}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {provinces.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 5) * 50}>
              <Link
                href={`/combo?noi-den=${p.slug}`}
                className="group relative flex aspect-[3/4] items-center justify-center overflow-hidden"
              >
                <SceneImage
                  seed={`perlunas-place-${p.slug}`}
                  alt={p.name}
                  w={500}
                  h={667}
                  className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/35 transition-colors duration-500 group-hover:bg-ink/55" />
                <h3 className="relative px-3 text-center text-sm font-medium uppercase leading-snug tracking-[0.18em] text-paper transition-transform duration-500 ease-out group-hover:scale-[1.15] sm:text-base">
                  {p.name}
                </h3>
              </Link>
            </Reveal>
          ))}

          {/* Xem tất cả tile */}
          <Reveal delay={(provinces.length % 5) * 50}>
            <Link
              href="/combo"
              className="group relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-ink text-paper transition-colors hover:bg-ink/85"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em]">
                {pc(map, "home.combos.viewall")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
