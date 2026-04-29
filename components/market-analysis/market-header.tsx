"use client";

import { Bell, PenTool, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SYMBOL_OPTIONS, TIMEFRAME_OPTIONS } from "@/lib/market/constants";
import type { MarketTimeframe } from "@/types/market";

interface MarketHeaderProps {
  symbol: string;
  timeframe: MarketTimeframe;
  latestPrice: number | null;
  isRefreshing: boolean;
  sourceLabel: string;
  lastUpdatedLabel: string;
  onSymbolChange: (symbol: string) => void;
  onTimeframeChange: (timeframe: MarketTimeframe) => void;
  onRefresh: () => void;
}

function formatPrice(value: number | null): string {
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

export function MarketHeader({
  symbol,
  timeframe,
  latestPrice,
  isRefreshing,
  sourceLabel,
  lastUpdatedLabel,
  onSymbolChange,
  onTimeframeChange,
  onRefresh,
}: MarketHeaderProps) {
  return (
    <header className="rounded-2xl border border-white/10 bg-[#060913]/70 px-4 py-3 backdrop-blur-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Select value={symbol} onValueChange={onSymbolChange}>
            <SelectTrigger className="h-10 min-w-[150px] rounded-xl border-white/10 bg-[#0A0F1C] text-white">
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0A0F1C] text-white">
              {SYMBOL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={timeframe}
            onValueChange={(value) => onTimeframeChange(value as MarketTimeframe)}
          >
            <SelectTrigger className="h-10 min-w-[100px] rounded-xl border-white/10 bg-[#0A0F1C] text-white">
              <SelectValue placeholder="TF" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0A0F1C] text-white">
              {TIMEFRAME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="tertiary"
            onClick={onRefresh}
            className="h-10 rounded-xl border border-white/15 bg-[#0A0F1C] text-white hover:bg-[#151B2C]"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#0A0F1C] px-3 text-sm text-white/80"
          >
            <PenTool className="h-4 w-4" />
            Drawing Tools (Soon)
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#0A0F1C] px-3 text-sm text-white/80"
          >
            <Bell className="h-4 w-4" />
            Alert (Soon)
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-white/70 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] px-3 py-2">
          Latest Price: <span className="font-semibold text-white">{formatPrice(latestPrice)}</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] px-3 py-2">
          Data Source: <span className="font-semibold text-white">{sourceLabel}</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] px-3 py-2">
          Updated: <span className="font-semibold text-white">{lastUpdatedLabel}</span>
        </div>
      </div>
    </header>
  );
}
