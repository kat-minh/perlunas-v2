"use client";

import { useRef } from "react";
import { milestones } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BrandStory() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // [ScrollTrigger] The journal spine inks downward as you read.
      gsap.fromTo(
        ".story-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: { trigger: ".story-list", start: "top 70%", end: "bottom 70%", scrub: 1 },
        },
      );

      // [ScrollTrigger] Each milestone: stamp presses, card slides from its side.
      gsap.utils.toArray<HTMLElement>(".story-item").forEach((item) => {
        const stamp = item.querySelector(".story-stamp");
        const card = item.querySelector(".story-card");
        const fromLeft = item.dataset.side === "left";
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 78%", once: true },
        });
        tl.from(stamp, {
          scale: 1.8,
          opacity: 0,
          rotate: -24,
          duration: 0.5,
          ease: "back.out(2)",
        }).from(
          card,
          {
            x: fromLeft ? -50 : 50,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.2",
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="cau-chuyen"
      className="relative scroll-mt-24 overflow-hidden bg-warm py-24 md:py-32"
    >
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Nhật ký hành trình"
          title="Mười năm, một cuốn nhật ký đóng dấu"
          intro="Một chiếc xe. Vài người bạn. Cả dải đất hình chữ S. Mỗi cột mốc là một con dấu trong cuốn sổ tay lữ hành — ghi lại nơi đã qua và những người đã đồng hành."
        />

        <div className="story-list relative mt-16 md:mt-20">
          <div className="story-spine absolute left-[18px] top-2 h-[calc(100%-1rem)] w-px bg-leather/30 md:left-1/2" />

          <ol className="space-y-12 md:space-y-20">
            {milestones.map((m, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={m.year}
                  data-side={left ? "left" : "right"}
                  className="story-item relative md:grid md:grid-cols-2 md:gap-12"
                >
                  <div className="story-stamp absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2">
                    <div
                      className="stamp-edge flex aspect-square w-[78px] flex-col items-center justify-center rounded-full border-2 border-dashed border-forest/60 bg-warm text-center text-forest"
                      style={{ rotate: `${m.rotate}deg` }}
                    >
                      <span className="font-serif text-base font-semibold leading-none">{m.year}</span>
                      <span className="mt-1 text-[0.5rem] uppercase tracking-[0.16em] opacity-80">
                        {m.stamp}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`story-card ml-28 md:ml-0 ${
                      left ? "md:col-start-1 md:pr-14 md:text-right" : "md:col-start-2 md:pl-14"
                    }`}
                  >
                    <article
                      className="rounded-2xl bg-paper/70 p-6 shadow-paper ring-1 ring-leather/10"
                      style={{ rotate: `${m.rotate / 4}deg` }}
                    >
                      <h3 className="font-serif text-xl text-emerald md:text-2xl">{m.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{m.body}</p>
                    </article>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
