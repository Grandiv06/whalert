import { SubscriptionCheckoutStatus } from "@/lib/api/client";

export type SubscriptionCheckoutStatusMeta = {
  label: string;
  className: string;
};

export function getSubscriptionCheckoutStatusMeta(
  status?: SubscriptionCheckoutStatus | number | null,
): SubscriptionCheckoutStatusMeta {
  switch (status) {
    case SubscriptionCheckoutStatus._1:
      return {
        label: "در انتظار پرداخت",
        className:
          "text-amber-300 bg-amber-500/15 border-amber-400/30",
      };
    case SubscriptionCheckoutStatus._2:
      return {
        label: "هدایت به درگاه پرداخت",
        className:
          "text-violet-300 bg-violet-500/15 border-violet-400/30",
      };
    case SubscriptionCheckoutStatus._3:
      return {
        label: "پرداخت موفق",
        className:
          "text-emerald-300 bg-emerald-500/15 border-emerald-400/30",
      };
    case SubscriptionCheckoutStatus._4:
      return {
        label: "پرداخت ناموفق",
        className:
          "text-rose-300 bg-rose-500/15 border-rose-400/30",
      };
    case SubscriptionCheckoutStatus._5:
      return {
        label: "لغو شده",
        className:
          "text-white/60 bg-white/10 border-white/20",
      };
    default:
      return {
        label: "نامشخص",
        className: "text-white/70 bg-white/10 border-white/20",
      };
  }
}
