import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chính sách & Điều khoản",
  description:
    "Chính sách đặt dịch vụ, thanh toán, hoàn hủy, bảo mật thông tin và điều khoản sử dụng dịch vụ của Perlunas.",
};

// Nội dung chính sách — mẫu ban đầu, cập nhật lại theo quy định thực tế của công ty.
const SECTIONS = [
  {
    title: "1. Chính sách đặt dịch vụ & thanh toán",
    items: [
      "Khách hàng đặt cọc trước để giữ chỗ; phần còn lại thanh toán trước ngày khởi hành theo thỏa thuận trong hợp đồng/xác nhận dịch vụ.",
      "Các hình thức thanh toán: chuyển khoản ngân hàng, tiền mặt tại văn phòng hoặc các kênh thanh toán được Perlunas hỗ trợ.",
      "Mọi khoản phí, thuế và dịch vụ kèm theo sẽ được thông báo rõ ràng trước khi xác nhận đặt chỗ.",
    ],
  },
  {
    title: "2. Chính sách hoàn & hủy",
    items: [
      "Yêu cầu hủy/đổi lịch cần được gửi bằng văn bản (email/Zalo) tới Perlunas.",
      "Mức phí hoàn/hủy phụ thuộc vào thời điểm thông báo và quy định của nhà cung cấp dịch vụ (hãng bay, khách sạn, đối tác tour).",
      "Trường hợp bất khả kháng (thiên tai, dịch bệnh…) sẽ được xử lý theo thỏa thuận và quy định của các bên liên quan.",
    ],
  },
  {
    title: "3. Chính sách bảo mật thông tin",
    items: [
      "Perlunas thu thập thông tin khách hàng chỉ nhằm phục vụ việc tư vấn, đặt và cung cấp dịch vụ.",
      "Thông tin cá nhân được bảo mật, không chia sẻ cho bên thứ ba ngoài mục đích thực hiện dịch vụ hoặc theo yêu cầu của pháp luật.",
    ],
  },
  {
    title: "4. Trách nhiệm & điều khoản chung",
    items: [
      "Perlunas cam kết cung cấp dịch vụ đúng như mô tả đã xác nhận với khách hàng.",
      "Khách hàng có trách nhiệm cung cấp thông tin chính xác và tuân thủ các quy định của điểm đến, nhà cung cấp dịch vụ.",
      "Mọi khiếu nại được tiếp nhận và xử lý qua hotline hoặc email chính thức của công ty.",
    ],
  },
];

export default function ChinhSachPage() {
  return (
    <main className="pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Pháp lý</p>
          <h1 className="display mt-6 text-3xl leading-[1.25] text-ink sm:text-5xl">
            Chính sách &amp; Điều khoản
          </h1>
          <p className="mt-5 text-pretty leading-relaxed text-ink/70">
            Các chính sách dưới đây áp dụng cho dịch vụ do {site.legalName} cung cấp. Vui lòng đọc kỹ
            trước khi sử dụng dịch vụ.
          </p>
        </header>

        <div className="mt-14 space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.title} className="border-t border-[var(--line)] pt-8">
              <h2 className="font-serif text-xl text-ink sm:text-2xl">{s.title}</h2>
              <ul className="mt-4 space-y-3">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-3 text-pretty leading-relaxed text-ink/75">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-[var(--line)] pt-8 text-sm text-ink/60">
          <p>
            Mọi thắc mắc về chính sách, vui lòng liên hệ{" "}
            <a href={`mailto:${site.email}`} className="text-ink underline-offset-2 hover:underline">
              {site.email}
            </a>{" "}
            hoặc hotline{" "}
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="text-ink underline-offset-2 hover:underline"
            >
              {site.phone}
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
