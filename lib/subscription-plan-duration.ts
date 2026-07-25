import { toPersianDigits } from "@/lib/utils";
import type { SubscriptionPlanCatalogItemDto } from "@/lib/api/client";

export function getDurationLabel(days?: number | null): string {
  if (days === 7) return "هفتگی";
  if (days === 14) return "دو هفته‌ای";
  if (days === 30) return "ماهانه";
  if (days && days > 0) return `${toPersianDigits(days)} روزه`;
  return "اشتراک";
}

export function getPaymentPeriodLabel(days?: number | null): string {
  if (days === 7) return "پرداخت هفتگی";
  if (days === 14) return "پرداخت دو هفته‌ای";
  if (days === 30) return "پرداخت ماهانه";
  return "پرداخت دوره‌ای";
}

export function isOnsCatalogPlan(plan: SubscriptionPlanCatalogItemDto): boolean {
  if (plan.marketFocus === 1) return true;

  const name = (plan.name ?? "").toLowerCase();
  const displayName = plan.displayName ?? "";

  return (
    name.includes("xau") ||
    name === "weekly" ||
    name === "biweekly" ||
    displayName.includes("انس")
  );
}
