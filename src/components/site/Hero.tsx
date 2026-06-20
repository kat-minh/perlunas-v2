import { LeadButton } from "./LeadButton";

/**
 * Opening Scene. A full-bleed cinematic video with the headline set large at the
 * lower-left, editorial style.
 *
 * NOTE: the video URL below is a temporary placeholder (Black Tomato's CDN).
 * Replace with Perlunas's own footage hosted in /public to avoid a broken link
 * and any rights issues.
 */
const HERO_VIDEO = "/hero-vid.mp4";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/80" />
      </div>

      <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-16 sm:px-10 sm:pb-24">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="reveal is-in lg:col-span-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/75">
              Thiết kế hành trình du lịch trong nước
            </p>
            <h1 className="display mt-6 text-[2.25rem] leading-[1.05] text-paper sm:text-6xl lg:text-[4.75rem]">
              Mỗi hành trình <br />là một viên ngọc.
            </h1>
          </div>

          <div className="reveal is-in lg:col-span-4 lg:pb-3">
            <p className="max-w-sm text-pretty leading-relaxed text-paper/85">
              Perlunas thiết kế những chuyến đi trong nước đáng nhớ, tinh tế trong
              từng chi tiết và trọn vẹn từ đầu đến cuối.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#tour-tron-goi" className="btn-paper rounded-[3px] px-6 py-3 text-sm font-medium">
                Khám phá hành trình
              </a>
              <LeadButton variant="ghost">Liên hệ tư vấn</LeadButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
