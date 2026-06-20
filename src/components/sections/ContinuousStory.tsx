"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Quote } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { founder, tours } from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LeadForm } from "@/components/ui/LeadForm";

/**
 * THE CONTINUOUS CANVAS ("một dải lụa liền mạch").
 *
 * Instead of five stacked <section>s sliding past one another, every chapter is
 * stacked in ONE pinned viewport. A single master timeline, scrubbed to Lenis,
 * crossfades / transforms each chapter in place as the user scrolls — the hero
 * photo grows into the backdrop and stays, then story → founder → products
 * (horizontal) → form dissolve through the same frame. No visible seams.
 *
 * `autoAlpha` (opacity + visibility) drives the chapters, so a faded-out chapter
 * is `visibility:hidden` and cannot intercept clicks — the visible chapter (and
 * only it) stays interactive. Reduced-motion users get a plain stacked layout.
 */
const SERVICES = [
  {
    code: "EXPLORE",
    title: "Tour ghép lẻ trọn gói",
    body: "Khám phá Việt Nam với chi phí tối ưu, lịch trình chuẩn chỉnh, khởi hành định kỳ.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80",
  },
  {
    code: "STAY",
    title: "Combo phòng khách sạn cao cấp",
    body: "Hệ thống resort & khách sạn boutique đã thẩm định tận nơi, vị trí đắt giá, giữ chỗ tức thì.",
    image:
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1400&q=80",
  },
  {
    code: "PRIVATE",
    title: "Tour đoàn & thiết kế riêng",
    body: "May đo lịch trình bảo mật, đẳng cấp cho gia đình và doanh nghiệp — cá nhân hoá 100%.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80",
    samples: tours.slice(0, 3).map((t) => `${t.to} · ${t.days}`),
  },
];

type LenisLike = { scrollTo: (target: number, opts?: object) => void };

export function ContinuousStory() {
  const reduced = useReducedMotion();
  const stack = reduced; // accessible fallback: plain vertical stack

  const canvasRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      const canvas = canvasRef.current;
      const track = trackRef.current;
      if (!canvas || !track) return;

      const hero = heroRef.current;
      const story = storyRef.current;
      const founderEl = founderRef.current;
      const products = productsRef.current;
      const contact = contactRef.current;

      // Initial states: hero frame small & centred, later chapters hidden.
      gsap.set(heroBgRef.current, { scale: 0.6, borderRadius: "1.75rem" });
      gsap.set([story, founderEl, products, contact], { autoAlpha: 0 });

      // Hero slogan intro (after the loading curtain lifts).
      gsap.from(".hero-word", {
        yPercent: 120,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
        delay: 2.1,
      });

      // ---- MASTER TIMELINE — one clock for the whole story --------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: canvas,
          start: "top top",
          end: "+=600%", // long, weighty scroll
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // CH1 → CH2 : photo grows into the backdrop, slogan lifts, story appears.
      tl.to(heroBgRef.current, { scale: 1, borderRadius: 0, ease: "none", duration: 2 }, 0)
        .to(hero, { autoAlpha: 0, y: -100, duration: 1.4 }, 0.5)
        .fromTo(
          story,
          { autoAlpha: 0, y: 90 },
          { autoAlpha: 1, y: 0, duration: 1.8 },
          1.2,
        );

      // CH2 → CH3 : story dissolves, founder slides in from the right.
      tl.to(story, { autoAlpha: 0, y: -60, duration: 1.4 }, "+=1.4")
        .fromTo(
          founderEl,
          { autoAlpha: 0, x: 120 },
          { autoAlpha: 1, x: 0, duration: 1.8 },
          "<0.5",
        );

      // CH3 → CH4 : founder shrinks away, products fade in, then scroll across.
      tl.to(founderEl, { autoAlpha: 0, scale: 0.95, duration: 1.4 }, "+=1.2")
        .fromTo(products, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, "<0.4")
        .to(
          track,
          {
            x: () => -(track.scrollWidth - canvas.clientWidth + 64),
            ease: "none",
            duration: 4,
          },
          ">-0.2",
        );

      // CH4 → CH5 : products lift away, the consultation form is unveiled.
      tl.to(products, { autoAlpha: 0, y: -100, duration: 1.4 }, "+=0.5").fromTo(
        contact,
        { autoAlpha: 0, y: 100 },
        { autoAlpha: 1, y: 0, duration: 1.8 },
        "<0.5",
      );

      // ---- In-canvas navigation -----------------------------------------
      // Anchor links can't "jump" between overlapping chapters, so map each to
      // a scroll position within the pinned range and glide there with Lenis.
      const st = tl.scrollTrigger!;
      const fracById: Record<string, number> = {
        "khoi-hanh": 0,
        "tam-nguyen": 0.18,
        "nguoi-dan-loi": 0.44,
        "trai-nghiem": 0.68,
        "lien-he": 0.93,
      };
      const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
      const handlers: Array<[Element, EventListener]> = [];
      Object.entries(fracById).forEach(([id, frac]) => {
        document.querySelectorAll(`a[href="#${id}"]`).forEach((a) => {
          const handler: EventListener = (e) => {
            e.preventDefault();
            const y = st.start + (st.end - st.start) * frac;
            if (lenis) lenis.scrollTo(y, { duration: 1.4 });
            else window.scrollTo({ top: y, behavior: "smooth" });
          };
          a.addEventListener("click", handler);
          handlers.push([a, handler]);
        });
      });

      return () => handlers.forEach(([a, h]) => a.removeEventListener("click", h));
    },
    { scope: canvasRef, dependencies: [reduced] },
  );

  const layerPos = stack ? "relative min-h-svh w-full py-24" : "absolute inset-0";

  return (
    <section
      id="khoi-hanh"
      aria-label="Hành Trình Việt — câu chuyện hành trình"
      className="relative w-full overflow-hidden bg-emerald-deep text-warm"
    >
      <div ref={canvasRef} className={cn("relative w-full", !stack && "h-svh")}>
        {/* Persistent cinematic backdrop (the hero photo that grows & stays) */}
        <div
          ref={heroBgRef}
          className="absolute inset-0 z-0 overflow-hidden will-change-transform"
        >
          <Image
            src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=80"
            alt="Cung đường đèo Mã Pí Lèng, Hà Giang"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/35 to-emerald-deep/55" />
        </div>
        <div className="paper-grain absolute inset-0 z-[1] opacity-20" aria-hidden />

        {/* CHƯƠNG 1 — KHỞI HÀNH */}
        <div
          ref={heroRef}
          className={cn(
            layerPos,
            "z-20 flex flex-col items-center justify-center px-6 text-center [will-change:transform,opacity]",
          )}
        >
          <p className="eyebrow mb-6 text-gold-soft/90">
            Du lịch nội địa · Est. {site.foundedYear}
          </p>
          <h1 className="font-serif font-[440] leading-[0.92] tracking-[-0.03em]">
            <span className="block overflow-hidden">
              <span className="hero-word block text-[clamp(2.4rem,7vw,5.5rem)] text-warm">
                Chạm Vào Thế Giới
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-word block text-[clamp(2.8rem,9vw,7rem)] italic text-gold-soft">
                Theo Cách Của Bạn
              </span>
            </span>
          </h1>
          {!stack && (
            <span className="mt-12 flex flex-col items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-warm/55">
              Cuộn để khởi hành
              <ArrowDown className="h-4 w-4 animate-floaty" />
            </span>
          )}
        </div>

        {/* CHƯƠNG 2 — TÂM NGUYỆN */}
        <div
          id="tam-nguyen"
          ref={storyRef}
          className={cn(
            layerPos,
            "z-20 flex items-center justify-center px-6 [will-change:transform,opacity]",
            !stack && "opacity-0",
          )}
        >
          <div className="max-w-3xl text-center">
            <p className="eyebrow mb-6 text-gold-soft/90">Tâm nguyện</p>
            <p className="font-serif text-[clamp(1.7rem,4vw,3rem)] font-[430] leading-[1.18] tracking-[-0.02em] text-warm">
              Chúng tôi không bán những chuyến đi rập khuôn. Chúng tôi kiến tạo
              những hành trình <span className="italic text-gold-soft">tử tế</span>,
              nơi mỗi điểm đến là một chương ký ức vô giá được may đo riêng cho
              chính bạn.
            </p>
          </div>
        </div>

        {/* CHƯƠNG 3 — NGƯỜI ĐỒNG HÀNH */}
        <div
          id="nguoi-dan-loi"
          ref={founderRef}
          className={cn(
            layerPos,
            "z-20 flex items-center justify-center px-6 [will-change:transform,opacity]",
            !stack && "opacity-0",
          )}
        >
          <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl shadow-lift md:mx-0">
              <Image
                src={founder.portrait}
                alt={`Chân dung ${founder.name}`}
                fill
                sizes="(max-width: 768px) 80vw, 30vw"
                className="photo-wash object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/50 to-transparent" />
            </div>
            <div>
              <span className="eyebrow text-gold/80">Lời người khởi xướng</span>
              <div className="mt-4 flex gap-3 border-l-2 border-gold/50 pl-5">
                <Quote className="h-6 w-6 shrink-0 text-gold" />
                <h3 className="font-serif text-[clamp(1.6rem,3vw,2.6rem)] italic leading-tight text-warm">
                  {founder.philosophy}
                </h3>
              </div>
              <p className="mt-6 max-w-md leading-relaxed text-warm/75">
                {founder.mission}
              </p>
              <p className="mt-6 text-sm text-warm/70">
                <span className="font-serif text-2xl text-gold-soft">
                  {founder.name}
                </span>{" "}
                · {founder.role} · {founder.years} năm dẫn lối
              </p>
            </div>
          </div>
        </div>

        {/* CHƯƠNG 4 — HỆ SINH THÁI TRẢI NGHIỆM (trượt ngang) */}
        <div
          id="trai-nghiem"
          ref={productsRef}
          className={cn(
            layerPos,
            "z-20 flex flex-col justify-center [will-change:transform,opacity]",
            !stack && "opacity-0",
            stack && "overflow-x-auto",
          )}
        >
          <div className="px-6 md:px-12">
            <span className="eyebrow text-gold-soft/90">Hệ sinh thái trải nghiệm</span>
            <p className="mt-3 font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight">
              Ba cách để bắt đầu chuyến đi
            </p>
          </div>
          <div
            ref={trackRef}
            className={cn(
              "mt-8 flex gap-6 px-6 will-change-transform md:gap-8 md:px-12",
              !stack && "w-max",
            )}
          >
            {SERVICES.map((s, i) => (
              <article
                key={s.code}
                className="group relative flex h-[58vh] min-h-[24rem] w-[80vw] shrink-0 flex-col justify-end overflow-hidden rounded-3xl shadow-lift sm:w-[60vw] lg:w-[34vw]"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 1024px) 80vw, 34vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/35 to-transparent" />
                <div className="relative z-10 p-7 md:p-8">
                  <span className="font-mono text-xs tracking-[0.2em] text-gold-soft">
                    {s.code} · {String(i + 1).padStart(2, "0")}/03
                  </span>
                  <h4 className="mt-4 font-serif text-2xl md:text-3xl">{s.title}</h4>
                  <p className="mt-2 max-w-xs text-sm text-warm/80">{s.body}</p>
                  {s.samples && (
                    <div className="mt-4 border-t border-warm/15 pt-3">
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-warm/55">
                        Tour mẫu tham khảo
                      </p>
                      <ul className="mt-2 space-y-1">
                        {s.samples.map((t) => (
                          <li key={t}>
                            <a
                              href="#lien-he"
                              className="inline-flex items-center gap-1 text-sm text-warm/90 transition-colors hover:text-gold-soft"
                              data-cursor="hover"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              {t}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CHƯƠNG 5 — THIẾT KẾ CHUYẾN ĐI CỦA BẠN */}
        <div
          id="lien-he"
          ref={contactRef}
          className={cn(
            layerPos,
            "z-30 flex items-center justify-center px-6 [will-change:transform,opacity]",
            !stack && "opacity-0",
          )}
        >
          <div className="w-full max-w-lg">
            <div className="mb-6 text-center">
              <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-tight">
                Thiết kế chuyến đi của bạn
              </h2>
              <p className="mt-2 text-sm text-warm/70">
                Để lại thông tin — chuyên viên của chúng tôi sẽ tư vấn ngay qua
                Zalo/Messenger.
              </p>
            </div>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
