"use client";

import React from "react";

/**
 * Shared header for the calculator's input panels.
 *
 * Previously each input panel (character / skill / enemy) redeclared this
 * markup. Hoisting it removes the triplication and guarantees the three
 * panels stay typographically identical.
 */
export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-neu-fg">{title}</h3>
          <p className="mt-0.5 text-xs font-ui text-neu-muted">{description}</p>
        </div>
        {action}
      </div>
      {/* Inset groove rather than a border. */}
      <div className="mt-4 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />
    </div>
  );
}
