import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TIERS } from "@/lib/catalog";
import { PearlIcon } from "@/components/site/PearlIcon";
import { LeadButton } from "@/components/site/LeadButton";

export const metadata: Metadata = {
  title: "Phân loại Combo — Akoya · Tahiti · South Sea",
  description:
    "Vì sao Perlunas chia combo theo ba dòng ngọc trai Akoya, Tahiti và South Sea, mỗi gói gồm những gì và cách chọn gói phù hợp.",
};

export default function ComboTiersPage() {
  return (
    <main className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[100rem]">
        <Link
          href="/combo"
          className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Combo du lịch
        </Link>

        <header className="mt-6 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            Phân loại Combo
          </p>
          <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
            Ba viên ngọc, ba chuẩn dịch vụ.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-ink/70">
            Akoya, Tahiti và South Sea là ba chuẩn dịch vụ Perlunas đặt ra, gọi
            tên theo ba dòng ngọc trai quý nhất thế giới. Mỗi chuẩn áp dụng cho
            nhiều combo ở nhiều nơi và mức giá khác nhau — đây là ý nghĩa và những
            gì có trong từng gói.
          </p>
        </header>

        {/* tiers */}
        <div className="mt-16 space-y-16 sm:space-y-24">
          {TIERS.map((t, i) => (
            <article
              key={t.name}
              className="grid items-center gap-10 border-t border-[var(--line)] pt-12 lg:grid-cols-2 lg:gap-16"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-full bg-[var(--surface)]">
                  <PearlIcon tier={t.name} className="h-40 w-40 sm:h-52 sm:w-52" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-sm text-mute">0{i + 1}</span>
                  <h2 className="font-serif text-4xl text-ink sm:text-5xl">{t.name}</h2>
                </div>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-mute">
                  {t.tagline}
                </p>
                <p className="mt-6 text-pretty font-light leading-relaxed text-ink/70">
                  {t.pearl}
                </p>
                <p className="mt-4 text-pretty leading-relaxed text-ink/80">{t.story}</p>

                <p className="mt-7 text-xs font-medium uppercase tracking-[0.2em] text-ink">
                  Gói gồm có
                </p>
                <ul className="mt-3 space-y-2">
                  {t.includes.map((it) => (
                    <li key={it} className="flex gap-3 text-sm text-ink/75">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* how to choose — nội dung chi tiết sẽ được brief bổ sung */}
        <section className="mt-24 border-t border-[var(--line)] pt-14">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              Cách chọn gói
            </p>
            <h2 className="display mt-5 text-3xl text-ink sm:text-4xl">
              Chọn gói phù hợp với nhu cầu của bạn.
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-ink/70">
              Mỗi gói phù hợp với một kiểu chuyến đi khác nhau — về ngân sách, mức
              độ riêng tư và những trải nghiệm bạn mong muốn. Phần hướng dẫn chọn
              gói chi tiết sẽ được Perlunas cập nhật. Trong lúc đó, cứ để lại thông
              tin, chúng tôi sẽ tư vấn gói hợp nhất cho bạn.
            </p>
            <div className="mt-8">
              <LeadButton service="Combo du lịch">Nhận tư vấn chọn gói</LeadButton>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
