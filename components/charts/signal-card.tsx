import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { resolveSignalImage } from "@/lib/signal-image";
import { FileText } from "lucide-react";
import { SignalManagementButton } from "@/components/signal/signal-management-button";

export interface SignalCardProps {
  id?: number;
  time: string;
  analysisModel: string;
  market: string;
  symbol: string;
  direction: "BUY" | "SELL";
  entry: string;
  stopLoss: string;
  takeProfit: string;
  tPs?: Array<string | number>;
  pictureUrl?: string | null;
  pictureId?: string | null;
  pictureBase64?: string | null;
  description?: string | null;
  statusLabel?: string;
  statusClassName?: string;
  outcomeLabel?: string;
  outcomeClassName?: string;
  onViewImage?: () => void;
  onViewDescription?: () => void;
  onManageSignal?: () => void;
}

export function SignalCard({
  pictureUrl,
  pictureId,
  pictureBase64,
  description,
  statusLabel,
  statusClassName,
  outcomeLabel,
  outcomeClassName,
  onViewImage,
  onViewDescription,
  onManageSignal,
  time,
  analysisModel,
  market,
  symbol,
  direction,
  entry,
  stopLoss,
  takeProfit,
  tPs = [],
}: SignalCardProps) {
  const [datePart, timePart] = time.includes(" - ") ? time.split(" - ") : [time, ""];
  const imageSrc = resolveSignalImage({ pictureUrl, pictureBase64 });
  const hasImage = Boolean(imageSrc || pictureId);

  return (
    <Card className="w-full bg-[#02000B]/30 border-white/5" dir="rtl">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <p className="text-xs md:text-sm font-medium text-white/90">
            تاریخ : {datePart}
          </p>
          {timePart && (
            <p className="text-xs md:text-sm font-medium text-white/60">
              {timePart}
            </p>
          )}
        </div>
        <div className="h-px bg-white/10" />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-white/80">
              بازار : {market}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-white/80">
              تحلیلگر : {analysisModel}
            </p>
            <p className="text-xs font-medium text-white/80">
              نمادها : {symbol}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-white/80">
              جهت :
              <span
                className={cn(
                  "mr-1 font-bold",
                  direction === "BUY" ? "text-green-500" : "text-red-500",
                )}
              >
                {direction}
              </span>
            </p>
            <p className="text-xs font-medium text-white/80">
              ورود : {entry}
            </p>
          </div>
          <div className="flex justify-between items-center gap-4">
            <p className="text-xs font-medium text-white/80 whitespace-nowrap shrink-0">
              حدضرر : {stopLoss}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-white/80 whitespace-nowrap flex-nowrap shrink-0">
              <span>حدسود :</span>
              {tPs.length > 1 ? (
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
                <span className="rounded-xl border border-[#9C73DE]/45 bg-[#3A2068]/55 px-2.5 py-1 text-[11px] font-bold text-[#EDE3FF]">
                  {takeProfit}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-white/80">
              وضعیت :
            </p>
            <span className={statusClassName || "text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"}>
              {statusLabel || "به نقطه ورود نرسیده"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-white/80">
              نتیجه :
            </p>
            <span className={outcomeClassName || "text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20"}>
              {outcomeLabel || "در انتظار نتیجه"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex w-full">
          {hasImage ? (
            <button
              type="button"
              onClick={onViewImage}
              className="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-[#A87FF3]/35 bg-[#542C85]/10 px-4 py-2.5 text-xs font-semibold text-[#DCCBFF] transition-colors hover:bg-[#542C85]/18"
              title="مشاهده عکس"
            >
              مشاهده عکس
            </button>
          ) : (
            <span className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-white/35">
              بدون تصویر
            </span>
          )}
        </div>
        <div className="mt-3">
          <SignalManagementButton
            onClick={() => onManageSignal?.()}
            disabled={!onManageSignal}
            fullWidth
          />
        </div>
        <div className="h-px bg-white/10" />
        {description ? (
          <button
            type="button"
            onClick={onViewDescription}
            className="w-full flex items-center justify-between text-xs text-[#A87FF3] hover:text-[#c4a6fc] font-semibold bg-[#A87FF3]/10 hover:bg-[#A87FF3]/20 px-3 py-2 rounded-lg border border-[#A87FF3]/25 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              توضیحات موقعیت
            </span>
          </button>
        ) : (
          <p className="text-xs font-semibold text-white/35">
            بدون توضیحات
          </p>
        )}
      </CardContent>
    </Card>
  );
}
