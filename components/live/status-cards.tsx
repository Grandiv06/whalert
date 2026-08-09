"use client";

import { Clock, Radio, Sparkles, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { LiveSessionDto } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusCardsProps {
  type: "countdown" | "status";
  nextSession?: LiveSessionDto | null;
  isLoading?: boolean;
}

export function StatusCards({ type, nextSession, isLoading }: StatusCardsProps) {
  const [now, setNow] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isLive: false });

  useEffect(() => {
    const updateTimer = () => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (!nextSession?.scheduledStartUtc) return;

      const targetDate = new Date(nextSession.scheduledStartUtc);
      if (isNaN(targetDate.getTime())) return;

      const diff = Math.floor((targetDate.getTime() - currentTime) / 1000);

      if (diff <= 0 && diff >= -7200) {
        // Within 2 hours after start -> Currently live
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isLive: true });
        return;
      }

      const clampedDiff = Math.max(0, diff);
      const totalHours = Math.floor(clampedDiff / 3600);
      const minutes = Math.floor((clampedDiff % 3600) / 60);
      const seconds = clampedDiff % 60;

      setTimeLeft({ hours: totalHours, minutes, seconds, isLive: false });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [nextSession?.scheduledStartUtc]);

  if (isLoading) {
    return <Skeleton className="h-[280px] w-full rounded-3xl bg-[#542C85]/20 md:min-h-[300px]" />;
  }

  if (type === "countdown") {
    const hasNext = !!nextSession?.scheduledStartUtc;

    return (
      <div className="group relative flex h-full min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#120726]/90 via-[#0a0318]/95 to-[#060110]/95 p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(84,44,133,0.35)] backdrop-blur-xl transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_25px_60px_-10px_rgba(147,51,234,0.4)] md:min-h-[300px]">
        {/* Top edge neon gradient glow line */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent shadow-[0_0_12px_rgba(192,132,252,0.8)]" />

        {/* Ambient background glowing spots */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-600/15 blur-[90px] transition-all duration-700 group-hover:bg-purple-600/25" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-fuchsia-600/10 blur-[90px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.08),transparent_70%)]" />

        {/* Header section */}
        <div className="relative z-10 flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.25)] backdrop-blur-md">
              <Clock className="h-5 w-5 text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <span className="iranyekan-demibold text-[15px] font-semibold text-purple-100 tracking-wide">
                زمان باقیمانده تا جلسه بعدی
              </span>
              <span className="iranyekan-regular text-[12px] text-purple-300/60 truncate max-w-[220px]">
                {nextSession?.title || "شروع رأس ساعت مقرر"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[11px] font-medium text-purple-300/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
            <span>{timeLeft.isLive ? "در حال برگزاری" : "شمارش معکوس"}</span>
          </div>
        </div>

        {/* Digital Clock Box Display */}
        <div className="relative z-10 my-auto flex w-full items-center justify-center gap-3 sm:gap-4 md:gap-6 py-4" dir="ltr">
          {/* Hours Card */}
          <div className="flex flex-col items-center">
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-purple-400/25 bg-gradient-to-b from-[#221045]/90 via-[#15092e]/90 to-[#0c041c]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_25px_-5px_rgba(0,0,0,0.5)] backdrop-blur-md transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-purple-300/30" />
              <span className="font-mono text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300 drop-shadow-[0_4px_12px_rgba(168,85,247,0.4)] sm:text-4xl md:text-5xl">
                {hasNext ? String(timeLeft.hours).padStart(2, "0") : "--"}
              </span>
            </div>
            <span className="iranyekan-medium mt-2.5 text-[12px] font-medium text-purple-300/70 sm:text-[13px]">
              ساعت
            </span>
          </div>

          {/* Glowing Colon */}
          <div className="flex flex-col gap-2 pb-6">
            <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.9)] animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.9)] animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>

          {/* Minutes Card */}
          <div className="flex flex-col items-center">
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-purple-400/25 bg-gradient-to-b from-[#221045]/90 via-[#15092e]/90 to-[#0c041c]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_25px_-5px_rgba(0,0,0,0.5)] backdrop-blur-md transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-purple-300/30" />
              <span className="font-mono text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300 drop-shadow-[0_4px_12px_rgba(168,85,247,0.4)] sm:text-4xl md:text-5xl">
                {hasNext ? String(timeLeft.minutes).padStart(2, "0") : "--"}
              </span>
            </div>
            <span className="iranyekan-medium mt-2.5 text-[12px] font-medium text-purple-300/70 sm:text-[13px]">
              دقیقه
            </span>
          </div>

          {/* Glowing Colon */}
          <div className="flex flex-col gap-2 pb-6">
            <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.9)] animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.9)] animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>

          {/* Seconds Card */}
          <div className="flex flex-col items-center">
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-purple-400/30 bg-gradient-to-b from-[#2a1354]/90 via-[#180a36]/90 to-[#0d041e]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_25px_-5px_rgba(168,85,247,0.3)] backdrop-blur-md transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-purple-300/40" />
              <span className="font-mono text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-fuchsia-100 to-purple-200 drop-shadow-[0_4px_14px_rgba(217,70,239,0.5)] sm:text-4xl md:text-5xl">
                {hasNext ? String(timeLeft.seconds).padStart(2, "0") : "--"}
              </span>
            </div>
            <span className="iranyekan-medium mt-2.5 text-[12px] font-medium text-purple-300/70 sm:text-[13px]">
              ثانیه
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Type === "status"
  const isCurrentlyLive = timeLeft.isLive;
  const sessionTitle = nextSession?.title || "جلسه تحلیل زنده بازار طلا";
  const presenterName = nextSession?.signalProviderName ? `استاد / مدرس: ${nextSession.signalProviderName}` : null;
  const persianDate = nextSession?.scheduledAtPersian;

  // 5 minutes before scheduled start logic
  const scheduledTime = nextSession?.scheduledStartUtc ? new Date(nextSession.scheduledStartUtc).getTime() : NaN;
  const isValidTime = !isNaN(scheduledTime);
  const fiveMinBefore = isValidTime ? scheduledTime - 5 * 60 * 1000 : null;
  const sessionEnd = isValidTime ? scheduledTime + 2 * 60 * 60 * 1000 : null;

  const isBefore5Min = isValidTime && fiveMinBefore !== null && now < fiveMinBefore;
  const isPast = isValidTime && sessionEnd !== null && now > sessionEnd;
  const isJoinable = Boolean(nextSession?.meetingUrl) && (
    !isValidTime || (fiveMinBefore !== null && sessionEnd !== null && now >= fiveMinBefore && now <= sessionEnd)
  );

  return (
    <div className="group relative flex h-full min-h-[280px] w-full items-center justify-between overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-[#06241a]/90 via-[#041611]/95 to-[#020b08]/95 p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.3)] backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/45 hover:shadow-[0_25px_60px_-10px_rgba(16,185,129,0.35)] md:min-h-[300px]">
      {/* Top edge emerald neon line */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent shadow-[0_0_14px_rgba(52,211,153,0.9)]" />

      {/* Ambient glowing light orbs */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-60 w-60 rounded-full bg-emerald-500/15 blur-[90px] transition-all duration-700 group-hover:bg-emerald-500/25" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-60 w-60 rounded-full bg-teal-600/10 blur-[90px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(52,211,153,0.12),transparent_70%)]" />

      <div className="relative z-10 flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-center">
        {/* Live Signal Radar Node (Visual Centerpiece) */}
        <div className="relative flex shrink-0 items-center justify-center self-center sm:self-auto">
          {/* Animated Wave Rings */}
          <div className="absolute h-28 w-28 rounded-full border border-emerald-400/20 animate-ping [animation-duration:3s]" />
          <div className="absolute h-36 w-36 rounded-full border border-emerald-500/10 animate-pulse [animation-duration:2s]" />

          {/* Outer Ring Glass Container */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/35 bg-gradient-to-br from-[#064e3b]/50 to-[#022c22]/80 p-2 shadow-[0_0_35px_rgba(16,185,129,0.35),inset_0_0_20px_rgba(52,211,153,0.2)] backdrop-blur-md transition-transform duration-500 group-hover:scale-105 sm:h-28 sm:w-28">
            <div className="absolute inset-1.5 rounded-full border border-emerald-300/20" />
            
            {/* Core Pulse Button */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-700 shadow-[0_0_25px_rgba(52,211,153,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] sm:h-16 sm:w-16">
              <Radio
                className="h-7 w-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] sm:h-8 sm:w-8"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Info & Text Content */}
        <div className="flex w-full flex-col items-center text-center sm:items-start sm:text-right">
          {/* Status Badge */}
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]" />
            </span>
            <span className="iranyekan-medium text-[12px] font-semibold text-emerald-200 tracking-wide">
              {isCurrentlyLive
                ? "وضعیت جلسه: آنلاین و فعال"
                : persianDate
                ? `زمان جلسه: ${persianDate}`
                : "برنامه جلسات لایو"}
            </span>
          </div>

          {/* Main Title */}
          <h3 className="iranyekan-black mb-2 text-2xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-300 to-teal-100 drop-shadow-[0_2px_15px_rgba(16,185,129,0.35)] sm:text-3xl md:text-[28px] line-clamp-2">
            {sessionTitle}
          </h3>

          {/* Subtitle / Note */}
          <p className="iranyekan-regular max-w-[340px] text-[13px] leading-relaxed text-emerald-100/75 sm:text-[14px]">
            {presenterName || "لطفاً چند دقیقه قبل از شروع جلسه در روم آنلاین حضور داشته باشید."}
          </p>

          {/* Live Action Link */}
          {isJoinable ? (
            <a
              href={nextSession!.meetingUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-400/50 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]"
            >
              <span>ورود به تالار تحلیل آنلاین</span>
              <ArrowLeft className="h-4 w-4 text-emerald-100 transition-transform duration-300 group-hover:-translate-x-1" />
            </a>
          ) : isBefore5Min ? (
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-semibold text-emerald-300/80 backdrop-blur-sm cursor-not-allowed opacity-90"
              title="دکمه ورود ۵ دقیقه قبل از شروع جلسه فعال می‌شود"
            >
              <span>ورود از ۵ دقیقه قبل از جلسه</span>
              <Clock className="h-4 w-4 text-emerald-400/70" />
            </div>
          ) : isPast ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-semibold text-emerald-300/50">
              <span>برگزار شد</span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors">
              <span>به زودی</span>
              <ArrowLeft className="h-4 w-4 text-emerald-400 transition-transform duration-300 group-hover:-translate-x-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
