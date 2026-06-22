import { Reveal } from "./Reveal";
import { resolveIcon } from "@/lib/icons";
import { pc, type PageContentMap } from "@/lib/page-content";

/**
 * Tại sao chọn Perlunas. A centred title, a short rule, then a single row of
 * thin line icons with short labels. Only the title of each reason is editable
 * from page content; the icon + accent colour are fixed in design (not exposed
 * in the CMS).
 */
const REASON_STYLE = [
  { icon: "Wallet", color: "#93B89C" },
  { icon: "Headset", color: "#8BB2C9" },
  { icon: "Route", color: "#E2A876" },
  { icon: "LifeBuoy", color: "#D98A94" },
  { icon: "Compass", color: "#AC9CC9" },
];

export function WhyUs({ map }: { map: PageContentMap }) {
  const reasons = [1, 2, 3, 4, 5]
    .map((n) => ({
      title: pc(map, `home.whyus.${n}.title`),
      ...REASON_STYLE[n - 1],
    }))
    .filter((r) => r.title);

  return (
    <section id="tai-sao" className="relative px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[100rem] text-center">
        <Reveal>
          <h2 className="display text-3xl text-ink sm:text-4xl">
            {pc(map, "home.whyus.title")}
          </h2>
          <div className="mx-auto mt-6 h-px w-12 bg-ink/25" />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {reasons.map((r, i) => {
            const Icon = resolveIcon(r.icon);
            return (
              <Reveal key={r.title} delay={i * 70}>
                <div className="flex flex-col items-center px-2">
                  <Icon className="h-9 w-9" strokeWidth={1.1} style={{ color: r.color }} />
                  <p className="mt-5 font-serif text-lg leading-snug text-ink">
                    {r.title}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
