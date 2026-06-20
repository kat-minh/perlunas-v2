import { Reveal } from "./Reveal";

/**
 * Đối tác. Logo wordmarks sliding by continuously (marquee, one per page). Two
 * copies of the list sit side by side so the -50% loop is seamless. Wordmarks
 * are placeholders; swap for real SVG logos when provided.
 */
const partners = [
  "Vietnam Airlines",
  "Vietravel",
  "Saigontourist",
  "Mường Thanh",
  "Vinpearl",
  "Bamboo Airways",
  "Accor Hotels",
  "Sun World",
  "Vietjet Air",
  "Marriott",
];

export function Partners() {
  return (
    <section id="doi-tac" className="relative overflow-hidden border-y border-[var(--line-soft)] py-10">
      <Reveal>
        <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.3em] text-mute">
          Đối tác đồng hành
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
