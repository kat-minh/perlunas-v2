"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Compass, Menu, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type NavItem = (typeof nav)[number];

type Lenis = { scrollTo: (t: number, o?: object) => void; scroll: number };
const getLenis = () =>
  (window as unknown as { __lenis?: Lenis }).__lenis;

// Scroll position of a scene = its canvas pin start + a fraction of its length.
function posAt(item: NavItem, f: number) {
  const st = ScrollTrigger.getById(item.st);
  if (!st) return 0;
  return st.start + (st.end - st.start) * f;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      const sc = getLenis()?.scroll ?? window.scrollY;
      setScrolled(sc > 40);
      const vh = window.innerHeight;
      let act = -1;
      nav.forEach((it, i) => {
        if (sc >= posAt(it, it.at) - vh * 0.3) act = i;
      });
      setActive(act);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (item: NavItem) => {
    const y = posAt(item, item.frac);
    const l = getLenis();
    if (l) l.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
    setOpen(false);
  };

  const toTop = () => {
    const l = getLenis();
    if (l) l.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto mt-3 flex max-w-[80rem] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-5",
          scrolled ? "bg-warm/80 shadow-paper backdrop-blur-md" : "bg-transparent",
        )}
      >
        <button onClick={toTop} className="flex items-center gap-2.5" aria-label={site.name}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-warm">
            <Compass className="h-4.5 w-4.5" strokeWidth={1.8} />
          </span>
          <span className="hidden font-serif text-lg leading-none text-emerald sm:inline">
            {site.name}
          </span>
        </button>

        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map((item, i) => (
            <button
              key={item.label}
              onClick={() => go(item)}
              className={cn(
                "group relative text-sm transition-colors",
                active === i ? "text-emerald" : "text-ink-soft hover:text-emerald",
              )}
              data-cursor="hover"
            >
              {item.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300",
                  active === i ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </button>
          ))}
        </nav>

        <button
          onClick={() => go(nav[nav.length - 1])}
          className="hidden rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-warm transition-colors hover:bg-emerald-deep md:inline-flex"
          data-cursor="hover"
        >
          Nhận tư vấn
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-emerald lg:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-2 rounded-3xl bg-warm/95 p-4 shadow-lift backdrop-blur-md lg:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.label}>
                <button
                  onClick={() => go(item)}
                  className={cn(
                    "block w-full rounded-xl px-4 py-3 text-left transition-colors",
                    active === i ? "bg-cream text-emerald" : "text-ink-soft hover:bg-cream hover:text-emerald",
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </motion.header>
  );
}
