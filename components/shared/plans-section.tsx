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
import { Check, Sparkles, Crown, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  SubscriptionPurchaseService,
  SubscriptionDashboardService,
  type SubscriptionPlanCatalogItemDto,
} from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth-session";
import {
  getDurationLabel,
  getPaymentPeriodLabel,
  isOnsCatalogPlan,
  isMazanehCatalogPlan,
} from "@/lib/subscription-plan-duration";

type GoldPlan = {
  id: number;
  displayName: string;
  subtitle: string;
  monthlyPrice: number;
  features: string[];
  footerText: string;
  ctaText: string;
  isBundle?: boolean;
  comingSoon?: boolean;
  durationInDays?: number | null;
  marketFocus?: number | null;
  isOns?: boolean;
  isMazaneh?: boolean;
  variants?: GoldPlan[];
  hasDurationChoices?: boolean;
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

function formatMoneyAmount(value?: number | null): string {
  if (value === null || value === undefined) return "رایگان";
  const displayValue = Math.round(value / 10);
  return toPersianDigits(displayValue.toLocaleString("fa-IR"));
}

function getDailyPriceLabel(price?: number | null, days?: number | null): string | null {
  if (!price || !days || days <= 0) return null;
  const daily = Math.round(price / 10 / days);
  return `${toPersianDigits(daily.toLocaleString("fa-IR"))} تومان / روز`;
}

function isComingSoonPlan(plan: SubscriptionPlanCatalogItemDto): boolean {
  const isBundle = plan.isHighlighted === true;
  return isBundle;
}

function getPlanPriceLabel(plan: GoldPlan): string {
  return plan.comingSoon ? "بزودی" : formatMoney(plan.monthlyPrice);
}

function mapCatalogPlan(plan: SubscriptionPlanCatalogItemDto): GoldPlan {
  return {
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
    comingSoon: isComingSoonPlan(plan),
    durationInDays: plan.durationInDays,
    marketFocus: plan.marketFocus,
    isOns: isOnsCatalogPlan(plan),
    isMazaneh: isMazanehCatalogPlan(plan),
  };
}

function buildDisplayPlans(plans: GoldPlan[]): GoldPlan[] {
  const onsVariants = plans
    .filter((plan) => plan.isOns && !plan.comingSoon)
    .sort((a, b) => (b.durationInDays ?? 0) - (a.durationInDays ?? 0));
    
  const baseMazanehVariants = plans
    .filter((plan) => plan.isMazaneh && !plan.comingSoon && !plan.isBundle)
    .sort((a, b) => (b.durationInDays ?? 0) - (a.durationInDays ?? 0));

  const otherPlans = plans.filter(
    (plan) => 
      !(plan.isOns && !plan.comingSoon) &&
      !(plan.isMazaneh && !plan.comingSoon && !plan.isBundle)
  );

  // Mock missing Mazaneh durations based on the monthly plan
  const finalMazanehVariants = [...baseMazanehVariants];
  const monthlyMazaneh = finalMazanehVariants.find((p) => p.durationInDays === 30) || finalMazanehVariants[0];
  if (monthlyMazaneh) {
    if (!finalMazanehVariants.some((p) => p.durationInDays === 14)) {
      finalMazanehVariants.push({
        ...monthlyMazaneh,
        id: 999914, // Fake ID
        displayName: "اشتراک دو هفته‌ای مظنه",
        durationInDays: 14,
        monthlyPrice: Math.round(monthlyMazaneh.monthlyPrice / 2),
      });
    }
    if (!finalMazanehVariants.some((p) => p.durationInDays === 7)) {
      finalMazanehVariants.push({
        ...monthlyMazaneh,
        id: 999907, // Fake ID
        displayName: "اشتراک هفتگی مظنه",
        durationInDays: 7,
        monthlyPrice: Math.round(monthlyMazaneh.monthlyPrice / 4),
      });
    }
    finalMazanehVariants.sort((a, b) => (b.durationInDays ?? 0) - (a.durationInDays ?? 0));
  }

  const result: GoldPlan[] = [];

  if (onsVariants.length > 0) {
    if (onsVariants.length === 1) {
      result.push(onsVariants[0]);
    } else {
      const preferred = onsVariants.find((plan) => plan.durationInDays === 30) ?? onsVariants[0];
      const lowestPrice = Math.min(...onsVariants.map((plan) => plan.monthlyPrice));
      result.push({
        ...preferred,
        id: preferred.id,
        displayName: "اشتراک انس جهانی",
        monthlyPrice: lowestPrice,
        variants: onsVariants,
        hasDurationChoices: true,
        ctaText: preferred.ctaText.includes("انس") ? preferred.ctaText : "فعال‌سازی اشتراک انس",
      });
    }
  }

  if (finalMazanehVariants.length > 0) {
    if (finalMazanehVariants.length === 1 && !finalMazanehVariants[0].hasDurationChoices && !baseMazanehVariants.length) {
       result.push(finalMazanehVariants[0]);
    } else {
       const preferred = finalMazanehVariants.find((plan) => plan.durationInDays === 30) ?? finalMazanehVariants[0];
       const lowestPrice = Math.min(...finalMazanehVariants.map((plan) => plan.monthlyPrice));
       result.push({
         ...preferred,
         id: preferred.id,
         displayName: "اشتراک مظنه",
         monthlyPrice: lowestPrice,
         variants: finalMazanehVariants,
         hasDurationChoices: finalMazanehVariants.length > 1,
         ctaText: preferred.ctaText.includes("مظنه") ? preferred.ctaText : "فعال‌سازی اشتراک مظنه",
       });
    }
  }

  result.push(...otherPlans);
  return result;
}

interface PlansSectionProps {
  showHeader?: boolean;
  onPurchaseSuccess?: () => void;
}

export default function PlansSection({ showHeader = true, onPurchaseSuccess }: PlansSectionProps) {
  const router = useRouter();
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<GoldPlan | null>(null);
  const [durationGroup, setDurationGroup] = useState<GoldPlan | null>(null);
  const [durationOpen, setDurationOpen] = useState(false);
  const [selectedDurationId, setSelectedDurationId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()));
  }, []);

  const { data: plansResponse, isLoading } = useQuery({
    queryKey: ["landing-active-subscription-plans"],
    queryFn: () =>
      SubscriptionDashboardService.apiServicesAppSubscriptiondashboardGetactivesubscriptionplansGet(),
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

  const catalogPlans = plansFromApi.map(mapCatalogPlan);
  const plans = buildDisplayPlans(catalogPlans);
  const allPurchaseablePlans = catalogPlans.filter((plan) => !plan.comingSoon);

  const bundlePlanIndex = plans.findIndex((plan) => plan.isBundle);
  const desktopPlans =
    bundlePlanIndex > -1 && plans.length >= 3
      ? [
          ...plans.filter((_, index) => index !== bundlePlanIndex).slice(0, 1),
          plans[bundlePlanIndex],
          ...plans.filter((_, index) => index !== bundlePlanIndex).slice(1),
        ]
      : plans;
  const mobilePlans = [...plans].sort((a, b) => {
    if (a.comingSoon === b.comingSoon) return 0;
    return a.comingSoon ? 1 : -1;
  });

  const handlePurchase = async (planId: number) => {
    if (!planId) return;
    const plan = allPurchaseablePlans.find((item) => item.id === planId);
    if (!plan || plan.comingSoon) return;
    setPendingPlanId(planId);
    try {
      const response = await SubscriptionPurchaseService.apiServicesAppSubscriptionpurchaseRequestpaymentPost({
        subscriptionPlanId: planId,
      });

      const payload = unwrapAbp<{ checkoutUrl?: string | null }>(response);
      if (payload && typeof payload === "object" && "checkoutUrl" in payload && payload.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
        return;
      }
    } catch (error) {
      console.error("Purchase error:", error);
      if (showHeader) {
        router.push("/auth?redirect=/#plans");
      } else {
        router.push("/auth?redirect=/dashboard/subscription");
      }
      return;
    } finally {
      setPendingPlanId(null);
    }
  };

  const openConfirm = (plan: GoldPlan) => {
    if (plan.comingSoon) return;
    if (!isLoggedIn) {
      const redirectUrl = showHeader ? "/#plans" : "/dashboard/subscription";
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    if (plan.hasDurationChoices && (plan.variants?.length ?? 0) > 1) {
      const preferred =
        plan.variants?.find((item) => item.durationInDays === 30) ??
        plan.variants?.[0] ??
        null;
      setDurationGroup(plan);
      setSelectedDurationId(preferred?.id ?? null);
      setDurationOpen(true);
      return;
    }

    setSelectedPlan(plan.variants?.[0] ?? plan);
    setConfirmOpen(true);
  };

  const confirmDurationSelection = () => {
    const variant =
      durationGroup?.variants?.find((item) => item.id === selectedDurationId) ??
      null;
    if (!variant) return;
    setDurationOpen(false);
    setDurationGroup(null);
    setSelectedPlan(variant);
    setConfirmOpen(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPlan?.id) return;
    await handlePurchase(selectedPlan.id);
    setConfirmOpen(false);
    onPurchaseSuccess?.();
  };

  return (
    <div className={showHeader ? "py-20 w-full" : "py-4 w-full"} id="plans">
      {showHeader && (
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
      )}

      {/* Single Unified Responsive Swiper Section */}
      <div className="w-full overflow-visible relative px-1 mt-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`plans-skeleton-${index}`}
                className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-[#02000B]/50 h-[680px] flex flex-col"
              >
                <CardContent className={`${showHeader ? "p-5 md:p-6" : "p-4 md:p-4.5"} flex-1 flex flex-col justify-between`}>
                  <div className={`${showHeader ? "space-y-5" : "space-y-3.5"} flex-1 flex flex-col justify-between h-full`}>
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-3/4 bg-white/10" />
                      <Skeleton className="h-5 w-full bg-white/10" />
                    </div>
                    <div className={`border border-white/10 ${showHeader ? "rounded-3xl p-4 space-y-2" : "rounded-2xl p-3 space-y-1.5"}`}>
                      <Skeleton className="h-4 w-16 bg-white/10" />
                      <Skeleton className="h-10 w-2/3 bg-white/10" />
                      <Skeleton className="h-4 w-24 bg-white/10" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-full bg-white/10" />
                      <Skeleton className="h-5 w-11/12 bg-white/10" />
                      <Skeleton className="h-5 w-10/12 bg-white/10" />
                    </div>
                    <Skeleton className="h-16 w-full bg-white/10" />
                    <Skeleton className={`${showHeader ? "h-12 rounded-3xl" : "h-10 rounded-2xl"} w-full bg-white/10 mt-auto`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center text-white/70">
            در حال حاضر پلن فعالی برای نمایش وجود ندارد.
          </div>
        ) : (
          <>
            <style dangerouslySetInnerHTML={{ __html: `
              .plans-swiper .swiper-pagination-bullet {
                background: rgba(255, 255, 255, 0.2) !important;
                opacity: 1 !important;
                width: 8px !important;
                height: 8px !important;
                transition: all 0.3s ease !important;
              }
              .plans-swiper .swiper-pagination-bullet-active {
                background: linear-gradient(90deg, #B57CFF, #8C46FF) !important;
                width: 24px !important;
                border-radius: 4px !important;
                box-shadow: 0 0 10px rgba(181, 124, 255, 0.5) !important;
              }
              .plans-swiper .swiper-pagination {
                position: static !important;
                margin-top: 24px;
                line-height: 0;
                text-align: center;
              }
              .plans-swiper .swiper-wrapper {
                align-items: stretch;
              }
              .plans-swiper .swiper-slide {
                height: auto;
                display: flex;
              }
              .plans-swiper {
                direction: rtl;
              }
              .plans-swiper-button-disabled {
                opacity: 0.35 !important;
                cursor: not-allowed !important;
              }
              @media (min-width: 768px) {
                .plans-swiper-mask {
                  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 150px, black calc(100% - 150px), transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, black 150px, black calc(100% - 150px), transparent 100%);
                }
              }
            `}} />

            {/* Navigation Arrows for Desktop */}
            <div className="hidden md:flex items-center justify-end gap-3 mb-6 px-4 md:px-8 relative z-20">
              <button
                type="button"
                className="plans-swiper-prev p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:border-white/25 transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.2)] group backdrop-blur-md"
                aria-label="Previous Slide"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                type="button"
                className="plans-swiper-next p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:border-white/25 transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.2)] group backdrop-blur-md"
                aria-label="Next Slide"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>

            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.12}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              navigation={{
                nextEl: ".plans-swiper-next",
                prevEl: ".plans-swiper-prev",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2.15,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3.15,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 3.2,
                  spaceBetween: 24,
                },
              }}
              initialSlide={0}
              speed={400}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              pagination={{ clickable: true }}
              className="plans-swiper plans-swiper-mask overflow-visible !py-12 !-my-12"
              dir="rtl"
              style={{ 
                direction: "rtl"
              }}
            >
              {desktopPlans.map((plan, index) => {
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
                      "border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 via-[#3B216A]/25 to-[#02000B]/60 hover:border-indigo-400/60",
                    glow: "bg-indigo-400/20",
                    priceBox: "border-indigo-400/30 bg-indigo-400/10",
                    check: "text-indigo-300",
                    button:
                      "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25",
                  };
                } else if (index % 3 === 1) {
                  theme = {
                    cardBg:
                      "border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500/15 via-[#542C85]/25 to-[#02000B]/60 hover:border-fuchsia-400/60",
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
                      "border-amber-300/70 bg-gradient-to-br from-amber-400/30 via-[#5F2E96]/35 to-[#090613]/90 lg:z-10",
                    glow: "bg-amber-300/25",
                    priceBox: "border-amber-300/40 bg-amber-400/10",
                    check: "text-amber-400",
                    button:
                      "bg-amber-400 hover:bg-amber-300 text-black font-bold shadow-lg shadow-amber-500/25",
                  };
                }

                return (
                  <SwiperSlide key={plan.id} className="overflow-visible py-2">
                    <Card
                      className={`relative overflow-hidden ${showHeader ? "rounded-4xl border h-[700px]" : "rounded-3xl border h-[680px]"} transition-all duration-300 group ${theme.cardBg} shadow-none md:shadow-[0_16px_40px_rgba(7,2,20,0.45)] hover:md:shadow-[0_20px_52px_rgba(11,4,28,0.55)] flex flex-col w-full`}
                    >
                      <div className="absolute inset-0 pointer-events-none">
                        <div
                          className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl ${theme.glow}`}
                        />
                      </div>

                      {isBundle && (
                        <div className={`absolute ${showHeader ? "top-3 left-3 px-3 py-1.5" : "top-2.5 left-2.5 px-2.5 py-1"} rounded-3xl text-[11px] border border-amber-200/60 bg-amber-400/25 text-amber-100 inline-flex items-center gap-1 font-semibold backdrop-blur-sm`}>
                          <Sparkles className="w-3 h-3" />
                          پیشنهاد ویژه
                        </div>
                      )}

                      <CardContent
                        className={`${showHeader ? "p-5 md:p-6" : "p-4 md:p-4.5"} ${isBundle ? (showHeader ? "pt-14" : "pt-12") : ""} flex-1 flex flex-col h-full`}
                      >
                        <div className={`${showHeader ? "space-y-5" : "space-y-3.5"} flex-1 flex flex-col h-full min-h-0`}>
                          <div>
                            <h3 className={`font-extrabold text-white leading-8 ${showHeader ? "text-xl" : "text-[17px]"}`}>
                              {plan.displayName}
                            </h3>
                            <p className={`text-white/75 mt-1.5 leading-6 ${showHeader ? "text-sm min-h-[3rem]" : "text-[12px] min-h-[2.5rem]"}`}>
                              {plan.subtitle}
                            </p>
                          </div>

                          <div className={`${showHeader ? "rounded-3xl p-4" : "rounded-2xl p-3"} border ${theme.priceBox}`}>
                            {!plan.comingSoon && (
                              <p className="text-xs text-white/60 mb-1.5">شروع از</p>
                            )}
                            <p className={`font-black text-white leading-none ${showHeader ? "text-3xl md:text-4xl" : "text-2xl md:text-[26px]"}`}>
                              {getPlanPriceLabel(plan)}
                            </p>
                            {!plan.comingSoon && (
                              <p className="text-xs mt-1.5 text-white/65">
                                {plan.hasDurationChoices
                                  ? "ماهانه · دو هفته‌ای · هفتگی"
                                  : getPaymentPeriodLabel(plan.durationInDays)}
                              </p>
                            )}
                          </div>

                          <ul className={`${showHeader ? "space-y-2 text-sm min-h-[194px]" : "space-y-1.5 text-[12px] min-h-[170px]"} text-white/85 flex-1`}>
                            {plan.features.map((feature) => (
                              <li
                                key={feature}
                                className="inline-flex items-start gap-2 w-full leading-5"
                              >
                                <Check
                                  className={`shrink-0 mt-0.5 ${showHeader ? "w-4 h-4" : "w-3.5 h-3.5"} ${theme.check}`}
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

                          <p className={`text-white/70 leading-5 border-t border-white/10 ${showHeader ? "text-xs md:text-sm pt-3 mt-1 min-h-[64px]" : "text-[11px] pt-2 mt-0.5 min-h-[48px]"}`}>
                            {plan.footerText}
                          </p>

                          <div className="mt-auto pt-6">
                            <Button
                              type="button"
                              onClick={() => openConfirm(plan)}
                              disabled={
                                plan.comingSoon ||
                                (isLoggedIn && pendingPlanId === plan.id)
                              }
                              className={`w-full ${plan.comingSoon ? "cursor-not-allowed opacity-75 bg-white/10 hover:bg-white/10 text-white/70 border border-white/15" : `cursor-pointer ${theme.button}`} ${showHeader ? "rounded-3xl h-12 text-base" : "rounded-2xl h-10 text-sm"}`}
                            >
                              {plan.comingSoon
                                ? "بزودی"
                                : !isLoggedIn
                                  ? "ورود به اکانت"
                                  : pendingPlanId === plan.id
                                    ? "در حال انتقال..."
                                    : plan.ctaText}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        )}
      </div>

      <Dialog
        open={durationOpen}
        onOpenChange={(open) => {
          setDurationOpen(open);
          if (!open) {
            setDurationGroup(null);
            setSelectedDurationId(null);
          }
        }}
      >
        <DialogContent
          className="box-border w-[calc(100vw-1.5rem)] max-w-[960px] max-h-[min(92dvh,900px)] gap-0 overflow-x-hidden overflow-y-auto md:overflow-y-hidden border border-[#E8C878]/20 bg-[#07040F] p-0 text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)]"
          dir="rtl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_100%_0%,rgba(232,200,120,0.16)_0%,transparent_55%),radial-gradient(80%_60%_at_0%_100%,rgba(93,49,160,0.35)_0%,transparent_55%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#E8C878]/70 to-transparent" />

          <div className="relative px-4 pt-5 pb-2.5 md:px-6 md:pt-5 md:pb-3">
            <DialogHeader className="space-y-2 text-right pe-8 md:space-y-2.5">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#E8C878]/35 bg-[#E8C878]/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#F3D98A]">
                <Crown className="h-3.5 w-3.5" />
                تجربه پریمیوم انس
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <DialogTitle className="text-right text-[22px] md:text-[26px] font-black leading-tight tracking-tight text-white break-words">
                  {durationGroup?.displayName ?? "اشتراک انس جهانی"}
                </DialogTitle>
                <DialogDescription className="text-right text-[13px] md:text-[14px] leading-6 md:leading-7 text-white/60 md:max-w-2xl">
                  مدت دسترسی خود را انتخاب کنید. هر پلن همان سیگنال‌های انس را
                  با پوشش کامل ارائه می‌دهد.
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>

          <div className="relative grid w-full min-w-0 grid-cols-1 gap-2.5 px-4 pb-3 md:grid-cols-3 md:gap-3 md:px-6 md:pb-4">
            {(durationGroup?.variants ?? []).map((variant) => {
              const isSelected = selectedDurationId === variant.id;
              const isRecommended = variant.durationInDays === 30;
              const dailyLabel = getDailyPriceLabel(
                variant.monthlyPrice,
                variant.durationInDays,
              );

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedDurationId(variant.id)}
                  className={`group relative w-full max-w-full overflow-hidden rounded-[18px] border text-right transition-[border-color,background-color,box-shadow] duration-300 cursor-pointer ${
                    isSelected
                      ? "border-[#E8C878]/65 bg-gradient-to-b from-[#E8C878]/18 via-[#2A1848]/80 to-[#120A22] shadow-[0_0_0_1px_rgba(232,200,120,0.25),0_18px_50px_-24px_rgba(232,200,120,0.55)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex w-full min-w-0 flex-col gap-2.5 p-3.5 md:gap-3 md:p-4">
                    <div className="flex w-full min-w-0 items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            isSelected
                              ? "border-[#E8C878] bg-[#E8C878] text-[#1A1205]"
                              : "border-white/20 bg-transparent text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </div>
                        <p className="truncate text-[16px] md:text-[18px] font-extrabold text-white">
                          {getDurationLabel(variant.durationInDays)}
                        </p>
                      </div>
                      {isRecommended ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#E8C878]/40 bg-[#E8C878]/15 px-2 py-0.5 text-[10px] font-bold text-[#F6E2A4]">
                          <Sparkles className="h-3 w-3" />
                          پیشنهاد ویژه
                        </span>
                      ) : null}
                    </div>

                    {variant.durationInDays ? (
                      <span className="w-fit rounded-md border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] md:text-[11px] text-white/55">
                        {toPersianDigits(variant.durationInDays)} روز دسترسی
                      </span>
                    ) : null}

                    <div
                      className={`w-full min-w-0 rounded-2xl border px-3 py-2.5 md:px-3.5 md:py-3 transition-colors duration-300 ${
                        isSelected
                          ? "border-[#E8C878]/30 bg-[#E8C878]/10"
                          : "border-white/10 bg-black/20"
                      }`}
                    >
                      <p className="text-[11px] text-white/50 mb-1">مبلغ پرداخت</p>
                      <div className="flex min-w-0 flex-wrap items-baseline gap-1">
                        <span className="text-[22px] md:text-[24px] font-black leading-none tracking-tight text-white break-all">
                          {formatMoneyAmount(variant.monthlyPrice)}
                        </span>
                        <span className="text-xs font-semibold text-white/65">
                          تومان
                        </span>
                      </div>
                      {dailyLabel ? (
                        <p className="mt-2 text-[11px] text-white/45 break-words">
                          {dailyLabel}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative border-t border-white/10 bg-[#07040F]/95 px-4 py-3 md:px-6 md:py-3.5 backdrop-blur-md">
            <div className="flex flex-col gap-2 md:flex-row-reverse md:items-center md:justify-between md:gap-4">
              <Button
                type="button"
                onClick={confirmDurationSelection}
                disabled={!selectedDurationId}
                className="h-11 md:h-12 w-full md:w-auto md:min-w-[200px] rounded-2xl border-0 bg-gradient-to-l from-[#C9A24A] via-[#E8C878] to-[#F4E0A8] px-5 text-[15px] font-extrabold text-[#1A1205] shadow-[0_12px_40px_-12px_rgba(232,200,120,0.75)] hover:brightness-105 disabled:opacity-50 cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  ادامه خرید
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </Button>
              <p className="text-[11px] md:text-[12px] leading-6 text-white/45 text-center md:text-right">
                پس از انتخاب مدت، تایید نهایی خرید نمایش داده می‌شود.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md overflow-hidden bg-[radial-gradient(120%_120%_at_100%_0%,rgba(168,127,243,0.28)_0%,rgba(17,5,34,0.95)_45%,rgba(8,2,20,0.98)_100%)] border border-white/20 text-white shadow-[0_24px_90px_rgba(93,49,160,0.45)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
          <DialogHeader>
            <div className="mb-2 inline-flex w-fit items-center rounded-full border border-[#EAB308]/45 bg-[#EAB308]/15 px-3 py-1 text-[11px] font-semibold text-[#F7DA7A]">
              تایید نهایی خرید
            </div>
            <DialogTitle className="text-right text-2xl font-black tracking-tight font-sans">
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
            <p className="text-xs text-white/60">مدت اشتراک</p>
            <p className="text-base font-bold text-white/90">
              {getDurationLabel(selectedPlan?.durationInDays)}
            </p>
            <div className="h-px w-full bg-white/10" />
            <p className="text-xs text-white/60">قیمت پلن</p>
            <p className="text-3xl font-black text-[#F9F6FF]">
              {formatMoney(selectedPlan?.monthlyPrice)}
            </p>
            <div className="rounded-2xl border border-[#B57CFF]/25 bg-[#B57CFF]/10 p-4 text-sm text-white/80 leading-7">
              اگر اشتراک فعلی شما هنوز تمام نشده باشد، این خرید از همین حالا
              فعال نمی‌شود و بعد از پایان اشتراک فعلی شروع خواهد شد.
            </div>
          </div>

          <DialogFooter className="pt-1 flex justify-start gap-2">
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
