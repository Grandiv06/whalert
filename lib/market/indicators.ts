import {
  EMA_PERIOD,
  MACD_FAST_PERIOD,
  MACD_SIGNAL_PERIOD,
  MACD_SLOW_PERIOD,
  RSI_PERIOD,
  SMA_PERIOD,
} from "@/lib/market/constants";
import type {
  IndicatorPoint,
  IndicatorSet,
  MacdPoint,
  MarketCandle,
} from "@/types/market";

function emptyPointSeries(candles: MarketCandle[]): IndicatorPoint[] {
  return candles.map((candle) => ({ time: candle.time, value: null }));
}

export function calculateSMA(candles: MarketCandle[], period: number): IndicatorPoint[] {
  if (candles.length === 0 || period <= 0) return [];

  const result: IndicatorPoint[] = emptyPointSeries(candles);
  let rollingSum = 0;

  for (let i = 0; i < candles.length; i += 1) {
    rollingSum += candles[i].close;

    if (i >= period) {
      rollingSum -= candles[i - period].close;
    }

    if (i >= period - 1) {
      result[i] = {
        time: candles[i].time,
        value: rollingSum / period,
      };
    }
  }

  return result;
}

export function calculateEMA(candles: MarketCandle[], period: number): IndicatorPoint[] {
  if (candles.length === 0 || period <= 0) return [];

  const result: IndicatorPoint[] = emptyPointSeries(candles);
  if (candles.length < period) return result;

  const multiplier = 2 / (period + 1);

  let smaSeed = 0;
  for (let i = 0; i < period; i += 1) {
    smaSeed += candles[i].close;
  }

  let ema = smaSeed / period;
  result[period - 1] = { time: candles[period - 1].time, value: ema };

  for (let i = period; i < candles.length; i += 1) {
    ema = (candles[i].close - ema) * multiplier + ema;
    result[i] = {
      time: candles[i].time,
      value: ema,
    };
  }

  return result;
}

export function calculateRSI(candles: MarketCandle[], period: number): IndicatorPoint[] {
  if (candles.length === 0 || period <= 0) return [];

  const result: IndicatorPoint[] = emptyPointSeries(candles);
  if (candles.length <= period) return result;

  let gainSum = 0;
  let lossSum = 0;

  for (let i = 1; i <= period; i += 1) {
    const delta = candles[i].close - candles[i - 1].close;
    if (delta >= 0) {
      gainSum += delta;
    } else {
      lossSum += Math.abs(delta);
    }
  }

  let averageGain = gainSum / period;
  let averageLoss = lossSum / period;

  const firstRsi = averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);
  result[period] = { time: candles[period].time, value: firstRsi };

  for (let i = period + 1; i < candles.length; i += 1) {
    const delta = candles[i].close - candles[i - 1].close;
    const gain = delta > 0 ? delta : 0;
    const loss = delta < 0 ? Math.abs(delta) : 0;

    averageGain = (averageGain * (period - 1) + gain) / period;
    averageLoss = (averageLoss * (period - 1) + loss) / period;

    const rsi = averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);
    result[i] = { time: candles[i].time, value: rsi };
  }

  return result;
}

export function calculateMACD(
  candles: MarketCandle[],
  fastPeriod = MACD_FAST_PERIOD,
  slowPeriod = MACD_SLOW_PERIOD,
  signalPeriod = MACD_SIGNAL_PERIOD,
): MacdPoint[] {
  if (candles.length === 0) return [];

  const fastEma = calculateEMA(candles, fastPeriod);
  const slowEma = calculateEMA(candles, slowPeriod);

  const macdPoints: MacdPoint[] = candles.map((candle, index) => {
    const fast = fastEma[index]?.value;
    const slow = slowEma[index]?.value;
    const macdValue = fast != null && slow != null ? fast - slow : null;

    return {
      time: candle.time,
      macd: macdValue,
      signal: null,
      histogram: null,
    };
  });

  let signalSeedSum = 0;
  let signalSeedCount = 0;
  let signalEma: number | null = null;
  const signalMultiplier = 2 / (signalPeriod + 1);

  for (let i = 0; i < macdPoints.length; i += 1) {
    const macdValue = macdPoints[i].macd;
    if (macdValue == null) continue;

    if (signalEma == null) {
      signalSeedSum += macdValue;
      signalSeedCount += 1;
      if (signalSeedCount === signalPeriod) {
        signalEma = signalSeedSum / signalPeriod;
        macdPoints[i].signal = signalEma;
      }
      continue;
    }

    signalEma = (macdValue - signalEma) * signalMultiplier + signalEma;
    macdPoints[i].signal = signalEma;
  }

  for (let i = 0; i < macdPoints.length; i += 1) {
    const point = macdPoints[i];
    if (point.macd != null && point.signal != null) {
      point.histogram = point.macd - point.signal;
    }
  }

  return macdPoints;
}

export function buildIndicatorSet(candles: MarketCandle[]): IndicatorSet {
  return {
    sma20: calculateSMA(candles, SMA_PERIOD),
    ema20: calculateEMA(candles, EMA_PERIOD),
    rsi14: calculateRSI(candles, RSI_PERIOD),
    macd: calculateMACD(candles),
  };
}

export function getLastDefinedValue(points: IndicatorPoint[]): number | null {
  for (let i = points.length - 1; i >= 0; i -= 1) {
    const value = points[i]?.value;
    if (value != null) return value;
  }
  return null;
}

export function getLastDefinedMacdValue(
  points: MacdPoint[],
): { macd: number | null; signal: number | null; histogram: number | null } {
  for (let i = points.length - 1; i >= 0; i -= 1) {
    const point = points[i];
    if (!point) continue;

    if (point.macd != null || point.signal != null || point.histogram != null) {
      return {
        macd: point.macd ?? null,
        signal: point.signal ?? null,
        histogram: point.histogram ?? null,
      };
    }
  }

  return { macd: null, signal: null, histogram: null };
}
