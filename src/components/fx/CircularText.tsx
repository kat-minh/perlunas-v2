"use client";

import { useId, useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface CircularTextProps {
  /** The phrase repeated around the ring (a separator is added automatically). */
  text: string;
  /** Seconds for one idle revolution. */
  spin?: number;
  className?: string;
  /** Optional element pinned at the centre of the ring. */
  children?: ReactNode;
}

/**
 * DYNAMIC TEXT WRAPPING (technique 2). Brand text is laid along a circular SVG
 * path — a rotating passport-stamp seal. It idles with a slow CSS spin and the
 * scroll position adds extra rotation, so the type literally wraps a point of
 * interest and reacts to the "camera".
 */
export function CircularText({
  text,
  spin = 22,
  className,
  children,
}: CircularTextProps) {
  const rawId = useId().replace(/:/g, "");
  const pathId = `ct-${rawId}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const phrase = `${text} • `.repeat(3);

  useGSAP(
    () => {
      if (reduced || !wrapRef.current) return;
      // Scroll adds spin on top of the idle CSS rotation.
      gsap.to(wrapRef.current, {
        rotate: 200,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    },
    { dependencies: [reduced] },
  );

  return (
    <div ref={wrapRef} className={cn("relative aspect-square", className)}>
      <svg
        viewBox="0 0 200 200"
        className={cn(
          "h-full w-full",
          !reduced && "animate-[spin_22s_linear_infinite]",
        )}
        style={{ animationDuration: `${spin}s` }}
        aria-hidden
      >
        <defs>
          <path
            id={pathId}
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>
        <text className="fill-current font-mono text-[11px] uppercase tracking-[0.34em]">
          <textPath href={`#${pathId}`} startOffset="0">
            {phrase}
          </textPath>
        </text>
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
