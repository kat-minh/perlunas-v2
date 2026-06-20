import { ImageResponse } from "next/og";
import { Mark } from "@/lib/icon-mark";

// Browser favicon — auto-linked by Next.js into <head>.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<Mark size={32} />, size);
}
