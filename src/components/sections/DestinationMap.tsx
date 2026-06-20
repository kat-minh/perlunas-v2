"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin } from "lucide-react";
import { pins, type Pin } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Flight route in a 100×160 viewBox that matches the map's 400/640 aspect, so
// the SVG scales uniformly and the plane isn't distorted. (y = pin% × 1.6.)
const ROUTE =
  "M47 14.4 C 45 25.6, 46 25.6, 47 32 S 50 52.8, 52 64 C 54 72, 60 73.6, 63 78.4 C 66 89.6, 63 96, 64 102.4 C 60 115.2, 48 121.6, 40 131.2";

export function DestinationMap() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Pin | null>(pins[4]);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      // [ScrollTrigger] The folded map opens out as it enters.
      gsap.fromTo(
        ".map-paper",
        { rotateY: 38, scaleX: 0.78, transformPerspective: 900, transformOrigin: "left center" },
        {
          rotateY: 0,
          scaleX: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 78%", end: "center center", scrub: 1 },
        },
      );

      // [ScrollTrigger + SVG path draw] The flight route inks itself in.
      const path = root.current!.querySelector<SVGPathElement>(".route-path");
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 65%", end: "center 55%", scrub: 1 },
        });
      }

      // [ScrollTrigger + MotionPath] The plane flies the route as you scroll.
      gsap.to(".route-plane", {
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 65%", end: "center 55%", scrub: 1 },
        motionPath: { path: ".route-path", align: ".route-path", alignOrigin: [0.5, 0.5], autoRotate: 90 },
      });

      // [ScrollTrigger] Pins drop in with a staggered bounce.
      gsap.from(".map-pin", {
        y: -18,
        scale: 0,
        opacity: 0,
        ease: "back.out(2.2)",
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="diem-den"
      className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 md:py-32"
    >
      <div className="shell">
        <SectionHeading
          eyebrow="Tấm bản đồ gấp"
          title="Chạm vào nơi trái tim muốn đến"
          intro="Mở tấm bản đồ Việt Nam và rê qua từng điểm đến — mỗi chiếc ghim là một câu chuyện, một con dấu đang chờ trong hộ chiếu của bạn."
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          {/* Map */}
          <div className="relative mx-auto aspect-[400/640] w-full max-w-[360px] [perspective:1000px]">
            <div className="map-paper absolute inset-0 rounded-2xl bg-paper shadow-paper [background-image:repeating-linear-gradient(90deg,transparent,transparent_72px,rgba(122,82,54,.07)_72px,rgba(122,82,54,.07)_73px)]">
              {/* Silhouette */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: "url(/vietnam.svg)",
                  maskImage: "url(/vietnam.svg)",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              >
                <div className="h-full w-full bg-gradient-to-b from-forest/25 via-forest/15 to-emerald/25" />
              </div>

              {/* Flight route + plane (same 0..100 coordinate space as pins) */}
              <svg
                viewBox="0 0 100 160"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden
              >
                <path
                  className="route-path"
                  d={ROUTE}
                  fill="none"
                  stroke="#7a5236"
                  strokeWidth="0.6"
                  strokeDasharray="1.8 1.6"
                  opacity="0.6"
                />
                <g className="route-plane" style={{ color: "#133a2c" }}>
                  <path d="M0,-2.4 L1.7,1.5 L0,0.5 L-1.7,1.5 Z" fill="currentColor" />
                </g>
              </svg>

              {/* Pins */}
              {pins.map((p) => {
                const on = active?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onMouseEnter={() => setActive(p)}
                    onFocus={() => setActive(p)}
                    onClick={() => setActive(p)}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    className="map-pin group absolute -translate-x-1/2 -translate-y-full"
                    aria-label={`${p.name} — ${p.blurb}`}
                    data-cursor="hover"
                  >
                    <span className="relative flex flex-col items-center">
                      {on && (
                        <motion.span
                          className="absolute -bottom-1 h-6 w-6 rounded-full bg-gold/30"
                          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                      {/* Framer tooltip */}
                      <span
                        className={`pointer-events-none absolute -top-7 whitespace-nowrap rounded-md bg-emerald px-2 py-1 text-[0.55rem] font-medium text-warm shadow-lift transition-all duration-200 ${
                          on ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {p.blurb}
                      </span>
                      <MapPin
                        className={`h-5 w-5 drop-shadow transition-all duration-300 ${
                          on ? "scale-125 text-leather-dark" : "text-forest/60 group-hover:text-leather"
                        }`}
                        strokeWidth={2}
                        fill={on ? "#c39b46" : "transparent"}
                      />
                      <span
                        className={`mt-0.5 whitespace-nowrap rounded-full bg-warm/90 px-2 py-0.5 text-[0.55rem] font-semibold tracking-wide text-emerald shadow-sm transition-opacity ${
                          on ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {p.name}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview panel */}
          <Reveal delay={0.1}>
            <div className="relative min-h-[260px]">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl bg-warm p-8 shadow-paper ring-1 ring-leather/10"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <span className="eyebrow">{active.region}</span>
                        <h3 className="mt-2 font-serif text-4xl text-emerald">{active.name}</h3>
                        <p className="mt-3 text-ink-soft">{active.blurb}</p>
                      </div>
                      <motion.div
                        key={`stamp-${active.id}`}
                        initial={{ scale: 1.6, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 0.95, rotate: -12 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="stamp-edge flex aspect-square w-24 shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed border-leather/60 text-center text-leather"
                      >
                        <span className="font-serif text-[0.55rem] font-bold uppercase leading-tight tracking-[0.1em]">
                          Đã ghé
                          <br />
                          {active.name}
                        </span>
                      </motion.div>
                    </div>

                    <a
                      href="#lien-he"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-warm transition-colors hover:bg-emerald-deep"
                    >
                      Thiết kế hành trình đến {active.name}
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
