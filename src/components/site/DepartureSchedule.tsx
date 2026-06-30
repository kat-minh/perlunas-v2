"use client";

import { useState } from "react";
import { clsx } from "clsx";

export type Departure = {
  /** "MM/YYYY" — month bucket */
  month: string;
  /** "DD/MM/YYYY" */
  date: string;
  code: string;
  price: string;
  /** original price, shown struck-through when there's a discount */
  priceWas?: string;
  stay: string;
};

/**
 * Lịch khởi hành (ref: travel.com.vn) — months as clickable boxes; clicking one
 * reveals that month's departures in a ruled "note" table: Ngày · Mã tour · Giá
 * tour (giá gốc gạch ngang nếu có khuyến mãi) · Chuẩn lưu trú.
 */
export function DepartureSchedule({
  departures,
  dateLabel = "Ngày khởi hành",
  codeLabel = "Mã tour",
  priceLabel = "Giá tour",
  stayLabel = "Chuẩn lưu trú",
  emptyText = "Chưa có lịch khởi hành cho tháng này.",
}: {
  departures: Departure[];
  dateLabel?: string;
  codeLabel?: string;
  priceLabel?: string;
  stayLabel?: string;
  emptyText?: string;
}) {
  const months = Array.from(new Set(departures.map((d) => d.month)));
  const [active, setActive] = useState(months[0] ?? "");
  const rows = departures.filter((d) => d.month === active);

  const cols = "grid grid-cols-[1.1fr_1.6fr_1.2fr_1.2fr] gap-4";

  return (
    <div>
      {/* ô chọn tháng */}
      <div className="flex flex-wrap gap-3">
        {months.map((m) => {
          const [mm, yyyy] = m.split("/");
          const isActive = m === active;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setActive(m)}
              aria-pressed={isActive}
              className={clsx(
                "flex flex-col items-center px-5 py-3 text-center transition-colors",
                isActive
                  ? "bg-ink text-paper"
                  : "border border-[var(--line)] text-ink hover:border-ink",
              )}
            >
              <span className="text-[0.65rem] uppercase tracking-[0.2em] opacity-70">Tháng</span>
              <span className="font-serif text-2xl leading-tight">{mm}</span>
              <span className="text-xs opacity-70">{yyyy}</span>
            </button>
          );
        })}
      </div>

      {/* bảng lịch khởi hành — kẻ ngang kiểu note */}
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[640px] bg-paper-2 shadow-[0_8px_22px_-12px_rgba(26,24,19,0.45)]">
          <div
            className={clsx(
              cols,
              "border-b-2 border-ink/70 px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-mute",
            )}
          >
            <span>{dateLabel}</span>
            <span>{codeLabel}</span>
            <span>{priceLabel}</span>
            <span>{stayLabel}</span>
          </div>

          {rows.map((r) => (
            <div
              key={r.code}
              className={clsx(
                cols,
                "items-center border-b border-[var(--line-soft)] px-5 py-3.5 text-sm text-ink/80 last:border-b-0",
              )}
            >
              <span className="font-medium text-ink">{r.date}</span>
              <span className="uppercase tracking-wide text-ink/70">{r.code}</span>
              <span className="flex flex-col leading-tight">
                {r.priceWas && (
                  <span className="text-xs text-mute line-through">{r.priceWas}</span>
                )}
                <span className="font-medium text-ink">{r.price}</span>
              </span>
              <span>{r.stay}</span>
            </div>
          ))}

          {rows.length === 0 && (
            <p className="px-5 py-6 text-sm text-mute">{emptyText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
