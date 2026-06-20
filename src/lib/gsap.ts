"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

/**
 * Register every GSAP plugin once, eagerly at module load (client only), so
 * plugins are guaranteed registered before any component effect runs — this is
 * what prevents the "Cannot read properties of undefined (reading 'end')"
 * ScrollTrigger race in React 19 Strict Mode / Next dev.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);
}

/** Back-compat helper for code that still calls it; registration is eager now. */
export function ensureGsap() {
  return { gsap, ScrollTrigger, MotionPathPlugin };
}

export { gsap, ScrollTrigger, MotionPathPlugin, useGSAP };
