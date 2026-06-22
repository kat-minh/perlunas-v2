"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

/**
 * URL-driven catalog filters + pagination for the listing pages
 * (/tour-tron-goi, /khach-san, /combo). Every control writes to the query
 * string; the server component re-reads `searchParams` and fetches the matching
 * page from the API. This keeps filtering and paging truly server-side.
 */
export type SelectDef = {
  param: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
};

export function CatalogControls({
  selects = [],
  searchPlaceholder = "Tên hoặc nơi đến…",
  className = "",
}: {
  selects?: SelectDef[];
  searchPlaceholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [search, setSearch] = useState(sp.get("search") ?? "");

  function commit(updates: Record<string, string | null>) {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v == null || v === "" || v === "all") next.delete(k);
      else next.set(k, v);
    }
    next.delete("page"); // any filter change returns to the first page
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const hasFilters =
    !!sp.get("search") || selects.some((s) => sp.get(s.param));

  return (
    <div
      className={`flex flex-col gap-5 border-y border-[var(--line-soft)] py-6 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6 ${className}`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          commit({ search });
        }}
        className="flex flex-col gap-2"
      >
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-mute">
          Tìm kiếm
        </span>
        <div className="relative w-full sm:w-64">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-[3px] border border-[var(--line)] bg-paper-2 py-2.5 pl-4 pr-10 text-sm text-ink transition-colors placeholder:text-mute/70 focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Tìm"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-mute transition-colors hover:text-ink"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {selects.map((s) => (
        <label key={s.param} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-mute">
            {s.label}
          </span>
          <div className="relative w-full sm:w-52">
            <select
              value={sp.get(s.param) ?? "all"}
              onChange={(e) => commit({ [s.param]: e.target.value })}
              className="w-full appearance-none rounded-[3px] border border-[var(--line)] bg-paper-2 py-2.5 pl-4 pr-10 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
            >
              <option value="all">{s.allLabel}</option>
              {s.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          </div>
        </label>
      ))}

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            router.push(pathname, { scroll: false });
          }}
          className="self-start text-sm text-mute underline-offset-4 hover:text-ink hover:underline sm:self-auto sm:pb-2.5"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}

export function Pagination({
  page,
  total,
  pageSize,
}: {
  page: number;
  total: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  function go(p: number) {
    const next = new URLSearchParams(sp.toString());
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Phân trang">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="rounded-[3px] border border-[var(--line)] px-4 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        Trước
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => go(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-9 w-9 rounded-[3px] border text-sm transition-colors ${
            p === page
              ? "border-ink bg-ink text-paper"
              : "border-[var(--line)] text-ink hover:bg-ink/5"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= pages}
        className="rounded-[3px] border border-[var(--line)] px-4 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        Sau
      </button>
    </nav>
  );
}
