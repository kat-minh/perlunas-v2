import { Reveal } from "./Reveal";
import { SceneImage } from "./SceneImage";
import { pc, type PageContentMap } from "@/lib/page-content";

/**
 * Về chúng tôi. A deliberate dark section: a dramatic image beside a short
 * letter / lời ngỏ (salutation → a few warm first-person paragraphs → signed
 * "Perlunas"), left-aligned to read like a note. All copy + the image come from
 * page content.
 */
export function About({ map }: { map: PageContentMap }) {
  return (
    <section id="ve-chung-toi" className="relative bg-ink text-paper">
      {/* dark split intro */}
      <div className="grid lg:grid-cols-2">
        <Reveal>
          <div className="group relative h-[26vh] overflow-hidden lg:h-full lg:min-h-[18rem]">
            <SceneImage
              src={pc(map, "home.about.image")}
              alt="Perlunas"
              w={1200}
              h={1500}
              className="grayscale transition-all duration-[1.5s] ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-ink/35 transition-opacity duration-[1.5s] ease-out group-hover:opacity-0" />
          </div>
        </Reveal>

        <div className="flex items-center px-6 py-12 sm:px-10 lg:px-16 lg:py-20">
          <Reveal className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/45">
              {pc(map, "home.about.eyebrow")}
            </p>

            <p className="mt-7 text-lg text-paper/90">{pc(map, "home.about.salutation")}</p>

            <div className="mt-5 space-y-4 leading-relaxed text-paper/70">
              <p>{pc(map, "home.about.p1")}</p>
              <p>{pc(map, "home.about.p2")}</p>
              <p>{pc(map, "home.about.p3")}</p>
            </div>

            <p className="mt-8 leading-relaxed text-paper/70">
              {pc(map, "home.about.signoff")}
            </p>
            <p className="mt-2 font-serif text-3xl text-paper">{pc(map, "home.about.signature")}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
