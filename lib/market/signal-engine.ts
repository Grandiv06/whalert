import {
  getLastDefinedMacdValue,
  getLastDefinedValue,
} from "@/lib/market/indicators";
import type {
  IndicatorSet,
  IndicatorSnapshot,
  MarketCandle,
  SignalBias,
  SignalResult,
} from "@/types/market";

function getLastClose(candles: MarketCandle[]): number | null {
  if (candles.length === 0) return null;
  return candles[candles.length - 1].close;
}

function getPreviousAndCurrentMacd(
  indicators: IndicatorSet,
): {
  previous: { macd: number; signal: number } | null;
  current: { macd: number; signal: number } | null;
} {
  let current: { macd: number; signal: number } | null = null;
  let previous: { macd: number; signal: number } | null = null;

  for (let i = indicators.macd.length - 1; i >= 0; i -= 1) {
    const point = indicators.macd[i];
    if (point?.macd == null || point.signal == null) continue;

    if (!current) {
      current = { macd: point.macd, signal: point.signal };
      continue;
    }

    previous = { macd: point.macd, signal: point.signal };
    break;
  }

  return { previous, current };
}

function getBiasLabel(bias: SignalBias): { title: string; description: string } {
  if (bias === "bullish") {
    return {
      title: "Bullish",
      description: "Momentum and trend alignment are positive for continuation.",
    };
  }

  if (bias === "bearish") {
    return {
      title: "Bearish",
      description: "Trend and momentum alignment show downside pressure.",
    };
  }

  return {
    title: "Neutral",
    description: "Signals are mixed. Wait for confirmation before acting.",
  };
}

export function buildIndicatorSnapshot(
  indicators: IndicatorSet,
): IndicatorSnapshot {
  const macdLast = getLastDefinedMacdValue(indicators.macd);

  return {
    sma20: getLastDefinedValue(indicators.sma20),
    ema20: getLastDefinedValue(indicators.ema20),
    rsi14: getLastDefinedValue(indicators.rsi14),
    macd: macdLast.macd,
    macdSignal: macdLast.signal,
    macdHistogram: macdLast.histogram,
  };
}

export function evaluateSignal(
  candles: MarketCandle[],
  indicators: IndicatorSet,
): SignalResult {
  const close = getLastClose(candles);
  const snapshot = buildIndicatorSnapshot(indicators);
  const { previous, current } = getPreviousAndCurrentMacd(indicators);

  if (close == null || snapshot.ema20 == null || snapshot.rsi14 == null || !current || !previous) {
    return {
      bias: "neutral",
      title: "Neutral",
      description: "Insufficient data to evaluate signal rules.",
      reasons: ["Need more candles for EMA/RSI/MACD evaluation."],
    };
  }

  const bullishCrossover = previous.macd <= previous.signal && current.macd > current.signal;
  const bearishCrossover = previous.macd >= previous.signal && current.macd < current.signal;

  const bullish = close > snapshot.ema20 && snapshot.rsi14 > 50 && bullishCrossover;
  const bearish = close < snapshot.ema20 && snapshot.rsi14 < 50 && bearishCrossover;

  let bias: SignalBias = "neutral";
  if (bullish) bias = "bullish";
  if (bearish) bias = "bearish";

  const reasons = [
    `Close ${close > snapshot.ema20 ? ">" : "<="} EMA20 (${snapshot.ema20.toFixed(2)})`,
    `RSI14 ${snapshot.rsi14 > 50 ? ">" : "<="} 50 (${snapshot.rsi14.toFixed(2)})`,
    bullishCrossover
      ? "MACD bullish crossover detected"
      : bearishCrossover
        ? "MACD bearish crossover detected"
        : "No fresh MACD crossover",
  ];

  const label = getBiasLabel(bias);

  return {
    bias,
    title: label.title,
    description: label.description,
    reasons,
  };
}
