/**
 * Server-side fetch helpers for the Perlunas backend API.
 *
 * Every getter is best-effort: on ANY error (network, non-2xx, bad JSON, or the
 * API simply being down) it returns the corresponding STATIC fallback baked into
 * `catalog.ts` / `content.ts`, so the site renders identically offline and the
 * production build never depends on the API being reachable.
 *
 * Base URL comes from `process.env.API_BASE_URL` (default http://localhost:5080).
 * All getters use `{ next: { revalidate: 300 } }` (ISR) so content is cached and
 * re-fetched every 5 minutes, or immediately when the backend hits
 * `/api/revalidate` after an admin edit. Pages that consume them set
 * `export const revalidate = 300;`.
 */
import {
  HOTELS,
  TOURS,
  COMBOS,
  TIERS,
  PROVINCES,
  STAY_TYPES,
  type Hotel,
  type Tour as CatalogTour,
  type Combo,
} from "@/lib/catalog";
import { IMAGES } from "@/lib/images";

export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:5080";

/* ----------------------------------------------------------------
   Pagination envelope (mirrors the backend PagedResult<T>).
   ---------------------------------------------------------------- */
export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

/** Query params accepted by the paged list getters (only relevant keys are sent). */
export type CatalogParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  featured?: boolean;
  region?: string;
  city?: string;
  type?: string;
  tier?: string;
  stayType?: string;
};

/* ----------------------------------------------------------------
   API response types
   These mirror the SHARED CONTRACT (camelCase). They are supersets
   of the static fallback shapes — consumers only read the fields the
   fallbacks also provide, so falling back stays type-safe.
   ---------------------------------------------------------------- */
export type ApiTour = CatalogTour & {
  id?: string;
  cover?: string;
  featured?: boolean;
  sortOrder?: number;
};

export type ApiHotel = Hotel & {
  id?: string;
  cover?: string;
  sortOrder?: number;
};

export type ApiCombo = Combo & {
  id?: string;
  cover?: string;
  sortOrder?: number;
};

/** Combo service tier (Akoya/Tahiti/South Sea) editorial content. */
export type ApiComboTier = {
  id?: string;
  name: string;
  tagline: string;
  pearl: string;
  story: string;
  includes: string[];
  sortOrder?: number;
};

/** Group-tour / private-tour highlight cards (entity shape). */
export type ApiHighlightCard = {
  id?: string;
  title: string;
  image: string;
  description?: string;
  sortOrder?: number;
};

/* ----------------------------------------------------------------
   fetch helpers
   ---------------------------------------------------------------- */
async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`${path} responded ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[api] ${path} failed, using offline fallback:`, err);
    return fallback;
  }
}

/**
 * Paged fetch helper. On any error it filters + slices the static fallback so
 * listing pages still paginate offline. `filterFb` mirrors the server filters.
 */
async function getPaged<T>(
  path: string,
  params: CatalogParams,
  fallbackAll: T[],
  filterFb: (items: T[], p: CatalogParams) => T[],
): Promise<PagedResult<T>> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 12;

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("pageSize", String(pageSize));
  if (params.search) qs.set("search", params.search);
  if (params.featured != null) qs.set("featured", String(params.featured));
  if (params.region) qs.set("region", params.region);
  if (params.city) qs.set("city", params.city);
  if (params.type) qs.set("type", params.type);
  if (params.tier) qs.set("tier", params.tier);
  if (params.stayType) qs.set("stayType", params.stayType);

  try {
    const res = await fetch(`${API_BASE_URL}${path}?${qs.toString()}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`${path} responded ${res.status}`);
    const data = (await res.json()) as Partial<PagedResult<T>>;
    // Normalise: tolerate a missing/legacy shape so callers always get arrays.
    if (Array.isArray(data)) {
      const arr = data as T[];
      return { items: arr, total: arr.length, page, pageSize };
    }
    return {
      items: data.items ?? [],
      total: data.total ?? data.items?.length ?? 0,
      page: data.page ?? page,
      pageSize: data.pageSize ?? pageSize,
    };
  } catch (err) {
    console.warn(`[api] ${path} failed, using offline fallback:`, err);
    const filtered = filterFb(fallbackAll, params);
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }
}

const includes = (hay: string, needle?: string) =>
  !needle || hay.toLowerCase().includes(needle.toLowerCase());

/* ----------------------------------------------------------------
   Resource getters — each falls back to static data on any error.
   `getX()` returns ALL items (homepage/detail use); `getXPaged()` returns a
   page envelope (listing pages with server-side pagination + filtering).
   ---------------------------------------------------------------- */
export const getToursPaged = (params: CatalogParams = {}) =>
  getPaged<ApiTour>("/api/tours", params, TOURS, (items, p) =>
    items.filter(
      (t) =>
        (includes(t.name, p.search) || includes(t.region, p.search)) &&
        (!p.region || t.region === p.region) &&
        (p.featured == null || (t.featured ?? false) === p.featured),
    ),
  );

export const getTours = async (): Promise<ApiTour[]> =>
  (await getToursPaged({ pageSize: 200 })).items;

export const getTour = async (slug: string): Promise<ApiTour | undefined> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tours/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`/api/tours/${slug} responded ${res.status}`);
    return (await res.json()) as ApiTour;
  } catch (err) {
    console.warn(`[api] /api/tours/${slug} failed, using offline fallback:`, err);
    return TOURS.find((t) => t.slug === slug);
  }
};

export const getHotelsPaged = (params: CatalogParams = {}) =>
  getPaged<ApiHotel>("/api/hotels", params, HOTELS, (items, p) =>
    items.filter(
      (h) =>
        (includes(h.name, p.search) || includes(h.city, p.search)) &&
        (!p.city || h.city === p.city) &&
        (!p.type || h.type === p.type) &&
        (p.featured == null || (h.featured ?? false) === p.featured),
    ),
  );

export const getHotels = async (): Promise<ApiHotel[]> =>
  (await getHotelsPaged({ pageSize: 200 })).items;

export const getHotel = async (slug: string): Promise<ApiHotel | undefined> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/hotels/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`/api/hotels/${slug} responded ${res.status}`);
    return (await res.json()) as ApiHotel;
  } catch (err) {
    console.warn(`[api] /api/hotels/${slug} failed, using offline fallback:`, err);
    return HOTELS.find((h) => h.slug === slug);
  }
};

export const getCombosPaged = (params: CatalogParams = {}) =>
  getPaged<ApiCombo>("/api/combos", params, COMBOS, (items, p) =>
    items.filter(
      (c) =>
        (includes(c.hotelName, p.search) || includes(c.city, p.search)) &&
        (!p.city || c.city === p.city) &&
        (!p.tier || c.tier === p.tier) &&
        (!p.stayType || c.stayType === p.stayType) &&
        (p.featured == null || (c.featured ?? false) === p.featured),
    ),
  );

export const getCombos = async (): Promise<ApiCombo[]> =>
  (await getCombosPaged({ pageSize: 200 })).items;

/** Combo tiers (Akoya/Tahiti/South Sea). Falls back to the static TIERS copy. */
const TIERS_FALLBACK: ApiComboTier[] = TIERS.map((t, i) => ({
  name: t.name,
  tagline: t.tagline,
  pearl: t.pearl,
  story: t.story,
  includes: t.includes,
  sortOrder: i + 1,
}));

export const getComboTiers = () =>
  getJson<ApiComboTier[]>("/api/combo-tiers", TIERS_FALLBACK);

/* ----------------------------------------------------------------
   Managed option lists (city / stay-type / region) for the site filters.
   Returns just the names; falls back to the static taxonomy when offline.
   ---------------------------------------------------------------- */
type ApiTaxonomy = { id?: string; group: string; name: string; slug?: string; sortOrder?: number };

const TAXONOMY_FALLBACK: Record<string, string[]> = {
  city: PROVINCES.map((p) => p.name),
  "stay-type": [...STAY_TYPES],
  region: [],
};

export const getTaxonomyNames = async (group: string): Promise<string[]> => {
  const fb = (TAXONOMY_FALLBACK[group] ?? []).map((name) => ({ group, name }));
  const list = await getJson<ApiTaxonomy[]>(`/api/taxonomies?group=${group}`, fb);
  return list.map((t) => t.name).filter(Boolean);
};

/** Cities with their slug (for tiles, deep-links and image seeds). */
export type ApiCity = { name: string; slug: string };

export const getCities = async (): Promise<ApiCity[]> => {
  const fb: ApiTaxonomy[] = PROVINCES.map((p) => ({ group: "city", name: p.name, slug: p.slug }));
  const list = await getJson<ApiTaxonomy[]>(`/api/taxonomies?group=city`, fb);
  return list
    .filter((t) => t.name)
    .map((t) => ({ name: t.name, slug: t.slug || t.name }));
};

export const getCombo = async (slug: string): Promise<ApiCombo | undefined> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/combos/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`/api/combos/${slug} responded ${res.status}`);
    return (await res.json()) as ApiCombo;
  } catch (err) {
    console.warn(`[api] /api/combos/${slug} failed, using offline fallback:`, err);
    return COMBOS.find((c) => c.slug === slug);
  }
};

/* ----------------------------------------------------------------
   Group / private tour highlight cards.
   The homepage GroupTours/PrivateTour sections render these as image
   collages/segments (image + a short label = title). Fallbacks mirror the
   components' previous hardcoded image+label lists.
   ---------------------------------------------------------------- */
const GROUP_TOURS_FALLBACK: ApiHighlightCard[] = [
  { title: "Gala Dinner", image: IMAGES["perlunas-group-gala"] ?? "", description: "Gala Dinner của đoàn", sortOrder: 1 },
  { title: "Team Building", image: IMAGES["perlunas-group-team"] ?? "", description: "Team building của đoàn", sortOrder: 2 },
  { title: "Tham quan", image: IMAGES["perlunas-group-tour"] ?? "", description: "Đoàn đang tham quan", sortOrder: 3 },
];

const PRIVATE_TOURS_FALLBACK: ApiHighlightCard[] = [
  { title: "Gia đình", image: IMAGES["perlunas-private-family"] ?? "", sortOrder: 1 },
  { title: "Cặp đôi", image: IMAGES["perlunas-private-couples"] ?? "", sortOrder: 2 },
  { title: "Nhóm bạn", image: IMAGES["perlunas-private-friends"] ?? "", sortOrder: 3 },
  { title: "Trăng mật", image: IMAGES["perlunas-private-honeymoon"] ?? "", sortOrder: 4 },
  { title: "Một mình", image: IMAGES["perlunas-private-solo"] ?? "", sortOrder: 5 },
];

export const getGroupTours = () =>
  getJson<ApiHighlightCard[]>("/api/group-tours", GROUP_TOURS_FALLBACK);

export const getPrivateTours = () =>
  getJson<ApiHighlightCard[]>("/api/private-tours", PRIVATE_TOURS_FALLBACK);
