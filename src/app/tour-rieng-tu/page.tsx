import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { LeadButton } from "@/components/site/LeadButton";
import { WorkGallery, Testimonials } from "@/components/site/ShowcaseSections";
import { getPageContentMap, pc } from "@/lib/page-content";
import { PRIVATE_WORK, PRIVATE_TESTIMONIALS } from "@/lib/showcase";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tour riêng tư",
  description:
    "Tour riêng tư may đo theo yêu cầu: gia đình, cặp đôi, nhóm bạn, trăng mật — lịch trình thiết kế riêng cho mỗi hành trình.",
};

/**
 * Trang Tour riêng tư. Cùng bố cục với Tour đoàn: hero, ba khối showcase —
 * hành trình đã thiết kế, khách hàng đã hợp tác, feedback — và CTA cuối trang.
 */
export default async function TourRiengTuPage() {
  const map = await getPageContentMap();

  return (
    <main className="pb-24">
      <PageHero
        eyebrow={pc(map, "privatepage.eyebrow")}
        title={pc(map, "privatepage.hero.title")}
        intro={pc(map, "privatepage.hero.intro")}
        image={pc(map, "privatepage.hero.image")}
        alt="Tour riêng tư Perlunas"
      />
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        <div className="mt-16 space-y-24 sm:mt-20">
          {/* đoạn text tự do — admin tự ghi (page content) */}
          {(pc(map, "privatepage.intro.title") || pc(map, "privatepage.intro.body")) && (
            <section className="max-w-3xl">
              {pc(map, "privatepage.intro.title") && (
                <h2 className="display text-3xl text-ink sm:text-4xl">
                  {pc(map, "privatepage.intro.title")}
                </h2>
              )}
              {pc(map, "privatepage.intro.body") && (
                <p className="mt-4 whitespace-pre-line text-pretty text-lg leading-relaxed text-ink/75">
                  {pc(map, "privatepage.intro.body")}
                </p>
              )}
            </section>
          )}

          <WorkGallery
            eyebrow={pc(map, "privatepage.work.eyebrow")}
            title={pc(map, "privatepage.work.title")}
            items={PRIVATE_WORK}
          />

          <Testimonials
            eyebrow={pc(map, "privatepage.feedback.eyebrow")}
            title={pc(map, "privatepage.feedback.title")}
            items={PRIVATE_TESTIMONIALS}
          />
        </div>

        {/* CTA */}
        <div className="mt-24 border-t border-[var(--line-soft)] pt-14 text-center">
          <h2 className="display text-3xl text-ink sm:text-4xl">
            {pc(map, "privatepage.cta.title")}
          </h2>
          <div className="mt-8 flex justify-center">
            <LeadButton service="Tour riêng">{pc(map, "privatepage.cta.button")}</LeadButton>
          </div>
        </div>
      </div>
    </main>
  );
}
