import type { UTCTimestamp } from "lightweight-charts";
import {
  DEFAULT_CANDLE_LIMIT,
  DEFAULT_TIMEFRAME,
} from "@/lib/market/constants";
import { generateMockCandles, getMockLatestPrice } from "@/lib/market/mock-data";
import { GoldPriceService, GoldPriceSeries } from "@/lib/api/client";
import type {
  CandlesApiResponse,
  MarketCandle,
  MarketTimeframe,
  PriceApiResponse,
} from "@/types/market";

const BINANCE_BASE_URL = "https://api.binance.com";
const DEFAULT_TIMEOUT_MS = 8_000;

type BinanceKlineRaw = [
  number, string, string, string, string, string,
  number, string, number, string, string, string,
];

interface RequestOptions {
  signal?: AbortSignal;
}

async function requestBinanceJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  // chain caller signal with our timeout
  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const response = await fetch(`${BINANCE_BASE_URL}${path}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Binance request failed (${response.status}): ${body}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeKline(raw: BinanceKlineRaw): MarketCandle {
  return {
    time: Math.floor(raw[0] / 1000) as UTCTimestamp,
    open: Number(raw[1]),
    high: Number(raw[2]),
    low: Number(raw[3]),
    close: Number(raw[4]),
    volume: Number(raw[5]),
  };
}

export async function getHistoricalCandles(
  symbol: string,
  timeframe: MarketTimeframe = DEFAULT_TIMEFRAME,
  limit = DEFAULT_CANDLE_LIMIT,
  options: RequestOptions = {},
): Promise<CandlesApiResponse> {
  if (symbol === "XAUUSD" || symbol === "MAZAANE") {
    try {
      const series = symbol === "XAUUSD" ? GoldPriceSeries._0 : GoldPriceSeries._1;
      const timeframeMinutesMap: Record<string, number> = {
        "1m": 1,
        "5m": 5,
        "15m": 15,
        "1h": 60,
        "4h": 240,
        "1d": 1440,
      };
      const intervalMinutes = timeframeMinutesMap[timeframe] ?? 15;
      
      const candles = await GoldPriceService.apiServicesAppGoldpriceGetgoldpricecandlesGet(
        series,
        intervalMinutes,
        undefined, // fromUtc
        undefined, // toUtc
      );

      return {
        symbol,
        timeframe,
        source: "Internal API",
        candles: (candles ?? []).map((c) => ({
          time: (c.bucketStart ? Math.floor(new Date(c.bucketStart).getTime() / 1000) : 0) as UTCTimestamp,
          open: c.open ?? 0,
          high: c.high ?? 0,
          low: c.low ?? 0,
          close: c.close ?? 0,
          volume: 0,
        })),
      };
    } catch (error) {
      return {
        symbol,
        timeframe,
        source: "mock",
        candles: generateMockCandles(symbol, timeframe, limit),
        message: error instanceof Error ? error.message : "Internal API unavailable",
      };
    }
  }

  const safeLimit = Math.min(Math.max(limit, 100), 1000);
  const params = new URLSearchParams({
    symbol,
    interval: timeframe,
    limit: String(safeLimit),
  });

  try {
    const raw = await requestBinanceJson<BinanceKlineRaw[]>(
      `/api/v3/klines?${params.toString()}`,
      options,
    );
    return {
      symbol,
      timeframe,
      source: "binance",
      candles: raw.map(normalizeKline),
    };
  } catch (error) {
    return {
      symbol,
      timeframe,
      source: "mock",
      candles: generateMockCandles(symbol, timeframe, safeLimit),
      message:
        error instanceof Error
          ? error.message
          : "Binance unavailable; mock candle data returned.",
    };
  }
}

export async function getLatestPrice(
  symbol: string,
  options: RequestOptions = {},
): Promise<PriceApiResponse> {
  if (symbol === "XAUUSD" || symbol === "MAZAANE") {
    try {
      const snapshot = await GoldPriceService.apiServicesAppGoldpriceGetlatestgoldpriceGet();
      const price = symbol === "XAUUSD" ? (snapshot.xauUsd ?? 0) : (snapshot.mozaneh ?? 0);
      return {
        symbol,
        source: "Internal API",
        price,
      };
    } catch (error) {
      return {
        symbol,
        source: "mock",
        price: getMockLatestPrice(symbol),
        message: error instanceof Error ? error.message : "Internal API unavailable",
      };
    }
  }

  const params = new URLSearchParams({ symbol });

  try {
    const response = await requestBinanceJson<{ symbol: string; price: string }>(
      `/api/v3/ticker/price?${params.toString()}`,
      options,
    );
    return {
      symbol,
      source: "binance",
      price: Number(response.price),
    };
  } catch (error) {
    return {
      symbol,
      source: "mock",
      price: getMockLatestPrice(symbol),
      message:
        error instanceof Error
          ? error.message
          : "Binance unavailable; mock latest price returned.",
    };
  }
}

export async function getMarketSnapshot(
  symbol: string,
  timeframe: MarketTimeframe,
  limit = DEFAULT_CANDLE_LIMIT,
  options: RequestOptions = {},
): Promise<{
  candles: CandlesApiResponse;
  price: PriceApiResponse;
}> {
  const [candles, price] = await Promise.all([
    getHistoricalCandles(symbol, timeframe, limit, options),
    getLatestPrice(symbol, options),
  ]);

  return { candles, price };
}
