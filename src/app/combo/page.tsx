"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  COMBOS,
  COMBO_TIERS,
  PROVINCES,
  STAY_TYPES,
  type ComboTier,
  type StayType,
} from "@/lib/catalog";
import { SceneImage } from "@/components/site/SceneImage";
import { PearlIcon } from "@/components/site/PearlIcon";
import { LeadButton } from "@/components/site/LeadButton";

const slugByCity = Object.fromEntries(PROVINCES.map((p) => [p.name, p.slug]));
const hotelNames = [...new Set(COMBOS.map((c) => c.hotelName))];

export default function ComboPage() {
  return (
    <Suspense fallback={null}>
      <ComboContent />
    </Suspense>
  );
}

function ComboContent() {
  const searchParams = useSearchParams();
  const initialCity =
    PROVINCES.find((p) => p.slug === searchParams.get("noi-den"))?.name ?? "all";

  const [city, setCity] = useState<string>(initialCity);
  const [stayType, setStayType] = useState<StayType | "all">("all");
  const [name, setName] = useState<string>("all");
  const [tier, setTier] = useState<ComboTier | "all">("all");

  const isFiltering =
    city !== "all" || stayType !== "all" || name !== "all" || tier !== "all";

  const filtered = COMBOS.filter(
    (c) =>
      (city === "all" || c.city === city) &&
      (stayType === "all" || c.stayType === stayType) &&
      (name === "all" || c.hotelName === name) &&
      (tier === "all" || c.tier === tier),
  );
  // Default = the curated picks; once the guest filters, show all matches.
  const list = isFiltering ? filtered : COMBOS.filter((c) => c.featured);

  function reset() {
    setCity("all");
    setStayType("all");
    setName("all");
    setTier("all");
  }

  return (
    <main className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[100rem]">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              Combo du lịch
            </p>
            <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
              Combo trọn gói khắp Việt Nam.
            </h1>
            <p className="mt-6 text-pretty leading-relaxed text-ink/70">
              Mỗi combo kết hợp lưu trú, di chuyển và trải nghiệm theo một trong ba
              chuẩn dịch vụ: Akoya, Tahiti, South Sea. Lọc theo nhu cầu của bạn, hoặc
              tìm hiểu ý nghĩa từng phân loại.
            </p>
          </div>
          <Link
            href="/combo/phan-loai"
            className="inline-flex shrink-0 items-center gap-2 rounded-[3px] border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Phân loại Combo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        {/* filters — dropdowns */}
        <div className="mt-12 flex flex-col gap-5 border-y border-[var(--line-soft)] py-6 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
          <Select label="Nơi đến" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="all">Tất cả nơi đến</option>
            {PROVINCES.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name}
              </option>
            ))}
          </Select>

          <Select
            label="Loại hình"
            value={stayType}
            onChange={(e) => setStayType(e.target.value as StayType | "all")}
          >
            <option value="all">Tất cả loại hình</option>
            {STAY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          <Select label="Tên" value={name} onChange={(e) => setName(e.target.value)}>
            <option value="all">Tất cả khách sạn</option>
            {hotelNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>

          <Select
            label="Phân loại"
            value={tier}
            onChange={(e) => setTier(e.target.value as ComboTier | "all")}
          >
            <option value="all">Tất cả phân loại</option>
            {COMBO_TIERS.map((t) => (
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
          {isFiltering ? `${list.length} combo` : "Combo nổi bật"}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <article key={c.slug} className="group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <SceneImage
                  seed={`perlunas-place-${slugByCity[c.city] ?? ""}`}
                  alt={c.hotelName}
                  w={900}
                  h={675}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                {/* pearl + tier */}
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <PearlIcon tier={c.tier} className="h-6 w-6" />
                  <span className="bg-ink/65 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.15em] text-paper backdrop-blur-sm">
                    {c.tier}
                  </span>
                </div>
                {/* price */}
                <span className="absolute right-3 top-3 bg-ink px-3 py-1.5 text-xs font-medium text-paper">
                  Giá từ {c.price}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-xl leading-snug text-ink">
                {c.tier.toUpperCase()} - {c.hotelName} {c.nights} ĐÊM
              </h3>
              <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-mute">
                {c.stayType} · {c.city}
              </p>
            </article>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-6 text-ink/60">
            Chưa có combo phù hợp với bộ lọc này. Bạn thử bỏ bớt một tiêu chí nhé.
          </p>
        )}

        {/* CTA — giữ lại "Chưa biết chọn combo nào?" (bỏ phần "Chọn một điểm đến") */}
        <div className="mt-24 border-t border-[var(--line)] pt-14">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="display text-2xl text-ink sm:text-3xl">
                Chưa biết chọn combo nào?
              </h2>
              <p className="mt-2 text-ink/70">
                Để lại thông tin, Perlunas tư vấn gói phù hợp với bạn, miễn phí.
              </p>
            </div>
            <LeadButton service="Combo du lịch">Nhận tư vấn</LeadButton>
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
      <div className="relative w-full sm:w-52">
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
