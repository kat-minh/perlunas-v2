import { clsx } from "clsx";

/**
 * Placeholder photography via picsum (seed-stable, so the same seed always
 * returns the same image). Replaces the old gradient/icon "fake image" divs.
 * Swap the picsum URL for real destination photos when the client provides them
 * — keep the seed string descriptive so the intent is clear.
 */
export function SceneImage({
  seed,
  alt,
  w = 1200,
  h = 900,
  className,
  priority = false,
}: {
  seed: string;
  alt: string;
  w?: number;
  h?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- placeholder photography; swap for next/image + real assets later
    <img
      src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
      alt={alt}
      width={w}
      height={h}
      loading={priority ? "eager" : "lazy"}
      className={clsx("h-full w-full bg-ink/5 object-cover", className)}
    />
  );
}
