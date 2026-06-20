import type { ReactElement } from "react";

/**
 * Shared brand mark for every generated icon (favicon, apple-touch, PWA icons).
 * Pure inline-styled shapes so it renders under Satori / next-og without fonts:
 * a thin ring (Luna — the moon) cradling a filled dot (Pearl) — Perlunas.
 */
const PAPER = "#f4f2ec";
const INK = "#1a1813";

export function Mark({
  size,
  invert = false,
}: {
  size: number;
  invert?: boolean;
}): ReactElement {
  const bg = invert ? INK : PAPER;
  const fg = invert ? PAPER : INK;
  const ring = Math.round(size * 0.5);
  const stroke = Math.max(2, Math.round(size * 0.045));
  const pearl = Math.round(size * 0.17);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
      }}
    >
      <div style={{ position: "relative", width: ring, height: ring, display: "flex" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${stroke}px solid ${fg}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -Math.round(pearl * 0.12),
            bottom: -Math.round(pearl * 0.12),
            width: pearl,
            height: pearl,
            borderRadius: "50%",
            background: fg,
          }}
        />
      </div>
    </div>
  );
}
