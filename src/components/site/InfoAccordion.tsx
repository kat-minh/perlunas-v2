"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

export type InfoBlock = { subtitle?: string; lines: string[] };
export type InfoItem = { title: string; blocks: InfoBlock[] };

/**
 * "Thông tin quan trọng về tour" — single-open accordion (same behaviour as the
 * itinerary): clicking a row expands it in place; opening another collapses the
 * previous. Each row holds one or more blocks (optionally sub-titled, e.g.
 * "Ngày thường" / "Ngày lễ") rendered as bullet lists.
 */
export function InfoAccordion({ items }: { items: InfoItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-y border-[var(--line)]">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title} className={clsx(i > 0 && "border-t border-[var(--line-soft)]")}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-pretty font-medium text-ink">{it.title}</span>
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
                <div className="space-y-4">
                  {it.blocks.map((b, bi) => (
                    <div key={b.subtitle ?? bi}>
                      {b.subtitle && (
                        <p className="mb-1.5 font-medium text-ink">{b.subtitle}</p>
                      )}
                      <ul className="list-disc space-y-1.5 pl-5 marker:text-ink/30">
                        {b.lines.map((l) => (
                          <li key={l} className="text-pretty leading-relaxed text-ink/75">
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
