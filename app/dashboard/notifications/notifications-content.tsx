"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  NotificationService,
  UserNotificationState,
  type UserNotification,
} from "@/lib/api/client";

function formatNotificationMessage(item: UserNotification): string {
  const message = item.notification?.data?.properties?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  return item.notification?.notificationName || "اعلان جدید";
}

function formatNotificationDate(iso?: string): string {
  if (!iso) return "-";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt
    .toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " - ");
}

export function NotificationsContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [readingNotificationId, setReadingNotificationId] = useState<string | null>(null);

  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-notifications-page"],
    queryFn: async () => {
      const res = await NotificationService.apiServicesAppNotificationGetusernotificationsGet(
        undefined,
        undefined,
        undefined,
        50,
        0,
      );
      const payload = res as { result?: { items?: UserNotification[] | null } };
      return payload.result?.items ?? res.items ?? [];
    },
  });

  const unreadCount = notifications.filter(
    (item) => item.state === UserNotificationState._0,
  ).length;

  const handleSetNotificationAsRead = async (notificationId?: string) => {
    if (!notificationId || readingNotificationId) return;
    setReadingNotificationId(notificationId);
    try {
      await NotificationService.apiServicesAppNotificationSetnotificationasreadPost({
        id: notificationId,
      });
      await refetch();
    } finally {
      setReadingNotificationId(null);
    }
  };

  return (
    <div className="p-1 md:p-6 w-full max-w-full overflow-x-hidden" dir="rtl">
      <section
        className={cn(
          "rounded-2xl border p-4 md:p-6",
          isDark
            ? "bg-[#09031A]/85 border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900",
        )}
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold">اعلان‌های من</h1>
            <p className={cn("text-xs mt-1", isDark ? "text-white/60" : "text-gray-500")}>
              لیست آخرین اعلان‌های حساب شما
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs",
              isDark
                ? "border-violet-300/25 bg-violet-500/10 text-violet-200"
                : "border-violet-200 bg-violet-100 text-violet-700",
            )}
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount} خوانده‌نشده
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`notif-page-sk-${i}`} className="rounded-xl border border-white/10 p-3">
                <Skeleton className="h-4 w-3/4 bg-white/10" />
                <Skeleton className="h-3 w-1/3 mt-2 bg-white/10" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div
            className={cn(
              "rounded-xl border px-3 py-8 text-center text-sm",
              isDark
                ? "border-white/10 bg-white/[0.02] text-white/70"
                : "border-gray-200 bg-gray-50 text-gray-600",
            )}
          >
            اعلان جدیدی برای نمایش وجود ندارد.
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((item, index) => {
              const isUnread = item.state === UserNotificationState._0;
              return (
                <article
                  key={item.id ?? `notif-page-${index}`}
                  className={cn(
                    "rounded-xl border p-3",
                    isUnread
                      ? isDark
                        ? "border-sky-400/25 bg-sky-500/10"
                        : "border-sky-200 bg-sky-50"
                      : isDark
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-gray-200 bg-gray-50",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={cn("text-sm leading-6", isDark ? "text-white" : "text-gray-900")}>
                        {formatNotificationMessage(item)}
                      </p>
                      <p className={cn("text-xs mt-1", isDark ? "text-white/55" : "text-gray-500")}>
                        {formatNotificationDate(item.notification?.creationTime)}
                      </p>
                    </div>
                    {isUnread && item.id ? (
                      <button
                        type="button"
                        onClick={() => handleSetNotificationAsRead(item.id)}
                        disabled={readingNotificationId === item.id}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
                          isDark
                            ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-200"
                            : "border-emerald-200 bg-emerald-100 text-emerald-700",
                        )}
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        {readingNotificationId === item.id ? "..." : "خواندم"}
                      </button>
                    ) : (
                      <span className={cn("text-[11px] shrink-0", isDark ? "text-white/45" : "text-gray-400")}>
                        خوانده شده
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

