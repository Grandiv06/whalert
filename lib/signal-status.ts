import { SignalStatus } from "@/lib/api/client";

export type SignalStatusMeta = {
  label: string;
  className: string;
  badgeClassName: string;
};

export function getSignalStatusMeta(
  signalStatus?: SignalStatus | number | null,
): SignalStatusMeta {
  switch (signalStatus) {
    case SignalStatus._1:
      return {
        label: "به نقطه ورود نرسیده",
        className:
          "text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20",
        badgeClassName: "bg-amber-500/80 hover:bg-amber-500",
      };
    case SignalStatus._2:
      return {
        label: "به نقطه ورود رسیده",
        className:
          "text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20",
        badgeClassName: "bg-emerald-500 hover:bg-emerald-600",
      };
    case SignalStatus._3:
      return {
        label: "بسته‌شده",
        className:
          "text-[10px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10",
        badgeClassName: "bg-red-500 hover:bg-red-600",
      };
    default:
      return {
        label: "—",
        className:
          "text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10",
        badgeClassName: "bg-white/20",
      };
  }
}

export function resolveSignalStatusMeta(item: {
  signalStatus?: SignalStatus | number | null;
  statusLabel?: string | null;
}): SignalStatusMeta {
  const meta = getSignalStatusMeta(item.signalStatus);
  if (item.statusLabel?.trim()) {
    return { ...meta, label: item.statusLabel.trim() };
  }
  return meta;
}
