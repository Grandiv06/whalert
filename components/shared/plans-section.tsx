"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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
import {
  Check,
  Sparkles,
  Crown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toPersianDigits, cn } from "@/lib/utils";
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
  isBundleCatalogPlan,
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
  if (wrapper.result && typeof wrapper.result === "object")
    return wrapper.result;
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

function getDailyPriceLabel(
  price?: number | null,
  days?: number | null,
): string | null {
  if (!price || !days || days <= 0) return null;
  const daily = Math.round(price / 10 / days);
  return `${toPersianDigits(daily.toLocaleString("fa-IR"))} تومان / روز`;
}

function isComingSoonPlan(_plan: SubscriptionPlanCatalogItemDto): boolean {
  return false;
}

const LIVE_PLAN_DEFAULT_FEATURES = [
  "دسترسی به لایو ترید روزانه در لحظه",
  "نمایش کامل ورود، خروج و مدیریت معامله",
  "تحلیل لحظه‌ای شرایط بازار",
  "مدیریت سرمایه و کنترل ریسک در زمان واقعی",
  "پاسخگویی زنده به سوالات اعضا",
  "آرشیو کامل لایو تریدها و تحلیل جلسات",
  "تعداد محدود اعضا برای حفظ کیفیت",
  "پشتیبانی اختصاصی و اولویت‌دار",
];

const LIVE_PLAN_DEFAULT_FOOTER =
  "مناسب برای تریدرهایی که می‌خواهند تجربه واقعی معامله‌گری حرفه‌ای را ببینند و یاد بگیرند.";

const LIVE_PLAN_DEFAULT_SUBTITLE = "ترید زنده، شفاف و بدون هیچ پنهان‌کاری";

function mapCatalogPlan(plan: SubscriptionPlanCatalogItemDto): GoldPlan {
  const isLive = isLiveCatalogPlan(plan);
  const isBundle = isBundleCatalogPlan(plan);
  const apiFeatures =
    plan.features
      ?.filter((f) => f.isEnabled !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((f) => f.value)
      .filter((v): v is string => Boolean(v && v.trim().length > 0)) ?? [];

  return {
    id: plan.id ?? 0,
    displayName: plan.displayName ?? plan.name ?? "پلن اشتراک",
    subtitle:
      plan.subtitle ??
      plan.summaryText ??
      plan.description ??
      (isLive ? LIVE_PLAN_DEFAULT_SUBTITLE : "جزئیات پلن در دسترس است."),
    monthlyPrice: plan.price ?? 0,
    features: apiFeatures.length > 0 ? apiFeatures : isLive ? LIVE_PLAN_DEFAULT_FEATURES : [],
    footerText:
      plan.summaryText ??
      plan.description ??
      (isLive ? LIVE_PLAN_DEFAULT_FOOTER : "برای مشاهده اطلاعات کامل این پلن اقدام کنید."),
    ctaText: plan.callToActionText ?? (isLive ? "فعال‌سازی اشتراک لایو ترید" : isBundle ? "فعال‌سازی باندل کامل" : "مشاهده و فعال‌سازی پلن"),
    isBundle: isBundle,
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

  const bundleVariants = plans
    .filter((plan) => plan.isBundle && !plan.comingSoon)
    .sort((a, b) => (b.durationInDays ?? 0) - (a.durationInDays ?? 0));

  const otherPlans = plans.filter(
    (plan) =>
      !(plan.isOns && !plan.comingSoon) &&
      !(plan.isMazaneh && !plan.comingSoon && !plan.isBundle) &&
      !(plan.isBundle && !plan.comingSoon),
  );

  // Mock missing Mazaneh durations based on the monthly plan
  const finalMazanehVariants = [...baseMazanehVariants];
  const monthlyMazaneh =
    finalMazanehVariants.find((p) => p.durationInDays === 30) ||
    finalMazanehVariants[0];
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
    finalMazanehVariants.sort(
      (a, b) => (b.durationInDays ?? 0) - (a.durationInDays ?? 0),
    );
  }

  const result: GoldPlan[] = [];

  if (onsVariants.length > 0) {
    if (onsVariants.length === 1) {
      result.push(onsVariants[0]);
    } else {
      const preferred =
        onsVariants.find((plan) => plan.durationInDays === 30) ??
        onsVariants[0];
      const lowestPrice = Math.min(
        ...onsVariants.map((plan) => plan.monthlyPrice),
      );
      result.push({
        ...preferred,
        id: preferred.id,
        displayName: "اشتراک انس جهانی",
        monthlyPrice: lowestPrice,
        variants: onsVariants,
        hasDurationChoices: true,
        ctaText: preferred.ctaText.includes("انس")
          ? preferred.ctaText
          : "فعال‌سازی اشتراک انس",
      });
    }
  }

  if (bundleVariants.length > 0) {
    if (bundleVariants.length === 1) {
      result.push(bundleVariants[0]);
    } else {
      const preferred =
        bundleVariants.find((plan) => plan.durationInDays === 30) ??
        bundleVariants[0];
      const lowestPrice = Math.min(
        ...bundleVariants.map((plan) => plan.monthlyPrice),
      );
      result.push({
        ...preferred,
        id: preferred.id,
        displayName: "باندل ویژه انس + مظنه",
        monthlyPrice: lowestPrice,
        variants: bundleVariants,
        hasDurationChoices: bundleVariants.length > 1,
        ctaText: preferred.ctaText.includes("باندل")
          ? preferred.ctaText
          : "فعال‌سازی باندل کامل",
      });
    }
  }

  if (finalMazanehVariants.length > 0) {
    if (
      finalMazanehVariants.length === 1 &&
      !finalMazanehVariants[0].hasDurationChoices &&
      !baseMazanehVariants.length
    ) {
      result.push(finalMazanehVariants[0]);
    } else {
      const preferred =
        finalMazanehVariants.find((plan) => plan.durationInDays === 30) ??
        finalMazanehVariants[0];
      const lowestPrice = Math.min(
        ...finalMazanehVariants.map((plan) => plan.monthlyPrice),
      );
      result.push({
        ...preferred,
        id: preferred.id,
        displayName: "اشتراک مظنه",
        monthlyPrice: lowestPrice,
        variants: finalMazanehVariants,
        hasDurationChoices: finalMazanehVariants.length > 1,
        ctaText: preferred.ctaText.includes("مظنه")
          ? preferred.ctaText
          : "فعال‌سازی اشتراک مظنه",
      });
    }
  }

  result.push(...otherPlans);
  return result;
}

function isLiveCatalogPlan(plan: SubscriptionPlanCatalogItemDto): boolean {
  if (plan.includesLiveSessions === true) return true;
  const name = (plan.name ?? "").toLowerCase();
  const displayName = plan.displayName ?? "";
  return name.includes("live") || displayName.includes("لایو");
}

interface PlansSectionProps {
  showHeader?: boolean;
  onPurchaseSuccess?: () => void;
  /** When true, only plans that unlock live trade sessions are shown. */
  onlyLiveSessions?: boolean;
}

export default function PlansSection({
  showHeader = true,
  onPurchaseSuccess,
  onlyLiveSessions = false,
}: PlansSectionProps) {
  const router = useRouter();
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<GoldPlan | null>(null);
  const [durationGroup, setDurationGroup] = useState<GoldPlan | null>(null);
  const [durationOpen, setDurationOpen] = useState(false);
  const [selectedDurationId, setSelectedDurationId] = useState<number | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const modalScrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollModalPlans = (direction: "next" | "prev") => {
    const el = modalScrollerRef.current;
    if (!el) return;
    const amount = Math.min(340, el.clientWidth * 0.8);
    el.scrollBy({
      left: direction === "next" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()));
  }, []);

  const { data: plansResponse, isLoading } = useQuery({
    queryKey: ["landing-active-subscription-plans"],
    queryFn: async () => {
      const res =
        await SubscriptionDashboardService.apiServicesAppSubscriptiondashboardGetactivesubscriptionplansGet();
      const wrapped = res as
        | SubscriptionPlanCatalogItemDto[]
        | { result?: SubscriptionPlanCatalogItemDto[] };
      if (Array.isArray(wrapped)) return wrapped;
      if (Array.isArray(wrapped?.result)) return wrapped.result;
      return [] as SubscriptionPlanCatalogItemDto[];
    },
  });

  const plansFromApi = Array.isArray(plansResponse) ? plansResponse : [];

  const scopedPlansFromApi = onlyLiveSessions
    ? plansFromApi.filter(isLiveCatalogPlan)
    : plansFromApi;

  const catalogPlans = scopedPlansFromApi.map(mapCatalogPlan);
  const plans = onlyLiveSessions
    ? catalogPlans.filter((plan) => !plan.comingSoon)
    : buildDisplayPlans(catalogPlans);
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

  const handlePurchase = async (planId: number) => {
    if (!planId) return;
    const plan = allPurchaseablePlans.find((item) => item.id === planId);
    if (!plan || plan.comingSoon) return;
    setPendingPlanId(planId);
    try {
      const response =
        await SubscriptionPurchaseService.apiServicesAppSubscriptionpurchaseRequestpaymentPost(
          {
            subscriptionPlanId: planId,
          },
        );

      const payload = unwrapAbp<{ checkoutUrl?: string | null }>(response);
      if (
        payload &&
        typeof payload === "object" &&
        "checkoutUrl" in payload &&
        payload.checkoutUrl
      ) {
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

  const getPlanTheme = (plan: GoldPlan, index: number) => {
    const isBundle = !!plan.isBundle;

    let theme = {
      border: "border-white/10 hover:border-white/20",
      fill: "bg-gradient-to-br from-white/[0.08] to-[#02000B]/50",
      glow: "bg-white/5",
      priceBox: "border-white/10 bg-white/[0.03]",
      check: "text-white/60",
      button: "bg-[#5D31A0] hover:bg-[#6A3D9C] text-white",
      priceText: "text-white",
      accentShadow: "",
    };

    if (index % 3 === 0) {
      theme = {
        border: "border-indigo-400/35 hover:border-indigo-400/55",
        fill: "bg-gradient-to-br from-indigo-500/12 via-[#3B216A]/20 to-[#02000B]/70",
        glow: "bg-indigo-400/15",
        priceBox: "border-indigo-400/25 bg-indigo-400/[0.08]",
        check: "text-indigo-300",
        button:
          "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20",
        priceText: "text-white",
        accentShadow: "",
      };
    } else if (index % 3 === 1) {
      theme = {
        border: "border-fuchsia-400/35 hover:border-fuchsia-400/55",
        fill: "bg-gradient-to-br from-fuchsia-500/12 via-[#542C85]/20 to-[#02000B]/70",
        glow: "bg-fuchsia-400/15",
        priceBox: "border-fuchsia-400/25 bg-fuchsia-400/[0.08]",
        check: "text-fuchsia-300",
        button:
          "bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/20",
        priceText: "text-white",
        accentShadow: "",
      };
    }

    if (isBundle) {
      theme = {
        border: "border-amber-300/60",
        fill: "bg-gradient-to-br from-amber-400/20 via-[#5F2E96]/30 to-[#090613]/95",
        glow: "bg-amber-300/20",
        priceBox: "border-amber-300/35 bg-amber-400/[0.08]",
        check: "text-amber-400",
        button:
          "bg-amber-400 hover:bg-amber-300 text-black font-bold shadow-lg shadow-amber-500/20",
        priceText: "text-amber-200",
        accentShadow:
          "lg:z-10 shadow-[0_0_40px_-12px_rgba(245,158,11,0.35)]",
      };
    }

    return theme;
  };

  const renderPlanCard = (plan: GoldPlan, index: number, compact = false) => {
    const isBundle = !!plan.isBundle;
    const theme = getPlanTheme(plan, index);
    const radius = compact ? "rounded-[22px]" : "rounded-[1.75rem]";
    // Safari paints gradient/fill as a sharp rect past border-radius; clip-path fixes it.
    const safariClip = compact
      ? "[clip-path:inset(0_round_22px)]"
      : "[clip-path:inset(0_round_1.75rem)]";

    return (
      <div
        className={cn(
          "relative h-full w-full",
          theme.accentShadow,
          compact
            ? "shadow-[0_12px_36px_-18px_rgba(7,2,20,0.7)]"
            : "shadow-none md:shadow-[0_16px_40px_rgba(7,2,20,0.45)] hover:md:shadow-[0_20px_52px_rgba(11,4,28,0.55)]",
        )}
      >
        <div
          className={cn(
            "relative flex h-full w-full flex-col overflow-hidden border transition-[border-color] duration-300 group",
            "bg-[#02000B] isolate",
            radius,
            safariClip,
            theme.border,
            compact && "text-white",
          )}
        >
          <div
            aria-hidden
            className={cn("pointer-events-none absolute inset-0", theme.fill)}
          >
            <div
              className={`absolute -top-20 -right-20 h-44 w-44 rounded-full blur-3xl ${theme.glow}`}
            />
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-white/25 to-transparent" />
          </div>

          {isBundle && (
            <div
              className={cn(
                "absolute z-20 inline-flex items-center gap-1 rounded-full border border-amber-200/55 bg-amber-400/20 font-semibold text-amber-100 backdrop-blur-sm",
                compact
                  ? "left-3 top-3 px-2.5 py-1 text-[10px]"
                  : "left-3 top-3 px-3 py-1.5 text-[11px]",
              )}
            >
              <Sparkles className="h-3 w-3" />
              پیشنهاد ویژه
            </div>
          )}

          <div
            className={cn(
              "relative z-10 flex h-full flex-1 flex-col",
              compact ? "p-4 sm:p-5" : "p-5 md:p-6",
              isBundle && (compact ? "pt-11" : "pt-14"),
            )}
          >
          <div
            className={cn(
              "flex h-full min-h-0 flex-1 flex-col",
              compact ? "gap-3.5" : "gap-5",
            )}
          >
            <div>
              <h3
                className={cn(
                  "font-extrabold leading-8 text-white",
                  compact ? "text-[16px] sm:text-[17px]" : "text-xl",
                )}
              >
                {plan.displayName}
              </h3>
              <p
                className={cn(
                  "mt-1.5 leading-6 text-white/70",
                  compact
                    ? "line-clamp-2 min-h-[2.75rem] text-[12px]"
                    : "min-h-[3rem] text-sm",
                )}
              >
                {plan.subtitle}
              </p>
            </div>

            <div
              className={cn(
                "border",
                theme.priceBox,
                compact ? "rounded-2xl p-3" : "rounded-3xl p-4",
              )}
            >
              {plan.comingSoon ? (
                <div className="flex flex-col items-start gap-2">
                  <span className="inline-flex rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-[11px] font-bold text-amber-200">
                    به‌زودی
                  </span>
                  <p
                    className={cn(
                      "font-black leading-none",
                      theme.priceText,
                      compact ? "text-2xl" : "text-3xl md:text-4xl",
                    )}
                  >
                    بزودی
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-1.5 text-xs text-white/55">
                    {plan.hasDurationChoices ? "شروع از" : "قیمت اشتراک"}
                  </p>
                  <p
                    className={cn(
                      "font-black leading-none text-white",
                      compact
                        ? "text-[22px] sm:text-[26px]"
                        : "text-3xl md:text-4xl",
                      isBundle && "text-amber-100",
                    )}
                  >
                    {formatMoney(plan.monthlyPrice)}
                  </p>
                  <p className="mt-1.5 text-xs text-white/60">
                    {plan.hasDurationChoices
                      ? "ماهانه · دو هفته‌ای · هفتگی"
                      : getPaymentPeriodLabel(plan.durationInDays)}
                  </p>
                </>
              )}
            </div>

            <ul
              className={cn(
                "flex-1 text-white/85",
                compact
                  ? "space-y-1.5 text-[12px] leading-5"
                  : "min-h-[194px] space-y-2 text-sm",
              )}
            >
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="inline-flex w-full items-start gap-2"
                >
                  <Check
                    className={cn(
                      "mt-0.5 shrink-0",
                      compact ? "h-3.5 w-3.5" : "h-4 w-4",
                      theme.check,
                    )}
                  />
                  <span>{feature}</span>
                </li>
              ))}
              {plan.features.length === 0 && (
                <li className="text-sm text-white/60">
                  جزئیات ویژگی‌ها به‌زودی اعلام می‌شود.
                </li>
              )}
            </ul>

            <p
              className={cn(
                "border-t border-white/10 leading-5 text-white/60",
                compact
                  ? "mt-0.5 line-clamp-2 pt-2 text-[11px]"
                  : "mt-1 min-h-[64px] pt-3 text-xs md:text-sm",
              )}
            >
              {plan.footerText}
            </p>

            <div className={cn("mt-auto", compact ? "pt-2" : "pt-4")}>
              <Button
                type="button"
                onClick={() => openConfirm(plan)}
                disabled={
                  plan.comingSoon || (isLoggedIn && pendingPlanId === plan.id)
                }
                className={cn(
                  "w-full font-semibold",
                  plan.comingSoon
                    ? "cursor-not-allowed border border-white/15 bg-white/10 text-white/70 opacity-80 hover:bg-white/10"
                    : `cursor-pointer ${theme.button}`,
                  compact
                    ? "h-11 rounded-2xl text-sm"
                    : "h-12 rounded-3xl text-base",
                )}
              >
                <span className="relative z-10">
                  {plan.comingSoon
                    ? "بزودی"
                    : !isLoggedIn
                      ? "ورود به اکانت"
                      : pendingPlanId === plan.id
                        ? "در حال انتقال..."
                        : plan.ctaText || "فعال‌سازی اشتراک"}
                </span>
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={
        showHeader
          ? "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16"
          : "w-full py-0"
      }
      id="plans"
    >
      {showHeader && (
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-[#A87FF3]/20 bg-[#A87FF3]/10 px-4 py-2 text-sm font-bold tracking-wider text-[#A87FF3]">
            پلن‌های اشتراک طلا
          </span>
          <h2 className="mt-4 mb-6 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            تخصص ما <span className="text-[#EAB308]">فقط طلاست.</span>
            <br className="hidden md:block" /> تمرکز کامل روی یک بازار = دقت
            بالاتر
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60 md:text-xl">
            برای تریدرهایی که دنبال سیگنال‌های دقیق، مطمئن و فیلتر شده از بازار
            طلا هستند.
          </p>
        </div>
      )}

      <div
        className={cn(
          "relative w-full transition-all duration-300",
          showHeader
            ? "mt-4 sm:mt-6 sm:rounded-3xl sm:border sm:border-[#542C85]/35 sm:bg-[#02000B]/70 py-2 sm:px-5 sm:py-8 lg:px-6 lg:py-10 sm:backdrop-blur-xl sm:shadow-[0_0_60px_rgba(84,44,133,0.2)] overflow-hidden"
            : "mt-0",
        )}
      >
        {showHeader && (
          <div className="pointer-events-none absolute inset-0 hidden sm:block bg-[radial-gradient(100%_70%_at_50%_0%,rgba(168,85,247,0.15)_0%,transparent_65%)]" />
        )}
        {isLoading ? (
          <div
            className={cn(
              "grid gap-4",
              onlyLiveSessions
                ? "mx-auto max-w-md grid-cols-1"
                : "grid-cols-1 md:grid-cols-3 md:gap-5",
            )}
          >
            {Array.from({ length: onlyLiveSessions ? 1 : 3 }).map((_, index) => (
              <Card
                key={`plans-skeleton-${index}`}
                className="relative flex h-[520px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-[#02000B]/50"
              >
                <CardContent className="flex flex-1 flex-col justify-between p-5">
                  <div className="flex h-full flex-1 flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <Skeleton className="h-7 w-3/4 bg-white/10" />
                      <Skeleton className="h-4 w-full bg-white/10" />
                    </div>
                    <Skeleton className="h-24 w-full rounded-2xl bg-white/10" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full bg-white/10" />
                      <Skeleton className="h-4 w-11/12 bg-white/10" />
                      <Skeleton className="h-4 w-10/12 bg-white/10" />
                    </div>
                    <Skeleton className="mt-auto h-11 w-full rounded-2xl bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center text-white/70">
            در حال حاضر پلن فعالی برای نمایش وجود ندارد.
          </div>
        ) : onlyLiveSessions ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            {desktopPlans.map((plan, index) => (
              <div key={plan.id}>{renderPlanCard(plan, index, true)}</div>
            ))}
          </div>
        ) : (
          <>
            {!showHeader && (
              <div className="group/slider relative w-full absolute inset-0 z-0 pointer-events-none" />
            )}
            <div
              className={cn("relative w-full", !showHeader && "group/slider")}
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
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
            `,
                }}
              />

              {showHeader && (
                <div className="relative z-20 mb-6 hidden items-center justify-end gap-3 md:flex">
                  <button
                    type="button"
                    className="plans-swiper-prev group cursor-pointer rounded-full border border-white/10 bg-white/5 p-3 text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/15"
                    aria-label="Previous Slide"
                  >
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <button
                    type="button"
                    className="plans-swiper-next group cursor-pointer rounded-full border border-white/10 bg-white/5 p-3 text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/15"
                    aria-label="Next Slide"
                  >
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                  </button>
                </div>
              )}

              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1.08}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={desktopPlans.length > 1}
                navigation={{
                  nextEl: ".plans-swiper-next",
                  prevEl: ".plans-swiper-prev",
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 18,
                  },
                }}
                initialSlide={0}
                speed={400}
                pagination={{ clickable: true }}
                className="plans-swiper"
                dir="rtl"
                style={{ direction: "rtl" }}
              >
                {desktopPlans.map((plan, index) => (
                  <SwiperSlide key={plan.id} className="!h-auto py-2">
                    {renderPlanCard(plan, index, !showHeader)}
                  </SwiperSlide>
                ))}
              </Swiper>

              {!showHeader && (
                <>
                  <button
                    type="button"
                    className="plans-swiper-prev absolute right-1 md:right-2 lg:right-3 top-[45%] z-20 -translate-y-1/2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-[#0b0518]/60 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md opacity-0 transition-all duration-300 group-hover/slider:opacity-100 hover:bg-[#0b0518]/90 hover:scale-110"
                    aria-label="Previous Slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    className="plans-swiper-next absolute left-1 md:left-2 lg:left-3 top-[45%] z-20 -translate-y-1/2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-[#0b0518]/60 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md opacity-0 transition-all duration-300 group-hover/slider:opacity-100 hover:bg-[#0b0518]/90 hover:scale-110"
                    aria-label="Next Slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
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
                {durationGroup?.isBundle
                  ? "تجربه پریمیوم باندل"
                  : durationGroup?.isMazaneh
                    ? "اشتراک مظنه"
                    : "تجربه پریمیوم انس"}
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <DialogTitle className="text-right text-[22px] md:text-[26px] font-black leading-tight tracking-tight text-white break-words">
                  {durationGroup?.displayName ?? "اشتراک انس جهانی"}
                </DialogTitle>
                <DialogDescription className="text-right text-[13px] md:text-[14px] leading-6 md:leading-7 text-white/60 md:max-w-2xl">
                  {durationGroup?.isBundle
                    ? "مدت دسترسی خود را انتخاب کنید. با خرید باندل به سیگنال‌های انس و مظنه با پوشش کامل دسترسی خواهید داشت."
                    : durationGroup?.isMazaneh
                      ? "مدت دسترسی خود را انتخاب کنید. هر پلن سیگنال‌های مظنه را با پوشش کامل ارائه می‌دهد."
                      : "مدت دسترسی خود را انتخاب کنید. هر پلن همان سیگنال‌های انس را با پوشش کامل ارائه می‌دهد."}
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
                      <p className="text-[11px] text-white/50 mb-1">
                        مبلغ پرداخت
                      </p>
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
              {pendingPlanId === selectedPlan?.id
                ? "در حال انتقال..."
                : "بله، خرید پلن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
