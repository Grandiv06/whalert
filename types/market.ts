import type { UTCTimestamp } from "lightweight-charts";

export type MarketTimeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export type SignalBias = "bullish" | "bearish" | "neutral";

export type IndicatorKey = "sma" | "ema" | "rsi" | "macd" | "volume";

export interface MarketSymbolOption {
  value: string;
  label: string;
}

export interface TimeframeOption {
  value: MarketTimeframe;
  label: string;
}

export interface MarketCandle {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorPoint {
  time: UTCTimestamp;
  value: number | null;
}

export interface MacdPoint {
  time: UTCTimestamp;
  macd: number | null;
  signal: number | null;
  histogram: number | null;
}

export interface IndicatorSet {
  sma20: IndicatorPoint[];
  ema20: IndicatorPoint[];
  rsi14: IndicatorPoint[];
  macd: MacdPoint[];
}

export interface IndicatorToggles {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  volume: boolean;
}

export interface SignalResult {
  bias: SignalBias;
  title: string;
  description: string;
  reasons: string[];
}

export interface IndicatorSnapshot {
  sma20: number | null;
  ema20: number | null;
  rsi14: number | null;
  macd: number | null;
  macdSignal: number | null;
  macdHistogram: number | null;
}

export interface CandlesApiResponse {
  symbol: string;
  timeframe: MarketTimeframe;
  source: "binance" | "mock" | "internal";
  candles: MarketCandle[];
  message?: string;
}

export interface PriceApiResponse {
  symbol: string;
  source: "binance" | "mock" | "internal";
  price: number;
  message?: string;
}
