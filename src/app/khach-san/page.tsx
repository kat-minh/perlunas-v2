"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HOTELS, PROVINCES, STAY_TYPES, type StayType } from "@/lib/catalog";
import { SceneImage } from "@/components/site/SceneImage";

export default function KhachSanPage() {
  return (
    <Suspense fallback={null}>
      <KhachSanContent />
    </Suspense>
  );
}

function KhachSanContent() {
  const searchParams = useSearchParams();
  // Optional ?noi-den=<province slug> pre-selects the destination (e.g. arriving
  // from a tour page); stay type stays "Tất cả".
  const initialCity =
    PROVINCES.find((p) => p.slug === searchParams.get("noi-den"))?.name ?? "all";
  const [city, setCity] = useState<string>(initialCity);
  const [type, setType] = useState<StayType | "all">("all");

  // Province-first: the available stay types depend on the chosen city.
  const availableTypes = useMemo(() => {
    const pool = city === "all" ? HOTELS : HOTELS.filter((h) => h.city === city);
    return STAY_TYPES.filter((t) => pool.some((h) => h.type === t));
  }, [city]);

  const isFiltering = city !== "all" || type !== "all";
  const filtered = HOTELS.filter(
    (h) =>
      (city === "all" || h.city === city) && (type === "all" || h.type === type),
  );
  // Default view = the curated/featured picks; once the guest filters, show all matches.
  const list = isFiltering ? filtered : HOTELS.filter((h) => h.featured);

  function pickCity(c: string) {
    setCity(c);
    setType("all");
  }

  function reset() {
    setCity("all");
    setType("all");
  }

  return (
    <main className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[100rem]">
        <header className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            Khách sạn
          </p>
          <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
            Chỗ nghỉ trên khắp Việt Nam.
          </h1>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-ink/70">
            Mặc định là những chỗ nghỉ Perlunas tuyển chọn. Chọn nơi đến và loại
            hình lưu trú để xem danh sách phù hợp với bạn.
          </p>
        </header>

        {/* filters — dropdowns */}
        <div className="mt-12 flex flex-col gap-5 border-y border-[var(--line-soft)] py-6 sm:flex-row sm:flex-wrap sm:items-end sm:gap-8">
          <Select label="Nơi đến" value={city} onChange={(e) => pickCity(e.target.value)}>
            <option value="all">Tất cả nơi đến</option>
            {PROVINCES.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name}
              </option>
            ))}
          </Select>

          <Select
            label="Loại hình"
            value={type}
            onChange={(e) => setType(e.target.value as StayType | "all")}
          >
            <option value="all">Tất cả loại hình</option>
            {(city === "all" ? STAY_TYPES : availableTypes).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          {isFiltering && (
            <button
              type="button"
              onClick={reset}
              className="self-start text-sm text-mute underline-offset-4 hover:text-ink hover:underline sm:self-auto sm:pb-2.5"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        <p className="mt-8 text-sm text-mute">
          {isFiltering ? `${list.length} chỗ nghỉ` : "Chỗ nghỉ nổi bật"}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {list.map((h) => (
            <article key={h.slug} className="group">
              <div className="relative aspect-[3/2] overflow-hidden">
                <SceneImage
                  seed={`perlunas-hotel-${h.slug}`}
                  alt={h.name}
                  w={1000}
                  h={667}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute right-3 top-3 bg-ink px-3 py-1.5 text-xs font-medium text-paper">
                  Từ {h.price}/đêm
                </span>
              </div>
              <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                {h.type} · {h.city}
              </p>
              <h3 className="mt-2 font-serif text-2xl text-ink">{h.name}</h3>
              <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-ink/65">
                {h.desc}
              </p>
            </article>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-6 text-ink/60">
            Chưa có chỗ nghỉ phù hợp với bộ lọc này. Bạn thử bỏ bớt một tiêu chí nhé.
          </p>
        )}

        {/* upsell to Combo */}
        <div className="mt-24 border-t border-[var(--line)] pt-14">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              Nâng tầm trải nghiệm
            </p>
            <h2 className="display mt-5 text-3xl text-ink sm:text-4xl">
              Không chỉ là đặt phòng, hãy đi cùng một combo trọn vẹn.
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-ink/70">
              Combo du lịch kết hợp lưu trú, di chuyển và trải nghiệm theo ba mức:
              Akoya, Tahiti và South Sea, để chuyến đi của bạn liền mạch từ đầu đến
              cuối.
            </p>
            <Link
              href="/combo"
              className="btn-ink mt-7 inline-flex items-center gap-2 rounded-[3px] px-7 py-3.5 text-sm font-medium"
            >
              Khám phá Combo du lịch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-mute">
        {label}
      </span>
      <div className="relative w-full sm:w-64">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-[3px] border border-[var(--line)] bg-paper-2 py-2.5 pl-4 pr-10 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
      </div>
    </label>
  );
}
