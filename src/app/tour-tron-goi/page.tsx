import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOURS } from "@/lib/catalog";
import { SceneImage } from "@/components/site/SceneImage";

export const metadata: Metadata = {
  title: "Tour trọn gói",
  description: "Những hành trình du lịch trong nước được thiết kế sẵn, chỉ việc khởi hành.",
};

export default function TourTronGoiPage() {
  return (
    <main className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[100rem]">
        <header className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            Tour trọn gói
          </p>
          <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
            Xách balo lên và đi, phần còn lại để Perlunas lo.
          </h1>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-ink/70">
            Lịch khởi hành đều đặn, giá trọn gói rõ ràng, không phát sinh. Mỗi
            hành trình đều có thể may đo lại theo nhịp đi của bạn.
          </p>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {TOURS.map((t) => (
            <Link key={t.slug} href={`/tour/${t.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden">
                <SceneImage
                  seed={`perlunas-tour-${t.slug}`}
                  alt={t.name}
                  w={1000}
                  h={750}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                {t.region} · {t.nights}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{t.name}</h2>
              <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-ink/65">
                {t.teaser}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{t.price}</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                  Xem chi tiết
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
