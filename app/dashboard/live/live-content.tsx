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
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-8 bg-[#02000b]/60 backdrop-blur-md p-10 rounded-3xl border border-purple-500/20 shadow-2xl">
          <div className="mb-6 rounded-full bg-purple-500/20 p-5 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Lock className="h-12 w-12 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">دسترسی ویژه به لایو ترید</h2>
          <p className="text-lg text-purple-200/80 mb-8 leading-relaxed">
            برای شرکت در جلسات لایو ترید، مشاهده تحلیل‌های زنده و استفاده از فرصت‌های معاملاتی لحظه‌ای، لطفا اشتراک خود را فعال کنید.
          </p>
          <Button
            onClick={() => setIsPlansModalOpen(true)}
            className="rounded-2xl bg-[#542C85] hover:bg-[#6b3ca8] text-white border-0 h-14 px-10 text-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(84,44,133,0.6)]"
          >
            مشاهده پلن‌ها و خرید اشتراک
          </Button>
        </div>

        <Dialog open={isPlansModalOpen} onOpenChange={setIsPlansModalOpen}>
          <DialogContent
            className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden border border-white/20 bg-[radial-gradient(130%_120%_at_100%_0%,rgba(181,124,255,0.26)_0%,rgba(41,18,73,0.94)_42%,rgba(9,2,20,0.98)_100%)] text-white p-4 sm:p-6 md:p-7 shadow-[0_28px_110px_rgba(93,49,160,0.45)] backdrop-blur-xl"
            dir="rtl"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-fuchsia-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-[#D6B4FF]/80 to-transparent" />

            <div className="mt-2 w-full max-w-full overflow-hidden pb-2">
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

