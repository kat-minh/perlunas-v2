import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { LeadButton } from "@/components/site/LeadButton";
import {
  WorkGallery,
  ClientsRow,
  Testimonials,
} from "@/components/site/ShowcaseSections";
import { getPageContentMap, pc } from "@/lib/page-content";
import { GROUP_WORK, GROUP_CLIENTS, GROUP_TESTIMONIALS } from "@/lib/showcase";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tour đoàn",
  description:
    "Tổ chức tour đoàn trọn gói: team building, gala dinner, hội nghị kết hợp tham quan — một đầu mối lo trọn cho cả đoàn.",
};

/**
 * Trang Tour đoàn. Hero giới thiệu, rồi ba khối showcase — tour đã làm, khách
 * hàng đã hợp tác, feedback — và CTA cuối trang. Tiêu đề/nhãn lấy từ page
 * content; danh sách item từ lib/showcase (placeholder).
 */
export default async function TourDoanPage() {
  const map = await getPageContentMap();

  return (
    <main className="pb-24">
      <PageHero
        eyebrow={pc(map, "grouppage.eyebrow")}
        title={pc(map, "grouppage.hero.title")}
        intro={pc(map, "grouppage.hero.intro")}
        image={pc(map, "grouppage.hero.image")}
        alt="Tour đoàn Perlunas"
      />
      <div className="mx-auto max-w-[100rem] px-6 sm:px-10">
        <div className="mt-16 space-y-24 sm:mt-20">
          {/* đoạn text tự do — admin tự ghi (page content) */}
          {(pc(map, "grouppage.intro.title") || pc(map, "grouppage.intro.body")) && (
            <section className="max-w-3xl">
              {pc(map, "grouppage.intro.title") && (
                <h2 className="display text-3xl text-ink sm:text-4xl">
                  {pc(map, "grouppage.intro.title")}
                </h2>
              )}
              {pc(map, "grouppage.intro.body") && (
                <p className="mt-4 whitespace-pre-line text-pretty text-lg leading-relaxed text-ink/75">
                  {pc(map, "grouppage.intro.body")}
                </p>
              )}
            </section>
          )}

          <WorkGallery
            eyebrow={pc(map, "grouppage.work.eyebrow")}
            title={pc(map, "grouppage.work.title")}
            items={GROUP_WORK}
          />

          <ClientsRow
            eyebrow={pc(map, "grouppage.clients.eyebrow")}
            clients={GROUP_CLIENTS}
          />

          <Testimonials
            eyebrow={pc(map, "grouppage.feedback.eyebrow")}
            title={pc(map, "grouppage.feedback.title")}
            items={GROUP_TESTIMONIALS}
          />
        </div>

        {/* CTA */}
        <div className="mt-24 border-t border-[var(--line-soft)] pt-14 text-center">
          <h2 className="display text-3xl text-ink sm:text-4xl">
            {pc(map, "grouppage.cta.title")}
          </h2>
          <div className="mt-8 flex justify-center">
            <LeadButton service="Tour đoàn">{pc(map, "grouppage.cta.button")}</LeadButton>
          </div>
        </div>
      </div>
    </main>
  );
}
