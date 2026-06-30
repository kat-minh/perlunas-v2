/**
 * Placeholder showcase data for the Tour đoàn / Tour riêng tư pages:
 * past trips ("đã làm"), client names ("đã hợp tác") and testimonials
 * ("feedback"). Images are Unsplash placeholders — swap for real photos
 * (host under /public) when the client provides them. Keep the shapes; the
 * page components only read these fields.
 */

export type WorkItem = {
  title: string;
  /** Short context line: địa điểm / quy mô / loại hình. */
  meta: string;
  image: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  /** Vai trò / công ty / nhóm khách. */
  role: string;
  avatar: string;
};

/* ----------------------------- Tour đoàn ----------------------------- */

export const GROUP_WORK: WorkItem[] = [
  {
    title: "Gala dinner 300 khách",
    meta: "Đà Nẵng · Doanh nghiệp",
    image: "https://images.unsplash.com/photo-1768881618157-2cc24f7493c6?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Team building bãi biển",
    meta: "Phú Quốc · 150 người",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Hội nghị kết hợp tham quan",
    meta: "Hà Nội · Sa Pa",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Company trip cuối năm",
    meta: "Nha Trang · 4 ngày 3 đêm",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Lễ kỷ niệm thành lập",
    meta: "Đà Lạt · Gala & team building",
    image: "https://images.unsplash.com/photo-1774599661329-d9a2f999d1c4?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Khen thưởng đại lý",
    meta: "Hạ Long · Du thuyền",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
];

export const GROUP_CLIENTS = [
  "FPT Software",
  "Techcombank",
  "Vietcombank",
  "Viettel",
  "VNG",
  "Masan Group",
  "Shopee",
  "PNJ",
  "Vinamilk",
  "MB Bank",
];

export const GROUP_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Đoàn gần 300 người mà mọi thứ chạy mượt từ đưa đón tới gala. Một đầu mối lo trọn, tụi mình chỉ việc tận hưởng.",
    name: "Chị Thu Hà",
    role: "Trưởng phòng HR · Doanh nghiệp công nghệ",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=jpg&q=60&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Kịch bản team building được thiết kế riêng, gắn kết thật chứ không rập khuôn. Anh em về vẫn còn nhắc.",
    name: "Anh Quốc Anh",
    role: "Giám đốc kinh doanh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Hội nghị kết hợp tham quan, lịch dày nhưng Perlunas điều phối rất chỉn chu. Đối tác của công ty đều hài lòng.",
    name: "Chị Mai Linh",
    role: "Trưởng ban tổ chức sự kiện",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=400&auto=format&fit=crop",
  },
];

/* --------------------------- Tour riêng tư --------------------------- */

export const PRIVATE_WORK: WorkItem[] = [
  {
    title: "Trăng mật Phú Quốc",
    meta: "Cặp đôi · 4 ngày 3 đêm",
    image: "https://images.unsplash.com/photo-1648538923547-074724ca7a18?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Gia đình ba thế hệ",
    meta: "Đà Nẵng · Hội An",
    image: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Nhóm bạn thân khám phá",
    meta: "Hà Giang · Cao nguyên đá",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Kỳ nghỉ riêng tư cặp đôi",
    meta: "Đà Lạt · Retreat giữa rừng thông",
    image: "https://images.unsplash.com/photo-1566759996874-04d713cc224a?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Hành trình chữa lành",
    meta: "Ninh Bình · Wellness",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
  {
    title: "Sinh nhật bất ngờ",
    meta: "Nha Trang · Du thuyền riêng",
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  },
];

export const PRIVATE_CLIENTS = [
  "Gia đình anh Hoàng",
  "Vợ chồng chị Lan",
  "Nhóm Cô Ba Sài Gòn",
  "Anh Minh & bạn bè",
  "Chị Hương & gia đình",
  "Cặp đôi Nam · Trang",
  "Gia đình chị Yến",
  "Nhóm bạn Đại học Bách Khoa",
];

export const PRIVATE_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Lịch trình được may đo đúng nhịp của gia đình mình, có người già và trẻ nhỏ. Đi mà thấy nhẹ nhõm, không phải lo gì.",
    name: "Chị Bích Ngọc",
    role: "Chuyến đi gia đình · Đà Nẵng",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?fm=jpg&q=60&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Tụi mình chỉ nói mong muốn, Perlunas đề xuất rồi chỉnh tới khi vừa ý. Trăng mật trọn vẹn hơn cả tưởng tượng.",
    name: "Vợ chồng Nam · Trang",
    role: "Trăng mật · Phú Quốc",
    avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?fm=jpg&q=60&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Một chuyến đi riêng tư, linh hoạt từng ngày. Cảm giác như có người bạn bản địa lo hết mọi thứ cho mình.",
    name: "Anh Trung Kiên",
    role: "Nhóm bạn thân · Hà Giang",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=60&w=400&auto=format&fit=crop",
  },
];
