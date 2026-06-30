"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SceneImage } from "./SceneImage";

/**
 * Tour image carousel (ref: travel.com.vn tour pages) — a large main photo with
 * prev/next controls and a counter, plus a thumbnail "index" strip below. The
 * thumbnail row is left-aligned (justify-start) per request. Pure client state;
 * images are seed strings resolved by SceneImage (stable per seed).
 */
export function TourGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const n = images.length;
  const go = (delta: number) => setActive((p) => (p + delta + n) % n);

  // Keep the active thumbnail in view when navigating via arrows/clicks.
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    thumbRefs.current[active]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {/* thumbnail index — vertical strip on the left */}
      {n > 1 && (
        <div
          data-lenis-prevent
          className="flex max-h-[26rem] shrink-0 flex-col gap-3 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]"
        >
          {images.map((seed, idx) => (
            <button
              key={seed}
              ref={(el) => {
                thumbRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              aria-current={idx === active}
              className={clsx(
                "relative h-16 w-20 shrink-0 overflow-hidden transition-all sm:h-20 sm:w-28",
                idx === active
                  ? "opacity-100 ring-2 ring-ink ring-offset-2 ring-offset-paper"
                  : "opacity-55 hover:opacity-90",
              )}
            >
              <SceneImage seed={seed} alt="" w={280} h={200} className="absolute inset-0" />
            </button>
          ))}
        </div>
      )}

      {/* main image */}
      <div className="group relative h-[26rem] min-w-0 flex-1 overflow-hidden bg-ink/5">
        <SceneImage
          key={images[active]}
          seed={images[active]}
          alt={`${alt} — ảnh ${active + 1}`}
          w={1600}
          h={1000}
          priority
          className="absolute inset-0"
        />

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity hover:bg-paper group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Ảnh tiếp theo"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity hover:bg-paper group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute right-4 top-4 bg-ink/65 px-3 py-1 text-xs font-medium text-paper backdrop-blur-sm">
              {active + 1}/{n}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
