"use client";

import { cn } from "@/lib/utils";
import type {
  IndicatorSnapshot,
  MarketTimeframe,
  SignalResult,
} from "@/types/market";

interface AnalysisPanelProps {
  symbol: string;
  timeframe: MarketTimeframe;
  latestClose: number | null;
  priceChangePercent: number | null;
  indicatorSnapshot: IndicatorSnapshot;
  signal: SignalResult;
}

function formatValue(value: number | null, digits = 2): string {
  if (value == null || !Number.isFinite(value)) return "--";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function AnalysisPanel({
  symbol,
  timeframe,
  latestClose,
  priceChangePercent,
  indicatorSnapshot,
  signal,
}: AnalysisPanelProps) {
  const signalClass =
    signal.bias === "bullish"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : signal.bias === "bearish"
        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
        : "bg-slate-500/15 text-slate-300 border-slate-500/30";

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-[#060913]/80 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">Analysis Panel</h3>
        <span className={cn("rounded-lg border px-2 py-1 text-xs font-medium", signalClass)}>
          {signal.title}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] px-3 py-2 text-white/70">
          Symbol
          <div className="mt-1 text-sm font-semibold text-white">{symbol}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] px-3 py-2 text-white/70">
          Timeframe
          <div className="mt-1 text-sm font-semibold text-white">{timeframe}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] px-3 py-2 text-white/70">
          Last Close
          <div className="mt-1 text-sm font-semibold text-white">{formatValue(latestClose, 4)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] px-3 py-2 text-white/70">
          Change %
          <div
            className={cn(
              "mt-1 text-sm font-semibold",
              (priceChangePercent ?? 0) > 0
                ? "text-emerald-300"
                : (priceChangePercent ?? 0) < 0
                  ? "text-rose-300"
                  : "text-white",
            )}
          >
            {priceChangePercent == null
              ? "--"
              : `${priceChangePercent >= 0 ? "+" : ""}${priceChangePercent.toFixed(2)}%`}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0A0F1C] p-3">
        <h4 className="mb-2 text-xs font-semibold text-white/90">Indicator Summary</h4>
        <div className="space-y-1 text-xs text-white/70">
          <div className="flex items-center justify-between">
            <span>SMA 20</span>
            <span className="font-semibold text-white">{formatValue(indicatorSnapshot.sma20, 4)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>EMA 20</span>
            <span className="font-semibold text-white">{formatValue(indicatorSnapshot.ema20, 4)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>RSI 14</span>
            <span className="font-semibold text-white">{formatValue(indicatorSnapshot.rsi14, 2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>MACD</span>
            <span className="font-semibold text-white">{formatValue(indicatorSnapshot.macd, 4)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Signal</span>
            <span className="font-semibold text-white">
              {formatValue(indicatorSnapshot.macdSignal, 4)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Histogram</span>
            <span className="font-semibold text-white">
              {formatValue(indicatorSnapshot.macdHistogram, 4)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0A0F1C] p-3 text-xs text-white/70">
        <h4 className="mb-2 text-xs font-semibold text-white/90">Interpretation</h4>
        <p>{signal.description}</p>
        <ul className="mt-2 space-y-1">
          {signal.reasons.map((reason) => (
            <li key={reason} className="rounded-md bg-white/5 px-2 py-1">
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
