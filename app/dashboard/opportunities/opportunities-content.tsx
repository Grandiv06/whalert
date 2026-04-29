"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
} from "@/components/icons/dashboard-icons";
import useDevice from "@/hooks/useDevice";
import { useQuery } from "@tanstack/react-query";
import { normalizePersianText } from "@/lib/utils";
import {
  UserDashboardService,
  ShowPositionsDto,
  MarketType,
  SignalSide,
} from "@/lib/api/client";

type AbpWrapper<T> = { result?: T };

const commonChartConfig = {
  value: { label: "مقدار", color: "hsl(var(--primary))" },
};

const pieConfig = {
  BTC: { label: "BTC", color: "#8884d8" },
  ETH: { label: "ETH", color: "#82ca9d" },
  XRP: { label: "XRP", color: "#ffc658" },
  ADA: { label: "ADA", color: "#ff8042" },
  Others: { label: "Others", color: "#a4de6c" },
};

const noCacheQueryOptions = {
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: "always" as const,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

function ChartCard({
  title,
  subtitle,
  children,
  noBorder,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <Card
      className={
        noBorder
          ? "bg-[#02000B]/30 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col border-0"
          : "bg-[#02000B]/30 border-white/5 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col"
      }
    >
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-sm font-medium text-white/90 text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-white/50 text-center">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 min-h-[150px] flex items-center justify-center">
        {children}
      </CardContent>
    </Card>
  );
}

function MobileSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="w-full bg-[#02000B]/30 border-white/5"
          dir="rtl"
        >
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="h-4 w-16 bg-white/10" />
            </div>
            <div className="h-px bg-white/10" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
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

export function OpportunitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const device = useDevice();
  const isMobile = device === "mobile";
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const signalProviderIdParam = searchParams.get("signalProviderId");
  const providerNameParam = searchParams.get("providerName");
  const parsedSignalProviderId = Number(signalProviderIdParam);
  const selectedProviderId =
    Number.isFinite(parsedSignalProviderId) && parsedSignalProviderId > 0
      ? parsedSignalProviderId
      : undefined;
  const providerDisplayName =
    normalizePersianText(providerNameParam || "").trim() ||
    (selectedProviderId
      ? `کاربر ${selectedProviderId.toLocaleString("fa-IR")}`
      : "");

  const { data: positionsData, isLoading } = useQuery({
    queryKey: ["showPositions", currentPage, pageSize, selectedProviderId],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardShowpositionsPost(
          {
            skipCount: (currentPage - 1) * pageSize,
            maxResultCount: pageSize,
            sorting: "date desc",
            userId: selectedProviderId,
            signalProviderId: selectedProviderId,
          },
        );
      const wrapped = res as unknown as AbpWrapper<{
        items?: ShowPositionsDto[];
        totalCount?: number;
      }>;
      return wrapped?.result ?? res;
    },
    ...noCacheQueryOptions,
  });

  const { data: balanceChartData, isLoading: isBalanceLoading } = useQuery({
    queryKey: ["balanceChangeChart", selectedProviderId],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetbalancechangechartPost(
          {
            dayCount: 0,
            userId: selectedProviderId,
            signalProviderId: selectedProviderId,
          },
        );
      const wrapped = res as unknown as AbpWrapper<{
        items?: Array<{ date?: string; value?: number; label?: string }>;
      }>;
      return wrapped?.result ?? res;
    },
    ...noCacheQueryOptions,
  });

  const balanceData =
    (
      balanceChartData as {
        items?: Array<{ date?: string; value?: number; label?: string }>;
      }
    )?.items?.map((item) => ({
      date: item.date || "-",
      value: item.value || 0,
      label: item.label || "-",
    })) ?? [];

  const { data: monthlyPLResponse, isLoading: isMonthlyPLLoading } = useQuery({
    queryKey: ["monthlyProfitLossChart", selectedProviderId],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmonthlyprofitlosschartPost(
          {
            dayCount: 0,
            userId: selectedProviderId,
            signalProviderId: selectedProviderId,
          },
        );
      const wrapped = res as unknown as AbpWrapper<{
        items?: Array<{ month?: string; value?: number; year?: string }>;
      }>;
      return wrapped?.result ?? res;
    },
    ...noCacheQueryOptions,
  });

  const monthlyPLData =
    (
      monthlyPLResponse as {
        items?: Array<{ month?: string; value?: number; year?: string }>;
      }
    )?.items?.map((item) => ({
      month: item.month || "-",
      value: item.value || 0,
      fullLabel: `${item.month} ${item.year || ""}`,
    })) ?? [];

  const {
    data: assetPerformanceResponse,
    isLoading: isAssetPerformanceLoading,
  } = useQuery({
    queryKey: ["performanceByAssetChart", selectedProviderId],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetperformancebyassetchartPost(
          {
            dayCount: 0,
            userId: selectedProviderId,
            signalProviderId: selectedProviderId,
          },
        );
      const wrapped = res as unknown as AbpWrapper<{
        items?: Array<{ label?: string; value?: number; percentage?: number }>;
      }>;
      return wrapped?.result ?? res;
    },
    ...noCacheQueryOptions,
  });

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
    "#83a6ed",
    "#8dd1e1",
  ];
  const assetPerformanceData =
    (
      assetPerformanceResponse as {
        items?: Array<{ label?: string; value?: number; percentage?: number }>;
      }
    )?.items?.map((item, index) => ({
      name: item.label || "Unknown",
      value: item.value || 0,
      fill: colors[index % colors.length],
    })) ?? [];

  const { data: rewardRiskResponse, isLoading: isRewardRiskLoading } = useQuery(
    {
      queryKey: ["rewardToRiskChart", selectedProviderId],
      queryFn: async () => {
        const res =
          await UserDashboardService.apiServicesAppUserdashboardGetrewardtoriskchartPost(
            {
              dayCount: 0,
              userId: selectedProviderId,
              signalProviderId: selectedProviderId,
            },
          );
        const wrapped = res as unknown as AbpWrapper<{
          items?: Array<{
            rewardValue?: number;
            riskValue?: number;
            label?: string;
          }>;
        }>;
        return wrapped?.result ?? res;
      },
      ...noCacheQueryOptions,
    },
  );

  const rewardRiskData =
    (
      rewardRiskResponse as {
        items?: Array<{
          rewardValue?: number;
          riskValue?: number;
          label?: string;
        }>;
      }
    )?.items?.map((item, index) => ({
      id: index + 1,
      reward: item.rewardValue || 0,
      risk: item.riskValue || 0,
      label: item.label,
    })) ?? [];

  const items = (positionsData?.items ?? []) as ShowPositionsDto[];
  const totalCount = positionsData?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 0;
  const startIndex = (currentPage - 1) * pageSize;

  const mapPosition = (position: ShowPositionsDto, index: number) => ({
    id: index,
    row: startIndex + index + 1,
    time: position.date
      ? new Date(position.date)
          .toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(",", " - ")
      : "-",
    analysisModel: normalizePersianText(position.displayName || "-"),
    market: position.market === MarketType._1 ? "CRYPTO" : "FOREX",
    symbol: normalizePersianText(position.symbol || "-"),
    direction: position.side === SignalSide._1 ? "BUY" : "SELL",
    entry: position.entryPrice?.toString() || "-",
    stopLoss: position.sl?.toString() || "-",
    takeProfit:
      position.tPs && position.tPs.length > 0
        ? position.tPs[0].toString()
        : "-",
  });

  return (
    <div
      className="p-4 md:p-6 w-full max-w-full overflow-x-hidden space-y-8"
      dir="rtl"
    >
      {selectedProviderId && (
        <div className="relative overflow-hidden rounded-2xl border border-[#A87FF3]/25 bg-gradient-to-l from-[#241244]/85 via-[#1A1036]/80 to-[#0B0620]/85 px-4 py-4 md:px-6 md:py-5">
          <div className="pointer-events-none absolute -top-20 -left-16 h-44 w-44 rounded-full bg-[#7C4DCC]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 -right-10 h-36 w-36 rounded-full bg-[#3A7BFF]/20 blur-3xl" />

          <div className="relative flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs md:text-sm text-[#CDB8F5]/85">جزئیات پروایدر</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
                {providerDisplayName}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard/analysis")}
              className="inline-flex items-center gap-2 self-end md:self-auto rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 hover:border-white/25 transition-all cursor-pointer"
            >
              <span aria-hidden="true">→</span>
              بازگشت به لیست تحلیل‌ها
            </button>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <ChartCard
          title="نمودار تغییرات موجودی"
          subtitle="(۱۴۰۴/۱۰/۱۶ - ۱۴۰۴/۱۰/۱۷)"
        >
          {isBalanceLoading ? (
            <div className="h-[220px] w-full flex items-center justify-center">
              <Skeleton className="h-[180px] w-[90%] bg-white/10" />
            </div>
          ) : (
            <ChartContainer
              config={commonChartConfig}
              className="h-[220px] w-full"
            >
              <AreaChart data={balanceData}>
                <defs>
                  <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#542C85" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#542C85" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeOpacity={0.05} />
                <XAxis dataKey="label" hide />
                <YAxis domain={["auto", "auto"]} hide />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm p-2 shadow-xl text-xs">
                        <span className="font-bold text-muted-foreground">
                          {data.label}
                        </span>
                        <span className="font-mono font-medium block">
                          {data.value?.toLocaleString()} تومان
                        </span>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#542C85"
                  fill="url(#fillBalance)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </ChartCard>

        <ChartCard
          title="نمودار سود/ضرر ماهانه سیگنال‌ها"
          subtitle="(۱۴۰۴/۱۰/۱۶ - ۱۴۰۴/۱۰/۱۷)"
        >
          {isMonthlyPLLoading ? (
            <div className="h-[220px] w-full flex items-center justify-center">
              <Skeleton className="h-[180px] w-[90%] bg-white/10" />
            </div>
          ) : (
            <ChartContainer
              config={commonChartConfig}
              className="h-[220px] w-full"
            >
              <BarChart data={monthlyPLData}>
                <CartesianGrid vertical={false} strokeOpacity={0.05} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#888" }}
                  interval={0}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {monthlyPLData.map(
                    (entry: { value?: number }, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={(entry.value ?? 0) > 0 ? "#10b981" : "#ef4444"}
                      />
                    ),
                  )}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </ChartCard>

        <ChartCard
          title="عملکرد به تفکیک دارایی"
          subtitle="(۱۴۰۴/۱۰/۱۶ - ۱۴۰۴/۱۰/۱۷)"
          noBorder
        >
          {isAssetPerformanceLoading ? (
            <div className="h-[220px] w-full flex items-center justify-center">
              <Skeleton className="h-[180px] w-[90%] bg-white/10" />
            </div>
          ) : (
            <ChartContainer config={pieConfig} className="h-[220px] w-full">
              <PieChart>
                <Pie
                  data={assetPerformanceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  stroke="none"
                  strokeWidth={0}
                >
                  {assetPerformanceData.map(
                    (entry: { fill?: string }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ),
                  )}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ChartContainer>
          )}
        </ChartCard>

        <ChartCard title="پاداش به ریسک" subtitle="(۱۴۰۴/۱۰/۱۶ - ۱۴۰۴/۱۰/۱۷)">
          {isRewardRiskLoading ? (
            <div className="h-[220px] w-full flex items-center justify-center">
              <Skeleton className="h-[180px] w-[90%] bg-white/10" />
            </div>
          ) : (
            <ChartContainer
              config={commonChartConfig}
              className="h-[220px] w-full"
            >
              <BarChart data={rewardRiskData} layout="vertical">
                <CartesianGrid horizontal={false} strokeOpacity={0.05} />
                <XAxis type="number" hide />
                <YAxis dataKey="id" type="category" hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="risk"
                  fill="#3b82f6"
                  radius={[4, 0, 0, 4]}
                  stackId="a"
                />
                <Bar
                  dataKey="reward"
                  fill="#f59e0b"
                  radius={[0, 4, 4, 0]}
                  stackId="a"
                />
              </BarChart>
            </ChartContainer>
          )}
        </ChartCard>
      </div>

      {/* Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          {selectedProviderId && providerDisplayName
            ? `گزارش موقعیت‌های ${providerDisplayName}`
            : "گزارش موقعیت‌ها"}
        </h2>

        {isMobile ? (
          <div className="space-y-4">
            {isLoading && <MobileSkeleton />}
            {!isLoading && items.length === 0 && (
              <div className="text-center text-muted-foreground dark:text-white/70 py-8">
                هیچ داده‌ای یافت نشد.
              </div>
            )}
            {!isLoading &&
              items.map((item: ShowPositionsDto, index: number) => {
                const pos = mapPosition(item, index);
                return (
                  <Card
                    key={pos.id}
                    className="w-full bg-[#02000B]/30 border-white/5"
                    dir="rtl"
                  >
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <p className="text-xs md:text-sm font-medium text-white/90">
                          تاریخ : {pos.time.split(" - ")[0]}
                        </p>
                        <p className="text-xs md:text-sm font-medium text-white/60">
                          {pos.time.split(" - ")[1]}
                        </p>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-white/80">
                            بازار : {pos.market}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-white/80">
                            مدل تحلیل : {pos.analysisModel}
                          </p>
                          <p className="text-xs font-medium text-white/80">
                            نمادها : {pos.symbol}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-white/80">
                            جهت :
                            <span
                              className={`mr-1 font-bold ${
                                pos.direction === "BUY"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {pos.direction}
                            </span>
                          </p>
                          <p className="text-xs font-medium text-white/80">
                            ورود : {pos.entry}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-white/80">
                            حدضرر : {pos.stopLoss}
                          </p>
                          <p className="text-xs font-medium text-white/80">
                            حدسود : {pos.takeProfit}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        ) : (
          <div className="overflow-hidden -mx-4 md:mx-0">
            <div className="overflow-x-auto px-4 md:px-0 [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-[20px]">
              <Table className="min-w-[800px] md:min-w-0">
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
                    items.map((item: ShowPositionsDto, index: number) => {
                      const pos = mapPosition(item, index);
                      return (
                        <TableRow
                          key={pos.id}
                          className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50"
                        >
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {pos.row}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {pos.time}
                          </TableCell>
                          <TableCell className="text-center max-w-[150px] truncate h-[72px] px-6 py-8">
                            {pos.analysisModel}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {pos.market}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {pos.symbol}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            <span
                              className={
                                pos.direction === "BUY"
                                  ? "text-green-600 dark:text-green-400 font-semibold"
                                  : "text-red-600 dark:text-red-400 font-semibold"
                              }
                            >
                              {pos.direction}
                            </span>
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {pos.entry}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {pos.stopLoss}
                          </TableCell>
                          <TableCell className="text-center h-[72px] px-6 py-8">
                            {pos.takeProfit}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
      </div>
    </div>
  );
}
