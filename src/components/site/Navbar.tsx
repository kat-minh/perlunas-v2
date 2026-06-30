"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { clsx } from "clsx";
import { site } from "@/lib/site";

const links = [
  { label: "Tour trong nước trọn gói", href: "/tour-tron-goi" },
  { label: "Tour đoàn", href: "/tour-doan" },
  { label: "Tour riêng tư", href: "/tour-rieng-tu" },
  { label: "Lưu trú Cao cấp", href: "/khach-san" },
  { label: "Combo du lịch", href: "/combo" },
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
];

const tel = `tel:${site.phone.replace(/\s/g, "")}`;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 text-ink transition-all duration-500",
        solid
          ? "bg-paper/85 py-3 shadow-[0_1px_0_var(--line-soft)] backdrop-blur-md"
          : "bg-transparent py-6",
      )}
    >
      <div className="mx-auto flex max-w-[100rem] items-center justify-between px-6 sm:px-10">
        <Link href="/" className="font-serif text-xl tracking-[0.18em]">
          PERLUNAS
        </Link>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline text-sm text-ink/80 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={tel}
            className="hidden items-center gap-2 text-sm font-medium tracking-wide text-ink/85 transition-colors hover:text-ink md:inline-flex"
          >
            <Phone className="h-4 w-4" strokeWidth={1.6} />
            {site.phone}
          </a>

          <Link
            href="/lien-he"
            className="btn-ink hidden rounded-[3px] px-5 py-2 text-sm font-medium md:inline-block"
          >
            Liên hệ tư vấn
          </Link>

          <button
            aria-label="Mở menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={clsx("h-px w-6 bg-current transition-transform", open && "translate-y-[3.5px] rotate-45")} />
            <span className={clsx("h-px w-6 bg-current transition-opacity", open && "opacity-0")} />
            <span className={clsx("h-px w-6 bg-current transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "grid overflow-hidden transition-all duration-500 lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <nav className="min-h-0 px-6">
          <div className="mt-4 flex flex-col gap-1 rounded-sm bg-paper-2 p-3 shadow-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-4 py-3 text-ink/85 transition-colors hover:bg-[var(--surface)]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={tel}
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center gap-2 rounded-sm px-4 py-3 text-center font-medium text-ink"
            >
              <Phone className="h-4 w-4" strokeWidth={1.6} />
              {site.phone}
            </a>
            <Link
              href="/lien-he"
              onClick={() => setOpen(false)}
              className="btn-ink rounded-sm px-4 py-3 text-center font-medium"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
