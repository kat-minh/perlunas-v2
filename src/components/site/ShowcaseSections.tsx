import { Quote } from "lucide-react";
import { SceneImage } from "./SceneImage";
import { Reveal } from "./Reveal";
import type { WorkItem, Testimonial } from "@/lib/showcase";

/**
 * Showcase sections shared by Tour đoàn / Tour riêng tư:
 *  - WorkGallery  → "Một số ... đã làm" (lưới ảnh + chú thích)
 *  - ClientsRow   → "Một số khách hàng đã hợp tác" (dải tên khách)
 *  - Testimonials → "Feedback từ khách hàng" (thẻ trích dẫn + người gửi)
 * Tiêu đề/nhãn truyền vào qua props (lấy từ page content); danh sách item lấy
 * từ lib/showcase (placeholder).
 */

function SectionHead({ eyebrow, title }: { eyebrow: string; title?: string }) {
  return (
    <Reveal>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
        {eyebrow}
      </p>
      {title && (
        <h2 className="mt-4 max-w-2xl font-serif text-3xl text-ink sm:text-4xl">
          {title}
        </h2>
      )}
    </Reveal>
  );
}

export function WorkGallery({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: WorkItem[];
}) {
  return (
    <section>
      <SectionHead eyebrow={eyebrow} title={title} />
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={(i % 3) * 90}>
            <figure className="group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <SceneImage
                  src={it.image}
                  alt={it.title}
                  w={1000}
                  h={750}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-4">
                <p className="font-serif text-xl text-ink">{it.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mute">
                  {it.meta}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ClientsRow({
  eyebrow,
  clients,
}: {
  eyebrow: string;
  clients: string[];
}) {
  return (
    <section className="overflow-hidden border-y border-[var(--line-soft)] py-12">
      <Reveal>
        <p className="mb-9 text-center text-xs font-medium uppercase tracking-[0.3em] text-mute">
          {eyebrow}
        </p>
      </Reveal>
      <div className="marquee group relative flex overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper to-transparent" />
        <div className="marquee-track flex shrink-0 items-center gap-16 pr-16">
          {[...clients, ...clients].map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="whitespace-nowrap font-serif text-2xl text-ink/35 transition-colors hover:text-ink"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Testimonial[];
}) {
  return (
    <section>
      <SectionHead eyebrow={eyebrow} title={title} />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 90}>
            <figure className="flex h-full flex-col border border-[var(--line-soft)] bg-white/40 p-7">
              <Quote className="h-7 w-7 shrink-0 text-ink/20" aria-hidden />
              <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-ink/80">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <SceneImage src={t.avatar} alt={t.name} w={88} h={88} />
                </span>
                <span>
                  <span className="block font-medium text-ink">{t.name}</span>
                  <span className="block text-xs uppercase tracking-[0.15em] text-mute">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
