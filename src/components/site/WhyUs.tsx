import { Wallet, Headset, Route, LifeBuoy, Compass } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Tại sao chọn Perlunas. Modelled on the client's reference (why.png): a centred
 * title, a short rule, then a single row of thin line icons with short labels.
 * No photos. Copy is placeholder.
 */
const reasons = [
  { icon: Wallet, title: "Giá minh bạch", color: "#93B89C" }, // sage
  { icon: Headset, title: "Tư vấn miễn phí", color: "#8BB2C9" }, // sky
  { icon: Route, title: "Lịch trình may đo", color: "#E2A876" }, // peach
  { icon: LifeBuoy, title: "Hỗ trợ tận nơi", color: "#D98A94" }, // blush
  { icon: Compass, title: "Trải nghiệm địa phương", color: "#AC9CC9" }, // lavender
];

export function WhyUs() {
  return (
    <section id="tai-sao" className="relative px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[100rem] text-center">
        <Reveal>
          <h2 className="display text-3xl text-ink sm:text-4xl">
            Tại sao chọn Perlunas?
          </h2>
          <div className="mx-auto mt-6 h-px w-12 bg-ink/25" />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 70}>
              <div className="flex flex-col items-center px-2">
                <r.icon className="h-9 w-9" strokeWidth={1.1} style={{ color: r.color }} />
                <p className="mt-5 font-serif text-lg leading-snug text-ink">
                  {r.title}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
