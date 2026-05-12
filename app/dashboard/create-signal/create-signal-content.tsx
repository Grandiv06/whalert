"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { useCreateSignalLoading } from "@/contexts/create-signal-loading-context";
import {
  AiServiceService,
  GoldPriceService,
  GoldPriceSeries,
  PriceService,
  UserDashboardService,
} from "@/lib/api/client";
import {
  CreateSignalContent as CreateSignalContentPortable,
  type CreateSignalServices,
} from "@/components/create-signal/create-signal-content";

const createSignalServices: CreateSignalServices = {
  getDynamicPrice: async (symbol, timeframe, fromIso, toIso) => {
    if (symbol === "XAUUSD") {
      const timeframeMinutesMap: Record<string, number> = {
        "5m": 5,
        "15m": 15,
        "30m": 30,
        "1h": 60,
        "4h": 240,
        "1d": 1440,
      };
      const intervalMinutes = timeframeMinutesMap[timeframe] ?? 15;

      const candles = await GoldPriceService.apiServicesAppGoldpriceGetgoldpricecandlesGet(
        GoldPriceSeries._0,
        intervalMinutes,
        fromIso,
        toIso,
      );

      return {
        response: (candles ?? []).map((candle) => ({
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
  const { theme } = useTheme();
  const { setAnalyzing, setLeaveModalRequest, setManualDirty } =
    useCreateSignalLoading();

  return (
    <CreateSignalContentPortable
      isDark={theme === "dark"}
      pathname={pathname}
      onAnalyzingChange={setAnalyzing}
      onManualDirtyChange={setManualDirty}
      onLeaveModalRequest={setLeaveModalRequest}
      services={createSignalServices}
      config={createSignalConfig}
    />
  );
}
