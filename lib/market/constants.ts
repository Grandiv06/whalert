import type {
  IndicatorToggles,
  MarketSymbolOption,
  MarketTimeframe,
  TimeframeOption,
} from "@/types/market";

export const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "1h", label: "1h" },
  { value: "4h", label: "4h" },
  { value: "1d", label: "1d" },
];

export const SYMBOL_OPTIONS: MarketSymbolOption[] = [
  { value: "XAUUSD", label: "XAU/USD (Gold)" },
  { value: "MAZAANE", label: "Mozaneh (Gold)" },
  { value: "BTCUSDT", label: "BTC/USDT" },
  { value: "ETHUSDT", label: "ETH/USDT" },
  { value: "BNBUSDT", label: "BNB/USDT" },
  { value: "SOLUSDT", label: "SOL/USDT" },
  { value: "XRPUSDT", label: "XRP/USDT" },
];

export const DEFAULT_SYMBOL = SYMBOL_OPTIONS[0].value;

export const DEFAULT_TIMEFRAME: MarketTimeframe = "15m";

export const DEFAULT_CANDLE_LIMIT = 500;

export const MARKET_REFRESH_MS = 20_000;

export const WATCHLIST_REFRESH_MS = 30_000;

export const TIMEFRAME_TO_MILLISECONDS: Record<MarketTimeframe, number> = {
  "1m": 60_000,
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "1h": 60 * 60_000,
  "4h": 4 * 60 * 60_000,
  "1d": 24 * 60 * 60_000,
};

export const DEFAULT_INDICATOR_TOGGLES: IndicatorToggles = {
  sma: true,
  ema: true,
  rsi: true,
  macd: true,
  volume: true,
};

export const INDICATOR_COLORS = {
  sma: "#60a5fa",
  ema: "#f59e0b",
  rsi: "#38bdf8",
  macd: "#22d3ee",
  macdSignal: "#f97316",
  bullish: "#10b981",
  bearish: "#ef4444",
};

export const RSI_PERIOD = 14;
export const EMA_PERIOD = 20;
export const SMA_PERIOD = 20;

export const MACD_FAST_PERIOD = 12;
export const MACD_SLOW_PERIOD = 26;
export const MACD_SIGNAL_PERIOD = 9;
