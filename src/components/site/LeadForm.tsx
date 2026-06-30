"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "ok" | "error";

const SERVICES = ["Tour trọn gói", "Khách sạn", "Gói du lịch", "Tour đoàn", "Tour riêng"] as const;
const MONTHS = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
const YEARS = ["2026", "2027"];
const GROUP = ["1 người", "2 người", "3 - 5 người", "6 - 10 người", "Trên 10 người"];
const BUDGET = ["Dưới 3 triệu", "3 - 5 triệu", "5 - 10 triệu", "Trên 10 triệu"];
const SOURCES = ["Facebook / Instagram", "Google", "Bạn bè giới thiệu", "Đã đi cùng Perlunas", "Khác"];

/**
 * Shared enquiry form, modelled on the client's reference (contact1/2.png):
 * a "Chuyến đi của bạn" group and a "Thông tin của bạn" group. Inline in Contact
 * AND inside the modal (LeadDialog) opened by "Tour riêng" / "Liên hệ tư vấn".
 *
 * NOTE: data wiring is provisional. It POSTs to /api/lead; where the data finally
 * lands (Sheet / CRM) is still TBD.
 */
export function LeadForm({
  defaultService,
  defaultEmail,
}: {
  defaultService?: string;
  defaultEmail?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    const payload = {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      service: get("service"),
      destination: get("destination"),
      month: get("month"),
      year: get("year"),
      days: get("days"),
      groupSize: get("groupSize"),
      budget: get("budget"),
      source: get("source"),
      newsletter: get("newsletter"),
      message: get("message"),
      channel: get("channel") || "zalo",
      company: get("company"), // honeypot
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "failed");
      }
      setStatus("ok");
    } catch {
      setStatus("error");
      setError("Gửi chưa thành công, bạn thử lại hoặc nhắn Zalo trực tiếp giúp chúng tôi nhé.");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex flex-col items-center justify-center border border-[var(--line)] bg-paper-2 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-serif text-2xl text-ink">Đã nhận thông tin</h3>
        <p className="mt-2 max-w-sm text-sm text-ink/65">
          Cảm ơn bạn. Perlunas sẽ liên hệ qua Zalo hoặc Messenger trong thời gian
          sớm nhất để tư vấn.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-[var(--line)] bg-paper-2 p-7 sm:p-9">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <p className="text-sm leading-relaxed text-ink/60">
        Sau khi bạn gửi, Perlunas sẽ liên hệ sớm để tư vấn và lên kế hoạch qua
        Zalo, điện thoại hoặc gặp trực tiếp. Cần trao đổi ngay, bạn gọi{" "}
        <a href="tel:0900000000" className="text-ink underline">0900 000 000</a>.
      </p>

      {/* YOUR TRIP */}
      <SectionTitle>Chuyến đi của bạn</SectionTitle>
      <Field label="Bạn muốn đi đâu?" required>
        <input name="destination" required placeholder="VD: Đà Lạt, Phú Quốc, Hà Nội…" className={inputCls} />
      </Field>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Dự kiến khi nào?">
          <div className="grid grid-cols-2 gap-3">
            <select name="month" defaultValue="" className={inputCls} aria-label="Tháng">
              <option value="">Tháng</option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select name="year" defaultValue="" className={inputCls} aria-label="Năm">
              <option value="">Năm</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </Field>
        <Field label="Đi trong bao lâu?">
          <input name="days" placeholder="VD: 3 ngày 2 đêm" className={inputCls} />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Số người">
          <select name="groupSize" defaultValue="" className={inputCls}>
            <option value="">Chọn số người…</option>
            {GROUP.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Ngân sách mỗi người">
          <select name="budget" defaultValue="" className={inputCls}>
            <option value="">Chọn mức…</option>
            {BUDGET.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Bạn quan tâm dịch vụ nào?">
          <select name="service" defaultValue={defaultService ?? ""} className={inputCls}>
            <option value="">Chọn dịch vụ…</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Ghi chú thêm (không bắt buộc)">
          <textarea name="message" rows={2} placeholder="Dịp đặc biệt, điều bạn muốn hoặc muốn tránh…" className={inputCls + " resize-none"} />
        </Field>
      </div>

      {/* YOUR DETAILS */}
      <SectionTitle>Thông tin của bạn</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Họ và tên" required>
          <input name="name" required placeholder="VD: Nguyễn Thị Lan" className={inputCls} />
        </Field>
        <Field label="Số điện thoại / Zalo" required>
          <input name="phone" required inputMode="tel" placeholder="0901 234 567" className={inputCls} />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Email (không bắt buộc)">
          <input name="email" type="email" inputMode="email" defaultValue={defaultEmail} placeholder="ban@email.com" className={inputCls} />
        </Field>
        <Field label="Bạn biết Perlunas qua đâu?">
          <select name="source" defaultValue="" className={inputCls}>
            <option value="">Chọn…</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm text-ink/70">Tư vấn qua</p>
        <div className="flex gap-3">
          {(
            [
              ["zalo", "Zalo"],
              ["messenger", "Messenger"],
              ["call", "Gọi điện"],
            ] as const
          ).map(([value, label], i) => (
            <label
              key={value}
              className="flex flex-1 cursor-pointer items-center justify-center border border-[var(--line)] px-4 py-3 text-sm text-ink/80 transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper"
            >
              <input type="radio" name="channel" value={value} defaultChecked={i === 0} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-ink/70">
        <input type="checkbox" name="newsletter" value="yes" className="mt-0.5 h-4 w-4 accent-ink" />
        <span>Nhận thông tin ưu đãi và cảm hứng du lịch từ Perlunas.</span>
      </label>

      {error && <p className="mt-4 text-sm text-ink">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-ink mt-7 flex w-full items-center justify-center gap-2 rounded-[3px] px-8 py-3.5 text-sm font-medium uppercase tracking-[0.1em] disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "loading" ? "Đang gửi…" : "Gửi thông tin"}
      </button>
      <p className="mt-3 text-center text-xs text-mute">Chúng tôi giữ kín thông tin của bạn.</p>
    </form>
  );
}

const inputCls =
  "w-full border border-[var(--line)] bg-paper px-4 py-3 text-ink placeholder:text-mute/60 outline-none transition-colors focus:border-ink";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 mt-8 border-t border-[var(--line)] pt-6 text-xs font-medium uppercase tracking-[0.2em] text-ink">
      {children}
    </p>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-ink/70">
        {label}
        {required && <span className="text-ink/40"> *</span>}
      </span>
      {children}
    </label>
  );
}
