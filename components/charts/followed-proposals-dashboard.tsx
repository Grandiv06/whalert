"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DualProgress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { ChartPieDonutText } from "./chart-pie-donut-text";
import { DateRangeTwoButtons } from "@/components/ui/date-range-two-buttons";
import type { FollowedOfferStatusResultDto } from "@/lib/api/client";
import { SignalStatus } from "@/lib/api/client";

const timeFilters = [
  { id: "24h", label: "آخرین ۲۴ ساعت" },
  { id: "7d", label: "آخرین ۷ روز" },
  { id: "30d", label: "آخرین ۳۰ روز" },
  { id: "180d", label: "آخرین ۱۸۰ روز" },
  { id: "all", label: "همه زمانها" },
];

export type FollowedProposalsDashboardProps = {
  status?: FollowedOfferStatusResultDto | null;
  isLoading?: boolean;
  activeFilter?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  statusFilter?: SignalStatus;
  onFilterChange?: (
    filter: string,
    fromDate?: Date | null,
    toDate?: Date | null,
  ) => void;
  onStatusFilterChange?: (status: SignalStatus | undefined) => void;
};

export function FollowedProposalsDashboard({
  status,
  isLoading = false,
  activeFilter: controlledFilter = "24h",
  dateFrom: controlledDateFrom,
  dateTo: controlledDateTo,
  onFilterChange,
}: FollowedProposalsDashboardProps) {
  const [internalFilter, setInternalFilter] = React.useState("24h");
  const [internalDateFrom, setInternalDateFrom] = React.useState<Date | null>(
    null,
  );
  const [internalDateTo, setInternalDateTo] = React.useState<Date | null>(null);

  const isControlled = onFilterChange !== undefined;
  const activeFilter = isControlled ? controlledFilter : internalFilter;
  const dateFrom = isControlled ? controlledDateFrom : internalDateFrom;
  const dateTo = isControlled ? controlledDateTo : internalDateTo;
  const { theme } = useTheme();

  const filterButtonClass = React.useCallback(
    (isActive: boolean) =>
      cn(
        "h-10 px-4 md:h-12 md:px-6 rounded-2xl border text-sm md:text-base font-bold shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        theme === "dark" ? "backdrop-blur-sm" : "",
        isActive
          ? theme === "dark"
            ? "bg-purple-500/20 border-purple-500/30 text-purple-100 hover:bg-purple-500/25"
            : "bg-teal-100 border-teal-200 text-teal-700 hover:bg-teal-200"
          : theme === "dark"
            ? "bg-white/5 border-white/10 text-white/85 hover:bg-white/10 hover:text-white"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      ),
    [theme],
  );

  const handlePresetFilter = (id: string) => {
    if (isControlled) {
      onFilterChange?.(id, null, null);
    } else {
      setInternalFilter(id);
      setInternalDateFrom(null);
      setInternalDateTo(null);
    }
  };

  const handleDateRangeChange = (range: {
    fromDate?: Date | null;
    toDate?: Date | null;
  }) => {
    const from = range.fromDate ?? null;
    const to = range.toDate ?? null;
    if (isControlled) {
      onFilterChange?.("custom", from, to);
    } else {
      if (range.fromDate !== undefined) setInternalDateFrom(from);
      if (range.toDate !== undefined) setInternalDateTo(to);
      if (from || to) setInternalFilter("custom");
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:flex-wrap gap-4 w-full">
        {/* بخش تاریخ: موبایل عمودی، دسکتاپ مشخص کنید + دکمه‌ها در یک ردیف */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 w-full md:w-auto md:order-2">
          <span
            className={cn(
              "text-sm font-bold shrink-0",
              theme === "dark" ? "text-white/50" : "text-gray-400",
            )}
          >
            مشخص کنید:
          </span>
          <DateRangeTwoButtons
            fromDate={dateFrom}
            toDate={dateTo}
            onChange={handleDateRangeChange}
          />
        </div>

        {/* بخش فیلترها: موبایل عمودی با اسکرول، دسکتاپ همانند حالت اول */}
        <div className="flex flex-col md:flex-row-reverse md:items-center md:flex-wrap gap-3 w-full md:w-auto md:flex-1 md:justify-end">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <Button
              variant="tertiary"
              onClick={() => handlePresetFilter("all")}
              aria-pressed={activeFilter === "all"}
              className={cn(
                filterButtonClass(activeFilter === "all"),
                "whitespace-nowrap shrink-0 cursor-pointer w-full md:w-auto md:min-w-[140px]",
              )}
            >
              همه زمانها
            </Button>
          </div>
          {/* فیلترهای زمانی: موبایل اسکرول افقی، دسکتاپ flex-wrap */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent md:flex-wrap md:overflow-visible md:mx-0 md:px-0">
            {timeFilters
              .filter((f) => f.id !== "all")
              .map((filter) => (
                <Button
                  key={filter.id}
                  variant="tertiary"
                  onClick={() => handlePresetFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                  className={cn(
                    filterButtonClass(activeFilter === filter.id),
                    "whitespace-nowrap shrink-0 cursor-pointer flex-shrink-0",
                  )}
                >
                  {filter.label}
                </Button>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[rgba(2,0,11,0.3)] border-0 rounded-[20px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] backdrop-blur-[4px]">
          <CardContent className="p-6 h-full">
            <div className="flex flex-col justify-center h-full gap-16">
              <DualProgress
                segments={[
                  {
                    value: status?.countShorts ?? 0,
                    label: "فروش",
                    color: "#ef4444",
                  },
                  {
                    value: status?.countLongs ?? 0,
                    label: "خرید",
                    color: "#22c55e",
                  },
                ]}
                showLabels={true}
                showValues={true}
                showCounts={true}
              />
              <DualProgress
                segments={[
                  {
                    value: status?.lossCount ?? 0,
                    label: "نرخ شکست",
                    color: "#f59e0b",
                  },
                  {
                    value: status?.winsCount ?? 0,
                    label: "نرخ موفقیت",
                    color: "#14b8a6",
                  },
                ]}
                showLabels={true}
                showValues={true}
                showCounts={true}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[rgba(2,0,11,0.3)] border-0 rounded-[20px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] backdrop-blur-[4px]">
          <CardContent className="p-6">
            <ChartPieDonutText
              isLoading={isLoading}
              data={
                isLoading
                  ? []
                  : status
                    ? [
                        {
                          name: "در انتظار",
                          value: status.pendingPositionsCount ?? 0,
                        },
                        {
                          name: "فعال",
                          value: status.activePositionsCount ?? 0,
                        },
                        {
                          name: "از دست رفته",
                          value: status.missedPositionsCount ?? 0,
                        },
                      ]
                    : undefined
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
