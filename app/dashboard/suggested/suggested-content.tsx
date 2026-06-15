"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PositionCard } from "@/components/charts/position-card";
import { SearchIcon, ExclamationCircleIcon } from "@/components/icons/dashboard-icons";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useDevice from "@/hooks/useDevice";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { resolveSignalImage } from "@/lib/signal-image";
import { normalizePersianText } from "@/lib/utils";
import {
  UserDashboardService,
  MarketType as ApiMarketType,
  SignalSide,
  type UserSubscriptionPlanDetailsDto,
} from "@/lib/api/client";
import type { OfferedPositionsDto } from "@/lib/api/client";
import type { ProviderSignalDetailDto } from "@/lib/api/client";
import type { PagedResultDtoOfOfferedPositionsDto } from "@/lib/api/client";

type AbpWrapper<T> = { result?: T };
type AnalysisStatus = "all" | "followed" | "not-followed";
type OfferedPositionWithSignalId = OfferedPositionsDto & { tradingSignalId?: number };
type OfferedPositionImageFields = OfferedPositionsDto & {
  pictureBase64?: string | null;
};

interface PositionData {
  id: number;
  row: number;
  time: string;
  timeDetail: string;
  analysisModel: string;
  market: string;
  symbol: string;
  direction: "BUY" | "SELL";
  entry: string;
  stopLoss: string;
  takeProfit: string;
  tPs: Array<string | number>;
  hasImage: boolean;
}

function hasPositionImage(position: OfferedPositionImageFields) {
  return Boolean(
    position.pictureUrl?.trim() ||
      position.pictureId?.trim() ||
      position.pictureBase64?.trim(),
  );
}

const MobileSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="w-full bg-[#02000B]/30 border-white/5" dir="rtl">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-4 w-32 bg-white/10" />
            <Skeleton className="h-4 w-16 bg-white/10" />
          </div>
          <div className="h-px bg-white/10" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
          </div>
          <div className="pt-2 flex gap-3">
            <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
            <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const DesktopSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow
        key={i}
        className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50"
      >
        {[...Array(10)].map((_, j) => (
          <TableCell key={j} className="text-center h-[72px] px-6 py-8">
            <Skeleton className="h-4 w-12 mx-auto" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export function SuggestedContent() {
  const device = useDevice();
  const isMobile = device === "mobile";
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [chartPreviewOpen, setChartPreviewOpen] = useState(false);
  const [chartPreviewLoading, setChartPreviewLoading] = useState(false);
  const [chartPreviewError, setChartPreviewError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<OfferedPositionsDto | null>(null);
  const [selectedSignalDetail, setSelectedSignalDetail] = useState<ProviderSignalDetailDto | null>(null);

  const handleShowChart = async (position: OfferedPositionsDto) => {
    const signalId = (position as OfferedPositionWithSignalId).tradingSignalId;
    setSelectedPosition(position);
    setSelectedSignalDetail(null);
    setChartPreviewError(null);

    if (!signalId) {
      setChartPreviewError("شناسه سیگنال برای این موقعیت در دسترس نیست.");
      setChartPreviewOpen(true);
      return;
    }

    setChartPreviewOpen(true);
    setChartPreviewLoading(true);
    try {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGettradingsignaldetailGet(
          signalId,
        );
      const wrapped = res as unknown as AbpWrapper<ProviderSignalDetailDto>;
      setSelectedSignalDetail(wrapped?.result ?? (res as ProviderSignalDetailDto));
    } catch {
      setChartPreviewError("بارگذاری تصویر با خطا مواجه شد.");
    } finally {
      setChartPreviewLoading(false);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      "offeredPositions",
      currentPage,
      pageSize,
      debouncedSearch,
      analysisStatus,
    ],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardOfferedpositionsPost(
          {
            skipCount: (currentPage - 1) * pageSize,
            maxResultCount: pageSize,
            sorting: "date desc",
            searchFilter: debouncedSearch || undefined,
            followed:
              analysisStatus === "followed"
                ? true
                : analysisStatus === "not-followed"
                  ? false
                  : undefined,
          },
        );
      const wrapped =
        res as unknown as AbpWrapper<PagedResultDtoOfOfferedPositionsDto>;
      return wrapped?.result ?? res;
    },
  });

  const { data: subscriptionDetails } = useQuery({
    queryKey: ["suggested-my-subscription"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
      const wrapped = res as AbpWrapper<UserSubscriptionPlanDetailsDto>;
      return wrapped?.result ?? res;
    },
  });

  const hasActiveSubscription =
    !!subscriptionDetails?.hasSubscription &&
    !!subscriptionDetails?.endDateUtc &&
    new Date(subscriptionDetails.endDateUtc).getTime() > Date.now();
  const emptyStateMessage = hasActiveSubscription
    ? "هیچ داده‌ای یافت نشد."
    : "برای مشاهده موقعیت‌های کاربران دنبال شده نیاز به اشتراک فعال دارید";

  const totalItems = (data as { totalCount?: number })?.totalCount ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 0;
  const paginatedData = (data?.items ?? []) as OfferedPositionsDto[];
  const startIndex = (currentPage - 1) * pageSize;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const mapPosition = (
    position: OfferedPositionsDto,
    index: number,
  ): PositionData => {
    const dateObj = position.date ? new Date(position.date) : null;
    const date = dateObj
      ? dateObj.toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";
    const time = dateObj
      ? dateObj.toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "-";

    return {
      id: index,
      row: startIndex + index + 1,
      time: date,
      timeDetail: time,
      analysisModel: normalizePersianText(position.displayName || "-"),
      market: position.market === ApiMarketType._1 ? "CRYPTO" : "FOREX",
      symbol: normalizePersianText(
        position.symbols ? position.symbols.join(", ") : "-",
      ),
      direction: position.side === SignalSide._1 ? "BUY" : "SELL",
      entry: position.entryPrice?.toString() || "-",
      stopLoss: position.sl?.toString() || "-",
      takeProfit:
        position.tPs && position.tPs.length > 0
          ? position.tPs[0].toString()
          : "-",
      tPs: (position.tPs ?? []) as Array<string | number>,
      hasImage: hasPositionImage(position as OfferedPositionImageFields),
    };
  };

  return (
    <div className="mt-5" dir="rtl">
      <div className="mb-6">
        <div className="w-full relative">
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

      <div className="mb-6 flex flex-col justify-between md:flex-row gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-white">وضعیت تحلیل</h3>
          <div className="grid grid-cols-3 md:flex items-center gap-2">
            <button
              onClick={() => setAnalysisStatus("all")}
              className={`w-full md:w-[140px] px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-white transition-opacity whitespace-nowrap cursor-pointer ${
                analysisStatus === "all"
                  ? "bg-[#542C85]"
                  : "bg-[#542C85]/30 hover:opacity-90"
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setAnalysisStatus("followed")}
              className={`w-full md:w-[140px] px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-white transition-opacity whitespace-nowrap cursor-pointer ${
                analysisStatus === "followed"
                  ? "bg-[#542C85]"
                  : "bg-[#542C85]/30 hover:opacity-90"
              }`}
            >
              دنبال شده
            </button>
            <button
              onClick={() => setAnalysisStatus("not-followed")}
              className={`w-full md:w-[140px] px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-white transition-opacity whitespace-nowrap cursor-pointer ${
                analysisStatus === "not-followed"
                  ? "bg-[#542C85]"
                  : "bg-[#542C85]/30 hover:opacity-90"
              }`}
            >
              دنبال نشده
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-4">موقعیت ها</h2>
        {isMobile ? (
          <div className="space-y-4">
            {isLoading ? (
              <MobileSkeleton />
            ) : paginatedData.length === 0 ? (
              <div className="text-center text-white/70 py-8 space-y-4">
                <p>{emptyStateMessage}</p>
                {!hasActiveSubscription && (
                  <Button asChild size="sm" className="bg-[#6D3CAC] hover:bg-[#7A4BB9] text-white">
                    <a href="/dashboard/subscription?openPlans=1">مشاهده ی اشتراک ها</a>
                  </Button>
                )}
              </div>
            ) : (
              paginatedData.map((item: OfferedPositionsDto, index: number) => {
                const position = mapPosition(item, index);
                return (
                  <PositionCard
                    key={index}
                    {...position}
                    tPs={position.tPs}
                    hasChartImage={position.hasImage}
                    onShowChart={() => void handleShowChart(item)}
                  />
                );
              })
            )}
          </div>
        ) : (
          <div className="overflow-hidden -mx-4 md:mx-0">
            <div className="overflow-x-auto px-4 md:px-0 [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-[20px]">
              <Table className="min-w-[1000px]">
                <TableHeader className="h-14">
                  <TableRow>
                    <TableHead className="text-center text-white h-12">
                      ردیف
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
                    <TableHead className="text-center text-white h-12">
                      نمایش در نمودار
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <DesktopSkeleton />
                  ) : paginatedData.length === 0 ? (
                    <TableRow className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50">
                      <TableCell
                        className="text-center text-muted-foreground dark:text-white/70 h-[72px] px-6 py-8"
                        colSpan={10}
                      >
                        <div className="space-y-4">
                          <p>{emptyStateMessage}</p>
                          {!hasActiveSubscription && (
                            <Button
                              asChild
                              size="sm"
                              className="bg-[#6D3CAC] hover:bg-[#7A4BB9] text-white"
                            >
                              <a href="/dashboard/subscription?openPlans=1">
                                مشاهده ی اشتراک ها
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map(
                      (item: OfferedPositionsDto, index: number) => {
                        const position = mapPosition(item, index);
                        return (
                          <TableRow
                            key={index}
                            className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50"
                          >
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {position.row}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              <div className="flex flex-col">
                                <span>{position.time}</span>
                                <span className="text-xs text-white/70">
                                  {position.timeDetail}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center max-w-[150px] truncate h-[72px] px-6 py-8">
                              {position.analysisModel}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {position.market}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {position.symbol}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              <span
                                className={
                                  position.direction === "BUY"
                                    ? "text-green-600 dark:text-green-400 font-semibold"
                                    : "text-red-600 dark:text-red-400 font-semibold"
                                }
                              >
                                {position.direction}
                              </span>
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {position.entry}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {position.stopLoss}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {position.tPs && position.tPs.length > 1 ? (
                                <div className="flex items-center justify-center w-full">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
                                        className="group flex items-center gap-1.5 rounded-xl border border-[#9C73DE]/45 bg-[#3A2068]/55 px-3 py-1.5 text-xs font-bold text-[#EDE3FF] shadow-[0_6px_18px_rgba(40,18,74,0.35)] transition-all hover:scale-[1.02] hover:border-[#B996F2]/65 hover:bg-[#4A2A7E]/65 cursor-pointer"
                                      >
                                        <span className="tracking-wide">{position.takeProfit}</span>
                                        <span
                                          dir="ltr"
                                          className="inline-flex h-[16px] w-[16px] min-w-[16px] max-w-[16px] max-h-[16px] items-center justify-center rounded-full border border-[#CBAFFF]/55 bg-[#5A3493] font-mono text-[8px] font-extrabold leading-[1] text-center text-[#EFE7FF] shadow-sm select-none transition-colors group-hover:bg-[#6740A4] pt-[0.5px]"
                                        >
                                          +{position.tPs.length - 1}
                                        </span>
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-52 rounded-2xl border border-[#C4A0FF]/30 bg-[#090516]/95 p-3.5 text-right text-white shadow-[0_18px_40px_rgba(8,3,22,0.75)] backdrop-blur-sm z-[99999]" align="center" side="bottom" dir="rtl">
                                      <div className="flex flex-col gap-2.5">
                                        <p className="mb-0.5 border-b border-white/10 pb-1.5 text-xs font-semibold text-[#C9AEFF]">حد سودهای هدف</p>
                                        <div className="flex flex-col gap-1.5 text-xs">
                                          {position.tPs.map((tpVal: string | number, tpIdx: number) => (
                                            <div key={tpIdx} className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5" dir="ltr">
                                              <span className="text-[11px] font-semibold tracking-wide text-white/55">t{tpIdx + 1}</span>
                                              <span className="font-extrabold text-emerald-300">{tpVal.toString()}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 justify-center w-full">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="cursor-pointer hover:opacity-80 transition-colors">
                                        <ExclamationCircleIcon className="text-white/70 hover:text-white" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{position.takeProfit}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  {position.takeProfit}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {position.hasImage ? (
                                <button
                                  type="button"
                                  onClick={() => void handleShowChart(item)}
                                  className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#A87FF3]/35 bg-[#542C85]/10 px-3 py-2 text-xs font-semibold text-[#DCCBFF] transition-colors hover:bg-[#542C85]/18"
                                  title="مشاهده تصویر"
                                >
                                  مشاهده
                                </button>
                              ) : (
                                <span className="text-xs font-semibold text-white/35">
                                  بدون تصویر
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        {totalPages > 0 && (
          <div className="flex items-center justify-between gap-4 border-t border-[#e5e7eb] px-6 md:px-8 py-4 bg-[rgba(128,128,128,0.2)] dark:bg-transparent dark:border-white/10 w-full">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20, 50]}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
      <Dialog open={chartPreviewOpen} onOpenChange={setChartPreviewOpen}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-3xl overflow-hidden border border-white/10 bg-[#0b071e]/96 p-0 text-white shadow-[0_30px_80px_-24px_rgba(93,49,160,0.45)]" dir="rtl">
          <div className="p-5">
            <DialogHeader className="mb-4 text-right">
              <DialogTitle className="text-base font-bold text-[#EBDDFF]">
                پیش‌نمایش تصویر
              </DialogTitle>
              <DialogDescription className="text-sm text-white/80 leading-7">
                {selectedSignalDetail?.symbol ||
                  selectedPosition?.displayName ||
                  "موقعیت انتخاب‌شده"}
              </DialogDescription>
            </DialogHeader>

            {chartPreviewLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                در حال بارگذاری تصویر...
              </div>
            ) : chartPreviewError ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-sm text-rose-200">
                {chartPreviewError}
              </div>
            ) : resolveSignalImage(selectedSignalDetail ?? {}) ? (
              <div className="relative h-[72vh] w-full overflow-hidden rounded-2xl bg-black/30">
                <Image
                  src={resolveSignalImage(selectedSignalDetail ?? {}) ?? ""}
                  alt="Position chart"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                برای این مورد تصویر در دسترس نیست.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
