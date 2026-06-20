import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SceneImage } from "./SceneImage";

/**
 * Combo du lịch. Modelled on the client's reference (combo.png): a uniform grid
 * of tall tiles with the province name centred over each image (replacing the
 * stock "Family Holidays" labels), and a "Xem tất cả" tile at the end. Clicking a
 * province opens that province's combo page. Each combo comes in three tiers
 * named after pearls (Akoya / Tahiti / South Sea), explained on /combo.
 * Photos/copy are placeholder.
 */
const provinces = [
  { name: "Hà Nội", slug: "ha-noi" },
  { name: "TP. Hồ Chí Minh", slug: "ho-chi-minh" },
  { name: "Hạ Long", slug: "ha-long" },
  { name: "Đà Lạt", slug: "da-lat" },
  { name: "Phú Quốc", slug: "phu-quoc" },
  { name: "Đà Nẵng", slug: "da-nang" },
  { name: "Nha Trang", slug: "nha-trang" },
  { name: "Huế", slug: "hue" },
  { name: "Sa Pa", slug: "sa-pa" },
];

export function Combos() {
  return (
    <section id="combo" className="relative border-t border-[var(--line-soft)] px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Combo du lịch</p>
            <h2 className="display mt-5 max-w-2xl text-4xl text-ink sm:text-5xl">
              Chọn một vùng đất để bắt đầu.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink/65">
              Mỗi điểm đến có ba gói combo theo mức độ trải nghiệm: Akoya, Tahiti
              và South Sea, đặt theo tên ba dòng ngọc trai quý.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <a href="/combo" className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink">
              <span className="link-underline">Tìm hiểu ba gói ngọc</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {provinces.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 5) * 50}>
              <a
                href={`/combo/${p.slug}`}
                className="group relative flex aspect-[3/4] items-center justify-center overflow-hidden"
              >
                <SceneImage
                  seed={`perlunas-place-${p.slug}`}
                  alt={p.name}
                  w={500}
                  h={667}
                  className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/35 transition-colors duration-500 group-hover:bg-ink/55" />
                <h3 className="relative px-3 text-center text-sm font-medium uppercase leading-snug tracking-[0.18em] text-paper transition-transform duration-500 ease-out group-hover:scale-[1.15] sm:text-base">
                  {p.name}
                </h3>
              </a>
            </Reveal>
          ))}

          {/* Xem tất cả tile */}
          <Reveal delay={(provinces.length % 5) * 50}>
            <a
              href="/combo"
              className="group relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-ink text-paper transition-colors hover:bg-ink/85"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em]">
                Xem tất cả
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
