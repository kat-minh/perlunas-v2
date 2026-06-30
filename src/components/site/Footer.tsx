import Link from "next/link";
import { ArrowRight, MessageCircle, Send, Mail, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { getPageContentMap, pc } from "@/lib/page-content";

/**
 * Footer. Brand + two link columns + a compact "Liên hệ" block (ref ảnh5): a
 * quick email field that hands off to the shared enquiry form (/lien-he, email
 * pre-filled) plus a row of contact channel icons. A 12-col grid keeps the
 * width filled instead of leaving a gap in the middle.
 */
const dichVu = [
  { label: "Tour trọn gói", href: "/tour-tron-goi" },
  { label: "Khách sạn", href: "/khach-san" },
  { label: "Gói du lịch", href: "/combo" },
  { label: "Tour đoàn", href: "/#tour-doan" },
  { label: "Tour riêng", href: "/#tour-rieng" },
];

const congTy = [
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Tại sao chọn Perlunas", href: "/#tai-sao" },
  { label: "Đối tác", href: "/#doi-tac" },
  { label: "Yêu cầu tư vấn", href: "/lien-he" },
  { label: "Chính sách & Điều khoản", href: "/chinh-sach" },
];

const channels = [
  { label: "Zalo", href: site.zalo, Icon: MessageCircle },
  { label: "Messenger", href: site.messenger, Icon: Send },
  { label: "Email", href: `mailto:${site.email}`, Icon: Mail },
  { label: "Điện thoại", href: `tel:${site.phone.replace(/\s/g, "")}`, Icon: Phone },
];

export async function Footer() {
  const map = await getPageContentMap();
  return (
    <footer id="lien-he" className="relative bg-ink px-6 py-14 text-paper sm:px-10">
      <div className="mx-auto max-w-[100rem]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
          {/* brand */}
          <div className="col-span-2 lg:col-span-4">
            <p className="font-serif text-2xl tracking-[0.16em] text-paper">PERLUNAS</p>

            <dl className="mt-6 space-y-1.5 text-sm text-paper/55">
              <div className="flex gap-2">
                <dt className="text-paper/40">Công ty:</dt>
                <dd className="text-paper/70">{site.legalName}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-paper/40">MST:</dt>
                <dd className="text-paper/70">{site.taxId}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-paper/40">Email:</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="text-paper/70 transition-colors hover:text-paper">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-paper/40">Hotline:</dt>
                <dd>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-paper/70 transition-colors hover:text-paper">
                    {site.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* link columns */}
          <FooterCol title="Dịch vụ" links={dichVu} className="lg:col-span-2" />
          <FooterCol title="Công ty" links={congTy} className="lg:col-span-2" />

          {/* liên hệ — compact: quick email + contact channels */}
          <div className="col-span-2 lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/45">
              {pc(map, "footer.newsletter.eyebrow")}
            </p>
            <form action="/lien-he" method="get" className="mt-4 flex items-center bg-paper p-1.5">
              <input
                name="email"
                type="email"
                required
                placeholder="email@cuaban.com"
                className="w-full bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Gửi yêu cầu tư vấn"
                className="flex h-9 w-10 shrink-0 items-center justify-center bg-ink text-paper transition-colors hover:bg-ink/85"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-2 text-xs text-paper/45">
              {pc(map, "footer.newsletter.note")}
            </p>

            <div className="mt-5 flex items-center gap-3">
              {channels.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:border-paper hover:text-paper"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* legal bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-paper/12 pt-6 text-xs text-paper/45 sm:flex-row">
          <p>© {site.foundedYear}-2026 {site.name}. Mọi quyền được bảo lưu.</p>
          <p>{pc(map, "footer.legal.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-4 text-xs uppercase tracking-wider text-paper/45">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-paper/65 transition-colors hover:text-paper">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
