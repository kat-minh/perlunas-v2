"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

export type ItineraryDay = { title: string; meals: string; body: string };

/**
 * Lịch trình chi tiết — single-open accordion. Clicking a day expands its
 * detail in place (no navigation); opening another day collapses the one shown
 * before it.
 */
export function Itinerary({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-y border-[var(--line)]">
      {days.map((d, i) => {
        const isOpen = open === i;
        return (
          <div key={d.title} className={clsx(i > 0 && "border-t border-[var(--line-soft)]")}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-pretty font-medium text-ink">
                {d.title} <span className="font-normal text-mute">({d.meals})</span>
              </span>
              <ChevronDown
                className={clsx(
                  "h-5 w-5 shrink-0 text-ink/60 transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={clsx(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="text-pretty leading-relaxed text-ink/75">{d.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
