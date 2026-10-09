import React from "react";

interface DecoDividerProps {
  className?: string;
  withDiamond?: boolean;
  title?: string;
}

export function DecoDivider({
  className = "",
  withDiamond = true,
  title,
}: DecoDividerProps) {
  return (
    <div className={`relative flex items-center justify-center my-6 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
      {title ? (
        <div className="mx-4 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
          <span className="font-marcellus text-xs uppercase tracking-widest text-[#D4AF37]">
            {title}
          </span>
          <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
        </div>
      ) : withDiamond ? (
        <div className="mx-3 flex items-center gap-1.5">
          <div className="w-1 h-1 rotate-45 bg-[#D4AF37]/60" />
          <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37] bg-[#0A0A0A]" />
          <div className="w-1 h-1 rotate-45 bg-[#D4AF37]/60" />
        </div>
      ) : null}
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
    </div>
  );
}
