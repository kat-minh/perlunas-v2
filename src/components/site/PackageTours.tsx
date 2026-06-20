import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SceneImage } from "./SceneImage";

/**
 * Tour trọn gói. Modelled on the client's reference (Black Tomato "Explore our
 * trips"): a side title, then a horizontal rail of tall image cards. Each card
 * shows a nights badge + region + name over the photo; on hover it reveals a
 * short teaser, the price and a "Xem chi tiết" button. Photos/copy are
 * placeholder; detail route /tour/[slug] is built later.
 */
const tours = [
  { slug: "da-lat", name: "Đà Lạt mộng mơ", region: "Lâm Đồng", nights: "3 đêm", price: "từ 2.890.000đ", teaser: "Ba ngày giữa rừng thông và sương sớm: săn mây Cầu Đất, dạo vườn hồng, nhâm nhi cà phê trong cái se lạnh cao nguyên." },
  { slug: "phu-quoc", name: "Phú Quốc đảo ngọc", region: "Kiên Giang", nights: "3 đêm", price: "từ 3.690.000đ", teaser: "Cáp treo Hòn Thơm, lặn ngắm san hô và những hoàng hôn rực rỡ bên bãi biển trong vắt phía Nam." },
  { slug: "ha-noi-sapa", name: "Hà Nội Sa Pa", region: "Miền Bắc", nights: "4 đêm", price: "từ 4.290.000đ", teaser: "Từ phố cổ ngàn năm đến ruộng bậc thang Mường Hoa và đỉnh Fansipan ẩn hiện trong mây." },
  { slug: "da-nang-hoi-an", name: "Đà Nẵng Hội An", region: "Miền Trung", nights: "3 đêm", price: "từ 3.190.000đ", teaser: "Cầu Vàng Bà Nà, phố Hội lung linh đèn lồng và bãi biển Mỹ Khê xanh ngắt." },
  { slug: "nha-trang", name: "Nha Trang biển xanh", region: "Khánh Hòa", nights: "3 đêm", price: "từ 2.990.000đ", teaser: "Vịnh biển trong xanh, khám phá đảo Hòn Mun và thư giãn với tắm bùn khoáng nổi tiếng." },
];

export function PackageTours() {
  return (
    <section id="tour-tron-goi" className="relative py-14 sm:py-20">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        {/* side title */}
        <div className="mb-10 shrink-0 px-6 sm:px-10 lg:mb-0 lg:flex lg:w-[22rem] lg:flex-col lg:justify-center lg:pl-10 lg:pr-0">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              Tour trọn gói
            </p>
            <h2 className="display mt-5 text-4xl text-ink sm:text-5xl">
              Những hành trình đã thiết kế sẵn.
            </h2>
            <p className="mt-4 max-w-xs font-serif text-lg italic text-ink/60">
              Những trải nghiệm chỉn chu, khơi gợi cảm hứng cho mỗi chuyến đi.
            </p>
          </Reveal>
        </div>

        {/* rail */}
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:px-10 lg:pl-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tours.map((t, i) => (
            <Reveal key={t.slug} delay={i * 60} className="shrink-0 snap-start">
              <a
                href={`/tour/${t.slug}`}
                className="group relative block h-[32rem] w-[78vw] overflow-hidden sm:w-[20rem]"
              >
                <SceneImage
                  seed={`perlunas-tour-${t.slug}`}
                  alt={t.name}
                  w={760}
                  h={1010}
                  className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-ink/10 transition-colors duration-500 group-hover:from-ink group-hover:via-ink/45" />

                {/* nights badge */}
                <span className="absolute right-4 top-4 text-[0.7rem] uppercase tracking-[0.18em] text-paper/85">
                  {t.nights}
                </span>

                {/* bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-paper/70">
                    {t.region}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl leading-snug">{t.name}</h3>

                  {/* hover reveal: teaser + price + button */}
                  <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="pt-3 text-sm leading-relaxed text-paper/85">{t.teaser}</p>
                      <p className="mt-3 text-sm font-medium text-paper">{t.price}</p>
                      <span className="mt-4 inline-flex items-center gap-2 border border-paper/60 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-paper transition-colors group-hover:bg-paper group-hover:text-ink">
                        Xem chi tiết
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
