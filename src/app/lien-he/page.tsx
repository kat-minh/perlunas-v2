import type { Metadata } from "next";
import { Phone, MessageCircle, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { LeadForm } from "@/components/site/LeadForm";

export const metadata: Metadata = {
  title: "Yêu cầu tư vấn",
  description: "Gửi yêu cầu tư vấn cho Perlunas. Để lại thông tin chuyến đi, đội ngũ sẽ liên hệ sớm để lên kế hoạch và báo giá miễn phí.",
};

export default async function EnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; email?: string }>;
}) {
  const { service, email } = await searchParams;

  return (
    <main className="px-6 pb-28 pt-36 sm:px-10 sm:pt-44">
      <div className="mx-auto max-w-[78rem]">
        <header className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
            Yêu cầu tư vấn
          </p>
          <h1 className="display mt-5 text-4xl text-ink sm:text-6xl">
            Kể cho chúng tôi về chuyến đi của bạn.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-ink/70">
            Sau khi bạn gửi yêu cầu, Perlunas sẽ liên hệ sớm để tư vấn và lên kế
            hoạch qua Zalo, điện thoại hoặc gặp trực tiếp. Mọi tư vấn và báo giá
            đều hoàn toàn miễn phí.
          </p>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <LeadForm defaultService={service} defaultEmail={email} />
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-10 lg:sticky lg:top-28">
              <div>
                <Phone className="h-5 w-5 text-ink" strokeWidth={1.5} />
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-ink">
                  Gọi ngay hôm nay
                </p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-2 block font-serif text-2xl text-ink">
                  {site.phone}
                </a>
                <p className="mt-1 text-sm text-mute">Tư vấn nhanh trong giờ làm việc.</p>
              </div>

              <div>
                <MessageCircle className="h-5 w-5 text-ink" strokeWidth={1.5} />
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-ink">
                  Nhắn tin
                </p>
                <div className="mt-2 flex flex-col gap-1 text-ink">
                  <a href={site.zalo} className="link-underline w-fit">Zalo</a>
                  <a href={site.messenger} className="link-underline w-fit">Messenger</a>
                  <a href={`mailto:${site.email}`} className="link-underline w-fit">{site.email}</a>
                </div>
              </div>

              <div>
                <Clock className="h-5 w-5 text-ink" strokeWidth={1.5} />
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-ink">
                  Giờ làm việc
                </p>
                <dl className="mt-3 space-y-1.5 text-sm text-ink/70">
                  <Row d="Thứ 2 - Thứ 6" h="8:00 - 21:00" />
                  <Row d="Thứ 7" h="8:00 - 20:00" />
                  <Row d="Chủ nhật" h="9:00 - 18:00" />
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Row({ d, h }: { d: string; h: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-1.5">
      <dt>{d}</dt>
      <dd className="text-ink">{h}</dd>
    </div>
  );
}
