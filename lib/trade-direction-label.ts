import { SignalSide } from "@/lib/api/client";

type TradeDirectionValue = string | SignalSide | number | null | undefined;

export function isBuyDirection(value: TradeDirectionValue): boolean {
  if (value == null) return false;
  if (typeof value === "string") {
    const normalized = value.trim().toUpperCase();
    if (normalized === "BUY" || normalized === "LONG") return true;
    if (value.trim() === "خرید") return true;
    return false;
  }
  return value === SignalSide._1 || value === 1;
}

export function getTradeDirectionLabel(value: TradeDirectionValue): string {
  if (isBuyDirection(value)) return "خرید";
  if (typeof value === "string") {
    const normalized = value.trim().toUpperCase();
    if (normalized === "SELL" || normalized === "SHORT") return "فروش";
    if (value.trim() === "فروش") return "فروش";
  }
  if (value === SignalSide._2 || value === 2) return "فروش";
  return "—";
}
