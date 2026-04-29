"use client";

import PlatformsCard from "./platform-card";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultPlatforms } from "@/config/landing-config";
import { queryKeys } from "@/config/landing-query-keys";
import { platformsApi } from "@/lib/landing-api/platforms";
import type { Platform } from "@/lib/landing-api/platforms";
import { Globe, Send, TrendingUp, Target, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const PLATFORM_ICONS: Record<number, LucideIcon> = {
  1: Globe,
  2: Send,
  3: TrendingUp,
  4: Target,
};

const CONTAINER_CLASS =
  "w-full min-h-[72px] relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl sm:rounded-full bg-primary-450 px-4 sm:px-6 py-4 sm:py-0 sm:h-[72px] items-center justify-between gap-4";

const PlatformsSection = () => {
  const {
    data: platforms,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.platforms.list(),
    queryFn: platformsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className={CONTAINER_CLASS}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-full rounded-3xl relative -top-2 bg-white flex justify-between items-center px-6 sm:px-8 py-4 min-h-[72px]"
          >
            <Skeleton className="w-10 h-10 sm:w-[68px] sm:h-[68px] rounded-full shrink-0 bg-primary-400/20" />
            <div className="w-full flex-1 space-y-2 flex flex-col items-center justify-center">
              <Skeleton className="h-5 w-24 bg-primary-400/20 rounded" />
              <Skeleton className="h-4 w-28 sm:w-32 bg-primary-400/20 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={CONTAINER_CLASS}>
        <div className="col-span-full flex items-center justify-center min-h-[72px]">
          <p className="text-white text-sm">Error loading platforms</p>
        </div>
      </div>
    );
  }

  const list = platforms && platforms.length > 0 ? platforms : defaultPlatforms;

  return (
    <div className={CONTAINER_CLASS}>
      {list.map((platform: Platform) => (
        <PlatformsCard
          key={platform.id}
          title={platform.title ?? ""}
          description={platform.description ?? ""}
          imageAddress={platform.imageAddress ?? ""}
          icon={PLATFORM_ICONS[platform.id]}
        />
      ))}
    </div>
  );
};

export default PlatformsSection;
