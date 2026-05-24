"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  Loader2,
  Pencil,
  RefreshCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useCreateSignalLoading } from "@/contexts/create-signal-loading-context";
import {
  AiServiceService,
  GoldPriceService,
  GoldPriceSeries,
  MarketType,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
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

function getMarketLabel(market?: MarketType | null): string | null {
  if (market === MarketType._1) return "CRYPTO";
  if (market === MarketType._0) return "FOREX";
  if (market === MarketType._2) return "GOLD";
  return null;
}

type CreateSignalContentPageProps = {
  initialManualEditDraft?: {
    symbolApi?: string;
    side?: "LONG" | "SHORT";
    entry?: number;
    stopLoss?: number;
    takeProfits?: number[];
    description?: string;
  } | null;
};

export function CreateSignalContent({
  initialManualEditDraft = null,
}: CreateSignalContentPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const { setAnalyzing, setLeaveModalRequest, setManualDirty } =
    useCreateSignalLoading();
  const canCreateSignal = hasSignalCreatorPermission();
  const [isDeclaringStatus, setIsDeclaringStatus] = useState(false);
  const [pendingOutcomeStatus, setPendingOutcomeStatus] =
    useState<SignalOutcomeStatus | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    message: string;
    kind: "success" | "error";
  } | null>(null);
  const [statusModal, setStatusModal] = useState<{
    tradingSignalId: number;
    symbol: string;
  } | null>(null);
  const [editingSignalId, setEditingSignalId] = useState<number | null>(null);

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

  useEffect(() => {
    setPendingOutcomeStatus(null);
  }, [statusModal?.tradingSignalId]);

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
      setPendingOutcomeStatus(null);
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

  const handleOpenEditSignal = async (
    tradingSignalId?: number,
    fallbackSymbol?: string | null,
  ) => {
    if (!tradingSignalId || editingSignalId !== null) return;
    setEditingSignalId(tradingSignalId);
    setActionFeedback(null);
    try {
      const res = await SignalProviderService.apiServicesAppSignalproviderGetmysignalforeditPost(
        { tradingSignalId },
      );
      const payload = (
        res as {
          result?: {
            tradingSignalId?: number;
            symbol?: string | null;
            side?: SignalSide;
            entryPrice?: number;
            stopLoss?: number;
            takeProfits?: number[] | null;
            description?: string | null;
            pictureUrl?: string | null;
            isEditable?: boolean;
          };
          tradingSignalId?: number;
          symbol?: string | null;
          side?: SignalSide;
          entryPrice?: number;
          stopLoss?: number;
          takeProfits?: number[] | null;
          description?: string | null;
          pictureUrl?: string | null;
          isEditable?: boolean;
        }
      ).result ?? res;

      if (payload.isEditable === false) {
        setActionFeedback({
          message: "این سیگنال دیگر قابل ویرایش نیست.",
          kind: "error",
        });
        return;
      }

      const params = new URLSearchParams();
      params.set("edit", "1");
      params.set("symbol", payload.symbol ?? fallbackSymbol ?? "");
      params.set("side", payload.side === SignalSide._2 ? "SHORT" : "LONG");
      if (payload.entryPrice != null) params.set("entry", String(payload.entryPrice));
      if (payload.stopLoss != null) params.set("stopLoss", String(payload.stopLoss));
      if (Array.isArray(payload.takeProfits) && payload.takeProfits.length > 0) {
        params.set("takeProfits", payload.takeProfits.join(","));
      }
      if (payload.description) params.set("description", payload.description);

      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => {
        router.push(`/dashboard/create-signal/?${params.toString()}`);
      }, 220);
    } catch {
      setActionFeedback({
        message: "دریافت اطلاعات سیگنال برای ویرایش ناموفق بود.",
        kind: "error",
      });
    } finally {
      setEditingSignalId(null);
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
        initialManualEditDraft={initialManualEditDraft}
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
                    const tpSplit = getVisibleAndHiddenTpValues(item.tPs, 1);
                    const marketLabel = getMarketLabel(item.market);
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
                          {marketLabel && (
                            <div className={cn("mt-0.5 text-[11px]", isDark ? "text-white/55" : "text-gray-500")}>
                              {marketLabel}
                            </div>
                          )}
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
                              tpSplit.hidden.length > 0 ? (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      className={cn(
                                        "inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                                        isDark
                                          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                                      )}
                                    >
                                      <span
                                        dir="ltr"
                                        className={cn(
                                          "inline-grid h-5 w-6 place-items-center rounded-full border p-0 text-center text-[10px] font-bold leading-none tabular-nums",
                                          isDark
                                            ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                                            : "border-emerald-200 bg-emerald-50 text-emerald-700",
                                        )}
                                      >
                                        +{tpSplit.hidden.length}
                                      </span>
                                      <span className="tabular-nums" dir="ltr">
                                        {formatNumber(tpSplit.visible[0])}
                                      </span>
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="start"
                                    side="bottom"
                                    dir="rtl"
                                    className={cn(
                                      "w-52 rounded-2xl p-3 text-right shadow-[0_18px_40px_rgba(8,3,22,0.75)]",
                                      isDark
                                        ? "border border-[#C4A0FF]/30 bg-[#090516]/95 text-white"
                                        : "border border-gray-200 bg-white text-gray-900",
                                    )}
                                  >
                                    <div className="flex flex-col gap-2.5">
                                      <p className={cn("mb-0.5 border-b pb-1.5 text-xs font-semibold", isDark ? "border-white/10 text-[#C9AEFF]" : "border-gray-200 text-violet-700")}>
                                        حد سودهای هدف
                                      </p>
                                      <div className="flex flex-col gap-1.5 text-xs">
                                        {(item.tPs ?? []).map((tpVal, tpIdx) => (
                                          <div
                                            key={`${item.tradingSignalId}-tp-list-${tpIdx}`}
                                            className={cn(
                                              "flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5",
                                              isDark
                                                ? "border border-white/8 bg-white/[0.03]"
                                                : "border border-gray-200 bg-gray-50",
                                            )}
                                            dir="ltr"
                                          >
                                            <span className={cn("text-[11px] font-semibold tracking-wide", isDark ? "text-white/55" : "text-gray-500")}>
                                              t{tpIdx + 1}
                                            </span>
                                            <span className={cn("font-extrabold", isDark ? "text-emerald-300" : "text-emerald-700")}>
                                              {formatNumber(tpVal)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1.5 rounded-2xl border px-2.5 py-1 text-[11px] font-semibold",
                                    isDark
                                      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700",
                                  )}
                                >
                                  <span className="tabular-nums" dir="ltr">
                                    {formatNumber(tpSplit.visible[0])}
                                  </span>
                                </span>
                              )
                            ) : (
                              <span className={isDark ? "text-white/45" : "text-gray-400"}>-</span>
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
                                "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors",
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
                              disabled={finalized || !item.tradingSignalId || editingSignalId !== null}
                              onClick={() =>
                                handleOpenEditSignal(item.tradingSignalId, item.symbol)
                              }
                              className={cn(
                                "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors",
                                finalized || !item.tradingSignalId
                                  ? "cursor-not-allowed opacity-45 border-white/15 text-white/50"
                                  : isDark
                                    ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                                    : "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
                              )}
                              title={finalized ? "برای سیگنال نهایی شده امکان ویرایش وجود ندارد" : "ویرایش سیگنال"}
                            >
                              {editingSignalId === item.tradingSignalId ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )}
                              {editingSignalId === item.tradingSignalId ? "در حال بارگذاری" : "ویرایش"}
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
                                "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors",
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
                const tpSplit = getVisibleAndHiddenTpValues(item.tPs, 1);
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
                          tpSplit.hidden.length > 0 ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    "inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                                    isDark
                                      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                                  )}
                                >
                                  <span
                                    dir="ltr"
                                    className={cn(
                                      "inline-grid h-5 w-6 place-items-center rounded-full border p-0 text-center text-[10px] font-bold leading-none tabular-nums",
                                      isDark
                                        ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                                        : "border-emerald-200 bg-emerald-50 text-emerald-700",
                                    )}
                                  >
                                    +{tpSplit.hidden.length}
                                  </span>
                                  <span className="tabular-nums" dir="ltr">
                                    {formatNumber(tpSplit.visible[0])}
                                  </span>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                side="bottom"
                                dir="rtl"
                                className={cn(
                                  "w-52 rounded-2xl p-3 text-right shadow-[0_18px_40px_rgba(8,3,22,0.75)]",
                                  isDark
                                    ? "border border-[#C4A0FF]/30 bg-[#090516]/95 text-white"
                                    : "border border-gray-200 bg-white text-gray-900",
                                )}
                              >
                                <div className="flex flex-col gap-2.5">
                                  <p className={cn("mb-0.5 border-b pb-1.5 text-xs font-semibold", isDark ? "border-white/10 text-[#C9AEFF]" : "border-gray-200 text-violet-700")}>
                                    حد سودهای هدف
                                  </p>
                                  <div className="flex flex-col gap-1.5 text-xs">
                                    {(item.tPs ?? []).map((tpVal, tpIdx) => (
                                      <div
                                        key={`${item.tradingSignalId}-mobile-tp-list-${tpIdx}`}
                                        className={cn(
                                          "flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5",
                                          isDark
                                            ? "border border-white/8 bg-white/[0.03]"
                                            : "border border-gray-200 bg-gray-50",
                                        )}
                                        dir="ltr"
                                      >
                                        <span className={cn("text-[11px] font-semibold tracking-wide", isDark ? "text-white/55" : "text-gray-500")}>
                                          t{tpIdx + 1}
                                        </span>
                                        <span className={cn("font-extrabold", isDark ? "text-emerald-300" : "text-emerald-700")}>
                                          {formatNumber(tpVal)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-2xl border px-2.5 py-1 text-[11px] font-semibold",
                                isDark
                                  ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700",
                              )}
                            >
                              <span className="tabular-nums" dir="ltr">
                                {formatNumber(tpSplit.visible[0])}
                              </span>
                            </span>
                          )
                        ) : (
                          <span className={cn("text-[12px]", isDark ? "text-white/45" : "text-gray-400")}>-</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Link
                        href="/dashboard/opportunities/"
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
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
                        disabled={finalized || !item.tradingSignalId || editingSignalId !== null}
                        onClick={() =>
                          handleOpenEditSignal(item.tradingSignalId, item.symbol)
                        }
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
                          finalized || !item.tradingSignalId
                            ? "cursor-not-allowed opacity-45 border-white/15 text-white/50"
                            : isDark
                              ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-100"
                              : "border-emerald-200 bg-emerald-100 text-emerald-700",
                        )}
                        title={finalized ? "برای سیگنال نهایی شده امکان ویرایش وجود ندارد" : "ویرایش سیگنال"}
                      >
                        {editingSignalId === item.tradingSignalId ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Pencil className="h-3.5 w-3.5" />
                        )}
                        {editingSignalId === item.tradingSignalId ? "در حال بارگذاری" : "ویرایش"}
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
                          "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
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
        onOpenChange={(open) => {
          if (!open && !isDeclaringStatus) {
            setPendingOutcomeStatus(null);
            setStatusModal(null);
          }
        }}
      >
        <AlertDialogContent
          className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[#C8A6FF]/20 bg-[radial-gradient(120%_120%_at_80%_0%,rgba(124,77,204,0.28),rgba(12,8,25,0.95)_45%,rgba(7,4,16,0.98)_100%)] px-6 pb-4 pt-5 text-white shadow-[0_30px_80px_-24px_rgba(94,53,177,0.85)] backdrop-blur-xl sm:w-full"
          dir="rtl"
        >
          <button
            type="button"
            disabled={isDeclaringStatus}
            onClick={() => {
              setPendingOutcomeStatus(null);
              setStatusModal(null);
            }}
            aria-label="بستن"
            className="absolute left-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white/80 transition-all hover:bg-white/12 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
          </button>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-lg font-semibold">
              تغییر وضعیت سیگنال
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/75 leading-7">
              وضعیت نتیجه برای سیگنال {statusModal?.symbol ?? "-"} را انتخاب کنید.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={isDeclaringStatus}
              onClick={() => setPendingOutcomeStatus(SignalOutcomeStatus._1)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                pendingOutcomeStatus === SignalOutcomeStatus._1
                  ? "border-emerald-300/55 bg-gradient-to-r from-emerald-500/30 to-emerald-400/18 text-emerald-50 shadow-[0_0_24px_-10px_rgba(16,185,129,0.9)]"
                  : pendingOutcomeStatus && pendingOutcomeStatus !== SignalOutcomeStatus._1
                    ? "border-white/15 bg-white/[0.04] text-white/45 hover:text-white/70"
                    : "border-emerald-300/35 bg-gradient-to-r from-emerald-500/18 to-emerald-400/10 text-emerald-100 hover:brightness-110 hover:shadow-[0_0_24px_-10px_rgba(16,185,129,0.9)]",
              )}
            >
              حد سود
            </button>
            <button
              type="button"
              disabled={isDeclaringStatus}
              onClick={() => setPendingOutcomeStatus(SignalOutcomeStatus._2)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                pendingOutcomeStatus === SignalOutcomeStatus._2
                  ? "border-rose-300/55 bg-gradient-to-r from-rose-500/30 to-rose-400/18 text-rose-50 shadow-[0_0_24px_-10px_rgba(244,63,94,0.9)]"
                  : pendingOutcomeStatus && pendingOutcomeStatus !== SignalOutcomeStatus._2
                    ? "border-white/15 bg-white/[0.04] text-white/45 hover:text-white/70"
                    : "border-rose-300/35 bg-gradient-to-r from-rose-500/18 to-rose-400/10 text-rose-100 hover:brightness-110 hover:shadow-[0_0_24px_-10px_rgba(244,63,94,0.9)]",
              )}
            >
              حد ضرر
            </button>
            <button
              type="button"
              disabled={isDeclaringStatus}
              onClick={() => setPendingOutcomeStatus(SignalOutcomeStatus._3)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                pendingOutcomeStatus === SignalOutcomeStatus._3
                  ? "border-amber-300/55 bg-gradient-to-r from-amber-500/30 to-amber-400/18 text-amber-50 shadow-[0_0_24px_-10px_rgba(245,158,11,0.9)]"
                  : pendingOutcomeStatus && pendingOutcomeStatus !== SignalOutcomeStatus._3
                    ? "border-white/15 bg-white/[0.04] text-white/45 hover:text-white/70"
                    : "border-amber-300/35 bg-gradient-to-r from-amber-500/18 to-amber-400/10 text-amber-100 hover:brightness-110 hover:shadow-[0_0_24px_-10px_rgba(245,158,11,0.9)]",
              )}
            >
              بسته شده
            </button>
          </div>
          <div
            className={cn(
              "mt-1 overflow-hidden transition-all duration-300 ease-out",
              pendingOutcomeStatus
                ? "mt-1 max-h-44 opacity-100 translate-y-0"
                : "mt-0 max-h-0 opacity-0 translate-y-2 pointer-events-none",
            )}
          >
            <div className="rounded-xl border border-violet-300/25 bg-violet-500/10 p-3.5">
              <p className="text-sm text-white/90 leading-7">
                آیا از تغییر وضعیت به{" "}
                <span className="font-semibold text-violet-100">
                  «{getOutcomeStatusBadge(pendingOutcomeStatus ?? undefined, true).label}»
                </span>{" "}
                مطمئن هستید؟
              </p>
              <p className="mt-1 text-xs text-rose-200/90">
                این تغییر غیرقابل بازگشت خواهد بود.
              </p>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingOutcomeStatus(null)}
                  disabled={isDeclaringStatus}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors cursor-pointer hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  disabled={isDeclaringStatus || pendingOutcomeStatus === null}
                  onClick={() =>
                    pendingOutcomeStatus !== null &&
                    handleDeclareOutcome(pendingOutcomeStatus)
                  }
                  className="rounded-lg border border-violet-300/35 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/20 px-3 py-1.5 text-xs font-semibold text-violet-100 transition-all cursor-pointer hover:brightness-110 hover:shadow-[0_0_20px_-10px_rgba(167,139,250,0.95)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeclaringStatus ? "در حال ثبت..." : "تایید نهایی"}
                </button>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
