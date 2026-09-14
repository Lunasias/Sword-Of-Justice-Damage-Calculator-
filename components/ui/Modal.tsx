"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgb(61 72 82 / 0.35)" }}
      onClick={onClose}
    >
      <div
        /* Raised, not placed: the dialog is moulded from the same surface
           and simply sits higher than the page. */
        className={`relative max-h-[90vh] w-full overflow-y-auto ${maxWidthStyles[maxWidth]} rounded-card bg-neu-base p-6 shadow-neu-lifted md:p-8`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between pb-5">
          <h2 id="modal-title" className="font-display text-xl font-bold tracking-tight text-neu-fg">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-neu-base p-2.5 text-neu-muted shadow-neu-extruded transition-all duration-300 ease-out hover:text-neu-fg hover:shadow-neu-lifted active:translate-y-0.5 active:shadow-neu-inset-sm focus-neu"
            aria-label="ปิดหน้าต่าง"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inset groove instead of a hard rule. */}
        <div className="mb-6 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.5)]" />

        <div>{children}</div>
      </div>
    </div>
  );
}
