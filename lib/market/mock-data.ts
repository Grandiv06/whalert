import type { UTCTimestamp } from "lightweight-charts";
import { TIMEFRAME_TO_MILLISECONDS } from "@/lib/market/constants";
import type { MarketCandle, MarketTimeframe } from "@/types/market";

const SYMBOL_BASE_PRICE: Record<string, number> = {
  BTCUSDT: 68_000,
  ETHUSDT: 3_200,
  BNBUSDT: 610,
  SOLUSDT: 185,
  XRPUSDT: 0.72,
};

export function generateMockCandles(
  symbol: string,
  timeframe: MarketTimeframe,
  limit = 500,
): MarketCandle[] {
  const candles: MarketCandle[] = [];
  const intervalMs = TIMEFRAME_TO_MILLISECONDS[timeframe];
  const start = Date.now() - intervalMs * limit;

  let price = SYMBOL_BASE_PRICE[symbol] ?? 100;

  for (let i = 0; i < limit; i += 1) {
    const wave = Math.sin(i / 12) * 0.008;
    const noise = (Math.random() - 0.5) * 0.012;
    const drift = Math.sin(i / 48) * 0.002;

    const open = price;
    const directionalMove = open * (wave + noise + drift);
    const close = Math.max(0.0000001, open + directionalMove);
    const high = Math.max(open, close) * (1 + Math.random() * 0.0045);
    const low = Math.min(open, close) * (1 - Math.random() * 0.0045);

    const volumeBase = symbol === "BTCUSDT" ? 1_500 : 4_200;
    const volume = volumeBase + Math.random() * volumeBase * 0.9;

    candles.push({
      time: Math.floor((start + i * intervalMs) / 1000) as UTCTimestamp,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return candles;
}

export function getMockLatestPrice(symbol: string, candles?: MarketCandle[]): number {
  if (candles && candles.length > 0) {
    return candles[candles.length - 1].close;
  }

  const base = SYMBOL_BASE_PRICE[symbol] ?? 100;
  return base * (1 + (Math.random() - 0.5) * 0.01);
}
