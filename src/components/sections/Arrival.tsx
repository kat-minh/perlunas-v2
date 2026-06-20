"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LeadForm } from "@/components/ui/LeadForm";

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

/**
 * SCENE 11 — ARRIVAL.
 * The camera settles, the sky brightens, the paper plane glides down to land,
 * and an arrival card invites the visitor to begin their own journey. The form
 * (→ Google Sheet) stamps "Journey Confirmed" on submit. The closing frame.
 */
export function Arrival() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;

      // The plane glides down and lands as the section arrives.
      gsap.fromTo(
        ".arr-plane",
        { xPercent: 120, yPercent: -260, rotate: 28, autoAlpha: 0 },
        {
          xPercent: 0,
          yPercent: 0,
          rotate: 6,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "center center", scrub: 1 },
        },
      );
      gsap.from(".arr-head > *", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="lien-he"
      className="relative overflow-hidden bg-gradient-to-b from-ivory via-warm to-[#f0e4c8] py-24 text-ink md:py-32"
    >
      {/* dawn glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50vh 40vh at 50% 18%, rgba(217,185,106,0.3), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="shell relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        {/* Left — the landing */}
        <div className="arr-head">
          <div className="relative h-28">
            <div
              className="arr-plane absolute left-2 top-0 h-16 w-16 bg-emerald [will-change:transform,opacity]"
              style={planeMask}
              aria-hidden
            />
            {/* runway / horizon line */}
            <div className="absolute bottom-3 left-0 h-px w-40 bg-leather/30" />
            <div className="absolute bottom-3 left-0 h-px w-40 bg-gradient-to-r from-leather/40 to-transparent" />
          </div>

          <p className="eyebrow text-leather">Điểm đến tiếp theo</p>
          <h2 className="mt-3 font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] text-emerald">
            Where should your next journey begin?
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
            Chuyến bay vừa hạ cánh — và một hành trình mới của bạn có thể bắt đầu
            ngay bây giờ. Để lại đôi dòng, chúng tôi sẽ cùng bạn phác thảo nó.
          </p>
        </div>

        {/* Right — arrival card */}
        <div className="w-full max-w-lg justify-self-center lg:justify-self-end">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
