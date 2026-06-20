/**
 * Real image overrides for SceneImage, keyed by the `seed` each component uses.
 * Anything not listed falls back to a picsum placeholder. Add/replace URLs as the
 * client provides them. If a remote host blocks hotlinking and an image fails to
 * load, download it and host it under /public instead.
 */
const DALAT =
  "https://vstatic.vietnam.vn/vietnam/resource/IMAGE/2025/1/19/1008aad6c4c9493b8047f15e9d133ccf";
const PHUQUOC =
  "https://thvl.vn/wp-content/uploads/2023/10/Ph%C3%BA-Qu%E1%BB%91c-n%E1%BA%B1m-trong-top-20-h%C3%B2n-%C4%91%E1%BA%A3o-%C4%91%E1%BA%B9p-nh%E1%BA%A5t-ch%C3%A2u-%C3%81-n%C4%83m-2023.jpg";
const HOIAN =
  "https://plus.unsplash.com/premium_photo-1690960644375-6f2399a08ebc?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9pJTIwYW58ZW58MHx8MHx8fDA%3D";
// NOTE: client pasted the Hội An URL for Hà Nội too — likely a copy/paste slip.
// Replace with a real Hà Nội photo when available.
const HANOI = HOIAN;
const NHATRANG =
  "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/9/8/1239023/Vinh-Nha-Trang.jpg";
const LUNARBAY =
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/482730525.jpg?k=4feae26c2ba7205e2fd33376a45a3db0798930244ec595cbc6a006400947a81a&o=";
const MAISON =
  "https://q-xx.bstatic.com/xdata/images/hotel/max500/594054604.jpg?k=1c607a279abd5d319392d70aaa3b070e677865e56557040bbc2fcf3a28ce0e48&o=";
const SERENITY =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkVjNDwLET4nYxGnOOrI03mZVNn7DcRmFocg&s";

export const IMAGES: Record<string, string> = {
  // Tour trọn gói
  "perlunas-tour-da-lat": DALAT,
  "perlunas-tour-phu-quoc": PHUQUOC,
  "perlunas-tour-ha-noi-sapa": HANOI,
  "perlunas-tour-da-nang-hoi-an": HOIAN,
  "perlunas-tour-nha-trang": NHATRANG,
  // Combo (điểm đến)
  "perlunas-place-da-lat": DALAT,
  "perlunas-place-phu-quoc": PHUQUOC,
  "perlunas-place-ha-noi": HANOI,
  "perlunas-place-nha-trang": NHATRANG,
  // Khách sạn
  "perlunas-hotel-lunar-bay": LUNARBAY,
  "perlunas-hotel-maison-de-lune": MAISON,
  "perlunas-hotel-serenity-retreat": SERENITY,
};
