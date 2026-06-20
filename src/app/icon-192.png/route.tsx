import { ImageResponse } from "next/og";
import { Mark } from "@/lib/icon-mark";

// PWA manifest icon (192) — served at /icon-192.png.
export function GET() {
  return new ImageResponse(<Mark size={192} />, { width: 192, height: 192 });
}
