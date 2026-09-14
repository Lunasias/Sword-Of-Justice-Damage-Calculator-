"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Info, X } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
  error?: string;
  unit?: string;
  onClear?: () => void;
  showClear?: boolean;
}

/**
 * Inputs are carved into the surface (`insetDeep`) and stay carved while
 * focused — the accent ring is layered on top rather than replacing the
 * shadow, which is what keeps the "pressed into the material" read.
 */
export function InputField({
  label,
  tooltip,
  error,
  unit,
  onClear,
  showClear,
  className,
  value,
  id,
  ...props
}: InputFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const inputId = id || `input-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-ui">
        <div className="flex items-center gap-1.5 text-neu-fg">
          <label htmlFor={inputId} className="cursor-pointer font-medium">
            {label}
          </label>
          {tooltip && (
            <div className="relative inline-flex items-center">
              <button
                type="button"
                className="rounded-full p-1 text-neu-muted transition-colors duration-300 hover:text-neu-accent focus-neu"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip((prev) => !prev)}
                aria-label={`คำอธิบาย ${label}`}
              >
                <Info size={13} />
              </button>
              {showTooltip && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 rounded-xl bg-neu-base p-3 text-[11px] leading-relaxed text-neu-muted shadow-neu-lifted"
                >
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>

        {unit && <span className="font-numeric text-[11px] text-neu-muted">หน่วย: {unit}</span>}
      </div>

      <div className="relative flex items-center">
        <input
          id={inputId}
          value={value}
          aria-invalid={error ? true : undefined}
          className={twMerge(
            clsx(
              "h-11 w-full rounded-2xl bg-neu-base px-4 font-numeric text-sm text-neu-fg shadow-neu-inset-deep transition-all duration-300 ease-out placeholder:text-neu-placeholder focus-neu-inset",
              error &&
                "shadow-[inset_6px_6px_12px_rgb(163_177_198/0.7),inset_-6px_-6px_12px_rgb(255_255_255/0.6)] focus:shadow-[inset_6px_6px_12px_rgb(163_177_198/0.7),inset_-6px_-6px_12px_rgb(255_255_255/0.6),0_0_0_2px_#E0E5EC,0_0_0_4px_#E5484D]",
              unit ? "pr-14" : showClear && value ? "pr-11" : "",
              className
            )
          )}
          {...props}
        />

        {unit && (
          <span className="pointer-events-none absolute right-4 font-numeric text-[11px] text-neu-muted">
            {unit}
          </span>
        )}

        {showClear && value !== undefined && value !== "" && value !== 0 && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 rounded-full p-1.5 text-neu-muted transition-all duration-300 hover:text-neu-fg active:shadow-neu-inset-sm focus-neu"
            title="ล้างค่า"
            aria-label={`ล้างค่า ${label}`}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {error && <span className="mt-0.5 text-xs font-ui text-neu-danger">{error}</span>}
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  tooltip?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export function SelectField({
  label,
  tooltip,
  error,
  options,
  id,
  className,
  ...props
}: SelectFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const selectId = id || `select-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-ui">
        <div className="flex items-center gap-1.5 text-neu-fg">
          <label htmlFor={selectId} className="cursor-pointer font-medium">
            {label}
          </label>
          {tooltip && (
            <div className="relative inline-flex items-center">
              <button
                type="button"
                className="rounded-full p-1 text-neu-muted transition-colors duration-300 hover:text-neu-accent focus-neu"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip((prev) => !prev)}
                aria-label={`คำอธิบาย ${label}`}
              >
                <Info size={13} />
              </button>
              {showTooltip && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 rounded-xl bg-neu-base p-3 text-[11px] leading-relaxed text-neu-muted shadow-neu-lifted"
                >
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        className={twMerge(
          clsx(
            "h-11 w-full cursor-pointer rounded-2xl bg-neu-base px-4 font-ui text-sm text-neu-fg shadow-neu-inset-deep transition-all duration-300 ease-out focus-neu-inset",
            error &&
              "shadow-[inset_6px_6px_12px_rgb(163_177_198/0.7),inset_-6px_-6px_12px_rgb(255_255_255/0.6)]",
            className
          )
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <span className="mt-0.5 text-xs font-ui text-neu-danger">{error}</span>}
    </div>
  );
}

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  tooltip?: string;
  error?: string;
}

/**
 * Textareas share the input's carved well so long-form fields do not
 * visually break out of the system.
 */
export function TextareaField({
  label,
  tooltip,
  error,
  id,
  className,
  ...props
}: TextareaFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const textareaId = id || `textarea-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-xs font-ui text-neu-fg">
        <label htmlFor={textareaId} className="cursor-pointer font-medium">
          {label}
        </label>
        {tooltip && (
          <div className="relative inline-flex items-center">
            <button
              type="button"
              className="rounded-full p-1 text-neu-muted transition-colors duration-300 hover:text-neu-accent focus-neu"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip((prev) => !prev)}
              aria-label={`คำอธิบาย ${label}`}
            >
              <Info size={13} />
            </button>
            {showTooltip && (
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 rounded-xl bg-neu-base p-3 text-[11px] leading-relaxed text-neu-muted shadow-neu-lifted"
              >
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>

      <textarea
        id={textareaId}
        aria-invalid={error ? true : undefined}
        className={twMerge(
          clsx(
            "w-full resize-none rounded-2xl bg-neu-base p-4 font-ui text-sm leading-relaxed text-neu-fg shadow-neu-inset-deep transition-all duration-300 ease-out placeholder:text-neu-placeholder focus-neu-inset",
            className
          )
        )}
        {...props}
      />

      {error && <span className="mt-0.5 text-xs font-ui text-neu-danger">{error}</span>}
    </div>
  );
}
