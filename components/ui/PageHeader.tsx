import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PageHeaderProps {
  /** Short uppercase eyebrow above the title (e.g. a section label). */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional actions rendered to the right on wide screens. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Shared page masthead.
 *
 * Every page previously redeclared this eyebrow/title/description stack in
 * its own words (`font-mono text-xs uppercase` + `font-light` text). Hoisting
 * it guarantees the same type scale and rhythm everywhere, and keeps the
 * design system's weight rules (`font-bold` + `tracking-tight`) in one place.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          className
        )
      )}
    >
      <div>
        {eyebrow && (
          <span className="mb-2 block text-[11px] font-medium uppercase tracking-widest text-neu-accent">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-xs font-ui leading-relaxed text-neu-muted sm:text-sm">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
    </div>
  );
}
