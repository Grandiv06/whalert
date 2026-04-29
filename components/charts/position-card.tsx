"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExclamationCircleIcon } from "@/components/icons/dashboard-icons";

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
            <p className="text-xs md:text-sm font-medium text-white">حد سود : {takeProfit}</p>
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
