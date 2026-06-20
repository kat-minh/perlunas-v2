"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE 4 — THE STORY BEHIND EVERY DESTINATION.
 * The camera dives into the country it just drew: each destination fills the
 * frame, holds for a breath with a single line, then dissolves into the next as
 * you scroll. One pinned, scrubbed sequence — no cards, no sections, just place
 * and feeling. Reduced-motion stacks the chapters as plain full-height panels.
 */
const CHAPTERS = [
  {
    place: "Hà Giang",
    region: "Cực Bắc",
    quote: "Không phải con đường nào cũng nên đi vội.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=80",
    alt: "Đèo Mã Pí Lèng, Hà Giang",
  },
  {
    place: "Đà Lạt",
    region: "Cao nguyên",
    quote: "Có những nơi, sương mù giữ ta ở lại.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80",
    alt: "Rừng thông Đà Lạt trong sương",
  },
  {
    place: "Phú Quốc",
    region: "Đảo ngọc",
    quote: "Hoàng hôn không kết thúc — nó hẹn ngày trở lại.",
    image:
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=2400&q=80",
    alt: "Hoàng hôn trên biển Phú Quốc",
  },
];

export function DestinationStories() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !stage.current) return;
      const panels = gsap.utils.toArray<HTMLElement>(".ds-panel");

      // Collapse the stacked fallback into one pinned viewport.
      gsap.set(stage.current, { height: "100svh" });
      gsap.set(panels, { position: "absolute", inset: 0 });
      gsap.set(panels.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * panels.length * 1.1,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        const media = panel.querySelector(".ds-media");
        const words = panel.querySelectorAll(".ds-rise");
        // Slow camera push-in on every panel while it's on screen.
        tl.fromTo(
          media,
          { scale: 1.12 },
          { scale: 1, ease: "none", duration: 2 },
          i * 2,
        );
        if (i > 0) {
          // Crossfade from the previous panel.
          tl.fromTo(
            panel,
            { autoAlpha: 0 },
            { autoAlpha: 1, ease: "power1.inOut", duration: 0.8 },
            i * 2 - 0.4,
          );
        }
        // The line rises in, then drifts out before the next panel.
        tl.fromTo(
          words,
          { yPercent: 60, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: "power3.out", stagger: 0.12, duration: 0.9 },
          i * 2 + 0.2,
        ).to(
          words,
          { yPercent: -40, autoAlpha: 0, ease: "power2.in", duration: 0.7 },
          i * 2 + 1.5,
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      aria-label="Câu chuyện sau mỗi điểm đến"
      className="relative bg-emerald-deep text-warm"
    >
      <div ref={stage} className="ds-stage relative overflow-hidden">
        {CHAPTERS.map((c) => (
          <article
            key={c.place}
            className="ds-panel relative flex h-svh min-h-[600px] w-full items-center justify-center overflow-hidden"
          >
            <div className="ds-media absolute inset-0 will-change-transform">
              <Image
                src={c.image}
                alt={c.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-emerald-deep/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-emerald-deep/40" />
            </div>

            <div className="relative z-10 px-6 text-center [will-change:transform,opacity]">
              <p className="ds-rise eyebrow text-gold-soft/90">{c.region}</p>
              <h2 className="ds-rise mt-3 font-serif font-[440] leading-[0.95] tracking-[-0.02em] text-[clamp(3rem,11vw,9rem)]">
                {c.place}
              </h2>
              <p className="ds-rise mx-auto mt-6 max-w-xl font-serif text-[clamp(1.2rem,3vw,2rem)] italic leading-snug text-warm/90">
                “{c.quote}”
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
