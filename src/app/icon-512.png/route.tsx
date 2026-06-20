import { ImageResponse } from "next/og";
import { Mark } from "@/lib/icon-mark";

// PWA manifest icon (512) — served at /icon-512.png.
export function GET() {
  return new ImageResponse(<Mark size={512} />, { width: 512, height: 512 });
}
