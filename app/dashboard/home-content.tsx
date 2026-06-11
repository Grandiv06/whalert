"use client";

import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FollowedProposalsDashboard } from "@/components/charts/followed-proposals-dashboard";
import { SignalCard } from "@/components/charts/signal-card";
import { SignalDetailDialog } from "@/components/signal/signal-detail-dialog";
import useDevice from "@/hooks/useDevice";
import { useQuery } from "@tanstack/react-query";
import {
  UserDashboardService,
  ShowPositionsDto,
  MarketType,
  SignalSide,
} from "@/lib/api/client";
import type { DashboardPageResultDto } from "@/lib/api/client";
import type { DashboardPageInputDto } from "@/lib/api/client";
import { FollowedOfferStatusTimeFilter } from "@/lib/api/client";
import { SignalStatus } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SignalCardProps } from "@/components/charts/signal-card";
import { normalizePersianText } from "@/lib/utils";

type AbpWrapper<T> = { result?: T };

const TIME_FILTER_MAP: Record<string, FollowedOfferStatusTimeFilter> = {
  "24h": FollowedOfferStatusTimeFilter._0,
  "7d": FollowedOfferStatusTimeFilter._1,
  "30d": FollowedOfferStatusTimeFilter._2,
  "180d": FollowedOfferStatusTimeFilter._3,
  all: FollowedOfferStatusTimeFilter._4,
};

function MobileSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-full" dir="rtl">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="h-px bg-border" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[1, 2, 3].map((j) => (
                <div key={j}>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DesktopSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow
          key={i}
          className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
            <TableCell key={j} className="text-center h-[72px] px-6 py-8">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function mapSignalToCardProps(signal: ShowPositionsDto): SignalCardProps {
  return {
    id: signal.tradingSignalId ?? 0,
    time: signal.date
      ? new Date(signal.date)
          .toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(",", " - ")
      : "-",
    market: signal.market === MarketType._1 ? "CRYPTO" : "FOREX",
    analysisModel: normalizePersianText(signal.displayName || "-"),
    symbol: normalizePersianText(signal.symbol || "-"),
    direction: signal.side === SignalSide._1 ? "BUY" : "SELL",
    entry: signal.entryPrice?.toString() || "-",
    stopLoss: signal.sl?.toString() || "-",
    takeProfit: signal.tPs?.length ? String(signal.tPs[0]) : "-",
    pictureUrl: signal.pictureUrl ?? null,
    pictureId: signal.pictureId ?? null,
    pictureBase64: signal.pictureBase64 ?? null,
  };
}

export function HomeContent() {
  const device = useDevice();
  const isMobile = device === "mobile";
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeFilter, setActiveFilter] = useState("24h");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<SignalStatus | undefined>(
    undefined,
  );
  const [detailSignalId, setDetailSignalId] = useState<number | null>(null);
  const [detailSignalTitle, setDetailSignalTitle] = useState<string>("");

  const buildInput = useCallback((): DashboardPageInputDto => {
    const input: DashboardPageInputDto = {
      skipCount: (currentPage - 1) * pageSize,
      maxResultCount: pageSize,
      sorting: "date desc",
    };
    if (activeFilter === "custom" && (dateFrom || dateTo)) {
      input.fromDate = dateFrom?.toISOString() ?? undefined;
      input.toDate = dateTo?.toISOString() ?? undefined;
    } else if (activeFilter !== "custom") {
      input.timeFilter = TIME_FILTER_MAP[activeFilter];
    }
    if (statusFilter !== undefined) input.status = statusFilter;
    return input;
  }, [currentPage, pageSize, activeFilter, dateFrom, dateTo, statusFilter]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [
      "dashboardPage",
      currentPage,
      pageSize,
      activeFilter,
      dateFrom?.toISOString(),
      dateTo?.toISOString(),
      statusFilter,
    ],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetdashboardpagePost(
          buildInput(),
        );
      const wrapped = res as unknown as AbpWrapper<DashboardPageResultDto>;
      return wrapped?.result ?? res;
    },
  });

  const items = dashboardData?.positions ?? [];
  const totalCount = dashboardData?.totalPositionsCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 0;
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="p-1 md:p-6 w-full max-w-full overflow-x-hidden">
      <div className="space-y-4 md:space-y-6">
        <FollowedProposalsDashboard
          status={dashboardData?.status}
          isLoading={isLoading}
          activeFilter={activeFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
          statusFilter={statusFilter}
          onFilterChange={(filter, from, to) => {
            setActiveFilter(filter);
            setDateFrom(from ?? null);
            setDateTo(to ?? null);
            setCurrentPage(1);
          }}
          onStatusFilterChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1);
          }}
        />

        <div dir="rtl">
          {isMobile ? (
            <div className="space-y-4">
              {isLoading && <MobileSkeleton />}
              {!isLoading && items.length === 0 && (
                <div className="text-center text-muted-foreground dark:text-white/70 py-8">
                  هیچ داده‌ای یافت نشد.
                </div>
              )}
              {!isLoading &&
                items.map((signal: ShowPositionsDto, i: number) => (
                  <SignalCard
                    key={i}
                    {...mapSignalToCardProps(signal)}
                    onViewImage={() => {
                      setDetailSignalId(signal.tradingSignalId ?? null);
                      setDetailSignalTitle(signal.symbol || "سیگنال");
                    }}
                  />
                ))}
            </div>
          ) : (
            <div className="overflow-hidden -mx-4 md:mx-0">
              <div className="overflow-x-auto px-4 md:px-0 [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-[20px]">
                <Table className="min-w-[800px] md:min-w-0">
                  <TableHeader className="h-14">
                    <TableRow>
                      <TableHead className="text-center text-white h-12">
                        #
                      </TableHead>
                      <TableHead className="text-center text-white h-12">
                        زمان
                      </TableHead>
                      <TableHead className="text-center text-white h-12">
                        مدل تحلیل
                      </TableHead>
                      <TableHead className="text-center text-white h-12">
                        بازار
                      </TableHead>
                      <TableHead className="text-center text-white h-12">
                        نمادها
                      </TableHead>
                      <TableHead className="text-center text-white h-12">
                        جهت
                      </TableHead>
                      <TableHead className="text-center text-white h-12">
                        ورود
                      </TableHead>
                      <TableHead className="text-center text-white h-12">
                        حد ضرر
                      </TableHead>
                      <TableHead className="text-center text-white h-12">
                        حد سود
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && <DesktopSkeleton />}
                    {!isLoading && items.length === 0 && (
                      <TableRow className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50">
                          <TableCell
                            className="text-center text-muted-foreground dark:text-white/70 h-[72px] px-6 py-8"
                            colSpan={9}
                          >
                          هیچ داده‌ای یافت نشد.
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoading &&
                      items.map((signal: ShowPositionsDto, i: number) => (
                        <TableRow
                          key={i}
                          className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50"
                        >
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {startIndex + i + 1}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {signal.date
                              ? new Date(signal.date).toLocaleDateString(
                                  "fa-IR",
                                )
                              : "-"}
                          </TableCell>
                          <TableCell className="text-center max-w-[150px] truncate h-[72px] px-6 py-8">
                            {normalizePersianText(signal.displayName || "-")}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {signal.market === MarketType._1
                              ? "CRYPTO"
                              : "FOREX"}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {normalizePersianText(signal.symbol || "-")}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            <span
                              className={
                                signal.side === SignalSide._1
                                  ? "text-green-600 dark:text-green-400 font-semibold"
                                  : "text-red-600 dark:text-red-400 font-semibold"
                              }
                            >
                              {signal.side === SignalSide._1 ? "BUY" : "SELL"}
                            </span>
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {signal.entryPrice}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {signal.sl}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {signal.tPs?.length ? (
                              <div className="flex items-center justify-center w-full">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      className="group flex items-center gap-1.5 rounded-xl border border-[#9C73DE]/45 bg-[#3A2068]/55 px-2.5 py-1 text-[11px] font-bold text-[#EDE3FF] shadow-[0_6px_18px_rgba(40,18,74,0.35)] transition-all hover:scale-[1.02] hover:border-[#B996F2]/65 hover:bg-[#4A2A7E]/65 cursor-pointer"
                                    >
                                      <span className="tracking-wide">{signal.tPs[0]}</span>
                                      {signal.tPs.length > 1 ? (
                                        <span
                                          dir="ltr"
                                          className="inline-flex h-[16px] w-[16px] min-w-[16px] max-w-[16px] max-h-[16px] items-center justify-center rounded-full border border-[#CBAFFF]/55 bg-[#5A3493] font-mono text-[8px] font-extrabold leading-[1] text-center text-[#EFE7FF] shadow-sm select-none transition-colors group-hover:bg-[#6740A4] pt-[0.5px]"
                                        >
                                          +{signal.tPs.length - 1}
                                        </span>
                                      ) : null}
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-52 rounded-2xl border border-[#C4A0FF]/30 bg-[#090516]/95 p-3.5 text-right text-white shadow-[0_18px_40px_rgba(8,3,22,0.75)] backdrop-blur-sm z-[99999]"
                                    align="center"
                                    side="bottom"
                                    dir="rtl"
                                  >
                                    <div className="flex flex-col gap-2.5">
                                      <p className="mb-0.5 border-b border-white/10 pb-1.5 text-xs font-semibold text-[#C9AEFF]">
                                        حد سودهای هدف
                                      </p>
                                      <div className="flex flex-col gap-1.5 text-xs">
                                        {signal.tPs.map((tpVal, tpIdx) => (
                                          <div
                                            key={tpIdx}
                                            className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5"
                                            dir="ltr"
                                          >
                                            <span className="text-[11px] font-semibold tracking-wide text-white/55">
                                              t{tpIdx + 1}
                                            </span>
                                            <span className="font-extrabold text-emerald-300">
                                              {tpVal.toString()}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {totalPages > 0 && (
            <div className="flex items-center justify-between gap-4 border-t border-[#e5e7eb] px-6 md:px-8 py-4 bg-[rgba(128,128,128,0.2)] dark:bg-transparent dark:border-white/10 w-full">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalCount}
                pageSizeOptions={[5, 10, 20, 50]}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
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
      </div>
    </div>
  );
}
