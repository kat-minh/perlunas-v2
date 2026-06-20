"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Plane, ArrowUpRight } from "lucide-react";
import type { Tour } from "@/lib/content";
import { formatVND } from "@/lib/utils";

interface BoardingPassProps {
  tour: Tour;
  onOpen: (tour: Tour) => void;
}

/** Image-led destination card. Click unfolds the full boarding pass (modal). */
export function BoardingPass({ tour, onOpen }: BoardingPassProps) {
  return (
    <motion.article
      layoutId={`pass-${tour.id}`}
      whileHover="h"
      initial="i"
      onClick={() => onOpen(tour)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(tour);
        }
      }}
      aria-label={`Xem hành trình ${tour.to}`}
      data-cursor="hover"
      className="group relative flex aspect-[3/4] cursor-pointer flex-col justify-end overflow-hidden rounded-[1.4rem] bg-emerald-deep text-warm shadow-paper"
    >
      <motion.div
        className="pass-photo absolute inset-0"
        variants={{ i: { scale: 1.04 }, h: { scale: 1.12 } }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={tour.image}
          alt={`${tour.to} — ${tour.vibe}`}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 30vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/25 to-transparent" />

      {/* Top meta */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <span className="rounded-full bg-warm/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
          {tour.region}
        </span>
        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-warm/70">
          {tour.code}
        </span>
      </div>

      {/* Bottom content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-gold-soft">
          <span>{tour.from}</span>
          <span className="h-px w-5 bg-gold-soft/50" />
          <Plane className="h-3.5 w-3.5" />
          <span className="h-px w-5 bg-gold-soft/50" />
          <span>{tour.to}</span>
        </div>

        <h3 className="mt-2 font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[0.95]">
          {tour.to}
        </h3>
        <p className="mt-2 text-sm text-warm/70">{tour.vibe}</p>

        <div className="mt-5 flex items-end justify-between border-t border-warm/15 pt-4">
          <div>
            <span className="text-[0.6rem] uppercase tracking-[0.18em] text-warm/55">
              {tour.days} · chỉ từ
            </span>
            <p className="font-serif text-xl text-gold-soft">
              {formatVND(tour.price)}
            </p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-warm/15 transition-colors group-hover:bg-gold group-hover:text-emerald-deep">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
