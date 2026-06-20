"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/gsap";

/**
 * Lenis owns the entire scroll experience and is driven by the GSAP ticker —
 * a single clock for the scroller and every ScrollTrigger, so scrub animations
 * stay perfectly in sync. A very low `lerp` (0.05) gives the heavy, "đầm",
 * cinematic glide the brief asks for.
 *
 * Native browser scrolling is replaced; reduced-motion users keep native scroll.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const { gsap, ScrollTrigger } = ensureGsap();

    if (reduce.matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.05, // extremely smooth, weighty, cinematic glide
      smoothWheel: true,
      // Leave touch native: syncTouch hijacks every touchmove (preventDefault),
      // which blocks the native horizontal swipe of the card strips on mobile.
      // Native touch still has momentum and ScrollTrigger scrubs fine off it.
      syncTouch: false,
      touchMultiplier: 1.4,
    });

    // Keep every ScrollTrigger perfectly aware of Lenis-driven scrolling.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (one RAF loop for the whole app).
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Recompute trigger positions after the things that change layout height:
    // late images, web fonts, the loading curtain lift, and lazy sections.
    const refresh = () => ScrollTrigger.refresh();
    const timers = [400, 1200, 2300].map((ms) => window.setTimeout(refresh, ms));
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    const imgs = Array.from(document.images);
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });

    refresh();

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(update);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
