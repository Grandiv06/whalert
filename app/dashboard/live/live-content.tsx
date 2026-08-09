"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserDashboardService } from "@/lib/api/client";
import type { UserSubscriptionPlanDetailsDto, GetLiveSessionsOutput, LiveSessionDto } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import PlansSection from "@/components/shared/plans-section";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { HeroSection } from "@/components/live/hero-section";
import { StatusCards } from "@/components/live/status-cards";
import { SessionsTable } from "@/components/live/sessions-table";
import { FeaturesSection } from "@/components/live/features-section";
import { BottomCta } from "@/components/live/bottom-cta";

type AbpWrapper<T> = { result?: T };
function unwrapAbp<T>(res: unknown): T {
  const w = res as AbpWrapper<T>;
  return (w?.result ?? res) as T;
}

export function LiveContent() {
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  const { data: subscriptionDetails, isLoading: isLoadingSub } = useQuery({
    queryKey: ["live-mySubscriptionPlanDetails"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
      return unwrapAbp<UserSubscriptionPlanDetailsDto>(res);
    },
  });

  const hasActiveSubscription =
    !!subscriptionDetails?.hasSubscription &&
    (subscriptionDetails?.remainingDays ?? 0) > 0;

  const { data: liveSessionsData, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["live-sessions"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetlivesessionsGet();
      return unwrapAbp<GetLiveSessionsOutput>(res);
    },
    enabled: hasActiveSubscription,
  });

  const sessions: LiveSessionDto[] = liveSessionsData?.items ?? [];

  const sortedSessions = [...sessions].sort((a, b) => {
    const tA = a.scheduledStartUtc ? new Date(a.scheduledStartUtc).getTime() : 0;
    const tB = b.scheduledStartUtc ? new Date(b.scheduledStartUtc).getTime() : 0;
    return tA - tB;
  });

  const now = Date.now();
  const nextSession =
    sortedSessions.find(
      (s) => s.scheduledStartUtc && new Date(s.scheduledStartUtc).getTime() + 2 * 60 * 60 * 1000 >= now
    ) || sortedSessions[0] || null;

  if (isLoadingSub) {
    return (
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pt-4 sm:px-6 md:gap-8 md:pt-8 lg:px-8 pb-20">
        <Skeleton className="h-[400px] w-full rounded-3xl bg-[#542C85]/20" />
        <Skeleton className="h-[200px] w-full rounded-3xl bg-[#542C85]/20" />
        <Skeleton className="h-[300px] w-full rounded-3xl bg-[#542C85]/20" />
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pt-4 sm:px-6 md:gap-8 md:pt-8 lg:px-8 pb-20 items-center justify-center min-h-[70vh]" dir="rtl">
        <div className="flex w-full flex-col items-center justify-center text-center max-w-2xl mx-auto mb-8 bg-[#02000b]/60 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-purple-500/20 shadow-2xl">
          <div className="mb-4 sm:mb-6 rounded-full bg-purple-500/20 p-4 sm:p-5 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">دسترسی ویژه به لایو ترید</h2>
          <p className="text-base sm:text-lg text-purple-200/80 mb-6 sm:mb-8 leading-relaxed">
            برای شرکت در جلسات لایو ترید، مشاهده تحلیل‌های زنده و استفاده از فرصت‌های معاملاتی لحظه‌ای، لطفا اشتراک خود را فعال کنید.
          </p>
          <Button
            onClick={() => setIsPlansModalOpen(true)}
            className="rounded-2xl bg-[#542C85] hover:bg-[#6b3ca8] text-white border-0 h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(84,44,133,0.6)]"
          >
            مشاهده پلن‌ها و خرید اشتراک
          </Button>
        </div>

        <Dialog open={isPlansModalOpen} onOpenChange={setIsPlansModalOpen}>
          <DialogContent
            className="max-h-[92vh] w-[95vw] max-w-6xl overflow-hidden border border-white/15 bg-[#0b0518] p-0 text-white shadow-[0_28px_110px_rgba(93,49,160,0.5)] sm:rounded-3xl"
            dir="rtl"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(181,124,255,0.22)_0%,transparent_55%),radial-gradient(90%_70%_at_0%_100%,rgba(79,70,229,0.16)_0%,transparent_50%)]" />
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-l from-transparent via-[#D6B4FF]/70 to-transparent" />

            <div className="relative hidden sm:block border-b border-white/10 px-5 pb-4 pt-6 sm:px-7 sm:pt-7">
              <h2 className="text-right text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                انتخاب پلن اشتراک
              </h2>
              <p className="mt-1.5 text-right text-sm text-white/55">
                پلن مناسب خود را انتخاب کنید و دسترسی به لایو ترید را فعال کنید.
              </p>
            </div>

            <div className="relative px-4 pt-10 pb-5 sm:px-6 sm:py-6 overflow-y-auto overflow-x-hidden max-h-[calc(92vh-100px)] custom-scrollbar">
              <PlansSection showHeader={false} onPurchaseSuccess={() => setIsPlansModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pt-4 sm:px-6 md:gap-8 md:pt-8 lg:px-8 pb-20">
      <HeroSection />
      
      <div className="grid w-full grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        <StatusCards type="status" nextSession={nextSession} isLoading={isLoadingSessions} />
        <StatusCards type="countdown" nextSession={nextSession} isLoading={isLoadingSessions} />
      </div>

      <SessionsTable sessions={sortedSessions} nextSessionId={nextSession?.id} isLoading={isLoadingSessions} />
      
      <FeaturesSection />
      
      <BottomCta />
    </div>
  );
}

