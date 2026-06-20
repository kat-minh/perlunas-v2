"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StampProps {
  label: string;
  sub?: string;
  rotate?: number;
  className?: string;
  tone?: "forest" | "leather" | "gold";
  /** Animate as if pressed onto paper when scrolled into view. */
  inView?: boolean;
}

const tones = {
  forest: "text-forest border-forest/70",
  leather: "text-leather border-leather/70",
  gold: "text-gold border-gold/80",
};

/** A circular visa/postage stamp. Used for milestones and accents. */
export function Stamp({
  label,
  sub,
  rotate = -10,
  className,
  tone = "forest",
  inView = true,
}: StampProps) {
  return (
    <motion.div
      aria-hidden
      initial={inView ? { scale: 1.5, opacity: 0 } : false}
      whileInView={inView ? { scale: 1, opacity: 0.95 } : undefined}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 220, damping: 14 }}
      style={{ rotate: `${rotate}deg` }}
      className={cn(
        "stamp-edge flex aspect-square w-24 select-none flex-col items-center justify-center rounded-full border-2 border-dashed bg-warm/40 text-center",
        tones[tone],
        className,
      )}
    >
      <span className="px-2 font-serif text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.14em]">
        {label}
      </span>
      {sub && (
        <span className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] opacity-75">
          {sub}
        </span>
      )}
    </motion.div>
  );
}
