import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SceneImage } from "@/components/site/SceneImage";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Perlunas thiết kế những hành trình du lịch trong nước tinh tế và trọn vẹn. Tên thương hiệu, triết lý, giá trị cốt lõi, tầm nhìn và sứ mệnh.",
};

const VALUES = [
  { title: "Chân thành", desc: "Tư vấn thật lòng, đúng nhu cầu và ngân sách của bạn." },
  { title: "Tận tâm", desc: "Chăm chút từng chi tiết, theo sát đến khi bạn trở về." },
  { title: "Minh bạch", desc: "Báo giá trọn gói rõ ràng, nói được làm được." },
  { title: "Bền lâu", desc: "Một người đồng hành đi cùng bạn qua nhiều hành trình." },
];

export default function VeChungToiPage() {
  return (
    <main className="pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        <header className="max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            Về chúng tôi
          </p>
          <p className="display mt-6 text-balance text-3xl leading-[1.25] text-ink sm:text-5xl sm:leading-[1.2]">
            Perlunas không bán những chuyến đi rập khuôn. Chúng tôi thiết kế những
            hành trình hợp với từng con người: tử tế, tinh tế và trọn vẹn.
          </p>
        </header>

        <div className="mt-14 aspect-[21/9] overflow-hidden">
          <SceneImage seed="perlunas-about-craft" alt="Perlunas" w={2000} h={860} priority />
        </div>

        {/* name meaning */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="display text-3xl text-ink sm:text-4xl">
              Pearl <span className="text-mute">+</span> Luna<span className="text-mute">(s)</span>
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
            <div>
              <h3 className="font-serif text-2xl text-ink">Pearl</h3>
              <p className="mt-3 leading-relaxed text-ink/70">
                Viên ngọc là bạn, vị khách của chúng tôi. Mỗi người một câu chuyện,
                nên chuyến đi cũng phải độc bản và của riêng bạn.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-ink">Luna</h3>
              <p className="mt-3 leading-relaxed text-ink/70">
                Ánh trăng là Perlunas, lặng lẽ dõi theo và chăm chút từng chi tiết.
                Chữ “s” nhỏ ở cuối là lời hứa đồng hành bền lâu.
              </p>
            </div>
          </div>
        </div>

        {/* vision / mission */}
        <div className="mt-20 grid gap-12 border-t border-[var(--line)] pt-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Tầm nhìn</p>
            <p className="mt-4 text-2xl font-light leading-snug text-ink sm:text-3xl">
              Trở thành người đồng hành du lịch trong nước được tin yêu nhất tại
              Việt Nam.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Sứ mệnh</p>
            <p className="mt-4 text-2xl font-light leading-snug text-ink sm:text-3xl">
              Mang những hành trình tử tế, chỉn chu đến gần hơn với mỗi người, để
              ai cũng có thể đi và trở về trọn vẹn.
            </p>
          </div>
        </div>

        {/* values */}
        <p className="mt-16 text-xs font-medium uppercase tracking-[0.3em] text-mute">
          Giá trị cốt lõi
        </p>
        <div className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="border-t border-[var(--line)] pt-5">
              <h4 className="font-serif text-xl text-ink">{v.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 flex flex-col items-start gap-6 border-t border-[var(--line)] pt-14 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="display text-2xl text-ink sm:text-3xl">
            Cùng Perlunas bắt đầu hành trình của bạn.
          </h2>
          <Link href="/lien-he" className="btn-ink inline-flex items-center gap-2 rounded-[3px] px-7 py-3.5 text-sm font-medium">
            Liên hệ tư vấn
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
