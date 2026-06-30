"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { pc, type PageContentMap } from "@/lib/page-content";

/**
 * The philosophy statement below the hero. The words start dim and brighten one
 * by one as the block scrolls up through the viewport (scroll-linked word
 * reveal). Copy comes from page content.
 */
export function Philosophy({ map }: { map: PageContentMap }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "start 0.28"],
  });
  const words = pc(map, "home.philosophy.text").split(" ");

  return (
    <section id="triet-ly" className="relative px-6 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p
          ref={ref}
          className="flex flex-wrap gap-x-[0.28em] gap-y-2 font-light text-[1.6rem] leading-[1.5] text-ink sm:text-[2.2rem] sm:leading-[1.45]"
        >
          <span className="text-ink/30">“</span>
          {words.map((word, i) => (
            <Word
              key={`${word}-${i}`}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              dim={!reduce}
            >
              {word}
            </Word>
          ))}
          <span className="text-ink/30">”</span>
        </p>

        <footer className="mt-8 text-right">
          <p className="signature text-3xl leading-none text-ink sm:text-4xl">{pc(map, "home.philosophy.author")}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-mute">
            {pc(map, "home.philosophy.role")}
          </p>
        </footer>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  dim,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dim: boolean;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity: dim ? opacity : 1 }}>{children}</motion.span>
  );
}
