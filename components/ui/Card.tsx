import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "deep" | "outline" | "elevated" | "inverted";
}

export function Card({
  children,
  variant = "default",
  className,
  ...props
}: CardProps) {
  const variantStyles = {
    // Graphite surface with steel border
    default: "bg-graphite/40 border border-steel/50 hover:border-steel/80",
    // Abyss deep surface
    deep: "bg-abyss/80 border border-steel/40",
    outline: "bg-transparent border border-steel/60",
    elevated: "bg-graphite/60 border border-steel/70 shadow-lg shadow-void/40",
    inverted: "bg-silver text-void border border-silver",
  };

  return (
    <div
      className={twMerge(
        clsx("rounded-card p-6 transition-all duration-200", variantStyles[variant], className)
      )}
      {...props}
    >
      {children}
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
  const accentBorderStyles = {
    iris: "hover:border-iris/50 group-hover:text-iris",
    cyan: "hover:border-cyan-signal/50 group-hover:text-cyan-signal",
    orchid: "hover:border-orchid-bloom/50 group-hover:text-orchid-bloom",
    periwinkle: "hover:border-periwinkle/50 group-hover:text-periwinkle",
    paleIris: "hover:border-iris-pale/50 group-hover:text-iris-pale",
    deepIris: "hover:border-iris-deep/50 group-hover:text-iris-deep",
  };

  const badgeColorStyles = {
    iris: "text-iris bg-iris/10 border-iris/20",
    cyan: "text-cyan-signal bg-cyan-signal/10 border-cyan-signal/20",
    orchid: "text-orchid-bloom bg-orchid-bloom/10 border-orchid-bloom/20",
    periwinkle: "text-periwinkle bg-periwinkle/10 border-periwinkle/20",
    paleIris: "text-iris-pale bg-iris-pale/10 border-iris-pale/20",
    deepIris: "text-iris bg-iris-deep/20 border-iris-deep/30",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "group relative flex flex-col justify-between rounded-feature p-8 bg-graphite/30 border border-steel/40 transition-all duration-300",
          accentBorderStyles[accentColor],
          className
        )
      )}
      {...props}
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <span
            className={clsx(
              "px-3 py-1 text-xs font-mono rounded-full border tracking-wide uppercase",
              badgeColorStyles[accentColor]
            )}
          >
            {category}
          </span>
          {icon && <div className="text-ash group-hover:text-cloud transition-colors">{icon}</div>}
        </div>

        <h3 className="font-display text-xl text-pure font-light mb-3 tracking-tight">
          {title}
        </h3>

        <p className="font-ui text-sm text-ash leading-relaxed">
          {description}
        </p>
      </div>

      {footer && <div className="mt-8 pt-4 border-t border-steel/30">{footer}</div>}
    </div>
  );
}
