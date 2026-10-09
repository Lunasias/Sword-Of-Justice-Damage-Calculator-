import React from "react";

interface DecoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost" | "midnight";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function DecoButton({
  variant = "outline",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}: DecoButtonProps) {
  const sizeClasses = {
    sm: "h-10 px-4 text-xs tracking-widest",
    md: "h-12 px-6 text-sm tracking-widest",
    lg: "h-14 px-8 text-base tracking-widest",
  }[size];

  const variantClasses = {
    solid:
      "bg-[#D4AF37] text-[#0A0A0A] font-semibold border-2 border-[#D4AF37] hover:bg-[#F2E8C4] hover:border-[#F2E8C4] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]",
    outline:
      "bg-transparent text-[#D4AF37] font-medium border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] shadow-[0_0_12px_rgba(212,175,55,0.15)] hover:shadow-[0_0_22px_rgba(212,175,55,0.5)]",
    ghost:
      "bg-transparent text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#1E3D59]/40 hover:text-[#F2E8C4]",
    midnight:
      "bg-[#1E3D59] text-[#F2F0E4] border-2 border-[#D4AF37] hover:bg-[#1E3D59]/80 hover:text-white shadow-[0_0_15px_rgba(30,61,89,0.4)]",
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2.5 font-marcellus uppercase transition-all duration-300 rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {/* Corner notches/brackets on high-emphasis buttons */}
      {variant === "solid" && (
        <>
          <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-[#F2E8C4]" />
          <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-[#F2E8C4]" />
        </>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
