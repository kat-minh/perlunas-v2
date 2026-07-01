import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { getPageContentMap, pc } from "@/lib/page-content";

/**
 * Footer. Brand + two link columns + a compact "Liên hệ" block (ref ảnh5): a
 * quick email field that hands off to the shared enquiry form (/lien-he, email
 * pre-filled) plus a row of contact channel icons. A 12-col grid keeps the
 * width filled instead of leaving a gap in the middle.
 */
const dichVu = [
  { label: "Tour ghép lẻ trọn gói", href: "/tour-tron-goi" },
  { label: "Lưu trú cao cấp", href: "/khach-san" },
  { label: "Gói du lịch", href: "/combo" },
  { label: "Tour đoàn", href: "/tour-doan" },
  { label: "Tour riêng tư", href: "/tour-rieng-tu" },
];

const congTy = [
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Blog", href: "/blog" },
  { label: "Chính sách & Điều khoản", href: "/chinh-sach" },
];

function ZaloIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z" />
    </svg>
  );
}

function MessengerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13" />
    </svg>
  );
}

const channels = [
  { label: "Zalo", href: site.zalo, Icon: ZaloIcon },
  { label: "Messenger", href: site.messenger, Icon: MessengerIcon },
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
