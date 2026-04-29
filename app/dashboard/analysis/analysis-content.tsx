"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/ui/profile-card";
import { SearchIcon } from "@/components/icons/dashboard-icons";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  UserDashboardService,
  FollowUnfollowFilter,
  SessionService,
} from "@/lib/api/client";
import type { SignalProviderInfoDto } from "@/lib/api/client";
import type { PagedResultDtoOfSignalProviderInfoDto } from "@/lib/api/client";
import type { GetCurrentLoginInformationsOutput } from "@/lib/api/client";
import { getApiBaseUrl } from "@/config/env";

type AbpWrapper<T> = { result?: T };
type FilterType = "all" | "followed" | "not-followed";
type FollowToastKind = "success" | "error";
type FollowToast = {
  id: number;
  message: string;
  kind: FollowToastKind;
  createdAt: number;
  durationMs: number;
};

interface ExtendedSignalProviderInfoDto extends SignalProviderInfoDto {
  id?: number;
  signalProviderId?: number;
  stars?: number;
  file?: string | null;
  profilePictureId?: string | null;
  isAI?: boolean;
  isFollowed?: boolean;
}

const guidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isGuid = (value?: string | null) =>
  !!value && guidPattern.test(value.trim());

const apiBaseUrl = getApiBaseUrl().replace(/\/$/, "");

const normalizeProviderAvatar = (
  raw?: string | null,
  profilePictureId?: string | null,
): string | null => {
  const candidate = profilePictureId?.trim() || raw?.trim() || null;
  if (!candidate) return null;

  if (isGuid(candidate)) {
    return `${apiBaseUrl}/File/DownloadBinaryFile?id=${encodeURIComponent(candidate)}`;
  }

  const value = candidate;
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }
  return `data:image/jpeg;base64,${value}`;
};

export function AnalysisContent() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [followToasts, setFollowToasts] = useState<FollowToast[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isMounted, setIsMounted] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setFollowToasts((prev) => [
      ...prev,
      { id, message, kind, createdAt: Date.now(), durationMs: 4000 },
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

  const { data: currentLoginInfo } = useQuery({
    queryKey: ["currentLoginInfo"],
    queryFn: async () => {
      const res =
        await SessionService.apiServicesAppSessionGetcurrentlogininformationsGet();
      const wrapped = res as unknown as AbpWrapper<GetCurrentLoginInformationsOutput>;
      return wrapped?.result ?? res;
    },
  });

  const filteredProfiles = (data?.items ?? []) as ExtendedSignalProviderInfoDto[];
  const handleViewDetails = (
    id: number,
    name: string,
    signalProviderId?: number,
    profileId?: number,
  ) => {
    if (!Number.isFinite(id) || id <= 0) return;
    const currentUserId = currentLoginInfo?.user?.id;
    if (
      currentUserId &&
      (currentUserId === id ||
        currentUserId === signalProviderId ||
        currentUserId === profileId)
    ) {
      router.push("/dashboard/opportunities");
      return;
    }
    const effectiveProviderId = signalProviderId ?? id;
    const query = new URLSearchParams({
      signalProviderId: String(effectiveProviderId),
    });
    const normalizedName = name.trim();
    if (normalizedName) {
      query.set("providerName", normalizedName);
    }
    router.push(`/dashboard/opportunities?${query.toString()}`);
  };

  const handleFollow = async (id: number, name: string) => {
    if (!Number.isFinite(id) || id <= 0) return;
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
      avatarSrc: normalizeProviderAvatar(profile.file, profile.profilePictureId),
      totalPositions: total,
      activePositions: profile.activeSignals || 0,
      lostPositions: profile.lostSignals || 0,
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
              <div
                key={i}
                className="h-[300px] w-full rounded-2xl bg-[#542C85]/20 animate-pulse"
              />
            ))
          ) : filteredProfiles.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-white/70 py-10">
              موردی یافت نشد.
            </div>
          ) : (
            filteredProfiles.map((profile, index) => {
              const { id, signalProviderId, profileId, ...cardProps } =
                mapToCardProps(profile);
              return (
                <ProfileCard
                  key={`${id}-${index}`}
                  {...cardProps}
                  onViewDetails={() =>
                    handleViewDetails(
                      id,
                      cardProps.name,
                      signalProviderId,
                      profileId,
                    )
                  }
                  onFollow={() => handleFollow(id, cardProps.name)}
                  onUnfollow={() => handleUnfollow(id, cardProps.name)}
                />
              );
            })
          )}
        </div>
      </div>

      {isMounted && followToasts.length > 0 &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-[99999] flex w-[min(92vw,360px)] flex-col gap-2">
            {followToasts.map((toast) => {
              const elapsed = nowMs - toast.createdAt;
              const remainingMs = Math.max(0, toast.durationMs - elapsed);
              const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
              const progressPercent = Math.max(0, (remainingMs / toast.durationMs) * 100);

              return (
                <div
                  key={toast.id}
                className={`relative overflow-hidden rounded-xl border px-3 py-2.5 text-sm shadow-lg backdrop-blur-md ${
                  toast.kind === "success"
                    ? "border-[#A87FF3]/40 bg-[#542C85]/25 text-white"
                    : "border-[#A87FF3]/30 bg-[#2F1A4D]/60 text-white/90"
                }`}
              >
                  <div className="flex items-start gap-2">
                    {toast.kind === "success" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="leading-6">{toast.message}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-black/25 px-1.5 py-0.5 text-[11px] font-medium">
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
