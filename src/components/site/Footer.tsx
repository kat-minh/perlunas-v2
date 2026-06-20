import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative bg-ink px-6 py-14 text-paper sm:px-10">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <p className="font-serif text-2xl font-semibold tracking-[0.16em] text-paper">
              PERLUNAS
            </p>
            <p className="mt-3 text-sm leading-relaxed text-paper/55">
              {site.taglineVi}. Thiết kế những hành trình du lịch trong nước tinh
              tế và trọn vẹn.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Khám phá"
              links={[
                { label: "Tour trọn gói", href: "/tour-tron-goi" },
                { label: "Khách sạn", href: "/khach-san" },
                { label: "Combo du lịch", href: "/combo" },
                { label: "Về chúng tôi", href: "/ve-chung-toi" },
              ]}
            />
            <FooterCol
              title="Liên hệ"
              links={[
                { label: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
                { label: "Zalo", href: site.zalo },
                { label: "Messenger", href: site.messenger },
              ]}
            />
            <FooterCol
              title="Thông tin"
              links={[
                { label: site.email, href: `mailto:${site.email}` },
                { label: "Yêu cầu tư vấn", href: "/lien-he" },
              ]}
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-paper/12 pt-6 text-xs text-paper/45 sm:flex-row">
          <p>© {site.foundedYear}-2026 {site.name}. Mọi quyền được bảo lưu.</p>
          <p>Mỗi hành trình là một viên ngọc dưới ánh trăng.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-wider text-paper/45">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-sm text-paper/65 transition-colors hover:text-paper">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
