"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  /** Travel distance in % of the element height. */
  speed?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Reusable scroll parallax (Strict-Mode-safe via useGSAP). Moves its content on
 * the Y axis as the section crosses the viewport, scrubbed to Lenis.
 */
export function Parallax({
  children,
  speed = 12,
  className,
  as: Tag = "div",
}: ParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { yPercent: -speed / 2 },
        {
          yPercent: speed / 2,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { dependencies: [reduced, speed] },
  );

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}
