import type { LucideIcon } from "lucide-react";
import {
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Plane,
  Building2,
  Route,
  BedDouble,
} from "lucide-react";

/* ----------------------------------------------------------------
   Brand story — passport-stamp timeline
   ---------------------------------------------------------------- */
export interface Milestone {
  year: string;
  stamp: string; // short stamp caption
  title: string;
  body: string;
  rotate: number; // deg, for the scrapbook feel
}

export const milestones: Milestone[] = [
  {
    year: "2014",
    stamp: "ĐIỂM KHỞI HÀNH",
    title: "Một chuyến xe và ba người bạn",
    body: "Chúng tôi bắt đầu bằng một chiếc xe 16 chỗ, dẫn những người bạn đầu tiên băng qua cung đường Tây Bắc mùa lúa chín.",
    rotate: -4,
  },
  {
    year: "2017",
    stamp: "MỞ TUYẾN",
    title: "Chạm tới ba miền",
    body: "Từ ruộng bậc thang Mù Cang Chải đến hang động Phong Nha và những hòn đảo phương Nam — bản đồ của chúng tôi rộng dần.",
    rotate: 3,
  },
  {
    year: "2020",
    stamp: "GIỮ LỬA",
    title: "Đồng hành qua giông bão",
    body: "Khi ngành du lịch chững lại, chúng tôi chọn ở lại với khách hàng — thiết kế những hành trình gần, an toàn và đầy chữa lành.",
    rotate: -3,
  },
  {
    year: "2024",
    stamp: "10 NĂM",
    title: "12.000 hành trình cảm xúc",
    body: "Một thập kỷ, hơn 12.000 lữ khách và vô số khoảnh khắc được giữ lại trong những tấm vé lên tàu của chúng tôi.",
    rotate: 2,
  },
];

/* ----------------------------------------------------------------
   Why choose us — visa-stamp reasons
   ---------------------------------------------------------------- */
export interface Reason {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const reasons: Reason[] = [
  {
    icon: Compass,
    title: "Thiết kế riêng theo cảm xúc",
    body: "Không có hai hành trình giống nhau. Mỗi lịch trình được may đo theo nhịp sống, ngân sách và câu chuyện của bạn.",
  },
  {
    icon: HeartHandshake,
    title: "Người dẫn đường địa phương",
    body: "Đội ngũ am hiểu từng con dốc, quán ăn và mùa đẹp nhất — đưa bạn đến nơi bản đồ không chỉ đường.",
  },
  {
    icon: ShieldCheck,
    title: "An tâm trọn vẹn",
    body: "Bảo hiểm du lịch, hỗ trợ 24/7 và phương án dự phòng cho mọi tình huống thời tiết.",
  },
  {
    icon: Sparkles,
    title: "Khoảnh khắc được giữ lại",
    body: "Mỗi chuyến đi khép lại bằng một cuốn nhật ký ảnh — món quà nhỏ để bạn mang hành trình về nhà.",
  },
];

/* ----------------------------------------------------------------
   Founder — traveler identity page
   ---------------------------------------------------------------- */
export const founder = {
  name: "Lê Nguyên Khang",
  role: "Người sáng lập & Trưởng đoàn",
  years: 12,
  countriesText: "63 tỉnh thành Việt Nam",
  portrait:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  passportNo: "VN · HTV · 2014",
  philosophy:
    "“Một chuyến đi đẹp không đo bằng số điểm check-in, mà bằng những điều bạn mang về trong tim.”",
  mission:
    "Đưa người Việt đi khắp dải đất hình chữ S bằng những hành trình tử tế, chậm rãi và giàu kết nối — nơi mỗi điểm đến đều có một câu chuyện để kể.",
  highlights: [
    "Dẫn hơn 600 đoàn xuyên Việt",
    "Sáng lập cung trekking Tà Năng – Phan Dũng cộng đồng",
    "Cố vấn du lịch bền vững cho 9 bản làng vùng cao",
  ],
};

/* ----------------------------------------------------------------
   Tour categories — boarding-pass classes
   ---------------------------------------------------------------- */
export interface Category {
  icon: LucideIcon;
  code: string;
  title: string;
  body: string;
  bullets: string[];
}

export const categories: Category[] = [
  {
    icon: Plane,
    code: "GRP",
    title: "Tour ghép sẵn",
    body: "Lịch trình đẹp được thiết kế sẵn theo mùa, khởi hành định kỳ — chỉ việc xách balo lên và đi.",
    bullets: ["Khởi hành cố định", "Giá tối ưu", "Phù hợp người bận rộn"],
  },
  {
    icon: BedDouble,
    code: "STY",
    title: "Đặt phòng khách sạn",
    body: "Tuyển chọn resort, homestay và khách sạn boutique đã được đội ngũ kiểm chứng tận nơi.",
    bullets: ["Giá thân thiện", "Vị trí đắt giá", "Đã thẩm định thực tế"],
  },
  {
    icon: Route,
    code: "PVT",
    title: "Tour thiết kế riêng",
    body: "Hành trình may đo 1:1 theo sở thích, ngân sách và nhịp đi của riêng bạn.",
    bullets: ["Cá nhân hoá 100%", "Hướng dẫn riêng", "Linh hoạt từng giờ"],
  },
  {
    icon: Building2,
    code: "COR",
    title: "Tour doanh nghiệp",
    body: "Team building, hội nghị và tri ân khách hàng — gắn kết đội ngũ giữa thiên nhiên Việt.",
    bullets: ["Kịch bản riêng", "Hậu cần trọn gói", "Quy mô tới 500 khách"],
  },
];

/* ----------------------------------------------------------------
   Featured tours — boarding passes
   ---------------------------------------------------------------- */
export interface Tour {
  id: string;
  from: string;
  to: string;
  region: string;
  code: string;
  days: string;
  season: string;
  price: number;
  image: string;
  highlights: string[];
  vibe: string;
}

export const tours: Tour[] = [
  {
    id: "ha-giang",
    from: "Hà Nội",
    to: "Hà Giang",
    region: "Đông Bắc",
    code: "HTV·201",
    days: "4N3Đ",
    season: "Mùa hoa tam giác mạch",
    price: 4290000,
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Đèo Mã Pí Lèng", "Sông Nho Quế", "Làng Lô Lô Chải"],
    vibe: "Cung đường đá hùng vĩ nhất phương Bắc.",
  },
  {
    id: "phong-nha",
    from: "Đồng Hới",
    to: "Phong Nha",
    region: "Bắc Trung Bộ",
    code: "HTV·314",
    days: "3N2Đ",
    season: "Khô ráo, lý tưởng khám hang",
    price: 3690000,
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Hang Én", "Suối Nước Moọc", "Sông Chày"],
    vibe: "Vương quốc hang động kỳ vĩ.",
  },
  {
    id: "ly-son",
    from: "Quảng Ngãi",
    to: "Đảo Lý Sơn",
    region: "Nam Trung Bộ",
    code: "HTV·427",
    days: "3N2Đ",
    season: "Biển lặng, nắng vàng",
    price: 3290000,
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Đỉnh Thới Lới", "Cổng Tò Vò", "Cánh đồng tỏi"],
    vibe: "Đảo tiền tiêu giữa biển xanh.",
  },
  {
    id: "da-lat",
    from: "TP.HCM",
    to: "Đà Lạt",
    region: "Tây Nguyên",
    code: "HTV·553",
    days: "3N2Đ",
    season: "Se lạnh quanh năm",
    price: 2890000,
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Đồi chè Cầu Đất", "Săn mây Cầu Sắt", "Vườn dâu"],
    vibe: "Thành phố sương mù lãng mạn.",
  },
  {
    id: "phu-quoc",
    from: "TP.HCM",
    to: "Phú Quốc",
    region: "Tây Nam Bộ",
    code: "HTV·690",
    days: "4N3Đ",
    season: "Hoàng hôn đẹp nhất năm",
    price: 5490000,
    image:
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Nam đảo", "Hòn Móng Tay", "Chợ đêm Dương Đông"],
    vibe: "Đảo ngọc của phương Nam.",
  },
  {
    id: "moc-chau",
    from: "Hà Nội",
    to: "Mộc Châu",
    region: "Tây Bắc",
    code: "HTV·118",
    days: "2N1Đ",
    season: "Mùa hoa mận trắng",
    price: 1990000,
    image:
      "https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Đồi chè trái tim", "Thác Dải Yếm", "Rừng thông bản Áng"],
    vibe: "Cao nguyên xanh ngát gần Hà Nội.",
  },
];

/* ----------------------------------------------------------------
   Interactive map — destinations as pins on Vietnam
   x/y are percentages over the SVG silhouette viewBox.
   ---------------------------------------------------------------- */
export interface Pin {
  id: string;
  name: string;
  region: string;
  blurb: string;
  x: number;
  y: number;
}

export const pins: Pin[] = [
  { id: "ha-giang", name: "Hà Giang", region: "Đông Bắc", blurb: "Cao nguyên đá Đồng Văn", x: 47, y: 9 },
  { id: "sapa", name: "Sa Pa", region: "Tây Bắc", blurb: "Nóc nhà Đông Dương", x: 33, y: 12 },
  { id: "ha-noi", name: "Hà Nội", region: "Đồng bằng Bắc Bộ", blurb: "Phố cổ nghìn năm", x: 47, y: 20 },
  { id: "ha-long", name: "Hạ Long", region: "Đông Bắc", blurb: "Kỳ quan vịnh biển", x: 58, y: 19 },
  { id: "phong-nha", name: "Phong Nha", region: "Bắc Trung Bộ", blurb: "Vương quốc hang động", x: 52, y: 40 },
  { id: "hue", name: "Huế", region: "Bắc Trung Bộ", blurb: "Kinh thành cổ kính", x: 58, y: 45 },
  { id: "hoi-an", name: "Hội An", region: "Nam Trung Bộ", blurb: "Phố đèn lồng", x: 63, y: 49 },
  { id: "ly-son", name: "Lý Sơn", region: "Nam Trung Bộ", blurb: "Đảo tỏi giữa biển", x: 68, y: 53 },
  { id: "da-lat", name: "Đà Lạt", region: "Tây Nguyên", blurb: "Thành phố sương mù", x: 64, y: 64 },
  { id: "nha-trang", name: "Nha Trang", region: "Nam Trung Bộ", blurb: "Vịnh biển nắng vàng", x: 70, y: 64 },
  { id: "sai-gon", name: "TP.HCM", region: "Đông Nam Bộ", blurb: "Phương Nam sôi động", x: 58, y: 78 },
  { id: "phu-quoc", name: "Phú Quốc", region: "Tây Nam Bộ", blurb: "Đảo ngọc hoàng hôn", x: 40, y: 82 },
];

/* ----------------------------------------------------------------
   Customer experiences — postcards / polaroids
   ---------------------------------------------------------------- */
export interface Story {
  name: string;
  trip: string;
  quote: string;
  image: string;
  rotate: number;
  tag: string;
}

export const stories: Story[] = [
  {
    name: "Gia đình chị Mai",
    trip: "Hà Giang · 4 ngày",
    tag: "Gia đình",
    quote:
      "Lần đầu cả nhà ba thế hệ đi cùng nhau. Đội ngũ lo từng viên thuốc say xe cho ông bà. Một chuyến đi cả nhà sẽ nhớ mãi.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
    rotate: -5,
  },
  {
    name: "Anh Đức & chị Linh",
    trip: "Phú Quốc · Tuần trăng mật",
    tag: "Cặp đôi",
    quote:
      "Hoàng hôn trên du thuyền riêng đúng như trong mơ. Mọi bất ngờ nhỏ đều được chuẩn bị tinh tế đến bất ngờ.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    rotate: 4,
  },
  {
    name: "Team Sao Mai",
    trip: "Đà Lạt · Team building 80 người",
    tag: "Doanh nghiệp",
    quote:
      "Kịch bản gắn kết được thiết kế riêng cho văn hoá công ty. Cả đội trở về với năng lượng hoàn toàn mới.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    rotate: -3,
  },
  {
    name: "Nhóm bạn Gen Z",
    trip: "Tà Năng · Trekking 3 ngày",
    tag: "Nhóm bạn",
    quote:
      "Cung đường cháy nắng nhưng đáng từng giọt mồ hôi. Porter và guide cực kỳ chuyên nghiệp và vui tính.",
    image:
      "https://images.unsplash.com/photo-1533692328991-08159ff19fca?auto=format&fit=crop&w=900&q=80",
    rotate: 5,
  },
];

export const stats = [
  { value: "12K+", label: "Lữ khách đồng hành" },
  { value: "63", label: "Tỉnh thành phủ kín" },
  { value: "10", label: "Năm dẫn lối" },
  { value: "4.9", label: "Điểm hài lòng / 5" },
];
