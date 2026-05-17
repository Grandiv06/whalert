"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_CANDLE_LIMIT,
  MARKET_REFRESH_MS,
} from "@/lib/market/constants";
import { generateMockCandles, getMockLatestPrice } from "@/lib/market/mock-data";
import { getMarketSnapshot } from "@/lib/market/services/market-data-client";
import type { MarketCandle, MarketTimeframe } from "@/types/market";

interface UseMarketDataArgs {
  symbol: string;
  timeframe: MarketTimeframe;
  limit?: number;
  refreshMs?: number;
}

interface MarketDataState {
  candles: MarketCandle[];
  latestPrice: number | null;
  candlesSource: "binance" | "mock" | "internal";
  priceSource: "binance" | "mock" | "internal";
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: MarketDataState = {
  candles: [],
  latestPrice: null,
  candlesSource: "mock",
  priceSource: "mock",
  isLoading: true,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

export function useMarketData({
  symbol,
  timeframe,
  limit = DEFAULT_CANDLE_LIMIT,
  refreshMs = MARKET_REFRESH_MS,
}: UseMarketDataArgs) {
  const [state, setState] = useState<MarketDataState>(initialState);
  const requestIdRef = useRef(0);

  const loadData = useCallback(
    async (mode: "initial" | "refresh") => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      setState((prev) => ({
        ...prev,
        isLoading: mode === "initial" && prev.candles.length === 0,
        isRefreshing: mode === "refresh",
        error: null,
      }));

      try {
        const snapshot = await getMarketSnapshot(symbol, timeframe, limit);

        if (requestId !== requestIdRef.current) return;

        setState({
          candles: snapshot.candles.candles,
          latestPrice: snapshot.price.price,
          candlesSource: snapshot.candles.source,
          priceSource: snapshot.price.source,
          isLoading: false,
          isRefreshing: false,
          error: null,
          lastUpdated: Date.now(),
        });
      } catch (error) {
        if (requestId !== requestIdRef.current) return;

        const fallbackCandles = generateMockCandles(symbol, timeframe, limit);
        const fallbackPrice = getMockLatestPrice(symbol, fallbackCandles);

        setState({
          candles: fallbackCandles,
          latestPrice: fallbackPrice,
          candlesSource: "mock",
          priceSource: "mock",
          isLoading: false,
          isRefreshing: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch market data. Using fallback data.",
          lastUpdated: Date.now(),
        });
      }
    },
    [limit, symbol, timeframe],
  );

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void loadData("initial");
    }, 0);

    const intervalId = window.setInterval(() => {
      void loadData("refresh");
    }, refreshMs);

    return () => {
      requestIdRef.current += 1;
      window.clearTimeout(initialTimer);
      window.clearInterval(intervalId);
    };
  }, [loadData, refreshMs]);

  const refresh = useCallback(() => {
    void loadData("refresh");
  }, [loadData]);

  const lastClose = useMemo(() => {
    if (state.candles.length === 0) return null;
    return state.candles[state.candles.length - 1].close;
  }, [state.candles]);

  const previousClose = useMemo(() => {
    if (state.candles.length < 2) return null;
    return state.candles[state.candles.length - 2].close;
  }, [state.candles]);

  return {
    ...state,
    lastClose,
    previousClose,
    refresh,
  };
}
