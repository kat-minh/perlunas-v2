"use client";

import { useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { founder } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * CHƯƠNG 3 — NGƯỜI ĐỒNG HÀNH.
 * Asymmetric split: a tall founder portrait on one side, a personal message on
 * the other. As you scroll, the portrait drifts slower and against the copy
 * (reverse parallax) to open up depth and a feeling of trust.
 */
export function Founder() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;

      // Portrait drifts UP slowly — copy drifts the opposite way: reverse parallax.
      gsap.fromTo(
        ".founder-portrait-inner",
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );
      gsap.fromTo(
        ".founder-copy",
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );

      // Portrait develops like a photo on first view.
      gsap.from(".founder-portrait", {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".founder-portrait", start: "top 80%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="nguoi-dan-loi"
      className="relative scroll-mt-24 overflow-hidden bg-warm py-24 text-ink md:py-32"
    >
      <div className="shell relative z-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-leather/50" />
          <span className="eyebrow">Người đồng hành</span>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          {/* Portrait — the parallaxing column */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-lift">
            <div className="founder-portrait absolute inset-0">
              <div className="founder-portrait-inner absolute inset-0 -top-[12%] h-[124%] will-change-transform">
                <Image
                  src={founder.portrait}
                  alt={`Chân dung ${founder.name}`}
                  fill
                  sizes="(max-width: 1024px) 90vw, 38vw"
                  className="photo-wash object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-warm">
                <p className="font-serif text-2xl leading-tight">{founder.name}</p>
                <p className="text-sm text-warm/80">{founder.role}</p>
              </div>
            </div>
          </div>

          {/* Message — drifts the other way */}
          <div className="founder-copy [will-change:transform]">
            <Reveal>
              <h2 className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] text-emerald">
                Đôi lời từ người giữ những tấm bản đồ
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-7 flex gap-4 border-l-2 border-gold/50 pl-5">
                <Quote className="h-7 w-7 shrink-0 text-gold" />
                <p className="font-serif text-xl italic leading-relaxed text-ink md:text-2xl">
                  {founder.philosophy}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl leading-relaxed text-ink-soft">
                {founder.mission}
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {founder.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-9 flex items-center gap-5 border-t border-leather/15 pt-6 text-sm text-ink-soft">
                <span>
                  <span className="font-serif text-3xl text-leather">{founder.years}</span> năm dẫn lối
                </span>
                <span className="h-8 w-px bg-leather/20" />
                <span>{founder.countriesText}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
