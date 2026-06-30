/**
 * Deterministic "Sắp ra mắt" (coming soon) flag for tours. Based on a stable
 * hash of the slug so the same tours are always tagged — no flicker between
 * renders, no randomness that drifts on each revalidate. Tags roughly 1 in 3
 * tours ("random vài cái"). Replace with a real CMS field when tours carry a
 * status of their own.
 */
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function isComingSoon(slug: string): boolean {
  return hashSlug(slug) % 10 < 4;
}
