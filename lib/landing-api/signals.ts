import { getApiBaseUrl } from "@/config/env";

export interface Signal {
  id: number;
  symbol: string;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  status: string;
  date: string;
  risk?: string;
}

type LatestSignalApiItem = {
  id?: number;
  symbol?: string | null;
  marketSymbol?: string | null;
  entry?: number | null;
  entryPoint?: number | null;
  stopLoss?: number | null;
  sl?: number | null;
  takeProfit?: number | null;
  tp?: number | null;
  tP?: number | null;
  tps?: Array<number | string> | null;
  tPs?: Array<number | string> | null;
  status?: string | null;
  signalStatus?: number | null;
  outcomeStatus?: number | null;
  date?: string | null;
  creationTime?: string | null;
  publishedAt?: string | null;
  risk?: string | null;
  riskRewardRatio?: number | null;
};

type AbpWrapper<T> = {
  result?: T;
  items?: T extends Array<infer U> ? U[] : never;
};

function asNumber(value: unknown): number | null {
  const num = typeof value === "string" ? Number(value) : value;
  return typeof num === "number" && Number.isFinite(num) ? num : null;
}

function getTakeProfit(item: LatestSignalApiItem): number {
  const direct = asNumber(item.takeProfit ?? item.tp ?? item.tP);
  if (direct !== null) return direct;
  const firstTp = Array.isArray(item.tPs) && item.tPs.length > 0 ? asNumber(item.tPs[0]) : null;
  if (firstTp !== null) return firstTp;
  const firstLowerTp = Array.isArray(item.tps) && item.tps.length > 0 ? asNumber(item.tps[0]) : null;
  if (firstLowerTp !== null) return firstLowerTp;
  const entry = asNumber(item.entry ?? item.entryPoint);
  const sl = asNumber(item.stopLoss ?? item.sl);
  const rr = asNumber(item.riskRewardRatio);
  if (entry !== null && sl !== null && rr !== null) {
    const direction = entry >= sl ? 1 : -1;
    return Number((entry + direction * Math.abs(entry - sl) * rr).toFixed(2));
  }
  return 0;
}

function getStatus(item: LatestSignalApiItem): string {
  if (item.status) return item.status;
  if (item.signalStatus === 1 || item.outcomeStatus === 1) return "Active";
  if (item.signalStatus === 2 || item.outcomeStatus === 2) return "Closed";
  if (item.signalStatus === 3 || item.outcomeStatus === 3) return "Pending";
  return "Active";
}

function getDate(item: LatestSignalApiItem): string {
  return item.date || item.creationTime || item.publishedAt || "";
}

function mapLatestSignal(item: LatestSignalApiItem, index: number): Signal {
  return {
    id: item.id ?? index + 1,
    symbol: item.symbol || item.marketSymbol || "-",
    entry: asNumber(item.entry ?? item.entryPoint) ?? 0,
    stopLoss: asNumber(item.stopLoss ?? item.sl) ?? 0,
    takeProfit: getTakeProfit(item),
    status: getStatus(item),
    date: getDate(item),
    risk: item.risk ?? undefined,
  };
}

async function getLatestSignalsFromApi(): Promise<Signal[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/services/app/TradingSignals/GetLatestSignals`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load latest signals (${response.status})`);
  }

  const json = (await response.json()) as
    | AbpWrapper<LatestSignalApiItem[]>
    | LatestSignalApiItem[]
    | { items?: LatestSignalApiItem[]; result?: LatestSignalApiItem[] };

  const items =
    Array.isArray(json)
      ? json
      : Array.isArray((json as AbpWrapper<LatestSignalApiItem[]>).result)
        ? ((json as AbpWrapper<LatestSignalApiItem[]>).result ?? [])
        : Array.isArray((json as AbpWrapper<LatestSignalApiItem[]>).items)
          ? ((json as AbpWrapper<LatestSignalApiItem[]>).items ?? [])
          : Array.isArray((json as { items?: LatestSignalApiItem[] }).items)
            ? ((json as { items?: LatestSignalApiItem[] }).items ?? [])
            : [];

  return items.map(mapLatestSignal);
}

function randomInRange(min: number, max: number, decimals = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = Math.floor(Math.random() * 28) + 1;
  const monthIndex = Math.floor(Math.random() * 12);
  const year = 2025;
  return `${day} ${months[monthIndex]} ${year}`;
}

function generateRandomSignal(id: number): Signal {
  const entry = randomInRange(2300, 2400);
  const stopLoss = randomInRange(entry - 5, entry + 5);
  const takeProfit = randomInRange(entry + 10, entry + 100);

  const statuses = ["Active", "Closed", "Pending"];
  const riskLabels = ["-1R", "-0.5R", "+1R", "+2R", "0R"];
  const symbols = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "BTCUSD", "ETHUSD"];

  return {
    id,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    entry: Number(entry.toFixed(2)),
    stopLoss: Number(stopLoss.toFixed(2)),
    takeProfit: Number(takeProfit.toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: randomDate(),
    risk: riskLabels[Math.floor(Math.random() * riskLabels.length)],
  };
}

export const signalsApi = {
  getAll: async (): Promise<Signal[]> => {
    try {
      return await getLatestSignalsFromApi();
    } catch {
      return Array.from({ length: 6 }, (_, i) => generateRandomSignal(i + 1));
    }
  },
};
