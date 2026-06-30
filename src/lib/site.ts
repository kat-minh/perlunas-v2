/** Central place for brand + contact constants (kept env-overridable). */
export const site = {
  name: "Perlunas",
  // Thông tin pháp lý công ty — cập nhật giá trị thật khi có.
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "Công ty TNHH Du lịch Perlunas",
  taxId: process.env.NEXT_PUBLIC_TAX_ID ?? "0123456789",
  tagline: "Pearl & Luna, every journey a pearl under the moon",
  taglineVi: "Mỗi hành trình là một viên ngọc dưới ánh trăng",
  description:
    "Perlunas thiết kế những hành trình du lịch trong nước tinh tế và trọn vẹn: tour trọn gói, đặt phòng khách sạn, gói du lịch, tour đoàn và tour riêng theo yêu cầu.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://perlunas.vercel.app",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "0900 000 000",
  zalo: process.env.NEXT_PUBLIC_ZALO_URL ?? "https://zalo.me/0900000000",
  messenger: process.env.NEXT_PUBLIC_MESSENGER_URL ?? "https://m.me/perlunas",
  email: "xinchao@perlunas.vn",
  foundedYear: 2014,
} as const;

/**
 * Header navigation. Each item points at a scene inside a pinned canvas, given
 * by the canvas's ScrollTrigger id + a fraction (0–1) of its pin range — so a
 * click can scroll to a sub-scene and the header can highlight the active one.
 */
// frac = where a click scrolls to (the scene nicely shown).
// at   = where the header highlight switches on (the scene starts appearing).
export const nav = [
  { label: "Câu chuyện", st: "st-flight", frac: 0.72, at: 0.55 },
  { label: "Điểm đến", st: "st-canvas", frac: 0.12, at: 0.0 },
  { label: "Chúng tôi", st: "st-canvas", frac: 0.5, at: 0.36 },
  { label: "Giá trị", st: "st-canvas", frac: 0.84, at: 0.68 },
  { label: "Hành trình", st: "st-deck", frac: 0.12, at: 0.0 },
  { label: "Khoảnh khắc", st: "st-deck", frac: 0.52, at: 0.38 },
  { label: "Liên hệ", st: "st-deck", frac: 0.92, at: 0.72 },
] as const;
