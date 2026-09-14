import React from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-neu-base pb-12 pt-16">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        {/* Inset groove instead of a top border. */}
        <div className="mb-12 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />

        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <div className="mb-4 flex items-center gap-2.5 font-ui text-sm font-bold tracking-tight text-neu-fg">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-neu-base text-neu-accent shadow-neu-inset-deep">
                <Calculator size={15} />
              </span>
              <span>
                Sword<span className="text-neu-accent"> of Justice</span>
              </span>
            </div>
            <p className="text-xs font-ui leading-relaxed text-neu-muted">
              แพลตฟอร์มคำนวณดาเมจและวิเคราะห์ค่าพลังเชิงลึกสำหรับ Sword of Justice
              พร้อมระบบบันทึกบิลด์ตัวละครและแชร์สู่ชุมชนผู้เล่น
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-xs font-ui sm:grid-cols-3">
            <div>
              <h5 className="mb-4 font-display text-sm font-bold text-neu-fg">เครื่องมือ</h5>
              <ul className="space-y-3 text-neu-muted">
                <li>
                  <Link
                    href="/calculator"
                    className="rounded-md transition-colors duration-300 hover:text-neu-accent focus-neu"
                  >
                    เครื่องคำนวณดาเมจ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/characters/public"
                    className="rounded-md transition-colors duration-300 hover:text-neu-accent focus-neu"
                  >
                    ตัวละครสาธารณะ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guide"
                    className="rounded-md transition-colors duration-300 hover:text-neu-accent focus-neu"
                  >
                    คู่มือสูตรคำนวณ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="mb-4 font-display text-sm font-bold text-neu-fg">คำศัพท์มาตรฐาน</h5>
              <ul className="space-y-3 text-neu-muted">
                <li>ดาเมจรวม / โจมตีธาตุทั้งหมด</li>
                <li>ข่มสำนัก / ป้องกันสำนัก</li>
                <li>เจาะเกราะ / ทำลายโล่</li>
                <li>โล่พลังชี่ / ต้านทานธาตุ</li>
              </ul>
            </div>

            <div>
              <h5 className="mb-4 font-display text-sm font-bold text-neu-fg">บัญชี</h5>
              <ul className="space-y-3 text-neu-muted">
                <li>
                  <Link
                    href="/login"
                    className="rounded-md transition-colors duration-300 hover:text-neu-accent focus-neu"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="rounded-md transition-colors duration-300 hover:text-neu-accent focus-neu"
                  >
                    สมัครสมาชิก
                  </Link>
                </li>
                <li>
                  <Link
                    href="/characters"
                    className="rounded-md transition-colors duration-300 hover:text-neu-accent focus-neu"
                  >
                    ตัวละครของฉัน
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-card bg-neu-base px-5 py-4 font-numeric text-[11px] text-neu-muted shadow-neu-inset-sm sm:flex-row">
          <span>
            &copy; {new Date().getFullYear()} เครื่องคำนวณดาเมจ Sword of Justice. สงวนลิขสิทธิ์ทั้งหมด.
          </span>
          <span>ระบบวิเคราะห์และคำนวณทางสถิติ</span>
        </div>
      </div>
    </footer>
  );
}
