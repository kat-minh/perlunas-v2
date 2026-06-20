"use client";

import { useRef } from "react";
import { Compass, Map, ShieldCheck, Camera } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { reasons } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE 8 — WHY TRAVEL WITH US.
 * No checklist. A suitcase opens (the lid swings up on a CSS 3D hinge) and the
 * things we pack for you rise out one by one — each a reason. Pinned + scrubbed.
 */
const ICONS: LucideIcon[] = [Compass, Map, ShieldCheck, Camera];
const TAGS = ["Experience", "Local", "Safety", "Memories"];

export function Suitcase() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 2.4,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      tl.from(".sc-head", { autoAlpha: 0, y: 30, duration: 0.5 }, 0)
        .from(".sc-case", { autoAlpha: 0, y: 50, duration: 0.6 }, 0.1)
        // Lid swings open on its top hinge.
        .to(".sc-lid", { rotateX: -118, ease: "power2.out", duration: 1 }, 0.6)
        .to(".sc-shadow", { opacity: 0.25, scaleX: 1.1, duration: 1 }, 0.6)
        // The packed items rise out, one by one.
        .fromTo(
          ".kit-item",
          { autoAlpha: 0, y: 70, scale: 0.6 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "back.out(1.6)",
            stagger: 0.5,
            duration: 0.9,
          },
          1.1,
        );
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="vi-sao"
      className="relative flex h-svh min-h-[640px] flex-col items-center justify-center overflow-hidden bg-ivory py-16 text-ink"
    >
      <div className="sc-head px-6 text-center [will-change:transform,opacity]">
        <p className="eyebrow">Hành trang chúng tôi chuẩn bị</p>
        <h2 className="mt-3 font-serif text-[clamp(2rem,5vw,3.6rem)] leading-[1] text-emerald">
          Mở vali ra, mọi thứ đã sẵn sàng
        </h2>
      </div>

      {/* The packed items */}
      <div className="relative z-10 mt-10 grid w-full max-w-4xl grid-cols-2 gap-4 px-6 sm:grid-cols-4">
        {reasons.map((r, i) => {
          const Icon = ICONS[i] ?? Compass;
          return (
            <div
              key={r.title}
              className="kit-item rounded-2xl bg-warm p-5 text-center shadow-paper ring-1 ring-leather/10 [will-change:transform,opacity]"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                <Icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold">
                {TAGS[i]}
              </p>
              <h3 className="mt-1 font-serif text-base text-emerald">{r.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{r.body}</p>
            </div>
          );
        })}
      </div>

      {/* The suitcase */}
      <div
        className="sc-case relative mt-12 h-[18vh] min-h-[130px] w-[min(78vw,460px)] [will-change:transform,opacity]"
        style={{ perspective: "1000px" }}
      >
        <div
          className="sc-shadow absolute -bottom-4 left-1/2 h-5 w-[88%] -translate-x-1/2 rounded-[50%] bg-leather-dark/40 opacity-0 blur-md"
          aria-hidden
        />
        {/* Case body */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-leather to-leather-dark shadow-lift ring-1 ring-leather-dark/40">
          <div className="absolute inset-x-6 top-3 h-px bg-warm/15" />
          <div className="absolute inset-x-6 bottom-3 h-px bg-warm/15" />
          {/* latches */}
          <div className="absolute left-[26%] top-0 h-3 w-7 -translate-y-1/2 rounded bg-gold/80" />
          <div className="absolute right-[26%] top-0 h-3 w-7 -translate-y-1/2 rounded bg-gold/80" />
        </div>
        {/* Lid (swings up on the top hinge) */}
        <div
          className="sc-lid absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl bg-gradient-to-b from-leather-dark to-leather shadow-lift ring-1 ring-leather-dark/40"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Handle */}
          <div className="absolute left-1/2 top-0 h-6 w-20 -translate-x-1/2 -translate-y-full rounded-t-2xl border-4 border-leather-dark bg-transparent" />
        </div>
      </div>
    </section>
  );
}
