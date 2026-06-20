"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation } from "lucide-react";

/**
 * A small compass/needle that follows the pointer and rotates toward travel.
 * Fine-pointer devices only; hidden entirely under reduced-motion.
 */
export function CompassCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    document.documentElement.classList.add("cursor-hidden");
    setActive(true);

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const el = e.target as HTMLElement;
      setHovering(Boolean(el.closest("a, button, [data-cursor='hover']")));
    };

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 will-change-transform"
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/60 bg-warm/70 backdrop-blur-sm transition-[transform,background-color] duration-300"
        style={{ transform: hovering ? "scale(1.6)" : "scale(1)" }}
      >
        <Navigation
          className="h-3.5 w-3.5 text-forest transition-transform duration-500"
          style={{ transform: hovering ? "rotate(45deg)" : "rotate(0deg)" }}
          strokeWidth={2.2}
        />
      </div>
    </div>
  );
}
