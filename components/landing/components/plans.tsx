"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Sparkles } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  SubscriptionPurchaseService,
  SubscriptionDashboardService,
  UserDashboardService,
  type SubscriptionPlanCatalogItemDto,
  type UserSubscriptionPlanDetailsDto,
} from "@/lib/api/client";

// Copied exactly from dashboard plans
type GoldPlan = {
  id: number;
  displayName: string;
  subtitle: string;
  monthlyPrice: number;
  features: string[];
  footerText: string;
  ctaText: string;
  isBundle?: boolean;
};

type AbpWrapper<T> = {
  result?: T;
};

function unwrapAbp<T>(value: unknown): T | null {
  if (!value || typeof value !== "object") return null;
  const wrapper = value as AbpWrapper<T>;
  if (wrapper.result && typeof wrapper.result === "object") return wrapper.result;
  return value as T;
}

function formatMoney(value?: number | null): string {
  if (value === null || value === undefined) return "رایگان";
  const displayValue = Math.round(value / 10);
  return `${toPersianDigits(displayValue.toLocaleString("fa-IR"))} تومان`;
}

export default function LandingPlans() {
  const router = useRouter();
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<GoldPlan | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    setIsLoggedIn(Boolean(token));
  }, []);
  const { data: plansResponse, isLoading } = useQuery({
    queryKey: ["landing-active-subscription-plans"],
    queryFn: () =>
      SubscriptionDashboardService.apiServicesAppSubscriptiondashboardGetactivesubscriptionplansGet(),
  });
  const { data: subscriptionDetailsResponse } = useQuery({
    queryKey: ["mySubscriptionPlanDetails-for-purchase-guard"],
    enabled: isLoggedIn,
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet(),
  });

  const normalizedPlansResponse = plansResponse as
    | SubscriptionPlanCatalogItemDto[]
    | AbpWrapper<SubscriptionPlanCatalogItemDto[]>
    | undefined;

  const plansFromApi = Array.isArray(normalizedPlansResponse)
    ? normalizedPlansResponse
    : Array.isArray(normalizedPlansResponse?.result)
      ? normalizedPlansResponse.result
      : [];

  const subscriptionDetails = unwrapAbp<UserSubscriptionPlanDetailsDto>(
    subscriptionDetailsResponse,
  );
  const hasActiveSubscription =
    !!subscriptionDetails?.hasSubscription &&
    !!subscriptionDetails?.endDateUtc &&
    new Date(subscriptionDetails.endDateUtc).getTime() > Date.now();

  const plans: GoldPlan[] = plansFromApi.map((plan) => ({
    id: plan.id ?? 0,
    displayName: plan.displayName ?? plan.name ?? "پلن اشتراک",
    subtitle:
      plan.subtitle ??
      plan.summaryText ??
      plan.description ??
      "جزئیات پلن در دسترس است.",
    monthlyPrice: plan.price ?? 0,
    features:
      plan.features
        ?.filter((f) => f.isEnabled !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((f) => f.value)
        .filter((v): v is string => Boolean(v && v.trim().length > 0)) ?? [],
    footerText:
      plan.summaryText ??
      plan.description ??
      "برای مشاهده اطلاعات کامل این پلن اقدام کنید.",
    ctaText: plan.callToActionText ?? "مشاهده و فعال‌سازی پلن",
    isBundle: plan.isHighlighted === true,
  }));

  const handlePurchase = async (planId: number) => {
    if (!planId) return;
    setPendingPlanId(planId);
    try {
      const response = await SubscriptionPurchaseService.apiServicesAppSubscriptionpurchaseRequestpaymentPost({
        subscriptionPlanId: planId,
      });

      const payload = unwrapAbp<any>(response);
      if (payload && typeof payload === "object" && "checkoutUrl" in payload && payload.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
        return;
      }
    } catch (error) {
      console.error("Purchase error:", error);
      router.push("/auth?redirect=/#plans");
      return;
    } finally {
      setPendingPlanId(null);
    }
  };

  const openConfirm = (plan: GoldPlan) => {
    if (!isLoggedIn) {
      router.push("/auth/sign-in?redirect=/#plans");
      return;
    }
    if (hasActiveSubscription) return;
    setSelectedPlan(plan);
    setConfirmOpen(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPlan?.id) return;
    await handlePurchase(selectedPlan.id);
    setConfirmOpen(false);
  };

  return (
    <div className="py-20 w-full" id="plans">
      <div className="text-center mb-16 px-4">
        <span className="text-[#A87FF3] text-sm font-bold tracking-wider bg-[#A87FF3]/10 px-4 py-2 rounded-full border border-[#A87FF3]/20 mb-4 inline-block">
          پلن‌های اشتراک طلا
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-6 leading-tight">
          تخصص ما <span className="text-[#EAB308]">فقط طلاست.</span>
          <br className="hidden md:block" /> تمرکز کامل روی یک بازار = دقت
          بالاتر
        </h2>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
          برای تریدرهایی که دنبال سیگنال‌های دقیق، مطمئن و فیلتر شده از بازار
          طلا هستند.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 px-4 md:px-0">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={`plans-skeleton-${index}`}
              className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-[#02000B]/50"
            >
              <CardContent className="p-5 md:p-6 h-full">
                <div className="space-y-5 h-full flex flex-col">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-3/4 bg-white/10" />
                    <Skeleton className="h-5 w-full bg-white/10" />
                  </div>
                  <div className="rounded-3xl border border-white/10 p-4 space-y-2">
                    <Skeleton className="h-4 w-16 bg-white/10" />
                    <Skeleton className="h-10 w-2/3 bg-white/10" />
                    <Skeleton className="h-4 w-24 bg-white/10" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-full bg-white/10" />
                    <Skeleton className="h-5 w-11/12 bg-white/10" />
                    <Skeleton className="h-5 w-10/12 bg-white/10" />
                    <Skeleton className="h-5 w-9/12 bg-white/10" />
                  </div>
                  <Skeleton className="h-16 w-full bg-white/10" />
                  <Skeleton className="h-12 w-full rounded-3xl bg-white/10" />
                </div>
              </CardContent>
            </Card>
          ))}

        {!isLoading && plans.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center text-white/70">
            در حال حاضر پلن فعالی برای نمایش وجود ندارد.
          </div>
        )}

        {!isLoading &&
          plans.map((plan, index) => {
          const isBundle = !!plan.isBundle;

          let theme = {
            cardBg:
              "border-white/10 bg-gradient-to-br from-white/[0.08] to-[#02000B]/50 hover:border-white/20",
            glow: "bg-white/5",
            priceBox: "border-white/10 bg-white/[0.03]",
            check: "text-white/60",
            button: "bg-[#5D31A0] hover:bg-[#6A3D9C] text-white",
          };

          if (index % 3 === 0) {
            theme = {
              cardBg:
                "border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 via-[#3B216A]/25 to-[#02000B]/60 shadow-lg shadow-indigo-500/10 hover:border-indigo-400/60",
              glow: "bg-indigo-400/20",
              priceBox: "border-indigo-400/30 bg-indigo-400/10",
              check: "text-indigo-300",
              button:
                "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25",
            };
          } else if (index % 3 === 1) {
            theme = {
              cardBg:
                "border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500/15 via-[#542C85]/25 to-[#02000B]/60 shadow-lg shadow-fuchsia-500/10 hover:border-fuchsia-400/60",
              glow: "bg-fuchsia-400/20",
              priceBox: "border-fuchsia-400/30 bg-fuchsia-400/10",
              check: "text-fuchsia-300",
              button:
                "bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/25",
            };
          }

          if (isBundle) {
            theme = {
              cardBg:
                "border-amber-300/70 bg-gradient-to-br from-amber-400/30 via-[#5F2E96]/35 to-[#090613]/90 lg:scale-[1.04] shadow-2xl shadow-amber-500/30 lg:z-10",
              glow: "bg-amber-300/25",
              priceBox: "border-amber-300/40 bg-amber-400/10",
              check: "text-amber-400",
              button:
                "bg-amber-400 hover:bg-amber-300 text-black font-bold shadow-lg shadow-amber-500/25",
            };
          }

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden rounded-4xl border transition-all duration-300 group ${theme.cardBg}`}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl ${theme.glow}`}
                />
              </div>

              {isBundle && (
                <div className="absolute top-3 left-3 rounded-3xl px-3 py-1.5 text-[11px] border border-amber-200/60 bg-amber-400/25 text-amber-100 inline-flex items-center gap-1 font-semibold backdrop-blur-sm">
                  <Sparkles className="w-3 h-3" />
                  پیشنهاد ویژه
                </div>
              )}

              <CardContent className="p-5 md:p-6 h-full">
                <div className="space-y-5 h-full flex flex-col">
                  <div>
                    <h3 className="text-xl font-extrabold text-white leading-8">
                      {plan.displayName}
                    </h3>
                    <p className="text-sm text-white/75 mt-2 leading-6 min-h-[3rem]">
                      {plan.subtitle}
                    </p>
                  </div>

                  <div className={`rounded-3xl border p-4 ${theme.priceBox}`}>
                    <p className="text-xs text-white/60 mb-2">شروع از</p>
                    <p className="text-3xl md:text-4xl font-black text-white leading-none">
                      {formatMoney(plan.monthlyPrice)}
                    </p>
                    <p className="text-xs mt-2 text-white/65">پرداخت ماهانه</p>
                  </div>

                  <ul className="space-y-2 text-sm text-white/85 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="inline-flex items-start gap-2 w-full leading-6"
                      >
                        <Check
                          className={`w-4 h-4 shrink-0 mt-1 ${theme.check}`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length === 0 && (
                      <li className="text-white/60 text-sm">
                        جزئیات ویژگی‌ها به‌زودی اعلام می‌شود.
                      </li>
                    )}
                  </ul>

                  <p className="text-xs md:text-sm text-white/70 leading-6 border-t border-white/10 pt-3">
                    {plan.footerText}
                  </p>

                  <Button
                    type="button"
                    onClick={() => openConfirm(plan)}
                    disabled={
                      (isLoggedIn && pendingPlanId === plan.id) ||
                      (isLoggedIn && hasActiveSubscription)
                    }
                    className={`w-full rounded-3xl h-12 text-base cursor-pointer ${theme.button}`}
                  >
                    {!isLoggedIn
                      ? "ورود به اکانت"
                      : hasActiveSubscription
                        ? "اشتراک فعال دارید"
                      : pendingPlanId === plan.id
                        ? "در حال انتقال..."
                        : plan.ctaText}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
          })}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md overflow-hidden bg-[radial-gradient(120%_120%_at_100%_0%,rgba(168,127,243,0.28)_0%,rgba(17,5,34,0.95)_45%,rgba(8,2,20,0.98)_100%)] border border-white/20 text-white shadow-[0_24px_90px_rgba(93,49,160,0.45)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
          <DialogHeader>
            <div className="mb-2 inline-flex w-fit items-center rounded-full border border-[#EAB308]/45 bg-[#EAB308]/15 px-3 py-1 text-[11px] font-semibold text-[#F7DA7A]">
              تایید نهایی خرید
            </div>
            <DialogTitle className="text-right text-2xl font-black tracking-tight">
              تایید خرید پلن
            </DialogTitle>
            <DialogDescription className="text-right text-white/75 text-[15px]">
              آیا مطمئن هستید که می‌خواهید این پلن را خریداری کنید؟
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.10] to-white/[0.02] p-5 space-y-3 backdrop-blur-md">
            <p className="text-xs text-white/60">نام پلن</p>
            <p className="text-lg font-extrabold break-words leading-8">
              {selectedPlan?.displayName ?? "—"}
            </p>
            <div className="h-px w-full bg-white/10" />
            <p className="text-xs text-white/60">قیمت پلن</p>
            <p className="text-3xl font-black text-[#F9F6FF]">
              {formatMoney(selectedPlan?.monthlyPrice)}
            </p>
          </div>

          <DialogFooter className="pt-1">
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={pendingPlanId === selectedPlan?.id}
              className="rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/20 cursor-pointer"
            >
              انصراف
            </Button>
            <Button
              onClick={() => void confirmPurchase()}
              disabled={pendingPlanId === selectedPlan?.id}
              className="rounded-2xl border-0 bg-gradient-to-r from-[#6E3BC2] via-[#9D4EDD] to-[#B15CFF] text-white shadow-[0_10px_30px_rgba(168,127,243,0.45)] hover:brightness-110 cursor-pointer"
            >
              {pendingPlanId === selectedPlan?.id ? "در حال انتقال..." : "بله، خرید پلن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
