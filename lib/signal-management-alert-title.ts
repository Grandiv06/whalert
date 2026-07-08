import { normalizePersianText } from "@/lib/utils";

export function formatSignalManagementAlertTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "سیگنال";

  const upper = trimmed.toUpperCase();
  if (upper === "XAUUSD" || upper.includes("XAUUSD")) {
    return "انس";
  }
  if (upper === "MAZAANE" || upper.includes("MAZAANE")) {
    return "مظنه";
  }

  return normalizePersianText(trimmed);
}
