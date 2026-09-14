import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, Noto_Sans_Thai, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Display face — Latin headings. Plus Jakarta Sans has no Thai subset, so
// Noto Sans Thai is stacked behind every font stack to carry Thai glyphs.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Body face — Latin body copy and UI labels.
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ui",
  display: "swap",
});

// Thai face — supplies every Thai glyph the Latin faces lack.
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-thai",
  display: "swap",
});

// Numeric face — tabular alignment for the 11-stage damage matrix.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "เครื่องคำนวณดาเมจ Sword of Justice | ห้องทดลองวิเคราะห์ค่าพลัง",
  description:
    "เครื่องคำนวณดาเมจสำหรับ Sword of Justice พร้อมระบบบันทึกตัวละครและเปรียบเทียบค่าพลังอย่างแม่นยำและโปร่งใส",
  keywords: [
    "Sword of Justice",
    "เครื่องคำนวณดาเมจ",
    "ดาเมจรวม",
    "โจมตีธาตุทั้งหมด",
    "ข่มสำนัก",
    "ป้องกันสำนัก",
    "เจาะเกราะ",
    "โล่พลังชี่",
    "ทำลายโล่",
    "คริติคอล",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${plusJakarta.variable} ${dmSans.variable} ${notoSansThai.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-neu-base text-neu-fg font-ui min-h-screen flex flex-col selection:bg-neu-accent/25 selection:text-neu-fg">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
