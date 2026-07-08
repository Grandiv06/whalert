"use client";

import { MessageSquare } from "lucide-react";
import { useSignalManagementUnread } from "@/hooks/use-signal-management-unread";

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
  const hasUnread = useSignalManagementUnread(tradingSignalId);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#7C4DCC]/35 bg-[#542C85]/12 px-2.5 py-1.5 text-xs font-semibold text-[#DCCBFF] transition-colors hover:bg-[#542C85]/20 disabled:cursor-not-allowed disabled:opacity-45 ${fullWidth ? "w-full" : ""} ${className}`}
      title={
        hasUnread ? "مدیریت سیگنال - پیام جدید" : "مدیریت سیگنال"
      }
      aria-label={
        hasUnread ? "مدیریت سیگنال - پیام جدید" : "مدیریت سیگنال"
      }
    >
      <MessageSquare className="h-3.5 w-3.5" />
      <span>مدیریت سیگنال</span>
      {hasUnread ? (
        <span
          className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[#120a24]"
          aria-hidden
        />
      ) : null}
    </button>
  );
}
