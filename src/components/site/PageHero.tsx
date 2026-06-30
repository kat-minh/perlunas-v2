import { SceneImage } from "./SceneImage";

/**
 * Full-bleed banner shown at the very top of the inner pages (Tour trọn gói,
 * Tour đoàn, Tour riêng tư, Lưu trú, Combo, Về chúng tôi). Mirrors the homepage
 * Hero: a cinematic image with the eyebrow/title/intro set lower-left in light
 * text over a dark gradient, the fixed navbar overlapping on top. The image is
 * the first thing a visitor sees ("client thích hình").
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  seed,
  alt,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Explicit image URL (from page content). */
  image?: string;
  /** Fallback seed lookup when no explicit image is given. */
  seed?: string;
  alt?: string;
}) {
  return (
    <section className="relative flex h-[62vh] min-h-[440px] flex-col justify-end overflow-hidden bg-ink">
      <SceneImage
        src={image}
        seed={seed}
        alt={alt ?? title}
        w={2000}
        h={1100}
        priority
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/20 to-ink/85" />

      <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-12 sm:px-10 sm:pb-16">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/75">
            {eyebrow}
          </p>
        )}
        <h1 className="display mt-5 max-w-3xl text-4xl text-paper sm:text-6xl">{title}</h1>
        {intro && (
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-paper/85">{intro}</p>
        )}
      </div>
    </section>
  );
}
