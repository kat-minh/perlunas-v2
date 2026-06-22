/**
 * Client-safe Lucide icon lookup by NAME.
 *
 * The API serves `reasons` / `categories` icons as Lucide component-name strings
 * (e.g. "Compass"). Render with `iconByName[icon] ?? FallbackIcon`. Keep this map
 * limited to the icons the content actually uses so the client bundle stays lean.
 */
import {
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Plane,
  Building2,
  Route,
  BedDouble,
  Wallet,
  Headset,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export const iconByName: Record<string, LucideIcon> = {
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Plane,
  Building2,
  Route,
  BedDouble,
  Wallet,
  Headset,
  LifeBuoy,
};

/** Used when an icon name is missing or unknown. */
export const FallbackIcon: LucideIcon = Sparkles;

export function resolveIcon(name: string | undefined): LucideIcon {
  return (name && iconByName[name]) || FallbackIcon;
}
