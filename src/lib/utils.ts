import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a VND price compactly, e.g. 4290000 -> "4.290.000₫". */
export function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "₫";
}
