"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSignalManagementMessages } from "@/hooks/use-signal-management-unread";
import { markSignalManagementMessagesAsRead } from "@/lib/signal-management-read-state";
import { setSignalManagementDialogOpen } from "@/lib/signal-management-polling-state";
import { normalizePersianText } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export interface SignalManagementMessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tradingSignalId?: number | null;
  title?: string;
}

function formatPostedAt(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date
    .toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " - ");
}

function MessagesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <Skeleton className="mb-2 h-4 w-28 bg-white/10" />
          <Skeleton className="mb-2 h-3 w-20 bg-white/10" />
          <Skeleton className="h-10 w-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function SignalManagementMessagesDialog({
  open,
  onOpenChange,
  tradingSignalId,
  title,
}: SignalManagementMessagesDialogProps) {
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useSignalManagementMessages(tradingSignalId, {
    enabled: open && !!tradingSignalId,
    refetchInterval: false,
  });

  const markedSignalIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open || !tradingSignalId) {
      if (tradingSignalId) {
        setSignalManagementDialogOpen(tradingSignalId, false);
      }
      markedSignalIdRef.current = null;
      return;
    }

    setSignalManagementDialogOpen(tradingSignalId, true);
    return () => {
      setSignalManagementDialogOpen(tradingSignalId, false);
      markedSignalIdRef.current = null;
    };
  }, [open, tradingSignalId]);

  useEffect(() => {
    if (!open || !tradingSignalId || isLoading || isError) return;
    if (markedSignalIdRef.current === tradingSignalId) return;

    markedSignalIdRef.current = tradingSignalId;
    markSignalManagementMessagesAsRead(tradingSignalId, messages);
  }, [open, tradingSignalId, isLoading, isError, messages]);

  const dialogTitle = title
    ? `مدیریت سیگنال ${title}`
    : "مدیریت سیگنال";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(85vh,720px)] max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b071e]/95 p-0 text-white backdrop-blur-md"
        dir="rtl"
      >
        <div className="shrink-0 border-b border-white/10 px-5 py-5 md:px-6">
          <DialogHeader className="text-right">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#A87FF3]/30 bg-[#542C85]/20 px-3 py-1 text-xs font-semibold text-[#DCCBFF]">
              <MessageSquare className="h-3.5 w-3.5" />
              پیام‌های مدیریت پوزیشن
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-white/65">
              پیام‌های ثبت‌شده توسط تحلیلگر برای مدیریت این سیگنال.
              {!isLoading && !isError && messages.length > 0
                ? ` (${messages.length} پیام)`
                : null}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-subscription px-5 py-4 md:px-6">
          <div className="space-y-3">
            {isLoading ? <MessagesSkeleton /> : null}

            {!isLoading && isError ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                بارگذاری پیام‌ها با خطا مواجه شد.
              </div>
            ) : null}

            {!isLoading && !isError && messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-center text-sm text-white/60">
                هنوز پیامی برای این سیگنال ثبت نشده است.
              </div>
            ) : null}

            {!isLoading && !isError
              ? messages.map((message) => (
                  <article
                    key={message.id ?? `${message.postedAt}-${message.body}`}
                    className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-[#E8DBFF]">
                        {normalizePersianText(message.authorName || "تحلیلگر")}
                      </p>
                      <p className="shrink-0 text-[11px] text-white/50">
                        {formatPostedAt(message.postedAt)}
                      </p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7 text-white/85">
                      {normalizePersianText(message.body || "")}
                    </p>
                  </article>
                ))
              : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
