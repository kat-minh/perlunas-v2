import Link from "next/link";
import { clsx } from "clsx";

/**
 * CTA that links to the dedicated enquiry page (/lien-he). When opened from a
 * specific section it carries the service through as a query param so the form
 * can pre-select it.
 */
export function LeadButton({
  children,
  service,
  variant = "ink",
  className,
}: {
  children: React.ReactNode;
  service?: string;
  variant?: "ink" | "paper" | "line" | "ghost";
  className?: string;
}) {
  const styles: Record<string, string> = {
    ink: "btn-ink",
    paper: "btn-paper",
    line: "border border-ink/30 text-ink hover:border-ink",
    ghost: "border border-paper/50 text-paper hover:bg-paper hover:text-ink",
  };
  const href = service
    ? `/lien-he?service=${encodeURIComponent(service)}`
    : "/lien-he";
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
