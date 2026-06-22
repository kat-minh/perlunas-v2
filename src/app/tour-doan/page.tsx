import type { Metadata } from "next";
import { SceneImage } from "@/components/site/SceneImage";
import { LeadButton } from "@/components/site/LeadButton";
import { getPageContentMap, pc } from "@/lib/page-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tour đoàn",
  description:
    "Tổ chức tour đoàn trọn gói: team building, gala dinner, hội nghị kết hợp tham quan — một đầu mối lo trọn cho cả đoàn.",
};

/**
 * Trang Tour đoàn. Header giới thiệu, các khối nội dung + ảnh xen kẽ, và CTA
 * cuối trang — toàn bộ text/ảnh lấy từ page content.
 */
export default async function TourDoanPage() {
  const map = await getPageContentMap();

  return (
    <main className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[100rem]">
        {/* header */}
        <header className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            {pc(map, "grouppage.eyebrow")}
          </p>
          <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
            {pc(map, "grouppage.hero.title")}
          </h1>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-ink/70">
            {pc(map, "grouppage.hero.intro")}
          </p>
        </header>

        {/* ảnh lớn mở đầu */}
        <div className="mt-14 aspect-[16/7] overflow-hidden">
          <SceneImage
            src={pc(map, "grouppage.hero.image")}
            alt="Tour đoàn Perlunas"
            w={1600}
            h={700}
            priority
          />
        </div>

        {/* các khối nội dung + ảnh xen kẽ */}
        <div className="mt-20 space-y-24">
          <ContentBlock
            eyebrow={pc(map, "grouppage.block1.eyebrow")}
            title={pc(map, "grouppage.block1.title")}
            image={pc(map, "grouppage.block1.image")}
          >
            {pc(map, "grouppage.block1.body")}
          </ContentBlock>

          <ContentBlock
            eyebrow={pc(map, "grouppage.block2.eyebrow")}
            title={pc(map, "grouppage.block2.title")}
            image={pc(map, "grouppage.block2.image")}
            flip
          >
            {pc(map, "grouppage.block2.body")}
          </ContentBlock>
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

function ContentBlock({
  eyebrow,
  title,
  image,
  flip = false,
  children,
}: {
  eyebrow: string;
  title: string;
  image: string;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={flip ? "lg:order-2" : undefined}>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
          {eyebrow}
        </p>
        <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-md text-pretty leading-relaxed text-ink/70">
          {children}
        </p>
      </div>
      <div className={flip ? "lg:order-1" : undefined}>
        <div className="aspect-[4/3] overflow-hidden">
          <SceneImage src={image} alt={title} w={1000} h={750} />
        </div>
      </div>
    </div>
  );
}
