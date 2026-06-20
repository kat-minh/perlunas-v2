"use client";

import { motion } from "motion/react";
import { reasons, stats } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";

export function WhyChooseUs() {
  return (
    <section
      id="vi-sao"
      className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 md:py-32"
    >
      {/* Parallaxed ghost watermark for depth */}
      <Parallax
        speed={40}
        className="pointer-events-none absolute -right-10 top-10 select-none font-serif text-[22vw] leading-none text-forest/[0.04] md:text-[16rem]"
      >
        Tín
      </Parallax>

      <div className="shell relative">
        <SectionHeading
          align="center"
          eyebrow="Vì sao chọn chúng tôi"
          title="Tận tâm. Tử tế. Trọn vẹn."
          intro="Không chỉ là một chuyến đi — đó là lời hứa được đóng dấu trong từng chi tiết nhỏ nhất."
          className="mx-auto"
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <motion.article
                whileHover="hover"
                initial="rest"
                className="group relative h-full overflow-hidden rounded-2xl bg-warm p-7 shadow-paper ring-1 ring-leather/10"
                data-cursor="hover"
              >
                {/* Stamp that appears on hover */}
                <motion.div
                  aria-hidden
                  variants={{
                    rest: { opacity: 0, scale: 1.5, rotate: -4 },
                    hover: { opacity: 0.18, scale: 1, rotate: -12 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="pointer-events-none absolute -right-4 -top-4 flex aspect-square w-28 items-center justify-center rounded-full border-2 border-dashed border-forest text-forest"
                >
                  <span className="font-serif text-[0.6rem] font-bold uppercase tracking-[0.14em]">
                    Đã xác nhận
                  </span>
                </motion.div>

                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                  <r.icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-serif text-xl text-emerald">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {r.body}
                </p>
              </motion.article>
            </Reveal>
          ))}
        </div>

        {/* Stats strip — like a boarding gate display */}
        <Reveal delay={0.1}>
          <div className="mt-14 grid grid-cols-2 divide-leather/15 rounded-2xl bg-emerald px-2 py-8 text-warm md:grid-cols-4 md:divide-x">
            {stats.map((s) => (
              <div key={s.label} className="px-4 text-center">
                <p className="font-serif text-4xl text-gold-soft md:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-warm/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
