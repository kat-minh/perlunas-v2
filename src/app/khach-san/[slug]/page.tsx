import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Users,
  Wifi,
  Waves,
  Coffee,
  Car,
  Utensils,
  Clock,
  Wind,
  Dumbbell,
} from "lucide-react";
import { HOTELS, PROVINCES } from "@/lib/catalog";
import { getHotel } from "@/lib/api";
import { HotelGallery } from "@/components/site/HotelGallery";
import { RoomGallery } from "@/components/site/RoomGallery";
import { RoomDetail } from "@/components/site/RoomDetail";
import { HotelBooking } from "@/components/site/HotelBooking";

const citySlug = Object.fromEntries(PROVINCES.map((p) => [p.name, p.slug]));

export const revalidate = 300;

export function generateStaticParams() {
  return HOTELS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const h = await getHotel(slug);
  return h
    ? { title: `${h.name} — ${h.city}`, description: `${h.type} tại ${h.city}. Giá từ ${h.price}.` }
    : { title: "Khách sạn" };
}

const prose =
  "text-pretty leading-relaxed text-ink/75 " +
  "[&_h2]:display [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-ink " +
  "[&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-ink " +
  "[&_p]:mt-4 [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 " +
  "[&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-ink/30 [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_img]:mt-6 [&_img]:w-full";

const FACILITIES = [
  { Icon: Wifi, label: "Wifi miễn phí" },
  { Icon: Waves, label: "Hồ bơi" },
  { Icon: Coffee, label: "Bữa sáng" },
  { Icon: Car, label: "Bãi đỗ xe" },
  { Icon: Utensils, label: "Nhà hàng" },
  { Icon: Clock, label: "Lễ tân 24h" },
  { Icon: Wind, label: "Điều hòa" },
  { Icon: Dumbbell, label: "Phòng gym" },
];

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hotel = await getHotel(slug);
  if (!hotel) notFound();

  const provinceSlug = citySlug[hotel.city];

  const album = Array.from(
    new Set([
      hotel.cover?.trim() || `perlunas-hotel-${hotel.slug}`,
      ...Array.from({ length: 7 }, (_, i) => `perlunas-hotel-${hotel.slug}-${i + 2}`),
    ]),
  );

  const baseNum = parseInt(hotel.price.replace(/\D/g, ""), 10) || 0;
  const fmtVnd = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;

  const roomTypes = [
    {
      name: "Standard",
      size: "24 m²",
      guests: 2,
      beds: "1 giường đôi hoặc 2 giường đơn",
      amenities: ["Wifi miễn phí", "Điều hòa", "TV màn hình phẳng", "Minibar"],
      price: baseNum,
      desc: "Phòng tiêu chuẩn ấm cúng với đầy đủ tiện nghi cơ bản cho 2 khách — lựa chọn hợp lý cho một kỳ nghỉ gọn nhẹ và thoải mái.",
    },
    {
      name: "Deluxe",
      size: "32 m²",
      guests: 2,
      beds: "1 giường đôi lớn",
      amenities: ["Ban công riêng", "Bồn tắm", "Wifi miễn phí", "Bàn làm việc"],
      price: baseNum + 600000,
      desc: "Rộng rãi hơn với ban công riêng và góc thư giãn, phù hợp cho cặp đôi hoặc khách công tác muốn thêm không gian.",
    },
    {
      name: "Suite",
      size: "48 m²",
      guests: 3,
      beds: "1 giường King + sofa",
      amenities: ["Phòng khách riêng", "View đẹp", "Bồn tắm nằm", "Đưa đón sân bay"],
      price: baseNum + 1500000,
      desc: "Hạng phòng cao cấp nhất với phòng khách riêng và tầm nhìn đẹp, lý tưởng cho gia đình hoặc một kỳ nghỉ thật đặc biệt.",
    },
  ];
  const roomTypeNames = roomTypes.map((r) => r.name);

  // Vài tấm ảnh cho mỗi hạng phòng (mở lightbox khi bấm vào ảnh).
  const roomPhotos = (i: number) =>
    [`perlunas-hotel-${hotel.slug}-room-${i}`, ...["b", "c", "d"].map((s) => `perlunas-hotel-${hotel.slug}-room-${i}-${s}`)];

  // Đoạn giới thiệu bổ sung (evergreen) để phần mô tả đầy đặn hơn.
  const introExtra = [
    `Toạ lạc tại ${hotel.city}, ${hotel.name} là điểm dừng chân lý tưởng cho hành trình của bạn — nơi từng chi tiết được chăm chút để kỳ nghỉ trở nên trọn vẹn và đáng nhớ.`,
    "Không gian nghỉ dưỡng hài hoà giữa tiện nghi hiện đại và dịch vụ tận tâm: phòng nghỉ thoáng đãng, khu vực chung được thiết kế tinh tế, cùng đội ngũ luôn sẵn sàng hỗ trợ trong suốt thời gian lưu trú.",
    "Perlunas đồng hành cùng bạn từ khâu chọn hạng phòng, xác nhận mức giá tốt với đối tác cho đến lúc nhận phòng — để bạn chỉ việc tận hưởng kỳ nghỉ của mình.",
  ];

  const bookingSteps = [
    {
      title: "Xem loại phòng & tiện nghi",
      body: "Xem thông tin các hạng phòng và tiện nghi để chọn hạng phù hợp.",
    },
    {
      title: "Xem quy định độ tuổi",
      body: "Đọc kỹ quy định độ tuổi trẻ em, em bé để có giá phòng chính xác.",
    },
    {
      title: "Liên hệ hoặc điền form",
      body: "Liên hệ Hotline/Zalo/Messenger để kiểm tra phòng và đặt, hoặc điền bảng thông tin — Perlunas sẽ chủ động liên hệ xác nhận, check rate với đối tác và phản hồi.",
    },
  ];

  return (
    <main className="px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-[100rem]">
        <Link
          href="/khach-san"
          className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tất cả khách sạn
        </Link>

        {/* header: tên + loại + vị trí */}
        <div className="mt-5">
          <span className="border border-[var(--line)] px-2 py-0.5 text-[0.7rem] uppercase tracking-[0.15em] text-mute">
            {hotel.type}
          </span>
          <h1 className="display mt-3 text-3xl text-ink sm:text-5xl">{hotel.name}</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink/70">
            <MapPin className="h-4 w-4 text-ink/50" />
            {hotel.city}
          </p>
        </div>

        {/* gallery mosaic */}
        <div className="mt-6">
          <HotelGallery images={album} alt={hotel.name} />
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* main column */}
          <div className="lg:col-span-8">
            {/* tiện nghi nổi bật */}
            <section>
              <h2 className="font-serif text-xl text-ink">Tiện nghi nổi bật</h2>
              <ul className="mt-4 grid grid-cols-2 gap-y-3 sm:grid-cols-4">
                {FACILITIES.map(({ Icon, label }) => (
                  <li key={label} className="inline-flex items-center gap-2 text-sm text-ink/75">
                    <Icon className="h-4 w-4 shrink-0 text-ink/55" strokeWidth={1.6} />
                    {label}
                  </li>
                ))}
              </ul>
            </section>

            {/* giới thiệu */}
            <section className="mt-12 border-t border-[var(--line-soft)] pt-10">
              <h2 className="display text-2xl text-ink">Giới thiệu</h2>
              {hotel.desc && (
                <div className={`mt-4 ${prose}`} dangerouslySetInnerHTML={{ __html: hotel.desc }} />
              )}
              <div className="mt-4 space-y-4 text-pretty leading-relaxed text-ink/75">
                {introExtra.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            {/* các hạng phòng — kiểu Agoda */}
            <section className="mt-12 border-t border-[var(--line-soft)] pt-10">
              <h2 className="display text-2xl text-ink">Các hạng phòng</h2>
              <p className="mt-2 text-sm text-ink/65">
                Bấm vào ảnh để xem thêm hình của từng hạng phòng. Có thể đặt nhiều hạng trong cùng một
                yêu cầu ở nút “Đặt phòng”.
              </p>
              <div className="mt-6 space-y-5">
                {roomTypes.map((rt, i) => (
                  <div
                    key={rt.name}
                    className="overflow-hidden border border-[var(--line)] bg-paper-2 sm:flex"
                  >
                    <div className="h-48 sm:h-auto sm:w-64 sm:shrink-0">
                      <RoomGallery
                        images={roomPhotos(i)}
                        alt={`${rt.name} — ${hotel.name}`}
                        startDelay={i * 1200}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-xl text-ink">{rt.name}</h3>
                      <p className="mt-1.5 inline-flex items-center gap-3 text-sm text-mute">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-4 w-4" /> {rt.guests} khách
                        </span>
                        <span>· {rt.size}</span>
                        <span>· {rt.beds}</span>
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink/70">
                        {rt.amenities.map((a) => (
                          <li key={a} className="inline-flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 shrink-0 text-ink/45" />
                            {a}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-[var(--line-soft)] pt-4">
                        <p className="leading-tight">
                          <span className="block text-xs text-mute line-through">
                            {fmtVnd(rt.price + 500000)}
                          </span>
                          <span className="font-serif text-2xl text-ink">{fmtVnd(rt.price)}</span>
                          <span className="text-sm text-mute"> / đêm</span>
                        </p>
                        <RoomDetail
                          name={rt.name}
                          images={roomPhotos(i)}
                          alt={`${rt.name} — ${hotel.name}`}
                          guests={rt.guests}
                          size={rt.size}
                          beds={rt.beds}
                          amenities={rt.amenities}
                          price={fmtVnd(rt.price)}
                          priceCompare={fmtVnd(rt.price + 500000)}
                          desc={rt.desc}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* hướng dẫn đặt phòng */}
            <section className="mt-12 border-t border-[var(--line-soft)] pt-10">
              <h2 className="display text-2xl text-ink">Hướng dẫn cách đặt phòng</h2>
              <ol className="mt-6 space-y-4">
                {bookingSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-sm text-paper">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <p className="font-medium text-ink">{s.title}</p>
                      <p className="mt-1 text-pretty leading-relaxed text-ink/70">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* sticky booking widget */}
          <aside className="lg:col-span-4">
            <div className="border border-[var(--line)] bg-paper-2 p-7 lg:sticky lg:top-28">
              <div className="flex items-baseline gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-mute">Giá từ</p>
                <p className="font-serif text-3xl text-ink">{fmtVnd(baseNum)}</p>
                <p className="text-sm text-mute">/ đêm</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-mute">
                Giá tham khảo. Perlunas xác nhận mức giá chính xác theo hạng phòng và ngày ở.
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-[var(--line-soft)] pt-5 text-sm text-ink/75">
                {["Tư vấn & báo giá miễn phí", "Giữ phòng theo đúng ngày bạn cần", "Phản hồi nhanh qua Zalo / Hotline"].map(
                  (t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink/45" />
                      {t}
                    </li>
                  ),
                )}
              </ul>

              <HotelBooking
                hotelName={hotel.name}
                hotelCity={hotel.city}
                roomTypes={roomTypeNames}
                className="mt-6 flex w-full justify-center"
              />

              {provinceSlug && (
                <Link
                  href={`/combo?noi-den=${provinceSlug}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 text-sm text-ink"
                >
                  <span className="link-underline">Xem gói ở {hotel.city}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
