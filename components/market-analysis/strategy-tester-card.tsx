"use client";

import { FlaskConical, PlayCircle } from "lucide-react";

export function StrategyTesterCard() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#060913]/80 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <FlaskConical className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-semibold text-white/90">Strategy Tester</h3>
      </div>

      <p className="text-xs leading-5 text-white/65">
        Placeholder for backtest engine, parameter presets, and multi-symbol strategy validation.
      </p>

      <ul className="mt-3 space-y-1 text-xs text-white/70">
        <li className="rounded-md bg-white/5 px-2 py-1">Parameter presets</li>
        <li className="rounded-md bg-white/5 px-2 py-1">Historical backtest report</li>
        <li className="rounded-md bg-white/5 px-2 py-1">Risk metrics and drawdown</li>
      </ul>

      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0A0F1C] px-3 py-2 text-xs text-white/55"
      >
        <PlayCircle className="h-4 w-4" />
        Start Backtest (Soon)
      </button>
    </section>
  );
}
