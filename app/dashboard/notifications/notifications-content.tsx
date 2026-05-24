"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellRing,
  CheckCheck,
  CheckCircle2,
  ExternalLink,
  Info,
  Signal,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  NotificationService,
  UserNotificationState,
  type UserNotification,
} from "@/lib/api/client";

type NotificationFilter = "all" | "unread" | "read";

type NotificationTypeMeta = {
  title: string;
  icon: typeof BellRing;
};

const NOTIFICATION_TYPE_META: Record<string, NotificationTypeMeta> = {
  "App.SignalOutcomeDeclared": {
    title: "نتیجه سیگنال اعلام شد",
    icon: Signal,
  },
};

function getNotificationMeta(item: UserNotification): NotificationTypeMeta {
  const key = item.notification?.notificationName ?? "";
  return (
    NOTIFICATION_TYPE_META[key] ?? {
      title: "اعلان جدید",
      icon: BellRing,
    }
  );
}

function getNotificationMessage(item: UserNotification): string {
  const message = item.notification?.data?.properties?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  return "برای مشاهده جزئیات بیشتر اعلان را بررسی کنید.";
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

function resolveNotificationLink(item: UserNotification): string | null {
  const key = item.notification?.notificationName ?? "";
  if (key === "App.SignalOutcomeDeclared") return "/dashboard/opportunities/";
  return null;
}

export function NotificationsContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const isDark = theme === "dark";
  const [readingNotificationId, setReadingNotificationId] = useState<string | null>(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

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

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((item) => item.state === UserNotificationState._0);
    }
    if (activeFilter === "read") {
      return notifications.filter((item) => item.state !== UserNotificationState._0);
    }
    return notifications;
  }, [activeFilter, notifications]);

  const handleSetNotificationAsRead = async (notificationId?: string) => {
    if (!notificationId || readingNotificationId) return;
    setReadingNotificationId(notificationId);
    try {
      await NotificationService.apiServicesAppNotificationSetnotificationasreadPost({
        id: notificationId,
      });
      queryClient.setQueryData(
        ["sidebar-user-notifications"],
        (prev: { unreadCount?: number } | undefined) =>
          prev
            ? { ...prev, unreadCount: Math.max(0, (prev.unreadCount ?? 0) - 1) }
            : prev,
      );
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ["sidebar-user-notifications"] }),
      ]);
    } finally {
      setReadingNotificationId(null);
    }
  };

  const handleSetAllAsRead = async () => {
    if (markingAllAsRead || unreadCount === 0) return;
    setMarkingAllAsRead(true);
    try {
      await NotificationService.apiServicesAppNotificationSetallnotificationsasreadPost();
      queryClient.setQueryData(
        ["sidebar-user-notifications"],
        (prev: { unreadCount?: number } | undefined) =>
          prev ? { ...prev, unreadCount: 0 } : prev,
      );
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ["sidebar-user-notifications"] }),
      ]);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  return (
    <div className="p-1 md:p-6 w-full max-w-full overflow-x-hidden" dir="rtl">
      <section
        className={cn(
          "relative overflow-hidden rounded-[28px] border p-4 md:p-6 shadow-[0_20px_70px_-25px_rgba(84,44,133,0.85)]",
          isDark
            ? "bg-gradient-to-br from-[#09031A]/92 via-[#100426]/88 to-[#060114]/92 border-[#C09CFF]/18 text-white backdrop-blur-xl"
            : "bg-white border-gray-200 text-gray-900",
        )}
      >
        {isDark && (
          <div className="pointer-events-none absolute -top-20 -left-10 h-48 w-48 rounded-full bg-[#7A3FE0]/20 blur-3xl" />
        )}
        {isDark && (
          <div className="pointer-events-none absolute -bottom-16 -right-8 h-44 w-44 rounded-full bg-[#3D1D77]/30 blur-2xl" />
        )}

        <div className="relative z-10 mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold">اعلان‌های من</h1>
            <p className={cn("text-xs md:text-sm mt-1", isDark ? "text-white/60" : "text-gray-500")}>
              آخرین اعلان‌های حساب شما
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
                isDark
                  ? "border-violet-300/25 bg-violet-500/10 text-violet-200"
                  : "border-violet-200 bg-violet-100 text-violet-700",
              )}
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount} خوانده‌نشده
            </span>
            <button
              type="button"
              onClick={handleSetAllAsRead}
              disabled={unreadCount === 0 || markingAllAsRead}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
                unreadCount === 0 || markingAllAsRead
                  ? "opacity-50 cursor-not-allowed border-white/15 text-white/50"
                  : isDark
                    ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                    : "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
              )}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {markingAllAsRead ? "..." : "همه را خواندم"}
            </button>
          </div>
        </div>

        <div className="relative z-10 mb-4 flex items-center gap-2">
          {([
            { key: "all", label: "همه" },
            { key: "unread", label: "خوانده‌نشده" },
            { key: "read", label: "خوانده‌شده" },
          ] as Array<{ key: NotificationFilter; label: string }>).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                activeFilter === tab.key
                  ? isDark
                    ? "border-violet-300/35 bg-violet-500/15 text-violet-100"
                    : "border-violet-300 bg-violet-100 text-violet-800"
                  : isDark
                    ? "border-white/15 bg-white/[0.03] text-white/70 hover:bg-white/[0.08]"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`notif-page-sk-${i}`}
                className={cn(
                  "rounded-2xl border p-4",
                  isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-9 w-9 rounded-xl bg-white/10" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 bg-white/10" />
                    <Skeleton className="h-3 w-32 mt-2 bg-white/10" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div
            className={cn(
              "rounded-2xl border px-4 py-12 text-center",
              isDark
                ? "border-white/10 bg-white/[0.02] text-white/70"
                : "border-gray-200 bg-gray-50 text-gray-600",
            )}
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/25 bg-violet-500/15">
              <Sparkles className="h-7 w-7 text-violet-200" />
            </div>
            <p className="text-base font-semibold">هنوز اعلانی ندارید</p>
            <p className={cn("text-sm mt-1", isDark ? "text-white/55" : "text-gray-500")}>
              اعلان‌های مربوط به سیگنال‌ها و حساب شما اینجا نمایش داده می‌شود
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((item, index) => {
              const isUnread = item.state === UserNotificationState._0;
              const meta = getNotificationMeta(item);
              const Icon = meta.icon;
              const targetLink = resolveNotificationLink(item);

              return (
                <article
                  key={item.id ?? `notif-page-${index}`}
                  className={cn(
                    "rounded-2xl border p-4 transition-colors",
                    isUnread
                      ? isDark
                        ? "border-sky-400/30 bg-gradient-to-r from-sky-500/10 to-violet-500/10"
                        : "border-sky-200 bg-sky-50"
                      : isDark
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-gray-200 bg-gray-50",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div
                        className={cn(
                          "relative mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                          isUnread
                            ? isDark
                              ? "border-sky-300/30 bg-sky-500/15 text-sky-200"
                              : "border-sky-200 bg-sky-100 text-sky-700"
                            : isDark
                              ? "border-white/10 bg-white/[0.03] text-white/70"
                              : "border-gray-200 bg-white text-gray-600",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {isUnread && (
                          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-sky-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>
                            {meta.title}
                          </h3>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                              isUnread
                                ? isDark
                                  ? "border-sky-300/30 bg-sky-500/15 text-sky-200"
                                  : "border-sky-200 bg-sky-100 text-sky-700"
                                : isDark
                                  ? "border-white/15 bg-white/[0.03] text-white/60"
                                  : "border-gray-200 bg-gray-100 text-gray-600",
                            )}
                          >
                            {isUnread ? "خوانده‌نشده" : "خوانده‌شده"}
                          </span>
                        </div>
                        <p className={cn("mt-1 text-sm leading-6", isDark ? "text-white/80" : "text-gray-700")}>
                          {getNotificationMessage(item)}
                        </p>
                        <p className={cn("mt-2 text-xs", isDark ? "text-white/50" : "text-gray-500")}>
                          {formatNotificationDate(item.notification?.creationTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {targetLink && (
                        <button
                          type="button"
                          onClick={() => router.push(targetLink)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors",
                            isDark
                              ? "border-violet-300/25 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20"
                              : "border-violet-200 bg-violet-100 text-violet-700 hover:bg-violet-200",
                          )}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          جزئیات
                        </button>
                      )}
                      {isUnread && item.id ? (
                        <button
                          type="button"
                          onClick={() => handleSetNotificationAsRead(item.id)}
                          disabled={readingNotificationId === item.id}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors",
                            isDark
                              ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                              : "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
                          )}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {readingNotificationId === item.id ? "..." : "خواندم"}
                        </button>
                      ) : (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px]",
                            isDark
                              ? "border-white/15 bg-white/[0.03] text-white/55"
                              : "border-gray-200 bg-gray-100 text-gray-500",
                          )}
                        >
                          <Info className="h-3.5 w-3.5" />
                          ثبت‌شده
                        </span>
                      )}
                    </div>
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
