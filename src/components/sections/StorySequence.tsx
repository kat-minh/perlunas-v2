"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The "Core" chapter of the story — a pinned, scroll-scrubbed sequence. While
 * pinned, each scroll tick crossfades one full-screen chapter into the next
 * (the camera pushes in on the outgoing image while the new one settles back),
 * its headline rising from a mask.
 *
 * Reduced-motion / no-JS fallback: the chapters simply stack as normal
 * full-height panels you scroll through — all content stays visible.
 */
const CHAPTERS = [
  {
    no: "01",
    kicker: "Khởi hành",
    title: "Mỗi cung đường là một lời mời",
    body: "Hành trình bắt đầu trước cả khi bạn lên đường — ở khoảnh khắc bạn quyết định đi chậm lại và để Việt Nam dẫn lối.",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=2400&q=80",
    alt: "Ruộng bậc thang mùa nước đổ",
  },
  {
    no: "02",
    kicker: "Đắm mình",
    title: "Sống cùng nhịp thở bản địa",
    body: "Không cưỡi ngựa xem hoa. Bạn ngồi xuống bên bếp lửa, nghe một câu chuyện, ăn một bữa cơm, và thuộc về nơi đó dù chỉ một đêm.",
    image:
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=2400&q=80",
    alt: "Khung cảnh thiên nhiên Việt Nam",
  },
  {
    no: "03",
    kicker: "Trở về",
    title: "Mang theo một Việt Nam trong tim",
    body: "Khi chuyến đi khép lại, thứ ở lại không phải tấm vé — mà là những con người, những con đèo và một phiên bản thảnh thơi hơn của chính bạn.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=80",
    alt: "Dãy núi trùng điệp lúc bình minh",
  },
];

export function StorySequence() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !stage.current) return;
      const panels = gsap.utils.toArray<HTMLElement>(".chapter");

      // Collapse the stacked-flow fallback into one pinned viewport: every
      // chapter is laid over the others, only the first one visible.
      gsap.set(stage.current, { height: "100svh" });
      gsap.set(panels, { position: "absolute", top: 0, left: 0, width: "100%" });
      gsap.set(panels.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * panels.length,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const prev = panels[i - 1];
        tl.to(prev, {
          autoAlpha: 0,
          scale: 1.12,
          ease: "power2.inOut",
          duration: 1,
        })
          .fromTo(
            panel,
            { autoAlpha: 0, scale: 1.16 },
            { autoAlpha: 1, scale: 1, ease: "power2.inOut", duration: 1 },
            "<",
          )
          .fromTo(
            panel.querySelectorAll(".chapter-rise"),
            { yPercent: 70, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              stagger: 0.08,
              ease: "power3.out",
              duration: 0.8,
            },
            "<0.25",
          );
      });

      // Brief hold so the last chapter lingers before the pin releases.
      tl.to({}, { duration: 0.5 });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      aria-label="Hành trình ba chương"
      className="relative bg-emerald-deep text-warm"
    >
      <div ref={stage} className="story-stage relative overflow-hidden">
        {CHAPTERS.map((c) => (
          <article
            key={c.no}
            className="chapter relative flex h-svh min-h-[600px] w-full items-center overflow-hidden"
          >
            {/* Cinematic backdrop */}
            <div className="chapter-media absolute inset-0">
              <Image
                src={c.image}
                alt={c.alt}
                fill
                sizes="100vw"
                className="scale-110 object-cover"
              />
              <div className="absolute inset-0 bg-emerald-deep/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/25 to-emerald-deep/60" />
            </div>
            <div className="paper-grain absolute inset-0 opacity-20" aria-hidden />

            {/* Giant chapter numeral watermark */}
            <span
              className="pointer-events-none absolute -top-[2vh] right-[3vw] select-none font-serif text-[clamp(8rem,30vw,26rem)] leading-none text-warm/[0.06]"
              aria-hidden
            >
              {c.no}
            </span>

            <div className="shell relative z-10">
              <p className="chapter-rise eyebrow text-gold-soft/90">
                Chương {c.no} · {c.kicker}
              </p>
              <h2 className="chapter-rise mt-5 max-w-4xl font-serif font-[440] leading-[0.92] tracking-[-0.025em] text-[clamp(2.4rem,7vw,5.5rem)]">
                {c.title}
              </h2>
              <div className="chapter-rise ink-rule mt-7 max-w-md opacity-50" />
              <p className="chapter-rise mt-7 max-w-xl text-base leading-relaxed text-warm/80 md:text-lg">
                {c.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
