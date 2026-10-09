import React from "react";

interface DecoCardProps {
  children: React.ReactNode;
  className?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  romanNumeral?: string;
  headerAction?: React.ReactNode;
  withCorners?: boolean;
  isElevated?: boolean;
}

export function DecoCard({
  children,
  className = "",
  headerTitle,
  headerSubtitle,
  romanNumeral,
  headerAction,
  withCorners = true,
  isElevated = false,
}: DecoCardProps) {
  return (
    <div
      className={`relative bg-[#141414] border border-[#D4AF37]/35 transition-all duration-500 hover:border-[#D4AF37]/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.18)] rounded-none ${
        isElevated ? "-translate-y-1 border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.15)]" : ""
      } ${className}`}
    >
      {/* Stepped corner brackets */}
      {withCorners && (
        <>
          <span className="art-deco-corner-tl" />
          <span className="art-deco-corner-tr" />
          <span className="art-deco-corner-bl" />
          <span className="art-deco-corner-br" />
        </>
      )}

      {/* Optional Card Header */}
      {headerTitle && (
        <div className="px-6 py-5 border-b border-[#D4AF37]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {romanNumeral && (
              <div className="w-8 h-8 rotate-45 border border-[#D4AF37] flex items-center justify-center bg-[#0A0A0A] shrink-0">
                <span className="-rotate-45 font-marcellus text-xs font-bold text-[#D4AF37]">
                  {romanNumeral}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-marcellus text-lg md:text-xl font-semibold tracking-widest text-[#D4AF37] uppercase">
                {headerTitle}
              </h3>
              {headerSubtitle && (
                <p className="text-xs text-[#888888] font-body mt-0.5">
                  {headerSubtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">{children}</div>
    </div>
  );
}
