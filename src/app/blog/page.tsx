import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SceneImage } from "@/components/site/SceneImage";
import { Reveal } from "@/components/site/Reveal";
import { BLOG_POSTS } from "@/lib/blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Blog du lịch Perlunas — kinh nghiệm điểm đến, mẹo chuẩn bị, ẩm thực và cảm hứng cho mỗi hành trình.",
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <main className="pb-24">
      <PageHero
        eyebrow="Blog"
        title="Blog du lịch Perlunas"
        intro="Kinh nghiệm điểm đến, mẹo chuẩn bị, ẩm thực và những câu chuyện truyền cảm hứng cho hành trình của bạn."
        image={featured?.cover}
        alt="Blog du lịch Perlunas"
      />

      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        {/* bài nổi bật */}
        {featured && (
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group mt-16 grid items-center gap-8 sm:mt-20 lg:grid-cols-2 lg:gap-14"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <SceneImage
                  src={featured.cover}
                  alt={featured.title}
                  w={1200}
                  h={900}
                  priority
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
                  {featured.category}
                </p>
                <h2 className="display mt-4 text-3xl text-ink sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-xl text-pretty leading-relaxed text-ink/70">
                  {featured.excerpt}
                </p>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-mute">
                  {featured.date} · {featured.readingTime}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                  <span className="link-underline">Đọc bài viết</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* lưới các bài còn lại */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-14 border-t border-[var(--line)] pt-14 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <SceneImage
                    src={p.cover}
                    alt={p.title}
                    w={1000}
                    h={667}
                    className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                  {p.category}
                </p>
                <h3 className="mt-2 font-serif text-2xl leading-snug text-ink group-hover:underline group-hover:underline-offset-4">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-ink/65">
                  {p.excerpt}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-mute">
                  {p.date} · {p.readingTime}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
