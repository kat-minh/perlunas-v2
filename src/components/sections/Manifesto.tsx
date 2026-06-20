"use client";

import { useRef } from "react";
import { Compass } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CircularText } from "@/components/fx/CircularText";

/**
 * CHƯƠNG 2 — TÂM NGUYỆN.
 * A deliberate palette FLIP to light/ivory after the dark hero + flight — the
 * contrast itself is the punctuation. Pinned, scrubbed reveal: each fragment
 * lights from faint to full as the camera lingers; a rotating stamp-seal
 * (dynamic text wrapping) anchors the page.
 */
const FRAGMENTS = [
  ["Chúng tôi không bán", false],
  ["những chuyến đi vội vã.", true],
  ["Chúng tôi tạo ra khoảng lặng —", false],
  ["để bạn thật sự chạm vào", false],
  ["đất nước mình.", true],
] as const;

export function Manifesto() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>(".mf-line");
      if (reduced || !lines.length) {
        gsap.set(lines, { opacity: 1 });
        return;
      }
      gsap.set(lines, { opacity: 0.14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + lines.length * 240,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      lines.forEach((l) => {
        tl.to(l, { opacity: 1, ease: "none", duration: 1 }).to(l, { duration: 0.3 });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="tam-nguyen"
      className="relative flex min-h-svh items-center overflow-hidden bg-ivory py-24 text-ink"
    >
      {/* Rotating stamp-seal — dynamic text wrapping */}
      <CircularText
        text="HÀNH TRÌNH VIỆT · A JOURNEY BEGINS BEFORE YOU TRAVEL"
        className="absolute -right-10 top-10 w-40 text-leather/70 md:right-10 md:w-52"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald text-warm">
          <Compass className="h-5 w-5" strokeWidth={1.6} />
        </span>
      </CircularText>

      <div className="shell relative z-10">
        <p className="eyebrow mb-10">Tâm nguyện</p>
        <div className="max-w-4xl font-serif font-[440] leading-[1.08] tracking-[-0.02em]">
          {FRAGMENTS.map(([line, accent], i) => (
            <p
              key={i}
              className={`mf-line [will-change:opacity] text-[clamp(1.8rem,5vw,3.6rem)] ${
                accent ? "italic text-leather" : "text-ink"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
