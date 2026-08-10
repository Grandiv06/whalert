"use client";

import { useState } from "react";
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
import { CalendarClock, Crown, CreditCard, CircleAlert } from "lucide-react";
import {
  SubscriptionPurchaseService,
  type GetSubscriptionPaymentHistoryOutput,
  type SubscriptionPaymentHistoryItemDto,
  UserDashboardService,
  type UserSubscriptionPlanDetailsDto,
} from "@/lib/api/client";
import { toPersianDigits } from "@/lib/utils";
import { getSubscriptionCheckoutStatusMeta } from "@/lib/subscription-checkout-status";
import { PlansModal } from "@/components/shared/plans-modal";

type AbpWrapper<T> = { result?: T };

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

export function SubscriptionContent() {
  const searchParams = useSearchParams();
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(
    () => searchParams.get("openPlans") === "1",
  );
  const [isRenewalInfoOpen, setIsRenewalInfoOpen] = useState(false);

  const { data: subscriptionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["mySubscriptionPlanDetails"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
      return unwrapAbp<UserSubscriptionPlanDetailsDto>(res);
    },
  });

  const { data: paymentHistory, isLoading: paymentsLoading } = useQuery({
    queryKey: ["currentUserPaymentHistory"],
    queryFn: async () => {
      const res =
        await SubscriptionPurchaseService.apiServicesAppSubscriptionpurchaseGetcurrentuserpaymenthistoryGet();
      return unwrapAbp<GetSubscriptionPaymentHistoryOutput>(res);
    },
  });

  const currentEditionName =
    subscriptionDetails?.planDisplayName ??
    subscriptionDetails?.planName ??
    "پلن مشخص نشده";
  const activationDate = formatDate(subscriptionDetails?.startDateUtc);
  const endDate = formatDate(subscriptionDetails?.endDateUtc);
  const activeDaysText = remainingDaysLabel(subscriptionDetails?.remainingDays);
  const hasActiveSubscription =
    !!subscriptionDetails?.hasSubscription &&
    (subscriptionDetails?.remainingDays ?? 0) > 0;
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
                وضعیت پلن فعلی، تاریخ انقضا و سابقه پرداخت‌ها را اینجا می‌بینید.
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
                  <h2 className="font-bold text-lg">وضعیت اشتراک فعلی</h2>
                </div>
                {detailsLoading ? null : hasActiveSubscription ? (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 bg-white/10" />
                  ))}
                </div>
              ) : !hasActiveSubscription ? (
                <div className="rounded-3xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center">
                  <p className="text-white font-semibold">
                    اشتراک فعالی ندارید.
                  </p>
                  <p className="text-sm text-white/65 mt-2">
                    برای خرید اشتراک، به بخش پلن‌ها مراجعه کنید.
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-3xl border border-white/5 bg-white/[0.04] p-4">
                      <p className="text-xs text-white/60 mb-2">پلن فعال</p>
                      <p className="text-lg text-white font-bold break-words leading-8">
                        {currentEditionName}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-white/[0.04] p-4">
                      <p className="text-xs text-white/60 mb-2">
                        تاریخ فعال‌سازی
                      </p>
                      <p className="text-lg text-white font-bold">
                        {activationDate}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-white/[0.04] p-4">
                      <p className="text-xs text-white/60 mb-2">پایان اشتراک</p>
                      <p className="text-lg text-white font-bold">{endDate}</p>
                      <div className="mt-3 text-xs text-white/60 flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" />
                        {activeDaysText}
                      </div>
                    </div>
                  </div>
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
            اگر اشتراک جدیدی بخرید و اشتراک فعلی هنوز تمام نشده باشد، اشتراک
            جدید بعد از پایان اشتراک فعلی فعال می‌شود.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
