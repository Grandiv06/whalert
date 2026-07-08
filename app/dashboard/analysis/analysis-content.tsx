"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/ui/profile-card";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/icons/dashboard-icons";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import {
  UserDashboardService,
  FollowUnfollowFilter,
} from "@/lib/api/client";
import type { SignalProviderInfoDto } from "@/lib/api/client";
import type { PagedResultDtoOfSignalProviderInfoDto } from "@/lib/api/client";
import type { UserSubscriptionPlanDetailsDto } from "@/lib/api/client";

type AbpWrapper<T> = { result?: T };
type FilterType = "all" | "followed" | "not-followed";
type FollowToastKind = "success" | "error";
type FollowToast = {
  id: number;
  message: string;
  kind: FollowToastKind;
  createdAt: number;
  durationMs: number;
  actionLabel?: string;
  actionHref?: string;
};

interface ExtendedSignalProviderInfoDto extends SignalProviderInfoDto {
  id?: number;
  signalProviderId?: number;
  stars?: number;
  isAI?: boolean;
  isFollowed?: boolean;
}

function ProfileCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden bg-[#542C85]/20 border-0 rounded-2xl"
      dir="rtl"
      aria-hidden="true"
    >
      <div className="px-6 pt-8 pb-6 flex flex-col items-center space-y-4 relative z-10">
        <div className="flex items-center justify-center overflow-hidden">
          <Skeleton className="h-[70px] w-[70px] rounded-2xl bg-white/15" />
        </div>

        <div className="text-center space-y-3 w-full">
          <Skeleton className="h-6 w-32 mx-auto bg-white/15" />
          <div className="flex flex-row-reverse items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 w-4 rounded-sm bg-[#542C85]/45 border border-[#542C85]/20"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-row-reverse items-center gap-2 w-full justify-center pt-2">
          <Skeleton className="h-10 flex-1 rounded-lg bg-[#542C85]/75" />
          <Skeleton className="h-10 w-10 rounded-lg bg-[#4C1767]/80" />
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-[#02000B]/30"
            >
              <Skeleton
                className={`h-5 bg-white/15 ${
                  index === 0 ? "w-14" : index === 1 ? "w-12" : "w-10"
                }`}
              />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 bg-white/15" />
                <Skeleton
                  className={`h-4 bg-white/15 ${
                    index === 0 ? "w-24" : index === 1 ? "w-20" : "w-28"
                  }`}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-[#02000B]/30 mt-6">
            <Skeleton className="h-5 w-16 bg-white/15" />
            <Skeleton className="h-4 w-20 bg-white/15" />
          </div>

          <div className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-[#02000B]/30">
            <Skeleton className="h-5 w-14 bg-white/15" />
            <Skeleton className="h-4 w-16 bg-white/15" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalysisContent() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [followToasts, setFollowToasts] = useState<FollowToast[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const toastIdRef = useRef(0);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);
  const isMounted = typeof document !== "undefined";

  useEffect(() => {
    if (followToasts.length === 0) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      setFollowToasts((prev) =>
        prev.filter((toast) => current - toast.createdAt < toast.durationMs),
      );
    }, 200);
    return () => window.clearInterval(timer);
  }, [followToasts.length]);

  const pushFollowToast = (message: string, kind: FollowToastKind) => {
    const id = ++toastIdRef.current;
    setFollowToasts((prev) => [
      ...prev,
      { id, message, kind, createdAt: new Date().getTime(), durationMs: 4000 },
    ].slice(-3));
  };

  const pushSubscriptionBlockedToast = () => {
    const id = ++toastIdRef.current;
    setFollowToasts((prev) => [
      ...prev,
      {
        id,
        message: "شما اشتراک فعال ندارید.",
        kind: "error" as FollowToastKind,
        createdAt: new Date().getTime(),
        durationMs: 8000,
        actionLabel: "مشاهده پلن‌ها",
        actionHref: "/dashboard/subscription?openPlans=1",
      },
    ].slice(-3));
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "signalProviders",
      filterType,
      debouncedSearch,
      currentPage,
      pageSize,
    ],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetallsignalproviderinfoPost({
          skipCount: (currentPage - 1) * pageSize,
          maxResultCount: pageSize,
          search: debouncedSearch || undefined,
          followUnfollowFilter:
            filterType === "followed"
              ? FollowUnfollowFilter._1
              : filterType === "not-followed"
                ? FollowUnfollowFilter._2
                : undefined,
        });
      const wrapped =
        res as unknown as AbpWrapper<PagedResultDtoOfSignalProviderInfoDto>;
      return wrapped?.result ?? res;
    },
  });

  const { data: subscriptionDetails } = useQuery({
    queryKey: ["analysis-my-subscription"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
      const wrapped = res as unknown as AbpWrapper<UserSubscriptionPlanDetailsDto>;
      return wrapped?.result ?? res;
    },
  });

  const hasActiveSubscription =
    !!subscriptionDetails?.hasSubscription &&
    !!subscriptionDetails?.endDateUtc &&
    new Date(subscriptionDetails.endDateUtc).getTime() > new Date().getTime();

  const filteredProfiles = (data?.items ?? []) as ExtendedSignalProviderInfoDto[];
  const handleViewDetails = (
    id: number,
    name: string,
    signalProviderId?: number,
  ) => {
    if (!Number.isFinite(id) || id <= 0) return;
    const effectiveProviderId = signalProviderId ?? id;
    const query = new URLSearchParams({
      signalProviderId: String(effectiveProviderId),
    });
    router.push(`/dashboard/opportunities?${query.toString()}`);
  };

  const handleFollow = async (id: number, name: string) => {
    if (!Number.isFinite(id) || id <= 0) return;
    if (!hasActiveSubscription) {
      pushSubscriptionBlockedToast();
      return;
    }
    try {
      await UserDashboardService.apiServicesAppUserdashboardFollowunfollowsignalproviderPost(
        { id, signalProviderId: id } as unknown as { id: number },
      );
      await refetch();
      pushFollowToast(`${name} با موفقیت دنبال شد.`, "success");
    } catch {
      pushFollowToast(`دنبال کردن ${name} ناموفق بود.`, "error");
    }
  };

  const handleUnfollow = async (id: number, name: string) => {
    if (!Number.isFinite(id) || id <= 0) return;
    try {
      await UserDashboardService.apiServicesAppUserdashboardFollowunfollowsignalproviderPost(
        { id, signalProviderId: id } as unknown as { id: number },
      );
      await refetch();
      pushFollowToast(`کاربر ${name} آنفالو شد.`, "success");
    } catch {
      pushFollowToast(`لغو دنبال کردن ${name} ناموفق بود.`, "error");
    }
  };

  const mapToCardProps = (profile: ExtendedSignalProviderInfoDto) => {
    const total = profile.totalSignals || 0;
    const successRate = profile.successRate || 0;
    const failRate = profile.failRate || 0;
    const successCount = Math.round(total * (successRate / 100));
    const failureCount = Math.round(total * (failRate / 100));

    return {
      id: profile.signalProviderId ?? profile.id ?? 0,
      signalProviderId: profile.signalProviderId,
      profileId: profile.id,
      name: profile.name || "Unknown",
      rating: Math.max(0, Math.min(5, profile.stars ?? 0)),
      avatarSrc: null,
      totalPositions: total,
      activePositions: profile.activeSignals || 0,
      lostPositions: profile.closedSignals || 0,
      successRate,
      failureRate: failRate,
      successCount,
      failureCount,
      isAI: profile.isAI || false,
      isFollowed: profile.isFollowed ?? filterType === "followed",
    };
  };

  return (
    <div className="mt-5" dir="rtl">
      <div className="mb-6">
        <div className="flex flex-col flex-col-reverse md:flex-row md:flex-row-reverse items-stretch md:items-center justify-between mb-4 gap-4">
          <div className="grid grid-cols-3 md:flex items-center gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`w-full md:w-[140px] px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-white transition-opacity whitespace-nowrap cursor-pointer ${
                filterType === "all"
                  ? "bg-[#542C85]"
                  : "bg-[#542C85]/30 hover:opacity-90"
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setFilterType("followed")}
              className={`w-full md:w-[140px] px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-white transition-opacity whitespace-nowrap cursor-pointer ${
                filterType === "followed"
                  ? "bg-[#542C85]"
                  : "bg-[#542C85]/30 hover:opacity-90"
              }`}
            >
              دنبال شده
            </button>
            <button
              onClick={() => setFilterType("not-followed")}
              className={`w-full md:w-[140px] px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-white transition-opacity whitespace-nowrap cursor-pointer ${
                filterType === "not-followed"
                  ? "bg-[#542C85]"
                  : "bg-[#542C85]/30 hover:opacity-90"
              }`}
            >
              دنبال نشده
            </button>
          </div>

          <div className="w-full md:flex-1 md:max-w-md relative">
            <Input
              type="text"
              placeholder="جستجو در تحلیل‌ها"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#542C85]/30 h-12 rounded-xl border-[#542C85]/30 text-white placeholder:text-white/70 focus-visible:ring-[#542C85] pr-5"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon className="text-white/70" />
            </div>
          </div>
        </div>

      </div>

      <div className="md:bg-[#02000B]/30 rounded-2xl p-3">
        <div className="flex flex-row-reverse items-center justify-end mb-6">
          <h2 className="text-xl font-bold text-white">تحلیل ها</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))
          ) : filteredProfiles.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-white/70 py-10">
              موردی یافت نشد.
            </div>
          ) : (
            filteredProfiles.map((profile, index) => {
              const { id, signalProviderId, ...cardProps } = mapToCardProps(profile);
              return (
                <ProfileCard
                  key={`${id}-${index}`}
                  {...cardProps}
                  onViewDetails={() =>
                    handleViewDetails(
                      id,
                      cardProps.name,
                      signalProviderId,
                    )
                  }
                  onFollow={() => handleFollow(id, cardProps.name)}
                  onFollowBlocked={pushSubscriptionBlockedToast}
                  onUnfollow={() => handleUnfollow(id, cardProps.name)}
                  canFollow={hasActiveSubscription}
                />
              );
            })
          )}
        </div>
      </div>

      {isMounted && followToasts.length > 0 &&
        createPortal(
          <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 z-[99999] flex w-auto sm:w-[min(92vw,360px)] flex-col gap-2">
            {followToasts.map((toast) => {
              const elapsed = nowMs - toast.createdAt;
              const remainingMs = Math.max(0, toast.durationMs - elapsed);
              const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
              const progressPercent = Math.max(0, (remainingMs / toast.durationMs) * 100);

              return (
                <div
                  key={toast.id}
                  className={`relative overflow-hidden rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
                    toast.kind === "success"
                      ? "border-[#A87FF3]/40 bg-[#542C85]/25 text-white"
                      : "border-[#A87FF3]/30 bg-[#2F1A4D]/60 text-white/90"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2" dir="rtl">
                      {toast.kind === "success" && (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      )}
                      <p className="leading-7 text-[14px] text-right" dir="rtl">
                        {toast.message}
                      </p>
                      {toast.actionLabel && toast.actionHref && (
                        <Button
                          type="button"
                          onClick={() => router.push(toast.actionHref!)}
                          className="h-9 shrink-0 rounded-full border border-white/20 bg-gradient-to-r from-white via-[#F4EEFF] to-[#E7D8FF] px-4 text-[12px] font-bold text-[#542C85] shadow-[0_8px_18px_rgba(255,255,255,0.10)] hover:from-white hover:via-white hover:to-[#F0E2FF] hover:text-[#4A2180] cursor-pointer"
                        >
                          {toast.actionLabel}
                        </Button>
                      )}
                    </div>
                    <span className="shrink-0 rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-medium">
                      {remainingSec}s
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-[width] duration-200 ${
                        toast.kind === "success" ? "bg-[#A87FF3]" : "bg-[#7C4DCC]"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
