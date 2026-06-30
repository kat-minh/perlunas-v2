import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SceneImage } from "@/components/site/SceneImage";
import { BLOG_POSTS, getPost, relatedPosts } from "@/lib/blog";

export const revalidate = 300;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post
    ? { title: post.title, description: post.excerpt }
    : { title: "Cẩm nang" };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = relatedPosts(post.slug);

  return (
    <main className="pb-24 pt-28 sm:pt-32">
      {/* header bài viết — không dùng hero ảnh full-bleed, kiểu editorial gọn */}
      <header className="mx-auto max-w-3xl px-6 sm:px-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-ink/70 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tất cả bài viết
        </Link>

        <p className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-mute">
          {post.category}
        </p>
        <h1 className="display mt-4 text-4xl text-ink sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/70">
          {post.excerpt}
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.18em] text-mute">
          {post.author} · {post.date} · {post.readingTime}
        </p>
      </header>

      <article className="mx-auto max-w-3xl px-6 pt-10 sm:px-10 sm:pt-12">
        <div className="space-y-8">
          {post.content.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-serif text-2xl text-ink">{section.heading}</h2>
              )}
              <div className={section.heading ? "mt-3 space-y-4" : "space-y-4"}>
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="text-pretty text-lg leading-relaxed text-ink/80">
                    {para}
                  </p>
                ))}
              </div>

              {/* ảnh minh hoạ trong nội dung — chỉ hiện khi admin có thêm ảnh */}
              {section.image && (
                <figure className="mt-6">
                  <div className="aspect-[16/9] overflow-hidden">
                    <SceneImage
                      src={section.image}
                      alt={section.caption ?? section.heading ?? post.title}
                      w={1600}
                      h={900}
                    />
                  </div>
                  {section.caption && (
                    <figcaption className="mt-2 text-center text-xs text-mute">
                      {section.caption}
                    </figcaption>
                  )}
                </figure>
              )}
            </section>
          ))}
        </div>
      </article>

      {/* Bài viết khác */}
      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-[100rem] border-t border-[var(--line)] px-6 pt-14 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display text-3xl text-ink sm:text-4xl">Bài viết khác</h2>
            <Link
              href="/blog"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink"
            >
              <span className="link-underline">Xem tất cả</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
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
                <h3 className="mt-2 font-serif text-2xl text-ink">{p.title}</h3>
                <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-ink/65">
                  {p.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
