"use client";

import SectionHeader from "./section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { queryKeys } from "@/config/landing-query-keys";
import { statsApi } from "@/lib/landing-api/stats";
import { useQuery } from "@tanstack/react-query";

const TransparencySection = () => {
  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.stats.list(),
    queryFn: statsApi.getAll,
  });

  return (
    <div id="performance">
      {isLoading ? (
        <div className="flex flex-col gap-10">
          <SectionHeader
            title="شفافیت عملکرد، نه وعده سود"
            description="خدمات ما"
          />
          <div className="relative w-full rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
            <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center z-10">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 items-center text-center py-2"
                >
                  <Skeleton className="h-5 w-32 bg-primary-400/20" />
                  <Skeleton className="h-8 w-24 bg-primary-400/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : error || !metrics || metrics.length === 0 ? (
        <div className="flex flex-col gap-10">
          <SectionHeader
            title="شفافیت عملکرد، نه وعده سود"
            description="خدمات ما"
          />
          <div className="relative w-full rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
            <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center z-10">
              {[
                { title: "سیگنال‌های منتشر شده", desc: "—" },
                { title: "نرخ موفقیت", desc: "—" },
                { title: "کاربران فعال", desc: "—" },
                { title: "رضایت کاربران", desc: "—" },
                { title: "سال فعالیت", desc: "—" },
              ].map((m, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-4 items-center text-center ${
                    index === 2
                      ? "bg-primary-400/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 -mx-0 lg:-mx-4 relative z-20 shadow-lg"
                      : "py-2"
                  }`}
                >
                  <p className="text-sm text-white/75 font-medium leading-6">
                    {m.title}
                  </p>
                  <p
                    className={`${
                      index === 2 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                    } font-semibold text-white`}
                  >
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <SectionHeader
            title="شفافیت عملکرد، نه وعده سود"
            description="خدمات ما"
          />

          <div className="relative w-full rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-30"></div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center z-10">
              {metrics.map((metric, index) => (
                <div
                  key={metric.id}
                  className={`flex flex-col gap-4 items-center text-center ${
                    index === 2
                      ? "bg-primary-400/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 -mx-0 lg:-mx-4 relative z-20 shadow-lg"
                      : "py-2"
                  }`}
                >
                  <p className="text-sm text-white/75 font-medium leading-6">
                    {metric.title}
                  </p>
                  <p
                    className={`${
                      index === 2 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                    } font-semibold text-white`}
                  >
                    {metric.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransparencySection;
