import { clsx } from "clsx";
import { Sparkles } from "lucide-react";

/**
 * Decorative corner tag marking a tour as "Sắp ra mắt" (coming soon, not yet
 * bookable). Sits flush in the top-left corner of a card; the parent must be
 * `relative`. Two tones so it inverts against its background:
 *  - "ink"   → đen ấm + chữ kem (mặc định, dùng trên trang Tour trọn gói nền sáng)
 *  - "paper" → kem + chữ đen (dùng trên homepage section nền tối)
 */
export function ComingSoonTag({
  variant = "ink",
  className,
}: {
  variant?: "ink" | "paper";
  className?: string;
}) {
  const tone =
    variant === "paper" ? "bg-paper text-ink" : "bg-ink text-paper";
  return (
    <span
      className={clsx(
        "pointer-events-none absolute left-0 top-0 z-10 inline-flex items-center gap-1.5 rounded-br-[4px] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] shadow-sm",
        tone,
        className,
      )}
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      Sắp ra mắt
    </span>
  );
}
