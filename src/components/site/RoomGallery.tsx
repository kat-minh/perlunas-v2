"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Images } from "lucide-react";
import { SceneImage } from "./SceneImage";
import { Lightbox } from "./HotelGallery";

/**
 * Room-type photo carousel. Auto-advances through the room's photos with a
 * cross-fade (pauses on hover); clicking opens the shared lightbox at the
 * current photo. Stays on the page.
 */
export function RoomGallery({
  images,
  alt,
  interval = 3500,
  startDelay = 0,
}: {
  images: string[];
  alt: string;
  /** ms between auto-advances */
  interval?: number;
  /** ms before this carousel starts (stagger multiple cards) */
  startDelay?: number;
}) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = images.length;
  const curRef = useRef(cur);
  curRef.current = cur;

  useEffect(() => {
    if (open || paused || n <= 1) return;
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      id = setInterval(() => setCur((c) => (c + 1) % n), interval);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [open, paused, n, interval, startDelay]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="group relative block h-full w-full overflow-hidden"
        aria-label={`Xem ảnh ${alt}`}
      >
        {images.map((s, i) => (
          <SceneImage
            key={s}
            seed={s}
            alt={i === 0 ? alt : `${alt} — ảnh ${i + 1}`}
            w={640}
            h={480}
            priority={i === 0}
            className={clsx(
              "absolute inset-0 h-full transition-opacity duration-700 ease-out",
              i === cur ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        {/* keep the box sized even though images are absolute */}
        <span className="invisible block h-full w-full" />

        {n > 1 && (
          <>
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 bg-paper/90 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur-sm transition-colors group-hover:bg-paper">
              <Images className="h-3.5 w-3.5" />
              {n} ảnh
            </span>
            <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((s, i) => (
                <span
                  key={s}
                  className={clsx(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i === cur ? "bg-paper" : "bg-paper/40",
                  )}
                />
              ))}
            </span>
          </>
        )}
      </button>

      {open && (
        <Lightbox images={images} alt={alt} idx={cur} setIdx={setCur} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
