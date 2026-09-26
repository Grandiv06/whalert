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
  ChevronLeft,
  ChevronRight,
  Clock,
  Radio,
  Bot,
  ArrowLeft,
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
  originalPrice?: number | null;
  discountedPrice?: number | null;
  discountPercent?: number | null;
  features: string[];
  footerText: string;
  ctaText: string;
  isBundle?: boolean;
  comingSoon?: boolean;
  isPurchasable?: boolean;
  durationInDays?: number | null;
  marketFocus?: number | null;
  isOns?: boolean;
  isMazaneh?: boolean;
  isLive?: boolean;
  isTrial?: boolean;
  highlightTag?: string | null;
  themeColor?: string | null;
  displayOrder?: number;
  isHighlighted?: boolean;
  maxDailySignals?: number | null;
  includesAiBots?: boolean;
  includesHumanAnalyst?: boolean;
  supportsAdvancedFilters?: boolean;
  includesLiveSessions?: boolean;
  description?: string | null;
  summaryText?: string | null;
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

function isComingSoonPlan(plan: SubscriptionPlanCatalogItemDto): boolean {
  return plan.isPurchasable === false;
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

const ONS_PLAN_DEFAULT_FEATURES = [
  "سیگنال‌های معاملاتی انس طلا (XAU/USD)",
  "نقطه ورود، حد سود و حد ضرر دقیق",
  "مدیریت معامله و ریسک به ریوارد اصولی",
  "پوشش سشن‌های معاملاتی لندن و نیویورک",
  "هشدارهای متنی ورود و خروج فوری",
  "تعداد سیگنال در روز: بالای ۶ عدد با وین‌ریت بالا",
  "پشتیبانی تمام وقت",
];

const MAZANEH_PLAN_DEFAULT_FEATURES = [
  "تحلیل و سیگنال مظنه",
  "نقاط ورود و خروج مشخص",
  "مدیریت ریسک متناسب با بازار داخلی",
  "پوشش نوسانات لحظه‌ای بازار طلا ایران",
  "تعداد سیگنال در روز: بالای ۵ عدد با وین‌ریت بالا",
  "پشتیبانی تمام وقت",
];

const LIVE_PLAN_DEFAULT_FOOTER =
  "مناسب برای تریدرهایی که می‌خواهند تجربه واقعی معامله‌گری حرفه‌ای را ببینند و یاد بگیرند.";

const LIVE_PLAN_DEFAULT_SUBTITLE = "ترید زنده، شفاف و بدون هیچ پنهان‌کاری";

function mapCatalogPlan(plan: SubscriptionPlanCatalogItemDto): GoldPlan {
  const isLive = isLiveCatalogPlan(plan);
  const isBundle = isBundleCatalogPlan(plan);
  const isOns = isOnsCatalogPlan(plan);
  const isMazaneh = isMazanehCatalogPlan(plan);
  const isPurchasable = plan.isPurchasable !== false;
  const isComingSoon = isComingSoonPlan(plan);
  const isTrial =
    plan.price === 0 ||
    Boolean(plan.trialDays && plan.trialDays > 0) ||
    (plan.name ?? "").toLowerCase().includes("trial");

  const apiFeatures =
    plan.features
      ?.filter((f) => f.isEnabled !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((f) => f.value)
      .filter((v): v is string => Boolean(v && v.trim().length > 0)) ?? [];

  const rawPrice = plan.price ?? 0;
  const rawDiscountedPrice =
    plan.discountedPrice !== null && plan.discountedPrice !== undefined
      ? plan.discountedPrice
      : rawPrice;
  const rawDiscountPercent = plan.discountPercent ?? 0;
  const hasDiscount = rawDiscountedPrice > 0 && rawDiscountedPrice < rawPrice;
  const calculatedPercent =
    hasDiscount && rawPrice > 0
      ? Math.round(((rawPrice - rawDiscountedPrice) / rawPrice) * 100)
      : 0;
  const discountPercent =
    rawDiscountPercent > 0 ? rawDiscountPercent : calculatedPercent;
  const effectivePrice = hasDiscount ? rawDiscountedPrice : rawPrice;

  // Build features: prioritize backend features, or synthesize from backend flags if features list is empty
  let finalFeatures = apiFeatures;
  if (finalFeatures.length === 0) {
    const syntheticFeatures: string[] = [];
    if (plan.durationInDays) {
      syntheticFeatures.push(
        `دسترسی کامل ${toPersianDigits(plan.durationInDays)} روزه`,
      );
    }
    if (isOns) {
      syntheticFeatures.push("سیگنال‌های اختصاصی انس جهانی طلا");
    }
    if (isMazaneh) {
      syntheticFeatures.push("سیگنال‌های تخصصی آبشده و مظنه طلا");
    }
    if (isBundle) {
      syntheticFeatures.push("پوشش همزمان طلای جهانی و مظنه داخلی");
    }
    if (isLive || plan.includesLiveSessions) {
      syntheticFeatures.push("دسترسی به جلسات لایو ترید");
    }
    if (plan.maxDailySignals) {
      syntheticFeatures.push(
        `تعداد سیگنال در روز: بالای ${toPersianDigits(plan.maxDailySignals)} عدد`,
      );
    }
    if (plan.includesAiBots) {
      syntheticFeatures.push("دسترسی به ربات اکسپرت متاتریدر EA");
    }
    if (plan.includesHumanAnalyst) {
      syntheticFeatures.push("تحلیل اختصاصی توسط تحلیل‌گران ارشد");
    }
    if (plan.supportsAdvancedFilters) {
      syntheticFeatures.push("امکان فیلترهای پیشرفته تحلیلی");
    }
    if (syntheticFeatures.length > 0) {
      finalFeatures = syntheticFeatures;
    } else {
      finalFeatures = isLive
        ? LIVE_PLAN_DEFAULT_FEATURES
        : isOns
          ? ONS_PLAN_DEFAULT_FEATURES
          : isMazaneh
            ? MAZANEH_PLAN_DEFAULT_FEATURES
            : [];
    }
  }

  return {
    id: plan.id ?? 0,
    displayName: (plan.displayName ?? plan.name ?? "پلن اشتراک").trim(),
    subtitle:
      plan.subtitle?.trim() ||
      plan.description?.trim() ||
      plan.summaryText?.trim() ||
      (isLive ? LIVE_PLAN_DEFAULT_SUBTITLE : ""),
    description: plan.description?.trim() || null,
    summaryText: plan.summaryText?.trim() || null,
    monthlyPrice: effectivePrice,
    originalPrice: rawPrice,
    discountedPrice: rawDiscountedPrice,
    discountPercent: discountPercent,
    features: finalFeatures,
    footerText:
      plan.summaryText?.trim() ||
      plan.description?.trim() ||
      (isLive ? LIVE_PLAN_DEFAULT_FOOTER : ""),
    ctaText: (
      plan.callToActionText?.trim() ||
      (isTrial
        ? "شروع اشتراک رایگان"
        : isLive
          ? "فعال‌سازی اشتراک لایو ترید"
          : isBundle
            ? "فعال‌سازی باندل کامل"
            : "فعال‌سازی اشتراک")
    ),
    isBundle: isBundle,
    isLive: isLive,
    comingSoon: isComingSoon,
    isPurchasable: isPurchasable,
    durationInDays: plan.durationInDays,
    marketFocus: plan.marketFocus,
    isOns: isOns,
    isMazaneh: isMazaneh,
    isTrial: isTrial,
    highlightTag: plan.highlightTag?.trim() || null,
    themeColor: plan.themeColor?.trim() || null,
    displayOrder: plan.displayOrder ?? 0,
    isHighlighted: Boolean(plan.isHighlighted),
    maxDailySignals: plan.maxDailySignals,
    includesAiBots: plan.includesAiBots,
    includesHumanAnalyst: plan.includesHumanAnalyst,
    supportsAdvancedFilters: plan.supportsAdvancedFilters,
    includesLiveSessions: plan.includesLiveSessions,
  };
}

function isLiveCatalogPlan(plan: SubscriptionPlanCatalogItemDto): boolean {
  if (plan.includesLiveSessions === true) return true;
  const name = (plan.name ?? "").toLowerCase();
  const displayName = plan.displayName ?? "";
  return name.includes("live") || displayName.includes("لایو");
}

function groupCatalogPlans(plans: GoldPlan[]): GoldPlan[] {
  const trialPlans: GoldPlan[] = [];
  const onsPlans: GoldPlan[] = [];
  const mazanehPlans: GoldPlan[] = [];
  const bundlePlans: GoldPlan[] = [];
  const livePlans: GoldPlan[] = [];
  const otherPlans: GoldPlan[] = [];

  for (const plan of plans) {
    if (plan.isTrial) {
      trialPlans.push(plan);
    } else if (plan.isBundle) {
      bundlePlans.push(plan);
    } else if (plan.isOns) {
      onsPlans.push(plan);
    } else if (plan.isMazaneh) {
      mazanehPlans.push(plan);
    } else if (plan.isLive) {
      livePlans.push(plan);
    } else {
      otherPlans.push(plan);
    }
  }

  const result: GoldPlan[] = [];

  const createGroupCard = (groupList: GoldPlan[], defaultTitle: string): GoldPlan => {
    const sorted = [...groupList].sort(
      (a, b) => (a.durationInDays ?? 0) - (b.durationInDays ?? 0),
    );

    const primary =
      sorted.find((p) => p.durationInDays === 30) ?? sorted[sorted.length - 1];

    if (sorted.length <= 1) {
      return primary;
    }

    return {
      ...primary,
      displayName: defaultTitle,
      hasDurationChoices: true,
      variants: sorted,
    };
  };

  // 1. Trial
  result.push(...trialPlans);

  // 2. Ons
  if (onsPlans.length > 0) {
    result.push(createGroupCard(onsPlans, "اشتراک انس جهانی"));
  }

  // 3. Mazaneh
  if (mazanehPlans.length > 0) {
    result.push(createGroupCard(mazanehPlans, "اشتراک مظنه"));
  }

  // 4. Bundle
  if (bundlePlans.length > 0) {
    result.push(createGroupCard(bundlePlans, "باندل ویژه انس + مظنه"));
  }

  // 5. Live
  if (livePlans.length > 0) {
    result.push(createGroupCard(livePlans, "دسترسی به لایو"));
  }

  // 6. Others
  result.push(...otherPlans);

  return result;
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
  const [selectedDurationId, setSelectedDurationId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()));
  }, []);

  useEffect(() => {
    if (durationOpen || confirmOpen) {
      document.body.classList.add("hide-raychat");
      return () => {
        document.body.classList.remove("hide-raychat");
      };
    }
  }, [durationOpen, confirmOpen]);

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

  const catalogPlans = scopedPlansFromApi
    .map(mapCatalogPlan)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const plans = onlyLiveSessions
    ? catalogPlans.filter((plan) => plan.isLive)
    : catalogPlans;

  const allPurchaseablePlans = catalogPlans.filter(
    (plan) => plan.isPurchasable !== false && !plan.comingSoon,
  );

  const desktopPlans = onlyLiveSessions ? plans : groupCatalogPlans(plans);

  const handlePurchase = async (planId: number) => {
    if (planId === -1) {
      router.push("/auth/sign-in?redirect=/#plans");
      return;
    }
    if (!planId) return;
    const plan = allPurchaseablePlans.find((item) => item.id === planId);
    if (!plan || plan.isPurchasable === false || plan.comingSoon) return;
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
    if (plan.isPurchasable === false || plan.comingSoon) return;

    if (plan.hasDurationChoices && (plan.variants?.length ?? 0) > 1) {
      const purchasableVariants = (plan.variants ?? []).filter(
        (item) => item.isPurchasable !== false && !item.comingSoon,
      );
      const preferred =
        purchasableVariants.find((item) => item.durationInDays === 30) ??
        purchasableVariants[0] ??
        plan.variants?.[0] ??
        null;
      setDurationGroup(plan);
      setSelectedDurationId(preferred?.id ?? null);
      setDurationOpen(true);
      return;
    }

    if (!isLoggedIn) {
      const redirectUrl = showHeader ? "/#plans" : "/dashboard/subscription";
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    setSelectedPlan(plan);
    setConfirmOpen(true);
  };

  const selectedDurationVariant =
    durationGroup?.variants?.find((item) => item.id === selectedDurationId) ??
    durationGroup?.variants?.[0] ??
    null;

  const handleDurationPurchase = async () => {
    const variant = selectedDurationVariant;
    if (!variant?.id) return;

    if (!isLoggedIn) {
      setDurationOpen(false);
      const redirectUrl = showHeader ? "/#plans" : "/dashboard/subscription";
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    await handlePurchase(variant.id);
    setDurationOpen(false);
    onPurchaseSuccess?.();
  };

  const confirmPurchase = async () => {
    if (!selectedPlan?.id) return;
    await handlePurchase(selectedPlan.id);
    setConfirmOpen(false);
    onPurchaseSuccess?.();
  };

  const getPlanTheme = (plan: GoldPlan, index: number) => {
    const isBundle = !!plan.isBundle;
    const isTrial = !!plan.isTrial;

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

    if (isTrial) {
      return {
        border: "border-indigo-400/60",
        fill: "bg-gradient-to-br from-indigo-500/20 via-[#3B216A]/40 to-[#02000B]/80",
        glow: "bg-indigo-400/20",
        priceBox: "border-indigo-400/30 bg-indigo-400/[0.1]",
        check: "text-indigo-300",
        button:
          "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-600/25",
        priceText: "text-white",
        accentShadow:
          "lg:z-10 shadow-[0_0_40px_-12px_rgba(99,102,241,0.35)]",
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
          "relative flex flex-col flex-1 h-full w-full min-h-[500px] sm:min-h-[580px] md:min-h-[690px]",
          theme.accentShadow,
          compact
            ? "shadow-[0_12px_36px_-18px_rgba(7,2,20,0.7)]"
            : "shadow-none md:shadow-[0_16px_40px_rgba(7,2,20,0.45)] hover:md:shadow-[0_20px_52px_rgba(11,4,28,0.55)]",
        )}
      >
        <div
          className={cn(
            "relative flex flex-col flex-1 h-full w-full overflow-hidden border transition-[border-color] duration-300 group",
            "bg-[#02000B] isolate",
            radius,
            safariClip,
            theme.border,
            compact && "text-white",
          )}
          style={
            plan.themeColor
              ? { borderColor: `${plan.themeColor}55` }
              : undefined
          }
        >
          <div
            aria-hidden
            className={cn("pointer-events-none absolute inset-0", theme.fill)}
          >
            <div
              className={`absolute -top-20 -right-20 h-44 w-44 rounded-full blur-3xl ${theme.glow}`}
              style={
                plan.themeColor
                  ? { backgroundColor: plan.themeColor, opacity: 0.18 }
                  : undefined
              }
            />
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-white/25 to-transparent" />
          </div>

          {plan.highlightTag ? (
            <div
              className={cn(
                "absolute z-20 inline-flex items-center gap-1 rounded-full border border-amber-300/50 bg-amber-500/25 font-bold text-amber-200 backdrop-blur-sm shadow-md shadow-amber-950/40",
                compact
                  ? "left-3 top-3 px-2.5 py-1 text-[10px]"
                  : "left-3 top-3 px-3 py-1.5 text-[11px]",
              )}
            >
              <Sparkles className="h-3 w-3 text-amber-300" />
              {plan.highlightTag}
            </div>
          ) : plan.isHighlighted ? (
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
          ) : plan.hasDurationChoices ? (
            <div
              className={cn(
                "absolute z-20 inline-flex items-center gap-1 rounded-full border border-amber-300/35 bg-amber-400/15 font-semibold text-amber-200 backdrop-blur-sm",
                compact
                  ? "left-3 top-3 px-2.5 py-0.5 text-[10px]"
                  : "left-3 top-3 px-3 py-1 text-[11px]",
              )}
            >
              <Clock className="h-3 w-3 text-amber-300" />
              دوره‌های ۷، ۱۴ و ۳۰ روزه
            </div>
          ) : plan.durationInDays ? (
            <div
              className={cn(
                "absolute z-20 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 font-semibold text-white/85 backdrop-blur-sm",
                compact
                  ? "left-3 top-3 px-2.5 py-0.5 text-[10px]"
                  : "left-3 top-3 px-3 py-1 text-[11px]",
              )}
            >
              <Clock className="h-3 w-3 text-amber-300/80" />
              {toPersianDigits(plan.durationInDays)} روزه
            </div>
          ) : null}

          {Boolean(plan.discountPercent && plan.discountPercent > 0) && (
            <div
              className={cn(
                "absolute z-20 inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-gradient-to-r from-rose-500/25 to-pink-500/20 font-bold text-rose-200 backdrop-blur-sm shadow-md shadow-rose-950/40",
                compact
                  ? "right-3 top-3 px-2 py-0.5 text-[10px]"
                  : "right-3 top-3 px-2.5 py-1 text-[11px]",
              )}
            >
              <Sparkles className="h-3 w-3 text-rose-300" />
              {toPersianDigits(plan.discountPercent ?? 0)}٪ تخفیف
            </div>
          )}

          <div
            className={cn(
              "relative z-10 flex h-full flex-1 flex-col justify-between",
              compact ? "px-4 pb-5 sm:px-5 sm:pb-6" : "px-4 sm:px-5 pb-6 md:px-6 md:pb-8",
              compact ? "pt-12 sm:pt-14" : "pt-12 sm:pt-14 md:pt-16"
            )}
          >
          <div
            className={cn(
              "flex h-full min-h-0 flex-1 flex-col",
              compact ? "gap-4" : "gap-5 md:gap-6",
            )}
          >
            <div className={compact ? "min-h-[4rem]" : "min-h-[5rem]"}>
              <h3
                className={cn(
                  "font-extrabold leading-8 text-white",
                  compact ? "text-[16px] sm:text-[17px]" : "text-xl",
                )}
              >
                {plan.displayName}
              </h3>
              {plan.subtitle ? (
                <p
                  className={cn(
                    "mt-1.5 leading-6 text-white/70",
                    compact
                      ? "line-clamp-2 text-[12px]"
                      : "text-sm",
                  )}
                >
                  {plan.subtitle}
                </p>
              ) : null}
            </div>

            <div
              className={cn(
                "border flex flex-col justify-center",
                theme.priceBox,
                compact ? "rounded-2xl p-3 min-h-[115px]" : "rounded-3xl p-4 md:p-5 min-h-[135px]",
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
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-white/55">قیمت اشتراک</p>
                    {Boolean(plan.discountPercent && plan.discountPercent > 0) && (
                      <span className="inline-flex items-center rounded-full border border-rose-400/40 bg-rose-500/20 px-2 py-0.5 text-[10px] font-black text-rose-300">
                        {toPersianDigits(plan.discountPercent ?? 0)}٪ تخفیف
                      </span>
                    )}
                  </div>

                  {Boolean(plan.originalPrice && plan.monthlyPrice < plan.originalPrice) && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs sm:text-sm text-white/40 line-through decoration-rose-400/60 decoration-1 font-medium">
                        {formatMoney(plan.originalPrice)}
                      </span>
                    </div>
                  )}

                  <p
                    className={cn(
                      "font-black leading-none text-white",
                      compact
                        ? "text-[22px] sm:text-[26px]"
                        : "text-3xl md:text-4xl",
                      isBundle && "text-amber-100",
                      Boolean(plan.originalPrice && plan.monthlyPrice < plan.originalPrice) && "text-emerald-300",
                    )}
                  >
                    {plan.isTrial ? "رایگان" : formatMoney(plan.monthlyPrice)}
                  </p>
                  <p className="mt-1.5 text-xs text-white/60">
                    {plan.hasDurationChoices
                      ? "دوره‌های ماهانه · دو هفته‌ای · هفتگی"
                      : plan.durationInDays
                        ? getPaymentPeriodLabel(plan.durationInDays)
                        : "پرداخت دوره‌ای"}
                  </p>
                </>
              )}
            </div>

            <ul
              className={cn(
                "flex-1 text-white/85",
                compact
                  ? "space-y-2 text-[12px] leading-5"
                  : "space-y-2.5 text-sm",
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

            <div
              className={cn(
                "border-t border-white/10 flex items-center",
                compact ? "mt-1 pt-2 min-h-[46px]" : "mt-2 pt-3 min-h-[64px]",
              )}
            >
              {plan.footerText ? (
                <p className="leading-5 text-white/60 text-xs md:text-sm">
                  {plan.footerText}
                </p>
              ) : null}
            </div>

            <div className={cn("mt-auto", compact ? "pt-3" : "pt-4 md:pt-6")}>
              <Button
                type="button"
                onClick={() => openConfirm(plan)}
                disabled={
                  plan.isPurchasable === false ||
                  plan.comingSoon ||
                  (isLoggedIn && pendingPlanId === plan.id)
                }
                className={cn(
                  "w-full font-semibold transition-all duration-200",
                  plan.isPurchasable === false || plan.comingSoon
                    ? "cursor-not-allowed border border-white/15 bg-white/10 text-white/70 opacity-80 hover:bg-white/10"
                    : `cursor-pointer ${theme.button}`,
                  compact
                    ? "h-11 rounded-2xl text-[13px]"
                    : "h-13 rounded-3xl text-sm md:text-base py-3.5",
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {plan.isPurchasable === false || plan.comingSoon ? (
                    "بزودی"
                  ) : !isLoggedIn ? (
                    "ورود به اکانت"
                  ) : pendingPlanId === plan.id ? (
                    "در حال انتقال..."
                  ) : (
                    plan.ctaText || "فعال‌سازی اشتراک"
                  )}
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
                margin: 14px auto 8px auto !important;
                line-height: 0;
                text-align: center;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 6px !important;
              }
              .plans-swiper .swiper-pagination-bullet {
                margin: 0 !important;
              }
              @media (min-width: 640px) {
                .plans-swiper .swiper-pagination {
                  margin: 20px auto 10px auto !important;
                }
              }
              .plans-swiper .swiper-wrapper {
                align-items: stretch !important;
                display: flex !important;
              }
              .plans-swiper .swiper-slide {
                height: auto !important;
                display: flex !important;
                flex-direction: column !important;
              }
              .plans-swiper .swiper-slide > div {
                height: 100% !important;
                min-height: 640px !important;
                flex: 1 1 0% !important;
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
              }
              @media (max-width: 768px) {
                .plans-swiper .swiper-slide > div {
                  min-height: 520px !important;
                }
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
                spaceBetween={12}
                slidesPerView={1}
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
                    slidesPerView: 1.15,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 1.5,
                    spaceBetween: 18,
                  },
                  1024: {
                    slidesPerView: 2.1,
                    spaceBetween: 20,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 22,
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
                  <SwiperSlide key={plan.id} className="!h-auto !flex !flex-col py-2">
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

      {/* Modal انتخاب دوره زمانی برای پلن‌های دارای چند دوره (هفتگی، دو هفته‌ای، ماهانه) */}
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
          overlayClassName="z-[70]"
          className="z-[70] box-border w-[calc(100vw-1.5rem)] max-w-2xl max-h-[min(92dvh,850px)] flex flex-col gap-0 overflow-hidden border border-[#B57CFF]/25 bg-[#0b0518] bg-[radial-gradient(120%_120%_at_100%_0%,rgba(168,127,243,0.22)_0%,rgba(17,5,34,0.98)_45%,rgba(8,2,20,0.99)_100%)] p-0 text-white shadow-[0_32px_120px_-20px_rgba(93,49,160,0.6)] sm:rounded-3xl"
          dir="rtl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_100%_0%,rgba(232,200,120,0.14)_0%,transparent_55%),radial-gradient(80%_60%_at_0%_100%,rgba(93,49,160,0.30)_0%,transparent_55%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#E8C878]/70 to-transparent" />
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative flex-1 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar">
            <div className="relative px-5 pt-6 pb-3 sm:px-7 sm:pt-7 sm:pb-4">
              <DialogHeader className="space-y-2 text-right pe-6 sm:space-y-2.5">
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#E8C878]/35 bg-[#E8C878]/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#F3D98A]">
                  <Clock className="h-3.5 w-3.5" />
                  انتخاب دوره اشتراک
                </div>
                <div className="space-y-1.5">
                  <DialogTitle className="text-right text-xl sm:text-2xl font-black leading-tight tracking-tight text-white break-words">
                    {`انتخاب مدت زمان ${durationGroup?.displayName ?? "اشتراک"}`}
                  </DialogTitle>
                  <DialogDescription className="text-right text-xs sm:text-sm leading-6 text-white/65">
                    مدت زمان مورد نظر خود را برای فعال‌سازی اشتراک انتخاب کنید. تمام دوره‌ها دارای دسترسی کامل و یکسان به سیگنال‌ها می‌باشند.
                  </DialogDescription>
                </div>
              </DialogHeader>
            </div>

            <div className="relative grid w-full min-w-0 grid-cols-1 gap-3 px-5 pb-4 sm:grid-cols-3 sm:px-7">
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
                    className={cn(
                      "group relative w-full overflow-hidden rounded-2xl border text-right transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between gap-3",
                      isSelected
                        ? "border-amber-300/80 bg-gradient-to-b from-amber-400/20 via-[#2A1848]/90 to-[#120A22] shadow-[0_0_0_1px_rgba(232,200,120,0.35),0_12px_40px_-16px_rgba(232,200,120,0.5)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                            isSelected
                              ? "border-amber-300 bg-amber-400 text-black font-bold"
                              : "border-white/30 bg-transparent text-transparent",
                          )}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span className="font-extrabold text-white text-base">
                          {getDurationLabel(variant.durationInDays)}
                        </span>
                      </div>
                      {isRecommended ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                          <Sparkles className="h-3 w-3 text-amber-300" />
                          ویژه
                        </span>
                      ) : null}
                    </div>

                    {variant.durationInDays ? (
                      <span className="w-fit rounded-md border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] text-white/70">
                        {toPersianDigits(variant.durationInDays)} روز دسترسی
                      </span>
                    ) : null}

                    <div
                      className={cn(
                        "w-full rounded-xl border p-2.5 transition-colors duration-200",
                        isSelected
                          ? "border-amber-300/30 bg-amber-400/10"
                          : "border-white/10 bg-black/25",
                      )}
                    >
                      <p className="text-[11px] text-white/50 mb-0.5">مبلغ پرداخت</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-black text-white">
                          {formatMoneyAmount(variant.monthlyPrice)}
                        </span>
                        <span className="text-xs font-semibold text-white/70">
                          تومان
                        </span>
                      </div>
                      {dailyLabel ? (
                        <p className="mt-1 text-[10px] sm:text-[11px] text-white/50">
                          {dailyLabel}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="relative mx-5 sm:mx-7 mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-white/60">اشتراک انتخابی:</span>
                <span className="text-sm font-bold text-white">
                  {`${durationGroup?.displayName ?? ""} — ${getDurationLabel(selectedDurationVariant?.durationInDays)} (${toPersianDigits(selectedDurationVariant?.durationInDays ?? 0)} روز)`}
                </span>
              </div>
              <div className="h-px w-full bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">مبلغ نهایی:</span>
                <span className="text-2xl font-black text-amber-200">
                  {formatMoney(selectedDurationVariant?.monthlyPrice)}
                </span>
              </div>
              <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-3 text-xs leading-6 text-purple-200/90">
                اگر در حال حاضر اشتراک فعالی داشته باشید، این خرید به عنوان رزرو ثبت شده و پس از پایان اشتراک فعلی آغاز خواهد شد.
              </div>
            </div>
          </div>

          <DialogFooter className="relative shrink-0 overflow-hidden border-t border-[#B57CFF]/20 bg-gradient-to-b from-[#1c0c38]/95 via-[#140728]/98 to-[#0f041e] px-5 py-4 sm:px-7 sm:py-4 backdrop-blur-xl shadow-[0_-16px_36px_-6px_rgba(80,35,140,0.35)] flex flex-col-reverse sm:flex-row sm:justify-start gap-2.5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C084FC]/60 to-transparent" />
            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-28 w-80 rounded-full bg-[#9D4EDD]/15 blur-2xl" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDurationOpen(false)}
              disabled={pendingPlanId === selectedDurationVariant?.id}
              className="h-12 w-full sm:flex-1 rounded-2xl border border-white/15 bg-white/[0.08] text-white hover:bg-white/[0.16] hover:border-white/25 font-bold cursor-pointer transition-all"
            >
              انصراف
            </Button>
            <Button
              type="button"
              onClick={handleDurationPurchase}
              disabled={!selectedDurationId || pendingPlanId === selectedDurationVariant?.id}
              className="h-12 w-full sm:flex-1 rounded-2xl border-0 bg-gradient-to-r from-[#6E3BC2] via-[#9D4EDD] to-[#B15CFF] text-white font-bold shadow-[0_10px_30px_rgba(168,127,243,0.45)] hover:brightness-110 cursor-pointer transition-all"
            >
              <span className="inline-flex items-center gap-2">
                {pendingPlanId === selectedDurationVariant?.id ? (
                  "در حال انتقال به درگاه..."
                ) : !isLoggedIn ? (
                  "ورود به اکانت و پرداخت"
                ) : (
                  <>
                    <span>تایید و پرداخت</span>
                    <ArrowLeft className="h-4 w-4" />
                  </>
                )}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal تایید نهایی برای پلن‌های تک‌دوره‌ای */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          overlayClassName="z-[70]"
          className="z-[70] max-w-md overflow-hidden bg-[radial-gradient(120%_120%_at_100%_0%,rgba(168,127,243,0.28)_0%,rgba(17,5,34,0.95)_45%,rgba(8,2,20,0.98)_100%)] border border-white/20 text-white shadow-[0_24px_90px_rgba(93,49,160,0.45)]"
        >
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
