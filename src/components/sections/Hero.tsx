"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { site } from "@/lib/site";

const HERO_IMG =
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=80";

/**
 * CHƯƠNG 1 — MASKING DISTORTION (technique 1).
 * The word "VIỆT NAM" is a window: its letters are filled with the landscape
 * photo (background-clip:text, viewport-fixed). On a pinned scrub the word
 * scales up until the photo bursts out of the type and floods the screen as the
 * cinematic backdrop — "scroll to drive the camera", not to read.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(".hero-photo", { autoAlpha: 1 });
        gsap.set(".hero-slogan", { autoAlpha: 1 });
        return;
      }

      gsap.set(".hero-mask", { scale: 1 });
      gsap.set(".hero-photo", { autoAlpha: 0 });
      gsap.set(".hero-slogan", { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".hero-eyebrow", { autoAlpha: 0, y: -20, duration: 0.4 }, 0)
        // The masked word swells until the photo fills the frame.
        .to(".hero-mask", { scale: 9, ease: "power2.in", duration: 2 }, 0)
        // Behind it, the real full-bleed photo fades up to take over seamlessly.
        .to(".hero-photo", { autoAlpha: 1, ease: "none", duration: 1.4 }, 0.9)
        .to(".hero-mask", { autoAlpha: 0, duration: 0.4 }, 1.9)
        .to(".hero-slogan", { autoAlpha: 1, y: 0, duration: 1 }, 1.8);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="khoi-hanh"
      aria-label="Hành Trình Việt — khởi hành"
      className="relative h-svh min-h-[640px] w-full overflow-hidden bg-emerald-deep text-warm"
    >
      {/* Full-bleed photo that the mask reveals into */}
      <div className="hero-photo absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMG}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/35 to-emerald-deep/55" />
      </div>
      <div className="paper-grain absolute inset-0 z-[1] opacity-25" aria-hidden />

      {/* The masking word */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p className="hero-eyebrow eyebrow mb-6 text-gold-soft/90">
          Du lịch nội địa · Est. {site.foundedYear}
        </p>
        <h1
          className="hero-mask select-none font-serif font-[560] leading-[0.82] tracking-[-0.04em] [will-change:transform]"
          style={{
            fontSize: "clamp(4rem, 18vw, 15rem)",
            backgroundImage: `url('${HERO_IMG}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          VIỆT<br />NAM
        </h1>
      </div>

      {/* Slogan revealed once the photo takes over */}
      <div className="hero-slogan absolute inset-x-0 bottom-[12vh] z-20 px-6 text-center [will-change:transform,opacity]">
        <p className="font-serif text-[clamp(1.8rem,5vw,3.6rem)] italic leading-tight text-warm">
          Chạm vào thế giới theo cách của bạn
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-warm/75">
          Những hành trình nội địa giàu cảm xúc — may đo riêng cho bạn.
        </p>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-1.5 text-[0.66rem] uppercase tracking-[0.28em] text-warm/55"
        animate={reduced ? undefined : { y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Cuộn để khởi hành
        <ArrowDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
}
