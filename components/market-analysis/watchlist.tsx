"use client";

import { cn } from "@/lib/utils";

interface WatchlistProps {
  symbols: string[];
  selectedSymbol: string;
  prices: Record<string, number>;
  onSelect: (symbol: string) => void;
}

function formatPrice(value: number | undefined): string {
  if (value == null || !Number.isFinite(value)) return "--";

  if (value >= 1000) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export function Watchlist({
  symbols,
  selectedSymbol,
  prices,
  onSelect,
}: WatchlistProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#060913]/80 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">Watchlist</h3>
        <span className="text-xs text-white/55">Quick switch</span>
      </div>

      <div className="space-y-2">
        {symbols.map((symbol) => {
          const active = symbol === selectedSymbol;
          const price = prices[symbol];

          return (
            <button
              key={symbol}
              type="button"
              onClick={() => onSelect(symbol)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                active
                  ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                  : "border-white/10 bg-[#0A0F1C] text-white/75 hover:bg-[#11182A]",
              )}
            >
              <span className="font-medium">{symbol}</span>
              <span>{formatPrice(price)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
