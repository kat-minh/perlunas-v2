"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Plane, BedDouble, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { tours } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * CHƯƠNG 4 — HỆ SINH THÁI TRẢI NGHIỆM.
 * Three large service cards. On desktop the section pins and the cards scroll
 * horizontally right→left; whichever card reaches the centre scales up to draw
 * the eye. On mobile they stack and rise in. Reduced-motion keeps it static.
 */
interface Service {
  icon: LucideIcon;
  code: string;
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  samples?: { to: string; days: string }[];
}

const services: Service[] = [
  {
    icon: Plane,
    code: "EXPLORE",
    kicker: "Gợi ý khám phá",
    title: "Tour ghép lẻ",
    body: "Lịch trình đẹp được thiết kế sẵn theo mùa, khởi hành định kỳ — chỉ việc xách balo lên và đi.",
    bullets: ["Khởi hành cố định", "Giá tối ưu", "Phù hợp người bận rộn"],
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80",
  },
  {
    icon: BedDouble,
    code: "STAY",
    kicker: "Nghỉ dưỡng tuyển chọn",
    title: "Phòng khách sạn cao cấp",
    body: "Tuyển chọn resort, homestay và khách sạn boutique đã được đội ngũ kiểm chứng tận nơi, vị trí đắt giá.",
    bullets: ["Đã thẩm định thực tế", "Vị trí đắt giá", "Giá thân thiện"],
    image:
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1400&q=80",
  },
  {
    icon: Route,
    code: "PRIVATE",
    kicker: "Kèm một số tour mẫu tham khảo",
    title: "Tour đoàn & thiết kế riêng",
    body: "Hành trình may đo 1:1 theo sở thích, ngân sách và nhịp đi của riêng bạn — hoặc trọn gói cho cả đoàn doanh nghiệp.",
    bullets: ["Cá nhân hoá 100%", "Hướng dẫn riêng", "Quy mô tới 500 khách"],
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80",
    samples: tours.slice(0, 3).map((t) => ({ to: t.to, days: t.days })),
  },
];

export function Experiences() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !track.current) return;
      const mm = gsap.matchMedia();

      // DESKTOP: pin + horizontal scroll, with a centre-of-screen scale pop.
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 96;

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });

        // Each card swells as it passes the viewport centre, driven by the
        // horizontal tween (containerAnimation), then settles back.
        gsap.utils.toArray<HTMLElement>(".exp-card").forEach((card) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            })
            .fromTo(card, { scale: 0.9 }, { scale: 1, ease: "power1.out" })
            .to(card, { scale: 0.9, ease: "power1.in" });
        });
      });

      // MOBILE: simple staggered rise.
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".exp-card", {
          y: 44,
          opacity: 0,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: track.current, start: "top 80%", once: true },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="trai-nghiem"
      className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 lg:h-svh lg:min-h-[760px] lg:py-0"
    >
      <div className="flex h-full flex-col justify-center">
        <div className="shell">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-leather/50" />
            <span className="eyebrow">Hệ sinh thái trải nghiệm</span>
          </div>
          <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] text-emerald">
            Ba cách để bắt đầu chuyến đi
          </h2>
        </div>

        <div
          ref={track}
          className="mt-12 flex flex-col gap-6 px-6 md:px-10 lg:mt-16 lg:w-max lg:flex-row lg:gap-10 lg:pl-[max(2.5rem,calc((100vw-78rem)/2+2.5rem))] lg:pr-24"
        >
          {services.map((s, i) => (
            <article
              key={s.code}
              className="exp-card group relative flex shrink-0 flex-col justify-end overflow-hidden rounded-3xl shadow-lift [will-change:transform] max-lg:min-h-[26rem] lg:h-[68vh] lg:w-[38rem]"
            >
              {/* Immersive backdrop */}
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 1024px) 90vw, 38rem"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/40 to-emerald-deep/10" />

              {/* Content */}
              <div className="relative z-10 p-7 text-warm md:p-9">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-gold-soft">
                    {s.code} · {String(i + 1).padStart(2, "0")}/03
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warm/15 backdrop-blur-sm">
                    <s.icon className="h-5 w-5 text-gold-soft" strokeWidth={1.6} />
                  </span>
                </div>

                <p className="mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-gold-soft/90">
                  {s.kicker}
                </p>
                <h3 className="mt-2 font-serif text-3xl md:text-4xl">{s.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-warm/85">
                  {s.body}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-warm/25 px-3 py-1 text-xs text-warm/85"
                    >
                      {b}
                    </li>
                  ))}
                </ul>

                {s.samples && (
                  <div className="mt-5 border-t border-warm/15 pt-4">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-warm/55">
                      Tour mẫu tham khảo
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-warm/90">
                      {s.samples.map((t) => (
                        <span key={t.to}>
                          {t.to} <span className="text-warm/55">· {t.days}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href="#lien-he"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-soft"
                  data-cursor="hover"
                >
                  Tư vấn loại hình này
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
