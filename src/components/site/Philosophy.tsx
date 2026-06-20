import { Reveal } from "./Reveal";

/**
 * The philosophy statement below the hero. A quiet, centred manifesto in a
 * refined voice. Copy is placeholder.
 */
export function Philosophy() {
  return (
    <section id="triet-ly" className="relative px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            Triết lý
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="display mt-8 text-balance text-[1.6rem] leading-[1.45] text-ink sm:text-[2.2rem] sm:leading-[1.4]">
            Một hành trình đẹp bắt đầu từ cảm giác bạn mang theo, không phải điểm
            đến. Vì thế Perlunas không tạo ra những chuyến đi rập khuôn. Chúng tôi
            lắng nghe từng người, rồi thiết kế một hành trình vừa vặn, chỉn chu
            trong từng chi tiết. Với chúng tôi, mỗi vị khách là một viên ngọc.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
