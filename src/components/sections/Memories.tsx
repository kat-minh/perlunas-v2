"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { stories } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * SCENE 5/9 — MEMORIES, fanned travel album (gateway-of-cards interaction).
 * Polaroids overlap with DISTINCT per-card rotations and sit desaturated. Hover
 * a card and ONLY it colourises, straightens and lifts — the rest stay put and
 * grey, so releasing always returns it to its exact resting tilt. Cards reveal
 * one-by-one on scroll.
 */
const ROT = [-8, 5, -6, 9, -4, 7]; // distinct tilt per card
const ARC = [14, 2, 17, 5, 12, 0]; // distinct vertical offset

export function Memories() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      gsap.from(".mem-reveal", {
        y: 64,
        autoAlpha: 0,
        stagger: 0.13,
        ease: "power3.out",
        duration: 0.9,
        scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  const transform = (i: number) => {
    if (reduced) return undefined;
    // Hovered card grows; its neighbours ease aside to make room.
    if (hover === i) return "rotate(0deg) translateY(-28px) scale(1.14)";
    if (hover !== null) {
      const dir = i < hover ? -1 : 1;
      // Immediate neighbour slides well clear; further ones only edge out a bit.
      const push = 160 + Math.abs(i - hover) * 40;
      return `rotate(${ROT[i % ROT.length]}deg) translate(${dir * push}px, ${ARC[i % ARC.length]}px)`;
    }
    return `rotate(${ROT[i % ROT.length]}deg) translateY(${ARC[i % ARC.length]}px)`;
  };

  return (
    <section
      ref={root}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-emerald-deep py-24 text-warm"
    >
      <div className="paper-grain absolute inset-0 opacity-20" aria-hidden />

      <div className="px-6 text-center">
        <p className="eyebrow text-gold-soft/90">Cuốn lưu bút</p>
        <h2 className="mt-3 font-serif text-[clamp(2rem,5.5vw,4rem)] leading-[0.98]">
          Những khoảnh khắc thật, gửi về từ hành trình
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-warm/65">
          Rê chuột vào một tấm ảnh để nó sống dậy với màu sắc.
        </p>
      </div>

      <ul className="mt-16 flex max-w-full justify-center overflow-x-auto px-6 pb-12 pt-8 md:overflow-visible">
        {stories.map((s, i) => (
          <li
            key={s.name}
            className="shrink-0 origin-bottom transition-[transform,z-index] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [&:not(:first-child)]:-ml-16 md:[&:not(:first-child)]:-ml-20"
            style={{ transform: transform(i), zIndex: hover === i ? 60 : i }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            data-cursor="hover"
          >
            <figure
              className={cn(
                "mem-reveal w-[15rem] rounded-sm bg-warm p-3 pb-4 text-ink shadow-lift ring-1 transition-shadow duration-500",
                hover === i ? "ring-gold/40" : "ring-leather/10",
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={s.image}
                  alt={`${s.name} — ${s.trip}`}
                  fill
                  sizes="240px"
                  className={cn(
                    "object-cover transition duration-500",
                    hover === i ? "grayscale-0" : "grayscale",
                  )}
                />
                <span className="absolute left-2 top-2 rounded-full bg-warm/85 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-emerald">
                  {s.tag}
                </span>
              </div>
              <figcaption className="px-1 pt-3">
                <Quote className="h-3.5 w-3.5 text-gold" />
                <blockquote className="mt-1 font-serif text-[0.85rem] italic leading-snug text-ink">
                  “{s.quote}”
                </blockquote>
                <p className="mt-2 text-xs font-semibold text-emerald">{s.name}</p>
                <p className="text-[0.7rem] text-ink-soft">{s.trip}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
