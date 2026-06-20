import { Reveal } from "./Reveal";
import { LeadButton } from "./LeadButton";
import { SceneImage } from "./SceneImage";

/**
 * Tour đoàn. Two columns: the philosophy/CTA text on the left, a small photo
 * collage on the right (Gala Dinner / Team Building / đoàn đang tham quan). The
 * images are placeholders — swap the seeds for real group photos later.
 */
const moments = [
  { seed: "perlunas-group-gala", alt: "Gala Dinner của đoàn", label: "Gala Dinner" },
  { seed: "perlunas-group-team", alt: "Team building của đoàn", label: "Team Building" },
  { seed: "perlunas-group-tour", alt: "Đoàn đang tham quan", label: "Tham quan" },
];

export function GroupTours() {
  return (
    <section id="tour-doan" className="relative border-t border-[var(--line-soft)] px-6 pb-16 pt-10 sm:px-10 sm:pb-24 sm:pt-12">
      <div className="mx-auto grid max-w-[100rem] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* left — text */}
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-lg font-medium uppercase tracking-[0.22em] text-ink sm:text-2xl">
              Đoàn đông tới mấy, vẫn trọn vẹn từng người
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-[1.7] text-ink/80">
              <p>
                Một chuyến đi đoàn không bắt đầu từ số lượng người, mà từ cảm giác
                mọi người cùng thuộc về một hành trình. Điều khó nhất không phải là
                đưa nhiều người đi cùng nhau, mà là giữ cho ai cũng{" "}
                <em className="italic">thấy mình được quan tâm</em>.
              </p>
              <p>
                Đó là lý do Perlunas tìm hiểu từng đoàn trước khi lên lịch: mục
                tiêu, độ tuổi, ngân sách và nhịp đi riêng. Chúng tôi lo trọn từ vận
                chuyển, lưu trú, ăn uống đến kịch bản gắn kết, với{" "}
                <em className="italic">một đầu mối duy nhất</em> xuyên suốt.
              </p>
              <p>Hãy kể cho chúng tôi về đoàn của bạn.</p>
            </div>
            <div className="mt-9">
              <LeadButton service="Tour đoàn">Liên hệ tư vấn</LeadButton>
            </div>
          </div>
        </Reveal>

        {/* right — photo collage */}
        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* wide: Gala Dinner */}
            <figure className="group relative col-span-2 aspect-[16/10] overflow-hidden">
              <SceneImage
                seed={moments[0].seed}
                alt={moments[0].alt}
                w={1200}
                h={750}
                className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
              <figcaption className="absolute bottom-3 left-4 text-[0.65rem] uppercase tracking-[0.2em] text-paper">
                {moments[0].label}
              </figcaption>
            </figure>

            {/* two squares: Team Building + Tham quan */}
            {moments.slice(1).map((m) => (
              <figure key={m.seed} className="group relative aspect-square overflow-hidden">
                <SceneImage
                  seed={m.seed}
                  alt={m.alt}
                  w={700}
                  h={700}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                <figcaption className="absolute bottom-3 left-4 text-[0.65rem] uppercase tracking-[0.2em] text-paper">
                  {m.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
