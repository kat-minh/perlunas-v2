import { Reveal } from "./Reveal";
import { LeadButton } from "./LeadButton";

/**
 * Triết lý tour đoàn. Modelled on the client's reference (quote-tour.png): a
 * centred editorial text block about the philosophy and the way Perlunas runs
 * group tours, closing with a CTA. Copy is placeholder.
 */
export function GroupTours() {
  return (
    <section id="tour-doan" className="relative border-t border-[var(--line-soft)] px-6 pb-16 pt-10 sm:px-10 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-lg font-semibold uppercase tracking-[0.22em] text-ink sm:text-2xl">
            Đoàn đông tới mấy, vẫn trọn vẹn từng người
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 space-y-5 text-lg leading-[1.7] text-ink/80 sm:text-xl">
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
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex justify-center">
            <LeadButton service="Tour đoàn">Liên hệ tư vấn</LeadButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
