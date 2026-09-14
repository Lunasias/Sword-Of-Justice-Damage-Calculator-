import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "เครื่องคำนวณดาเมจ 逆水寒手游 | ห้องทดลองวิเคราะห์ค่าพลัง",
  description:
    "เครื่องคำนวณดาเมจสำหรับ 逆水寒手游 พร้อมระบบบันทึกตัวละครและเปรียบเทียบค่าพลังอย่างแม่นยำและโปร่งใส",
  keywords: [
    "逆水寒手游",
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
    <html lang="th" className="dark">
      <body className="bg-obsidian text-cloud min-h-screen flex flex-col selection:bg-iris/30 selection:text-pure">
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
