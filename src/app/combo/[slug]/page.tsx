import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Users,
  BedDouble,
  Gift,
  Utensils,
  Bus,
} from "lucide-react";
import { COMBOS, PROVINCES } from "@/lib/catalog";
import { getCombo, getCombos, getComboTiers } from "@/lib/api";
import { SceneImage } from "@/components/site/SceneImage";
import { PearlIcon } from "@/components/site/PearlIcon";
import { TourGallery } from "@/components/site/TourGallery";
import { HighlightsPanel } from "@/components/site/HighlightsPanel";
import { Itinerary, type ItineraryDay } from "@/components/site/Itinerary";
import { InfoAccordion, type InfoItem } from "@/components/site/InfoAccordion";
import { RoomGallery } from "@/components/site/RoomGallery";
import { RoomDetail } from "@/components/site/RoomDetail";
import { HotelBooking } from "@/components/site/HotelBooking";

const slugByCity = Object.fromEntries(PROVINCES.map((p) => [p.name, p.slug]));

// The shared Footer reads live page content at request time, so this route can't
// be fully static — render it dynamically (keeps generateStaticParams for paths).
export const revalidate = 300;

export function generateStaticParams() {
  return COMBOS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const combo = await getCombo(slug);
  if (!combo) return { title: "Gói du lịch" };
  return {
    title: `${combo.tier.toUpperCase()} - ${combo.hotelName}`,
    description: `Gói ${combo.tier} tại ${combo.hotelName}, ${combo.city} — ${combo.nights} đêm, giá từ ${combo.price}.`,
  };
}

export default async function ComboDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [combo, all, tiers] = await Promise.all([
    getCombo(slug),
    getCombos(),
    getComboTiers(),
  ]);
  if (!combo) notFound();

  const tier = tiers.find((t) => t.name === combo.tier);
  const provinceSlug = slugByCity[combo.city] ?? "";
  // Other combos at the same hotel (often different tier / nights / price).
  const related = all.filter(
    (c) => c.hotelName === combo.hotelName && c.slug !== combo.slug,
  );

  // Carousel images: the destination + a series of variants so there's a good
  // strip of thumbnails (SceneImage resolves any seed, stable per seed).
  const gallery = Array.from(
    new Set([
      `perlunas-place-${provinceSlug}`,
      `perlunas-combo-${combo.slug}`,
      ...Array.from({ length: 8 }, (_, i) => `perlunas-place-${provinceSlug}-${i + 2}`),
    ]),
  ).slice(0, 10);

  const baseNum = parseInt(combo.price.replace(/\D/g, ""), 10) || 0;
  // API trả giá kèm đơn vị, vd "8.000.000đ/khách" → tách số và đơn vị để hiển
  // thị riêng (số to ở trên, "/ khách" nhỏ ở dưới); không hardcode đơn vị.
  const slashAt = combo.price.indexOf("/");
  const priceAmount = slashAt === -1 ? combo.price : combo.price.slice(0, slashAt).trim();
  const priceUnit =
    slashAt === -1 ? "" : combo.price.slice(slashAt).replace(/^\/\s*/, "/ ").trim();
  // Per-night reference price for the room cards (combo price is total / khách).
  const nightly =
    combo.nights > 0 ? Math.round(baseNum / combo.nights / 100000) * 100000 || baseNum : baseNum;

  // Mã gói ổn định theo slug.
  const codePrefix =
    combo.slug
      .split("-")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 3) || "PL";
  const comboCode = `${codePrefix}${String(
    Array.from(combo.slug).reduce((a, c) => (a * 33 + c.charCodeAt(0)) % 1000000, 7),
  ).padStart(6, "0")}`;

  // Các hạng phòng của khách sạn (kiểu Agoda) — như trang chi tiết khách sạn.
  const roomTypes = [
    {
      name: "Standard",
      size: "24 m²",
      guests: 2,
      beds: "1 giường đôi hoặc 2 giường đơn",
      amenities: ["Wifi miễn phí", "Điều hòa", "TV màn hình phẳng", "Minibar"],
      price: nightly,
      desc: "Phòng tiêu chuẩn ấm cúng với đầy đủ tiện nghi cơ bản cho 2 khách — lựa chọn hợp lý cho một kỳ nghỉ gọn nhẹ và thoải mái.",
    },
    {
      name: "Deluxe",
      size: "32 m²",
      guests: 2,
      beds: "1 giường đôi lớn",
      amenities: ["Ban công riêng", "Bồn tắm", "Wifi miễn phí", "Bàn làm việc"],
      price: nightly + 600000,
      desc: "Rộng rãi hơn với ban công riêng và góc thư giãn, phù hợp cho cặp đôi hoặc khách công tác muốn thêm không gian.",
    },
    {
      name: "Suite",
      size: "48 m²",
      guests: 3,
      beds: "1 giường King + sofa",
      amenities: ["Phòng khách riêng", "View đẹp", "Bồn tắm nằm", "Đưa đón sân bay"],
      price: nightly + 1500000,
      desc: "Hạng phòng cao cấp nhất với phòng khách riêng và tầm nhìn đẹp, lý tưởng cho gia đình hoặc một kỳ nghỉ thật đặc biệt.",
    },
  ];
  // Mỗi combo gắn với 1 hạng phòng cố định theo chuẩn ngọc trai.
  const roomByTier: Record<string, number> = { Akoya: 0, Tahiti: 1, "South Sea": 2 };
  const fixedRoom = roomTypes[roomByTier[combo.tier] ?? 0];
  const roomPhotos = (i: number) =>
    [`perlunas-combo-${combo.slug}-room-${i}`, ...["b", "c", "d"].map((s) => `perlunas-combo-${combo.slug}-room-${i}-${s}`)];

  // "Thông tin chính về combo" — các ô giấy note (ref: trang tour trọn gói).
  const tripInfo = [
    {
      Icon: BedDouble,
      title: "Lưu trú",
      body: `${combo.stayType} ${combo.hotelName} tại ${combo.city}, nghỉ ${combo.nights} đêm theo chuẩn ${combo.tier}.`,
    },
    {
      Icon: Gift,
      title: "Ưu đãi gói",
      body: `Gói ${combo.tier} đã gồm những dịch vụ quan trọng nhất — xem chi tiết ở mục “Gói gồm có”.`,
    },
    {
      Icon: Utensils,
      title: "Ăn uống",
      body: "Ăn sáng mỗi ngày và các bữa theo tiêu chuẩn gói, thực đơn đa dạng cùng đặc sản địa phương.",
    },
    {
      Icon: Bus,
      title: "Di chuyển",
      body: "Đưa đón và di chuyển theo chương trình của gói, thuận tiện trong suốt kỳ nghỉ.",
    },
  ];


  // Lịch trình gợi ý — ngày 1 nhận phòng, ngày cuối trả phòng.
  const daysCount = combo.nights + 1;
  const cityUpper = combo.city.toUpperCase();
  const itinerary: ItineraryDay[] = Array.from({ length: daysCount }, (_, idx) => {
    const day = idx + 1;
    let body: string;
    if (day === 1) {
      body = `Quý khách di chuyển đến ${combo.city}, làm thủ tục nhận phòng tại ${combo.hotelName}. Tự do nghỉ ngơi, tận hưởng tiện ích của ${combo.stayType.toLowerCase()} và dùng bữa theo tiêu chuẩn gói.`;
    } else if (day === daysCount) {
      body = `Tự do ăn sáng, thư giãn và mua sắm đặc sản làm quà. Quý khách làm thủ tục trả phòng, kết thúc kỳ nghỉ. Hẹn gặp lại quý khách.`;
    } else {
      body = `Tự do tận hưởng ${combo.hotelName} hoặc khám phá ${combo.city} theo sở thích. Perlunas sẵn sàng gợi ý điểm tham quan, ẩm thực và trải nghiệm địa phương.`;
    }
    return {
      title: `NGÀY ${day}: ${day === 1 ? `ĐẾN ${cityUpper}` : day === daysCount ? `${cityUpper} - TRẢ PHÒNG` : `TỰ DO TẠI ${cityUpper}`}`,
      meals: day === 1 ? "Ăn theo tiêu chuẩn gói" : "Ăn sáng tại khách sạn",
      body,
    };
  });

  // "Thông tin quan trọng về combo" — accordion (nội dung mẫu chuẩn ngành).
  const comboInfo: InfoItem[] = [
    {
      title: "Giá gói bao gồm",
      blocks: [
        {
          lines: tier?.includes ?? [
            "Phòng nghỉ tại khách sạn theo tiêu chuẩn gói.",
            "Ăn sáng mỗi ngày.",
            "Các dịch vụ và tiện ích theo chương trình.",
          ],
        },
      ],
    },
    {
      title: "Giá gói chưa bao gồm",
      blocks: [
        {
          lines: [
            "Vé máy bay/di chuyển đến điểm đến (nếu không nêu trong gói).",
            "Chi phí cá nhân, giặt ủi, điện thoại, đồ uống ngoài chương trình.",
            "Các bữa ăn và dịch vụ không được liệt kê trong gói.",
            "Phụ thu phòng nâng hạng, ngày lễ, Tết và cao điểm.",
            "Thuế VAT và hóa đơn đỏ (nếu khách yêu cầu).",
          ],
        },
      ],
    },
    {
      title: "Giá trẻ em",
      blocks: [
        {
          lines: [
            "Trẻ dưới 5 tuổi: miễn phí, ngủ chung giường với bố mẹ; 2 người lớn kèm tối đa 1 trẻ.",
            "Trẻ 5 - dưới 12 tuổi: phụ thu suất ăn/giường phụ theo quy định của khách sạn.",
            "Trẻ từ 12 tuổi trở lên: tính tiêu chuẩn như người lớn.",
          ],
        },
      ],
    },
    {
      title: "Điều kiện đăng ký và thanh toán",
      blocks: [
        {
          lines: [
            "Đặt cọc 50% giá gói ngay khi đăng ký để giữ chỗ.",
            "Thanh toán phần còn lại trước ngày nhận phòng tối thiểu 7 ngày.",
            "Cung cấp đầy đủ thông tin: họ tên, số điện thoại, email khi đăng ký.",
          ],
        },
      ],
    },
    {
      title: "Điều kiện đổi và huỷ",
      blocks: [
        {
          subtitle: "Ngày thường",
          lines: [
            "Huỷ trước ngày nhận phòng từ 15 ngày: phí 30% giá gói.",
            "Huỷ trước 7 - 14 ngày: phí 50% giá gói.",
            "Huỷ trong vòng 6 ngày hoặc không nhận phòng (no-show): phí 100% giá gói.",
          ],
        },
        {
          subtitle: "Ngày lễ, Tết",
          lines: [
            "Huỷ trước ngày nhận phòng từ 30 ngày: phí 50% giá gói.",
            "Huỷ trong vòng 29 ngày hoặc không nhận phòng (no-show): phí 100% giá gói.",
          ],
        },
      ],
    },
    {
      title: "Trường hợp bất khả kháng",
      blocks: [
        {
          lines: [
            "Trường hợp bất khả kháng (thiên tai, dịch bệnh, thời tiết xấu, chuyến bay delay/huỷ…), hai bên không chịu trách nhiệm bồi thường mà cùng thương lượng giải quyết hợp lý, đảm bảo quyền lợi tối đa cho khách.",
            "Perlunas có quyền điều chỉnh dịch vụ tương đương vì lý do khách quan, nhưng vẫn đảm bảo đầy đủ quyền lợi và tiêu chuẩn của gói.",
          ],
        },
      ],
    },
  ];

  // "Điểm nổi bật" — liệt kê theo nhóm trong một bảng lớn.
  const highlightGroups = [
    {
      title: "Điểm nhấn",
      intro:
        tier?.story ??
        `Kỳ nghỉ ${combo.nights} đêm tại ${combo.hotelName}, ${combo.city} theo chuẩn ${combo.tier}.`,
    },
    {
      title: "Du lịch Bền vững (ESG)",
      points: [
        {
          label: "Môi trường",
          text: `Tôn vinh cảnh quan và không gian nghỉ dưỡng đặc trưng của ${combo.city}.`,
        },
        {
          label: "Cộng đồng",
          text: `Kết nối cộng đồng địa phương qua ẩm thực, làng nghề và trải nghiệm bản địa tại ${combo.city}.`,
        },
      ],
    },
    {
      title: "Trải nghiệm Bản địa (LEI)",
      points: [
        {
          label: "Nghỉ dưỡng",
          text: `Tận hưởng trọn vẹn tiện ích của ${combo.hotelName}.`,
        },
        {
          label: "Khám phá",
          text: `Tự do khám phá những điểm đến và trải nghiệm chỉ có tại ${combo.city}.`,
        },
        {
          label: "Tinh hoa Ẩm thực",
          text: "Thưởng thức và tự do khám phá đặc sản địa phương.",
        },
      ],
    },
  ];

  return (
    <main className="pb-24">
      {/* hero */}
      <section className="relative flex min-h-[64vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <SceneImage seed={`perlunas-place-${provinceSlug}`} alt={combo.city} w={2000} h={1100} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
        </div>
        <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-12 text-paper sm:px-10">
          <div className="flex items-center gap-2.5">
            <PearlIcon tier={combo.tier} className="h-7 w-7" />
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/80">
              Gói {combo.tier} · {combo.nights} đêm
            </p>
          </div>
          <h1 className="display mt-4 max-w-3xl text-3xl sm:text-6xl">{combo.hotelName}</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-paper/75">
            {combo.stayType} · {combo.city}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[100rem] px-6 pt-8 sm:px-10">
        <Link
          href="/combo"
          className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tất cả gói
        </Link>
      </div>

      <div className="mx-auto grid max-w-[100rem] gap-12 px-6 pt-8 sm:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {/* image carousel — main photo + left-aligned thumbnail index */}
          <TourGallery images={gallery} alt={combo.hotelName} />

          {/* Thông tin chính về combo — các ô giấy note */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Thông tin chính về gói</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            {tripInfo.map(({ Icon, title, body }, i) => (
              <div
                key={title}
                className={clsx(
                  "paper-lines relative bg-paper-2 px-6 pb-[1.6rem] pt-[1.6rem] shadow-[0_8px_22px_-12px_rgba(26,24,19,0.45)] transition-transform duration-300 hover:rotate-0",
                  i % 2 === 0 ? "-rotate-1" : "rotate-1",
                )}
              >
                <span className="absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-1 bg-ink/10 backdrop-blur-sm" />
                <span className="flex h-[1.6rem] items-end">
                  <Icon className="h-6 w-6 text-ink/70" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-xl leading-[1.6rem] text-ink">{title}</h3>
                <p className="text-sm leading-[1.6rem] text-ink/70">{body}</p>
              </div>
            ))}
          </div>

          {/* Gói gồm có — dịch vụ theo chuẩn ngọc trai */}
          {tier && (
            <>
              <h2 className="mt-12 font-serif text-2xl text-ink">Gói gồm có</h2>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-mute">
                {tier.tagline}
              </p>
              <ul className="mt-5 max-w-2xl space-y-3">
                {tier.includes.map((it) => (
                  <li key={it} className="flex gap-3 text-ink/80">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-ink/50" />
                    <span className="leading-relaxed">{it}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mute">
                {tier.pearl}{" "}
                <Link href="/combo/phan-loai" className="link-underline text-ink">
                  Tìm hiểu ba dòng ngọc trai
                </Link>
              </p>
            </>
          )}

          {/* Điểm nổi bật — 1 bảng lớn, có Xem thêm/Thu gọn */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Điểm nổi bật</h2>
          <div className="mt-5">
            <HighlightsPanel groups={highlightGroups} />
          </div>

          {/* Lịch trình gợi ý — accordion từng ngày */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Lịch trình gợi ý</h2>
          <div className="mt-5">
            <Itinerary days={itinerary} />
          </div>

          <p className="mt-8 text-sm leading-relaxed text-mute">
            Lịch trình chi tiết theo ngày sẽ được Perlunas gửi và điều chỉnh theo
            số khách, ngày đi và sở thích của bạn.
          </p>

          {/* Thông tin quan trọng về combo — accordion */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Thông tin quan trọng về gói</h2>
          <div className="mt-5">
            <InfoAccordion items={comboInfo} />
          </div>

          {/* Phòng nghỉ trong gói — mỗi combo có 1 hạng phòng cố định */}
          <h2 className="mt-12 font-serif text-2xl text-ink">Phòng nghỉ trong gói</h2>
          <p className="mt-2 text-sm text-ink/65">
            Gói {combo.tier} đi kèm hạng phòng dưới đây. Bấm vào ảnh hoặc “Xem chi tiết” để
            xem thêm hình và tiện nghi.
          </p>
          <div className="mt-6">
            <div className="overflow-hidden border border-[var(--line)] bg-paper-2 sm:flex">
              <div className="h-48 sm:h-auto sm:w-64 sm:shrink-0">
                <RoomGallery
                  images={roomPhotos(0)}
                  alt={`${fixedRoom.name} — ${combo.hotelName}`}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-xl text-ink">{fixedRoom.name}</h3>
                <p className="mt-1.5 inline-flex items-center gap-3 text-sm text-mute">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" /> {fixedRoom.guests} khách
                  </span>
                  <span>· {fixedRoom.size}</span>
                  <span>· {fixedRoom.beds}</span>
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink/70">
                  {fixedRoom.amenities.map((a) => (
                    <li key={a} className="inline-flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 shrink-0 text-ink/45" />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-[var(--line-soft)] pt-4">
                  <RoomDetail
                    name={fixedRoom.name}
                    images={roomPhotos(0)}
                    alt={`${fixedRoom.name} — ${combo.hotelName}`}
                    guests={fixedRoom.guests}
                    size={fixedRoom.size}
                    beds={fixedRoom.beds}
                    amenities={fixedRoom.amenities}
                    desc={fixedRoom.desc}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* booking card */}
        <aside className="lg:col-span-5">
          <div className="border border-[var(--line)] bg-paper-2 p-8 lg:sticky lg:top-28">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-3">
                <dt className="text-mute">Mã gói</dt>
                <dd className="font-medium uppercase tracking-wide text-ink">{comboCode}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-3">
                <dt className="text-mute">Phân loại</dt>
                <dd className="inline-flex items-center gap-2 font-medium uppercase text-ink">
                  <PearlIcon tier={combo.tier} className="h-4 w-4" />
                  {combo.tier}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-3">
                <dt className="text-mute">Thời lượng</dt>
                <dd className="font-medium uppercase text-ink">{combo.nights} đêm</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--line-soft)] pb-3">
                <dt className="text-mute">Nơi đến</dt>
                <dd className="font-medium text-ink">{combo.city}</dd>
              </div>
            </dl>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-mute">Giá từ</p>
              <p className="mt-1 font-serif text-3xl text-ink">{priceAmount}</p>
              {priceUnit && <p className="mt-1 text-sm text-mute">{priceUnit}</p>}
            </div>

            <HotelBooking
              hotelName={combo.hotelName}
              hotelCity={combo.city}
              roomTypes={[fixedRoom.name]}
              lockRoom
              className="mt-7 flex w-full justify-center"
            />
            <p className="mt-5 text-center text-xs text-mute">
              <Link href="/combo" className="link-underline">Xem các gói khác</Link>
            </p>
          </div>
        </aside>
      </div>

      {/* Gói khác tại khách sạn này */}
      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-[100rem] border-t border-[var(--line)] px-6 pt-14 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Gói khác</p>
              <h2 className="display mt-5 text-3xl text-ink sm:text-4xl">
                Gói khác tại {combo.hotelName}
              </h2>
            </div>
            <Link
              href="/combo"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink"
            >
              <span className="link-underline">Xem tất cả gói</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <Link key={c.slug} href={`/combo/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SceneImage
                    seed={`perlunas-place-${slugByCity[c.city] ?? ""}`}
                    alt={c.hotelName}
                    w={1000}
                    h={750}
                    className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute left-3 top-3">
                    <PearlIcon tier={c.tier} className="h-6 w-6" />
                  </div>
                </div>
                <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-mute">
                  {c.tier} · {c.nights} đêm
                </p>
                <h3 className="mt-2 font-serif text-2xl text-ink">{c.hotelName}</h3>
                <p className="mt-2 text-sm font-medium text-ink">Giá từ {c.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
