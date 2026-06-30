import {
  SignalOutcomeSource,
  SignalOutcomeStatus,
} from "@/lib/api/client";

export type OutcomeStatusMeta = {
  label: string;
  className: string;
};

export function getOutcomeStatusMeta(
  outcomeStatus?: SignalOutcomeStatus | number | null,
  outcomeSource?: SignalOutcomeSource | number | null,
): OutcomeStatusMeta {
  if (outcomeStatus === SignalOutcomeStatus._1) {
    return {
      label: `🎯 به TP رسید ${outcomeSource === SignalOutcomeSource._2 ? "(خودکار)" : "(دستی)"}`,
      className:
        "text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20",
    };
  }
  if (outcomeStatus === SignalOutcomeStatus._2) {
    return {
      label: `🛑 به SL رسید ${outcomeSource === SignalOutcomeSource._2 ? "(خودکار)" : "(دستی)"}`,
      className:
        "text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20",
    };
  }
  if (outcomeStatus === SignalOutcomeStatus._3) {
    return {
      label: "⚠️ لغو شده",
      className:
        "text-[10px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10",
    };
  }
  return {
    label: "در انتظار نتیجه",
    className:
      "text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20",
  };
}
