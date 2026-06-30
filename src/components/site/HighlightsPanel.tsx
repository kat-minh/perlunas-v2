"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Check, ChevronDown } from "lucide-react";

export type HiPoint = { label?: string; text: string };
export type HiGroup = { title: string; intro?: string; points?: HiPoint[] };

/**
 * "Điểm nổi bật trong tour" — one large panel listing the highlights by group.
 * Collapsed it shows the first group; a "Xem thêm / Thu gọn" toggle sits in the
 * bottom-right corner to reveal the rest.
 */
export function HighlightsPanel({ groups }: { groups: HiGroup[] }) {
  const [open, setOpen] = useState(false);
  const shown = open ? groups : groups.slice(0, 1);

  return (
    <div className="border border-[var(--line)] bg-paper-2 p-6 sm:p-8">
      <ul className="space-y-6">
        {shown.map((g) => (
          <li key={g.title}>
            <p className="flex items-center gap-2 font-serif text-xl text-ink">
              <Check className="h-5 w-5 shrink-0 text-ink/55" strokeWidth={2} />
              {g.title}
            </p>
            {g.intro && (
              <p className="mt-2 text-pretty leading-relaxed text-ink/75">{g.intro}</p>
            )}
            {g.points && (
              <ul className="mt-2 list-disc space-y-1.5 pl-9 marker:text-ink/30">
                {g.points.map((p) => (
                  <li key={p.label ?? p.text} className="text-pretty leading-relaxed text-ink/75">
                    {p.label && <span className="font-medium text-ink">{p.label}: </span>}
                    {p.text}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {groups.length > 1 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink"
          >
            <span className="link-underline">{open ? "Thu gọn" : "Xem thêm"}</span>
            <ChevronDown className={clsx("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
        </div>
      )}
    </div>
  );
}
