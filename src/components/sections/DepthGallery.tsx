"use client";

import { useRef } from "react";
import Image from "next/image";
import { tours } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * 3D SPACE ILLUSION (technique 3) — pure CSS perspective, no WebGL.
 * Destination postcards float at different depths down a corridor. A pinned
 * scrub flies the camera forward; cards rise out of the dark, swell as they
 * approach, and streak past — the viewer pilots a journey through the country.
 * Reduced-motion users get a flat, static gallery instead.
 */
const CARDS = tours.slice(0, 6).map((t, i) => ({
  to: t.to,
  region: t.region,
  image: t.image,
  offsetX: [-20, 19, -13, 22, -18, 11][i] ?? 0, // vw, lateral spread
  offsetY: [-7, 9, 5, -9, 7, -3][i] ?? 0, // vh
  rotY: [9, -11, 7, -9, 8, -6][i] ?? 0,
}));

const SPACING = 680; // gap between cards in Z
const FIRST = 500; // depth of the nearest card at rest
const PERSPECTIVE = 1100;
const FADE_NEAR = 240; // fade as a card sweeps past the camera
const FADE_FAR = 3400; // cards farther than this fade into the haze
// Camera stops just after the last card sweeps past — no empty tail.
const Z_MAX = FIRST + SPACING * (CARDS.length - 1) + 220;

export function DepthGallery() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const cards = gsap.utils.toArray<HTMLElement>(".depth-card");
      const vw = () => window.innerWidth / 100;
      const vh = () => window.innerHeight / 100;

      const render = (camZ: number) => {
        cards.forEach((el, i) => {
          const depth = FIRST + i * SPACING;
          const rel = depth - camZ; // distance ahead of camera
          const x = CARDS[i].offsetX * vw();
          const y = CARDS[i].offsetY * vh();
          el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${-rel}px) rotateY(${CARDS[i].rotY}deg)`;
          let o = 1;
          if (rel <= 0) o = 0;
          else if (rel < FADE_NEAR) o = rel / FADE_NEAR;
          else if (rel > FADE_FAR) o = Math.max(0, 1 - (rel - FADE_FAR) / 900);
          el.style.opacity = String(Math.min(1, o));
        });
      };

      render(0);
      const proxy = { z: 0 };
      gsap.to(proxy, {
        z: Z_MAX,
        ease: "none",
        onUpdate: () => render(proxy.z),
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Title drifts away as the flight begins.
      gsap.to(".depth-title", {
        autoAlpha: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=60%",
          scrub: true,
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  if (reduced) {
    return (
      <section className="bg-emerald-deep py-24 text-warm">
        <div className="shell">
          <p className="eyebrow mb-8 text-gold-soft/90">Những miền đất</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((c) => (
              <Postcard key={c.to} card={c} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      id="mien-dat"
      aria-label="Bay qua những miền đất Việt Nam"
      className="relative h-svh w-full overflow-hidden bg-emerald-deep text-warm"
    >
      <div className="paper-grain absolute inset-0 z-[1] opacity-20" aria-hidden />

      <div className="depth-title absolute inset-x-0 top-[12vh] z-20 px-6 text-center [will-change:transform,opacity]">
        <p className="eyebrow text-gold-soft/90">Cuộn để bay qua</p>
        <h2 className="mt-3 font-serif text-[clamp(2rem,6vw,4.5rem)] leading-[0.95]">
          Mỗi miền đất, một câu chuyện
        </h2>
      </div>

      {/* The 3D corridor */}
      <div
        className="absolute inset-0"
        style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 50%" }}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {CARDS.map((c) => (
            <div
              key={c.to}
              className="depth-card absolute left-1/2 top-1/2 w-[clamp(230px,25vw,390px)] [will-change:transform,opacity]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Postcard card={c} />
            </div>
          ))}
        </div>
      </div>

      {/* Depth haze */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-emerald-deep via-transparent to-emerald-deep/40" />
    </section>
  );
}

function Postcard({
  card,
}: {
  card: { to: string; region: string; image: string };
}) {
  return (
    <article
      className={cn(
        "relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lift ring-1 ring-warm/10",
      )}
    >
      <Image
        src={card.image}
        alt={card.to}
        fill
        sizes="(max-width: 768px) 80vw, 30vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/85 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[0.6rem] uppercase tracking-[0.24em] text-gold-soft/90">
          {card.region}
        </p>
        <p className="font-serif text-2xl text-warm">{card.to}</p>
      </div>
    </article>
  );
}
