"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The connective tissue between scenes ("máy bay nối"). A single paper plane is
 * fixed to the viewport and flies a gentle banking descent across the WHOLE
 * page as you scroll — the camera-subject that leads you from one scene into the
 * next, so 4→11 read as a continuous flight rather than stacked sections.
 * It fades in after the opening flight (which has its own plane) and fades out
 * at the arrival (which lands its own). It also softens the hard background
 * cuts by dissolving the incoming scenes in.
 */
const planeMask = {
  WebkitMaskImage: "url(/paper-plane.svg)",
  maskImage: "url(/paper-plane.svg)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function JourneyThread() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const plane = ref.current.querySelector<HTMLElement>(".thread-plane");
      if (!plane) return;

      // (a) The continuous flight, driven by overall page scroll.
      const render = (p: number) => {
        // Active only across the middle scenes (4→11).
        const fadeIn = clamp01((p - 0.18) / 0.06);
        // Stay through the memories, then vanish just before the CTA panel.
        const fadeOut = clamp01((0.92 - p) / 0.035);
        const op = Math.min(fadeIn, fadeOut);
        const local = clamp01((p - 0.18) / 0.74); // 0 at flight end → 1 at arrival
        const sway = Math.sin(local * Math.PI * 4);
        plane.style.left = `${62 + sway * 16}%`;
        plane.style.top = `${14 + local * 66}%`;
        plane.style.transform = `translate(-50%, -50%) rotate(${
          Math.cos(local * Math.PI * 4) * 20 - 4
        }deg)`;
        plane.style.opacity = String(op * 0.92);
      };
      render(0);
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
        onUpdate: (self) => render(self.progress),
      });

      // (b) Dissolve the scenes that follow a hard background change.
      ["#tam-nguyen", "#hanh-trinh", "#lien-he"].forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) return;
        gsap.fromTo(
          el,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 52%",
              scrub: true,
            },
          },
        );
      });
    },
    { dependencies: [reduced] },
  );

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-30">
      <div
        className="thread-plane absolute h-[7vmin] max-h-16 min-h-9 w-[7vmin] max-w-16 min-w-9 bg-gold-soft opacity-0 drop-shadow-[0_3px_7px_rgba(13,42,32,0.55)]"
        style={planeMask}
      />
    </div>
  );
}
