"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Check, Calendar, Tag, Moon, Star } from "lucide-react";
import type { Departure } from "./DepartureSchedule";
import { MobileBookingBar } from "./MobileBookingBar";

/**
 * Lịch khởi hành có thể CHỌN: mỗi hàng một nút chọn, hàng được chọn đổi màu, và
 * sidebar (DepartureSummary) hiển thị thông tin của lịch đang chọn. Trạng thái
 * chia sẻ qua context để bảng (cột trái) và sidebar sticky (cột phải) đồng bộ.
 * Mặc định chọn lịch đầu tiên.
 */
type Ctx = {
  selected: Departure | undefined;
  setSelected: (d: Departure) => void;
};
const DepartureCtx = createContext<Ctx | null>(null);

function useDepartureCtx() {
  const ctx = useContext(DepartureCtx);
  if (!ctx) throw new Error("DepartureSummary/Picker phải nằm trong <DepartureProvider>");
  return ctx;
}

export function DepartureProvider({
  departures,
  children,
}: {
  departures: Departure[];
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<Departure | undefined>(departures[0]);
  return (
    <DepartureCtx.Provider value={{ selected, setSelected }}>
      {children}
    </DepartureCtx.Provider>
  );
}

export function DeparturePicker({
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
  const { selected, setSelected } = useDepartureCtx();
  const months = Array.from(new Set(departures.map((d) => d.month)));
  const [active, setActive] = useState(selected?.month ?? months[0] ?? "");
  const rows = departures.filter((d) => d.month === active);

  const cols = "grid grid-cols-[1.1fr_1.7fr_1.1fr_1.1fr_auto] gap-3 sm:gap-4";

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

      {/* MOBILE: mỗi lịch khởi hành là 1 "cục" — không cần cuộn ngang */}
      <div className="mt-6 flex flex-col gap-3 sm:hidden">
        {rows.map((r) => {
          const isSelected = selected?.code === r.code;
          return (
            <div
              key={r.code}
              onClick={() => setSelected(r)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(r);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Chọn lịch khởi hành ${r.date}`}
              className={clsx(
                "cursor-pointer select-none border bg-paper-2 p-4 outline-none transition-colors focus-visible:border-ink",
                isSelected
                  ? "border-ink bg-ink/[0.05]"
                  : "border-[var(--line)] hover:border-ink",
              )}
            >
              {/* hàng đầu: ngày + chỉ báo chọn */}
              <div className="flex items-center justify-between gap-3">
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.7rem] uppercase tracking-[0.15em] text-mute">
                    {dateLabel}
                  </span>
                  <span className="font-medium text-ink">{r.date}</span>
                </span>
                <span
                  aria-hidden
                  className={clsx(
                    "flex h-7 w-7 flex-none items-center justify-center rounded-full border transition-colors",
                    isSelected
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/40 text-transparent",
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* các field còn lại */}
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--line-soft)] pt-3 text-sm">
                <div className="flex flex-col leading-tight">
                  <dt className="text-[0.7rem] uppercase tracking-[0.15em] text-mute">
                    {codeLabel}
                  </dt>
                  <dd className="uppercase tracking-wide text-ink/70">{r.code}</dd>
                </div>
                <div className="flex flex-col leading-tight">
                  <dt className="text-[0.7rem] uppercase tracking-[0.15em] text-mute">
                    {stayLabel}
                  </dt>
                  <dd className="text-ink/80">{r.stay}</dd>
                </div>
                <div className="col-span-2 flex flex-col leading-tight">
                  <dt className="text-[0.7rem] uppercase tracking-[0.15em] text-mute">
                    {priceLabel}
                  </dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="font-medium text-ink">{r.price}</span>
                    {r.priceWas && (
                      <span className="text-xs text-mute line-through">{r.priceWas}</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}

        {rows.length === 0 && (
          <p className="border border-[var(--line)] bg-paper-2 px-5 py-6 text-sm text-mute">
            {emptyText}
          </p>
        )}
      </div>

      {/* DESKTOP: bảng lịch khởi hành — mỗi hàng có nút chọn, hàng chọn đổi màu */}
      <div className="mt-6 hidden sm:block">
        <div className="bg-paper-2 shadow-[0_8px_22px_-12px_rgba(26,24,19,0.45)]">
          <div
            className={clsx(
              cols,
              "border-b-2 border-ink/70 px-3 py-3 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-mute sm:px-5",
            )}
          >
            <span>{dateLabel}</span>
            <span>{codeLabel}</span>
            <span>{priceLabel}</span>
            <span>{stayLabel}</span>
            <span className="text-center">Chọn</span>
          </div>

          {rows.map((r) => {
            const isSelected = selected?.code === r.code;
            return (
              <div
                key={r.code}
                onClick={() => setSelected(r)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(r);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Chọn lịch khởi hành ${r.date}`}
                className={clsx(
                  cols,
                  "cursor-pointer select-none items-center border-b border-[var(--line-soft)] px-3 py-3.5 text-sm outline-none transition-colors last:border-b-0 focus-visible:bg-ink/[0.06] sm:px-5",
                  isSelected ? "bg-ink/[0.05] text-ink" : "text-ink/80 hover:bg-ink/[0.03]",
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
                <span className="flex justify-center">
                  {/* chỉ báo trực quan — cả hàng đã bấm được để chọn */}
                  <span
                    aria-hidden
                    className={clsx(
                      // kích thước cố định → không nhảy layout; chỉ icon, không chữ
                      "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                      isSelected
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/40 text-transparent",
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </span>
              </div>
            );
          })}

          {rows.length === 0 && <p className="px-5 py-6 text-sm text-mute">{emptyText}</p>}
        </div>
      </div>
    </div>
  );
}

/**
 * Khối thông tin trong sidebar sticky — phản chiếu lịch khởi hành đang chọn:
 * ngày, mã tour, chuẩn lưu trú và giá. Thời lượng truyền vào (cố định).
 */
export function DepartureSummary({ nights }: { nights: string }) {
  const { selected } = useDepartureCtx();

  return (
    <>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-3">
          <dt className="text-mute">Ngày khởi hành</dt>
          <dd className="font-medium text-ink">{selected?.date ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-3">
          <dt className="text-mute">Mã tour</dt>
          <dd className="text-right text-xs font-medium uppercase tracking-wide text-ink">
            {selected?.code ?? "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-3">
          <dt className="text-mute">Thời lượng</dt>
          <dd className="font-medium uppercase text-ink">{nights}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-3">
          <dt className="text-mute">Chuẩn lưu trú</dt>
          <dd className="font-medium text-ink">{selected?.stay ?? "—"}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-mute">Giá từ</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="font-serif text-3xl text-ink">{selected?.price ?? "—"}</p>
          {selected?.priceWas && (
            <span className="text-sm text-mute line-through">{selected.priceWas}</span>
          )}
        </div>
        <p className="mt-1 text-sm text-mute">/ khách</p>
      </div>
    </>
  );
}

/**
 * Bản mobile của DepartureSummary: thanh cố định đáy màn hình, phản chiếu lịch
 * khởi hành đang chọn. Nhãn dài được thay bằng icon (lịch, mã, đêm, chuẩn lưu
 * trú), giá + nút "Liên hệ ngay" để to. Phải nằm trong <DepartureProvider>.
 */
export function DepartureMobileBar({
  nights,
  action,
}: {
  nights: string;
  action: ReactNode;
}) {
  const { selected } = useDepartureCtx();
  return (
    <MobileBookingBar
      chips={[
        { icon: <Calendar className="h-4 w-4" />, value: selected?.date ?? "—" },
        { icon: <Tag className="h-4 w-4" />, value: selected?.code ?? "—" },
        { icon: <Moon className="h-4 w-4" />, value: nights },
        { icon: <Star className="h-4 w-4" />, value: selected?.stay ?? "—" },
      ]}
      price={selected?.price ?? "—"}
      priceUnit="/ khách"
      action={action}
    />
  );
}
