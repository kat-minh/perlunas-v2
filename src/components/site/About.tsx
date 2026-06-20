import { Reveal } from "./Reveal";
import { SceneImage } from "./SceneImage";

/**
 * Về chúng tôi. Modelled on the client's reference (about.png): a deliberate dark
 * section. A dramatic image beside a centred "Về chúng tôi" intro (with flourish
 * rules), then the name meaning (Pearl + Luna), vision, mission and values, all
 * on the dark ground. Copy is placeholder.
 */
const values = [
  { title: "Chân thành", desc: "Tư vấn thật lòng, đúng nhu cầu và ngân sách của bạn." },
  { title: "Tận tâm", desc: "Chăm chút từng chi tiết, theo sát đến khi bạn trở về." },
  { title: "Minh bạch", desc: "Báo giá trọn gói rõ ràng, nói được làm được." },
  { title: "Bền lâu", desc: "Một người đồng hành đi cùng bạn qua nhiều hành trình." },
];

export function About() {
  return (
    <section id="ve-chung-toi" className="relative bg-ink text-paper">
      {/* dark split intro */}
      <div className="grid lg:grid-cols-2">
        <Reveal>
          <div className="group relative h-[26vh] overflow-hidden lg:h-full lg:min-h-[18rem]">
            <SceneImage
              seed="perlunas-about-dramatic"
              alt="Perlunas"
              w={1200}
              h={1500}
              className="grayscale transition-all duration-[1.5s] ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-ink/35 transition-opacity duration-[1.5s] ease-out group-hover:opacity-0" />
          </div>
        </Reveal>

        <div className="flex items-center px-6 py-8 sm:px-10 lg:px-16">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-paper/40" />
              <h2 className="font-serif text-2xl uppercase tracking-[0.18em] sm:text-3xl">
                Về chúng tôi
              </h2>
              <span className="h-px w-10 bg-paper/40" />
            </div>
            <p className="mt-6 leading-relaxed text-paper/75">
              Perlunas tạo nên những hành trình du lịch riêng tư, lấy khách hàng
              làm trung tâm, định hình theo sở thích của từng người. Mỗi lịch
              trình là sự chỉn chu trong từng chi tiết, tinh tế và trọn vẹn.
            </p>
          </Reveal>
        </div>
      </div>

      {/* TẠM ẨN theo yêu cầu: tên thương hiệu Pearl/Luna + tầm nhìn/sứ mệnh/giá
          trị cốt lõi. Đổi `false` thành `true` bên dưới để hiện lại. */}
      {false && (
        <div className="mx-auto max-w-[100rem] px-6 py-14 sm:px-10 sm:py-20">
          <div className="grid gap-10 border-t border-paper/15 pt-12 sm:grid-cols-2 lg:gap-16">
            <Reveal>
              <h3 className="font-serif text-3xl text-paper">Pearl</h3>
              <p className="mt-3 max-w-md leading-relaxed text-paper/65">
                Viên ngọc là bạn, vị khách của chúng tôi. Mỗi người một câu chuyện,
                nên chuyến đi cũng phải của riêng bạn.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h3 className="font-serif text-3xl text-paper">Luna</h3>
              <p className="mt-3 max-w-md leading-relaxed text-paper/65">
                Ánh trăng là Perlunas, lặng lẽ dõi theo và chăm chút. Chữ “s” nhỏ ở
                cuối là lời hứa đồng hành bền lâu.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-12 border-t border-paper/15 pt-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/45">Tầm nhìn</p>
              <p className="mt-4 text-2xl font-light leading-snug text-paper sm:text-3xl">
                Trở thành người đồng hành du lịch trong nước được tin yêu nhất tại
                Việt Nam.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/45">Sứ mệnh</p>
              <p className="mt-4 text-2xl font-light leading-snug text-paper sm:text-3xl">
                Mang những hành trình tử tế, chỉn chu đến gần hơn với mỗi người, để
                ai cũng có thể đi và trở về trọn vẹn.
              </p>
            </Reveal>
          </div>

          <p className="mt-16 text-xs font-medium uppercase tracking-[0.3em] text-paper/45">
            Giá trị cốt lõi
          </p>
          <div className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="border-t border-paper/15 pt-5">
                  <h4 className="font-serif text-xl text-paper">{v.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper/60">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
