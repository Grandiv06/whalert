import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { resolveSignalImage } from "@/lib/signal-image";

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
  pictureUrl?: string | null;
  pictureId?: string | null;
  pictureBase64?: string | null;
  onViewImage?: () => void;
}

export function SignalCard({
  pictureUrl,
  pictureId,
  pictureBase64,
  onViewImage,
  time,
  analysisModel,
  market,
  symbol,
  direction,
  entry,
  stopLoss,
  takeProfit,
}: SignalCardProps) {
  const [datePart, timePart] = time.includes(" - ") ? time.split(" - ") : [time, ""];
  const imageSrc = resolveSignalImage({ pictureUrl, pictureBase64 });

  return (
    <Card className="w-full" dir="rtl">
      <CardContent className="p-4 space-y-3">
        {imageSrc ? (
          <button
            type="button"
            onClick={onViewImage}
            className="block w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 cursor-pointer"
            title="مشاهده تصویر چارت"
          >
            <img
              src={imageSrc}
              alt="Signal chart"
              className="h-44 w-full object-contain bg-black/20"
            />
          </button>
        ) : pictureId ? (
          <button
            type="button"
            onClick={onViewImage}
            className="flex h-28 w-full items-center justify-center rounded-xl border border-dashed border-[#A87FF3]/35 bg-[#542C85]/10 px-4 text-sm font-semibold text-[#DCCBFF] transition-colors hover:bg-[#542C85]/18"
          >
            View chart image
          </button>
        ) : null}
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col flex-shrink-0">
            <p className="text-xs md:text-sm font-medium text-foreground">{datePart}</p>
            {timePart && (
              <p className="text-xs md:text-sm font-medium text-foreground mt-1">
                {timePart}
              </p>
            )}
          </div>
          <div className="text-right min-w-0">
            <p className="text-xs md:text-sm font-medium text-foreground">
              مدل تحلیل : {analysisModel}
            </p>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2">
          <div className="space-y-2 md:space-y-2.5 text-right">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">بازار</p>
              <p className="text-xs md:text-sm font-medium text-foreground">{market}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">جهت</p>
              <span
                className={cn(
                  "text-xs md:text-sm font-semibold",
                  direction === "BUY" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {direction}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">حد ضرر</p>
              <p className="text-xs md:text-sm font-medium text-foreground">{stopLoss}</p>
            </div>
          </div>
          <div className="space-y-2 md:space-y-2.5 text-left">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">نمادها</p>
              <p className="text-xs md:text-sm font-medium text-foreground">{symbol}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">ورودی</p>
              <p className="text-xs md:text-sm font-medium text-foreground">{entry}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">حد سود</p>
              <p className="text-xs md:text-sm font-medium text-foreground">{takeProfit}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
