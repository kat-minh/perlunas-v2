/**
 * "Mục đích chuyến đi" — trip-purpose taxonomy used by the hotels listing. Each
 * purpose has a colour; the PERLUNAS mark next to a hotel name is tinted with it
 * to suggest which trips the stay suits. Until the backend carries this field,
 * `hotelPurposes()` assigns 1–2 purposes per hotel deterministically by slug.
 */
export const PURPOSES = [
  { key: "Nghỉ dưỡng", color: "#3F9D6B" }, // xanh lá
  { key: "Tham quan", color: "#D6A12B" }, // vàng
  { key: "Công tác", color: "#C24A33" }, // đỏ
  { key: "Thăm thân", color: "#8159A6" }, // tím
] as const;

export type PurposeKey = (typeof PURPOSES)[number]["key"];

export const purposeColor = (key: string): string =>
  PURPOSES.find((p) => p.key === key)?.color ?? "#1a1813";

/** Stable mock assignment of trip purposes to a hotel (1–2 purposes). */
export function hotelPurposes(slug: string): string[] {
  const hash = Array.from(slug).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const keys = PURPOSES.map((p) => p.key);
  const primary = keys[hash % keys.length];
  const second = keys[Math.floor(hash / 7) % keys.length];
  return primary === second ? [primary] : [primary, second];
}

/** Stable mock assignment of trip purposes to a combo (1–2 purposes). */
export const comboPurposes = (slug: string): string[] => hotelPurposes(slug);
