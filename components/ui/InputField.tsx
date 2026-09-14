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
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-ui">
        <div className="flex items-center gap-1.5 text-cloud/90">
          <label htmlFor={inputId} className="font-medium cursor-pointer">
            {label}
          </label>
          {tooltip && (
            <div className="relative inline-flex items-center">
              <button
                type="button"
                className="text-ash hover:text-cloud transition-colors p-0.5"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip((prev) => !prev)}
                aria-label={`คำอธิบาย ${label}`}
              >
                <Info size={13} />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 w-48 p-2 text-[11px] leading-relaxed bg-abyss text-cloud border border-steel/80 rounded-md shadow-lg pointer-events-none">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>

        {unit && <span className="text-ash text-[11px] font-mono">{unit}</span>}
      </div>

      <div className="relative flex items-center">
        <input
          id={inputId}
          value={value}
          className={twMerge(
            clsx(
              "w-full h-10 px-3.5 rounded-input bg-abyss/80 text-pure font-mono text-sm border transition-all duration-150 placeholder:text-fog focus:outline-none focus:ring-1",
              error
                ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
                : "border-steel/60 hover:border-steel focus:border-iris focus:ring-iris/30",
              unit ? "pr-12" : showClear && value ? "pr-9" : "",
              className
            )
          )}
          {...props}
        />

        {showClear && value !== undefined && value !== "" && value !== 0 && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 text-ash hover:text-cloud transition-colors p-1"
            title="ล้างค่า"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {error && <span className="text-red-400 text-xs font-ui mt-0.5">{error}</span>}
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
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-ui">
        <div className="flex items-center gap-1.5 text-cloud/90">
          <label htmlFor={selectId} className="font-medium cursor-pointer">
            {label}
          </label>
          {tooltip && (
            <div className="relative inline-flex items-center">
              <button
                type="button"
                className="text-ash hover:text-cloud transition-colors p-0.5"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip((prev) => !prev)}
                aria-label={`คำอธิบาย ${label}`}
              >
                <Info size={13} />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 w-48 p-2 text-[11px] leading-relaxed bg-abyss text-cloud border border-steel/80 rounded-md shadow-lg pointer-events-none">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <select
        id={selectId}
        className={twMerge(
          clsx(
            "w-full h-10 px-3.5 rounded-input bg-abyss/80 text-pure font-ui text-sm border transition-all duration-150 focus:outline-none focus:ring-1",
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
              : "border-steel/60 hover:border-steel focus:border-iris focus:ring-iris/30",
            className
          )
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-obsidian text-pure">
            {opt.label}
          </option>
        ))}
      </select>

      {error && <span className="text-red-400 text-xs font-ui mt-0.5">{error}</span>}
    </div>
  );
}
