"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
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
            </DialogHeader>

            {isLoading ? (
              <DetailSkeleton />
            ) : error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                بارگذاری جزئیات سیگنال با خطا مواجه شد. لطفاً دوباره تلاش کنید.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                {imageSrc ? (
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="block aspect-video w-full cursor-pointer bg-black/30"
                    title="نمایش تمام صفحه"
                  >
                    <img
                      src={imageSrc}
                      alt="Signal chart"
                      className="h-full w-full object-contain"
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
