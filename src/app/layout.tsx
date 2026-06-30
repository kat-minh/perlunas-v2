import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ServiceWorkerRegister } from "@/components/providers/ServiceWorkerRegister";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

// Body: Be Vietnam Pro — readable, multi-weight, drawn for Vietnamese.
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-bevn",
  display: "swap",
});

// Chữ ký nhà sáng lập — dùng cho tên tác giả ở khối Triết lý.
const gastroline = localFont({
  src: "./fonts/GastrolineSignature.otf",
  variable: "--font-signature",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, thiết kế hành trình du lịch trong nước`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    title: `${site.name}, ${site.taglineVi}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f7f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${gastroline.variable}`}>
      <body>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
