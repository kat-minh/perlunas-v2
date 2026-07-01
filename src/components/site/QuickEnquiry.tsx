"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { X, Check, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "ok" | "error";

/**
 * "Liên hệ ngay" — opens a compact enquiry popup in place (no navigation):
 * Họ tên, Số điện thoại (Zalo), Email, Thông tin đang quan tâm. Posts to
 * /api/lead like the full LeadForm and shows an inline success state.
 */
export function QuickEnquiry({
  tourName,
  tourCode,
  className,
}: {
  tourName: string;
  tourCode: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          "btn-ink rounded-[3px] px-7 py-3.5 text-sm font-medium tracking-wide",
          className,
        )}
      >
        Liên hệ ngay
      </button>
      {open && (
        <Dialog tourName={tourName} tourCode={tourCode} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function Dialog({
  tourName,
  tourCode,
  onClose,
}: {
  tourName: string;
  tourCode: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      service: "Tour trọn gói",
      message: String(fd.get("interest") ?? ""),
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
      aria-label="Liên hệ tư vấn"
    >
      <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={onClose} />

      <div
        data-lenis-prevent
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto border border-[var(--line)] bg-paper-2 p-7 shadow-2xl sm:p-8"
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
            <h3 className="mt-5 font-serif text-2xl text-ink">Đã nhận thông tin</h3>
            <p className="mt-2 max-w-xs text-sm text-ink/65">
              Cảm ơn bạn. Perlunas sẽ liên hệ qua Zalo hoặc điện thoại trong thời gian sớm nhất.
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
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mute">Liên hệ tư vấn</p>
            <h3 className="mt-2 font-serif text-2xl text-ink">{tourName}</h3>

            <div className="mt-6 space-y-4">
              <Field label="Họ tên" hint="đúng theo giấy tờ" required>
                <input name="name" required placeholder="VD: Nguyễn Thị Lan" className={inputCls} />
              </Field>
              <Field label="Số điện thoại (có Zalo)" required>
                <input
                  name="phone"
                  required
                  inputMode="tel"
                  placeholder="0901 234 567"
                  className={inputCls}
                />
              </Field>
              <Field label="Email" required>
                <input
                  name="email"
                  required
                  type="email"
                  inputMode="email"
                  placeholder="ban@email.com"
                  className={inputCls}
                />
              </Field>
              <Field label="Thông tin đang quan tâm">
                <textarea
                  name="interest"
                  rows={2}
                  defaultValue={`${tourName} (Mã tour: ${tourCode})`}
                  className={clsx(inputCls, "resize-none")}
                />
              </Field>
            </div>

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
              {status === "loading" ? "Đang gửi…" : "Gửi thông tin"}
            </button>
            <p className="mt-3 text-center text-xs text-mute">Chúng tôi cam kết bảo mật thông tin của khách hàng.</p>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

const inputCls =
  "w-full border border-[var(--line)] bg-paper px-4 py-3 text-ink placeholder:text-mute/60 outline-none transition-colors focus:border-ink";

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
