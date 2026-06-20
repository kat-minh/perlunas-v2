"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, MapPin, Clock, CalendarRange, Plane } from "lucide-react";
import { tours, type Tour } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BoardingPass } from "@/components/ui/BoardingPass";
import { StampButton } from "@/components/ui/StampButton";
import { formatVND } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function FeaturedTours() {
  const [active, setActive] = useState<Tour | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // [ScrollTrigger] Cards rise + unmask, staggered.
      gsap.from(".tour-pass", {
        yPercent: 14,
        opacity: 0,
        clipPath: "inset(12% 0% 0% 0%)",
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.12, from: "start" },
        scrollTrigger: { trigger: ".tour-grid", start: "top 80%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="hanh-trinh-noi-bat"
      className="relative scroll-mt-24 bg-warm py-24 md:py-32"
    >
      <div className="shell">
        <SectionHeading
          eyebrow="Tấm vé được yêu thích"
          title="Những hành trình đang chờ bạn mở"
          intro="Chạm vào một tấm vé để mở ra trọn lịch trình. Đây mới là khởi đầu — chúng tôi sẽ may đo lại theo đúng nhịp đi của bạn."
        />

        <div className="tour-grid mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {tours.map((t) => (
            <div key={t.id} className="tour-pass">
              <BoardingPass tour={t} onOpen={setActive} />
            </div>
          ))}
        </div>
      </div>

      {/* Unfolded boarding pass */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-emerald-deep/55 backdrop-blur-sm"
              onClick={() => setActive(null)}
            />
            <motion.div
              layoutId={`pass-${active.id}`}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-warm shadow-lift"
            >
              <div className="relative h-52">
                <Image
                  src={active.image}
                  alt={active.to}
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="photo-wash object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/70 to-transparent" />
                <button
                  onClick={() => setActive(null)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-warm/90 text-emerald"
                  aria-label="Đóng"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
                <div className="absolute bottom-4 left-5 text-warm">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold-soft">
                    {active.region} · {active.code}
                  </p>
                  <h3 className="font-serif text-3xl">{active.to}</h3>
                </div>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
                <div>
                  <div className="flex items-center gap-3 text-emerald">
                    <span className="font-serif text-xl">{active.from}</span>
                    <span className="flex-1 border-t border-dashed border-leather/40" />
                    <Plane className="h-4 w-4 text-gold" />
                    <span className="flex-1 border-t border-dashed border-leather/40" />
                    <span className="font-serif text-xl">{active.to}</span>
                  </div>
                  <p className="mt-4 text-ink-soft">{active.vibe}</p>

                  <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-leather">
                    Điểm nhấn hành trình
                  </p>
                  <ul className="mt-3 space-y-2">
                    {active.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2.5 text-sm text-ink"
                      >
                        <MapPin className="h-4 w-4 text-forest" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl bg-cream/70 p-5">
                  <Detail icon={Clock} label="Thời lượng" value={active.days} />
                  <Detail
                    icon={CalendarRange}
                    label="Thời điểm đẹp"
                    value={active.season}
                  />
                  <div className="mt-1 border-t border-leather/15 pt-3">
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft">
                      Chi phí tham khảo
                    </span>
                    <p className="font-serif text-2xl text-leather-dark">
                      {formatVND(active.price)}
                    </p>
                  </div>
                  <StampButton
                    href="#lien-he"
                    className="mt-1 w-full"
                    onClick={() => setActive(null)}
                  >
                    Nhận tư vấn hành trình
                  </StampButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-forest" />
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft">
          {label}
        </p>
        <p className="text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
