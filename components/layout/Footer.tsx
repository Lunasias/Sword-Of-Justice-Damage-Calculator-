import React from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ash/20 bg-near-black py-12 mt-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5 text-almost-white font-ui text-sm font-semibold tracking-tight mb-3">
            <div className="w-6 h-6 rounded-md bg-graphite/60 border border-ash/30 flex items-center justify-center text-signal-violet">
              <Calculator size={14} />
            </div>
            <span>
              Sword<span className="text-signal-violet"> of Justice</span>
            </span>
          </div>
          <p className="text-xs font-ui text-ash leading-relaxed">
            แพลตฟอร์มคำนวณดาเมจและวิเคราะห์ค่าพลังเชิงลึกสำหรับ Sword of Justice
            พร้อมระบบบันทึกบิลด์ตัวละครและแชร์สู่ชุมชนผู้เล่น
          </p>
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-ui">
          <div>
            <h5 className="text-pure font-medium mb-3">เครื่องมือ</h5>
            <ul className="space-y-2 text-ash">
              <li>
                <Link href="/calculator" className="hover:text-cloud transition-colors">
                  เครื่องคำนวณดาเมจ
                </Link>
              </li>
              <li>
                <Link href="/characters/public" className="hover:text-cloud transition-colors">
                  ตัวละครสาธารณะ
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-cloud transition-colors">
                  คู่มือสูตรคำนวณ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-pure font-medium mb-3">คำศัพท์มาตรฐาน</h5>
            <ul className="space-y-2 text-ash">
              <li>ดาเมจรวม / โจมตีธาตุทั้งหมด</li>
              <li>ข่มสำนัก / ป้องกันสำนัก</li>
              <li>เจาะเกราะ / ทำลายโล่</li>
              <li>โล่พลังชี่ / ต้านทานธาตุ</li>
            </ul>
          </div>

          <div>
            <h5 className="text-pure font-medium mb-3">บัญชี</h5>
            <ul className="space-y-2 text-ash">
              <li>
                <Link href="/login" className="hover:text-cloud transition-colors">
                  เข้าสู่ระบบ
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cloud transition-colors">
                  สมัครสมาชิก
                </Link>
              </li>
              <li>
                <Link href="/characters" className="hover:text-cloud transition-colors">
                  ตัวละครของฉัน
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-steel/20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-fog gap-4">
        <span>&copy; {new Date().getFullYear()} เครื่องคำนวณดาเมจ Sword of Justice. สงวนลิขสิทธิ์ทั้งหมด.</span>
        <span>ระบบวิเคราะห์และคำนวณทางสถิติ</span>
      </div>
    </footer>
  );
}
