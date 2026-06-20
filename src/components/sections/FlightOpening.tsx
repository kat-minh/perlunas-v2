"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENES 1–3 — the opening flight, told as one continuous camera move (no
 * sections). A paper plane hangs in a paper sky ("Scroll to begin"); as you
 * scroll the camera chases it through clouds, ridges and ocean (parallax
 * layers at different speeds); the world then dissolves into the map of Việt
 * Nam drawing itself, destinations lighting up as the plane flies the route.
 *
 * Pure transforms/opacity + one pinned scrubbed timeline. Paper-craft visuals
 * in the brand palette — no photos to load. Reduced-motion gets a static scene.
 */
// Route + destinations in the SAME 0–100 square space as vietnam.svg (1000×1000),
// so they sit exactly on the landmass. Coords read off a coordinate-grid render.
const ROUTE =
  "M48,8 C 46,15 48,21 48,27 C 48,35 52,41 54,46 C 56,50 57,53 58,56 C 60,61 61,65 60,69 C 58,75 50,77 44,80 C 38,83 32,84 28,85";

const DEST = [
  { name: "Hà Giang", slug: "ha-giang", x: 48, y: 8, at: 0.04 },
  { name: "Ninh Bình", slug: "ninh-binh", x: 48, y: 27, at: 0.28 },
  { name: "Huế", slug: "hue", x: 55, y: 46, at: 0.5 },
  { name: "Đà Nẵng", slug: "da-nang", x: 57, y: 50, at: 0.58 },
  { name: "Hội An", slug: "hoi-an", x: 57, y: 53, at: 0.64 },
  { name: "Phú Quốc", slug: "phu-quoc", x: 28, y: 85, at: 0.95 },
];

// Clean, smooth, solid mountain ridgelines (extra-wide viewBox 2400×360 with
// many peaks) so the layers can be stretched very wide and never reveal a gap
// when they parallax. Three distinct shapes layered + tinted for depth.
const RIDGE_FAR =
  "M0,250 C 200,220 360,228 560,205 C 760,182 940,224 1180,206 C 1420,188 1600,228 1840,206 C 2040,188 2240,222 2400,206 L2400,360 L0,360 Z";
const RIDGE_MID =
  "M0,280 C 160,235 280,172 440,212 C 580,247 700,168 860,210 C 1020,250 1160,178 1320,218 C 1480,256 1620,182 1780,220 C 1940,254 2080,184 2240,222 C 2320,240 2370,228 2400,232 L2400,360 L0,360 Z";
const RIDGE_NEAR =
  "M0,300 C 130,262 220,180 340,226 C 460,270 560,192 690,238 C 820,282 940,200 1070,244 C 1200,286 1330,206 1460,250 C 1590,290 1720,210 1850,252 C 1980,290 2100,214 2230,256 C 2320,284 2370,272 2400,276 L2400,360 L0,360 Z";

export function FlightOpening() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const q = gsap.utils.selector(root);

      gsap.set(q(".map-stage"), { autoAlpha: 0, scale: 1.08 });
      gsap.set(q(".vn-title"), { autoAlpha: 0, y: 30 });
      gsap.set(q(".dest"), { autoAlpha: 0, scale: 0 });

      // Draw-on for the route.
      const path = root.current.querySelector<SVGPathElement>(".route-path");
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "st-flight",
          trigger: root.current,
          start: "top top",
          end: "+=520%",
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // --- SCENE 1 → 2: leave the title, chase the plane through the sky ---
      tl.to(q(".s1-text"), { autoAlpha: 0, y: -60, duration: 0.8 }, 0)
        .to(q(".scroll-cue"), { autoAlpha: 0, duration: 0.4 }, 0)
        // Camera-chase parallax (each layer its own speed).
        .to(q(".layer-cloud-far"), { xPercent: -18, duration: 5.5 }, 0)
        .to(q(".layer-cloud-near"), { xPercent: -42, yPercent: -6, duration: 5.5 }, 0)
        .to(q(".layer-ridge-far"), { xPercent: -6, duration: 5.5 }, 0)
        .to(q(".layer-ridge-mid"), { xPercent: -10, duration: 5.5 }, 0)
        .to(q(".layer-ridge-near"), { xPercent: -16, duration: 5.5 }, 0)
        .to(q(".layer-glow"), { yPercent: 14, duration: 5.5 }, 0)
        // The paper plane flies up and across.
        .to(
          q(".sky-plane"),
          { xPercent: 230, yPercent: -150, rotate: -16, duration: 4.8 },
          0.2,
        )
        .to(q(".sky-plane"), { autoAlpha: 0, duration: 0.8 }, 4.6);

      // --- SCENE 2 → 3: the sky lifts away, the map of Việt Nam appears ---
      tl.to(
        [
          q(".layer-cloud-far"),
          q(".layer-cloud-near"),
          q(".layer-ridge-far"),
          q(".layer-ridge-mid"),
          q(".layer-ridge-near"),
          q(".layer-glow"),
        ],
        { autoAlpha: 0, duration: 1 },
        4.8,
      )
        .to(q(".map-stage"), { autoAlpha: 1, scale: 1, duration: 1.2 }, 5)
        .to(q(".vn-title"), { autoAlpha: 1, y: 0, duration: 1 }, 5.4);

      // --- SCENE 3: route inks itself, plane flies it, places light up ---
      if (path) {
        tl.to(path, { strokeDashoffset: 0, duration: 4 }, 6);
        tl.to(
          q(".map-plane"),
          {
            duration: 4,
            motionPath: {
              path: ".route-path",
              align: ".route-path",
              alignOrigin: [0.5, 0.5],
              autoRotate: 90,
            },
          },
          6,
        );
      }
      DEST.forEach((d) => {
        tl.to(
          q(`.dest-${d.slug}`),
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
          6 + d.at * 4,
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  if (reduced) {
    return (
      <section
        id="khoi-hanh"
        className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ivory py-24 text-ink"
      >
        <div className="shell text-center">
          <p className="font-serif text-[clamp(1.6rem,4vw,2.6rem)] italic text-emerald">
            Every journey begins with a single step.
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.4rem,8vw,5rem)] text-emerald">
            VIỆT NAM
          </h1>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {DEST.map((d) => (
              <span
                key={d.name}
                className="rounded-full bg-emerald px-3 py-1 text-xs text-warm"
              >
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      id="khoi-hanh"
      aria-label="Khởi hành — chuyến bay bắt đầu"
      className="relative h-svh min-h-[640px] w-full overflow-hidden"
    >
      {/* Dawn sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep via-emerald to-forest" />
      {/* Soft dawn glow behind the ridges (radial — no hard edge) */}
      <div
        className="layer-glow absolute inset-0 will-change-transform"
        aria-hidden
        style={{
          background:
            "radial-gradient(42vh 34vh at 50% 68%, rgba(217,185,106,0.24), rgba(217,185,106,0) 72%)",
        }}
      />
      <div className="paper-grain absolute inset-0 opacity-25" aria-hidden />

      {/* Clouds — sparse and soft */}
      <div className="layer-cloud-far absolute inset-0 will-change-transform" aria-hidden>
        <Cloud className="left-[11%] top-[19%] w-44 opacity-20" />
        <Cloud className="right-[13%] top-[27%] w-56 opacity-16" />
      </div>
      <div className="layer-cloud-near absolute inset-0 will-change-transform" aria-hidden>
        <Cloud className="left-[22%] top-[42%] w-52 opacity-28" />
        <Cloud className="right-[12%] top-[35%] w-40 opacity-22" />
      </div>

      {/* Mountain ridges — three smooth layers, tinted for depth */}
      <Ridge d={RIDGE_FAR} className="layer-ridge-far h-[30vh] text-forest/25" />
      <Ridge d={RIDGE_MID} className="layer-ridge-mid h-[38vh] text-forest/45" />
      <Ridge d={RIDGE_NEAR} className="layer-ridge-near h-[48vh] text-emerald" />

      {/* The paper plane */}
      <div className="sky-plane absolute left-1/2 top-[42%] z-20 w-24 -translate-x-1/2 will-change-transform md:w-28">
        <PaperPlane />
      </div>

      {/* Scene 1 copy */}
      <div className="s1-text absolute inset-x-0 top-[20%] z-30 px-6 text-center text-warm [will-change:transform,opacity]">
        <p className="font-serif text-[clamp(1.6rem,4.5vw,3.2rem)] italic leading-tight">
          Every journey begins with a single step.
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-warm/75">
          Mỗi hành trình bắt đầu chỉ bằng một bước chân.
        </p>
      </div>

      {/* Scroll cue */}
      <div className="scroll-cue absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-2 text-[0.66rem] uppercase tracking-[0.3em] text-warm/70">
        Scroll to begin your journey
        <span className="h-10 w-px animate-pulse bg-warm/50" />
      </div>

      {/* SCENE 3 — the map */}
      <div className="map-stage absolute inset-0 z-10 flex items-center justify-center [will-change:transform,opacity]">
        <div className="absolute inset-0 bg-gradient-to-b from-warm via-ivory to-cream" />
        <div className="relative grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-6 md:grid-cols-[0.9fr_1.1fr]">
          {/* Map paper — SQUARE box so mask + route share one 0–100 space */}
          <div className="relative mx-auto aspect-square w-full max-w-[440px]">
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
              <div className="h-full w-full bg-gradient-to-b from-forest/30 via-forest/15 to-emerald/30" />
            </div>

            {/* Route + plane */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden
            >
              <path
                className="route-path"
                d={ROUTE}
                fill="none"
                stroke="#7a5236"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeDasharray="2 1.6"
                opacity="0.75"
              />
              <g className="map-plane" style={{ color: "#133a2c" }}>
                <path d="M0,-2.4 L1.7,1.5 L0,0.6 L-1.7,1.5 Z" fill="currentColor" />
              </g>
            </svg>

            {/* Destinations */}
            {DEST.map((d) => (
              <div
                key={d.name}
                className={`dest dest-${d.slug} absolute z-10 -translate-x-1/2 -translate-y-full`}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
              >
                <span className="flex flex-col items-center">
                  <span className="whitespace-nowrap rounded-full bg-emerald px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide text-warm shadow-lift">
                    {d.name}
                  </span>
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-warm" />
                </span>
              </div>
            ))}
          </div>

          {/* Title */}
          <div className="vn-title text-center md:text-left [will-change:transform,opacity]">
            <p className="eyebrow text-leather">Việt Nam thức giấc</p>
            <h1 className="mt-3 font-serif font-[460] leading-[0.9] tracking-[-0.03em] text-emerald text-[clamp(3rem,9vw,7rem)]">
              VIỆT
              <br />
              NAM
            </h1>
            <p className="mx-auto mt-5 max-w-sm text-ink-soft md:mx-0">
              Một dải đất hình chữ S — và một hành trình đang chờ được vẽ nên.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Downloaded SVG assets (public/) tinted with the brand palette via CSS mask.
const mask = (url: string, size = "contain", pos = "center") => ({
  WebkitMaskImage: `url(${url})`,
  maskImage: `url(${url})`,
  WebkitMaskSize: size,
  maskSize: size,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: pos,
  maskPosition: pos,
});

function Cloud({ className = "" }: { className?: string }) {
  // OpenClipart fluffy cloud (public domain), masked + tinted soft.
  return (
    <div
      aria-hidden
      className={`absolute aspect-[1.6/1] bg-warm blur-[2px] ${className}`}
      style={mask("/cloud.svg")}
    />
  );
}

function Ridge({ d, className = "" }: { d: string; className?: string }) {
  // Clean smooth solid ridgeline; fill comes from the `text-…` class.
  // Extra-wide (320%, ~1.1 screens of overhang each side) so it never reveals
  // a gap no matter how far the layer parallaxes.
  return (
    <svg
      aria-hidden
      viewBox="0 0 2400 360"
      preserveAspectRatio="none"
      className={`absolute inset-x-[-110%] bottom-0 w-[320%] fill-current ${className}`}
    >
      <path d={d} />
    </svg>
  );
}

function PaperPlane() {
  // Phosphor paper-plane-tilt-fill.svg — nose already points upper-right.
  return (
    <div
      aria-hidden
      className="aspect-square w-full bg-warm drop-shadow-[0_8px_12px_rgba(13,42,32,0.4)]"
      style={mask("/paper-plane.svg")}
    />
  );
}
