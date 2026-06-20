"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plane, ArrowRight } from "lucide-react";
import { tours } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE 7/10 — CHOOSE YOUR JOURNEY (explore-our-homes interaction, measured
 * from the reference): LARGE portrait cards (~0.73 ratio), heavily overlapped,
 * with subtle distinct tilts. Hover lifts gently. Click ENLARGES the card
 * (~1.1×) and SPREADS its neighbours far aside to open room, flipping it to the
 * real photo + details. Fan / reveal / flip live on separate elements so they
 * never fight — hover always returns to the exact resting tilt.
 */
const PASSES = tours.slice(0, 4);
const ROT = [-4, -1, 2, 5];
const ARC = [9, 0, 5, 12];
const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

export function BoardingPasses() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      gsap.from(".pass-reveal", {
        y: 64,
        autoAlpha: 0,
        stagger: 0.12,
        ease: "power3.out",
        duration: 0.9,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  const transform = (i: number) => {
    if (reduced) return undefined;
    if (open === i) return "rotate(0deg) translateY(-28px) scale(1.1)";
    if (open !== null) {
      // A card is open: neighbours stay spread aside. Hovering one only lifts it
      // GENTLY in place (no jump back to centre) so the motion stays subtle.
      const dir = i < open ? -1 : 1;
      const lift = hover === i ? -16 : 0;
      const sc = hover === i ? 1 : 0.94;
      return `rotate(${ROT[i % ROT.length]}deg) translate(${dir * 250}px, ${lift}px) scale(${sc})`;
    }
    if (hover === i) return "rotate(0deg) translateY(-16px) scale(1.04)";
    return `rotate(${ROT[i % ROT.length]}deg) translateY(${ARC[i % ARC.length]}px)`;
  };

  return (
    <section
      ref={root}
      id="hanh-trinh"
      className="relative overflow-hidden bg-emerald-deep py-24 text-warm md:py-32"
    >
      <div className="paper-grain absolute inset-0 opacity-15" aria-hidden />
      <div className="shell relative z-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold/60" />
          <span className="eyebrow text-gold/80">Chọn hành trình của bạn</span>
        </div>
        <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2rem,5vw,3.6rem)] leading-[1.02]">
          Mỗi tấm vé, một chuyến đi đang chờ
        </h2>
        <p className="mt-4 max-w-md text-sm text-warm/70">
          Rê chuột để nâng tấm vé · bấm để mở to và xem hành trình phía sau.
        </p>

        <ul className="mt-20 flex min-h-[34rem] max-w-full justify-center overflow-x-clip pb-8 [perspective:2000px]">
          {PASSES.map((t, i) => (
            <li
              key={t.id}
              className="shrink-0 origin-bottom transition-[transform,z-index] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] [&:not(:first-child)]:-ml-[10rem] md:[&:not(:first-child)]:-ml-[11rem]"
              style={{
                transform: transform(i),
                zIndex: open === i ? 80 : hover === i ? 60 : i,
              }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setOpen(open === i ? null : i)}
              data-cursor="hover"
            >
              <div className="pass-reveal">
                <div
                  className="relative h-[30rem] w-[22rem] cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]"
                  style={{ transform: open === i ? "rotateY(180deg)" : undefined }}
                >
                  {/* FRONT — boarding pass */}
                  <div
                    className="absolute inset-0 flex flex-col rounded-2xl bg-warm text-ink shadow-lift"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="flex items-center justify-between rounded-t-2xl bg-emerald px-6 py-4 text-warm">
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">
                        Boarding Pass
                      </span>
                      <Plane className="h-5 w-5 text-gold-soft" />
                    </div>
                    <div className="perforation h-3 w-full" aria-hidden />
                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-soft">From</p>
                          <p className="font-serif text-2xl text-emerald">{t.from}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-leather" />
                        <div className="text-right">
                          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-soft">To</p>
                          <p className="font-serif text-2xl text-emerald">{t.to}</p>
                        </div>
                      </div>
                      <div className="mt-7 grid grid-cols-2 gap-4 text-sm">
                        <Meta label="Mã" value={t.code} />
                        <Meta label="Thời lượng" value={t.days} />
                        <Meta label="Vùng" value={t.region} />
                        <Meta label="Mùa đẹp" value={t.season} />
                      </div>
                      <div className="mt-auto flex items-end justify-between pt-6">
                        <p className="font-mono text-[0.65rem] tracking-[0.12em] text-ink-soft">
                          HTV · {t.code.replace(/\D/g, "")}
                        </p>
                        <p className="text-[0.6rem] uppercase tracking-[0.16em] text-leather">
                          Bấm để mở ↻
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BACK — the real journey */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-2xl shadow-lift"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <Image
                      src={t.image}
                      alt={`${t.from} → ${t.to}`}
                      fill
                      sizes="360px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/55 to-emerald-deep/10" />
                    <div className="absolute inset-0 flex flex-col justify-end p-7 text-warm">
                      <p className="font-serif text-3xl">{t.to}</p>
                      <p className="mt-1 text-sm text-warm/80">{t.vibe}</p>
                      <ul className="mt-4 space-y-1.5">
                        {t.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-sm text-warm/85">
                            <span className="h-1 w-1 rounded-full bg-gold" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="font-serif text-xl text-gold-soft">{vnd(t.price)}</span>
                        <a
                          href="#lien-he"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-emerald-deep"
                          data-cursor="hover"
                        >
                          Chọn chuyến này
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-soft">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
