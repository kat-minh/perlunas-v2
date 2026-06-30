/**
 * Placeholder blog ("Cẩm nang") data. Static for now — there is no CMS model for
 * posts yet. Images are Unsplash placeholders; swap for real photos (host under
 * /public) when available. When the backend grows a Post entity, mirror this
 * shape in lib/api.ts and read from there instead.
 */

export type BlogSection = {
  /** Tiêu đề phụ của đoạn (tuỳ chọn). */
  heading?: string;
  paragraphs: string[];
  /** Ảnh minh hoạ trong nội dung (tuỳ chọn — admin tự thêm). */
  image?: string;
  /** Chú thích ảnh (tuỳ chọn). */
  caption?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  author: string;
  /** Ngày đăng hiển thị, dạng DD/MM/YYYY. */
  date: string;
  readingTime: string;
  content: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "kinh-nghiem-du-lich-da-lat-mua-dep-nhat",
    title: "Kinh nghiệm du lịch Đà Lạt: đi mùa nào đẹp nhất?",
    excerpt:
      "Đà Lạt đẹp quanh năm, nhưng mỗi mùa lại có một sắc thái riêng. Cùng Perlunas chọn thời điểm hợp với chuyến đi của bạn.",
    cover:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-da-lat-2.jpg",
    category: "Cẩm nang điểm đến",
    author: "Perlunas Team",
    date: "12/06/2026",
    readingTime: "6 phút đọc",
    content: [
      {
        paragraphs: [
          "Nằm trên cao nguyên Lâm Viên ở độ cao hơn 1.500m, Đà Lạt giữ cho mình khí hậu ôn hoà quanh năm. Nhưng để chọn đúng thời điểm cho chuyến đi, bạn nên cân nhắc mục đích: săn hoa, săn mây, hay đơn giản là tránh nóng.",
        ],
      },
      {
        heading: "Mùa khô (tháng 11 đến tháng 4)",
        paragraphs: [
          "Đây là mùa đẹp nhất để ghé Đà Lạt: trời trong, nắng nhẹ, rất hợp cho việc dạo phố và chụp ảnh. Cuối năm còn là mùa hoa dã quỳ nhuộm vàng các triền đồi, rồi mai anh đào nở rộ vào khoảng tháng 1 - 2.",
          "Nếu thích săn mây, hãy dậy sớm và tìm tới Cầu Đất hay đồi Đa Phú lúc bình minh. Mang theo áo ấm vì sáng sớm nhiệt độ có thể xuống 10°C.",
        ],
        image:
          "https://images.unsplash.com/photo-1528127269322-539801943592?fm=jpg&q=60&w=1600&auto=format&fit=crop",
        caption: "Bình minh săn mây trên cao nguyên Đà Lạt.",
      },
      {
        heading: "Mùa mưa (tháng 5 đến tháng 10)",
        paragraphs: [
          "Mưa Đà Lạt thường đến vào buổi chiều và nhanh tạnh, nên bạn vẫn có cả buổi sáng để khám phá. Bù lại, cảnh vật xanh mướt, thác đổ mạnh và giá phòng dễ chịu hơn hẳn.",
        ],
      },
      {
        heading: "Gợi ý từ Perlunas",
        paragraphs: [
          "Với gia đình có trẻ nhỏ, tháng 12 đến tháng 2 là lựa chọn an toàn và nhiều hoa. Với các cặp đôi muốn không gian riêng tư, mùa mưa lại mang đến một Đà Lạt trầm lắng, lãng mạn đúng chất.",
        ],
      },
    ],
  },
  {
    slug: "checklist-hanh-ly-cho-chuyen-bien-dao",
    title: "Checklist hành lý gọn nhẹ cho chuyến biển đảo",
    excerpt:
      "Đi biển không cần mang cả tủ đồ. Đây là danh sách tối giản giúp bạn nhẹ vali mà vẫn đủ đầy.",
    cover:
      "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/tm5ypc6mpiamhf3aamqu.jpg",
    category: "Mẹo chuẩn bị",
    author: "Perlunas Team",
    date: "28/05/2026",
    readingTime: "4 phút đọc",
    content: [
      {
        paragraphs: [
          "Bí quyết để vali gọn nhẹ là chọn đồ đa năng và ưu tiên chất liệu nhanh khô. Dưới đây là những món Perlunas khuyên bạn luôn mang theo cho một chuyến biển đảo.",
        ],
      },
      {
        heading: "Trang phục",
        paragraphs: [
          "Hai bộ đồ bơi để thay đổi, một chiếc áo khoác mỏng chống nắng, vài bộ cotton thoáng mát và một đôi sandal đi được cả ngày. Đừng quên mũ rộng vành và kính râm.",
        ],
      },
      {
        heading: "Bảo vệ và sức khoẻ",
        paragraphs: [
          "Kem chống nắng chỉ số cao, kem chống nắng vật lý nếu bạn đi lặn ngắm san hô (thân thiện với rạn san hô), thuốc say sóng, và một túi y tế nhỏ với băng cá nhân, thuốc cơ bản.",
        ],
      },
      {
        heading: "Đồ điện tử",
        paragraphs: [
          "Túi chống nước cho điện thoại, sạc dự phòng và một chiếc khăn microfiber gọn nhẹ là đủ cho hầu hết các chuyến đi ngắn ngày.",
        ],
      },
    ],
  },
  {
    slug: "am-thuc-mien-trung-nhat-dinh-phai-thu",
    title: "Ẩm thực miền Trung nhất định phải thử một lần",
    excerpt:
      "Từ mì Quảng, bún bò Huế đến cao lầu Hội An — bản đồ vị giác miền Trung qua từng món ăn.",
    cover:
      "https://plus.unsplash.com/premium_photo-1690960644375-6f2399a08ebc?fm=jpg&q=60&w=2000&auto=format&fit=crop",
    category: "Ẩm thực",
    author: "Perlunas Team",
    date: "15/05/2026",
    readingTime: "5 phút đọc",
    content: [
      {
        paragraphs: [
          "Miền Trung là nơi ẩm thực đậm đà nhất Việt Nam — cay hơn, mặn mà hơn và rất giàu câu chuyện. Mỗi món ăn gắn với một vùng đất, một thói quen, một ký ức.",
        ],
      },
      {
        heading: "Huế — tinh tế và cầu kỳ",
        paragraphs: [
          "Bún bò Huế với nước dùng thơm sả và ruốc, bánh bèo - nậm - lọc nhỏ xinh, và chè Huế nhiều màu. Ẩm thực cố đô mang dáng dấp cung đình: cầu kỳ trong từng chi tiết.",
        ],
        image:
          "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?fm=jpg&q=60&w=1600&auto=format&fit=crop",
        caption: "Một tô bún bò Huế nóng hổi, đậm vị cố đô.",
      },
      {
        heading: "Đà Nẵng - Hội An — phóng khoáng và đậm đà",
        paragraphs: [
          "Mì Quảng trộn với tôm thịt và bánh tráng nướng, cao lầu Hội An sợi dai đặc trưng, bánh mì Phượng nổi tiếng. Đừng bỏ lỡ một tô bún chả cá Đà Nẵng buổi sáng.",
        ],
      },
    ],
  },
  {
    slug: "du-lich-ben-vung-di-tu-te-hon",
    title: "Du lịch bền vững: đi tử tế hơn với điểm đến",
    excerpt:
      "Những thói quen nhỏ giúp chuyến đi của bạn nhẹ nhàng hơn với thiên nhiên và cộng đồng địa phương.",
    cover:
      "https://images.unsplash.com/photo-1528127269322-539801943592?fm=jpg&q=60&w=2000&auto=format&fit=crop",
    category: "Cảm hứng",
    author: "Perlunas Team",
    date: "02/05/2026",
    readingTime: "5 phút đọc",
    content: [
      {
        paragraphs: [
          "Du lịch bền vững không phải là từ bỏ tiện nghi, mà là những lựa chọn có ý thức hơn. Một vài thay đổi nhỏ cũng đủ tạo nên khác biệt lớn cho điểm đến.",
        ],
      },
      {
        heading: "Giảm rác thải nhựa",
        paragraphs: [
          "Mang theo bình nước cá nhân, túi vải và ống hút dùng lại. Nhiều khách sạn đối tác của Perlunas đã có trạm tiếp nước miễn phí cho khách.",
        ],
      },
      {
        heading: "Ủng hộ cộng đồng địa phương",
        paragraphs: [
          "Chọn ăn ở hàng quán địa phương, mua sản vật vùng miền và tham gia trải nghiệm do chính người dân tổ chức. Đồng tiền bạn chi tiêu sẽ ở lại với cộng đồng nơi bạn ghé qua.",
        ],
      },
    ],
  },
  {
    slug: "cam-nang-du-lich-cung-tre-nho",
    title: "Cẩm nang du lịch cùng trẻ nhỏ không căng thẳng",
    excerpt:
      "Đi cùng con không hề đáng sợ nếu bạn chuẩn bị đúng cách. Vài bí quyết để cả nhà cùng vui.",
    cover:
      "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?fm=jpg&q=60&w=2000&auto=format&fit=crop",
    category: "Mẹo chuẩn bị",
    author: "Perlunas Team",
    date: "20/04/2026",
    readingTime: "6 phút đọc",
    content: [
      {
        paragraphs: [
          "Một chuyến đi cùng trẻ nhỏ thành công thường bắt đầu từ việc hạ kỳ vọng và tăng sự linh hoạt. Đừng cố nhồi nhét lịch trình — hãy để mỗi ngày có khoảng thở.",
        ],
      },
      {
        heading: "Chọn điểm đến và nhịp đi phù hợp",
        paragraphs: [
          "Ưu tiên điểm đến di chuyển ngắn, có chỗ nghỉ tốt và nhiều hoạt động ngoài trời. Resort có hồ bơi và khu vui chơi thường là lựa chọn an toàn cho gia đình.",
        ],
      },
      {
        heading: "Hành lý cho bé",
        paragraphs: [
          "Mang theo đồ ăn vặt quen thuộc, vài món đồ chơi nhỏ, thuốc cơ bản và quần áo dự phòng. Một chiếc xe đẩy gọn sẽ cứu bạn trong những ngày đi bộ nhiều.",
        ],
      },
    ],
  },
  {
    slug: "san-may-mien-bac-nhung-diem-dep-nhat",
    title: "Săn mây miền Bắc: những điểm đẹp nhất đầu đông",
    excerpt:
      "Tà Xùa, Y Tý, Fansipan — bản đồ săn mây cho người mê biển mây bồng bềnh mỗi sớm.",
    cover:
      "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1740370327.jpg&w=3840&q=75",
    category: "Cẩm nang điểm đến",
    author: "Perlunas Team",
    date: "08/04/2026",
    readingTime: "7 phút đọc",
    content: [
      {
        paragraphs: [
          "Mùa săn mây miền Bắc thường rơi vào khoảng tháng 10 đến tháng 3, khi trời hanh khô và chênh lệch nhiệt độ ngày đêm lớn. Bí quyết là dậy thật sớm và kiên nhẫn chờ bình minh.",
        ],
      },
      {
        heading: "Tà Xùa (Sơn La)",
        paragraphs: [
          "Được mệnh danh là 'thiên đường mây', Tà Xùa có sống lưng khủng long và cây cô đơn nổi tiếng. Biển mây ở đây dày và bồng bềnh, đặc biệt đẹp sau một đêm lạnh.",
        ],
        image:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?fm=jpg&q=60&w=1600&auto=format&fit=crop",
        caption: "Biển mây bồng bềnh nhìn từ sống lưng khủng long Tà Xùa.",
      },
      {
        heading: "Y Tý (Lào Cai)",
        paragraphs: [
          "Y Tý hoang sơ hơn, ít khách hơn và mây đến rất sớm. Kết hợp với ruộng bậc thang mùa nước đổ, đây là điểm đến cho người thích sự yên tĩnh và nguyên bản.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, count = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, count);
}
