import { ImageResponse } from "next/og";
import { Mark } from "@/lib/icon-mark";

// iOS home-screen icon — auto-linked by Next.js. Inverted (ink tile) so it
// reads as a solid badge on the springboard.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<Mark size={180} invert />, size);
}
