"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExclamationCircleIcon } from "@/components/icons/dashboard-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface PositionCardProps {
  id?: number;
  time: string;
  timeDetail?: string;
  analysisModel: string;
  market: string;
  symbol: string;
  direction: "BUY" | "SELL";
  entry: string;
  stopLoss: string;
  takeProfit: string;
  tPs?: Array<string | number>;
  onExecute?: () => void;
  onShowChart?: () => void;
}

export function PositionCard({
  time,
  timeDetail,
  analysisModel,
  market,
  symbol,
  entry,
  stopLoss,
  takeProfit,
  tPs,
  onExecute,
  onShowChart,
}: PositionCardProps) {
  return (
    <Card className="w-full bg-[#02000B]/30 border-white/5" dir="rtl">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col shrink-0">
            <p className="text-xs md:text-sm font-medium text-white">
              {time} {timeDetail ? `| ${timeDetail}` : ""}
            </p>
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs md:text-sm font-medium text-white">
              مدل تحلیل : {analysisModel}
            </p>
          </div>
        </div>
        <div className="h-px bg-gray-700 dark:bg-white/10 mt-5" />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm font-medium text-white">بازار : {market}</p>
            <p className="text-xs md:text-sm font-medium text-white">نمادها : {symbol}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm font-medium text-white">ورود : {entry}</p>
            <p className="text-xs md:text-sm font-medium text-white">حد ضرر : {stopLoss}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm font-medium text-white">حد سود :</p>
            {tPs && tPs.length > 1 ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="group flex items-center gap-1.5 rounded-xl border border-[#9C73DE]/45 bg-[#3A2068]/55 px-2.5 py-1 text-[11px] font-bold text-[#EDE3FF] shadow-[0_6px_18px_rgba(40,18,74,0.35)] transition-all hover:scale-[1.02] hover:border-[#B996F2]/65 hover:bg-[#4A2A7E]/65 cursor-pointer"
                  >
                    <span className="tracking-wide">{takeProfit}</span>
                    <span
                      dir="ltr"
                      className="inline-flex h-[16px] w-[16px] min-w-[16px] max-w-[16px] max-h-[16px] items-center justify-center rounded-full border border-[#CBAFFF]/55 bg-[#5A3493] font-mono text-[8px] font-extrabold leading-[1] text-center text-[#EFE7FF] shadow-sm select-none transition-colors group-hover:bg-[#6740A4] pt-[0.5px]"
                    >
                      +{tPs.length - 1}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-52 rounded-2xl border border-[#C4A0FF]/30 bg-[#090516]/95 p-3 text-right text-white shadow-[0_18px_40px_rgba(8,3,22,0.75)] backdrop-blur-sm z-[99999]" align="start" side="bottom" dir="rtl">
                  <div className="flex flex-col gap-2.5">
                    <p className="mb-0.5 border-b border-white/10 pb-1.5 text-xs font-semibold text-[#C9AEFF]">حد سودهای هدف</p>
                    <div className="flex flex-col gap-1.5 text-xs">
                      {tPs.map((tpVal: string | number, tpIdx: number) => (
                        <div key={tpIdx} className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5" dir="ltr">
                          <span className="text-[11px] font-semibold tracking-wide text-white/55">t{tpIdx + 1}</span>
                          <span className="font-extrabold text-emerald-300">{tpVal.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-medium text-white">{takeProfit}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer hover:opacity-80 transition-opacity">
                      <ExclamationCircleIcon className="w-4 h-4 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{takeProfit}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onExecute}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white text-white text-xs md:text-sm font-medium hover:bg-white/10 transition-colors"
          >
            اجرا
          </button>
          <button
            onClick={onShowChart}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white text-white text-xs md:text-sm font-medium hover:bg-white/10 transition-colors"
          >
            نمایش در نمودار
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
