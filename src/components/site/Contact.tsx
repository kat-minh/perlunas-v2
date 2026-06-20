import Link from "next/link";
import { Mail, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

/**
 * Closing contact section on the homepage. The enquiry form now lives on its own
 * page (/lien-he); here we invite the visitor over and show quick contact info.
 */
export function Contact() {
  return (
    <section id="lien-he" className="relative border-t border-[var(--line-soft)] px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto grid max-w-[100rem] items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Liên hệ</p>
          <h2 className="display mt-5 text-4xl text-ink sm:text-6xl">
            Sẵn sàng cho hành trình tiếp theo?
          </h2>
          <p className="mt-7 max-w-md text-pretty leading-relaxed text-ink/70">
            Để lại vài dòng về chuyến đi bạn mong muốn, Perlunas sẽ liên hệ sớm để
            tư vấn và báo giá, hoàn toàn miễn phí.
          </p>

          <figure className="mt-10 border-l border-ink/30 pl-5">
            <blockquote className="font-serif text-xl italic leading-snug text-ink">
              “Mọi thứ được chuẩn bị chu đáo đến từng chi tiết. Một chuyến đi trọn
              vẹn ngoài mong đợi.”
            </blockquote>
            <figcaption className="mt-2 text-sm text-mute">Chị Thu Hà</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={150}>
          <div className="border border-[var(--line)] bg-paper-2 p-8 sm:p-10">
            <h3 className="font-serif text-2xl text-ink">Gửi yêu cầu tư vấn</h3>
            <p className="mt-3 text-pretty leading-relaxed text-ink/65">
              Điền thông tin chuyến đi của bạn, đội ngũ Perlunas sẽ liên hệ để lên
              kế hoạch và báo giá miễn phí.
            </p>
            <Link href="/lien-he" className="btn-ink mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium">
              Gửi yêu cầu tư vấn
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-10 space-y-4 border-t border-[var(--line)] pt-8">
              <ContactRow icon={Phone} label="Gọi / Zalo" value={site.phone} href={`tel:${site.phone.replace(/\s/g, "")}`} />
              <ContactRow icon={MessageCircle} label="Nhắn tin nhanh" value="Zalo / Messenger" href={site.zalo} />
              <ContactRow icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} className="group flex items-center gap-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-ink transition-colors group-hover:border-ink">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wider text-mute">{label}</span>
        <span className="block text-ink transition-opacity group-hover:opacity-70">{value}</span>
      </span>
    </a>
  );
}
