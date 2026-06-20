"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plane, ArrowRight, Quote } from "lucide-react";
import { tours, stories } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { LeadForm } from "@/components/ui/LeadForm";

const planeMask = {
  WebkitMaskImage: "url(/paper-plane.svg)",
  maskImage: "url(/paper-plane.svg)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
} as const;

/**
 * BOARDING PASSES + MEMORIES + ARRIVAL FORM on ONE canvas. One pinned viewport
 * whose three panels crossfade as you scroll, so the whole "choose → remember →
 * contact" flow shares a single stage with no section seams. The crossfade only
 * tweens opacity, so whichever panel is on screen stays fully interactive (cards
 * hover/click, form fillable); the bright form panel ends the descent.
 */
const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

export function JourneyDeck() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // On phones the deck is NOT a pinned cinematic canvas: boarding + memory sit
  // together as one normal section and the CTA stands on its own below, both
  // scrolling naturally. (Pinning + scroll-jacking a tall form is bad on mobile.)
  const isMobile = useMediaQuery("(max-width: 767px)");

  useGSAP(
    () => {
      // Decide with a LIVE media query, not the isMobile state. This callback
      // runs once after the first paint, so on a phone it skips pin creation
      // entirely — there's no pinned ScrollTrigger to tear down when we swap to
      // the mobile DOM, hence no orphaned .pin-spacer left stuck on screen.
      if (reduced || window.matchMedia("(max-width: 767px)").matches || !root.current)
        return;
      gsap.set([".deck-mem", ".deck-contact"], { autoAlpha: 0 });
      gsap.set(".cta-plane", { autoAlpha: 0, xPercent: 240, yPercent: -200, rotate: 30 });
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "st-deck",
          trigger: root.current,
          start: "top top",
          end: "+=520%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      // Each scene now gets a real hold so it doesn't flash past on a light
      // scroll. Boarding reads from 0, memories holds ~1.6 units, then the CTA.
      tl.to(".deck-board", { autoAlpha: 0, yPercent: -6, ease: "none", duration: 0.8 }, 1.2)
        .fromTo(".deck-mem", { autoAlpha: 0, yPercent: 6 }, { autoAlpha: 1, yPercent: 0, ease: "none", duration: 0.8 }, 1.6)
        // long dwell on the memories before they leave
        .to(".deck-mem", { autoAlpha: 0, yPercent: -6, ease: "none", duration: 0.8 }, 4.0)
        .fromTo(".deck-contact", { autoAlpha: 0, yPercent: 6 }, { autoAlpha: 1, yPercent: 0, ease: "none", duration: 0.8 }, 4.4)
        // the arrival plane glides in from the top-right and lands above the heading
        .to(".cta-plane", { autoAlpha: 1, xPercent: 0, yPercent: 0, rotate: 6, ease: "power2.out", duration: 1 }, 4.5)
        // hold so the form sits stable & fillable at the end of the pin
        .to({}, { duration: 1.4 }, 5.6);
    },
    { scope: root, dependencies: [reduced] },
  );

  // Phones (and reduced-motion): plain stacked sections, CTA on its own canvas.
  if (reduced || isMobile) {
    return (
      <>
        <section className="bg-emerald-deep py-16 text-warm">
          <BoardingFan />
          <div className="mt-16">
            <MemoryFan />
          </div>
        </section>
        <section
          id="lien-he"
          className="flex min-h-svh flex-col justify-center bg-gradient-to-b from-ivory via-warm to-[#f0e4c8] py-16 text-ink"
        >
          <ContactPanel />
        </section>
      </>
    );
  }

  return (
    <section
      ref={root}
      id="lien-he"
      className="relative h-svh min-h-[680px] w-full overflow-hidden bg-emerald-deep text-warm"
    >
      <div className="paper-grain absolute inset-0 opacity-15" aria-hidden />
      <div className="deck-board absolute inset-0 flex flex-col justify-center [will-change:transform,opacity]">
        <BoardingFan />
      </div>
      <div className="deck-mem absolute inset-0 flex flex-col justify-center [will-change:transform,opacity]">
        <MemoryFan />
      </div>
      <div className="deck-contact absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-b from-ivory via-warm to-[#f0e4c8] text-ink [will-change:transform,opacity]">
        <ContactPanel />
      </div>
    </section>
  );
}

/* ---------------- Boarding-pass fan (← Explore Our Homes) ---------------- */
const PASSES = tours.slice(0, 4);
const P_ROT = [-4, -1, 2, 5];
const P_ARC = [9, 0, 5, 12];

function BoardingFan() {
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const desk = useMediaQuery("(min-width: 768px)");

  const transform = (i: number) => {
    if (!desk) return undefined;
    if (open === i) return "rotate(0deg) translateY(-28px) scale(1.1)";
    if (open !== null) {
      const dir = i < open ? -1 : 1;
      const lift = hover === i ? -16 : 0;
      const sc = hover === i ? 1 : 0.94;
      return `rotate(${P_ROT[i % P_ROT.length]}deg) translate(${dir * 250}px, ${lift}px) scale(${sc})`;
    }
    if (hover === i) return "rotate(0deg) translateY(-16px) scale(1.04)";
    return `rotate(${P_ROT[i % P_ROT.length]}deg) translateY(${P_ARC[i % P_ARC.length]}px)`;
  };

  return (
    <div className="shell">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-gold/60" />
        <span className="eyebrow text-gold/80">Chọn hành trình của bạn</span>
      </div>
      <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.8rem,4.4vw,3.2rem)] leading-[1.02]">
        Mỗi tấm vé, một chuyến đi đang chờ
      </h2>
      <p className="mt-3 max-w-md text-sm text-warm/70">
        Rê chuột để nâng tấm vé · bấm để mở to và xem hành trình phía sau.
      </p>
      <ul className="mt-8 flex flex-col items-center gap-6 px-4 md:mt-10 md:flex-row md:items-end md:justify-center md:gap-0 md:px-0 md:[perspective:2000px]">
        {PASSES.map((t, i) => (
          <li
            key={t.id}
            className="origin-bottom transition-[transform,z-index] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:shrink-0 md:[&:not(:first-child)]:-ml-[11rem]"
            style={{ transform: transform(i), zIndex: open === i ? 80 : hover === i ? 60 : i }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setOpen(open === i ? null : i)}
            data-cursor="hover"
          >
            <div
              className="relative h-[26rem] w-[min(20rem,88vw)] cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] md:w-[19rem]"
              style={{ transform: open === i ? "rotateY(180deg)" : undefined }}
            >
              <div className="absolute inset-0 flex flex-col rounded-2xl bg-warm text-ink shadow-lift" style={{ backfaceVisibility: "hidden" }}>
                <div className="flex items-center justify-between rounded-t-2xl bg-emerald px-5 py-3 text-warm">
                  <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">Boarding Pass</span>
                  <Plane className="h-4 w-4 text-gold-soft" />
                </div>
                <div className="perforation h-3 w-full" aria-hidden />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.55rem] uppercase tracking-[0.16em] text-ink-soft">From</p>
                      <p className="font-serif text-xl text-emerald">{t.from}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-leather" />
                    <div className="text-right">
                      <p className="text-[0.55rem] uppercase tracking-[0.16em] text-ink-soft">To</p>
                      <p className="font-serif text-xl text-emerald">{t.to}</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                    <Meta label="Mã" value={t.code} />
                    <Meta label="Thời lượng" value={t.days} />
                    <Meta label="Vùng" value={t.region} />
                    <Meta label="Mùa đẹp" value={t.season} />
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-5">
                    <p className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-soft">HTV · {t.code.replace(/\D/g, "")}</p>
                    <p className="text-[0.55rem] uppercase tracking-[0.16em] text-leather">Bấm để mở ↻</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-lift" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <Image src={t.image} alt={`${t.from} → ${t.to}`} fill sizes="320px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/55 to-emerald-deep/10" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-warm">
                  <p className="font-serif text-2xl">{t.to}</p>
                  <p className="mt-1 text-xs text-warm/80">{t.vibe}</p>
                  <ul className="mt-3 space-y-1">
                    {t.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-warm/85">
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-serif text-lg text-gold-soft">{vnd(t.price)}</span>
                    <a href="#lien-he" onClick={(e) => e.stopPropagation()} className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-emerald-deep" data-cursor="hover">
                      Chọn chuyến này
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Memory fan (← A Gateway to Anywhere) ---------------- */
const M_ROT = [-8, 5, -6, 9, -4, 7];
const M_ARC = [14, 2, 17, 5, 12, 0];

function MemoryFan() {
  const [hover, setHover] = useState<number | null>(null);
  const desk = useMediaQuery("(min-width: 768px)");

  const transform = (i: number) => {
    if (!desk) return undefined;
    if (hover === i) return "rotate(0deg) translateY(-28px) scale(1.14)";
    if (hover !== null) {
      const dir = i < hover ? -1 : 1;
      const push = 120 + Math.abs(i - hover) * 40;
      return `rotate(${M_ROT[i % M_ROT.length]}deg) translate(${dir * push}px, ${M_ARC[i % M_ARC.length]}px)`;
    }
    return `rotate(${M_ROT[i % M_ROT.length]}deg) translateY(${M_ARC[i % M_ARC.length]}px)`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="px-6 text-center">
        <p className="eyebrow text-gold-soft/90">Cuốn lưu bút</p>
        <h2 className="mt-3 font-serif text-[clamp(1.8rem,5vw,3.4rem)] leading-[0.98]">
          Những khoảnh khắc thật, gửi về từ hành trình
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-warm/65">
          Rê chuột vào một tấm ảnh để nó sống dậy với màu sắc.
        </p>
      </div>
      <ul className="mt-10 flex flex-col items-center gap-6 px-4 md:mt-12 md:flex-row md:justify-center md:gap-0 md:px-0">
        {stories.map((s, i) => (
          <li
            key={s.name}
            className="origin-bottom transition-[transform,z-index] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:shrink-0 md:[&:not(:first-child)]:-ml-20"
            style={{ transform: transform(i), zIndex: hover === i ? 60 : i }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            data-cursor="hover"
          >
            <figure className={cn("w-[min(17rem,86vw)] rounded-sm bg-warm p-3 pb-4 text-ink shadow-lift ring-1 transition-shadow duration-500 md:w-[14rem]", hover === i ? "ring-gold/40" : "ring-leather/10")}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={s.image} alt={`${s.name} — ${s.trip}`} fill sizes="224px" className={cn("object-cover transition duration-500", hover === i ? "grayscale-0" : "grayscale")} />
                <span className="absolute left-2 top-2 rounded-full bg-warm/85 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-emerald">{s.tag}</span>
              </div>
              <figcaption className="px-1 pt-3">
                <Quote className="h-3.5 w-3.5 text-gold" />
                <blockquote className="mt-1 font-serif text-[0.85rem] italic leading-snug text-ink">“{s.quote}”</blockquote>
                <p className="mt-2 text-xs font-semibold text-emerald">{s.name}</p>
                <p className="text-[0.7rem] text-ink-soft">{s.trip}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Arrival / contact panel ---------------- */
function ContactPanel() {
  return (
    <div className="relative w-full">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(46vh 36vh at 50% 14%, rgba(217,185,106,0.28), transparent 70%)" }}
        aria-hidden
      />
      <div className="shell relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <div className="relative mb-6 h-14">
            <div className="cta-plane absolute left-1 top-0 h-12 w-12 bg-emerald drop-shadow-[0_6px_10px_rgba(13,42,32,0.35)]" style={planeMask} aria-hidden />
            <div className="absolute bottom-2 left-0 h-px w-40 bg-gradient-to-r from-leather/40 to-transparent" />
          </div>
          <p className="eyebrow text-leather">Điểm đến tiếp theo</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02] text-emerald">
            Where should your next journey begin?
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
            Chuyến bay vừa hạ cánh — một hành trình mới của bạn có thể bắt đầu
            ngay bây giờ. Để lại đôi dòng, chúng tôi sẽ cùng bạn phác thảo nó.
          </p>
        </div>
        <div className="w-full max-w-lg justify-self-center lg:justify-self-end">
          <LeadForm />
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.55rem] uppercase tracking-[0.16em] text-ink-soft">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
