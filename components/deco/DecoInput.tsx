import React from "react";

interface DecoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  romanNumeral?: string;
}

export function DecoInput({
  label,
  unit,
  romanNumeral,
  value,
  onChange,
  className = "",
  type = "number",
  placeholder = "0",
  ...props
}: DecoInputProps) {
  return (
    <div className={`relative flex flex-col group ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="flex items-center gap-2 text-xs font-marcellus uppercase tracking-widest text-[#D4AF37]/90 group-focus-within:text-[#F2E8C4] transition-colors">
          {romanNumeral && (
            <span className="text-[10px] text-[#888888] font-mono">[{romanNumeral}]</span>
          )}
          <span>{label}</span>
        </label>
        {unit && (
          <span className="text-[11px] text-[#888888] font-mono tracking-normal">
            {unit}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-12 bg-transparent border-0 border-b-2 border-[#D4AF37]/50 text-[#F2F0E4] px-2 py-1 text-base font-mono font-medium focus:outline-none focus:border-[#F2E8C4] focus:shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition-all duration-300 placeholder:text-[#555555]"
          {...props}
        />
        {/* Subtle decorative dot on active right */}
        <div className="absolute right-1 bottom-2 w-1 h-1 bg-[#D4AF37]/30 group-focus-within:bg-[#D4AF37] transition-colors" />
      </div>
    </div>
  );
}
