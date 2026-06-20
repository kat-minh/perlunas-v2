"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Quote, Compass, Map, ShieldCheck, Camera,
  Mountain, Waves, Tent, Footprints, Sunrise, Grape, Bike, Fish, Sailboat, Sunset,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { founder, reasons } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * OPTION A — THE CONTINUOUS CANVAS for the narrative acts (scenes 4 · 6 · 8).
 * One pinned viewport, one scrubbed master timeline. The destinations dissolve
 * into the founder's journal which dissolves into the opening suitcase — every
 * act morphs IN PLACE, so there are no section boundaries between them, just a
 * single camera move. The interactive scenes (boarding passes, memories, the
 * arrival form) follow as the browseable landing. Reduced-motion stacks them.
 */
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

interface Activity {
  icon: LucideIcon;
  label: string;
  info: string;
  image: string;
}
const DEST: {
  place: string;
  region: string;
  quote: string;
  image: string;
  activities: Activity[];
}[] = [
  {
    place: "Hà Giang",
    region: "Cực Bắc",
    quote: "Không phải con đường nào cũng nên đi vội.",
    image: U("1528127269322-539801943592"),
    activities: [
      { icon: Mountain, label: "Trekking đèo Mã Pí Lèng", info: "Cung đèo hiểm trở bậc nhất, nhìn xuống hẻm Tu Sản và dòng Nho Quế xanh ngắt.", image: U("1528127269322-539801943592") },
      { icon: Waves, label: "Chèo thuyền sông Nho Quế", info: "Lướt thuyền giữa hẻm vực đá vôi cao hàng trăm mét, nước xanh như ngọc.", image: U("1502933691298-84fc14542831") },
      { icon: Tent, label: "Ngủ homestay Lô Lô Chải", info: "Một đêm bên bếp lửa nhà trình tường, nghe chuyện của người Lô Lô.", image: U("1533692328991-08159ff19fca") },
      { icon: Footprints, label: "Săn mây cao nguyên đá", info: "Dậy sớm đón biển mây cuộn trên cao nguyên đá Đồng Văn.", image: U("1448375240586-882707db888b") },
    ],
  },
  {
    place: "Đà Lạt",
    region: "Cao nguyên",
    quote: "Có những nơi, sương mù giữ ta ở lại.",
    image: U("1448375240586-882707db888b"),
    activities: [
      { icon: Sunrise, label: "Săn mây Cầu Đất", info: "Bình minh trên đồi chè, mây phủ dưới chân như chốn cổ tích.", image: U("1570366583862-f91883984fde") },
      { icon: Tent, label: "Cắm trại hồ Tuyền Lâm", info: "Dựng lều bên hồ, nướng BBQ và ngắm sao giữa rừng thông.", image: U("1504280390367-361c6d9f38f4") },
      { icon: Grape, label: "Hái dâu trong vườn", info: "Tự tay hái dâu chín mọng trong vườn và ăn ngay tại chỗ.", image: U("1464965911861-746a04b4bca6") },
      { icon: Bike, label: "Đạp xe rừng thông", info: "Len lỏi giữa rừng thông se lạnh, thơm mùi nhựa thông.", image: U("1541625602330-2277a4c46182") },
    ],
  },
  {
    place: "Phú Quốc",
    region: "Đảo ngọc",
    quote: "Hoàng hôn không kết thúc — nó hẹn ngày trở lại.",
    image: U("1540202404-a2f29016b523"),
    activities: [
      { icon: Fish, label: "Lặn ngắm san hô", info: "Lặn xuống làn nước trong, ngắm rạn san hô và đàn cá rực rỡ.", image: U("1544551763-46a013bb70d5") },
      { icon: Sailboat, label: "Cano khám phá 3 đảo", info: "Phóng cano qua Hòn Móng Tay, Hòn Mây Rút — biển xanh ngắt.", image: U("1507525428034-b723cf961d3e") },
      { icon: Sunset, label: "Hoàng hôn trên du thuyền", info: "Ngắm mặt trời lặn đỏ rực giữa biển khơi từ boong du thuyền.", image: U("1540202404-a2f29016b523") },
      { icon: Camera, label: "Câu mực đêm", info: "Ra khơi đêm, tự câu mực dưới ánh đèn và thưởng thức tại thuyền.", image: U("1513415277900-a62401e19be4") },
    ],
  },
];

const LEAVES = [
  { eyebrow: "Trang bìa", title: "Nhật ký người dẫn lối", body: "Mười hai năm, 63 tỉnh thành, và những con đường không có trên bản đồ." },
  { eyebrow: "Triết lý", title: founder.philosophy, body: "" },
  { eyebrow: "Sứ mệnh", title: "", body: founder.mission },
];

const KIT_ICONS: LucideIcon[] = [Compass, Map, ShieldCheck, Camera];
const KIT_TAGS = ["Experience", "Local", "Safety", "Memories"];

export function JourneyCanvas() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [actIdx, setActIdx] = useState<number | null>(null);
  const [hovAct, setHovAct] = useState<number | null>(null);
  const [beamPct, setBeamPct] = useState(50); // hovered chip centre, % of viewport width
  const [beamHalf, setBeamHalf] = useState(18); // beam top half-width, % (tracks the preview)
  const actIdxRef = useRef<number | null>(null);

  const showAct = (j: number, el: HTMLElement) => {
    setHovAct(j);
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    setBeamPct(((r.x + r.width / 2) / vw) * 100);
    // preview width = min(92vw, 580px) → its half-% — beam sits a touch narrower.
    setBeamHalf(Math.min(46, (29000 / vw)) * 0.82);
  };
  const toggleAct = (i: number) => {
    const next = actIdxRef.current === i ? null : i;
    actIdxRef.current = next;
    setActIdx(next);
    setHovAct(null);
  };

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const q = gsap.utils.selector(root);

      const panels = q(".km-panel");
      const leaves = q(".jc-leaf");
      gsap.set(q(".stage-light"), { autoAlpha: 0 });
      gsap.set(q(".act-journal"), { autoAlpha: 0, scale: 0.82 });
      gsap.set(q(".act-suit"), { autoAlpha: 0, xPercent: 120 });
      gsap.set(panels.slice(1), { autoAlpha: 0 });
      gsap.set(q(".jc-kit"), { autoAlpha: 0, y: 70, scale: 0.6 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "st-canvas",
          trigger: root.current,
          start: "top top",
          end: "+=760%",
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Auto-close a destination's activities once the camera moves on.
            const p = self.progress;
            const active = p < 0.119 ? 0 : p < 0.238 ? 1 : p < 0.357 ? 2 : -1;
            if (actIdxRef.current !== null && actIdxRef.current !== active) {
              actIdxRef.current = null;
              setActIdx(null);
              setHovAct(null);
            }
          },
        },
      });

      // ---- ACT 4 — DESTINATIONS (0 → 6) ----
      panels.forEach((panel, i) => {
        const media = panel.querySelector(".km-media");
        const lines = panel.querySelectorAll(".km-line");
        tl.fromTo(media, { scale: 1.14 }, { scale: 1, duration: 2 }, i * 2);
        if (i > 0) tl.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, i * 2 - 0.35);
        tl.fromTo(
          lines,
          { yPercent: 60, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" },
          i * 2 + 0.2,
        ).to(lines, { yPercent: -40, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, i * 2 + 1.5);
      });
      // Dest → Journal: the land zooms toward the camera, and the shared light
      // canvas fades in beneath — it then STAYS for both journal & suitcase, so
      // those acts only slide their OBJECTS, not their background.
      tl.to(q(".act-dest"), { autoAlpha: 0, scale: 1.18, duration: 1, ease: "power2.in" }, 6);
      tl.to(q(".stage-light"), { autoAlpha: 1, duration: 1.2 }, 6);

      // ---- ACT 6 — FOUNDER JOURNAL (6.4 → 11.5) ----
      tl.fromTo(q(".act-journal"), { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.out" }, 6.2);
      leaves.forEach((lf, i) => {
        // Turn the leaf, then fade it away past the spine so its blank back never
        // piles up on the left — revealing the portrait + keepsakes underneath.
        tl.to(lf, { rotateY: -178, duration: 1, ease: "power1.inOut" }, 7.6 + i);
        tl.to(lf, { autoAlpha: 0, duration: 0.35 }, 7.6 + i + 0.62);
      });
      // Journal → Suitcase: close the book, slide it off to the LEFT, and bring
      // the suitcase IN from the RIGHT — a continuous left/right hand-off.
      tl.to(q(".jc-book"), { rotateY: 28, scale: 0.78, transformOrigin: "left center", transformPerspective: 1300, ease: "power2.in", duration: 0.8 }, 11.0);
      tl.to(q(".act-journal"), { xPercent: -120, autoAlpha: 0, ease: "power2.in", duration: 1 }, 11.5);

      // ---- ACT 8 — SUITCASE (11.7 → end) ----
      tl.to(q(".act-suit"), { xPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 1 }, 11.7);
      tl.to(q(".jc-lid"), { rotateX: -118, duration: 1, ease: "power2.out" }, 12.5);
      tl.to(q(".jc-shadow"), { opacity: 0.25, scaleX: 1.1, duration: 1 }, 12.5);
      tl.fromTo(
        q(".jc-kit"),
        { autoAlpha: 0, y: 70, scale: 0.6 },
        { autoAlpha: 1, y: 0, scale: 1, stagger: 0.45, duration: 0.9, ease: "back.out(1.6)" },
        13,
      );
      tl.to({}, { duration: 1.6 }, 15.2);
    },
    { scope: root, dependencies: [reduced] },
  );

  if (reduced) {
    return (
      <section className="bg-emerald-deep py-20 text-warm">
        <div className="shell space-y-10">
          {DEST.map((d) => (
            <p key={d.place} className="font-serif text-2xl italic">
              {d.place} — “{d.quote}”
            </p>
          ))}
          <p className="font-serif text-xl text-gold-soft">{founder.philosophy}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      aria-label="Hành trình — chuỗi cảnh liền mạch"
      className="relative h-svh min-h-[640px] w-full overflow-hidden bg-emerald-deep text-warm"
    >
      {/* ===== ACT 4 — DESTINATIONS ===== */}
      <div className="act-dest absolute inset-0">
        {DEST.map((c, i) => (
          <article
            key={c.place}
            className="km-panel absolute inset-0 flex cursor-pointer items-center justify-center"
            onClick={() => toggleAct(i)}
            data-cursor="hover"
          >
            <div className="km-media absolute inset-0 will-change-transform">
              <Image src={c.image} alt={c.place} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-emerald-deep/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-emerald-deep/40" />
            </div>

            {/* Dim the surroundings when a preview is projected (dark-room feel) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[15] bg-emerald-deep transition-opacity duration-300"
              style={{ opacity: actIdx === i && hovAct !== null ? 0.72 : 0 }}
            />

            <div
              className={cn(
                "relative z-10 px-6 text-center transition-all duration-500 [will-change:transform,opacity]",
                actIdx === i && "-translate-y-[14vh]",
              )}
            >
              <p className="km-line eyebrow text-gold-soft/90">{c.region}</p>
              <h2 className="km-line mt-3 font-serif font-[440] leading-[0.95] text-[clamp(3rem,11vw,9rem)]">
                {c.place}
              </h2>
              <p className="km-line mx-auto mt-6 max-w-xl font-serif text-[clamp(1.2rem,3vw,2rem)] italic text-warm/90">
                “{c.quote}”
              </p>
              <span className="km-line mt-7 inline-flex items-center gap-2 rounded-full border border-warm/30 px-5 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-warm/80">
                {actIdx === i ? "Rê vào từng trải nghiệm để xem trước" : `Bấm để xem trải nghiệm ở ${c.place}`}
              </span>
            </div>

            {/* Projector light beam — angled from the hovered chip up to the centred preview */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 z-20 h-full w-full transition-opacity duration-300"
              style={{ filter: "blur(4px)", opacity: actIdx === i && hovAct !== null ? 1 : 0 }}
            >
              <defs>
                <linearGradient id={`beam-${i}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="rgba(217,185,106,0.55)" />
                  <stop offset="100%" stopColor="rgba(217,185,106,0.03)" />
                </linearGradient>
              </defs>
              <polygon points={`${beamPct},88 ${(50 - beamHalf).toFixed(1)},63 ${(50 + beamHalf).toFixed(1)},63`} fill={`url(#beam-${i})`} />
            </svg>

            {/* "Projector" preview — always centred */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute left-1/2 top-[15%] z-30 w-[min(92vw,580px)] -translate-x-1/2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                actIdx === i && hovAct !== null ? "scale-100 opacity-100" : "scale-90 opacity-0",
              )}
            >
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gold-soft/25 blur-2xl" />
              <div className="overflow-hidden rounded-2xl bg-warm text-ink shadow-lift ring-1 ring-warm/25">
                <div className="relative aspect-[16/10]">
                  {hovAct !== null && (
                    <Image src={c.activities[hovAct].image} alt="" fill sizes="470px" className="object-cover" />
                  )}
                </div>
                <div className="p-5 text-left">
                  <p className="font-serif text-xl text-emerald">
                    {hovAct !== null ? c.activities[hovAct].label : ""}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-ink-soft">
                    {hovAct !== null ? c.activities[hovAct].info : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity chips — hover to project (single line) */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-[7vh] z-20 px-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                actIdx === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex w-fit max-w-full flex-nowrap justify-center gap-2.5 overflow-x-auto">
                {c.activities.map((a, j) => (
                  <button
                    key={a.label}
                    type="button"
                    onMouseEnter={(e) => showAct(j, e.currentTarget)}
                    onMouseLeave={() => setHovAct(null)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-sm transition-colors",
                      hovAct === j
                        ? "border-gold bg-gold/25 text-warm"
                        : "border-warm/25 bg-emerald-deep/55 text-warm/85 hover:border-gold/50",
                    )}
                    data-cursor="hover"
                  >
                    <a.icon className="h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.7} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Shared light canvas — one continuous background for journal + suitcase */}
      <div className="stage-light absolute inset-0 z-[5] bg-gradient-to-b from-cream via-ivory to-warm" aria-hidden />

      {/* ===== ACT 6 — FOUNDER JOURNAL ===== */}
      <div className="act-journal absolute inset-0 z-10 flex items-center justify-center text-ink [will-change:transform,opacity]">
        <div className="jc-book relative aspect-[5/7] w-[min(92vw,920px)] md:aspect-[3/2] md:w-[min(90vw,900px,108vh)]" style={{ perspective: "2200px" }}>
          {/* left page */}
          <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-xl bg-warm p-5 shadow-lift ring-1 ring-leather/15">
            <div className="relative h-[64%] w-full overflow-hidden rounded-lg">
              <Image src={founder.portrait} alt={founder.name} fill sizes="460px" className="photo-wash object-cover" />
            </div>
            <p className="mt-4 font-serif text-2xl text-emerald">{founder.name}</p>
            <p className="text-sm text-ink-soft">{founder.role}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-leather">{founder.years} năm · 63 tỉnh thành</p>
          </div>
          {/* right base */}
          <div className="absolute inset-y-0 right-0 flex w-1/2 flex-col justify-center rounded-r-xl bg-warm p-4 shadow md:p-8-lift ring-1 ring-leather/15">
            <p className="eyebrow text-leather">Dấu ấn</p>
            <ul className="mt-4 space-y-3">
              {founder.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          {/* leaves */}
          <div className="absolute inset-y-0 right-0 w-1/2" style={{ transformStyle: "preserve-3d" }}>
            {LEAVES.map((lf, i) => (
              <div
                key={i}
                className="jc-leaf absolute inset-0 origin-left"
                style={{ transformStyle: "preserve-3d", transform: `translateZ(${(LEAVES.length - i) * 2}px)`, zIndex: LEAVES.length - i }}
              >
                <div className="absolute inset-0 flex flex-col justify-center rounded-r-xl bg-warm p-4 shadow md:p-8-paper ring-1 ring-leather/15" style={{ backfaceVisibility: "hidden" }}>
                  <p className="eyebrow text-leather">{lf.eyebrow}</p>
                  {lf.title && (
                    <p className={`mt-3 font-serif text-emerald md:mt-4 ${i === 1 ? "text-base italic leading-snug md:text-[1.6rem]" : "text-lg md:text-2xl"}`}>
                      {i === 1 && <Quote className="mb-2 h-5 w-5 text-gold" />}
                      {lf.title}
                    </p>
                  )}
                  {lf.body && <p className="mt-3 text-sm leading-relaxed text-ink-soft md:mt-4 md:text-base">{lf.body}</p>}
                </div>
                <div className="absolute inset-0 rounded-l-xl bg-paper shadow-paper ring-1 ring-leather/15" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <div className="paper-grain absolute inset-0 opacity-30" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ACT 8 — SUITCASE ===== */}
      <div className="act-suit absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-ink [will-change:transform,opacity]">
        <div className="text-center">
          <p className="eyebrow">Hành trang chúng tôi chuẩn bị</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,5vw,3.6rem)] leading-[1] text-emerald">
            Mở vali ra, mọi thứ đã sẵn sàng
          </h2>
        </div>
        <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {reasons.map((r, i) => {
            const Icon = KIT_ICONS[i] ?? Compass;
            return (
              <div key={r.title} className="jc-kit rounded-2xl bg-warm p-5 text-center shadow-paper ring-1 ring-leather/10 [will-change:transform,opacity]">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold">{KIT_TAGS[i]}</p>
                <h3 className="mt-1 font-serif text-base text-emerald">{r.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{r.body}</p>
              </div>
            );
          })}
        </div>
        <div className="relative mt-12 h-[16vh] min-h-[120px] w-[min(78vw,440px)]" style={{ perspective: "1000px" }}>
          <div className="jc-shadow absolute -bottom-4 left-1/2 h-5 w-[88%] -translate-x-1/2 rounded-[50%] bg-leather-dark/40 opacity-0 blur-md" aria-hidden />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-leather to-leather-dark shadow-lift ring-1 ring-leather-dark/40">
            <div className="absolute left-[26%] top-0 h-3 w-7 -translate-y-1/2 rounded bg-gold/80" />
            <div className="absolute right-[26%] top-0 h-3 w-7 -translate-y-1/2 rounded bg-gold/80" />
          </div>
          <div className="jc-lid absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl bg-gradient-to-b from-leather-dark to-leather shadow-lift ring-1 ring-leather-dark/40" style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute left-1/2 top-0 h-6 w-20 -translate-x-1/2 -translate-y-full rounded-t-2xl border-4 border-leather-dark bg-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
