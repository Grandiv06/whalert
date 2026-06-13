"use client";

import {
  forwardRef,
  Fragment,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
import useDevice from "@/hooks/useDevice";
import { useQuery } from "@tanstack/react-query";
import { normalizePersianText } from "@/lib/utils";
import {
  UserDashboardService,
  ShowPositionsDto,
  MarketType,
  SignalSide,
  SignalProviderService,
  ProviderShowcaseService,
  type SignalProviderInfoDto,
  SignalOutcomeStatus,
  SignalOutcomeSource,
} from "@/lib/api/client";
import { SignalDetailDialog } from "@/components/signal/signal-detail-dialog";

type AbpWrapper<T> = { result?: T };
type SignalImageFields = {
  pictureUrl?: string | null;
  pictureId?: string | null;
  pictureBase64?: string | null;
};
type AbpWindow = Window & {
  abp?: {
    event?: {
      on: (eventName: string, handler: (payload: UserNotificationPayload) => void) => void;
      off: (eventName: string, handler: (payload: UserNotificationPayload) => void) => void;
    };
  };
};
type UserNotificationPayload = {
  notification?: {
    notificationName?: string;
    data?: { message?: string };
  };
};

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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((j) => (
            <TableCell key={j} className="text-center h-[72px] px-6 py-8">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function getOutcomeStatusMeta(
  outcomeStatus?: SignalOutcomeStatus,
  outcomeSource?: SignalOutcomeSource,
) {
  if (outcomeStatus === SignalOutcomeStatus._1) {
    return {
      label: `🎯 به TP رسید ${outcomeSource === 2 ? "(خودکار)" : "(دستی)"}`,
      className:
        "text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20",
    };
  }
  if (outcomeStatus === SignalOutcomeStatus._2) {
    return {
      label: `🛑 به SL رسید ${outcomeSource === 2 ? "(خودکار)" : "(دستی)"}`,
      className:
        "text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20",
    };
  }
  if (outcomeStatus === SignalOutcomeStatus._3) {
    return {
      label: "⚠️ لغو شده",
      className:
        "text-[10px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10",
    };
  }
  return {
    label: "در انتظار نتیجه",
    className:
      "text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20",
  };
}

function hasSignalImage(signal: SignalImageFields) {
  const signalWithBase64 = signal as SignalImageFields & {
    pictureBase64?: string | null;
  };
  return Boolean(
    signal.pictureUrl?.trim() ||
      signal.pictureId?.trim() ||
      signalWithBase64.pictureBase64?.trim(),
  );
}

type TakeProfitChipProps = ComponentPropsWithoutRef<"button"> & {
  value: string;
  count: number;
};

const TakeProfitChip = forwardRef<HTMLButtonElement, TakeProfitChipProps>(
  function TakeProfitChip({ value, count, className = "", ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={`group flex items-center gap-1.5 rounded-xl border border-[#9C73DE]/45 bg-[#3A2068]/55 px-2.5 py-1 text-[11px] font-bold text-[#EDE3FF] shadow-[0_6px_18px_rgba(40,18,74,0.35)] transition-all hover:scale-[1.02] hover:border-[#B996F2]/65 hover:bg-[#4A2A7E]/65 cursor-pointer ${className}`}
        {...props}
      >
        <span className="tracking-wide">{value}</span>
        {count > 1 ? (
          <span
            dir="ltr"
            className="inline-flex h-[16px] w-[16px] min-w-[16px] max-w-[16px] max-h-[16px] items-center justify-center rounded-full border border-[#CBAFFF]/55 bg-[#5A3493] font-mono text-[8px] font-extrabold leading-[1] text-center text-[#EFE7FF] shadow-sm select-none transition-colors group-hover:bg-[#6740A4] pt-[0.5px]"
          >
            +{count - 1}
          </span>
        ) : null}
      </button>
    );
  },
);

TakeProfitChip.displayName = "TakeProfitChip";

export function OpportunitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const device = useDevice();
  const isMobile = device === "mobile";
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const signalProviderIdParam = searchParams.get("signalProviderId");
  const parsedSignalProviderId = Number(signalProviderIdParam);
  const selectedProviderId =
    Number.isFinite(parsedSignalProviderId) && parsedSignalProviderId > 0
      ? parsedSignalProviderId
      : undefined;

  // States for outcome submission
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState<Record<number, boolean>>({});
  const [confirmSignal, setConfirmSignal] = useState<{
    tradingSignalId: number;
    outcomeStatus: SignalOutcomeStatus;
    symbol: string;
  } | null>(null);
  const [signalDetailModal, setSignalDetailModal] = useState<{
    tradingSignalId: number;
    title: string;
    description: string;
  } | null>(null);
  const [descriptionModal, setDescriptionModal] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Toast notification states
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; kind: "success" | "error"; createdAt: number; durationMs: number }>>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      setToasts((prev) =>
        prev.filter((t) => current - t.createdAt < t.durationMs)
      );
    }, 200);
    return () => window.clearInterval(timer);
  }, [toasts.length]);

  const pushToast = (message: string, kind: "success" | "error") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [
      ...prev,
      { id, message, kind, createdAt: Date.now(), durationMs: 4000 },
    ].slice(-3));
  };

  const { data: positionsData, isLoading, refetch } = useQuery({
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

  const { data: providerInfo } = useQuery({
    queryKey: ["signal-provider-info", selectedProviderId],
    queryFn: async () => {
      if (!selectedProviderId) return null;
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetallsignalproviderinfoPost(
          {
            skipCount: 0,
            maxResultCount: 1000,
            sorting: "name asc",
          },
        );
      const wrapped = res as AbpWrapper<{
        items?: SignalProviderInfoDto[];
      }>;
      return (
        wrapped?.result ??
        res
      ) as {
        items?: SignalProviderInfoDto[];
      };
    },
    enabled: Boolean(selectedProviderId),
    ...noCacheQueryOptions,
  });

  const providerDisplayName =
    normalizePersianText(
      providerInfo?.items?.find(
        (item) => item.signalProviderId === selectedProviderId,
      )?.name || "",
    ).trim() || "—";

  useEffect(() => {
    if (!selectedProviderId) {
      router.replace("/404");
      return;
    }

    if (!searchParams.has("providerName")) {
      return;
    }

    const query = new URLSearchParams({
      signalProviderId: String(selectedProviderId),
    });
    router.replace(`/dashboard/opportunities?${query.toString()}`);
  }, [router, searchParams, selectedProviderId]);

  const { data: monthlyPLResponse, isLoading: isMonthlyPLLoading } = useQuery({
    queryKey: ["monthlyProfitLossChart", selectedProviderId],
    queryFn: async () => {
      const providerId = selectedProviderId!;
      const res =
        await ProviderShowcaseService.apiServicesAppProvidershowcaseGetmonthlyprofitlosschartPost(
          {
            dayCount: 0,
            signalProviderId: providerId,
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
      const providerId = selectedProviderId!;
      const res =
        await ProviderShowcaseService.apiServicesAppProvidershowcaseGetperformancebyassetchartPost(
          {
            dayCount: 0,
            signalProviderId: providerId,
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
      const providerId = selectedProviderId!;
      const res =
          await ProviderShowcaseService.apiServicesAppProvidershowcaseGetrewardtoriskchartPost(
            {
              dayCount: 0,
              signalProviderId: providerId,
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

  const handleDeclareOutcome = async (tradingSignalId: number, outcomeStatus: SignalOutcomeStatus) => {
    if (!tradingSignalId) return;
    setIsSubmittingOutcome((prev) => ({ ...prev, [tradingSignalId]: true }));
    try {
      await SignalProviderService.apiServicesAppSignalproviderDeclaresignaloutcomePost({
        tradingSignalId,
        outcomeStatus,
      });
      pushToast("وضعیت سیگنال با موفقیت ثبت شد.", "success");
      refetch();
    } catch {
      pushToast("ثبت وضعیت سیگنال ناموفق بود. لطفاً دوباره تلاش کنید.", "error");
    } finally {
      setIsSubmittingOutcome((prev) => ({ ...prev, [tradingSignalId]: false }));
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const globalAbp = (window as AbpWindow).abp;
      if (globalAbp && globalAbp.event) {
        const abpEvent = globalAbp.event;
        const handleNotification = (userNotification: UserNotificationPayload) => {
          if (userNotification?.notification?.notificationName === "App.SignalOutcomeDeclared") {
            const message = userNotification.notification.data?.message || "یک وضعیت جدید برای سیگنال اعلام شد.";
            pushToast(message, "success");
            refetch();
          }
        };
        abpEvent.on("abp.notifications.received", handleNotification);
        return () => {
          abpEvent.off("abp.notifications.received", handleNotification);
        };
      }
    }
  }, [refetch]);

  const items = (positionsData?.items ?? []) as ShowPositionsDto[];
  const totalCount = positionsData?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 0;
  const startIndex = (currentPage - 1) * pageSize;

  const mapPosition = (position: ShowPositionsDto, index: number) => {
    const positionWithTakeProfits = position as ShowPositionsDto & {
      takeProfits?: number[] | null;
      pictureBase64?: string | null;
    };

    return {
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
      takeProfits: position.tPs?.length
        ? position.tPs
        : positionWithTakeProfits.takeProfits?.length
          ? positionWithTakeProfits.takeProfits
          : [],
      takeProfit: position.tPs?.length
        ? position.tPs[0].toString()
        : positionWithTakeProfits.takeProfits?.length
          ? positionWithTakeProfits.takeProfits[0].toString()
          : "-",
      tPs: position.tPs?.length
        ? position.tPs
        : positionWithTakeProfits.takeProfits?.length
          ? positionWithTakeProfits.takeProfits
          : [],
      description: position.description
        ? normalizePersianText(position.description)
        : null,
      tradingSignalId: position.tradingSignalId,
      outcomeStatus: position.outcomeStatus,
      outcomeSource: position.outcomeSource,
      outcomeDeclaredAt: position.outcomeDeclaredAt,
      canDeclareOutcome: position.canDeclareOutcome,
      pictureUrl: position.pictureUrl,
      pictureId: position.pictureId,
      pictureBase64:
        (position as SignalImageFields & { pictureBase64?: string | null }).pictureBase64,
    };
  };

  const openSignalDetail = (position: ShowPositionsDto) => {
    const tradingSignalId = position.tradingSignalId;
    if (!tradingSignalId) return;

    setSignalDetailModal({
      tradingSignalId,
      title: position.symbol || "توضیحات موقعیت",
      description: position.description
        ? normalizePersianText(position.description)
        : "",
    });
  };

  const openDescriptionModal = (position: ShowPositionsDto) => {
    setDescriptionModal({
      title: position.symbol || "توضیحات موقعیت",
      description: position.description
        ? normalizePersianText(position.description)
        : "",
    });
  };

  return (
    <div
      className="p-4 md:p-6 w-full max-w-full overflow-x-hidden space-y-8"
      dir="rtl"
    >
      {selectedProviderId && (
        <div className="relative overflow-hidden rounded-2xl border border-[#A87FF3]/25 bg-gradient-to-l from-[#241244]/85 via-[#1A1036]/80 to-[#0B0620]/85 px-4 py-4 md:px-6 md:py-5">
          <div className="pointer-events-none absolute -top-20 -left-16 h-44 w-44 rounded-full bg-[#7C4DCC]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 -right-10 h-36 w-36 rounded-full bg-[#3A7BFF]/20 blur-3xl" />

          <div className="relative flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
            <div className="text-right">
              <p className="text-xs md:text-sm text-[#CDB8F5]/85">جزئیات پروایدر</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
                {providerDisplayName}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard/analysis")}
              className="group absolute top-1/2 -translate-y-1/2 left-0 md:static md:mt-3 md:translate-y-0 inline-flex h-9 w-9 md:h-auto md:w-auto items-center justify-center md:justify-start gap-2 rounded-full md:rounded-xl border border-white/25 bg-white/[0.08] px-0 md:px-3.5 py-0 md:py-2 text-white/90 hover:text-white hover:bg-white/[0.14] hover:border-white/40 transition-colors cursor-pointer"
              aria-label="بازگشت به لیست تحلیل‌ها"
              title="بازگشت به لیست تحلیل‌ها"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full md:rounded-md text-white/95"
              >
                <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </span>
              <span className="hidden md:inline text-sm font-semibold">
                بازگشت به لیست تحلیل‌ها
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
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
                        <div className="flex justify-between items-center gap-4">
                          <p className="text-xs font-medium text-white/80 whitespace-nowrap shrink-0">
                            حدضرر : {pos.stopLoss}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-white/80 whitespace-nowrap flex-nowrap shrink-0">
                            <span>حدسود :</span>
                            {pos.tPs && pos.tPs.length > 1 ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <TakeProfitChip value={pos.takeProfit} count={pos.tPs.length} />
                                </PopoverTrigger>
                                <PopoverContent className="w-52 rounded-2xl border border-[#C4A0FF]/30 bg-[#090516]/95 p-3 text-right text-white shadow-[0_18px_40px_rgba(8,3,22,0.75)] backdrop-blur-sm z-[99999]" align="start" side="bottom" dir="rtl">
                                  <div className="flex flex-col gap-2.5">
                                    <p className="mb-0.5 border-b border-white/10 pb-1.5 text-xs font-semibold text-[#C9AEFF]">حد سودهای هدف</p>
                                    <div className="flex flex-col gap-1.5 text-xs">
                                      {pos.tPs.map((tpVal: string | number, tpIdx: number) => (
                                        <div key={tpIdx} className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5" dir="ltr">
                                          <span className="text-[11px] font-semibold tracking-wide text-white/55">t{tpIdx + 1}</span>
                                          <span className="font-extrabold text-emerald-300">{tpVal.toString()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <TakeProfitChip value={pos.takeProfit} count={pos.tPs.length || 1} />
                            )}
                          </div>
                        </div>
                        {pos.outcomeStatus !== undefined && pos.outcomeStatus !== 0 ? (
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-medium text-white/80">
                              وضعیت :
                            </p>
                            {pos.outcomeStatus === 1 ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                🎯 به TP رسید {pos.outcomeSource === 2 ? "(خودکار)" : "(دستی)"}
                              </span>
                            ) : pos.outcomeStatus === 2 ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                🛑 به SL رسید {pos.outcomeSource === 2 ? "(خودکار)" : "(دستی)"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                ⚠️ لغو شده
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-medium text-white/80">
                              وضعیت :
                            </p>
                            {pos.canDeclareOutcome && pos.tradingSignalId ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={isSubmittingOutcome[pos.tradingSignalId]}
                                  onClick={() => setConfirmSignal({ tradingSignalId: pos.tradingSignalId!, outcomeStatus: 1, symbol: pos.symbol })}
                                  className="text-[10px] text-green-400 hover:text-green-300 font-bold bg-green-500/10 hover:bg-green-500/20 px-2.5 py-1 rounded border border-green-500/30 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  ثبت TP
                                </button>
                                <button
                                  type="button"
                                  disabled={isSubmittingOutcome[pos.tradingSignalId]}
                                  onClick={() => setConfirmSignal({ tradingSignalId: pos.tradingSignalId!, outcomeStatus: 2, symbol: pos.symbol })}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  ثبت SL
                                </button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                <span className="h-1 w-1 rounded-full bg-purple-400 animate-pulse" />
                                در انتظار نتیجه
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex w-full">
                        <button
                          type="button"
                          onClick={() => openSignalDetail(item)}
                          className="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-[#A87FF3]/35 bg-[#542C85]/10 px-4 py-2.5 text-xs font-semibold text-[#DCCBFF] transition-colors hover:bg-[#542C85]/18"
                        >
                          مشاهده عکس
                        </button>
                      </div>
                      <div className="h-px bg-white/10 my-3" />
                      {pos.description ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleRow(pos.id)}
                            className="w-full flex items-center justify-between text-xs text-[#A87FF3] hover:text-[#c4a6fc] font-semibold bg-[#A87FF3]/10 hover:bg-[#A87FF3]/20 px-3 py-2 rounded-lg border border-[#A87FF3]/25 transition-all cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" />
                              توضیحات موقعیت
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                expandedRows[pos.id] ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {expandedRows[pos.id] && (
                            <div className="mt-2 bg-white/5 p-3 rounded-lg border border-white/5 text-right transition-all">
                              <p className="text-xs text-white/85 whitespace-pre-wrap leading-relaxed">
                                {pos.description}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs font-semibold text-white/35">
                          بدون توضیحات
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        ) : (
          <div className="overflow-hidden -mx-4 md:mx-0">
            <div className="overflow-x-auto px-4 md:px-0 [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-[20px]">
              <Table className="min-w-[1200px] md:min-w-0">
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
                      تصویر
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
                      وضعیت
                    </TableHead>
                    <TableHead className="text-center text-white h-12">
                      توضیحات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && <DesktopSkeleton />}
                  {!isLoading && items.length === 0 && (
                    <TableRow className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50">
                      <TableCell
                        className="text-center text-muted-foreground dark:text-white/70 h-[72px] px-6 py-8"
                        colSpan={12}
                      >
                        هیچ داده‌ای یافت نشد.
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading &&
                    items.map((item: ShowPositionsDto, index: number) => {
                      const pos = mapPosition(item, index);
                      return (
                        <Fragment key={pos.id}>
                          <TableRow
                            className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50 border-b border-white/5"
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
                              {hasSignalImage(pos) ? (
                                <button
                                  type="button"
                                  onClick={() => openSignalDetail(item)}
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
                              {pos.tPs && pos.tPs.length > 1 ? (
                                <div className="flex items-center justify-center w-full">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <TakeProfitChip value={pos.takeProfit} count={pos.tPs.length} />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-52 rounded-2xl border border-[#C4A0FF]/30 bg-[#090516]/95 p-3.5 text-right text-white shadow-[0_18px_40px_rgba(8,3,22,0.75)] backdrop-blur-sm z-[99999]" align="center" side="bottom" dir="rtl">
                                      <div className="flex flex-col gap-2.5">
                                        <p className="mb-0.5 border-b border-white/10 pb-1.5 text-xs font-semibold text-[#C9AEFF]">حد سودهای هدف</p>
                                        <div className="flex flex-col gap-1.5 text-xs">
                                          {pos.tPs.map((tpVal: string | number, tpIdx: number) => (
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
                                <div className="flex items-center justify-center w-full">
                                  <TakeProfitChip value={pos.takeProfit} count={pos.tPs.length || 1} />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {pos.outcomeStatus !== undefined && pos.outcomeStatus !== 0 ? (
                                <span className={getOutcomeStatusMeta(pos.outcomeStatus, pos.outcomeSource).className}>
                                  {getOutcomeStatusMeta(pos.outcomeStatus, pos.outcomeSource).label}
                                </span>
                              ) : pos.canDeclareOutcome && pos.tradingSignalId ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={isSubmittingOutcome[pos.tradingSignalId]}
                                    onClick={() => setConfirmSignal({ tradingSignalId: pos.tradingSignalId!, outcomeStatus: 1, symbol: pos.symbol })}
                                    className="text-[10px] text-green-400 hover:text-green-300 font-bold bg-green-500/10 hover:bg-green-500/20 px-2.5 py-1 rounded border border-green-500/30 transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    ثبت TP
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isSubmittingOutcome[pos.tradingSignalId]}
                                    onClick={() => setConfirmSignal({ tradingSignalId: pos.tradingSignalId!, outcomeStatus: 2, symbol: pos.symbol })}
                                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    ثبت SL
                                  </button>
                                </div>
                              ) : (
                                <span className={getOutcomeStatusMeta().className}>
                                  {getOutcomeStatusMeta().label}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center h-[72px] px-6 py-8">
                              {pos.description ? (
                                <button
                                  type="button"
                                  onClick={() => openDescriptionModal(item)}
                                  className="inline-flex items-center gap-1.5 text-xs text-[#A87FF3] hover:text-[#c4a6fc] font-semibold bg-[#A87FF3]/10 hover:bg-[#A87FF3]/20 px-2.5 py-1.5 rounded-lg border border-[#A87FF3]/25 transition-all cursor-pointer"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  <span>مشاهده</span>
                                </button>
                              ) : (
                                <span className="text-xs font-semibold text-white/35">
                                  بدون توضیحات
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        </Fragment>
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

      {isMounted && toasts.length > 0 &&
        createPortal(
          <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-[99999] flex w-auto sm:w-[min(92vw,360px)] flex-col gap-2" dir="rtl">
            {toasts.map((toast) => {
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
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    )}
                    <div className="min-w-0 flex-1 text-right">
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

      <AlertDialog open={confirmSignal !== null} onOpenChange={(open) => { if (!open) setConfirmSignal(null); }}>
        <AlertDialogContent className="bg-[#0b071e]/95 border border-white/10 text-white backdrop-blur-md rounded-2xl max-w-md p-6">
          <AlertDialogHeader className="text-right flex flex-col space-y-2">
            <AlertDialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-[#A87FF3] text-xl">⚠️</span>
              تایید نهایی ثبت وضعیت سیگنال
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 text-sm leading-relaxed mt-2" dir="rtl">
              آیا از ثبت وضعیت سیگنال <span className="font-bold text-white text-base underline underline-offset-4 decoration-[#A87FF3]/60">{confirmSignal?.symbol}</span> به عنوان{" "}
              <span className={`font-bold text-xs px-2 py-0.5 rounded ${confirmSignal?.outcomeStatus === 1 ? 'text-green-400 bg-green-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                {confirmSignal?.outcomeStatus === 1 ? '🎯 به TP رسید (سود)' : '🛑 به SL رسید (ضرر)'}
              </span>{" "}
              اطمینان دارید؟
              <br />
              <span className="text-rose-400 font-semibold block mt-3 text-xs bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                🚨 توجه: این عملیات قطعی و غیر قابل بازگشت است.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3 mt-6" dir="rtl">
            <AlertDialogCancel className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg px-4 py-2 text-sm transition-all cursor-pointer">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmSignal) {
                  handleDeclareOutcome(confirmSignal.tradingSignalId, confirmSignal.outcomeStatus);
                  setConfirmSignal(null);
                }
              }}
              className={`rounded-lg px-4 py-2 text-sm font-bold text-white transition-all cursor-pointer ${
                confirmSignal?.outcomeStatus === 1
                  ? "bg-green-500 hover:bg-green-600 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                  : "bg-rose-500 hover:bg-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              }`}
            >
              بله، ثبت شود
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={descriptionModal !== null} onOpenChange={(open) => { if (!open) setDescriptionModal(null); }}>
        <AlertDialogContent className="bg-[#0b071e]/95 border border-white/10 text-white backdrop-blur-md rounded-2xl max-w-lg p-6" dir="rtl">
          <AlertDialogHeader className="text-right flex flex-col space-y-2">
            <AlertDialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-[#A87FF3] text-xl">📝</span>
              توضیحات موقعیت {descriptionModal?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 text-sm leading-relaxed mt-2 whitespace-pre-wrap">
              {descriptionModal?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3 mt-6" dir="rtl">
            <AlertDialogCancel
              onClick={() => setDescriptionModal(null)}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg px-4 py-2 text-sm transition-all cursor-pointer"
            >
              بستن
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SignalDetailDialog
        open={signalDetailModal !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSignalDetailModal(null);
          }
        }}
        tradingSignalId={signalDetailModal?.tradingSignalId}
        title={signalDetailModal?.title}
        description={signalDetailModal?.description}
      />
    </div>
  );
}
