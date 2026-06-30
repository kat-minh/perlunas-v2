import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, BedDouble, Camera, Utensils, Bus } from "lucide-react";
import { PROVINCES } from "@/lib/catalog";
import { getTour, getHotels, getTours } from "@/lib/api";
import { isComingSoon } from "@/lib/tour-tags";
import { SceneImage } from "@/components/site/SceneImage";
import { TourGallery } from "@/components/site/TourGallery";
import { HighlightsPanel } from "@/components/site/HighlightsPanel";
import { Itinerary, type ItineraryDay } from "@/components/site/Itinerary";
import { InfoAccordion, type InfoItem } from "@/components/site/InfoAccordion";
import { type Departure } from "@/components/site/DepartureSchedule";
import {
  DepartureProvider,
  DeparturePicker,
  DepartureSummary,
} from "@/components/site/TourDepartures";
import { QuickEnquiry } from "@/components/site/QuickEnquiry";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTour(slug);
  return { title: t ? t.name : "Tour trọn gói" };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();
  // Tour "Sắp ra mắt" chưa cho xem chi tiết (kể cả truy cập thẳng URL).
  if (isComingSoon(slug)) notFound();

  const [hotels, allTours] = await Promise.all([getHotels(), getTours()]);

  // "Tour khác" — gợi ý tour liên quan: ưu tiên cùng vùng miền, rồi các tour khác.
  const relatedTours = [
    ...allTours.filter((t) => t.slug !== tour.slug && t.region === tour.region),
    ...allTours.filter((t) => t.slug !== tour.slug && t.region !== tour.region),
  ].slice(0, 3);

  // Carousel images: the tour cover, its destinations, then a series of
  // variants — deduped — so there's a good strip of thumbnails to page through
  // (the vertical strip scrolls when it gets long).
  const gallery = Array.from(
    new Set([
      `perlunas-tour-${tour.slug}`,
      ...tour.stays.map((s) => `perlunas-place-${s}`),
      ...Array.from({ length: 9 }, (_, i) => `perlunas-tour-${tour.slug}-${i + 2}`),
    ]),
  ).slice(0, 10);

  // Destination(s) of this tour → suggest hotels there (all stay types).
  const stayProvinces = tour.stays
    .map((s) => PROVINCES.find((p) => p.slug === s))
    .filter((p): p is (typeof PROVINCES)[number] => Boolean(p));
  const stayNames = stayProvinces.map((p) => p.name).join(" & ");
  const suggestedHotels = hotels
    .filter((h) => stayProvinces.some((p) => p.name === h.city))
    .slice(0, 3);

  // "Thông tin chính về chuyến đi" — four note cards (ref: travel.com.vn).
  const tripInfo = [
    {
      Icon: BedDouble,
      title: "Lưu trú",
      body: stayNames
        ? `Khách sạn/resort chọn lọc tại ${stayNames}, tiêu chuẩn 3–4★.`
        : "Khách sạn/resort chọn lọc, tiêu chuẩn 3–4★, vị trí thuận tiện.",
    },
    {
      Icon: Camera,
      title: "Tham quan",
      body: "Các điểm nổi bật theo chương trình, có hướng dẫn viên đồng hành suốt hành trình.",
    },
    {
      Icon: Utensils,
      title: "Ăn uống",
      body: "Các bữa ăn theo chương trình, thực đơn đa dạng cùng đặc sản địa phương.",
    },
    {
      Icon: Bus,
      title: "Di chuyển",
      body: "Xe đời mới máy lạnh và các phương tiện theo lịch trình, đón tiễn tận nơi.",
    },
  ];

  // Lịch khởi hành (dữ liệu mẫu dựng từ tour — chưa có API). Mã tour lấy theo
  // chữ cái đầu các từ trong slug; giá theo giá tour; chuẩn lưu trú xoay vòng.
  const codePrefix =
    tour.slug
      .split("-")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 3) || "PL";
  const baseNum = parseInt(tour.price.replace(/\D/g, ""), 10) || 0;
  const fmtVnd = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
  const STAYS = ["Khách sạn 3 sao", "Khách sạn 4 sao", "Resort 5 sao"];
  const MONTHS = ["07/2026", "08/2026", "09/2026", "10/2026"];
  const departures: Departure[] = MONTHS.flatMap((m, mi) => {
    const [mm, yyyy] = m.split("/");
    return [6, 16, 26].map((d, di) => {
      const dd = String(d).padStart(2, "0");
      const seq = String(mi * 3 + di + 51).padStart(3, "0");
      const discounted = di === 2; // dòng cuối tháng có khuyến mãi
      // giá chênh nhẹ giữa các mốc (theo tháng/ngày) cho thực tế hơn
      const delta = mi * 100000 + di * 50000;
      const price = baseNum + delta;
      return {
        month: m,
        date: `${dd}/${mm}/${yyyy}`,
        code: `ND${codePrefix}103-${seq}-${dd}${mm}${yyyy.slice(2)}VN-D`,
        price: fmtVnd(price),
        priceWas: discounted ? fmtVnd(price + 200000) : undefined,
        stay: STAYS[(mi + di) % STAYS.length],
      };
    });
  });

  // Mã tour hiển thị ở card (ổn định theo slug) + điểm khởi hành.
  const tourCode = `${codePrefix}${String(
    Array.from(tour.slug).reduce((a, c) => (a * 33 + c.charCodeAt(0)) % 1000000, 7),
  ).padStart(6, "0")}`;
  const departureFrom = "TP. Hồ Chí Minh";

  // Lịch trình chi tiết (mẫu dựng từ tour) — ngày 1 đi, ngày cuối về.
  const dest = (stayNames || tour.region).toUpperCase();
  const origin = departureFrom.toUpperCase();
  const daysCount = Number(tour.nights.match(/(\d+)\s*ngày/)?.[1]) || 3;
  const itinerary: ItineraryDay[] = Array.from({ length: daysCount }, (_, idx) => {
    const day = idx + 1;
    const route =
      day === 1 ? `${origin} - ${dest}` : day === daysCount ? `${dest} - ${origin}` : dest;
    let body: string;
    if (day === 1) {
      body = `Xe và hướng dẫn viên Perlunas đón đoàn, khởi hành đến ${stayNames || tour.region}. Nhận phòng khách sạn, nghỉ ngơi và dùng bữa theo chương trình.`;
    } else if (day === daysCount) {
      body = `Tự do ăn sáng, mua sắm đặc sản làm quà. Đoàn làm thủ tục trả phòng và khởi hành về ${origin}, kết thúc hành trình. Hẹn gặp lại quý khách.`;
    } else {
      body = `Khám phá ${tour.region} với các điểm nổi bật: ${tour.highlights.join(", ")}. Nghỉ đêm tại ${stayNames || tour.region}.`;
    }
    return { title: `NGÀY ${day}: ${route}`, meals: "Ăn 03 bữa: sáng, trưa, tối", body };
  });

  // "Thông tin quan trọng về tour" — accordion (nội dung mẫu chuẩn ngành).
  const tourInfo: InfoItem[] = [
    {
      title: "Giá tour bao gồm",
      blocks: [
        {
          lines: [
            "Xe du lịch đời mới máy lạnh đưa đón theo chương trình.",
            "Khách sạn theo tiêu chuẩn, 2 - 3 khách/phòng.",
            "Các bữa ăn theo chương trình.",
            "Vé tham quan các điểm có trong chương trình (lượt vào cổng lần đầu).",
            "Hướng dẫn viên kinh nghiệm phục vụ suốt tuyến.",
            "Bảo hiểm du lịch theo quy định.",
            "Nước suối và khăn lạnh trên xe.",
          ],
        },
      ],
    },
    {
      title: "Giá tour chưa bao gồm",
      blocks: [
        {
          lines: [
            "Chi phí cá nhân, giặt ủi, điện thoại, đồ uống ngoài chương trình.",
            "Tiền tip cho hướng dẫn viên và tài xế.",
            "Phụ thu phòng đơn.",
            "Thuế VAT và hóa đơn đỏ (nếu khách yêu cầu).",
            "Các chi phí phát sinh ngoài chương trình.",
          ],
        },
      ],
    },
    {
      title: "Giá trẻ em",
      blocks: [
        {
          lines: [
            "Trẻ dưới 5 tuổi: miễn phí, gia đình tự lo, ngủ chung giường với bố mẹ; 2 người lớn kèm tối đa 1 trẻ.",
            "Trẻ 5 - dưới 10 tuổi: tính 50% giá tour (suất ăn và ghế ngồi riêng, ngủ chung với bố mẹ).",
            "Trẻ từ 10 tuổi trở lên: tính như người lớn (100% giá tour, tiêu chuẩn đầy đủ).",
          ],
        },
      ],
    },
    {
      title: "Điều kiện đăng ký và thanh toán tour",
      blocks: [
        {
          lines: [
            "Đặt cọc 50% giá tour ngay khi đăng ký để giữ chỗ.",
            "Thanh toán phần còn lại trước ngày khởi hành tối thiểu 7 ngày.",
            "Cung cấp đầy đủ thông tin: họ tên, năm sinh, số CMND/CCCD/hộ chiếu khi đăng ký.",
          ],
        },
      ],
    },
    {
      title: "Điều kiện chuyển và huỷ tour",
      blocks: [
        {
          subtitle: "Ngày thường",
          lines: [
            "Huỷ trước ngày khởi hành từ 15 ngày: phí 30% giá tour.",
            "Huỷ trước 7 - 14 ngày: phí 50% giá tour.",
            "Huỷ trước 3 - 6 ngày: phí 70% giá tour.",
            "Huỷ trong vòng 2 ngày hoặc không khởi hành (no-show): phí 100% giá tour.",
          ],
        },
        {
          subtitle: "Ngày lễ, Tết",
          lines: [
            "Huỷ trước ngày khởi hành từ 30 ngày: phí 50% giá tour.",
            "Huỷ trước 15 - 29 ngày: phí 70% giá tour.",
            "Huỷ trong vòng 14 ngày hoặc không khởi hành (no-show): phí 100% giá tour.",
          ],
        },
      ],
    },
    {
      title: "Trường hợp bất khả kháng",
      blocks: [
        {
          lines: [
            "Trường hợp bất khả kháng (thiên tai, dịch bệnh, thời tiết xấu, đình công, chuyến bay delay/huỷ…), hai bên không chịu trách nhiệm bồi thường mà cùng thương lượng giải quyết hợp lý, đảm bảo quyền lợi tối đa cho khách.",
            "Perlunas có quyền thay đổi lộ trình hoặc điểm tham quan vì lý do an toàn, nhưng vẫn đảm bảo đầy đủ quyền lợi và tiêu chuẩn dịch vụ cho khách.",
          ],
        },
      ],
    },
  ];

  // "Điểm nổi bật trong tour" — liệt kê theo nhóm trong một bảng lớn.
  const highlightGroups = [
    {
      title: "Điểm nhấn",
      intro: `Hành trình ${tour.nights} khám phá ${tour.region}${
        stayNames ? ` qua ${stayNames}` : ""
      }, với các điểm nổi bật: ${tour.highlights.join(", ")}.`,
    },
    {
      title: "Du lịch Bền vững (ESG)",
      points: [
        {
          label: "Môi trường",
          text: `Tôn vinh cảnh quan thiên nhiên và di sản đặc trưng của ${tour.region}.`,
        },
        {
          label: "Cộng đồng",
          text: `Kết nối cộng đồng địa phương qua các điểm văn hóa, khu đặc sản và không gian bản địa${
            stayNames ? ` tại ${stayNames}` : ""
          }.`,
        },
      ],
    },
    {
      title: "Trải nghiệm Bản địa (LEI)",
      points: [
        {
          label: "Văn hóa & Lịch sử",
          text: "Tham quan các điểm văn hóa, lịch sử tiêu biểu trong hành trình.",
        },
        {
          label: "Trải nghiệm Độc đáo",
          text: `Những trải nghiệm đặc trưng chỉ có tại ${tour.region}.`,
        },
        {
          label: "Tinh hoa Ẩm thực",
          text: "Thưởng thức và tự do khám phá đặc sản từng điểm đến.",
        },
      ],
    },
  ];

  return (
    <main className="pb-24">
      <section className="relative flex min-h-[64vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <SceneImage seed={`perlunas-tour-${tour.slug}`} alt={tour.name} w={2000} h={1100} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        </div>
        <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-12 text-paper sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/75">
            {tour.region} · {tour.nights}
          </p>
          <h1 className="display mt-4 max-w-3xl text-5xl sm:text-7xl">{tour.name}</h1>
        </div>
      </section>

      <DepartureProvider departures={departures}>
      <div className="mx-auto grid max-w-[100rem] gap-12 px-6 pt-16 sm:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {/* image carousel — main photo + left-aligned thumbnail index */}
          <TourGallery images={gallery} alt={tour.name} />

          {/* Vì sao có hành trình này — lý do Perlunas thiết kế tour (placeholder,
              dựng từ thông tin tour; thay bằng field riêng khi có). */}
          <div className="mt-10 border-l-2 border-ink/15 pl-5 sm:pl-6">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              Vì sao có hành trình này
            </p>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-ink/75">
              {tour.name} ra đời từ mong muốn để bạn cảm nhận trọn vẹn {tour.region} theo
              cách thong thả và chân thật nhất. Chúng tôi chọn lọc từng điểm dừng, cân nhắc
              nhịp đi và khoảng nghỉ để mỗi ngày đều có một khoảng thở — không nhồi nhét,
              không vội vã, chỉ giữ lại những trải nghiệm thật sự đáng nhớ.
            </p>
          </div>

          {/* Thông tin chính về chuyến đi — các ô giấy note */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Thông tin chính về chuyến đi</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            {tripInfo.map(({ Icon, title, body }, i) => (
              <div
                key={title}
                className={clsx(
                  "paper-lines relative bg-paper-2 px-6 pb-[1.6rem] pt-[1.6rem] shadow-[0_8px_22px_-12px_rgba(26,24,19,0.45)] transition-transform duration-300 hover:rotate-0",
                  i % 2 === 0 ? "-rotate-1" : "rotate-1",
                )}
              >
                {/* miếng băng dính trên đỉnh */}
                <span className="absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-1 bg-ink/10 backdrop-blur-sm" />
                {/* mỗi khối cao bội số 1.6rem để chữ/icon đều nằm trên vạch */}
                <span className="flex h-[1.6rem] items-end">
                  <Icon className="h-6 w-6 text-ink/70" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-xl leading-[1.6rem] text-ink">{title}</h3>
                <p className="text-sm leading-[1.6rem] text-ink/70">{body}</p>
              </div>
            ))}
          </div>

          {/* Lịch khởi hành — chia theo tháng, bấm để xem lịch của tháng đó */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Lịch khởi hành</h2>
          <p className="mt-2 text-sm text-mute">
            Chọn tháng để xem các ngày khởi hành, mã tour, giá và chuẩn lưu trú.
          </p>
          <div className="mt-6">
            <DeparturePicker departures={departures} />
          </div>

          {/* Điểm nổi bật trong tour — 1 bảng lớn, có Xem thêm/Thu gọn góc phải dưới */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Điểm nổi bật trong tour</h2>
          <div className="mt-5">
            <HighlightsPanel groups={highlightGroups} />
          </div>

          {/* Lịch trình chi tiết — accordion từng ngày, mở 1 ngày tại 1 thời điểm */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Lịch trình chi tiết</h2>
          <div className="mt-5">
            <Itinerary days={itinerary} />
          </div>

          {/* Thông tin quan trọng về tour — accordion giống Lịch trình chi tiết */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Thông tin quan trọng về tour</h2>
          <div className="mt-5">
            <InfoAccordion items={tourInfo} />
          </div>
        </div>

        {/* booking card */}
        <aside className="lg:col-span-5">
          <div className="border border-[var(--line)] bg-paper-2 p-8 lg:sticky lg:top-28">
            <DepartureSummary nights={tour.nights} />

            <QuickEnquiry
              tourName={tour.name}
              tourCode={tourCode}
              className="mt-7 flex w-full justify-center"
            />
            <p className="mt-5 text-center text-xs text-mute">
              <Link href="/tour-tron-goi" className="link-underline">Xem các hành trình khác</Link>
            </p>
          </div>
        </aside>
      </div>
      </DepartureProvider>

      {/* Tour khác — gợi ý các hành trình liên quan đang có */}
      {relatedTours.length > 0 && (
        <section className="mx-auto mt-20 max-w-[100rem] border-t border-[var(--line)] px-6 pt-14 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Tour khác</p>
              <h2 className="display mt-5 text-3xl text-ink sm:text-4xl">
                Gợi ý các hành trình khác
              </h2>
            </div>
            <Link
              href="/tour-tron-goi"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink"
            >
              <span className="link-underline">Xem tất cả tour</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTours.map((t) => (
              <Link key={t.slug} href={`/tour/${t.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden">
                  <SceneImage
                    seed={`perlunas-tour-${t.slug}`}
                    alt={t.name}
                    w={1000}
                    h={750}
                    className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                  {t.region} · {t.nights}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-ink">{t.name}</h3>
                <p className="mt-2 text-sm font-medium text-ink">{t.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Gợi ý lưu trú tại điểm đến của tour (đủ mọi loại hình) */}
      {stayProvinces.length > 0 && (
        <section className="mx-auto mt-20 max-w-[100rem] border-t border-[var(--line)] px-6 pt-14 sm:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">
              Gợi ý lưu trú
            </p>
            <h2 className="display mt-5 text-3xl text-ink sm:text-4xl">
              Ở lại trọn vẹn tại {stayNames}.
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-ink/70">
              Sau hành trình, chọn cho mình một chỗ nghỉ ưng ý — đủ mọi loại hình
              lưu trú — ngay tại {stayNames}.
            </p>
          </div>

          {suggestedHotels.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
              {suggestedHotels.map((h) => (
                <Link
                  key={h.slug}
                  href={`/khach-san/${h.slug}`}
                  className="group block"
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <SceneImage
                      seed={`perlunas-hotel-${h.slug}`}
                      alt={h.name}
                      w={800}
                      h={533}
                      className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-4 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                    {h.type} · {h.city}
                  </p>
                  <h3 className="mt-1.5 font-serif text-xl text-ink">{h.name}</h3>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {stayProvinces.map((p) => (
              <Link
                key={p.slug}
                href={`/khach-san?noi-den=${p.slug}`}
                className="btn-ink inline-flex items-center gap-2 rounded-[3px] px-7 py-3.5 text-sm font-medium"
              >
                Khách sạn ở {p.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
