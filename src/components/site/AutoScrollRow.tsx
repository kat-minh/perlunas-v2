"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Hàng cuộn ngang tự "chạy" nhẹ khi nội dung TRÀN (ping-pong qua lại) để người
 * dùng biết còn thông tin bên phải. Vẫn cuộn tay bình thường; mỗi lần chạm /
 * cuộn / kéo thì tạm dừng ~2.5s rồi chạy tiếp. Nếu nội dung vừa khít (không
 * tràn) thì không chạy. Tôn trọng prefers-reduced-motion.
 */
export function AutoScrollRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let dir = 1;
    let pausedUntil = 0;
    let resync = false;
    // Tích luỹ vị trí bằng float riêng: scrollLeft bị làm tròn về integer mỗi
    // frame nên cộng trực tiếp một lượng nhỏ (<1px) sẽ không nhích được.
    let pos = el.scrollLeft;
    const SPEED = 0.45; // px mỗi frame — nhẹ, đủ để mắt bắt được

    const maxScroll = () => el.scrollWidth - el.clientWidth;

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const m = maxScroll();
      if (m <= 4) return; // vừa khít, không cần chạy
      if (t < pausedUntil) {
        resync = true; // người dùng vừa tương tác → chạy tiếp từ vị trí họ để
        return;
      }
      if (resync) {
        pos = el.scrollLeft;
        resync = false;
      }
      pos += dir * SPEED;
      if (pos >= m) {
        pos = m;
        dir = -1;
      } else if (pos <= 0) {
        pos = 0;
        dir = 1;
      }
      el.scrollLeft = pos;
    };

    const pause = () => {
      pausedUntil = performance.now() + 2500;
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("wheel", pause);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
