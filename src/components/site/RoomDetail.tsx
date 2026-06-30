"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { X, Check, Users } from "lucide-react";
import { SceneImage } from "./SceneImage";

type Props = {
  name: string;
  images: string[];
  alt: string;
  guests: number;
  size: string;
  beds: string;
  amenities: string[];
  /** Optional — combo rooms are bundled into the package price, so they omit it. */
  price?: string;
  priceCompare?: string;
  desc: string;
};

/**
 * "Xem chi tiết" — opens a modal (portaled to body, so it can't be trapped by a
 * sticky/transformed ancestor) showing one room type: photos, specs, tiện nghi
 * and price. Informational only; booking stays on the sticky "Đặt phòng" form.
 */
export function RoomDetail(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[3px] border border-ink px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        Xem chi tiết
      </button>
      {open && <Modal {...props} onClose={() => setOpen(false)} />}
    </>
  );
}

function Modal({
  name,
  images,
  alt,
  guests,
  size,
  beds,
  amenities,
  price,
  priceCompare,
  desc,
  onClose,
}: Props & { onClose: () => void }) {
  const [sel, setSel] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết ${name}`}
    >
      <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={onClose} />

      <div
        data-lenis-prevent
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[var(--line)] bg-paper-2 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/80 text-ink/70 backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ảnh */}
        <div className="aspect-[16/9] w-full overflow-hidden">
          <SceneImage key={images[sel]} seed={images[sel]} alt={alt} w={1280} h={720} priority className="h-full" />
        </div>
        {images.length > 1 && (
          <div data-lenis-prevent className="flex gap-2 overflow-x-auto p-3">
            {images.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setSel(i)}
                className={clsx(
                  "h-14 w-20 shrink-0 overflow-hidden transition-opacity",
                  i === sel ? "opacity-100 ring-2 ring-ink" : "opacity-55 hover:opacity-90",
                )}
              >
                <SceneImage seed={s} alt="" w={160} h={112} className="h-full" />
              </button>
            ))}
          </div>
        )}

        {/* nội dung */}
        <div className="p-6 sm:p-8">
          <h3 className="font-serif text-2xl text-ink">{name}</h3>
          <p className="mt-2 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
            <span className="inline-flex items-center gap-1">
              <Users className="h-4 w-4" /> {guests} khách
            </span>
            <span>· {size}</span>
            <span>· {beds}</span>
          </p>

          <p className="mt-4 text-pretty leading-relaxed text-ink/75">{desc}</p>

          <h4 className="mt-6 text-sm font-medium uppercase tracking-[0.12em] text-ink">Tiện nghi</h4>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {amenities.map((a) => (
              <li key={a} className="inline-flex items-center gap-2 text-sm text-ink/75">
                <Check className="h-4 w-4 shrink-0 text-ink/45" />
                {a}
              </li>
            ))}
          </ul>

          {price && (
            <div className="mt-6 border-t border-[var(--line-soft)] pt-5 leading-tight">
              {priceCompare && (
                <span className="block text-xs text-mute line-through">{priceCompare}</span>
              )}
              <span className="font-serif text-2xl text-ink">{price}</span>
              <span className="text-sm text-mute"> / đêm</span>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
