"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plane } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Opening curtain — a paper plane glides across a dashed horizon, the brand
 * fades up, then the curtain lifts to reveal the hero.
 *
 * Rendered from the FIRST paint (server-side too, `done` starts false on both
 * server and client so there's no hydration mismatch) so it covers the page
 * immediately — no flash of the content underneath before it appears. An inline
 * background guarantees coverage even before the stylesheet resolves.
 */
export function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const t = setTimeout(() => setDone(true), reduce.matches ? 200 : 2100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-emerald-deep text-warm"
          style={{ backgroundColor: "#0d2a20" }}
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative h-24 w-[min(72vw,520px)] overflow-hidden">
            {/* Dashed horizon — curved to trace the same arc the plane flies */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 520 96"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden
            >
              <path
                d="M0,66 Q260,-10 520,66"
                stroke="rgba(217,185,106,0.55)"
                strokeWidth={1}
                strokeDasharray="6 6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* Plane glides across on a clear curved arc, banking to follow it */}
            <motion.div
              className="absolute top-1/2 text-gold"
              initial={{ left: "-12%", y: 18, rotate: -14 }}
              animate={{
                left: "104%",
                y: [18, -6, -20, -6, 18],
                rotate: [-14, -7, 0, 7, 14],
              }}
              transition={{
                duration: 1.9,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
            >
              <Plane className="h-7 w-7 -rotate-[8deg]" strokeWidth={1.5} />
            </motion.div>
          </div>

          <motion.p
            className="mt-7 font-serif text-2xl tracking-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {site.name}
          </motion.p>
          <motion.p
            className="mt-2 text-[0.7rem] uppercase tracking-[0.34em] text-warm/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Xếp hành lý cho chuyến đi…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
