/**
 * Editable page copy + images, addressed by stable dotted keys (e.g.
 * "home.hero.title"). DEFAULTS below capture every editorial string/image
 * currently hardcoded in the real site (see page-content.json). At runtime
 * `getPageContentMap()` fetches the live values from the API and merges them
 * over the defaults, so the site renders identically when the API is DOWN.
 *
 * Server parents call getPageContentMap() once and pass the resulting plain
 * Record<string,string> down to client section components, which read strings
 * via pc(map, key).
 */
import DEFAULTS_RAW from "@/lib/page-content.json";
import { API_BASE_URL } from "@/lib/api";

export type PageContentItem = {
  key: string;
  page: string;
  label: string;
  kind: "text" | "textarea" | "image";
  value: string;
};

export type PageContentMap = Record<string, string>;

const DEFAULTS = DEFAULTS_RAW as PageContentItem[];

/** Defaults flattened to a key→value map. */
const DEFAULT_MAP: PageContentMap = Object.fromEntries(
  DEFAULTS.map((d) => [d.key, d.value]),
);

/**
 * Fetch live page content from the API and merge it over the bundled defaults.
 * On ANY error (network, non-2xx, bad JSON, API down) returns the defaults so
 * the build and rendering never depend on the API being reachable.
 */
export async function getPageContentMap(): Promise<PageContentMap> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/page-content`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`/api/page-content responded ${res.status}`);
    const rows = (await res.json()) as Array<{ key?: string; value?: string }>;
    const merged: PageContentMap = { ...DEFAULT_MAP };
    for (const row of rows) {
      if (row?.key && typeof row.value === "string") merged[row.key] = row.value;
    }
    return merged;
  } catch (err) {
    console.warn(
      "[page-content] /api/page-content failed, using bundled defaults:",
      err,
    );
    return { ...DEFAULT_MAP };
  }
}

/** Read a value from a content map: map value → DEFAULT → "". */
export function pc(map: PageContentMap, key: string): string {
  return map[key] ?? DEFAULT_MAP[key] ?? "";
}
