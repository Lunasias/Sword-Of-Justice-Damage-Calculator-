import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * raised  — extruded panel (default surface for content groups)
   * inset   — recessed well, for data readouts and grouped controls
   * flat    — no depth; use only when nesting inside another panel
   * feature — raised panel that lifts on hover
   */
  variant?: "raised" | "inset" | "flat" | "feature";
  padding?: "sm" | "md" | "lg" | "xl";
}

const paddingStyles = {
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
  xl: "p-8 md:p-12",
};

const variantStyles = {
  raised: "bg-neu-base shadow-neu-extruded",
  inset: "bg-neu-base shadow-neu-inset",
  flat: "bg-neu-base",
  feature: "bg-neu-base shadow-neu-extruded hover:-translate-y-1 hover:shadow-neu-lifted",
};

/**
 * Cards are the same surface as the page, raised by opposed shadows.
 * Never a border, never a different background colour.
 */
export function Card({
  children,
  variant = "raised",
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-card transition-all duration-300 ease-out",
          paddingStyles[padding],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * A carved well for icons. Nesting Extruded → Inset → content is what
 * produces the system's "drilled into the surface" signature.
 */
export function IconWell({
  children,
  size = "md",
  accent = false,
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  accent?: boolean;
  className?: string;
}) {
  const sizeStyles = {
    sm: "h-9 w-9 rounded-xl",
    md: "h-12 w-12 rounded-2xl",
    lg: "h-16 w-16 rounded-[20px]",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "flex shrink-0 items-center justify-center bg-neu-base shadow-neu-inset-deep transition-all duration-300 ease-out",
          sizeStyles[size],
          accent ? "text-neu-accent" : "text-neu-fg",
          className
        )
      )}
    >
      {children}
    </div>
  );
}

/**
 * Purely decorative concentric rings in alternating depth — abstract,
 * tactile background art. Purely ornamental, so it is hidden from
 * assistive tech and sits behind content.
 */
export function CircleDecoration({
  size = 240,
  className,
  float = false,
}: {
  size?: number;
  className?: string;
  float?: boolean;
}) {
  const mid = Math.round(size * 0.72);
  const inner = Math.round(size * 0.44);

  return (
    <div
      aria-hidden="true"
      className={twMerge(
        clsx(
          "pointer-events-none absolute rounded-full bg-neu-base",
          float && "animate-float",
          className
        )
      )}
      style={{ width: size, height: size }}
    >
      {/* Outer ring: extruded */}
      <div className="absolute inset-0 rounded-full shadow-neu-lifted" />
      {/* Middle ring: carved into the outer ring */}
      <div
        className="absolute rounded-full bg-neu-base shadow-neu-inset-deep transition-transform duration-500 ease-out"
        style={{
          width: mid,
          height: mid,
          left: (size - mid) / 2,
          top: (size - mid) / 2,
        }}
      />
      {/* Core: raised again, accent-tinted */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-neu-accent-light to-neu-accent shadow-neu-extruded"
        style={{
          width: inner,
          height: inner,
          left: (size - inner) / 2,
          top: (size - inner) / 2,
        }}
      />
    </div>
  );
}

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  category: string;
  title: string;
  description: string;
  accentColor?: "iris" | "cyan" | "orchid" | "periwinkle" | "paleIris" | "deepIris";
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Feature tile. Only the icon well carries chroma; the card itself stays
 * monochrome so the composition reads as one moulded object.
 */
export function FeatureCard({
  category,
  title,
  description,
  accentColor = "iris",
  icon,
  footer,
  className,
  ...props
}: FeatureCardProps) {
  const accentTextStyles = {
    iris: "text-neu-accent",
    cyan: "text-neu-teal",
    orchid: "text-neu-accent-light",
    periwinkle: "text-neu-accent-light",
    paleIris: "text-neu-accent-light",
    deepIris: "text-neu-accent-deep",
  };

  const accentBarStyles = {
    iris: "from-neu-accent to-neu-accent-light",
    cyan: "from-neu-teal to-neu-accent",
    orchid: "from-neu-accent-light to-neu-accent",
    periwinkle: "from-neu-accent-light to-neu-teal",
    paleIris: "from-neu-accent-light to-neu-accent-light",
    deepIris: "from-neu-accent-deep to-neu-accent",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "group relative flex flex-col justify-between overflow-hidden rounded-card bg-neu-base p-8 shadow-neu-extruded transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-neu-lifted",
          className
        )
      )}
      {...props}
    >
      <div>
        {/* Accent rail — a thin gradient seam, the only flat element allowed
            because it is 4px of pure chroma, not a surface. */}
        <div
          className={clsx(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            accentBarStyles[accentColor]
          )}
        />

        <div className="mb-6 flex items-start justify-between gap-4">
          {icon ? (
            <IconWell accent className={accentTextStyles[accentColor]}>
              {icon}
            </IconWell>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-neu-base px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-neu-muted shadow-neu-inset-sm">
            {category}
          </span>
        </div>

        <h3 className="mb-3 font-display text-xl font-bold tracking-tight text-neu-fg">
          {title}
        </h3>

        <p className="font-ui text-sm leading-relaxed text-neu-muted">{description}</p>
      </div>

      {footer && (
        <div className="mt-8">
          <div className="mb-4 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.5)]" />          {footer}
        </div>
      )}
    </div>
  );
}
