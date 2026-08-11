"use client";

import { useState, useEffect } from "react";
import { Calendar, Sparkles, Video, CheckCircle2, Clock } from "lucide-react";
import { cn, parseUtcDate } from "@/lib/utils";
import type { LiveSessionDto } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionsTableProps {
  sessions?: LiveSessionDto[];
  nextSessionId?: number | null;
  isLoading?: boolean;
}

function parseSessionDateTime(session: LiveSessionDto) {
  const dateObj = session.scheduledStartUtc
    ? parseUtcDate(session.scheduledStartUtc)
    : null;
  const isValidDate = dateObj && !isNaN(dateObj.getTime());

  let dateStr = session.scheduledAtPersian || "-";
  if (isValidDate) {
    try {
      dateStr = dateObj.toLocaleDateString("fa-IR", {
        day: "numeric",
        month: "long",
        timeZone: "Asia/Tehran",
      });
    } catch {
      dateStr = session.scheduledAtPersian || "-";
    }
  }

  let dayStr = "-";
  if (isValidDate) {
    try {
      dayStr = dateObj.toLocaleDateString("fa-IR", {
        weekday: "long",
        timeZone: "Asia/Tehran",
      });
    } catch {
      dayStr = "-";
    }
  }

  let timeStr = "-";
  if (isValidDate) {
    try {
      timeStr = dateObj.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      });
    } catch {
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      timeStr = `${hours}:${minutes}`;
    }
  }

  return { dateStr, dayStr, timeStr, isValidDate, dateObj };
}

export function SessionsTable({ sessions = [], nextSessionId, isLoading }: SessionsTableProps) {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="sessions-table"
      className="group relative flex w-full scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#100624]/90 via-[#0a0318]/95 to-[#05010e]/95 p-6 shadow-[0_20px_50px_-15px_rgba(84,44,133,0.3)] backdrop-blur-xl transition-all duration-500 hover:border-purple-500/35 md:p-8"
    >
      {/* Top ambient highlight line */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent shadow-[0_0_12px_rgba(192,132,252,0.7)]" />
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-purple-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-[100px]" />

      {/* Header */}
      <div className="relative z-10 mb-8 flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.25)] backdrop-blur-md">
            <Calendar className="h-5.5 w-5.5 text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <h2 className="iranyekan-bold text-[22px] font-bold tracking-wide text-white drop-shadow-sm md:text-[26px]">
              جلسات وبینار زنده
            </h2>
            <span className="iranyekan-regular text-[13px] text-purple-300/60">
              برنامه زمانی و آرشیو وبینارهای زنده طلا
            </span>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="hidden h-[1px] flex-1 max-w-[350px] bg-gradient-to-l from-transparent via-purple-500/25 to-purple-400/60 sm:block" />
      </div>

      {/* Table Container */}
      <div className="relative z-10 overflow-x-auto scrollbar-thin">
        {isLoading ? (
          <div className="flex flex-col gap-3 py-4">
            <Skeleton className="h-14 w-full rounded-2xl bg-purple-500/10" />
            <Skeleton className="h-14 w-full rounded-2xl bg-purple-500/10" />
            <Skeleton className="h-14 w-full rounded-2xl bg-purple-500/10" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-purple-300/60">
            <Calendar className="h-10 w-10 mb-3 text-purple-400/40" />
            <p className="iranyekan-medium text-base text-purple-200/80">در حال حاضر جلسه‌ای ثبت نشده است.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <table className="hidden md:table w-full min-w-[750px] border-separate border-spacing-y-2">
              <thead>
                <tr className="iranyekan-medium text-[13px] text-purple-300/70">
                  <th className="px-6 py-3.5 text-right font-medium whitespace-nowrap">
                    موضوع جلسه
                  </th>
                  <th className="px-6 py-3.5 text-center font-medium whitespace-nowrap">
                    تاریخ
                  </th>
                  <th className="px-6 py-3.5 text-center font-medium whitespace-nowrap">
                    روز
                  </th>
                  <th className="px-6 py-3.5 text-center font-medium whitespace-nowrap">
                    ساعت
                  </th>
                  <th className="px-6 py-3.5 text-left font-medium whitespace-nowrap">
                    وضعیت / دسترسی
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const { dateStr, dayStr, timeStr, isValidDate, dateObj } = parseSessionDateTime(session);
                  
                  const isNext = session.id != null ? session.id === nextSessionId : false;
                  
                  let isPast = false;
                  let isBefore5Min = false;
                  let isJoinable = false;

                  if (isValidDate && dateObj) {
                    const startTime = dateObj.getTime();
                    const fiveMinBefore = startTime - 5 * 60 * 1000;
                    const sessionEndTime = startTime + 2 * 60 * 60 * 1000;

                    isPast = now > sessionEndTime;
                    isBefore5Min = now < fiveMinBefore;
                    isJoinable = Boolean(session.meetingUrl) && now >= fiveMinBefore && now <= sessionEndTime;
                  } else if (session.meetingUrl) {
                    isJoinable = true;
                  }

                  return (
                    <tr
                      key={session.id ?? session.title}
                      className={cn(
                        "group/row transition-all duration-300",
                        isNext
                          ? "bg-gradient-to-r from-purple-950/80 via-[#230f40]/90 to-purple-950/80 shadow-[0_4px_25px_rgba(147,51,234,0.25)]"
                          : "hover:bg-purple-500/[0.05]"
                      )}
                    >
                      {/* Topic */}
                      <td
                        className={cn(
                          "px-6 py-4.5 text-right align-middle transition-colors",
                          isNext
                            ? "border-y border-r border-purple-500/50 rounded-r-2xl"
                            : "border-y border-r border-transparent group-hover/row:border-purple-500/20 group-hover/row:rounded-r-2xl"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                              isNext
                                ? "bg-purple-500/25 border border-purple-400/40 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                                : "bg-purple-500/10 border border-purple-500/15 text-purple-300/60 group-hover/row:text-purple-300"
                            )}
                          >
                            {isNext ? (
                              <Video className="h-4.5 w-4.5 text-purple-300 animate-pulse" />
                            ) : isPast ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-purple-400/50" />
                            ) : (
                              <Clock className="h-4.5 w-4.5 text-purple-300/50" />
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "iranyekan-medium text-[15px]",
                                isNext
                                  ? "font-bold text-white drop-shadow-sm"
                                  : "text-purple-100/90 group-hover/row:text-white"
                              )}
                            >
                              {session.title || "جلسه آنلاین"}
                            </span>

                            {session.signalProviderName && (
                              <span className="iranyekan-regular text-[12px] text-purple-300/60">
                                ({session.signalProviderName})
                              </span>
                            )}

                            {isNext && (
                              <span className="iranyekan-medium inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-0.5 text-[11px] font-semibold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                                <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                                نزدیک‌ترین جلسه
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td
                        className={cn(
                          "px-6 py-4.5 text-center align-middle whitespace-nowrap",
                          isNext
                            ? "border-y border-purple-500/50"
                            : "border-y border-transparent group-hover/row:border-purple-500/20"
                        )}
                      >
                        <span
                          className={cn(
                            "iranyekan-regular text-[14px]",
                            isNext ? "font-semibold text-purple-100" : "text-purple-200/70"
                          )}
                        >
                          {dateStr}
                        </span>
                      </td>

                      {/* Day */}
                      <td
                        className={cn(
                          "px-6 py-4.5 text-center align-middle whitespace-nowrap",
                          isNext
                            ? "border-y border-purple-500/50"
                            : "border-y border-transparent group-hover/row:border-purple-500/20"
                        )}
                      >
                        <span
                          className={cn(
                            "iranyekan-regular text-[14px]",
                            isNext ? "font-semibold text-purple-100" : "text-purple-200/70"
                          )}
                        >
                          {dayStr}
                        </span>
                      </td>

                      {/* Time */}
                      <td
                        className={cn(
                          "px-6 py-4.5 text-center align-middle whitespace-nowrap",
                          isNext
                            ? "border-y border-purple-500/50"
                            : "border-y border-transparent group-hover/row:border-purple-500/20"
                        )}
                      >
                        <span
                          className={cn(
                            "iranyekan-regular font-mono text-[14px] tracking-wider",
                            isNext ? "font-bold text-purple-200" : "text-purple-300/60"
                          )}
                        >
                          {timeStr}
                        </span>
                      </td>

                      {/* Status / Access Action */}
                      <td
                        className={cn(
                          "px-6 py-4.5 text-left align-middle whitespace-nowrap",
                          isNext
                            ? "border-y border-l border-purple-500/50 rounded-l-2xl"
                            : "border-y border-l border-transparent group-hover/row:border-purple-500/20 group-hover/row:rounded-l-2xl"
                        )}
                      >
                        {isJoinable ? (
                          <a
                            href={session.meetingUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="iranyekan-demibold inline-flex items-center gap-2 rounded-full border border-purple-400/50 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 px-5 py-1.5 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]"
                          >
                            <span>ورود به جلسه</span>
                            <Video className="h-4 w-4 animate-pulse text-purple-200" />
                          </a>
                        ) : isBefore5Min ? (
                          <span
                            className="iranyekan-demibold inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-[12px] font-medium text-purple-300/70 backdrop-blur-sm cursor-not-allowed opacity-90"
                            title="دکمه ورود ۵ دقیقه قبل از شروع جلسه فعال می‌شود"
                          >
                            <span>ورود از ۵ دقیقه قبل</span>
                            <Clock className="h-4 w-4 text-purple-400/60" />
                          </span>
                        ) : isPast ? (
                          <span className="iranyekan-regular inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[12px] font-medium text-purple-300/50">
                            برگزار شد
                          </span>
                        ) : (
                          <span className="iranyekan-regular inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-[12px] font-medium text-purple-300/90 backdrop-blur-sm">
                            به زودی
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Cards View */}
            <div className="flex flex-col gap-4 md:hidden pb-2">
              {sessions.map((session) => {
                const { dateStr, dayStr, timeStr, isValidDate, dateObj } = parseSessionDateTime(session);
                const isNext = session.id != null ? session.id === nextSessionId : false;
                
                let isPast = false;
                let isBefore5Min = false;
                let isJoinable = false;

                if (isValidDate && dateObj) {
                  const startTime = dateObj.getTime();
                  const fiveMinBefore = startTime - 5 * 60 * 1000;
                  const sessionEndTime = startTime + 2 * 60 * 60 * 1000;

                  isPast = now > sessionEndTime;
                  isBefore5Min = now < fiveMinBefore;
                  isJoinable = Boolean(session.meetingUrl) && now >= fiveMinBefore && now <= sessionEndTime;
                } else if (session.meetingUrl) {
                  isJoinable = true;
                }

                return (
                  <div
                    key={session.id ?? session.title}
                    className={cn(
                      "relative flex flex-col gap-4 rounded-2xl border p-4.5 transition-all duration-300",
                      isNext
                        ? "bg-gradient-to-br from-purple-950/80 via-[#230f40]/90 to-purple-950/80 border-purple-500/40 shadow-[0_4px_25px_rgba(147,51,234,0.25)]"
                        : "bg-purple-500/[0.03] border-purple-500/10"
                    )}
                  >
                    {/* Topic & Icon */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          isNext
                            ? "bg-purple-500/25 border border-purple-400/40 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                            : "bg-purple-500/10 border border-purple-500/15 text-purple-300/60"
                        )}
                      >
                        {isNext ? (
                          <Video className="h-5 w-5 text-purple-300 animate-pulse" />
                        ) : isPast ? (
                          <CheckCircle2 className="h-5 w-5 text-purple-400/50" />
                        ) : (
                          <Clock className="h-5 w-5 text-purple-300/50" />
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "iranyekan-medium text-[15px]",
                              isNext ? "font-bold text-white drop-shadow-sm" : "text-purple-100/90"
                            )}
                          >
                            {session.title || "جلسه آنلاین"}
                          </span>
                          {isNext && (
                            <span className="iranyekan-medium inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                              <Sparkles className="h-2.5 w-2.5 text-amber-400 animate-pulse" />
                              نزدیک‌ترین جلسه
                            </span>
                          )}
                        </div>
                        {session.signalProviderName && (
                          <span className="iranyekan-regular text-[12px] text-purple-300/60">
                            توسط {session.signalProviderName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date / Time Details */}
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-black/20 p-3">
                      <div className="flex flex-col items-center justify-center gap-1 border-l border-white/5">
                        <span className="iranyekan-regular text-[11px] text-purple-300/50">تاریخ</span>
                        <span className={cn("iranyekan-regular text-[13px]", isNext ? "font-semibold text-purple-100" : "text-purple-200/70")}>{dateStr}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1 border-l border-white/5">
                        <span className="iranyekan-regular text-[11px] text-purple-300/50">روز</span>
                        <span className={cn("iranyekan-regular text-[13px]", isNext ? "font-semibold text-purple-100" : "text-purple-200/70")}>{dayStr}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="iranyekan-regular text-[11px] text-purple-300/50">ساعت</span>
                        <span className={cn("iranyekan-regular font-mono text-[13px] tracking-wider", isNext ? "font-bold text-purple-200" : "text-purple-300/60")}>{timeStr}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex w-full pt-1">
                      {isJoinable ? (
                        <a
                          href={session.meetingUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="iranyekan-demibold flex w-full items-center justify-center gap-2 rounded-xl border border-purple-400/50 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-[1.02]"
                        >
                          <span>ورود به جلسه</span>
                          <Video className="h-4 w-4 animate-pulse text-purple-200" />
                        </a>
                      ) : isBefore5Min ? (
                        <span
                          className="iranyekan-demibold flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 py-3 text-[13px] font-medium text-purple-300/70 cursor-not-allowed"
                        >
                          <span>ورود از ۵ دقیقه قبل فعال می‌شود</span>
                          <Clock className="h-4 w-4 text-purple-400/60" />
                        </span>
                      ) : isPast ? (
                        <span className="iranyekan-regular flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-3 text-[13px] font-medium text-purple-300/50">
                          برگزار شد
                        </span>
                      ) : (
                        <span className="iranyekan-regular flex w-full items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 py-3 text-[13px] font-medium text-purple-300/90">
                          به زودی
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

