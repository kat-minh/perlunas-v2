import { Reveal } from "./Reveal";
import { GsapText } from "./GsapText";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}

/** Shared heading block — eyebrow + serif title + optional intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Reveal>
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-leather/50" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>
      <GsapText
        as="h2"
        text={title}
        className="mt-4 font-serif text-[clamp(2.3rem,5.5vw,4.6rem)] font-[440] leading-[0.98] tracking-[-0.02em] text-emerald"
      />
      {intro && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
