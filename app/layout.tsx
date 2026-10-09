import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWORD OF JUSTICE • เครื่องเปรียบเทียบสเตตัส (STAT COMPARATOR)",
  description:
    "เครื่องเปรียบเทียบสเตตัสตัวละคร Sword of Justice (逆水寒) วิเคราะห์และคำนวณเปรียบเทียบดาเมจ 2 บิลด์จากภาพสเตตัส พร้อมระบุสาเหตุเชิงลึกว่าชุดไหนแรงกว่าและเพราะอะไร ไร้การบันทึกข้อมูล",
  keywords: [
    "Sword of Justice",
    "逆水寒",
    "เครื่องเปรียบเทียบสเตตัส",
    "ดาเมจรวม",
    "เจาะเกราะ",
    "โจมตีธาตุ",
    "คริติคอล",
    "Damage Calculator",
    "Stat Comparator",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,300..700;1,300..700&family=Marcellus&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0A0A0A] text-[#F2F0E4] min-h-screen antialiased selection:bg-[#D4AF37]/30 selection:text-[#FFF5C0]">
        {children}
      </body>
    </html>
  );
}
