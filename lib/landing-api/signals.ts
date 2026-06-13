import { HomepageService } from "@/lib/api/services/HomepageService";
import type { HomepageSignalDto } from "@/lib/api/models/HomepageSignalDto";

export interface Signal {
  id: number;
  symbol: string;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  status: string;
  date: string;
  risk?: string;
  pictureUrl?: string | null;
  pictureId?: string | null;
  pictureBase64?: string | null;
}

function asNumber(value: unknown): number | null {
  const num = typeof value === "string" ? Number(value) : value;
  return typeof num === "number" && Number.isFinite(num) ? num : null;
}

function getStatus(item: HomepageSignalDto): string {
  if (item.statusLabel) return item.statusLabel;
  if (item.signalStatus === 1) return "Active";
  if (item.signalStatus === 2) return "Closed";
  if (item.signalStatus === 3) return "Pending";
  return "Active";
}

function mapLatestSignal(item: HomepageSignalDto, index: number): Signal {
  return {
    id: item.tradingSignalId ?? index + 1,
    symbol: item.symbol || "-",
    entry: asNumber(item.entryPrice) ?? 0,
    stopLoss: asNumber(item.stopLoss) ?? 0,
    takeProfit: asNumber(item.takeProfit) ?? 0,
    status: getStatus(item),
    date: item.datePersian || item.date || "",
    risk: item.riskRewardLabel ?? undefined,
    pictureUrl: null,
    pictureId: null,
    pictureBase64: null,
  };
}

async function getLatestSignalsFromApi(): Promise<Signal[]> {
  const response = await HomepageService.apiServicesAppHomepageGetlatestsignalsPost();
  const payload = (response as { result?: { signals?: HomepageSignalDto[] } }).result;
  const items = response.signals ?? payload?.signals ?? [];
  return items.map(mapLatestSignal);
}

export const signalsApi = {
  getAll: async (): Promise<Signal[]> => {
    return await getLatestSignalsFromApi();
  },
};
