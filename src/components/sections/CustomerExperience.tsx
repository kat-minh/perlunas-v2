"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { stories } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CustomerExperience() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const cards = gsap.utils.toArray<HTMLElement>(".polaroid");

      // [ScrollTrigger] Polaroids drop onto the scrapbook, slightly scattered.
      gsap.from(cards, {
        y: 70,
        opacity: 0,
        rotation: (i) => (i % 2 ? 8 : -8),
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".polaroid-wall", start: "top 80%", once: true },
      });

      // [ScrollTrigger] Each polaroid drifts at its own depth (parallax).
      cards.forEach((card, i) => {
        gsap.to(card, {
          yPercent: i % 2 ? -14 : -7,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="trai-nghiem"
      className="relative scroll-mt-24 overflow-hidden bg-warm py-24 md:py-32"
    >
      <div className="shell">
        <SectionHeading
          align="center"
          eyebrow="Cuốn lưu bút"
          title="Những tấm ảnh khách hàng gửi về"
          intro="Thật. Mộc. Đáng nhớ. Mỗi hành trình khép lại bằng một tấm polaroid và đôi dòng lưu bút — từ những lữ khách thật, những khoảnh khắc thật."
          className="mx-auto"
        />

        <div className="polaroid-wall mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((s) => (
            <motion.figure
              key={s.name}
              initial={{ rotate: s.rotate }}
              whileHover={{ rotate: 0, y: -10, scale: 1.03, zIndex: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="polaroid relative mx-auto max-w-[300px] rounded-sm bg-warm p-3 pb-5 shadow-lift ring-1 ring-leather/10"
              data-cursor="hover"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={s.image}
                  alt={`${s.name} — ${s.trip}`}
                  fill
                  sizes="(max-width: 768px) 80vw, 300px"
                  className="photo-wash object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-warm/85 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-emerald">
                  {s.tag}
                </span>
              </div>
              <figcaption className="px-1 pt-4">
                <Quote className="h-4 w-4 text-gold" />
                <blockquote className="mt-2 font-serif text-[0.95rem] italic leading-snug text-ink">
                  “{s.quote}”
                </blockquote>
                <p className="mt-3 text-sm font-semibold text-emerald">{s.name}</p>
                <p className="text-xs text-ink-soft">{s.trip}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
