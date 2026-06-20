import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SceneImage } from "./SceneImage";

/**
 * Khách sạn. A clean 3-up grid: a SQUARE photo, then three blocks under it —
 * (1) name + location, (2) a highlight description that carries the nightly
 * price, (3) a "Xem chi tiết" button. Parts (1) and (3) share the display font
 * (Bebas). A "Xem thêm" link leads to the full Khách sạn page. Placeholder copy.
 */
const hotels = [
  {
    slug: "lunar-bay",
    name: "Lunar Bay Resort",
    location: "Phú Quốc",
    price: "3.500.000đ",
    desc: "Khu nghỉ dưỡng bên bãi biển riêng phía Nam đảo Ngọc, với hồ bơi vô cực hướng hoàng hôn và spa giữa rừng nhiệt đới.",
  },
  {
    slug: "maison-de-lune",
    name: "Maison de Lune Boutique Hotel",
    location: "Hội An",
    price: "2.000.000đ",
    desc: "Khách sạn boutique trong lòng phố cổ, pha trộn kiến trúc Đông Dương và sự tĩnh lặng bên dòng Hoài giang.",
  },
  {
    slug: "serenity-retreat",
    name: "Serenity Retreat",
    location: "Đà Lạt",
    price: "2.500.000đ",
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
                {/* square photo */}
                <div className="aspect-square overflow-hidden">
                  <SceneImage
                    seed={`perlunas-hotel-${h.slug}`}
                    alt={h.name}
                    w={1000}
                    h={1000}
                    className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                  />
                </div>

                {/* part 1 — name + location (display font) */}
                <h3 className="mt-5 font-serif text-2xl leading-snug text-ink">
                  {h.name} - {h.location}
                </h3>

                {/* part 2 — highlight + nightly price */}
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ink/65">{h.desc}</p>
                <p className="mt-2 text-sm text-ink/70">
                  Giá từ: <span className="font-medium text-ink">{h.price}</span>/đêm
                </p>

                {/* part 3 — link, same font as part 1 (display) */}
                <span className="mt-4 inline-flex items-center gap-1.5 font-serif text-sm tracking-[0.05em] text-ink">
                  <span className="link-underline">Xem chi tiết</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
