import { clsx } from "clsx";

/**
 * The PERLUNAS mark (crescent moon + pearl, echoing "Pearl & Luna"), tinted with
 * a colour. Used next to a hotel name to flag which trip purpose the stay suits.
 */
export function PerlunasMark({
  color,
  title,
  className,
}: {
  color: string;
  title?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={clsx("inline-block shrink-0", className)}
      style={{ color }}
    >
      <path d="M14 2.5a9.5 9.5 0 1 0 7.6 7.7A7.6 7.6 0 0 1 14 2.5z" fill="currentColor" />
      <circle cx="18.3" cy="5.7" r="2.3" fill="currentColor" />
    </svg>
  );
}
