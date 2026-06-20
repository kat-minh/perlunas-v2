import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SceneImage } from "./SceneImage";

/**
 * Khách sạn. Modelled on the client's reference (hotel.png): a clean 3-up grid,
 * image on top with the hotel name + a short description + a "Xem chi tiết" link
 * below it. A "Xem thêm" button leads to the full Khách sạn page (built later)
 * where guests filter by NƠI ĐẾN (province) first, then LOẠI HÌNH LƯU TRÚ.
 * Names/copy are placeholder.
 */
const hotels = [
  {
    slug: "lunar-bay",
    name: "Lunar Bay Resort",
    meta: "Resort · Phú Quốc",
    desc: "Khu nghỉ dưỡng bên bãi biển riêng phía Nam đảo Ngọc, với hồ bơi vô cực hướng hoàng hôn và spa giữa rừng nhiệt đới.",
  },
  {
    slug: "maison-de-lune",
    name: "Maison de Lune",
    meta: "Boutique · Hội An",
    desc: "Khách sạn boutique trong lòng phố cổ, pha trộn kiến trúc Đông Dương và sự tĩnh lặng bên dòng Hoài giang.",
  },
  {
    slug: "serenity-retreat",
    name: "Serenity Retreat",
    meta: "Retreat · Đà Lạt",
    desc: "Không gian ẩn mình giữa rừng thông, nơi mỗi sáng thức dậy trong sương và tiếng chim, dành cho những ngày chậm lại.",
  },
];

export function Hotels() {
  return (
    <section id="khach-san" className="relative border-t border-[var(--line-soft)] px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Khách sạn</p>
            <h2 className="display mt-5 max-w-2xl text-4xl text-ink sm:text-5xl">
              Những chỗ nghỉ được tuyển chọn.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link href="/khach-san" className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink">
              <span className="link-underline">Xem thêm tất cả khách sạn</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {hotels.map((h, i) => (
            <Reveal key={h.slug} delay={i * 90}>
              <Link href="/khach-san" className="group block">
                <div className="aspect-[3/2] overflow-hidden">
                  <SceneImage
                    seed={`perlunas-hotel-${h.slug}`}
                    alt={h.name}
                    w={1000}
                    h={667}
                    className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-mute">{h.meta}</p>
                <h3 className="mt-2 font-serif text-2xl text-ink">{h.name}</h3>
                <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-ink/65">{h.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-ink">
                  <span className="link-underline">Xem chi tiết</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
