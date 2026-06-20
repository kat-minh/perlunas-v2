"use client";

import { useRef, createElement, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface GsapTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Split granularity. */
  split?: "words" | "chars";
  stagger?: number;
  delay?: number;
}

/**
 * GSAP-driven split-text MASK REVEAL.
 *
 * Each word/char is wrapped in an overflow-hidden mask and swept up from below
 * with a scrubless ScrollTrigger on enter — a cinematic alternative to a plain
 * fade. The plain `text` is always in the DOM (inside the spans) for SEO/a11y.
 */
export function GsapText({
  text,
  as = "h2",
  className,
  split = "words",
  stagger = 0.06,
  delay = 0,
}: GsapTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const tokens =
    split === "chars" ? Array.from(text) : text.split(/(\s+)/);

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.from(ref.current.querySelectorAll<HTMLElement>("[data-tok]"), {
        yPercent: 120,
        rotate: 4,
        duration: 0.9,
        ease: "power3.out",
        stagger,
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    { dependencies: [reduced, stagger, delay] },
  );

  return createElement(
    as,
    { ref, className: cn("inline-block", className), "aria-label": text },
    tokens.map((tok, i) =>
      /^\s+$/.test(tok) ? (
        <span key={i} aria-hidden> </span>
      ) : (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <span data-tok className="inline-block will-change-transform">
            {tok}
          </span>
        </span>
      ),
    ) as ReactNode,
  );
}
