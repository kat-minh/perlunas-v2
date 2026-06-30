"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { X, Check, Loader2, Plus, Trash2, Minus } from "lucide-react";

type Status = "idle" | "loading" | "ok" | "error";
/** Combo mode: a month bucket + the combos available within it. */
export type MonthOption = { month: string; combos: string[] };
type Row = {
  room: string;
  qty: number;
  cid: string;
  cod: string;
  adults: number;
  children: number;
  infants: number;
  /** Combo mode: the chosen month bucket. */
  month: string;
};

const newRow = (room: string, cid = "", month = ""): Row => ({
  room,
  qty: 1,
  cid,
  cod: "",
  adults: 2,
  children: 0,
  infants: 0,
  month,
});

/**
 * "Đặt phòng" — opens a booking form popup in place (no navigation). The hotel
 * is auto-noted into the payload. Supports multiple room rows in one booking
 * (Hạng phòng → Số lượng → ngày nhận/trả) plus guest counts. Posts to /api/lead.
 * This button only lives on a hotel detail page, never on the listing.
 */
export function HotelBooking({
  hotelName,
  hotelCity,
  roomTypes,
  defaultRoom,
  monthOptions,
  label = "Đặt phòng",
  variant = "ink",
  className,
}: {
  hotelName: string;
  hotelCity: string;
  roomTypes: string[];
  defaultRoom?: string;
  /** When provided (combo: ngày fix), the date pickers are hidden and the row
   *  becomes "chọn tháng → chọn combo trong tháng đó" (two dependent selects). */
  monthOptions?: MonthOption[];
  label?: string;
  variant?: "ink" | "line";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          "rounded-[3px] px-7 py-3.5 text-sm font-medium tracking-wide",
          variant === "ink" ? "btn-ink" : "btn-sweep-ink border border-ink text-ink",
          className,
        )}
      >
        {label}
      </button>
      {open && (
        <Dialog
          hotelName={hotelName}
          hotelCity={hotelCity}
          roomTypes={roomTypes}
          defaultRoom={defaultRoom}
          monthOptions={monthOptions}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function Dialog({
  hotelName,
  hotelCity,
  roomTypes,
  defaultRoom,
  monthOptions,
  onClose,
}: {
  hotelName: string;
  hotelCity: string;
  roomTypes: string[];
  defaultRoom?: string;
  monthOptions?: MonthOption[];
  onClose: () => void;
}) {
  const comboMode = !!(monthOptions && monthOptions.length);
  const firstMonth = monthOptions?.[0];
  const [status, setStatus] = useState<Status>("idle");
  const [rows, setRows] = useState<Row[]>([
    newRow(defaultRoom ?? roomTypes[0] ?? "", firstMonth?.combos[0] ?? "", firstMonth?.month ?? ""),
  ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () =>
    setRows((rs) => [
      ...rs,
      newRow(roomTypes[0] ?? "", firstMonth?.combos[0] ?? "", firstMonth?.month ?? ""),
    ]);
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const roomsText = rows
      .map((r) =>
        comboMode
          ? `• ${r.month} — ${r.cid || "?"} x${r.qty} — ${r.adults} người lớn, ${r.children} trẻ em, ${r.infants} em bé`
          : `• ${r.room} x${r.qty} — ${r.adults} người lớn, ${r.children} trẻ em, ${r.infants} em bé ` +
            `(nhận ${r.cid || "?"} → trả ${r.cod || "?"})`,
      )
      .join("\n");
    const message = [`Khách sạn: ${hotelName} (${hotelCity})`, `Phòng đặt:`, roomsText].join("\n");
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      service: "Khách sạn",
      destination: hotelCity,
      message,
      channel: "zalo",
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Đặt phòng"
    >
      <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={onClose} />

      <div
        data-lenis-prevent
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[var(--line)] bg-paper-2 p-7 shadow-2xl sm:max-w-xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-[var(--surface)] hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "ok" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-ink">Đã nhận yêu cầu đặt phòng</h3>
            <p className="mt-2 max-w-xs text-sm text-ink/65">
              Perlunas sẽ liên hệ để xác nhận thông tin, kiểm tra phòng với đối tác và phản hồi
              sớm nhất.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-ink mt-6 rounded-[3px] px-7 py-3 text-sm font-medium"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mute">Đặt phòng</p>
            <h3 className="mt-2 font-serif text-2xl text-ink">{hotelName}</h3>
            <p className="text-sm text-mute">{hotelCity}</p>

            {/* 1. liên hệ */}
            <Section step={1} title="Thông tin liên hệ">
              <div className="space-y-3.5">
                <Field label="Họ tên" hint="đúng theo giấy tờ" required>
                  <input name="name" required placeholder="VD: Nguyễn Thị Lan" className={inputCls} />
                </Field>
                <Field label="Số điện thoại (có Zalo)" hint="đúng theo giấy tờ" required>
                  <input name="phone" required inputMode="tel" placeholder="0901 234 567" className={inputCls} />
                </Field>
                <Field label="Email" hint="đúng theo giấy tờ" required>
                  <input name="email" required type="email" inputMode="email" placeholder="ban@email.com" className={inputCls} />
                </Field>
              </div>
            </Section>

            {/* 2. phòng & ngày — nhiều hạng trong cùng 1 booking */}
            <Section
              step={2}
              title={comboMode ? "Combo & số khách" : "Phòng, ngày & số khách"}
              hint={comboMode ? "có thể thêm nhiều combo" : "có thể thêm nhiều hạng phòng"}
            >
              <div className="space-y-3">
                {rows.map((r, i) => (
                  <div key={i} className="rounded-[3px] border border-[var(--line)] bg-paper p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      {comboMode ? (
                        <div className="flex flex-1 flex-col gap-2.5">
                          {/* 1) chọn tháng */}
                          <select
                            value={r.month}
                            onChange={(e) => {
                              const month = e.target.value;
                              const combos =
                                monthOptions!.find((g) => g.month === month)?.combos ?? [];
                              setRow(i, { month, cid: combos[0] ?? "" });
                            }}
                            className={clsx(inputCls, "w-full")}
                            aria-label="Tháng đi"
                          >
                            {monthOptions!.map((g) => (
                              <option key={g.month} value={g.month}>{g.month}</option>
                            ))}
                          </select>
                          {/* 2) chọn combo trong tháng đó */}
                          <select
                            value={r.cid}
                            onChange={(e) => setRow(i, { cid: e.target.value })}
                            className={clsx(inputCls, "w-full")}
                            aria-label="Combo trong tháng"
                          >
                            {(monthOptions!.find((g) => g.month === r.month)?.combos ?? []).map(
                              (c) => (
                                <option key={c} value={c}>{c}</option>
                              ),
                            )}
                          </select>
                        </div>
                      ) : (
                        <select
                          value={r.room}
                          onChange={(e) => setRow(i, { room: e.target.value })}
                          className={clsx(inputCls, "flex-1")}
                          aria-label="Hạng phòng"
                        >
                          {roomTypes.map((rt) => (
                            <option key={rt} value={rt}>{rt}</option>
                          ))}
                        </select>
                      )}
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          aria-label="Xoá hạng phòng"
                          className="flex h-9 w-9 shrink-0 items-center justify-center text-ink/45 transition-colors hover:text-ink"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-ink/70">Số phòng</span>
                      <Counter
                        value={r.qty}
                        min={1}
                        onChange={(v) => setRow(i, { qty: v })}
                        label="số phòng"
                      />
                    </div>
                    {!comboMode && (
                      <div className="mt-3 grid grid-cols-2 gap-2.5">
                        <label className="block text-xs text-mute">
                          Nhận phòng
                          <input
                            type="date"
                            value={r.cid}
                            onChange={(e) => setRow(i, { cid: e.target.value })}
                            className={clsx(inputCls, "mt-1")}
                          />
                        </label>
                        <label className="block text-xs text-mute">
                          Trả phòng
                          <input
                            type="date"
                            value={r.cod}
                            onChange={(e) => setRow(i, { cod: e.target.value })}
                            className={clsx(inputCls, "mt-1")}
                          />
                        </label>
                      </div>
                    )}
                    {/* số khách của riêng hạng phòng này */}
                    <p className="mt-3 text-xs uppercase tracking-[0.1em] text-mute">Số khách</p>
                    <div className="divide-y divide-[var(--line-soft)] border-t border-[var(--line-soft)]">
                      <GuestRow
                        label="Người lớn"
                        hint="từ 12 tuổi trở lên"
                        value={r.adults}
                        min={1}
                        onChange={(v) => setRow(i, { adults: v })}
                      />
                      <GuestRow
                        label="Trẻ em"
                        hint="5 đến dưới 12 tuổi"
                        value={r.children}
                        onChange={(v) => setRow(i, { children: v })}
                      />
                      <GuestRow
                        label="Em bé"
                        hint="dưới 5 tuổi"
                        value={r.infants}
                        onChange={(v) => setRow(i, { infants: v })}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRow}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-opacity hover:opacity-70"
              >
                <Plus className="h-4 w-4" /> {comboMode ? "Thêm combo" : "Thêm hạng phòng"}
              </button>
            </Section>

            {status === "error" && (
              <p className="mt-4 text-sm text-ink">
                Gửi chưa thành công, bạn thử lại hoặc nhắn Zalo trực tiếp giúp chúng tôi nhé.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-ink mt-6 flex w-full items-center justify-center gap-2 rounded-[3px] px-8 py-3.5 text-sm font-medium uppercase tracking-[0.1em] disabled:opacity-60"
            >
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "loading" ? "Đang gửi…" : "Gửi yêu cầu đặt phòng"}
            </button>
            <p className="mt-3 text-center text-xs text-mute">
              Perlunas sẽ liên hệ xác nhận, check rate với đối tác và phản hồi sớm nhất.
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

const inputCls =
  "w-full rounded-[3px] border border-[var(--line)] bg-paper px-3 py-2.5 text-ink placeholder:text-mute/60 outline-none transition-colors focus:border-ink";

function Section({
  step,
  title,
  hint,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 first:mt-7">
      <div className="mb-3 flex items-baseline gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-medium text-paper">
          {step}
        </span>
        <h4 className="text-sm font-medium uppercase tracking-[0.12em] text-ink">{title}</h4>
        {hint && <span className="text-xs text-mute">· {hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Counter({
  value,
  onChange,
  min = 0,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  label: string;
}) {
  const step = (d: number) => onChange(Math.max(min, value + d));
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={value <= min}
        aria-label={`Giảm ${label}`}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[var(--line)]"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-5 text-center text-sm font-medium text-ink tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label={`Tăng ${label}`}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-ink transition-colors hover:border-ink"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function GuestRow({
  label,
  hint,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-sm text-ink">{label}</p>
        <p className="text-xs text-mute">{hint}</p>
      </div>
      <Counter value={value} onChange={onChange} min={min} label={label} />
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-ink/70">
        {label}
        {required && <span className="text-ink/40"> *</span>}
        {hint && <span className="text-mute"> ({hint})</span>}
      </span>
      {children}
    </label>
  );
}
