"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, Loader2, MessageCircle, Send } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "approved" | "error";

/**
 * Compact consultation form for the immersive end-chapter. Posts to /api/lead
 * (which forwards to the Google Sheets webhook), then hands the visitor off to
 * Zalo/Messenger. Self-contained so it can drop into the Continuous Canvas.
 */
export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { channel: "zalo" },
  });

  const channel = watch("channel");

  const onSubmit = async (data: LeadInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");

      setStatus("approved");
      const url = data.channel === "messenger" ? site.messenger : site.zalo;
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
      }, 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-warm p-6 text-ink shadow-lift md:p-8">
      <div className="flex items-center justify-between border-b border-leather/20 pb-4">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-leather">
            Arrival Card · {site.name}
          </p>
          <p className="font-serif text-lg text-emerald">Phiếu đăng ký tư vấn</p>
        </div>
        <span className="font-mono text-[0.6rem] tracking-[0.16em] text-ink-soft">
          HTV-2026
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        {/* Honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
          {...register("company")}
        />

        <Field label="Họ và tên" error={errors.name?.message}>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            className={inputCls}
            {...register("name")}
          />
        </Field>

        <Field label="Số điện thoại (có Zalo)" error={errors.phone?.message}>
          <input
            type="tel"
            inputMode="tel"
            placeholder="0901 234 567"
            className={inputCls}
            {...register("phone")}
          />
        </Field>

        <Field label="Bạn muốn đi đâu?" error={errors.destination?.message}>
          <textarea
            rows={2}
            placeholder="VD: Tour Phú Quốc 3N2Đ cho 4 người"
            className={`${inputCls} resize-none`}
            {...register("destination")}
          />
        </Field>

        <div>
          <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-leather">
            Bạn muốn được liên hệ qua
          </span>
          <div className="grid grid-cols-2 gap-3">
            <ChannelOption value="zalo" label="Zalo" active={channel === "zalo"} register={register} />
            <ChannelOption value="messenger" label="Messenger" active={channel === "messenger"} register={register} />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "submitting" || status === "approved"}
          className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald px-7 py-3.5 font-semibold text-warm transition-colors hover:bg-emerald-deep disabled:opacity-80"
          data-cursor="hover"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Đang gửi…
            </>
          ) : (
            <>
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Gửi yêu cầu tư vấn
            </>
          )}
        </button>

        {status === "error" && (
          <p className="text-center text-sm text-leather-dark">
            Có lỗi xảy ra. Vui lòng gọi {site.phone} hoặc thử lại nhé.
          </p>
        )}
        <p className="text-center text-xs text-ink-soft">
          Thông tin của bạn được bảo mật và chỉ dùng để tư vấn.
        </p>
      </form>

      <AnimatePresence>
        {status === "approved" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-warm/95 text-center"
          >
            <motion.div
              initial={{ scale: 2, opacity: 0, rotate: -24 }}
              animate={{ scale: 1, opacity: 1, rotate: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 11 }}
              className="stamp-edge flex aspect-square w-32 flex-col items-center justify-center rounded-full border-4 border-double border-forest text-forest"
            >
              <BadgeCheck className="h-8 w-8" />
              <span className="mt-1 font-serif text-sm font-bold uppercase tracking-[0.1em]">
                Approved
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="mt-5 font-serif text-2xl text-emerald">
                Đã ghi nhận yêu cầu!
              </h3>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-ink-soft">
                <MessageCircle className="h-4 w-4 text-gold" />
                Đang chuyển bạn tới {channel === "messenger" ? "Messenger" : "Zalo"}…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-leather/25 bg-cream/40 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-forest focus:bg-warm";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-leather">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}

function ChannelOption({
  value,
  label,
  active,
  register,
}: {
  value: "zalo" | "messenger";
  label: string;
  active: boolean;
  register: ReturnType<typeof useForm<LeadInput>>["register"];
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
        active
          ? "border-forest bg-forest/10 text-emerald"
          : "border-leather/25 text-ink-soft hover:border-forest/40"
      }`}
    >
      <input type="radio" value={value} className="sr-only" {...register("channel")} />
      <MessageCircle className="h-4 w-4" />
      {label}
    </label>
  );
}
