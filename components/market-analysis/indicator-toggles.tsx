"use client";

import { cn } from "@/lib/utils";
import type { IndicatorKey, IndicatorToggles } from "@/types/market";

const TOGGLE_ORDER: Array<{ key: IndicatorKey; label: string }> = [
  { key: "sma", label: "SMA 20" },
  { key: "ema", label: "EMA 20" },
  { key: "rsi", label: "RSI 14" },
  { key: "macd", label: "MACD" },
  { key: "volume", label: "Volume" },
];

interface IndicatorTogglesProps {
  toggles: IndicatorToggles;
  onToggle: (key: IndicatorKey) => void;
}

export function IndicatorTogglesBar({ toggles, onToggle }: IndicatorTogglesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#060913]/70 p-3">
      {TOGGLE_ORDER.map((item) => {
        const active = toggles[item.key];

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-medium transition-colors md:text-sm",
              active
                ? "border-[#22d3ee]/40 bg-[#0e2438] text-[#7dd3fc]"
                : "border-white/10 bg-[#0A0F1C] text-white/65 hover:text-white",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
