import { ImageResponse } from "next/og";
import { Mark } from "@/lib/icon-mark";

// Maskable PWA icon — full-bleed ink tile with the mark inside the safe zone,
// so Android can crop it to any shape. Served at /icon-maskable.png.
export function GET() {
  return new ImageResponse(<Mark size={512} invert />, { width: 512, height: 512 });
}
