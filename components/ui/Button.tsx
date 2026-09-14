import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  isLoading,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-ui font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris/60 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs rounded-button gap-1.5",
    md: "h-11 px-5 text-sm rounded-button gap-2",
    lg: "h-12 px-6 text-base rounded-button gap-2.5",
  };

  const variantStyles = {
    // Primary: Section 38: White background, Black text, 8px radius, strong contrast
    primary: "bg-pure text-void hover:bg-cloud active:bg-silver shadow-sm",
    secondary:
      "bg-graphite text-cloud hover:bg-steel hover:text-pure border border-steel/60 active:bg-steel/80",
    ghost: "bg-transparent text-cloud hover:bg-graphite/60 hover:text-pure",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300",
    accent: "bg-iris text-void font-semibold hover:bg-iris/90 active:bg-iris-deep text-pure",
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          กำลังดำเนินการ...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function GhostButton(props: ButtonProps) {
  return <Button variant="ghost" {...props} />;
}

export function PrimaryButton(props: ButtonProps) {
  return <Button variant="primary" {...props} />;
}
