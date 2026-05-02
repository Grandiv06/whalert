"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { useCreateSignalLoading } from "@/contexts/create-signal-loading-context";
import {
  AiServiceService,
  PriceService,
  UserDashboardService,
} from "@/lib/api/client";
import {
  CreateSignalContent as CreateSignalContentPortable,
  type CreateSignalServices,
} from "@/components/create-signal/create-signal-content";

const createSignalServices: CreateSignalServices = {
  getDynamicPrice: (symbol, timeframe, fromIso, toIso) =>
    PriceService.apiServicesAppPriceGetdynamicpriceGet(
      symbol,
      timeframe,
      fromIso,
      toIso,
    ),
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
