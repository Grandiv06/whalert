"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  Pencil,
  RefreshCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useCreateSignalLoading } from "@/contexts/create-signal-loading-context";
import {
  AiServiceService,
  GoldPriceService,
  GoldPriceSeries,
  PriceService,
  SignalOutcomeStatus,
  SignalSide,
  SignalProviderService,
  UserDashboardService,
  type ShowPositionsDto,
} from "@/lib/api/client";
import {
  CreateSignalContent as CreateSignalContentPortable,
  type CreateSignalServices,
} from "@/components/create-signal/create-signal-content";
import { hasSignalCreatorPermission } from "@/lib/auth-session";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const createSignalServices: CreateSignalServices = {
  getDynamicPrice: async (symbol, timeframe, fromIso, toIso) => {
    if (symbol === "XAUUSD" || symbol === "MAZAANE") {
      const timeframeMinutesMap: Record<string, number> = {
        "1m": 1,
        "5m": 5,
        "15m": 15,
        "30m": 30,
        "1h": 60,
        "4h": 240,
        "1d": 1440,
      };
      const intervalMinutes = timeframeMinutesMap[timeframe] ?? 15;
      const series = symbol === "XAUUSD" ? GoldPriceSeries._0 : GoldPriceSeries._1;

      const candlesRaw = await GoldPriceService.apiServicesAppGoldpriceGetgoldpricecandlesGet(
        series,
        intervalMinutes,
        fromIso,
        toIso,
      );

      // Handle ABP wrapper if present
      const candles = (Array.isArray(candlesRaw) ? candlesRaw : (candlesRaw as any)?.result) ?? [];
      
      console.log('App CreateSignal getDynamicPrice:', { 
        symbol, 
        timeframe, 
        rawCount: (candlesRaw as any)?.length,
        hasResult: !!(candlesRaw as any)?.result,
        extractedCount: candles.length 
      });

      return {
        response: candles.map((candle: any) => ({
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          openCandleTime: candle.bucketStart
            ? Math.floor(new Date(candle.bucketStart).getTime() / 1000)
            : undefined,
        })),
      };
    }

    return PriceService.apiServicesAppPriceGetdynamicpriceGet(
      symbol,
      timeframe,
      fromIso,
      toIso,
    );
  },
  fetchDataFromImageFromUrl: (payload) =>
    AiServiceService.apiServicesAppAiserviceFetchdatafromimagefromurlPost(payload),
  submitSignalFromImageAnalysis: (payload) =>
    UserDashboardService.apiServicesAppUserdashboardSubmitsignalfromimageanalysisPost(
      payload as any,
    ),
  submitSignalFromUserInput: (payload) =>
    UserDashboardService.apiServicesAppUserdashboardSubmitsignalfromuserinputPost(
      payload,
    ),
};

const createSignalConfig = {
  availableSymbols: [
    { label: "مظنه", value: "مظنه طلا", apiSymbol: "MAZAANE" },
    { label: "انس", value: "انس", apiSymbol: "XAUUSD" },
  ],
};

type BadgeMeta = {
  label: string;
  className: string;
};

function formatNumber(value?: number | null): string {
  if (value === undefined || value === null) return "-";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value >= 1000 ? 2 : 0,
    maximumFractionDigits: value >= 1000 ? 2 : 4,
  });
}

function getSignalTypeBadge(side?: SignalSide, isDark?: boolean): BadgeMeta {
  if (side === SignalSide._1) {
    return {
      label: "خرید",
      className: isDark
        ? "text-emerald-300 bg-emerald-500/15 border-emerald-400/35"
        : "text-emerald-700 bg-emerald-100 border-emerald-200",
    };
  }
  if (side === SignalSide._2) {
    return {
      label: "فروش",
      className: isDark
        ? "text-rose-300 bg-rose-500/15 border-rose-400/35"
        : "text-rose-700 bg-rose-100 border-rose-200",
    };
  }
  return {
    label: "نامشخص",
    className: isDark
      ? "text-white/70 bg-white/10 border-white/15"
      : "text-gray-700 bg-gray-100 border-gray-200",
  };
}

function getOutcomeStatusBadge(
  outcomeStatus?: SignalOutcomeStatus,
  isDark?: boolean,
): BadgeMeta {
  if (outcomeStatus === SignalOutcomeStatus._1) {
    return {
      label: "حد سود",
      className: isDark
        ? "text-emerald-300 bg-emerald-500/15 border-emerald-400/35"
        : "text-emerald-700 bg-emerald-100 border-emerald-200",
    };
  }
  if (outcomeStatus === SignalOutcomeStatus._2) {
    return {
      label: "حد ضرر",
      className: isDark
        ? "text-rose-300 bg-rose-500/15 border-rose-400/35"
        : "text-rose-700 bg-rose-100 border-rose-200",
    };
  }
  if (outcomeStatus === SignalOutcomeStatus._3) {
    return {
      label: "بسته شده",
      className: isDark
        ? "text-amber-300 bg-amber-500/15 border-amber-400/35"
        : "text-amber-700 bg-amber-100 border-amber-200",
    };
  }
  return {
    label: "فعال",
    className: isDark
      ? "text-violet-200 bg-violet-500/15 border-violet-400/35"
      : "text-violet-700 bg-violet-100 border-violet-200",
  };
}

function isFinalizedSignal(outcomeStatus?: SignalOutcomeStatus): boolean {
  return (
    outcomeStatus === SignalOutcomeStatus._1 ||
    outcomeStatus === SignalOutcomeStatus._2 ||
    outcomeStatus === SignalOutcomeStatus._3
  );
}

function getVisibleAndHiddenTpValues(
  takeProfits?: Array<number> | null,
  visibleCount = 2,
): { visible: number[]; hidden: number[] } {
  if (!Array.isArray(takeProfits) || takeProfits.length === 0) {
    return { visible: [], hidden: [] };
  }
  return {
    visible: takeProfits.slice(0, visibleCount),
    hidden: takeProfits.slice(visibleCount),
  };
}

export function CreateSignalContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const { setAnalyzing, setLeaveModalRequest, setManualDirty } =
    useCreateSignalLoading();
  const canCreateSignal = hasSignalCreatorPermission();
  const [isDeclaringStatus, setIsDeclaringStatus] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    message: string;
    kind: "success" | "error";
  } | null>(null);
  const [statusModal, setStatusModal] = useState<{
    tradingSignalId: number;
    symbol: string;
  } | null>(null);

  const {
    data: myCreatedSignals = [],
    isLoading: mySignalsLoading,
    error: mySignalsError,
    refetch: refetchMySignals,
  } = useQuery({
    queryKey: ["create-signal-my-created-signals"],
    enabled: canCreateSignal,
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmycreatedsignalsPost({
          maxResultCount: 20,
          skipCount: 0,
        });
      const payload = (res as { result?: { items?: ShowPositionsDto[] | null } }).result ?? res;
      return payload.items ?? [];
    },
  });

  const mySignalsStatus =
    typeof mySignalsError === "object" && mySignalsError && "status" in mySignalsError
      ? Number((mySignalsError as { status?: number }).status)
      : null;

  useEffect(() => {
    if (mySignalsStatus === 401 || mySignalsStatus === 403) {
      router.replace("/dashboard/opportunities/");
    }
  }, [mySignalsStatus, router]);

  const handleDeclareOutcome = async (outcomeStatus: SignalOutcomeStatus) => {
    if (!statusModal?.tradingSignalId || isDeclaringStatus) return;
    setIsDeclaringStatus(true);
    setActionFeedback(null);
    try {
      await SignalProviderService.apiServicesAppSignalproviderDeclaresignaloutcomePost({
        tradingSignalId: statusModal.tradingSignalId,
        outcomeStatus,
      });
      setActionFeedback({
        message: "وضعیت سیگنال با موفقیت ثبت شد.",
        kind: "success",
      });
      setStatusModal(null);
      await refetchMySignals();
    } catch {
      setActionFeedback({
        message: "ثبت وضعیت سیگنال ناموفق بود. لطفاً دوباره تلاش کنید.",
        kind: "error",
      });
    } finally {
      setIsDeclaringStatus(false);
    }
  };

  if (!canCreateSignal) return null;
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      <CreateSignalContentPortable
        isDark={isDark}
        pathname={pathname}
        onAnalyzingChange={setAnalyzing}
        onManualDirtyChange={setManualDirty}
        onLeaveModalRequest={setLeaveModalRequest}
        onSignalCreated={async () => {
          await refetchMySignals();
        }}
        services={createSignalServices}
        config={createSignalConfig}
      />

      <section
        className={cn(
          "relative overflow-hidden rounded-[28px] border p-4 md:p-6 shadow-[0_20px_70px_-25px_rgba(84,44,133,0.85)]",
          isDark
            ? "bg-gradient-to-br from-[#09031A]/92 via-[#100426]/88 to-[#060114]/92 border-[#C09CFF]/18 text-white backdrop-blur-xl"
            : "bg-white border-gray-200 text-gray-900",
        )}
        dir="rtl"
      >
        {isDark && (
          <div className="pointer-events-none absolute -top-24 -left-8 h-60 w-60 rounded-full bg-[#7A3FE0]/18 blur-3xl" />
        )}
        {isDark && (
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-[#3D1D77]/30 blur-2xl" />
        )}

        <div className="relative z-10 mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight">سیگنال‌های من</h2>
            <p className={cn("mt-1 text-xs md:text-sm", isDark ? "text-white/65" : "text-gray-600")}>
              لیست سیگنال‌هایی که شما ایجاد کرده‌اید
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
              isDark
                ? "border-violet-300/25 bg-violet-500/15 text-violet-100"
                : "border-violet-200 bg-violet-100 text-violet-700",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {myCreatedSignals.length} سیگنال
          </span>
        </div>

        {actionFeedback && (
          <div
            className={cn(
              "mb-4 rounded-xl border px-3 py-2 text-xs md:text-sm",
              actionFeedback.kind === "success"
                ? isDark
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                : isDark
                  ? "border-rose-400/30 bg-rose-500/10 text-rose-200"
                  : "border-rose-200 bg-rose-50 text-rose-700",
            )}
          >
            {actionFeedback.message}
          </div>
        )}

        {mySignalsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className={cn(
                  "rounded-2xl border p-3 md:p-4",
                  isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50",
                )}
              >
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  <Skeleton className="h-4 col-span-2 bg-white/10" />
                  <Skeleton className="h-6 col-span-2 bg-white/10" />
                  <Skeleton className="h-4 col-span-2 bg-white/10" />
                  <Skeleton className="h-4 col-span-2 bg-white/10" />
                  <Skeleton className="h-4 col-span-2 bg-white/10" />
                  <Skeleton className="h-8 col-span-2 bg-white/10" />
                </div>
                <div className="md:hidden space-y-2">
                  <Skeleton className="h-4 w-28 bg-white/10" />
                  <Skeleton className="h-6 w-20 bg-white/10" />
                  <Skeleton className="h-3 w-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : mySignalsError ? (
          <div
            className={cn(
              "rounded-2xl border px-4 py-5 text-sm",
              isDark
                ? "border-rose-400/25 bg-rose-500/10 text-rose-200"
                : "border-rose-200 bg-rose-50 text-rose-700",
            )}
          >
            عدم دسترسی به سیگنال‌های ایجاد شده. لطفاً اشتراک فعال خود را بررسی کنید.
          </div>
        ) : myCreatedSignals.length === 0 ? (
          <div
            className={cn(
              "rounded-2xl border px-4 py-12 text-center",
              isDark
                ? "border-white/10 bg-white/[0.02]"
                : "border-gray-200 bg-gray-50",
            )}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/25 bg-violet-500/15">
              <TrendingUp className="h-7 w-7 text-violet-200" />
            </div>
            <p className="text-base font-semibold">هنوز سیگنالی ایجاد نکرده‌اید</p>
            <p className={cn("mt-1 text-sm", isDark ? "text-white/60" : "text-gray-600")}>
              بعد از ایجاد اولین سیگنال، اینجا نمایش داده می‌شود
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              className={cn(
                "hidden md:block overflow-x-auto rounded-2xl border",
                isDark ? "border-white/10 bg-white/[0.02]" : "border-gray-200 bg-white",
              )}
            >
              <table className="w-full min-w-[980px] text-xs lg:text-sm">
                <thead
                  className={cn(
                    "sticky top-0 z-10 backdrop-blur-md",
                    isDark ? "bg-[#12072A]/95 text-white/75" : "bg-gray-50 text-gray-600",
                  )}
                >
                  <tr className="border-b border-white/10">
                    <th className="text-right px-4 py-3 font-medium">نماد</th>
                    <th className="text-right px-4 py-3 font-medium">نوع</th>
                    <th className="text-right px-4 py-3 font-medium">Entry</th>
                    <th className="text-right px-4 py-3 font-medium">Take Profit</th>
                    <th className="text-right px-4 py-3 font-medium">Stop Loss</th>
                    <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                    <th className="text-right px-4 py-3 font-medium">تاریخ ایجاد</th>
                    <th className="text-right px-4 py-3 font-medium">اقدامات</th>
                  </tr>
                </thead>
                <tbody>
                  {myCreatedSignals.map((item, index) => {
                    const typeBadge = getSignalTypeBadge(item.side, isDark);
                    const statusBadge = getOutcomeStatusBadge(item.outcomeStatus, isDark);
                    const finalized = isFinalizedSignal(item.outcomeStatus);
                    const tpSplit = getVisibleAndHiddenTpValues(item.tPs, 2);
                    return (
                      <tr
                        key={item.tradingSignalId ?? `row-${index}`}
                        className={cn(
                          "border-b border-white/10 transition-colors",
                          index % 2 === 0
                            ? isDark
                              ? "bg-white/[0.015]"
                              : "bg-gray-50/70"
                            : "bg-transparent",
                          isDark ? "hover:bg-violet-500/10" : "hover:bg-violet-50",
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
                            {item.symbol ?? "-"}
                          </div>
                          <div className={cn("mt-0.5 text-[11px]", isDark ? "text-white/55" : "text-gray-500")}>
                            {item.market ?? "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", typeBadge.className)}>
                            {typeBadge.label}
                          </span>
                        </td>
                        <td className={cn("px-4 py-3 font-medium tabular-nums", isDark ? "text-white/90" : "text-gray-900")} dir="ltr">
                          {formatNumber(item.entryPrice)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {tpSplit.visible.length > 0 ? (
                              tpSplit.visible.map((tp, tpIndex) => (
                                <span
                                  key={`${item.tradingSignalId}-tp-${tpIndex}`}
                                  className={cn(
                                    "inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                                    isDark
                                      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700",
                                  )}
                                  dir="ltr"
                                >
                                  {formatNumber(tp)}
                                </span>
                              ))
                            ) : (
                              <span className={isDark ? "text-white/45" : "text-gray-400"}>-</span>
                            )}
                            {tpSplit.hidden.length > 0 && (
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold",
                                  isDark
                                    ? "border-violet-400/25 bg-violet-500/10 text-violet-200"
                                    : "border-violet-200 bg-violet-100 text-violet-700",
                                )}
                                title={tpSplit.hidden.map((tp) => formatNumber(tp)).join(" | ")}
                              >
                                +{tpSplit.hidden.length}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold tabular-nums",
                              isDark
                                ? "border-rose-400/20 bg-rose-500/10 text-rose-200"
                                : "border-rose-200 bg-rose-50 text-rose-700",
                            )}
                            dir="ltr"
                          >
                            <TrendingDown className="h-3.5 w-3.5" />
                            {formatNumber(item.sl)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", statusBadge.className)}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className={cn("px-4 py-3 text-[12px]", isDark ? "text-white/75" : "text-gray-600")}>
                          {item.datePersian ?? item.date ?? "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href="/dashboard/opportunities/"
                              className={cn(
                                "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors",
                                isDark
                                  ? "border-violet-300/25 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20"
                                  : "border-violet-200 bg-violet-100 text-violet-700 hover:bg-violet-200",
                              )}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              جزئیات
                            </Link>
                            <button
                              type="button"
                              disabled={finalized}
                              className={cn(
                                "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors",
                                finalized
                                  ? "cursor-not-allowed opacity-45 border-white/15 text-white/50"
                                  : isDark
                                    ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                                    : "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
                              )}
                              title={finalized ? "برای سیگنال نهایی شده امکان ویرایش وجود ندارد" : "ویرایش (به‌زودی)"}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              ویرایش
                            </button>
                            <button
                              type="button"
                              disabled={finalized || !item.tradingSignalId}
                              onClick={() =>
                                item.tradingSignalId &&
                                setStatusModal({
                                  tradingSignalId: item.tradingSignalId,
                                  symbol: item.symbol ?? "-",
                                })
                              }
                              title={
                                finalized
                                  ? "وضعیت سیگنال نهایی شده است"
                                  : "ثبت وضعیت نتیجه سیگنال"
                              }
                              className={cn(
                                "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors",
                                finalized || !item.tradingSignalId
                                  ? "cursor-not-allowed opacity-45 border-white/15 text-white/50"
                                  : isDark
                                    ? "border-sky-300/25 bg-sky-500/10 text-sky-100 hover:bg-sky-500/20"
                                    : "border-sky-200 bg-sky-100 text-sky-700 hover:bg-sky-200",
                              )}
                            >
                              <RefreshCcw className="h-3.5 w-3.5" />
                              تغییر وضعیت
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {myCreatedSignals.map((item, index) => {
                const typeBadge = getSignalTypeBadge(item.side, isDark);
                const statusBadge = getOutcomeStatusBadge(item.outcomeStatus, isDark);
                const finalized = isFinalizedSignal(item.outcomeStatus);
                const tpSplit = getVisibleAndHiddenTpValues(item.tPs, 2);
                return (
                  <article
                    key={item.tradingSignalId ?? `card-${index}`}
                    className={cn(
                      "rounded-2xl border p-3.5",
                      isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white",
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
                          {item.symbol ?? "-"}
                        </p>
                        <p className={cn("text-[11px]", isDark ? "text-white/55" : "text-gray-500")}>
                          {item.datePersian ?? item.date ?? "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", typeBadge.className)}>
                          {typeBadge.label}
                        </span>
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", statusBadge.className)}>
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      <div className={cn("rounded-xl border px-2.5 py-2", isDark ? "border-white/10 bg-white/[0.02]" : "border-gray-200 bg-gray-50")}>
                        <p className={cn("mb-1", isDark ? "text-white/55" : "text-gray-500")}>Entry</p>
                        <p className={cn("font-semibold tabular-nums", isDark ? "text-white" : "text-gray-900")} dir="ltr">
                          {formatNumber(item.entryPrice)}
                        </p>
                      </div>
                      <div className={cn("rounded-xl border px-2.5 py-2", isDark ? "border-rose-400/20 bg-rose-500/10" : "border-rose-200 bg-rose-50")}>
                        <p className={cn("mb-1", isDark ? "text-rose-200/80" : "text-rose-700/80")}>SL</p>
                        <p className={cn("font-semibold tabular-nums", isDark ? "text-rose-100" : "text-rose-700")} dir="ltr">
                          {formatNumber(item.sl)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className={cn("mb-1.5 text-[11px]", isDark ? "text-white/55" : "text-gray-500")}>Take Profit</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tpSplit.visible.length > 0 ? (
                          tpSplit.visible.map((tp, tpIndex) => (
                            <span
                              key={`${item.tradingSignalId}-mobile-tp-${tpIndex}`}
                              className={cn(
                                "inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                                isDark
                                  ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700",
                              )}
                              dir="ltr"
                            >
                              {formatNumber(tp)}
                            </span>
                          ))
                        ) : (
                          <span className={cn("text-[12px]", isDark ? "text-white/45" : "text-gray-400")}>-</span>
                        )}
                        {tpSplit.hidden.length > 0 && (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold",
                              isDark
                                ? "border-violet-400/25 bg-violet-500/10 text-violet-200"
                                : "border-violet-200 bg-violet-100 text-violet-700",
                            )}
                            title={tpSplit.hidden.map((tp) => formatNumber(tp)).join(" | ")}
                          >
                            +{tpSplit.hidden.length}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Link
                        href="/dashboard/opportunities/"
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
                          isDark
                            ? "border-violet-300/25 bg-violet-500/10 text-violet-100"
                            : "border-violet-200 bg-violet-100 text-violet-700",
                        )}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        جزئیات
                      </Link>
                      <button
                        type="button"
                        disabled={finalized}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
                          finalized
                            ? "cursor-not-allowed opacity-45 border-white/15 text-white/50"
                            : isDark
                              ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-100"
                              : "border-emerald-200 bg-emerald-100 text-emerald-700",
                        )}
                        title={finalized ? "برای سیگنال نهایی شده امکان ویرایش وجود ندارد" : "ویرایش (به‌زودی)"}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        ویرایش
                      </button>
                      <button
                        type="button"
                        disabled={finalized || !item.tradingSignalId}
                        onClick={() =>
                          item.tradingSignalId &&
                          setStatusModal({
                            tradingSignalId: item.tradingSignalId,
                            symbol: item.symbol ?? "-",
                          })
                        }
                        title={
                          finalized
                            ? "وضعیت سیگنال نهایی شده است"
                            : "ثبت وضعیت نتیجه سیگنال"
                        }
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
                          finalized || !item.tradingSignalId
                            ? "cursor-not-allowed opacity-45 border-white/15 text-white/50"
                            : isDark
                              ? "border-sky-300/25 bg-sky-500/10 text-sky-100 hover:bg-sky-500/20"
                              : "border-sky-200 bg-sky-100 text-sky-700 hover:bg-sky-200",
                        )}
                      >
                        <RefreshCcw className="h-3.5 w-3.5" />
                        تغییر وضعیت
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <AlertDialog
        open={!!statusModal}
        onOpenChange={(open) => !open && !isDeclaringStatus && setStatusModal(null)}
      >
        <AlertDialogContent className="bg-[#1A102B] border-white/10" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              تغییر وضعیت سیگنال
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              وضعیت نتیجه برای سیگنال {statusModal?.symbol ?? "-"} را انتخاب کنید.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isDeclaringStatus}
              onClick={() => handleDeclareOutcome(SignalOutcomeStatus._1)}
              className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
            >
              حد سود
            </button>
            <button
              type="button"
              disabled={isDeclaringStatus}
              onClick={() => handleDeclareOutcome(SignalOutcomeStatus._2)}
              className="rounded-lg border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/20 disabled:opacity-50"
            >
              حد ضرر
            </button>
            <button
              type="button"
              disabled={isDeclaringStatus}
              onClick={() => handleDeclareOutcome(SignalOutcomeStatus._3)}
              className="rounded-lg border border-amber-400/30 bg-amber-500/15 px-3 py-2 text-sm text-amber-200 hover:bg-amber-500/20 disabled:opacity-50"
            >
              بسته شده
            </button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeclaringStatus}
              className="bg-transparent text-white/80 border-white/15 hover:bg-white/10"
            >
              بستن
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
