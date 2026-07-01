import type { ReactNode } from "react";
import { AutoScrollRow } from "./AutoScrollRow";

export type BookingChip = { icon: ReactNode; value: string };

/**
 * Thanh đặt/liên hệ cố định ở đáy màn hình — CHỈ hiển thị trên mobile
 * (`lg:hidden`); desktop vẫn dùng card sticky bên phải. Bố cục 2 hàng:
 * hàng trên là các "chip" thông tin (icon thay cho nhãn dài như "Ngày khởi
 * hành") có thể cuộn ngang nếu tràn; hàng dưới là giá to bên trái và nút
 * hành động to bên phải. `data-booking-bar` để globals.css chừa padding cho
 * footer khỏi bị thanh này che.
 */
export function MobileBookingBar({
  chips,
  priceLabel = "Giá từ",
  price,
  priceUnit,
  action,
}: {
  chips: BookingChip[];
  priceLabel?: string;
  price: string;
  priceUnit?: string;
  /** Nút hành động (QuickEnquiry / HotelBooking) — được phóng to trong thanh. */
  action: ReactNode;
}) {
  return (
    <div
      data-booking-bar
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-paper-2/95 px-4 pt-2.5 shadow-[0_-10px_30px_-14px_rgba(26,24,19,0.55)] backdrop-blur-sm pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {chips.length > 0 && (
        <AutoScrollRow className="mb-2 flex items-center gap-x-4 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((c, i) => (
            <span
              key={i}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm"
            >
              <span className="text-ink/45">{c.icon}</span>
              <span className="font-medium text-ink">{c.value}</span>
            </span>
          ))}
        </AutoScrollRow>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 leading-tight">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-mute">{priceLabel}</p>
          <p className="font-serif text-[1.7rem] leading-none text-ink">
            {price}
            {priceUnit && <span className="ml-1 text-xs font-normal text-mute">{priceUnit}</span>}
          </p>
        </div>
        <div className="shrink-0 [&>button]:px-8 [&>button]:py-4 [&>button]:text-base [&>button]:font-medium">
          {action}
        </div>
      </div>
    </div>
  );
}
