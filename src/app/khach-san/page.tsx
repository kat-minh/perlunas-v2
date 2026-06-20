"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { HOTELS, PROVINCES, STAY_TYPES, type StayType } from "@/lib/catalog";
import { SceneImage } from "@/components/site/SceneImage";

export default function KhachSanPage() {
  const [city, setCity] = useState<string>("all");
  const [type, setType] = useState<StayType | "all">("all");

  // Province-first filtering: the available stay types depend on the chosen city.
  const availableTypes = useMemo(() => {
    const pool = city === "all" ? HOTELS : HOTELS.filter((h) => h.city === city);
    return STAY_TYPES.filter((t) => pool.some((h) => h.type === t));
  }, [city]);

  const filtered = HOTELS.filter(
    (h) =>
      (city === "all" || h.city === city) && (type === "all" || h.type === type),
  );

  function pickCity(c: string) {
    setCity(c);
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
            Chọn nơi đến trước, rồi tới loại hình lưu trú. Một số nơi chưa có đủ
            các loại hình, danh sách sẽ tự điều chỉnh theo nơi bạn chọn.
          </p>
        </header>

        <div className="mt-12 space-y-6 border-y border-[var(--line-soft)] py-8">
          <FilterRow label="Nơi đến">
            <Pill active={city === "all"} onClick={() => pickCity("all")}>
              Tất cả
            </Pill>
            {PROVINCES.map((p) => (
              <Pill key={p.slug} active={city === p.name} onClick={() => pickCity(p.name)}>
                {p.name}
              </Pill>
            ))}
          </FilterRow>

          <FilterRow label="Loại hình">
            <Pill active={type === "all"} onClick={() => setType("all")}>
              Tất cả
            </Pill>
            {(city === "all" ? STAY_TYPES : availableTypes).map((t) => (
              <Pill key={t} active={type === t} onClick={() => setType(t)}>
                {t}
              </Pill>
            ))}
          </FilterRow>
        </div>

        <p className="mt-8 text-sm text-mute">{filtered.length} chỗ nghỉ</p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {filtered.map((h) => (
            <article key={h.slug} className="group">
              <div className="aspect-[3/2] overflow-hidden">
                <SceneImage
                  seed={`perlunas-hotel-${h.slug}`}
                  alt={h.name}
                  w={1000}
                  h={667}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
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

        {filtered.length === 0 && (
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

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-mute sm:w-28">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full border px-4 py-1.5 text-sm transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-[var(--line)] text-ink/70 hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
