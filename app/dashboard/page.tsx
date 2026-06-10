"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { HomeContent } from "./home-content";
import {
  UserDashboardService,
  type UserSubscriptionPlanDetailsDto,
} from "@/lib/api/client";

type AbpWrapper<T> = { result?: T };

function unwrapAbp<T>(res: unknown): T {
  const wrapped = res as AbpWrapper<T>;
  return (wrapped?.result ?? res) as T;
}

function isSubscriptionActive(details?: UserSubscriptionPlanDetailsDto | null) {
  if (!details?.hasSubscription) return false;
  if (typeof details.remainingDays === "number") {
    return details.remainingDays > 0;
  }
  if (details.endDateUtc) {
    return new Date(details.endDateUtc).getTime() > Date.now();
  }
  return false;
}

export default function DashboardPage() {
  const router = useRouter();

  const { data: subscriptionDetails, isLoading } = useQuery({
    queryKey: ["dashboard-root-subscription-details"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
      return unwrapAbp<UserSubscriptionPlanDetailsDto>(res);
    },
  });

  const shouldRedirectToAnalysis =
    !isLoading && !isSubscriptionActive(subscriptionDetails);

  useEffect(() => {
    if (shouldRedirectToAnalysis) {
      router.replace("/dashboard/analysis/");
    }
  }, [router, shouldRedirectToAnalysis]);

  if (isLoading || shouldRedirectToAnalysis) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#1a0c35] dark-bg-gradient"
        dir="rtl"
      >
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#542C85]/25 border-t-[#542C85] border-r-[#8445C2]" />
      </div>
    );
  }

  return <HomeContent />;
}
