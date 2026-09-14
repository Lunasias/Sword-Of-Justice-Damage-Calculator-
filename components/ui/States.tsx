import React from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "./Button";

export function LoadingState({ message = "กำลังโหลดข้อมูล..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-8 h-8 border-2 border-iris border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-ui text-ash">{message}</p>
    </div>
  );
}

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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-card bg-graphite/20 border border-steel/30">
      <div className="p-4 rounded-full bg-abyss text-ash mb-4">
        <Inbox size={28} />
      </div>
      <h4 className="font-display text-lg text-pure font-light mb-2">{title}</h4>
      <p className="text-xs font-ui text-ash max-w-sm mb-6 leading-relaxed">{description}</p>
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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-card bg-red-950/10 border border-red-500/20">
      <div className="p-3 rounded-full bg-red-500/10 text-red-400 mb-4">
        <AlertCircle size={26} />
      </div>
      <h4 className="font-display text-lg text-pure font-light mb-2">{title}</h4>
      <p className="text-xs font-ui text-ash max-w-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="secondary">
          ลองใหม่อีกครั้ง
        </Button>
      )}
    </div>
  );
}
