import React from "react";
import { DecoDivider } from "./DecoDivider";

export function DecoFooter() {
  return (
    <footer className="relative w-full border-t border-[#D4AF37]/30 bg-[#0A0A0A] py-12 px-4 sm:px-6 mt-20">
      <div className="mx-auto max-w-content text-center space-y-6">
        <DecoDivider />

        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="font-marcellus text-sm tracking-widest text-[#D4AF37]">
            SWORD OF JUSTICE • 逆水寒 ARCHITECTURAL DAMAGE ENGINE
          </p>
          <p className="text-xs text-[#888888] font-body max-w-2xl leading-relaxed">
            ระบบทำงานบนหน่วยความจำของเบราว์เซอร์โดยตรง (Pure Client-Side Stateless)
            ไม่มีการเก็บภาพหรือบันทึกข้อมูลสเตตัสลงฐานข้อมูลใดๆ เมื่อรีเฟรชหน้าเว็บข้อมูลจะถูกรีเซ็ตใหม่ทั้งหมด
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 text-[11px] font-marcellus tracking-widest text-[#888888]">
          <span>MATHEMATICAL PRECISION</span>
          <span className="w-1 h-1 rotate-45 bg-[#D4AF37]" />
          <span>ZERO STORAGE</span>
          <span className="w-1 h-1 rotate-45 bg-[#D4AF37]" />
          <span>INSTANT ANALYSIS</span>
        </div>
      </div>
    </footer>
  );
}
