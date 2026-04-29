"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
} from "lucide-react";
import {
  SubscriptionPurchaseService,
  type GetSubscriptionPaymentHistoryOutput,
  type SubscriptionPaymentHistoryItemDto,
  UserDashboardService,
  type UserSubscriptionPlanDetailsDto,
} from "@/lib/api/client";
import { toPersianDigits } from "@/lib/utils";

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
  if (typeof remainingDays !== "number" || !Number.isFinite(remainingDays)) return "—";
  return `${toPersianDigits(Math.max(0, Math.floor(remainingDays)))} روز فعال`;
}

function paymentStatusText(status?: string | number | null): string {
  if (status === 2 || status === 3) return "پرداخت موفق";
  if (status === 1) return "در انتظار";
  if (status === 4) return "لغو شده";
  if (status === 5) return "ناموفق";

  const s = String(status ?? "").toLowerCase();
  if (s.includes("complete") || s.includes("success") || s.includes("paid")) {
    return "پرداخت موفق";
  }
  if (s.includes("pending") || s.includes("wait")) return "در انتظار";
  if (s.includes("cancel")) return "لغو شده";
  if (s.includes("fail") || s.includes("error")) return "ناموفق";
  return "نامشخص";
}

function pickStatusColor(status?: string | number | null): string {
  if (status === 2 || status === 3) {
    return "text-emerald-300 bg-emerald-500/15 border-emerald-400/30";
  }
  if (status === 1) {
    return "text-amber-300 bg-amber-500/15 border-amber-400/30";
  }
  if (status === 4 || status === 5) {
    return "text-rose-300 bg-rose-500/15 border-rose-400/30";
  }

  const s = String(status ?? "").toLowerCase();
  if (s.includes("complete") || s.includes("success") || s.includes("paid")) {
    return "text-emerald-300 bg-emerald-500/15 border-emerald-400/30";
  }
  if (s.includes("pending") || s.includes("wait")) {
    return "text-amber-300 bg-amber-500/15 border-amber-400/30";
  }
  if (s.includes("cancel") || s.includes("fail") || s.includes("error")) {
    return "text-rose-300 bg-rose-500/15 border-rose-400/30";
  }
  return "text-white/70 bg-white/10 border-white/20";
}

export function SubscriptionContent() {
  const [showAllPayments, setShowAllPayments] = useState(false);

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
  const historyItems = (paymentHistory?.items ?? []) as SubscriptionPaymentHistoryItemDto[];
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
              asChild
              className="rounded-2xl bg-[#542C85] hover:bg-[#6b3ca8] text-white border-0 h-11 px-6 w-full md:w-auto"
            >
              <Link href="/?focus=plans">مشاهده پلن‌ها</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <Card className="xl:col-span-2 bg-[#02000B]/30 border-white/5 rounded-4xl">
            <CardContent className="p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-2 text-white">
                <Crown className="w-5 h-5 text-[#B57CFF]" />
                <h2 className="font-bold text-lg">وضعیت اشتراک فعلی</h2>
              </div>

              {detailsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 bg-white/10" />
                  ))}
                </div>
              ) : !hasActiveSubscription ? (
                <div className="rounded-3xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center">
                  <p className="text-white font-semibold">اشتراک فعالی ندارید.</p>
                  <p className="text-sm text-white/65 mt-2">
                    برای خرید اشتراک، به بخش پلن‌ها مراجعه کنید.
                  </p>
                  <Button
                    asChild
                    className="mt-4 rounded-2xl bg-[#542C85] hover:bg-[#6b3ca8] text-white border-0"
                  >
                    <Link href="/?focus=plans">رفتن به پلن‌ها</Link>
                  </Button>
                </div>
              ) : (
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
                  {visibleHistoryItems.map((item, index) => (
                    <div
                      key={item.id ?? `payment-${index}`}
                      className="rounded-3xl border border-white/10 bg-gradient-to-l from-white/[0.05] to-[#7A46BA]/[0.06] p-3.5 transition-all duration-300 hover:border-[#B57CFF]/30 hover:bg-gradient-to-l hover:from-white/[0.08] hover:to-[#7A46BA]/[0.12]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-white font-semibold">
                          {item.price !== undefined
                            ? `${toPersianDigits(item.price.toLocaleString("fa-IR"))} تومان`
                            : "—"}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${pickStatusColor(item.status)}`}
                        >
                          {paymentStatusText(item.status)}
                        </span>
                      </div>
                      <p className="text-xs text-white/65 mt-1.5">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  ))}
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
            <DialogTitle className="text-xl font-bold">همه پرداخت‌ها</DialogTitle>
          </DialogHeader>
          <div className="mt-2 max-h-[60vh] space-y-3 overflow-y-auto pr-1 scrollbar-subscription">
            {historyItems.map((item, index) => (
              <div
                key={item.id ?? `payment-all-${index}`}
                className="rounded-2xl border border-white/10 bg-gradient-to-l from-white/[0.05] to-[#7A46BA]/[0.06] p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-white font-semibold">
                    {item.price !== undefined
                      ? `${toPersianDigits(item.price.toLocaleString("fa-IR"))} تومان`
                      : "—"}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${pickStatusColor(item.status)}`}
                  >
                    {paymentStatusText(item.status)}
                  </span>
                </div>
                <p className="text-xs text-white/65 mt-1.5">{formatDate(item.date)}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
