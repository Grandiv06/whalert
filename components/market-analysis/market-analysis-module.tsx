"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { AnalysisPanel } from "@/components/market-analysis/analysis-panel";
import { MacdChart } from "@/components/market-analysis/charts/macd-chart";
import { PriceChart } from "@/components/market-analysis/charts/price-chart";
import { RsiChart } from "@/components/market-analysis/charts/rsi-chart";
import { IndicatorTogglesBar } from "@/components/market-analysis/indicator-toggles";
import { MarketHeader } from "@/components/market-analysis/market-header";
import { StrategyTesterCard } from "@/components/market-analysis/strategy-tester-card";
import { Watchlist } from "@/components/market-analysis/watchlist";
import {
  DEFAULT_INDICATOR_TOGGLES,
  DEFAULT_SYMBOL,
  DEFAULT_TIMEFRAME,
  SYMBOL_OPTIONS,
} from "@/lib/market/constants";
import { buildIndicatorSet } from "@/lib/market/indicators";
import { buildIndicatorSnapshot, evaluateSignal } from "@/lib/market/signal-engine";
import { cn } from "@/lib/utils";
import { useMarketData } from "@/hooks/market-analysis/use-market-data";
import { useWatchlistPrices } from "@/hooks/market-analysis/use-watchlist-prices";
import type { IndicatorKey, MarketTimeframe } from "@/types/market";

export function MarketAnalysisModule() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [timeframe, setTimeframe] = useState<MarketTimeframe>(DEFAULT_TIMEFRAME);
  const [indicatorToggles, setIndicatorToggles] = useState(DEFAULT_INDICATOR_TOGGLES);

  const {
    candles,
    latestPrice,
    lastClose,
    previousClose,
    candlesSource,
    priceSource,
    error,
    isLoading,
    isRefreshing,
    lastUpdated,
    refresh,
  } = useMarketData({ symbol, timeframe });

  const indicators = useMemo(() => buildIndicatorSet(candles), [candles]);
  const indicatorSnapshot = useMemo(
    () => buildIndicatorSnapshot(indicators),
    [indicators],
  );
  const signal = useMemo(() => evaluateSignal(candles, indicators), [candles, indicators]);

  const latestClose = latestPrice ?? lastClose;

  const priceChangePercent = useMemo(() => {
    if (latestClose == null || previousClose == null || previousClose === 0) return null;
    return ((latestClose - previousClose) / previousClose) * 100;
  }, [latestClose, previousClose]);

  const sourceLabel =
    candlesSource === "binance" && priceSource === "binance"
      ? "Binance Live"
      : "Mock Fallback";

  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--";

  const watchlistSymbols = useMemo(
    () => SYMBOL_OPTIONS.map((item) => item.value),
    [],
  );
  const watchlistPrices = useWatchlistPrices(watchlistSymbols);

  const toggleIndicator = (key: IndicatorKey) => {
    setIndicatorToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const showEmpty = !isLoading && candles.length === 0;

  return (
    <div className="space-y-4" dir="ltr">
      <MarketHeader
        symbol={symbol}
        timeframe={timeframe}
        latestPrice={latestClose}
        isRefreshing={isRefreshing}
        sourceLabel={sourceLabel}
        lastUpdatedLabel={lastUpdatedLabel}
        onSymbolChange={setSymbol}
        onTimeframeChange={setTimeframe}
        onRefresh={refresh}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-4">
          <IndicatorTogglesBar toggles={indicatorToggles} onToggle={toggleIndicator} />

          <div className="rounded-2xl border border-white/10 bg-[#060913]/80 p-3 backdrop-blur-sm">
            <div className="h-[430px] overflow-hidden rounded-xl border border-white/10 bg-[#05070F]">
              {isLoading && candles.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-white/60">
                  Loading market data...
                </div>
              ) : showEmpty ? (
                <div className="flex h-full items-center justify-center text-sm text-white/60">
                  No candle data available for the selected symbol/timeframe.
                </div>
              ) : (
                <PriceChart
                  candles={candles}
                  indicators={indicators}
                  toggles={indicatorToggles}
                />
              )}
            </div>
          </div>

          {indicatorToggles.rsi && (
            <div className="rounded-2xl border border-white/10 bg-[#060913]/80 p-3 backdrop-blur-sm">
              <div className="mb-2 text-xs font-semibold text-white/75">RSI 14</div>
              <div className="h-[150px] overflow-hidden rounded-xl border border-white/10 bg-[#05070F]">
                <RsiChart points={indicators.rsi14} />
              </div>
            </div>
          )}

          {indicatorToggles.macd && (
            <div className="rounded-2xl border border-white/10 bg-[#060913]/80 p-3 backdrop-blur-sm">
              <div className="mb-2 text-xs font-semibold text-white/75">MACD (12, 26, 9)</div>
              <div className="h-[170px] overflow-hidden rounded-xl border border-white/10 bg-[#05070F]">
                <MacdChart points={indicators.macd} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#060913]/80 p-4 text-sm text-white/70">
              <h4 className="mb-2 text-sm font-semibold text-white/90">Signal Engine</h4>
              <p>
                Rule set: price vs EMA20, RSI above/below 50, and MACD crossover validation.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#060913]/80 p-4 text-sm text-white/70">
              <h4 className="mb-2 text-sm font-semibold text-white/90">WebSocket Ready</h4>
              <p>
                Data layer is isolated and can be upgraded to streaming updates without changing UI.
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <AnalysisPanel
            symbol={symbol}
            timeframe={timeframe}
            latestClose={latestClose}
            priceChangePercent={priceChangePercent}
            indicatorSnapshot={indicatorSnapshot}
            signal={signal}
          />

          <Watchlist
            symbols={watchlistSymbols}
            selectedSymbol={symbol}
            prices={watchlistPrices}
            onSelect={setSymbol}
          />

          <StrategyTesterCard />

          <div
            className={cn(
              "rounded-2xl border border-dashed border-white/20 bg-[#060913]/70 p-4 text-xs text-white/65",
            )}
          >
            <div className="font-semibold text-white/85">Drawing Toolbar Placeholder</div>
            <p className="mt-2">
              Reserve this area for line tools, fib retracement, and manual annotation controls.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
