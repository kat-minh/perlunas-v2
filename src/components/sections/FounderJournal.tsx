"use client";

import { useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { founder } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE 6 — THE FOUNDER, as a travel journal.
 * Not a profile card. An open notebook whose right-hand leaves turn, one per
 * scroll beat (CSS 3D rotateY), revealing portrait → philosophy → mission →
 * keepsakes. translateZ keeps the leaves stacked correctly through the flip.
 * Reduced-motion lays the entries out as a simple column.
 */
const LEAVES = [
  {
    eyebrow: "Trang bìa",
    title: "Nhật ký người dẫn lối",
    body: `Mười hai năm, 63 tỉnh thành, và những con đường không có trên bản đồ.`,
  },
  {
    eyebrow: "Triết lý",
    title: founder.philosophy,
    body: "",
  },
  {
    eyebrow: "Sứ mệnh",
    title: "",
    body: founder.mission,
  },
];

export function FounderJournal() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const leaves = gsap.utils.toArray<HTMLElement>(".leaf");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * (leaves.length + 1),
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      tl.from(".journal", { autoAlpha: 0, y: 40, duration: 0.5 }, 0);
      leaves.forEach((leaf, i) => {
        tl.to(
          leaf,
          { rotateY: -178, ease: "power1.inOut", duration: 1 },
          0.8 + i,
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  if (reduced) {
    return (
      <section className="bg-cream py-24 text-ink">
        <div className="shell max-w-2xl">
          <p className="eyebrow">Người dẫn lối</p>
          <h2 className="mt-3 font-serif text-3xl text-emerald">{founder.name}</h2>
          <p className="mt-4 font-serif text-xl italic text-leather">{founder.philosophy}</p>
          <p className="mt-4 leading-relaxed text-ink-soft">{founder.mission}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      id="nguoi-dan-loi"
      className="relative flex h-svh min-h-[640px] items-center justify-center overflow-hidden bg-cream text-ink"
    >
      <div
        className="journal relative aspect-[3/2] w-[min(92vw,920px)]"
        style={{ perspective: "2200px" }}
      >
        {/* Left page — the constant identity */}
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-xl bg-warm shadow-lift ring-1 ring-leather/15">
          <div className="relative h-full w-full p-5">
            <div className="relative h-[64%] w-full overflow-hidden rounded-lg">
              <Image
                src={founder.portrait}
                alt={`Chân dung ${founder.name}`}
                fill
                sizes="460px"
                className="photo-wash object-cover"
              />
            </div>
            <p className="mt-4 font-serif text-2xl text-emerald">{founder.name}</p>
            <p className="text-sm text-ink-soft">{founder.role}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-leather">
              {founder.years} năm · 63 tỉnh thành
            </p>
          </div>
        </div>

        {/* Right base — last page, revealed when all leaves are turned */}
        <div className="absolute inset-y-0 right-0 flex w-1/2 flex-col justify-center rounded-r-xl bg-warm p-8 shadow-lift ring-1 ring-leather/15">
          <p className="eyebrow text-leather">Dấu ấn</p>
          <ul className="mt-4 space-y-3">
            {founder.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {h}
              </li>
            ))}
          </ul>
          <a
            href="#lien-he"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-warm"
            data-cursor="hover"
          >
            Cùng tôi viết chuyến đi của bạn
          </a>
        </div>

        {/* Turning leaves (right side) */}
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{ transformStyle: "preserve-3d" }}
        >
          {LEAVES.map((lf, i) => (
            <div
              key={i}
              className="leaf absolute inset-0 origin-left"
              style={{
                transformStyle: "preserve-3d",
                transform: `translateZ(${(LEAVES.length - i) * 2}px)`,
                zIndex: LEAVES.length - i,
              }}
            >
              {/* Front (right-facing) */}
              <div
                className="absolute inset-0 flex flex-col justify-center rounded-r-xl bg-warm p-8 shadow-paper ring-1 ring-leather/15"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="eyebrow text-leather">{lf.eyebrow}</p>
                {lf.title && (
                  <p
                    className={`mt-4 font-serif text-emerald ${
                      i === 1 ? "text-[1.6rem] italic leading-snug" : "text-2xl"
                    }`}
                  >
                    {i === 1 && <Quote className="mb-2 h-5 w-5 text-gold" />}
                    {lf.title}
                  </p>
                )}
                {lf.body && (
                  <p className="mt-4 leading-relaxed text-ink-soft">{lf.body}</p>
                )}
                <span className="absolute bottom-4 right-6 font-mono text-[0.6rem] text-leather/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              {/* Back (becomes the left page as it turns) */}
              <div
                className="absolute inset-0 rounded-l-xl bg-paper p-8 shadow-paper ring-1 ring-leather/15"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="paper-grain absolute inset-0 opacity-30" aria-hidden />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[0.66rem] uppercase tracking-[0.28em] text-ink-soft/70">
        Cuộn để lật trang
      </p>
    </section>
  );
}
