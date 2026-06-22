import { Reveal } from "./Reveal";
import { pc, type PageContentMap } from "@/lib/page-content";

/**
 * Đối tác. Logo wordmarks sliding by continuously (marquee, one per page). Two
 * copies of the list sit side by side so the -50% loop is seamless. The list +
 * heading come from page content (one partner name per line).
 */
export function Partners({ map }: { map: PageContentMap }) {
  const partners = pc(map, "home.partners.list")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <section id="doi-tac" className="relative overflow-hidden border-y border-[var(--line-soft)] py-10">
      <Reveal>
        <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.3em] text-mute">
          {pc(map, "home.partners.eyebrow")}
        </p>
      </Reveal>

      <div className="marquee group relative flex overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper to-transparent" />

        <div className="marquee-track flex shrink-0 items-center gap-16 pr-16">
          {[...partners, ...partners].map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="whitespace-nowrap font-serif text-2xl text-ink/35 transition-colors hover:text-ink"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
