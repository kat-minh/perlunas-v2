import { clsx } from "clsx";

/**
 * Pearl badge for the three combo tiers, drawn with a CSS radial gradient (no
 * asset / no SVG id clashes). Colours follow the real pearl families:
 *  - Akoya     → ngọc trai hồng (rosé/pink)
 *  - Tahiti    → ngọc trai đen ánh xanh–lục–tím (peacock dark)
 *  - South Sea → ngọc trai vàng (golden)
 */
const PEARL: Record<string, { light: string; mid: string; dark: string }> = {
  Akoya: { light: "#FFF1F5", mid: "#F2BFD0", dark: "#CB7A9C" },
  Tahiti: { light: "#6FA295", mid: "#2A3A41", dark: "#0D141A" },
  "South Sea": { light: "#FBEFC2", mid: "#E6C257", dark: "#AD831F" },
};

export function PearlIcon({
  tier,
  className,
}: {
  tier: string;
  className?: string;
}) {
  const c = PEARL[tier] ?? PEARL.Akoya;
  return (
    <span
      aria-hidden
      className={clsx("inline-block shrink-0 rounded-full", className)}
      style={{
        background: `radial-gradient(circle at 34% 30%, ${c.light} 0%, ${c.mid} 48%, ${c.dark} 100%)`,
        boxShadow:
          "inset 0 -2px 4px rgba(0,0,0,0.28), inset 1px 1px 3px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.25)",
      }}
    />
  );
}
