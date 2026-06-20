import type { Metadata, Viewport } from "next";
import { Cormorant, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ServiceWorkerRegister } from "@/components/providers/ServiceWorkerRegister";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

// Display: Cormorant, a refined high-contrast serif for the minimal editorial
// voice. Body: Be Vietnam Pro, drawn for Vietnamese so every dau sits right.
// Both ship a vietnamese subset.
const cormorant = Cormorant({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
  variable: "--font-bevn",
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
  themeColor: "#f4f2ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${beVietnam.variable}`}>
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
