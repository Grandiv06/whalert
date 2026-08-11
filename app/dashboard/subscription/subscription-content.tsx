"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarClock,
  Crown,
  CreditCard,
  CircleAlert,
  Radio,
  Coins,
  Hourglass,
} from "lucide-react";
import {
  SubscriptionPurchaseService,
  SubscriptionDashboardService,
  type GetSubscriptionPaymentHistoryOutput,
  type SubscriptionPaymentHistoryItemDto,
  type MySubscriptionQueueDto,
  type ReservedSubscriptionItemDto,
  type SubscriptionPlanCatalogItemDto,
  UserSubscriptionStatus,
} from "@/lib/api/client";
import { cn, toPersianDigits } from "@/lib/utils";
import { getSubscriptionCheckoutStatusMeta } from "@/lib/subscription-checkout-status";
import {
  isOnsCatalogPlan,
  isMazanehCatalogPlan,
} from "@/lib/subscription-plan-duration";
import { PlansModal } from "@/components/shared/plans-modal";

type AbpWrapper<T> = { result?: T };

type SubscriptionKind = "live" | "asset" | "other";

type DisplaySubscription = ReservedSubscriptionItemDto & {
  kind: SubscriptionKind;
  kindLabel: string;
  isQueued: boolean;
};

function unwrapAbp<T>(res: unknown): T {
  const w = res as AbpWrapper<T>;
  return (w?.result ?? res) as T;
}

function formatDate(date?: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function remainingDaysLabel(remainingDays?: number | null): string {
  if (typeof remainingDays !== "number" || !Number.isFinite(remainingDays))
    return "—";
  return `${toPersianDigits(Math.max(0, Math.floor(remainingDays)))} روز فعال`;
}

function formatRialAmount(amount?: number): string {
  if (amount === undefined || !Number.isFinite(amount)) return "—";
  return `${toPersianDigits(amount.toLocaleString("fa-IR"))} ریال`;
}

function isActiveStatus(status?: UserSubscriptionStatus | number | null) {
  return status === UserSubscriptionStatus._2 || status === 2;
}

function isQueuedStatus(status?: UserSubscriptionStatus | number | null) {
  return status === UserSubscriptionStatus._1 || status === 1;
}

function isLiveCatalogPlan(plan: SubscriptionPlanCatalogItemDto): boolean {
  if (plan.includesLiveSessions === true) return true;
  const name = (plan.name ?? "").toLowerCase();
  const displayName = plan.displayName ?? "";
  return name.includes("live") || displayName.includes("لایو");
}

function resolveSubscriptionKind(
  item: ReservedSubscriptionItemDto,
  catalogById: Map<number, SubscriptionPlanCatalogItemDto>,
): { kind: SubscriptionKind; kindLabel: string } {
  const catalog = item.subscriptionPlanId
    ? catalogById.get(item.subscriptionPlanId)
    : undefined;
  const planName = (
    item.planDisplayName ??
    item.planName ??
    catalog?.displayName ??
    catalog?.name ??
    ""
  ).toLowerCase();
  const displayName =
    item.planDisplayName ?? item.planName ?? catalog?.displayName ?? "";

  if (
    (catalog && isLiveCatalogPlan(catalog)) ||
    planName.includes("live") ||
    displayName.includes("لایو")
  ) {
    return { kind: "live", kindLabel: "لایو ترید" };
  }

  if (catalog && isOnsCatalogPlan(catalog)) {
    return { kind: "asset", kindLabel: "انس جهانی" };
  }

  if (catalog && isMazanehCatalogPlan(catalog)) {
    return { kind: "asset", kindLabel: "مظنه" };
  }

  if (
    displayName.includes("انس") ||
    displayName.includes("مظنه") ||
    displayName.includes("طلا") ||
    planName.includes("xau") ||
    planName.includes("mozaneh")
  ) {
    return { kind: "asset", kindLabel: "اشتراک ارز" };
  }

  return { kind: "other", kindLabel: "اشتراک" };
}

function KindIcon({ kind }: { kind: SubscriptionKind }) {
  if (kind === "live") return <Radio className="h-4 w-4" />;
  if (kind === "asset") return <Coins className="h-4 w-4" />;
  return <Crown className="h-4 w-4" />;
}

export function SubscriptionContent() {
  const searchParams = useSearchParams();
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(
    () => searchParams.get("openPlans") === "1",
  );
  const [isRenewalInfoOpen, setIsRenewalInfoOpen] = useState(false);

  const { data: subscriptionQueue, isLoading: queueLoading } = useQuery({
    queryKey: ["mySubscriptionQueue"],
    queryFn: async () => {
      const res =
        await SubscriptionDashboardService.apiServicesAppSubscriptiondashboardGetmysubscriptionqueueGet();
      return unwrapAbp<MySubscriptionQueueDto>(res);
    },
  });

  const { data: catalogPlansData, isLoading: catalogLoading } = useQuery({
    queryKey: ["landing-active-subscription-plans"],
    queryFn: async () => {
      const res =
        await SubscriptionDashboardService.apiServicesAppSubscriptiondashboardGetactivesubscriptionplansGet();
      const unwrapped = unwrapAbp<SubscriptionPlanCatalogItemDto[]>(res);
      return Array.isArray(unwrapped) ? unwrapped : [];
    },
  });

  // Shared cache may hold a raw ABP wrapper from other callers — always normalize.
  const catalogPlans = Array.isArray(catalogPlansData)
    ? catalogPlansData
    : Array.isArray(
          (catalogPlansData as AbpWrapper<SubscriptionPlanCatalogItemDto[]> | undefined)
            ?.result,
        )
      ? (catalogPlansData as AbpWrapper<SubscriptionPlanCatalogItemDto[]>).result!
      : [];

  const { data: paymentHistory, isLoading: paymentsLoading } = useQuery({
    queryKey: ["currentUserPaymentHistory"],
    queryFn: async () => {
      const res =
        await SubscriptionPurchaseService.apiServicesAppSubscriptionpurchaseGetcurrentuserpaymenthistoryGet();
      return unwrapAbp<GetSubscriptionPaymentHistoryOutput>(res);
    },
  });

  const catalogById = useMemo(() => {
    const map = new Map<number, SubscriptionPlanCatalogItemDto>();
    for (const plan of catalogPlans) {
      if (typeof plan.id === "number") map.set(plan.id, plan);
    }
    return map;
  }, [catalogPlans]);

  const displaySubscriptions = useMemo(() => {
    const items = subscriptionQueue?.items ?? [];
    const mapped: DisplaySubscription[] = items
      .filter(
        (item) => isActiveStatus(item.status) || isQueuedStatus(item.status),
      )
      .map((item) => {
        const { kind, kindLabel } = resolveSubscriptionKind(item, catalogById);
        const isQueued = isQueuedStatus(item.status) && !isActiveStatus(item.status);
        return {
          ...item,
          kind,
          kindLabel: isQueued ? "در صف فعال‌سازی" : kindLabel,
          isQueued,
        };
      })
      .sort((a, b) => {
        if (a.isQueued !== b.isQueued) return a.isQueued ? 1 : -1;
        if (a.kind === "live" && b.kind !== "live") return -1;
        if (b.kind === "live" && a.kind !== "live") return 1;
        return (b.remainingDays ?? 0) - (a.remainingDays ?? 0);
      });

    return mapped;
  }, [subscriptionQueue?.items, catalogById]);

  const activeSubscriptions = displaySubscriptions.filter(
    (item) => !item.isQueued,
  );
  const queuedSubscriptions = displaySubscriptions.filter(
    (item) => item.isQueued,
  );
  const hasAnySubscription = displaySubscriptions.length > 0;
  const detailsLoading = queueLoading || catalogLoading;

  const historyItems = (paymentHistory?.items ??
    []) as SubscriptionPaymentHistoryItemDto[];
  const visibleHistoryItems = historyItems.slice(0, 3);
  const hasMoreHistory = historyItems.length > 3;

  return (
    <div className="p-1 md:p-6 w-full max-w-full overflow-x-hidden" dir="rtl">
      <div className="space-y-6 md:space-y-8">
        <div className="rounded-4xl border border-white/5 bg-gradient-to-br from-[#542C85]/30 via-[#3a2066]/30 to-[#02000B]/40 p-5 md:p-7 shadow-lg shadow-[#542C85]/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                اشتراک من
              </h1>
              <p className="text-sm md:text-base text-white/70">
                همه اشتراک‌های فعال شما مثل لایو ترید و اشتراک ارز، تاریخ انقضا و
                سابقه پرداخت‌ها را اینجا می‌بینید.
              </p>
            </div>
            <Button
              onClick={() => setIsPlansModalOpen(true)}
              className="rounded-2xl bg-[#542C85] hover:bg-[#6b3ca8] text-white border-0 h-11 px-6 w-full md:w-auto cursor-pointer"
            >
              مشاهده ی اشتراک ها
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <Card className="xl:col-span-2 bg-[#02000B]/30 border-white/5 rounded-4xl">
            <CardContent className="p-5 md:p-6 space-y-5">
              <div className="flex items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#B57CFF]" />
                  <h2 className="font-bold text-lg">اشتراک‌های فعال</h2>
                </div>
                {detailsLoading ? null : hasAnySubscription ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsRenewalInfoOpen(true)}
                    className="h-9 w-9 rounded-full border border-[#B57CFF]/35 bg-[#B57CFF]/10 text-[#E9D8FF] hover:bg-[#B57CFF]/20 hover:text-white shrink-0"
                    aria-label="اطلاعات فعال‌سازی اشتراک جدید"
                  >
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>

              {detailsLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-36 bg-white/10 rounded-3xl" />
                  ))}
                </div>
              ) : !hasAnySubscription ? (
                <div className="rounded-3xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center">
                  <p className="text-white font-semibold">
                    اشتراک فعالی ندارید.
                  </p>
                  <p className="text-sm text-white/65 mt-2">
                    برای خرید اشتراک لایو ترید یا اشتراک ارز، به بخش پلن‌ها
                    مراجعه کنید.
                  </p>
                  <Button
                    onClick={() => setIsPlansModalOpen(true)}
                    className="mt-4 rounded-2xl bg-[#542C85] hover:bg-[#6b3ca8] text-white border-0 cursor-pointer"
                  >
                    مشاهده ی اشتراک ها
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSubscriptions.map((item, index) => (
                    <SubscriptionCard
                      key={item.subscriptionId ?? `active-${index}`}
                      item={item}
                    />
                  ))}

                  {queuedSubscriptions.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <Hourglass className="h-4 w-4 text-amber-300" />
                        <p className="text-sm font-medium">
                          اشتراک‌های در صف فعال‌سازی
                        </p>
                      </div>
                      {queuedSubscriptions.map((item, index) => (
                        <SubscriptionCard
                          key={item.subscriptionId ?? `queued-${index}`}
                          item={item}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#02000B]/30 border-white/5 rounded-4xl">
            <CardContent className="p-5 md:p-6 space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-l from-[#542C85]/15 to-white/[0.02] px-4 py-3">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#B57CFF]/70 to-transparent" />
                <div className="flex items-center justify-between text-white">
                  <h2 className="font-bold text-lg">خلاصه پرداخت‌ها</h2>
                  <div className="w-9 h-9 rounded-xl border border-[#B57CFF]/35 bg-[#B57CFF]/15 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#B57CFF]" />
                  </div>
                </div>
              </div>

              {paymentsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 bg-white/10" />
                  ))}
                </div>
              ) : historyItems.length > 0 ? (
                <div className="space-y-3">
                  {visibleHistoryItems.map((item, index) => {
                    const statusMeta = getSubscriptionCheckoutStatusMeta(
                      item.status,
                    );
                    return (
                      <div
                        key={item.id ?? `payment-${index}`}
                        className="rounded-3xl border border-white/10 bg-gradient-to-l from-white/[0.05] to-[#7A46BA]/[0.06] p-3.5 transition-all duration-300 hover:border-[#B57CFF]/30 hover:bg-gradient-to-l hover:from-white/[0.08] hover:to-[#7A46BA]/[0.12]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-white font-semibold">
                            {formatRialAmount(item.price)}
                          </span>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusMeta.className}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                        <p className="text-xs text-white/65 mt-1.5">
                          {formatDate(item.date)}
                        </p>
                      </div>
                    );
                  })}
                  {hasMoreHistory && (
                    <button
                      type="button"
                      onClick={() => setShowAllPayments(true)}
                      className="w-full h-11 rounded-2xl border border-white/15 bg-gradient-to-l from-white/[0.08] to-[#542C85]/20 text-sm font-semibold text-white/90 hover:from-white/[0.12] hover:to-[#542C85]/35 transition-all duration-300 cursor-pointer"
                    >
                      {`مشاهده همه (${toPersianDigits(historyItems.length)})`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/20 p-4 text-center text-sm text-white/60">
                  هنوز سابقه پرداختی ثبت نشده است.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showAllPayments} onOpenChange={setShowAllPayments}>
        <DialogContent
          className="sm:max-w-2xl max-h-[80vh] overflow-hidden bg-[#120A24] border-white/15 text-white"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              همه پرداخت‌ها
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 max-h-[60vh] space-y-3 overflow-y-auto pr-1 scrollbar-subscription">
            {historyItems.map((item, index) => {
              const statusMeta = getSubscriptionCheckoutStatusMeta(item.status);
              return (
                <div
                  key={item.id ?? `payment-all-${index}`}
                  className="rounded-2xl border border-white/10 bg-gradient-to-l from-white/[0.05] to-[#7A46BA]/[0.06] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-white font-semibold">
                      {formatRialAmount(item.price)}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusMeta.className}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/65 mt-1.5">
                    {formatDate(item.date)}
                  </p>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <PlansModal
        open={isPlansModalOpen}
        onOpenChange={setIsPlansModalOpen}
        description="پلن مناسب خود را انتخاب کنید و اشتراک خود را فعال کنید."
      />

      <Dialog open={isRenewalInfoOpen} onOpenChange={setIsRenewalInfoOpen}>
        <DialogContent className="max-w-md border border-white/15 bg-[#120A24] text-white shadow-[0_24px_90px_rgba(93,49,160,0.45)]">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">
              فعال‌سازی اشتراک جدید
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-3xl border border-[#B57CFF]/25 bg-[#B57CFF]/10 p-4 text-sm leading-7 text-white/80">
            اگر برای یک نوع اشتراک (مثلاً لایو ترید یا یک ارز) اشتراک جدیدی
            بخرید و اشتراک فعلی همان نوع هنوز تمام نشده باشد، اشتراک جدید بعد از
            پایان اشتراک فعلی فعال می‌شود.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SubscriptionCard({ item }: { item: DisplaySubscription }) {
  const planName =
    item.planDisplayName ?? item.planName ?? "پلن مشخص نشده";

  return (
    <div
      className={cn(
        "rounded-3xl border p-4 md:p-5 transition-colors",
        item.isQueued
          ? "border-amber-400/20 bg-amber-500/[0.06]"
          : item.kind === "live"
            ? "border-purple-400/25 bg-gradient-to-l from-[#7A46BA]/[0.12] to-white/[0.03]"
            : "border-white/10 bg-white/[0.04]",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="space-y-1.5 min-w-0">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
              item.isQueued
                ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
                : item.kind === "live"
                  ? "border-purple-400/35 bg-purple-500/15 text-purple-200"
                  : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
            )}
          >
            {item.isQueued ? (
              <Hourglass className="h-3.5 w-3.5" />
            ) : (
              <KindIcon kind={item.kind} />
            )}
            {item.kindLabel}
          </span>
          <h3 className="text-base md:text-lg font-bold text-white break-words leading-8">
            {planName}
          </h3>
        </div>
        {!item.isQueued ? (
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
            فعال
          </span>
        ) : typeof item.queuePosition === "number" && item.queuePosition > 0 ? (
          <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-200">
            {`نوبت ${toPersianDigits(item.queuePosition)}`}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-white/55 mb-1.5">تاریخ فعال‌سازی</p>
          <p className="text-sm text-white font-semibold">
            {formatDate(item.startDateUtc)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-white/55 mb-1.5">پایان اشتراک</p>
          <p className="text-sm text-white font-semibold">
            {formatDate(item.endDateUtc)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-white/55 mb-1.5">مانده</p>
          <p className="text-sm text-white font-semibold flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5 text-white/50 shrink-0" />
            {item.isQueued
              ? "پس از پایان اشتراک فعلی"
              : remainingDaysLabel(item.remainingDays)}
          </p>
        </div>
      </div>
    </div>
  );
}
