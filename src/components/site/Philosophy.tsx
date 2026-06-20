"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/**
 * The philosophy statement below the hero. The words start dim and brighten one
 * by one as the block scrolls up through the viewport (scroll-linked word
 * reveal). Copy is placeholder.
 */
const TEXT =
  "Một hành trình đẹp bắt đầu từ cảm giác bạn mang theo, không phải điểm đến. Vì thế Perlunas không tạo ra những chuyến đi rập khuôn. Chúng tôi lắng nghe từng người, rồi thiết kế một hành trình vừa vặn, chỉn chu trong từng chi tiết. Với chúng tôi, mỗi vị khách là một viên ngọc.";

export function Philosophy() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "start 0.28"],
  });
  const words = TEXT.split(" ");

  return (
    <section id="triet-ly" className="relative px-6 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
          Triết lý
        </p>
        <p
          ref={ref}
          className="mt-8 flex flex-wrap justify-center gap-x-[0.28em] gap-y-2 font-light text-[1.6rem] leading-[1.5] text-ink sm:text-[2.2rem] sm:leading-[1.45]"
        >
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
        </p>
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
