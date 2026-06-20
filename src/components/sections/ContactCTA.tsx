"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  BadgeCheck,
  Loader2,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";

const destinations = [
  "Hà Giang / Đông Bắc",
  "Tây Bắc (Sa Pa, Mộc Châu)",
  "Miền Trung (Huế, Hội An, Phong Nha)",
  "Tây Nguyên (Đà Lạt)",
  "Biển đảo (Phú Quốc, Nha Trang, Lý Sơn)",
  "Chưa chắc — cần tư vấn",
];

type Status = "idle" | "submitting" | "approved" | "error";

export function ContactCTA() {
  const [status, setStatus] = useState<Status>("idle");
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      // [ScrollTrigger] CINEMATIC FOOTER REVEAL — the final chapter is unveiled
      // like a curtain lifting from the bottom as the user reaches the end.
      gsap.fromTo(
        ".cta-curtain",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 90%",
            end: "top 28%",
            scrub: 1.5,
          },
        },
      );

      // The arrival card slides onto the counter and settles.
      gsap.from(".cta-card", {
        x: 70,
        rotate: 4,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

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
      // Let the stamp animation breathe, then hand off to the chat channel.
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
      }, 2200);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      ref={root}
      id="lien-he"
      className="relative scroll-mt-24 overflow-hidden bg-emerald-deep py-24 text-warm md:py-32"
    >
      <div className="paper-grain absolute inset-0 opacity-20" aria-hidden />
      <Parallax
        speed={50}
        className="pointer-events-none absolute -left-6 bottom-0 select-none font-serif text-[26vw] leading-none text-warm/[0.04] md:text-[18rem]"
      >
        Đi
      </Parallax>
      <div className="cta-curtain shell relative z-10 grid items-center gap-12 [will-change:transform] lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left — invitation */}
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" />
            <span className="eyebrow text-gold/80">Thẻ nhập cảnh</span>
          </div>
          <Reveal>
            <h2 className="mt-5 font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] leading-tight text-warm">
              Điền thẻ và bắt đầu hành trình của bạn
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md leading-relaxed text-warm/75">
              Để lại vài thông tin như khi điền thẻ nhập cảnh. Chuyên gia của
              chúng tôi sẽ liên hệ trong vòng 24 giờ để cùng bạn phác thảo hành
              trình — hoàn toàn miễn phí.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-warm/80">
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-warm/20 px-4 py-2 hover:border-gold"
              >
                <Phone className="h-4 w-4 text-gold" /> {site.phone}
              </a>
              <span className="text-warm/40">hoặc chat trực tiếp ↓</span>
            </div>
          </Reveal>
        </div>

        {/* Right — arrival card form */}
        <div>
          <div className="cta-card relative rounded-3xl bg-warm p-6 text-ink shadow-lift md:p-8">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-leather/20 pb-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-leather">
                  Arrival Card · Hành Trình Việt
                </p>
                <p className="font-serif text-lg text-emerald">
                  Phiếu đăng ký tư vấn
                </p>
              </div>
              <span className="font-mono text-[0.6rem] tracking-[0.16em] text-ink-soft">
                HTV-2026
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
                {...register("company")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Họ và tên" error={errors.name?.message}>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className={inputCls}
                    {...register("name")}
                  />
                </Field>
                <Field label="Số điện thoại" error={errors.phone?.message}>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="0901 234 567"
                    className={inputCls}
                    {...register("phone")}
                  />
                </Field>
              </div>

              <Field label="Điểm đến mơ ước" error={errors.destination?.message}>
                <select className={inputCls} defaultValue="" {...register("destination")}>
                  <option value="" disabled>
                    Chọn vùng đất bạn muốn đến…
                  </option>
                  {destinations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Thời gian dự kiến" error={errors.travelDate?.message}>
                  <input type="month" className={inputCls} {...register("travelDate")} />
                </Field>
                <Field label="Số lượng khách" error={errors.groupSize?.message}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="VD: 2 người lớn, 1 trẻ em"
                    className={inputCls}
                    {...register("groupSize")}
                  />
                </Field>
              </div>

              {/* Channel choice */}
              <div>
                <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-leather">
                  Bạn muốn được liên hệ qua
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <ChannelOption
                    value="zalo"
                    label="Zalo"
                    active={channel === "zalo"}
                    register={register}
                  />
                  <ChannelOption
                    value="messenger"
                    label="Messenger"
                    active={channel === "messenger"}
                    register={register}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "submitting" || status === "approved"}
                className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-emerald px-7 py-4 font-semibold text-warm transition-colors hover:bg-emerald-deep disabled:opacity-80"
                data-cursor="hover"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang gửi…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    Bắt đầu hành trình của tôi
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

            {/* Passport approval overlay */}
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
                    className="stamp-edge flex aspect-square w-36 flex-col items-center justify-center rounded-full border-4 border-double border-forest text-forest"
                  >
                    <BadgeCheck className="h-8 w-8" />
                    <span className="mt-1 font-serif text-sm font-bold uppercase tracking-[0.1em]">
                      Approved
                    </span>
                    <span className="text-[0.55rem] uppercase tracking-[0.2em]">
                      Hành Trình Việt
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="mt-6 font-serif text-2xl text-emerald">
                      Hộ chiếu đã được đóng dấu!
                    </h3>
                    <p className="mt-2 flex items-center justify-center gap-2 text-sm text-ink-soft">
                      <MessageCircle className="h-4 w-4 text-gold" />
                      Đang chuyển bạn tới{" "}
                      {channel === "messenger" ? "Messenger" : "Zalo"}…
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
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
