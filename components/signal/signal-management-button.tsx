"use client";

import { MessageSquare } from "lucide-react";

interface SignalManagementButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function SignalManagementButton({
  onClick,
  disabled = false,
  className = "",
  fullWidth = false,
}: SignalManagementButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#7C4DCC]/35 bg-[#542C85]/12 px-2.5 py-1.5 text-xs font-semibold text-[#DCCBFF] transition-colors hover:bg-[#542C85]/20 disabled:cursor-not-allowed disabled:opacity-45 ${fullWidth ? "w-full" : ""} ${className}`}
      title="مدیریت سیگنال"
    >
      <MessageSquare className="h-3.5 w-3.5" />
      <span>مدیریت سیگنال</span>
    </button>
  );
}
