import type { Metadata } from "next";
import Link from "next/link";
import { TIERS, PROVINCES } from "@/lib/catalog";
import { SceneImage } from "@/components/site/SceneImage";
import { LeadButton } from "@/components/site/LeadButton";

export const metadata: Metadata = {
  title: "Combo du lịch",
  description: "Ba gói combo theo mức độ trải nghiệm, đặt tên theo ba dòng ngọc trai quý: Akoya, Tahiti và South Sea.",
};

export default function ComboPage() {
  return (
    <main className="pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        <header className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            Combo du lịch
          </p>
          <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
            Ba viên ngọc, ba mức trải nghiệm.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-ink/70">
            Mỗi combo kết hợp lưu trú, di chuyển và trải nghiệm thành một hành
            trình liền mạch. Chúng tôi đặt tên ba gói theo ba dòng ngọc trai quý
            nhất thế giới, như cách mỗi viên ngọc mang một vẻ đẹp và giá trị riêng.
          </p>
        </header>
      </div>

      {/* tiers */}
      <div className="mx-auto mt-16 max-w-[100rem] px-6 sm:px-10">
        <div className="space-y-16 sm:space-y-24">
          {TIERS.map((t, i) => (
            <article
              key={t.name}
              className="grid items-center gap-10 border-t border-[var(--line)] pt-12 lg:grid-cols-2 lg:gap-16"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full bg-[var(--surface)]">
                  <SceneImage
                    seed={`perlunas-pearl-${t.name.toLowerCase().replace(" ", "-")}`}
                    alt={`Ngọc ${t.name}`}
                    w={800}
                    h={800}
                  />
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
      </div>

      {/* pick a destination */}
      <div className="mx-auto mt-24 max-w-[100rem] px-6 sm:px-10">
        <div className="border-t border-[var(--line)] pt-14">
          <h2 className="display text-3xl text-ink sm:text-4xl">Chọn một điểm đến</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink/70">
            Xem ba gói combo áp dụng cho từng vùng đất.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {PROVINCES.map((p) => (
              <Link
                key={p.slug}
                href={`/combo/${p.slug}`}
                className="rounded-full border border-[var(--line)] px-5 py-2 text-sm text-ink/80 transition-colors hover:border-ink hover:text-ink"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-20 max-w-[100rem] px-6 sm:px-10">
        <div className="flex flex-col items-start gap-6 border-t border-[var(--line)] pt-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="display text-2xl text-ink sm:text-3xl">
              Chưa chắc nên chọn gói nào?
            </h2>
            <p className="mt-2 text-ink/70">
              Để lại thông tin, Perlunas tư vấn gói phù hợp với bạn, miễn phí.
            </p>
          </div>
          <LeadButton service="Combo du lịch">Nhận tư vấn</LeadButton>
        </div>
      </div>
    </main>
  );
}
