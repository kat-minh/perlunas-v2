"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { SceneImage } from "./SceneImage";

/**
 * Agoda-style photo gallery: a big lead image + a 2×2 grid of smaller ones, with
 * a "Xem tất cả ảnh" button. Clicking any photo opens a full-screen lightbox
 * with prev/next and a thumbnail strip. Stays on the page (no navigation).
 */
export function HotelGallery({ images, alt }: { images: string[]; alt: string }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const show = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  // 3 equal-width columns, each a fixed-height stack. Inside each column the
  // tiles split the height with different ratios → varied (not equal) heights,
  // but every column totals the same height so the bottoms line up flush.
  const tiles = images.slice(0, 6);

  const tile = (i: number, growCls: string) => (
    <button
      key={i}
      type="button"
      onClick={() => show(i)}
      className={clsx("group relative min-h-0 overflow-hidden", growCls)}
    >
      <SceneImage
        seed={tiles[i]}
        alt={i === 0 ? alt : `${alt} — ảnh ${i + 1}`}
        w={700}
        h={800}
        priority={i === 0}
        className="h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />
    </button>
  );

  const colCls = "flex flex-col gap-2 sm:gap-3";

  return (
    <>
      <div className="grid h-[26rem] grid-cols-3 grid-rows-1 gap-2 sm:h-[42rem] sm:gap-3">
        <div className={colCls}>
          {tile(0, "flex-[7]")}
          {tile(3, "flex-[5]")}
        </div>
        <div className={colCls}>
          {tile(1, "flex-[5]")}
          {tile(4, "flex-[7]")}
        </div>
        <div className={colCls}>
          {tile(2, "flex-[8]")}
          {tile(5, "flex-[5]")}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => show(0)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ink"
        >
          <Images className="h-4 w-4" />
          <span className="link-underline">Xem tất cả {images.length} ảnh</span>
        </button>
      </div>

      {open && <Lightbox images={images} alt={alt} idx={idx} setIdx={setIdx} onClose={() => setOpen(false)} />}
    </>
  );
}

export function Lightbox({
  images,
  alt,
  idx,
  setIdx,
  onClose,
}: {
  images: string[];
  alt: string;
  idx: number;
  setIdx: (i: number) => void;
  onClose: () => void;
}) {
  const n = images.length;
  const go = (d: number) => setIdx((idx + d + n) % n);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-ink/90" role="dialog" aria-modal="true" aria-label="Thư viện ảnh">
      <div className="flex items-center justify-between px-5 py-4 text-paper">
        <span className="text-sm">{idx + 1} / {n}</span>
        <button type="button" onClick={onClose} aria-label="Đóng" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper/10">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-16">
        <button type="button" onClick={() => go(-1)} aria-label="Ảnh trước" className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-paper/15 text-paper hover:bg-paper/25">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="max-h-[72vh] w-full max-w-4xl overflow-hidden">
          <SceneImage key={images[idx]} seed={images[idx]} alt={`${alt} — ảnh ${idx + 1}`} w={1600} h={1000} priority className="!h-auto !max-h-[72vh] !w-full !object-contain" />
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Ảnh tiếp theo" className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-paper/15 text-paper hover:bg-paper/25">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div data-lenis-prevent className="flex gap-2 overflow-x-auto px-5 py-4">
        {images.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setIdx(i)}
            className={clsx(
              "h-16 w-24 shrink-0 overflow-hidden transition-opacity",
              i === idx ? "opacity-100 ring-2 ring-paper" : "opacity-50 hover:opacity-90",
            )}
          >
            <SceneImage seed={s} alt="" w={240} h={160} />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
