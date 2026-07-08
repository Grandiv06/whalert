"use client";

import { createPortal } from "react-dom";
import { MessageSquare } from "lucide-react";
import {
  useSignalManagementMessageAlerts,
  type SignalManagementAlertTarget,
} from "@/hooks/use-signal-management-message-alerts";
import { formatSignalManagementAlertTitle } from "@/lib/signal-management-alert-title";
import { toPersianDigits } from "@/lib/utils";

interface SignalManagementMessageAlertsProps {
  signals: SignalManagementAlertTarget[];
  onView: (tradingSignalId: number, title: string) => void;
}

export function SignalManagementMessageAlerts({
  signals,
  onView,
}: SignalManagementMessageAlertsProps) {
  const { toasts, nowMs, viewToast, dismissToast } =
    useSignalManagementMessageAlerts(signals, onView);

  if (typeof document === "undefined" || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-[99999] flex w-auto sm:w-[min(92vw,380px)] flex-col gap-2">
      {toasts.map((toast) => {
        const elapsed = nowMs - toast.createdAt;
        const remainingMs = Math.max(0, toast.durationMs - elapsed);
        const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
        const progressPercent = Math.max(
          0,
          (remainingMs / toast.durationMs) * 100,
        );
        const displayTitle = formatSignalManagementAlertTitle(toast.title);

        return (
          <div
            key={toast.id}
            className="relative overflow-hidden rounded-2xl border border-[#A87FF3]/35 bg-[#120A24]/95 px-4 py-3 text-white shadow-[0_20px_50px_-20px_rgba(93,49,160,0.65)] backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#A87FF3]/30 bg-[#542C85]/25 text-[#DCCBFF]">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-6 text-white">
                  پیام جدید برای {displayTitle} دارید
                </p>
                <p className="mt-0.5 text-xs leading-6 text-white/65">
                  پیام خوانده‌نشده دارید.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => viewToast(toast)}
                    className="inline-flex h-8 items-center justify-center rounded-lg bg-[#542C85] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#6b3ca8] cursor-pointer"
                  >
                    مشاهده
                  </button>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-white/15 px-3 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    بستن
                  </button>
                </div>
              </div>
              <span className="shrink-0 rounded-md bg-black/25 px-1.5 py-0.5 text-[11px] font-medium text-white/80">
                {toPersianDigits(remainingSec)}s
              </span>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#A87FF3] transition-[width] duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
