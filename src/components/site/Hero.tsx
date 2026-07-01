import { Fragment } from "react";
import { LeadButton } from "./LeadButton";
import { pc, type PageContentMap } from "@/lib/page-content";

/**
 * Opening Scene. A full-bleed cinematic video with the headline set large at the
 * lower-left, editorial style. All copy + the background video come from page
 * content (with bundled defaults), so the site renders identically when the API
 * is down.
 */
export function Hero({ map }: { map: PageContentMap }) {
  const video = pc(map, "home.hero.video");
  const titleLines = pc(map, "home.hero.title").split("\n");

  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-16 sm:px-10 sm:pb-24">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="reveal is-in lg:col-span-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/75">
              {pc(map, "home.hero.eyebrow")}
            </p>
            <h1 className="display mt-6 text-[1.875rem] leading-[1.1] text-paper sm:text-6xl sm:leading-[1.05] lg:text-[4.75rem]">
              {titleLines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h1>
          </div>

          <div className="reveal is-in lg:col-span-4 lg:pb-3">
            <p className="max-w-sm text-pretty leading-relaxed text-paper/85">
              {pc(map, "home.hero.subtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#tour-tron-goi" className="btn-paper rounded-[3px] px-6 py-3 text-sm font-medium">
                {pc(map, "home.hero.cta.primary")}
              </a>
              <LeadButton variant="ghost">{pc(map, "home.hero.cta.secondary")}</LeadButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
