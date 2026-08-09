"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useCreateSignalLoading } from "@/contexts/create-signal-loading-context";
import {
  AiServiceService,
  GoldPriceService,
  GoldPriceSeries,
  PriceService,
  SignalOutcomeStatus,
  SignalProviderService,
  UserDashboardService,
} from "@/lib/api/client";
import {
  CreateSignalContent as CreateSignalContentPortable,
  type CreateSignalServices,
} from "@/components/create-signal/create-signal-content";
import { createSignalSubmissionService } from "@/lib/signal-submission";
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
      const series = symbol === "XAUUSD" ? GoldPriceSeries._3 : GoldPriceSeries._1;

      const candlesRaw = await GoldPriceService.apiServicesAppGoldpriceGetgoldpricecandlesGet(
        series,
        intervalMinutes,
        fromIso,
        toIso,
      );

      // Handle ABP wrapper if present
      type GoldCandle = {
        open?: number;
        high?: number;
        low?: number;
        close?: number;
        bucketStart?: string;
      };
      const wrapper = candlesRaw as { result?: GoldCandle[] } | GoldCandle[];
      const candles = Array.isArray(wrapper)
        ? wrapper
        : (Array.isArray(wrapper.result)
            ? (wrapper.result ?? [])
            : []);

      return {
        response: candles.map((candle) => ({
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

    return PriceService.apiServicesAppPriceGetdynamicpricePost({
      symbol,
      timeFrame: timeframe,
      fromDate: fromIso,
      toDate: toIso,
    });
  },
  fetchDataFromImageFromUrl: (payload) =>
    AiServiceService.apiServicesAppAiserviceFetchdatafromimagefromurlPost(payload),
  submitSignalFromImageAnalysis: (payload) =>
    UserDashboardService.apiServicesAppUserdashboardSubmitsignalfromimageanalysisPost(
      payload as never,
    ),
  submitSignal: createSignalSubmissionService({
    submitJson: (payload) =>
      SignalProviderService.apiServicesAppSignalproviderAddnewsignalPost(
        payload as never,
      ),
    submitMultipart: (payload) =>
      SignalProviderService.apiServicesAppSignalproviderAddnewsignalwithpicturePost(
        payload,
      ),
  }),
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

function getOutcomeStatusBadge(
  outcomeStatus?: SignalOutcomeStatus,
  isDark?: boolean,
): BadgeMeta {
  if (outcomeStatus === SignalOutcomeStatus._1) {
    return {
      label: "TP",
      className: isDark
        ? "text-emerald-300 bg-emerald-500/15 border-emerald-400/35"
        : "text-emerald-700 bg-emerald-100 border-emerald-200",
    };
  }
  if (outcomeStatus === SignalOutcomeStatus._2) {
    return {
      label: "SL",
      className: isDark
        ? "text-rose-300 bg-rose-500/15 border-rose-400/35"
        : "text-rose-700 bg-rose-100 border-rose-200",
    };
  }
  if (outcomeStatus === SignalOutcomeStatus._3) {
    return {
      label: "Closed",
      className: isDark
        ? "text-amber-300 bg-amber-500/15 border-amber-400/35"
        : "text-amber-700 bg-amber-100 border-amber-200",
    };
  }
  return {
    label: "Active",
    className: isDark
      ? "text-violet-200 bg-violet-500/15 border-violet-400/35"
      : "text-violet-700 bg-violet-100 border-violet-200",
  };
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
  const { theme } = useTheme();
  const { setAnalyzing, setLeaveModalRequest, setManualDirty } =
    useCreateSignalLoading();
  const [isDeclaringStatus, setIsDeclaringStatus] = useState(false);
  const [pendingOutcomeStatus, setPendingOutcomeStatus] =
    useState<SignalOutcomeStatus | null>(null);
  const [statusModal, setStatusModal] = useState<{
    tradingSignalId: number;
    symbol: string;
  } | null>(null);

  useEffect(() => {
    setPendingOutcomeStatus(null);
  }, [statusModal?.tradingSignalId]);

  const handleDeclareOutcome = async (outcomeStatus: SignalOutcomeStatus) => {
    if (!statusModal?.tradingSignalId || isDeclaringStatus) return;
    setIsDeclaringStatus(true);
    try {
      await SignalProviderService.apiServicesAppSignalproviderDeclaresignaloutcomePost({
        tradingSignalId: statusModal.tradingSignalId,
        outcomeStatus,
      });
      setPendingOutcomeStatus(null);
      setStatusModal(null);
    } catch {
    } finally {
      setIsDeclaringStatus(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      <CreateSignalContentPortable
        isDark={isDark}
        pathname={pathname}
        onAnalyzingChange={setAnalyzing}
        onManualDirtyChange={setManualDirty}
        onLeaveModalRequest={setLeaveModalRequest}
        services={createSignalServices}
        config={createSignalConfig}
        initialManualEditDraft={initialManualEditDraft}
      />

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isDeclaringStatus}
              onClick={() => setPendingOutcomeStatus(SignalOutcomeStatus._1)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                pendingOutcomeStatus === SignalOutcomeStatus._1
                  ? "border-emerald-300/55 bg-gradient-to-r from-emerald-500/30 to-emerald-400/18 text-emerald-50 shadow-[0_0_24px_-10px_rgba(16,185,129,0.9)]"
                  : pendingOutcomeStatus !== null
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
                  : pendingOutcomeStatus !== null
                    ? "border-white/15 bg-white/[0.04] text-white/45 hover:text-white/70"
                    : "border-rose-300/35 bg-gradient-to-r from-rose-500/18 to-rose-400/10 text-rose-100 hover:brightness-110 hover:shadow-[0_0_24px_-10px_rgba(244,63,94,0.9)]",
              )}
            >
              حد ضرر
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
