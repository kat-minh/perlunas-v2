import { Compass, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { FooterNav } from "@/components/layout/FooterNav";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-emerald-deep text-warm/80">
      <div className="paper-grain absolute inset-0 opacity-30" aria-hidden />
      <div className="shell relative z-10 grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-emerald-deep">
              <Compass className="h-4.5 w-4.5" strokeWidth={1.8} />
            </span>
            <span className="font-serif text-xl text-warm">{site.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-warm/65">
            {site.taglineVi}. Chúng tôi thiết kế những hành trình nội địa giàu
            cảm xúc — để mỗi chuyến đi là một câu chuyện đáng nhớ.
          </p>
        </div>

        <nav aria-label="Liên kết">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold/80">
            Khám phá
          </p>
          <FooterNav />
        </nav>

        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold/80">
            Liên hệ
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-gold" />
              <a href={`tel:${site.phone}`} className="hover:text-gold">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-gold" />
              <a href={`mailto:${site.email}`} className="hover:text-gold">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="text-warm/70">
                Văn phòng tại Hà Nội · Đà Nẵng · TP. Hồ Chí Minh
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="ink-rule opacity-20" />
      <div className="shell flex flex-col items-center justify-between gap-2 py-6 text-xs text-warm/50 md:flex-row">
        <p>
          © {site.foundedYear}–2026 {site.name}. Mọi hành trình đều được giữ gìn.
        </p>
        <p className="font-serif italic">{site.tagline}</p>
      </div>
    </footer>
  );
}
