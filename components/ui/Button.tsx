import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

/**
 * Buttons are moulded from the same surface as the page.
 *
 * Depth ladder:
 *   resting → extruded   · hover → lifted + 1px lift   · active → 1px press + inset
 * The press is a real transform so the interaction reads as physical even
 * before the shadow transition finishes.
 */
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
    "inline-flex items-center justify-center font-ui font-medium transition-all duration-300 ease-out focus-neu disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-neu-extruded disabled:active:translate-y-0";

  // Touch targets stay >= 44px tall at md and lg; sm is used inside dense
  // desktop toolbars where the pointer, not a fingertip, is the input.
  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs rounded-xl gap-1.5",
    md: "h-11 px-5 text-sm rounded-2xl gap-2",
    lg: "h-12 px-6 text-base rounded-2xl gap-2.5",
  };

  const variantStyles = {
    // Primary: the one place the accent colour appears at full strength.
    // Its inset uses darkened/whitened shadow tones — the page's white
    // highlight would read as glare on violet.
    primary:
      "bg-gradient-to-br from-neu-accent-light to-neu-accent text-white shadow-neu-extruded hover:-translate-y-px hover:shadow-neu-lifted active:translate-y-0.5 active:bg-neu-accent active:shadow-neu-pressed-accent",
    // Matches the page surface exactly so it reads as extruded, not placed.
    secondary:
      "bg-neu-base text-neu-fg shadow-neu-extruded hover:-translate-y-px hover:shadow-neu-lifted active:translate-y-0.5 active:shadow-neu-inset-sm",
    // Ghost: no depth at rest, so it can sit inside dense toolbars.
    ghost:
      "bg-neu-base text-neu-muted shadow-none hover:text-neu-fg hover:shadow-neu-sm active:translate-y-0.5 active:shadow-neu-inset-sm",
    danger:
      "bg-gradient-to-br from-[#F2686C] to-neu-danger text-white shadow-neu-extruded hover:-translate-y-px hover:shadow-neu-lifted active:translate-y-0.5 active:shadow-neu-pressed-accent",
    // Alias of primary, kept for callers that name the accent explicitly.
    accent:
      "bg-gradient-to-br from-neu-accent-light to-neu-accent text-white shadow-neu-extruded hover:-translate-y-px hover:shadow-neu-lifted active:translate-y-0.5 active:shadow-neu-pressed-accent",
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
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current/30 border-t-current"
            aria-hidden="true"
          />
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
