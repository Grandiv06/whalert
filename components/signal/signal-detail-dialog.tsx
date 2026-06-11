"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDashboardService, type TradingSignalDetailDto } from "@/lib/api/client";
import { resolveSignalImage } from "@/lib/signal-image";

type AbpWrapper<T> = { result?: T };

export interface SignalDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tradingSignalId?: number | null;
  title?: string;
  description?: string | null;
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-56 w-full rounded-2xl bg-white/10" />
      <Skeleton className="h-4 w-2/3 bg-white/10" />
      <Skeleton className="h-4 w-full bg-white/10" />
      <Skeleton className="h-4 w-5/6 bg-white/10" />
    </div>
  );
}

export function SignalDetailDialog({
  open,
  onOpenChange,
  tradingSignalId,
  title,
  description,
}: SignalDetailDialogProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["signal-detail", tradingSignalId],
    enabled: open && !!tradingSignalId,
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGettradingsignaldetailGet(
          tradingSignalId ?? undefined,
        );
      const wrapped = res as unknown as AbpWrapper<TradingSignalDetailDto>;
      return wrapped?.result ?? res;
    },
  });

  const imageSrc = resolveSignalImage(detail ?? {});
  const imageTitle =
    title ||
    detail?.symbol ||
    (tradingSignalId ? `سیگنال ${tradingSignalId}` : "جزئیات سیگنال");

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPreviewOpen(false);
          onOpenChange(nextOpen);
        }}
      >
        <DialogContent className="w-[calc(100%-1rem)] max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b071e]/96 p-0 text-white shadow-[0_30px_80px_-24px_rgba(93,49,160,0.45)]">
          <div className="max-h-[85vh] overflow-y-auto p-5 md:p-6" dir="rtl">
            <DialogHeader className="mb-5 text-right">
              <DialogTitle className="text-xl font-bold text-white">
                {imageTitle}
              </DialogTitle>
              <DialogDescription className="text-white/70 leading-7">
                {description || detail?.description || "جزئیات سیگنال"}
              </DialogDescription>
            </DialogHeader>

            {isLoading ? (
              <DetailSkeleton />
            ) : error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                بارگذاری جزئیات سیگنال با خطا مواجه شد. لطفاً دوباره تلاش کنید.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  {imageSrc ? (
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="block w-full cursor-pointer"
                      title="نمایش تمام صفحه"
                    >
                      <img
                        src={imageSrc}
                        alt="Signal chart"
                        className="max-h-[420px] w-full object-contain bg-black/30"
                      />
                    </button>
                  ) : detail?.pictureId ? (
                    <div className="flex min-h-[220px] items-center justify-center px-4 text-center text-sm text-white/70">
                      تصویر این سیگنال در دسترس نیست.
                    </div>
                  ) : (
                    <div className="flex min-h-[220px] items-center justify-center px-4 text-center text-sm text-white/70">
                      هیچ تصویر چارتی برای این سیگنال موجود نیست.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-white/45">نماد</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {detail?.symbol || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/45">ورود</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {typeof detail?.entryPrice === "number"
                        ? detail.entryPrice.toLocaleString("en-US")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/45">حد ضرر</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {typeof detail?.stopLoss === "number"
                        ? detail.stopLoss.toLocaleString("en-US")
                        : "-"}
                    </p>
                  </div>
                </div>

                {detail?.takeProfits?.length ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/45">حد سودها</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {detail.takeProfits.map((tp, idx) => (
                        <span
                          key={`${idx}-${tp}`}
                          className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200"
                        >
                          TP{idx + 1}: {tp?.toLocaleString("en-US") ?? "-"}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[96vw] border border-white/10 bg-black/95 p-0 text-white">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Signal chart preview"
              className="max-h-[92vh] w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
