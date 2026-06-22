/**
 * Shared placeholder catalog for the detail pages (khách sạn, combo, tour).
 * Replace with real data later. Image `seed`s map to real photos via lib/images.ts
 * where available, otherwise fall back to picsum.
 */

export const PROVINCES = [
  { name: "Hà Nội", slug: "ha-noi" },
  { name: "TP. Hồ Chí Minh", slug: "ho-chi-minh" },
  { name: "Hạ Long", slug: "ha-long" },
  { name: "Đà Lạt", slug: "da-lat" },
  { name: "Đà Nẵng", slug: "da-nang" },
  { name: "Phú Quốc", slug: "phu-quoc" },
  { name: "Nha Trang", slug: "nha-trang" },
  { name: "Huế", slug: "hue" },
  { name: "Sa Pa", slug: "sa-pa" },
] as const;

export const STAY_TYPES = [
  "Hotel",
  "Resort",
  "Retreat",
  "Wellness",
  "Boutique Hotel",
] as const;
export type StayType = (typeof STAY_TYPES)[number];

export type Hotel = {
  slug: string;
  name: string;
  city: string;
  type: StayType;
  /** Per-night starting price, e.g. "2.000.000đ". */
  price: string;
  /** Curated picks shown by default (before the guest filters). */
  featured?: boolean;
  desc: string;
};

export const HOTELS: Hotel[] = [
  { slug: "lunar-bay", name: "Lunar Bay Resort", city: "Phú Quốc", type: "Resort", price: "3.500.000đ", featured: true, desc: "Khu nghỉ dưỡng bên bãi biển riêng phía Nam đảo Ngọc, hồ bơi vô cực hướng hoàng hôn." },
  { slug: "pearl-cove", name: "Pearl Cove Resort", city: "Phú Quốc", type: "Resort", price: "4.200.000đ", desc: "Bungalow ven biển, bến tàu riêng và nhà hàng hải sản trên mặt nước." },
  { slug: "maison-de-lune", name: "Maison de Lune", city: "Hội An", type: "Boutique Hotel", price: "2.000.000đ", featured: true, desc: "Khách sạn boutique trong phố cổ, kiến trúc Đông Dương bên dòng Hoài giang." },
  { slug: "an-yen-boutique", name: "An Yên Boutique", city: "Hội An", type: "Boutique Hotel", price: "1.600.000đ", desc: "Không gian nhỏ xinh giữa vườn, xe đạp dạo phố và lớp nấu ăn địa phương." },
  { slug: "serenity-retreat", name: "Serenity Retreat", city: "Đà Lạt", type: "Retreat", price: "2.500.000đ", featured: true, desc: "Ẩn mình giữa rừng thông, mỗi sáng thức dậy trong sương và tiếng chim." },
  { slug: "pinewood-wellness", name: "Pinewood Wellness", city: "Đà Lạt", type: "Wellness", price: "2.800.000đ", desc: "Spa thảo mộc, yoga buổi sớm và thực đơn chữa lành giữa cao nguyên." },
  { slug: "stella-dalat", name: "Stella Hotel", city: "Đà Lạt", type: "Hotel", price: "1.400.000đ", desc: "Khách sạn trung tâm, vài bước tới chợ đêm và hồ Xuân Hương." },
  { slug: "azure-bay", name: "Azure Bay Resort", city: "Nha Trang", type: "Resort", price: "3.200.000đ", featured: true, desc: "Resort mặt biển, hồ bơi nhiều tầng và khu vui chơi cho gia đình." },
  { slug: "ocean-pearl", name: "Ocean Pearl Hotel", city: "Nha Trang", type: "Hotel", price: "1.800.000đ", desc: "Phòng hướng vịnh, hồ bơi tầng thượng nhìn toàn cảnh thành phố biển." },
  { slug: "halong-pearl", name: "Hạ Long Pearl Hotel", city: "Hạ Long", type: "Hotel", price: "1.900.000đ", featured: true, desc: "Ngay mặt vịnh, thuận tiện cho hành trình du thuyền khám phá đảo đá." },
  { slug: "bay-wellness", name: "Bay Wellness", city: "Hạ Long", type: "Wellness", price: "2.600.000đ", desc: "Khu nghỉ trị liệu yên tĩnh, tắm khoáng nóng nhìn ra vịnh di sản." },
  { slug: "metropole-lune", name: "Metropole Lune", city: "Hà Nội", type: "Hotel", price: "2.400.000đ", featured: true, desc: "Phong cách cổ điển giữa phố Pháp, cách Hồ Gươm vài phút đi bộ." },
  { slug: "old-quarter-boutique", name: "Old Quarter Boutique", city: "Hà Nội", type: "Boutique Hotel", price: "1.700.000đ", desc: "Khách sạn nhỏ trong phố cổ, ban công nhìn xuống nhịp sống ngàn năm." },
  { slug: "sapa-cloud", name: "Sa Pa Cloud Retreat", city: "Sa Pa", type: "Retreat", price: "2.200.000đ", featured: true, desc: "Nhà gỗ trên sườn núi, ngắm ruộng bậc thang và biển mây mỗi sớm." },
  { slug: "danang-grand", name: "Đà Nẵng Grand Hotel", city: "Đà Nẵng", type: "Hotel", price: "1.900.000đ", desc: "Sát biển Mỹ Khê, gần cầu Rồng và phố ẩm thực sôi động." },
];

export type Tour = {
  slug: string;
  name: string;
  region: string;
  nights: string;
  price: string;
  teaser: string;
  highlights: string[];
  /** PROVINCES slugs this tour visits — used to suggest hotels at the end. */
  stays: string[];
};

export const TOURS: Tour[] = [
  {
    slug: "da-lat",
    name: "Đà Lạt mộng mơ",
    region: "Tây Nguyên",
    nights: "3 ngày 2 đêm",
    price: "từ 2.890.000đ",
    teaser: "Ba ngày giữa rừng thông và sương sớm trên cao nguyên.",
    highlights: ["Săn mây Cầu Đất lúc bình minh", "Vườn hồng và đồi chè Cầu Đất", "Cà phê giữa rừng thông", "Chợ đêm và ẩm thực phố núi"],
    stays: ["da-lat"],
  },
  {
    slug: "phu-quoc",
    name: "Phú Quốc đảo ngọc",
    region: "Miền Nam",
    nights: "3 ngày 2 đêm",
    price: "từ 3.690.000đ",
    teaser: "Biển trong vắt, san hô và hoàng hôn rực rỡ phương Nam.",
    highlights: ["Cáp treo Hòn Thơm dài nhất thế giới", "Lặn ngắm san hô 3 đảo", "Hoàng hôn bãi Sao", "Chợ đêm hải sản"],
    stays: ["phu-quoc"],
  },
  {
    slug: "ha-noi-sapa",
    name: "Hà Nội Sa Pa",
    region: "Miền Bắc",
    nights: "4 ngày 3 đêm",
    price: "từ 4.290.000đ",
    teaser: "Từ phố cổ ngàn năm tới ruộng bậc thang và đỉnh Fansipan.",
    highlights: ["Phố cổ Hà Nội và Hồ Gươm", "Ruộng bậc thang Mường Hoa", "Cáp treo Fansipan", "Bản làng người Mông, người Dao"],
    stays: ["ha-noi", "sa-pa"],
  },
  {
    slug: "da-nang-hoi-an",
    name: "Đà Nẵng Hội An",
    region: "Miền Trung",
    nights: "3 ngày 2 đêm",
    price: "từ 3.190.000đ",
    teaser: "Cầu Vàng, phố Hội lồng đèn và bãi biển Mỹ Khê.",
    highlights: ["Cầu Vàng Bà Nà Hills", "Phố cổ Hội An về đêm", "Thả đèn hoa đăng sông Hoài", "Biển Mỹ Khê"],
    stays: ["da-nang"],
  },
  {
    slug: "nha-trang",
    name: "Nha Trang biển xanh",
    region: "Miền Trung",
    nights: "3 ngày 2 đêm",
    price: "từ 2.990.000đ",
    teaser: "Vịnh biển trong xanh và những hòn đảo gần bờ.",
    highlights: ["Khám phá đảo Hòn Mun", "Tắm bùn khoáng", "Vịnh Nha Trang", "Ẩm thực biển"],
    stays: ["nha-trang"],
  },
];

/**
 * Combo offerings. A tier (Akoya / Tahiti / South Sea) is a SERVICE STANDARD,
 * not a fixed price — the same hotel can have several combos at different tiers
 * and prices. So this is a flat list the guest filters by nơi đến / loại hình /
 * tên khách sạn / phân loại. Placeholder data.
 */
export const COMBO_TIERS = ["Akoya", "Tahiti", "South Sea"] as const;
export type ComboTier = (typeof COMBO_TIERS)[number];

export type Combo = {
  slug: string;
  tier: ComboTier;
  /** Hotel name incl. location, e.g. "Intercontinental Đà Nẵng". */
  hotelName: string;
  city: string;
  stayType: StayType;
  nights: number;
  /** Starting price for this combo, e.g. "5.000.000đ". */
  price: string;
  featured?: boolean;
};

export const COMBOS: Combo[] = [
  { slug: "akoya-intercontinental-da-nang-2d", tier: "Akoya", hotelName: "Intercontinental Đà Nẵng", city: "Đà Nẵng", stayType: "Resort", nights: 2, price: "5.000.000đ", featured: true },
  { slug: "tahiti-sheraton-ha-noi-3d", tier: "Tahiti", hotelName: "Sheraton Hà Nội", city: "Hà Nội", stayType: "Hotel", nights: 3, price: "8.000.000đ", featured: true },
  { slug: "akoya-sheraton-ha-noi-2d", tier: "Akoya", hotelName: "Sheraton Hà Nội", city: "Hà Nội", stayType: "Hotel", nights: 2, price: "5.000.000đ" },
  { slug: "tahiti-sheraton-ha-noi-4d", tier: "Tahiti", hotelName: "Sheraton Hà Nội", city: "Hà Nội", stayType: "Hotel", nights: 4, price: "15.000.000đ" },
  { slug: "south-sea-intercontinental-phu-quoc-3d", tier: "South Sea", hotelName: "InterContinental Phú Quốc", city: "Phú Quốc", stayType: "Resort", nights: 3, price: "12.000.000đ", featured: true },
  { slug: "tahiti-jw-marriott-phu-quoc-3d", tier: "Tahiti", hotelName: "JW Marriott Phú Quốc", city: "Phú Quốc", stayType: "Resort", nights: 3, price: "9.000.000đ", featured: true },
  { slug: "south-sea-jw-marriott-phu-quoc-4d", tier: "South Sea", hotelName: "JW Marriott Phú Quốc", city: "Phú Quốc", stayType: "Resort", nights: 4, price: "16.000.000đ" },
  { slug: "akoya-vinpearl-nha-trang-2d", tier: "Akoya", hotelName: "Vinpearl Nha Trang", city: "Nha Trang", stayType: "Resort", nights: 2, price: "4.500.000đ", featured: true },
  { slug: "tahiti-vinpearl-nha-trang-3d", tier: "Tahiti", hotelName: "Vinpearl Nha Trang", city: "Nha Trang", stayType: "Resort", nights: 3, price: "7.500.000đ" },
  { slug: "south-sea-ana-mandara-da-lat-3d", tier: "South Sea", hotelName: "Ana Mandara Đà Lạt", city: "Đà Lạt", stayType: "Retreat", nights: 3, price: "11.000.000đ", featured: true },
  { slug: "akoya-terracotta-da-lat-2d", tier: "Akoya", hotelName: "Terracotta Đà Lạt", city: "Đà Lạt", stayType: "Resort", nights: 2, price: "4.000.000đ" },
  { slug: "tahiti-sheraton-ha-long-3d", tier: "Tahiti", hotelName: "Sheraton Hạ Long", city: "Hạ Long", stayType: "Hotel", nights: 3, price: "8.500.000đ", featured: true },
  { slug: "akoya-de-la-coupole-sa-pa-2d", tier: "Akoya", hotelName: "Hôtel de la Coupole Sa Pa", city: "Sa Pa", stayType: "Hotel", nights: 2, price: "5.500.000đ" },
  { slug: "south-sea-naman-da-nang-3d", tier: "South Sea", hotelName: "Naman Retreat Đà Nẵng", city: "Đà Nẵng", stayType: "Retreat", nights: 3, price: "13.000.000đ" },
];

export type Tier = {
  name: string;
  tagline: string;
  pearl: string;
  story: string;
  includes: string[];
};

export const TIERS: Tier[] = [
  {
    name: "Akoya",
    tagline: "Khởi đầu tinh tế",
    pearl: "Ngọc Akoya nhỏ nhắn, tròn đều và sáng trong, là dòng ngọc cổ điển làm nên vẻ đẹp thanh lịch quen thuộc.",
    story: "Gói khởi đầu vừa vặn: gọn gàng, chỉn chu, đủ đầy những điều quan trọng nhất cho một chuyến đi nhẹ nhàng.",
    includes: ["Khách sạn 3-4 sao trung tâm", "Xe đưa đón và di chuyển theo lịch trình", "Ăn sáng mỗi ngày", "Hướng dẫn viên ở các điểm chính", "Vé tham quan cơ bản"],
  },
  {
    name: "Tahiti",
    tagline: "Trải nghiệm đậm sâu",
    pearl: "Ngọc Tahiti mang sắc huyền bí của biển sâu, ánh lên những tầng màu khó quên, hiếm và cá tính.",
    story: "Gói trải nghiệm đậm hơn: nhiều khoảnh khắc riêng tư, những trải nghiệm địa phương được chọn lọc kỹ.",
    includes: ["Khách sạn 4-5 sao", "Xe riêng cho nhóm", "Ăn sáng và một số bữa đặc sản", "Hướng dẫn viên xuyên suốt", "Trải nghiệm địa phương riêng (lớp nấu ăn, làng nghề…)"],
  },
  {
    name: "South Sea",
    tagline: "Trọn vẹn thượng hạng",
    pearl: "Ngọc South Sea là dòng ngọc quý và lớn nhất, ánh vàng hoặc trắng sang trọng, biểu tượng của sự trọn vẹn.",
    story: "Gói trọn vẹn nhất: chăm chút từng chi tiết, riêng tư và thượng hạng từ đầu đến cuối hành trình.",
    includes: ["Resort/khách sạn 5 sao", "Xe riêng và tài xế suốt hành trình", "Trọn bữa, nhà hàng chọn lọc", "Trải nghiệm độc quyền, vé ưu tiên", "Hỗ trợ concierge 24/7"],
  },
];
