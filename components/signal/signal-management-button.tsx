"use client";

import { MessageSquare } from "lucide-react";
import { useSignalManagementUnreadCount } from "@/hooks/use-signal-management-unread";
import { toPersianDigits } from "@/lib/utils";

interface SignalManagementButtonProps {
  tradingSignalId?: number | null;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function SignalManagementButton({
  tradingSignalId,
  onClick,
  disabled = false,
  className = "",
  fullWidth = false,
}: SignalManagementButtonProps) {
  const unreadCount = useSignalManagementUnreadCount(tradingSignalId);
  const unreadLabel =
    unreadCount > 9 ? "۹+" : toPersianDigits(unreadCount);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#7C4DCC]/35 bg-[#542C85]/12 px-2.5 py-1.5 text-xs font-semibold text-[#DCCBFF] transition-colors hover:bg-[#542C85]/20 disabled:cursor-not-allowed disabled:opacity-45 ${fullWidth ? "w-full" : ""} ${className}`}
      title={
        unreadCount > 0
          ? `مدیریت سیگنال - ${unreadLabel} پیام خوانده‌نشده`
          : "مدیریت سیگنال"
      }
      aria-label={
        unreadCount > 0
          ? `مدیریت سیگنال - ${unreadLabel} پیام خوانده‌نشده`
          : "مدیریت سیگنال"
      }
    >
      <MessageSquare className="h-3.5 w-3.5" />
      <span>مدیریت سیگنال</span>
      {unreadCount > 0 ? (
        <span
          className="absolute -left-1.5 -top-1.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[#120a24]"
          aria-hidden
        >
          {unreadLabel}
        </span>
      ) : null}
    </button>
  );
}
