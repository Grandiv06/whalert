"use client";

import { useCallback, useEffect, useState } from "react";
import { WATCHLIST_REFRESH_MS } from "@/lib/market/constants";
import { getLatestPrice } from "@/lib/market/services/market-data-client";

export function useWatchlistPrices(
  symbols: string[],
  refreshMs = WATCHLIST_REFRESH_MS,
) {
  const [prices, setPrices] = useState<Record<string, number>>({});

  const fetchPrices = useCallback(async () => {
    if (symbols.length === 0) return;

    const responses = await Promise.allSettled(
      symbols.map((symbol) => getLatestPrice(symbol)),
    );

    setPrices((prev) => {
      const next = { ...prev };

      responses.forEach((response, index) => {
        const symbol = symbols[index];
        if (!symbol) return;

        if (response.status === "fulfilled") {
          next[symbol] = response.value.price;
        }
      });

      return next;
    });
  }, [symbols]);

  useEffect(() => {
    let stopped = false;

    const run = async () => {
      if (stopped) return;
      await fetchPrices();
    };

    void run();

    const intervalId = window.setInterval(() => {
      void run();
    }, refreshMs);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
  }, [fetchPrices, refreshMs]);

  return prices;
}
