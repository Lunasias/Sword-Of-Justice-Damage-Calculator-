import type { Metadata } from "next";
import { Noto_Sans_Thai, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Primary UI font — covers all Thai + Latin text beautifully
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

// Display serif — hero headline ONLY, never for body/nav
const lora = Lora({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "700"],
  variable: "--font-lora",
  display: "swap",
});

// Monospace — section stamps, data numbers
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
      className={`dark ${notoSansThai.variable} ${lora.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-near-black text-almost-white min-h-screen flex flex-col selection:bg-signal-violet/30 selection:text-almost-white">
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
