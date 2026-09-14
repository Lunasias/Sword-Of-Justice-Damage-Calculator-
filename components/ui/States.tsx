import React from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "./Button";

/**
 * Loading indicator: the spinner sits inside a carved well so even a
 * transient state obeys the depth model.
 */
export function LoadingState({ message = "กำลังโหลดข้อมูล..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neu-base shadow-neu-inset-deep">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neu-accent/25 border-t-neu-accent" />
      </div>
      <p className="text-sm font-ui text-neu-muted">{message}</p>
    </div>
  );
}

/**
 * Empty and error states are recessed (inset) — an absence of content
 * reads naturally as a hollow in the surface.
 */
export function EmptyState({
  title = "ไม่พบข้อมูล",
  description = "ยังไม่มีข้อมูลในส่วนนี้",
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card bg-neu-base px-6 py-16 text-center shadow-neu-inset">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neu-base text-neu-muted shadow-neu-inset-deep">
        <Inbox size={26} />
      </div>
      <h4 className="mb-2 font-display text-lg font-bold tracking-tight text-neu-fg">{title}</h4>
      <p className="mb-7 max-w-sm text-xs font-ui leading-relaxed text-neu-muted">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "เกิดข้อผิดพลาด",
  message = "ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card bg-neu-base px-6 py-16 text-center shadow-neu-inset">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neu-base text-neu-danger shadow-neu-inset-deep">
        <AlertCircle size={26} />
      </div>
      <h4 className="mb-2 font-display text-lg font-bold tracking-tight text-neu-fg">{title}</h4>
      <p className="mb-7 max-w-sm text-xs font-ui leading-relaxed text-neu-muted">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="secondary">
          ลองใหม่อีกครั้ง
        </Button>
      )}
    </div>
  );
}
