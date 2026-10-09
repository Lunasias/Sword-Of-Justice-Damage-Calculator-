import React from "react";
import { RotateCcw, Swords } from "lucide-react";
import { DecoButton } from "./DecoButton";

interface DecoHeaderProps {
  onResetAll?: () => void;
}

export function DecoHeader({ onResetAll }: DecoHeaderProps) {
  return (
    <header className="relative w-full border-b border-[#D4AF37]/30 bg-[#0A0A0A]/95 backdrop-blur-md z-40">
      {/* Top micro gold trim */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="mx-auto max-w-content px-4 py-4 sm:px-6 flex items-center justify-between">
        {/* Left Deco Accent */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 border border-[#D4AF37]/80" />
          <div className="w-12 h-px bg-[#D4AF37]/40" />
          <span className="font-marcellus text-[10px] tracking-widest text-[#888888]">
            EST. 1925
          </span>
        </div>

        {/* Center Grand Title & Emblem */}
        <div className="flex items-center gap-3.5 mx-auto sm:mx-0">
          <div className="relative w-10 h-10 rotate-45 border-2 border-[#D4AF37] bg-[#141414] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <div className="w-8 h-8 -rotate-45 flex items-center justify-center text-[#D4AF37]">
              <Swords size={20} />
            </div>
          </div>
          <div>
            <h1 className="font-marcellus text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#D4AF37]">
              SWORD OF JUSTICE
            </h1>
            <p className="text-[10px] sm:text-xs font-marcellus uppercase tracking-[0.25em] text-[#F2F0E4]/70">
              STAT COMPARISON ENGINE • เครื่องเปรียบเทียบสเตตัส
            </p>
          </div>
        </div>

        {/* Right Action: Clean Reset */}
        <div className="flex items-center gap-3">
          {onResetAll && (
            <DecoButton
              variant="ghost"
              size="sm"
              onClick={onResetAll}
              icon={<RotateCcw size={14} />}
              title="ล้างข้อมูลทั้งสองฝั่งเพื่อเริ่มใหม่"
            >
              รีเซ็ต
            </DecoButton>
          )}
        </div>
      </div>
    </header>
  );
}
