"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/content";
import { GsapText } from "@/components/ui/GsapText";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function TourCategories() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !track.current) return;
      const mm = gsap.matchMedia();

      // [ScrollTrigger] DESKTOP: pin the section and scroll the cards sideways.
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 96;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      // [ScrollTrigger] MOBILE: simple staggered rise (no pin).
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".cat-card", {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: track.current, start: "top 80%", once: true },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="hanh-trinh"
      className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 lg:h-svh lg:min-h-[720px] lg:py-0"
    >
      <div className="flex h-full flex-col justify-center">
        <div className="shell">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-leather/50" />
            <span className="eyebrow">Chọn hạng hành trình</span>
          </div>
          <GsapText
            as="h2"
            text="Bốn cách để bắt đầu chuyến đi"
            className="mt-4 max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] text-emerald"
          />
        </div>

        <div
          ref={track}
          className="mt-12 flex flex-col gap-6 px-6 md:px-10 lg:mt-16 lg:w-max lg:flex-row lg:gap-8 lg:pl-[max(2.5rem,calc((100vw-78rem)/2+2.5rem))] lg:pr-24"
        >
          {categories.map((c, i) => (
            <article
              key={c.code}
              className="cat-card group flex shrink-0 flex-col rounded-2xl bg-warm shadow-paper ring-1 ring-leather/10 lg:w-[24rem]"
            >
              <div className="flex items-center justify-between rounded-t-2xl bg-emerald px-6 py-4 text-warm">
                <span className="font-mono text-xs tracking-[0.2em] text-gold-soft">
                  {c.code} · {String(i + 1).padStart(2, "0")}/04
                </span>
                <c.icon className="h-5 w-5 text-gold-soft" strokeWidth={1.6} />
              </div>
              <div className="perforation h-3 w-full" aria-hidden />
              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <h3 className="font-serif text-2xl text-emerald">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.body}</p>
                <ul className="mt-5 space-y-2 text-sm text-ink">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
                <motion.a
                  href="#lien-he"
                  whileHover={{ x: 4 }}
                  className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-forest"
                  data-cursor="hover"
                >
                  Tư vấn loại hình này
                  <ArrowUpRight className="h-4 w-4" />
                </motion.a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
