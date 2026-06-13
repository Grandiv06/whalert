"use client";

import { useState } from "react";
import SectionHeader from "./section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { queryKeys } from "@/config/landing-query-keys";
import { signalsApi, type Signal } from "@/lib/landing-api/signals";
import { useQuery } from "@tanstack/react-query";
import { SignalDetailDialog } from "@/components/signal/signal-detail-dialog";
import { resolveSignalImage } from "@/lib/signal-image";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SignalCard = ({
  signal,
  onOpenDetail,
}: {
  signal: Signal;
  onOpenDetail?: () => void;
}) => {
  const imageSrc = resolveSignalImage(signal);
  return (
    <div
      dir="rtl"
      className="relative p-6 rounded-2xl flex flex-col gap-5 min-h-[200px] h-full overflow-hidden border border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 50% 50%, #2e1b4b 0%, #1a0f2e 70%)",
        backgroundImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, #2e1b4b 0%, #1a0f2e 70%), radial-gradient(circle at 20% 30%, rgba(250,204,21,0.08) 0%, transparent 2px), radial-gradient(circle at 80% 70%, rgba(250,204,21,0.06) 0%, transparent 2px), radial-gradient(circle at 50% 50%, rgba(250,204,21,0.05) 0%, transparent 1px)",
      }}
    >
      {imageSrc ? (
        <button
          type="button"
          onClick={onOpenDetail}
          className="overflow-hidden rounded-xl border border-white/10 bg-black/20"
        >
          <img
            src={imageSrc}
            alt="Signal chart"
            className="h-36 w-full object-contain bg-black/20"
          />
        </button>
      ) : signal.pictureId ? (
        <button
          type="button"
          onClick={onOpenDetail}
          className="flex h-20 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 px-4 text-xs font-semibold text-white/75 transition-colors hover:bg-white/10"
        >
          View chart image
        </button>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <span className="text-xl font-bold text-white tracking-tight">
          {signal.symbol}
        </span>
        <span
          className={`shrink-0 px-3 py-1.5 rounded-2xl text-white text-xs font-semibold shadow-lg capitalize flex items-center justify-center ${
            signal.status === "Active"
              ? "bg-emerald-500 hover:bg-emerald-600"
              : signal.status === "Closed"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-amber-500/80 hover:bg-amber-500"
          } transition-colors`}
        >
          {signal.status}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-white">
        <div>
          <span className="text-white/70">Entry : </span>
          <span className="font-medium">{signal.entry.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-white/70">Stop Loss : </span>
          <span className="font-medium">{signal.stopLoss.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-white/70">Take Profit : </span>
          <span className="font-medium">{signal.takeProfit.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-xs text-white/60">{signal.date}</span>
        <span
          className={`text-xs font-medium ${
            (signal.risk ?? "").startsWith("-")
              ? "text-red-400/90"
              : (signal.risk ?? "").startsWith("+")
              ? "text-emerald-400/90"
              : "text-white/70"
          }`}
        >
          {signal.risk ?? "—"}
        </span>
      </div>
    </div>
  );
};

const LatestSignal = () => {
  const [detailSignalId, setDetailSignalId] = useState<number | null>(null);
  const [detailSignalTitle, setDetailSignalTitle] = useState<string>("");
  const {
    data: signals,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.signals.list(),
    queryFn: signalsApi.getAll,
  });
  const carouselSignals = signals?.length
    ? Array.from(
        { length: Math.max(signals.length, 9) },
        (_, index) => signals[index % signals.length],
      )
    : [];

  return (
    <div className="w-full">
      <div className="w-full mb-4 sm:mb-6">
        <SectionHeader
          title="آخرین سیگنال‌های منتشر شده"
          description="سیگنال‌هایی که در پلتفرم منتشر شدند"
        />
      </div>
      {isLoading ? (
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-[180px] w-full min-w-[280px] rounded-3xl bg-primary-400/20"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-white/70">
          خطا در بارگذاری سیگنال‌ها
        </div>
      ) : !signals || signals.length === 0 ? (
        <div className="text-center py-8 text-white/70">سیگنالی یافت نشد</div>
      ) : (
        <div className="py-12 overflow-hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            dir="ltr"
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            centeredSlides={false}
            speed={700}
            autoplay={{
              delay: 2200,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            loop={signals.length > 1}
            loopAdditionalSlides={carouselSignals.length}
            pagination={{ clickable: true }}
            watchOverflow
            observer
            observeParents
            updateOnWindowResize
            className="latest-signals-swiper mx-auto max-w-[1080px]"
          >
            {carouselSignals.map((signal, index) => (
              <SwiperSlide key={`${signal.id}-${index}`} className="!h-auto">
                <SignalCard
                  signal={signal}
                  onOpenDetail={() => {
                    setDetailSignalId(signal.id);
                    setDetailSignalTitle(signal.symbol);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <SignalDetailDialog
        open={detailSignalId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDetailSignalId(null);
            setDetailSignalTitle("");
          }
        }}
        tradingSignalId={detailSignalId}
        title={detailSignalTitle}
      />
    </div>
  );
};

export default LatestSignal;
