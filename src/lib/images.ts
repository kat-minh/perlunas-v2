/**
 * Real image overrides for SceneImage, keyed by the `seed` each component uses.
 * Anything not listed falls back to a picsum placeholder. Add/replace URLs as the
 * client provides them. If a remote host blocks hotlinking and an image fails to
 * load, download it and host it under /public instead.
 *
 * NOTE: some client URLs are low-res / watermarked previews (istock 612px,
 * pngtree thumb, canva marketplace) — swap for full-res later.
 */

// Tour trọn gói photos (kept from the earlier round)
const TOUR_DALAT =
  "https://vstatic.vietnam.vn/vietnam/resource/IMAGE/2025/1/19/1008aad6c4c9493b8047f15e9d133ccf";
const TOUR_PHUQUOC =
  "https://thvl.vn/wp-content/uploads/2023/10/Ph%C3%BA-Qu%E1%BB%91c-n%E1%BA%B1m-trong-top-20-h%C3%B2n-%C4%91%E1%BA%A3o-%C4%91%E1%BA%B9p-nh%E1%BA%A5t-ch%C3%A2u-%C3%81-n%C4%83m-2023.jpg";
const HOIAN =
  "https://plus.unsplash.com/premium_photo-1690960644375-6f2399a08ebc?fm=jpg&q=60&w=3000&auto=format&fit=crop";
const TOUR_NHATRANG =
  "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/9/8/1239023/Vinh-Nha-Trang.jpg";

// Combo "vùng đất" (province tiles)
const HANOI =
  "https://marketplace.canva.com/vwmtE/MAEFg6vwmtE/1/tl/canva-ho-chi-minh-mausoleum-in-hanoi-MAEFg6vwmtE.jpg";
const HCM =
  "https://media.istockphoto.com/id/1324017792/vi/anh/%E1%BA%A3nh-ch%E1%BB%A5p-t%E1%BB%AB-tr%C3%AAn-cao-tuy%E1%BB%87t-%C4%91%E1%BA%B9p-c%E1%BB%A7a-s%C3%A0i-g%C3%B2n-th%C3%A0nh-ph%E1%BB%91-h%E1%BB%93-ch%C3%AD-minh-v%E1%BB%81-%C4%91%C3%AAm.jpg?s=612x612&w=0&k=20&c=poxrZh-OyNJdMELgQPYzDernnhWf2CW3auY8rxnqj-o=";
const HALONG =
  "https://cdn-media.sforum.vn/storage/app/media/anh-vinh-ha-long-2.jpg";
const PHUQUOC =
  "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/tm5ypc6mpiamhf3aamqu.jpg";
const DANANG =
  "https://res.klook.com/images/w_1200,h_630,c_fill,q_65/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/e7waraff45cbnn5j959r/TourNg%C3%A0yThamQuanB%C3%A0N%C3%A0HillsT%E1%BB%AB%C4%90%C3%A0N%E1%BA%B5ng-Klook.jpg";
const NHATRANG =
  "https://dulichdaiviet.com/uploaded/2024/09/chumanhnhandiennamdulichquocgianhatrang.jpeg";
const HUE =
  "https://png.pngtree.com/thumb_back/fh260/background/20220314/pngtree-the-historical-hue-citadel-rich-cultural-heritage-of-dai-noi-vietnam-featuring-ngo-mon-photo-image_21712780.jpg";
const SAPA =
  "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1740370327.jpg&w=3840&q=75";
const DALAT =
  "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-da-lat-2.jpg";

// Về chúng tôi (ảnh trái section About trang chủ) — asset thật trong /public
const ABOUT = "/about.png";

// Tour đoàn (GroupTours) — Unsplash, đúng chủ đề
const GROUP_GALA = "https://images.unsplash.com/photo-1768881618157-2cc24f7493c6?fm=jpg&q=60&w=2000&auto=format&fit=crop";
const GROUP_TEAM = "https://images.unsplash.com/photo-1774599661329-d9a2f999d1c4?fm=jpg&q=60&w=2000&auto=format&fit=crop";
const GROUP_TOUR = "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?fm=jpg&q=60&w=1200&auto=format&fit=crop";

// Tour riêng tư (PrivateTour) — Unsplash, theo từng nhóm khách
const PRIV_FAMILY = "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?fm=jpg&q=60&w=900&auto=format&fit=crop";
const PRIV_COUPLES = "https://images.unsplash.com/photo-1566759996874-04d713cc224a?fm=jpg&q=60&w=900&auto=format&fit=crop";
const PRIV_FRIENDS = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?fm=jpg&q=60&w=900&auto=format&fit=crop";
const PRIV_HONEYMOON = "https://images.unsplash.com/photo-1648538923547-074724ca7a18?fm=jpg&q=60&w=900&auto=format&fit=crop";
const PRIV_SOLO = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?fm=jpg&q=60&w=900&auto=format&fit=crop";

// Về chúng tôi (trang /ve-chung-toi) — Unsplash
const ABOUT_CRAFT = "https://images.unsplash.com/photo-1528127269322-539801943592?fm=jpg&q=60&w=2000&auto=format&fit=crop";
const ABOUT_PEARL = "https://images.unsplash.com/photo-1595345705177-ffe090eb0784?fm=jpg&q=60&w=1200&auto=format&fit=crop";
const ABOUT_LUNA = "https://images.unsplash.com/photo-1581886573745-4487c55d95f8?fm=jpg&q=60&w=1200&auto=format&fit=crop";
const ABOUT_VISION = "https://images.unsplash.com/photo-1585970661791-9cec67470281?fm=jpg&q=60&w=1200&auto=format&fit=crop";
const ABOUT_MISSION = "https://images.unsplash.com/photo-1592903204858-e288251ad9cc?fm=jpg&q=60&w=1200&auto=format&fit=crop";

// Khách sạn
const LUNARBAY =
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/482730525.jpg?k=4feae26c2ba7205e2fd33376a45a3db0798930244ec595cbc6a006400947a81a&o=";
const MAISON =
  "https://q-xx.bstatic.com/xdata/images/hotel/max500/594054604.jpg?k=1c607a279abd5d319392d70aaa3b070e677865e56557040bbc2fcf3a28ce0e48&o=";
const SERENITY =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkVjNDwLET4nYxGnOOrI03mZVNn7DcRmFocg&s";

export const IMAGES: Record<string, string> = {
  // Tour trọn gói
  "perlunas-tour-da-lat": TOUR_DALAT,
  "perlunas-tour-phu-quoc": TOUR_PHUQUOC,
  "perlunas-tour-ha-noi-sapa": HANOI,
  "perlunas-tour-da-nang-hoi-an": HOIAN,
  "perlunas-tour-nha-trang": TOUR_NHATRANG,
  // Combo (vùng đất)
  "perlunas-place-ha-noi": HANOI,
  "perlunas-place-ho-chi-minh": HCM,
  "perlunas-place-ha-long": HALONG,
  "perlunas-place-da-lat": DALAT,
  "perlunas-place-phu-quoc": PHUQUOC,
  "perlunas-place-da-nang": DANANG,
  "perlunas-place-nha-trang": NHATRANG,
  "perlunas-place-hue": HUE,
  "perlunas-place-sa-pa": SAPA,
  // Về chúng tôi
  "perlunas-about-dramatic": ABOUT,
  "perlunas-about-craft": ABOUT_CRAFT,
  "perlunas-about-pearl": ABOUT_PEARL,
  "perlunas-about-luna": ABOUT_LUNA,
  "perlunas-about-vision": ABOUT_VISION,
  "perlunas-about-mission": ABOUT_MISSION,
  // Tour đoàn
  "perlunas-group-gala": GROUP_GALA,
  "perlunas-group-team": GROUP_TEAM,
  "perlunas-group-tour": GROUP_TOUR,
  // Tour riêng tư
  "perlunas-private-family": PRIV_FAMILY,
  "perlunas-private-couples": PRIV_COUPLES,
  "perlunas-private-friends": PRIV_FRIENDS,
  "perlunas-private-honeymoon": PRIV_HONEYMOON,
  "perlunas-private-solo": PRIV_SOLO,
  // Khách sạn
  "perlunas-hotel-lunar-bay": LUNARBAY,
  "perlunas-hotel-maison-de-lune": MAISON,
  "perlunas-hotel-serenity-retreat": SERENITY,
};
