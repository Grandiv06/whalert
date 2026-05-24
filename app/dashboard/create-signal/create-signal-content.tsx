"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { useCreateSignalLoading } from "@/contexts/create-signal-loading-context";
import {
  AiServiceService,
  GoldPriceService,
  GoldPriceSeries,
  PriceService,
  UserDashboardService,
  type ShowPositionsDto,
} from "@/lib/api/client";
import {
  CreateSignalContent as CreateSignalContentPortable,
  type CreateSignalServices,
} from "@/components/create-signal/create-signal-content";
import { hasSignalCreatorPermission } from "@/lib/auth-session";

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

export function CreateSignalContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const { setAnalyzing, setLeaveModalRequest, setManualDirty } =
    useCreateSignalLoading();
  const canCreateSignal = hasSignalCreatorPermission();

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

  if (!canCreateSignal) return null;

  return (
    <div className="space-y-6">
      <CreateSignalContentPortable
        isDark={theme === "dark"}
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
        className={`rounded-2xl border p-4 md:p-6 ${
          theme === "dark"
            ? "bg-[#02000B]/35 border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
        dir="rtl"
      >
        <h2 className="text-lg font-semibold mb-4">سیگنال‌های من</h2>

        {mySignalsLoading ? (
          <p className={theme === "dark" ? "text-white/70" : "text-gray-600"}>در حال بارگذاری...</p>
        ) : mySignalsError ? (
          <p className="text-red-500">عدم دسترسی به سیگنال‌های ایجاد شده. لطفاً اشتراک فعال خود را بررسی کنید.</p>
        ) : myCreatedSignals.length === 0 ? (
          <p className={theme === "dark" ? "text-white/70" : "text-gray-600"}>هنوز سیگنالی ایجاد نکرده‌اید</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={theme === "dark" ? "text-white/80" : "text-gray-600"}>
                  <th className="text-right py-2">نماد</th>
                  <th className="text-right py-2">نوع</th>
                  <th className="text-right py-2">Entry</th>
                  <th className="text-right py-2">TP</th>
                  <th className="text-right py-2">SL</th>
                  <th className="text-right py-2">وضعیت</th>
                  <th className="text-right py-2">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {myCreatedSignals.map((item) => (
                  <tr key={item.tradingSignalId} className={theme === "dark" ? "border-t border-white/10" : "border-t border-gray-200"}>
                    <td className="py-2">{item.symbol ?? "-"}</td>
                    <td className="py-2">{item.side ?? "-"}</td>
                    <td className="py-2">{item.entryPrice ?? "-"}</td>
                    <td className="py-2">{item.tPs?.join(" ,") ?? "-"}</td>
                    <td className="py-2">{item.sl ?? "-"}</td>
                    <td className="py-2">{item.outcomeStatus ?? "-"}</td>
                    <td className="py-2">{item.datePersian ?? item.date ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
