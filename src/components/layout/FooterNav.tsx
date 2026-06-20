"use client";

import { nav } from "@/lib/site";
import { ScrollTrigger } from "@/lib/gsap";

type Lenis = { scrollTo: (t: number, o?: object) => void };

export function FooterNav() {
  const go = (st: string, frac: number) => {
    const trigger = ScrollTrigger.getById(st);
    const y = trigger ? trigger.start + (trigger.end - trigger.start) * frac : 0;
    const l = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (l) l.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <ul className="mt-4 space-y-2.5 text-sm">
      {nav.map((item) => (
        <li key={item.label}>
          <button
            onClick={() => go(item.st, item.frac)}
            className="text-warm/70 transition-colors hover:text-gold"
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
