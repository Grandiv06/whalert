"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Wallet,
  FileText,
  Clipboard,
  TrendingUp,
  Download,
  ZoomIn,
  X,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  PanelsTopLeft,
  ChevronLeft,
  Clock,
  RefreshCw,
  Settings,
  MoreHorizontal,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { cn, toEnglishDigits, toPersianDigits, deepMerge } from "@/lib/utils";
import { AISparkleLoader } from "@/components/ui/ai-sparkle-loader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LightweightChart,
  type ChartDataElement,
  type ChartSelectionMode,
  type ChartTimeframeOption,
} from "@/components/charts/lightweight-chart";
import { useDebounce } from "@/hooks/useDebounce";

type AbpWrapper<T> = { result?: T };

type LeaveModalRequest = { type: "navigate"; target: string } | { type: "back" };

type FetchDataFromImageFromUrlResultDto = {
  analysis?: {
    direction?: string | null;
    symbol?: string | null;
    timeframe?: string | null;
    entryPoint?: number | null;
    takeProfits?: Array<number | null> | null;
    stopLoss?: number | null;
    description?: string | null;
  };
  imageBase64?: string | null;
};

export type CreateSignalServices = {
  getDynamicPrice: (
    symbol: string,
    timeframe: string,
    fromIso?: string,
    toIso?: string,
  ) => PromiseLike<{
    response?:
      | Array<{
          open?: number;
          high?: number;
          low?: number;
          close?: number;
          openCandleTime?: number;
        } | null>
      | null;
  }>;
  fetchDataFromImageFromUrl: (
    payload: { url: string },
  ) => PromiseLike<
    | FetchDataFromImageFromUrlResultDto
    | AbpWrapper<FetchDataFromImageFromUrlResultDto>
  >;
  submitSignalFromImageAnalysis: (
    payload: FetchDataFromImageFromUrlResultDto,
  ) => PromiseLike<unknown>;
  submitSignalFromUserInput: (payload: {
    direction: "LONG" | "SHORT";
    symbol: string;
    entryPoint: number;
    stopLoss: number;
    takeProfits: number[];
    description?: string;
  }) => PromiseLike<unknown>;
};

export type CreateSignalConfig = {
  defaults?: {
    symbol?: string;
    timeframe?: string;
    side?: "LONG" | "SHORT";
    layoutMode?: "default" | "focus";
  };

  availableSymbols?: Array<{
    label: string;
    value: string;
    apiSymbol: string;
  }>;

  availableTimeframes?: Array<{
    label: string;
    value: string;
    fullLabel: string;
    stepSeconds: number;
    lookbackDays: number;
  }>;

  validation?: {
    minEntryPrice?: number;
    maxDescriptionLength?: number;

    maxDistanceFromEntryPercent?: {
      takeProfit?: number;
      stopLoss?: number;
    };

    requireTakeProfit?: boolean;
    requireStopLoss?: boolean;
    requireDescription?: boolean;
  };

  labels?: {
    titleAi?: string;
    titleManual?: string;
    subtitleAi?: string;
    subtitleManual?: string;
    newAnalysis?: string;
    modeManual?: string;
    modeAi?: string;
    symbol?: string;
    timeframe?: string;
    side?: string;
    long?: string;
    short?: string;
    entryPoint?: string;
    takeProfits?: string;
    stopLoss?: string;
    description?: string;
    descriptionPlaceholder?: string;
    descriptionTooltip?: string;
    addTarget?: string;
    noTargets?: string;
    submit?: string;
    submitting?: string;
    paste?: string;
    linkTitle?: string;
    linkPlaceholder?: string;
    linkHint?: string;
    processAi?: string;
    processingAi?: string;
    processingAiHint?: string;
    errorTitle?: string;
    retry?: string;
    saveChart?: string;
    zoomChart?: string;
    descriptionTitle?: string;
    descriptionAiPlaceholder?: string;
    targetsTitle?: string;
    entryTitle?: string;
    slTitle?: string;
    publishTitle?: string;
    publishing?: string;
    confirmTitle?: string;
    confirmDescription?: string;
    yes?: string;
    cancel?: string;
    confirmPositionChangeTitle?: string;
    confirmPositionChangeDescription?: string;
    confirmSymbolChangeTitle?: string;
    confirmSymbolChangeDescription?: string;
    manualModeLabel?: string;
    descriptionTooltipAriaLabel?: string;
    deleteTargetAriaLabel?: string;
    chartZoomAriaLabel?: string;
    layoutDefault?: string;
    layoutFocus?: string;
  };

  messages?: {
    invalidLinkPrefix?: string;
    invalidLinkIncomplete?: string;
    invalidLinkGeneral?: string;
    processingError?: string;
    requiredFieldsError?: string;
    setEntryFirst?: string;
    invalidTpLong?: string;
    invalidTpShort?: string;
    duplicateTp?: string;
    invalidSlLong?: string;
    invalidSlShort?: string;
    submitSuccessAi?: string;
    submitErrorAi?: string;
    submitSuccessManual?: string;
    submitErrorManual?: string;
    positionChangeTargetsRemoved?: string;
    positionChangeSlReset?: string;
    positionChangeValidSl?: string;
    positionChangeNoTargetsRemoved?: string;
    takeProfitTooFar?: string;
    stopLossTooFar?: string;
    descriptionRequired?: string;
    invalidEntryPrice?: string;
  };
};

type DeepRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends Array<infer U>
    ? Array<U>
    : NonNullable<T[K]> extends object
      ? DeepRequired<NonNullable<T[K]>>
      : NonNullable<T[K]>;
};

type ResolvedCreateSignalConfig = DeepRequired<CreateSignalConfig>;

const DEFAULT_CREATE_SIGNAL_CONFIG: ResolvedCreateSignalConfig = {
  defaults: {
    symbol: "مظنه طلا",
    timeframe: "15m",
    side: "LONG",
    layoutMode: "default",
  },

  availableSymbols: [
    { label: "مظنه", value: "مظنه طلا", apiSymbol: "MAZAANE" },
    { label: "انس", value: "انس", apiSymbol: "XAUUSD" },
  ],

  availableTimeframes: [
    {
      label: "5m",
      value: "5m",
      fullLabel: "5 Minutes",
      stepSeconds: 5 * 60,
      lookbackDays: 4,
    },
    {
      label: "15m",
      value: "15m",
      fullLabel: "15 Minutes",
      stepSeconds: 15 * 60,
      lookbackDays: 10,
    },
    {
      label: "1H",
      value: "1h",
      fullLabel: "1 Hour",
      stepSeconds: 60 * 60,
      lookbackDays: 30,
    },
    {
      label: "4H",
      value: "4h",
      fullLabel: "4 Hours",
      stepSeconds: 4 * 60 * 60,
      lookbackDays: 90,
    },
    {
      label: "1D",
      value: "1d",
      fullLabel: "1 Day",
      stepSeconds: 24 * 60 * 60,
      lookbackDays: 300,
    },
  ],

  validation: {
    minEntryPrice: 0,
    maxDescriptionLength: 1000,
    maxDistanceFromEntryPercent: {
      takeProfit: 100, // No limit by default in current code
      stopLoss: 100,
    },
    requireTakeProfit: true,
    requireStopLoss: true,
    requireDescription: false,
  },

  labels: {
    titleAi: "ایجاد سیگنال هوش مصنوعی",
    titleManual: "ایجاد سیگنال دستی",
    subtitleAi:
      "لینک تریدینگ‌ویو را وارد کنید تا هوش مصنوعی سیگنال را استخراج کند.",
    subtitleManual: "قبل از ارسال، سطوح حدسود و حد ضرر را با چارت بررسی کنید.",
    newAnalysis: "تحلیل جدید",
    modeManual: "دستی (چارت)",
    modeAi: "هوش مصنوعی (لینک)",
    symbol: "نماد",
    timeframe: "تایم‌فریم",
    side: "جهت معامله (Side)",
    long: "خرید (LONG)",
    short: "فروش (SHORT)",
    entryPoint: "نقطه ورود (Entry Point)",
    takeProfits: "حد سود (Take Profits)",
    stopLoss: "حد ضرر (Stop Loss)",
    description: "توضیحات تحلیل (اختیاری)",
    descriptionPlaceholder: "سناریو، نکات مدیریت ریسک...",
    descriptionTooltip:
      "این بخش برای ثبت نکات روان‌شناسی هر پوزیشن است؛ مثل کنترل هیجان، پایبندی به پلن و خطاهای رفتاری. با تکمیل این قسمت، بعدا می‌توانید برای هر سیگنال یادآور و نوتیف عملیاتی داشته باشید.",
    addTarget: "افزودن هدف",
    noTargets: "حد سودی تعریف نشده است.",
    submit: "ثبت نهایی سیگنال",
    submitting: "در حال ثبت سیگنال...",
    paste: "Paste from clipboard",
    linkTitle: "ورود لینک تحلیل",
    linkPlaceholder: "https://www.tradingview.com/chart/...",
    linkHint: "لینک عمومی (Public) چارت تریدینگ‌ویو خود را وارد کنید.",
    processAi: "شروع پردازش هوشمند",
    processingAi: "هوش مصنوعی درحال استخراج دیتا...",
    processingAiHint:
      "بررسی الگوهای کندل‌استیک، سطوح حمایت و مقاومت و شاخص‌های تکنیکال برای دریافت سیگنال",
    errorTitle: "خطا در پردازش",
    retry: "تلاش مجدد",
    saveChart: "ذخیره عکس",
    zoomChart: "بزرگنمایی",
    descriptionTitle: "توضیحات و تحلیل",
    descriptionAiPlaceholder:
      "توضیحات تکمیلی، دلایل ورود و مدیریت سرمایه...",
    targetsTitle: "اهداف قیمتی (TP)",
    entryTitle: "نقطه ورود (Entry)",
    slTitle: "حد ضرر (SL)",
    publishTitle: "تایید نهایی ثبت سیگنال",
    publishing: "در حال ثبت...",
    confirmTitle: "بله، ثبت کن",
    confirmDescription:
      "لطفاً جزئیات را بررسی کنید. پس از تایید، سیگنال به‌صورت رسمی ثبت می‌شود.",
    yes: "بله، ادامه",
    cancel: "انصراف",
    confirmPositionChangeTitle: "تغییر جهت معامله",
    confirmPositionChangeDescription:
      "قوانین TP و SL برعکس می‌شود. به همین دلیل مقادیر ناسازگار باید پاک یا بازنشانی شوند تا سیگنال نامعتبر ثبت نشود.",
    confirmSymbolChangeTitle: "تغییر نماد معاملاتی",
    confirmSymbolChangeDescription:
      "با تغییر نماد، سطوح ورود، حدسود و حدضرر فعلی پاک می‌شوند. آیا از ادامه مطمئن هستید؟",
    manualModeLabel: "حالت افزودن دستی",
    descriptionTooltipAriaLabel: "راهنمای توضیحات تحلیل",
    deleteTargetAriaLabel: "حذف هدف",
    chartZoomAriaLabel: "بزرگنمایی چارت",
    layoutDefault: "دیفالت",
    layoutFocus: "چارت عریض",
  },

  messages: {
    invalidLinkPrefix: "لینک باید با https://www.tradingview.com/chart/ شروع شود",
    invalidLinkIncomplete:
      "این آدرس ناقص است. لطفاً لینک کامل چارت را وارد کنید (بعد از chart/ باید آیدی چارت قرار بگیرد)",
    invalidLinkGeneral:
      "لینک وارد شده معتبر نیست. لطفاً لینک چارت را از tradingview.com کپی کنید.",
    processingError: "خطا در پردازش تصویر. لطفاً دوباره تلاش کنید.",
    requiredFieldsError: "برای انتشار سیگنال، Entry، TP و SL را کامل کنید.",
    setEntryFirst: "برای تعیین TP یا SL ابتدا Entry را مشخص کنید.",
    invalidTpLong: "برای پوزیشن لانگ، TP باید بالاتر از Entry باشد.",
    invalidTpShort: "برای پوزیشن شورت، TP باید پایین‌تر از Entry باشد.",
    duplicateTp: "این مقدار TP قبلاً ثبت شده است.",
    invalidSlLong: "برای پوزیشن لانگ، SL باید پایین‌تر از Entry باشد.",
    invalidSlShort: "برای پوزیشن شورت، SL باید بالاتر از Entry باشد.",
    submitSuccessAi: "سیگنال با موفقیت ثبت شد.",
    submitErrorAi: "خطا در انتشار سیگنال. لطفاً دوباره تلاش کنید.",
    submitSuccessManual: "سیگنال دستی با موفقیت ثبت شد.",
    submitErrorManual: "خطا در انتشار سیگنال دستی.",
    positionChangeTargetsRemoved: "حد سود ناسازگار حذف می‌شود.",
    positionChangeSlReset: "حد ضرر فعلی هم بازنشانی می‌شود.",
    positionChangeValidSl: "حد ضرر فعلی معتبر است.",
    positionChangeNoTargetsRemoved: "حد سودها بدون تغییر باقی می‌مانند.",
    takeProfitTooFar: "Take profit is too far from the entry point.",
    stopLossTooFar: "Stop loss is too far from the entry point.",
    descriptionRequired: "Description is required.",
    invalidEntryPrice: "Entry point is not valid.",
  },
};

export type CreateSignalContentProps = {
  isDark?: boolean;
  pathname?: string;
  onAnalyzingChange?: (value: boolean) => void;
  onManualDirtyChange?: (value: boolean) => void;
  onLeaveModalRequest?: (request: LeaveModalRequest | null) => void;
  services: CreateSignalServices;
  config?: CreateSignalConfig;
};

type SignalData = {
  symbol: string;
  timeframe: string;
  position: "LONG" | "SHORT";
  entry: number;
  targets: number[];
  stopLoss: number;
  description: string;
  chartImage: string;
};

const DEFAULT_SIGNAL_DATA: SignalData = {
  symbol: "BTCUSDT",
  timeframe: "4H",
  position: "LONG",
  entry: 0,
  targets: [],
  stopLoss: 0,
  description: "",
  chartImage: "/images/chart_preview.png",
};

type Step = "input" | "analyzing" | "editing" | "error";
type ManualLayoutMode = "default" | "focus";
type ToastKind = "success" | "error";
type SignalToast = {
  id: number;
  kind: ToastKind;
  message: string;
};
type ManualPublishPreview = {
  symbol: string;
  timeframe: string;
  side: "LONG" | "SHORT";
  entry: number;
  stopLoss: number;
  takeProfits: number[];
  description?: string;
};
type PendingManualPositionChange = {
  nextPosition: "LONG" | "SHORT";
  removedTargetsCount: number;
  resetStopLoss: boolean;
};


const MANUAL_LAYOUT_OPTIONS: Array<{
  value: ManualLayoutMode;
  labelKey: keyof ResolvedCreateSignalConfig["labels"];
  icon: typeof LayoutGrid;
}> = [
  { value: "default", labelKey: "layoutDefault", icon: LayoutGrid },
  { value: "focus", labelKey: "layoutFocus", icon: PanelsTopLeft },
];

const DEFAULT_MANUAL_ENTRY_COLOR = "#38bdf8";
const DEFAULT_MANUAL_TP_COLOR = "#22c55e";
const DEFAULT_MANUAL_SL_COLOR = "#ef4444";
const MANUAL_SECTION_ANIMATION_MS = 320;


const normalizeUnixSeconds = (rawTime?: number) => {
  if (
    typeof rawTime !== "number" ||
    !Number.isFinite(rawTime) ||
    rawTime <= 0
  ) {
    return null;
  }
  const inSeconds =
    rawTime > 1_000_000_000_000
      ? Math.floor(rawTime / 1000)
      : Math.floor(rawTime);
  return inSeconds;
};

const normalizeApiCandles = (
  rawCandles?: Array<{
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    openCandleTime?: number;
  } | null> | null,
): ChartDataElement[] => {
  if (!rawCandles?.length) return [];
  const normalized: ChartDataElement[] = [];

  for (const candle of rawCandles) {
    if (!candle) continue;
    const open = candle.open;
    const high = candle.high;
    const low = candle.low;
    const close = candle.close;
    const time = normalizeUnixSeconds(candle.openCandleTime);
    if (
      typeof open !== "number" ||
      typeof high !== "number" ||
      typeof low !== "number" ||
      typeof close !== "number" ||
      !Number.isFinite(open) ||
      !Number.isFinite(high) ||
      !Number.isFinite(low) ||
      !Number.isFinite(close) ||
      !time
    ) {
      continue;
    }
    normalized.push({
      time: time as ChartDataElement["time"],
      open,
      high,
      low,
      close,
    });
  }

  return normalized.sort((a, b) => Number(a.time) - Number(b.time));
};

const buildDemoChartData = (
  symbol: string,
  timeframe: string,
  availableTimeframes: CreateSignalConfig["availableTimeframes"],
  availableSymbols: CreateSignalConfig["availableSymbols"],
): ChartDataElement[] => {
  const tf = availableTimeframes?.find((t) => t.value === timeframe);
  const stepSeconds = tf?.stepSeconds ?? 900;
  const pointsCount = timeframe === "1d" ? 260 : timeframe === "4h" ? 320 : 420;

  const symbolLabel = availableSymbols?.find((s) => s.value === symbol)?.label;
  const baseStart = symbolLabel === "مظنه" ? 4800 : 2300;
  const volatility = symbolLabel === "مظنه" ? 42 : 24;

  let currentBase = baseStart;
  let timestamp = Math.floor(Date.now() / 1000) - pointsCount * stepSeconds;
  const demo: ChartDataElement[] = [];

  for (let i = 0; i < pointsCount; i++) {
    const trend = Math.sin(i / 14) * volatility * 0.3;
    const noise = (Math.random() - 0.5) * volatility;
    const open = currentBase + trend + noise;
    const close = open + (Math.random() - 0.48) * volatility * 1.1;
    const high = Math.max(open, close) + Math.random() * volatility * 0.45;
    const low = Math.min(open, close) - Math.random() * volatility * 0.45;
    demo.push({
      time: timestamp as ChartDataElement["time"],
      open,
      high,
      low,
      close,
    });
    timestamp += stepSeconds;
    currentBase = close;
  }

  return demo;
};

const styles = {
  input:
    "bg-[#542C85]/20 hover:bg-[#542C85]/30 h-12 rounded-xl border-[#542C85]/30 text-white placeholder:text-white/50 focus-visible:ring-[#542C85] focus-visible:ring-1 focus-visible:border-[#542C85] transition-all duration-300",
  buttonPrimary:
    "bg-[#542C85] hover:bg-[#542C85]/90 text-white rounded-xl h-12 font-medium transition-all shadow-lg shadow-[#542C85]/20",
  buttonSecondary:
    "bg-[#542C85]/20 hover:bg-[#542C85]/40 text-white rounded-xl h-12 font-medium transition-all border border-[#542C85]/30",
  card: "bg-[#02000B]/30 border-[#542C85]/20 rounded-2xl shadow-sm backdrop-blur-sm",
  cardHeader: "border-b border-[#542C85]/10 pb-4",
  textMuted: "text-white/70",
};

const CHART_LINK_PREFIX = "https://www.tradingview.com/chart/";

const parseDisplayNumber = (s: string) => parseFloat(toEnglishDigits(s)) || 0;

const normalizeSelectedPrice = (rawPrice: number) => {
  if (!Number.isFinite(rawPrice) || rawPrice <= 0) return 0;
  const digits = rawPrice >= 1000 ? 2 : 4;
  return Number(rawPrice.toFixed(digits));
};

const sortTargetsByEntryDistance = ({
  targets,
  entry,
  side,
}: {
  targets: number[];
  entry: number;
  side: "LONG" | "SHORT";
}) => {
  const uniqueTargets = Array.from(
    new Set(targets.filter((target) => Number.isFinite(target) && target > 0)),
  );
  if (uniqueTargets.length <= 1) return uniqueTargets;
  if (!Number.isFinite(entry) || entry <= 0) return uniqueTargets;

  const directionalTargets =
    side === "LONG"
      ? uniqueTargets.filter((target) => target > entry).sort((a, b) => a - b)
      : uniqueTargets.filter((target) => target < entry).sort((a, b) => b - a);
  const nonDirectionalTargets = uniqueTargets
    .filter((target) => (side === "LONG" ? target <= entry : target >= entry))
    .sort((a, b) => Math.abs(a - entry) - Math.abs(b - entry));

  return [...directionalTargets, ...nonDirectionalTargets];
};

const getLevelValidationMessage = ({
  side,
  entry,
  stopLoss,
  targets,
  messages,
}: {
  side: "LONG" | "SHORT";
  entry: number;
  stopLoss: number;
  targets: number[];
  messages: ResolvedCreateSignalConfig["messages"];
}) => {
  if (!Number.isFinite(entry) || entry <= 0) return "";
  const validTargets = targets.filter(
    (target) => Number.isFinite(target) && target > 0,
  );
  if (side === "LONG") {
    if (validTargets.some((target) => target <= entry)) {
      return messages.invalidTpLong ?? "";
    }
    if (stopLoss > 0 && stopLoss >= entry) {
      return messages.invalidSlLong ?? "";
    }
    return "";
  }

  if (validTargets.some((target) => target >= entry)) {
    return messages.invalidTpShort ?? "";
  }
  if (stopLoss > 0 && stopLoss <= entry) {
    return messages.invalidSlShort ?? "";
  }
  return "";
};

export function CreateSignalContent({
  isDark = true,
  pathname = "/dashboard/create-signal",
  onAnalyzingChange,
  onManualDirtyChange,
  onLeaveModalRequest,
  services,
  config,
}: CreateSignalContentProps) {
  const mergedConfig = useMemo(
    () =>
      deepMerge(
        DEFAULT_CREATE_SIGNAL_CONFIG,
        config,
      ) as ResolvedCreateSignalConfig,
    [config],
  );

  const setAnalyzing = onAnalyzingChange ?? (() => {});
  const setManualDirty = onManualDirtyChange ?? (() => {});
  const setLeaveModalRequest = onLeaveModalRequest ?? (() => {});
  const [step, setStep] = useState<Step>("input");
  const [tradingViewLink, setTradingViewLink] = useState("");

  const createDefaultSignalData = (
    config: ResolvedCreateSignalConfig,
  ): SignalData => ({
    ...DEFAULT_SIGNAL_DATA,
    symbol: config.defaults.symbol,
    timeframe: config.defaults.timeframe,
    position: config.defaults.side,
  });

  const [signalData, setSignalData] = useState<SignalData>(() =>
    createDefaultSignalData(mergedConfig),
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [creationMode, setCreationMode] = useState<"ai" | "manual">("ai");
  const [manualSymbol, setManualSymbol] = useState<string>(mergedConfig.defaults.symbol);
  const [pendingManualSymbol, setPendingManualSymbol] =
    useState<string | null>(null);
  const [isSymbolChangeConfirmOpen, setIsSymbolChangeConfirmOpen] =
    useState(false);
  const [manualLayoutMode, setManualLayoutMode] =
    useState<ManualLayoutMode>(mergedConfig.defaults.layoutMode);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [manualTimeframe, setManualTimeframe] =
    useState<string>(mergedConfig.defaults.timeframe);
  const [manualChartData, setManualChartData] = useState<ChartDataElement[]>(
    [],
  );
  const [isManualChartLoading, setIsManualChartLoading] = useState(false);
  const [manualChartSelectionMode, setManualChartSelectionMode] =
    useState<ChartSelectionMode | null>(null);
  const [selectedManualTpIndex, setSelectedManualTpIndex] = useState<
    number | null
  >(null);
  const [manualChartAlert, setManualChartAlert] = useState<string>("");
  const manualEntryColor = DEFAULT_MANUAL_ENTRY_COLOR;
  const manualTpColor = DEFAULT_MANUAL_TP_COLOR;
  const manualSlColor = DEFAULT_MANUAL_SL_COLOR;

  const [entryPointDisplay, setEntryPointDisplay] = useState<string>("0");
  const [targetsDisplay, setTargetsDisplay] = useState<string[]>([]);
  const targetInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [stopLossDisplay, setStopLossDisplay] = useState<string>("0");
  const [description, setDescription] = useState("");
  const [isChartZoomed, setIsChartZoomed] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string>("");
  const [isManualPublishConfirmOpen, setIsManualPublishConfirmOpen] =
    useState(false);
  const [manualPublishPreview, setManualPublishPreview] =
    useState<ManualPublishPreview | null>(null);
  const [isManualSectionMounted, setIsManualSectionMounted] = useState(false);
  const [isManualSectionVisible, setIsManualSectionVisible] = useState(false);
  const [pendingManualPositionChange, setPendingManualPositionChange] =
    useState<PendingManualPositionChange | null>(null);
  const [
    isManualPositionChangeConfirmOpen,
    setIsManualPositionChangeConfirmOpen,
  ] = useState(false);
  const [toasts, setToasts] = useState<SignalToast[]>([]);
  const [isTimeframeSheetOpen, setIsTimeframeSheetOpen] = useState(false);
  const [isMoreToolsSheetOpen, setIsMoreToolsSheetOpen] = useState(false);
  const [fitContentTrigger, setFitContentTrigger] = useState(0);

  // Auto-focus new target input when added
  useEffect(() => {
    const lastIndex = targetsDisplay.length - 1;
    if (lastIndex >= 0) {
      const lastInput = targetInputRefs.current[lastIndex];
      // Only focus if the value is empty (implies it was just added)
      if (lastInput && targetsDisplay[lastIndex] === "") {
        const timer = setTimeout(() => {
          lastInput.focus();
          lastInput.select();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [targetsDisplay.length]);

  const pushToast = (message: string, kind: ToastKind) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, kind, message }].slice(-4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const cleanNumericString = (val: string) => {
    const converted = val
      .replace(/[۰-۹]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 1584));

    let clean = converted.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts.slice(1).join("");
    }
    return clean;
  };

  const clearZeroValueOnFocus = (
    value: string,
    setter: (next: string) => void,
  ) => {
    const normalized = cleanNumericString(value);
    if (/^0+(\.0+)?$/.test(normalized)) {
      setter("");
    }
  };

  const DESCRIPTION_MAX_LENGTH = mergedConfig.validation.maxDescriptionLength;

  const normalizeDescription = (value: string) =>
    value.slice(0, DESCRIPTION_MAX_LENGTH);
  const descriptionLength = description.length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
    };
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (isMobileViewport && manualLayoutMode !== "default") {
      setManualLayoutMode("default");
    }
  }, [isMobileViewport, manualLayoutMode]);

  const getLinkErrorMessage = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (!trimmed.startsWith(CHART_LINK_PREFIX)) {
      return mergedConfig.messages.invalidLinkPrefix;
    }
    try {
      const parsed = new URL(trimmed);
      const path = parsed.pathname.replace(/\/+$/, "") || "/";
      const segments = path.split("/").filter(Boolean);
      if (segments[0] !== "chart" || segments.length < 2) {
        return mergedConfig.messages.invalidLinkIncomplete;
      }
    } catch {
      // fallthrough
    }
    return mergedConfig.messages.invalidLinkGeneral;
  };

  const isValidTradingViewLink = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return false;
    try {
      if (!trimmed.startsWith(CHART_LINK_PREFIX)) return false;
      const parsed = new URL(trimmed);
      const path = parsed.pathname.replace(/\/+$/, "") || "/";
      const segments = path.split("/").filter(Boolean);
      if (segments[0] !== "chart" || segments.length < 2) return false;
      return true;
    } catch {
      return false;
    }
  };

  const trimmedLink = tradingViewLink.trim();
  const isLinkValid = isValidTradingViewLink(trimmedLink);
  const displayLinkError =
    trimmedLink && !isLinkValid ? getLinkErrorMessage(trimmedLink) : "";
  const manualTimeframeOption = mergedConfig.availableTimeframes.find(
    (option) => option.value === manualTimeframe,
  );
  const manualTimeframeText = manualTimeframeOption?.fullLabel ?? manualTimeframe;
  const manualApiSymbol =
    mergedConfig.availableSymbols.find((s) => s.value === manualSymbol)
      ?.apiSymbol ?? manualSymbol;
  const manualChartTimeframeOptions: ChartTimeframeOption[] =
    mergedConfig.availableTimeframes.map((timeframeOption) => ({
      value: timeframeOption.value,
      label: timeframeOption.label,
    }));

  const fetchChartData = async (cancelledRef?: { current: boolean }) => {
    setIsManualChartLoading(true);
    setManualChartAlert("");

    try {
      const response = await services.getDynamicPrice(
        manualApiSymbol,
        manualTimeframe,
        undefined,
        undefined,
      );
      const normalized = normalizeApiCandles(response?.response);
      if (cancelledRef?.current) return;
      
      if (normalized.length >= 20) {
        setManualChartData(normalized);
        return;
      }
      throw new Error("NO_CANDLES");
    } catch {
      if (cancelledRef?.current) return;
      const demo = buildDemoChartData(
        manualSymbol,
        manualTimeframe,
        mergedConfig.availableTimeframes,
        mergedConfig.availableSymbols,
      );
      setManualChartData(demo);
    } finally {
      if (!cancelledRef?.current) {
        setIsManualChartLoading(false);
      }
    }
  };

  useEffect(() => {
    const cancelled = { current: false };
    fetchChartData(cancelled);

    return () => {
      cancelled.current = true;
    };
  }, [
    manualSymbol,
    manualTimeframe,
    manualApiSymbol,
    services,
    mergedConfig.availableTimeframes,
    mergedConfig.availableSymbols,
  ]);

  useEffect(() => {
    if (creationMode === "ai") {
      setAnalyzing(step === "analyzing");
    } else {
      setAnalyzing(false);
    }
    return () => setAnalyzing(false);
  }, [step, setAnalyzing, creationMode]);

  useEffect(() => {
    if (creationMode === "manual") return;
    setManualChartSelectionMode(null);
    setSelectedManualTpIndex(null);
    setManualChartAlert("");
  }, [creationMode]);

  useEffect(() => {
    if (creationMode === "manual") {
      setIsManualSectionMounted(true);
      const rafId = window.requestAnimationFrame(() => {
        setIsManualSectionVisible(true);
      });
      return () => {
        window.cancelAnimationFrame(rafId);
      };
    }

    setIsManualSectionVisible(false);
    const timeoutId = window.setTimeout(() => {
      setIsManualSectionMounted(false);
    }, MANUAL_SECTION_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [creationMode]);

  useEffect(() => {
    if (step !== "analyzing") return;
    const handlePopState = () => {
      window.history.pushState(null, "", pathname);
      setLeaveModalRequest({ type: "back" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [step, pathname, setLeaveModalRequest]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsChartZoomed(false);
    };
    if (isChartZoomed) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isChartZoomed]);

  const handleSaveChart = () => {
    const link = document.createElement("a");
    link.href = signalData.chartImage;
    link.download = `chart-${signalData.symbol}-${Date.now()}.png`;
    link.click();
  };

  const handleAnalyze = async () => {
    const trimmed = tradingViewLink.trim();
    if (!trimmed) return;
    if (!isValidTradingViewLink(trimmed)) return;
    setStep("analyzing");
    setErrorMessage("");
    setPublishError("");

    try {
      const response = await services.fetchDataFromImageFromUrl({
        url: tradingViewLink.trim(),
      });
      const result: FetchDataFromImageFromUrlResultDto | undefined =
        (response as unknown as AbpWrapper<FetchDataFromImageFromUrlResultDto>)
          ?.result ?? (response as FetchDataFromImageFromUrlResultDto);

      const analysis = result?.analysis;
      const rawImage = result?.imageBase64;
      const chartImageSrc = rawImage
        ? rawImage.startsWith("data:")
          ? rawImage
          : `data:image/png;base64,${rawImage}`
        : "/images/chart_preview.png";

      const position: "LONG" | "SHORT" =
        analysis?.direction?.toUpperCase() === "SHORT" ? "SHORT" : "LONG";
      const entry = analysis?.entryPoint ?? 0;
      const sl = analysis?.stopLoss ?? 0;
      const tps = (analysis?.takeProfits ?? []).filter(
        (value): value is number =>
          typeof value === "number" && Number.isFinite(value),
      );
      const desc = normalizeDescription(analysis?.description ?? "");
      const analyzedSymbol =
        analysis?.symbol?.trim() || mergedConfig.defaults.symbol;
      const analyzedTimeframe =
        analysis?.timeframe?.trim() || mergedConfig.defaults.timeframe;

      setEntryPointDisplay(String(entry));
      setTargetsDisplay(
        tps.length > 0 ? tps.map((t) => (t ? String(t) : "")) : [""],
      );
      setStopLossDisplay(String(sl));
      setDescription(desc);
      setSignalData({
        ...DEFAULT_SIGNAL_DATA,
        symbol: analyzedSymbol,
        timeframe: analyzedTimeframe,
        position,
        entry,
        targets: tps,
        stopLoss: sl,
        description: desc,
        chartImage: chartImageSrc,
      });
      setStep("editing");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : mergedConfig.messages.processingError,
      );
      setStep("error");
    }
  };

  const handleAddTarget = () => {
    const lastTargetValue = targetsDisplay[targetsDisplay.length - 1];
    const hasInvalidLastTarget = targetsDisplay.length > 0 && parseDisplayNumber(lastTargetValue ?? "") <= 0;
    
    if (hasInvalidLastTarget) return;

    setManualChartAlert("");
    setPublishError("");
    setTargetsDisplay([...targetsDisplay, ""]);
  };

  const handleUpdateTarget = (index: number, value: string) => {
    const newTargets = [...targetsDisplay];
    newTargets[index] = cleanNumericString(value);
    setManualChartAlert("");
    setPublishError("");
    setTargetsDisplay(newTargets);
  };

  const handleRemoveTarget = (index: number) => {
    setManualChartAlert("");
    setPublishError("");
    setTargetsDisplay(targetsDisplay.filter((_, i) => i !== index));
  };

  const handleTargetInputNavigation = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    value: string,
  ) => {
    if (e.key !== "Tab" && e.key !== "Enter") return;
    // Removed mandatory price check to allow free navigation
  };

  const parseNum = parseDisplayNumber;
  const targetsParsed = targetsDisplay.map(parseNum);
  const entryParsed = parseNum(entryPointDisplay);
  const validTargets = targetsParsed.filter((t) => t > 0);
  const orderedValidTargets = sortTargetsByEntryDistance({
    targets: validTargets,
    entry: entryParsed,
    side: signalData.position,
  });
  const stopParsed = parseNum(stopLossDisplay);
  const manualLevelValidationMessage = getLevelValidationMessage({
    side: signalData.position,
    entry: entryParsed,
    stopLoss: stopParsed,
    targets: validTargets,
    messages: mergedConfig.messages,
  });
  const manualAlertMessage = manualChartAlert;
  const validation = mergedConfig.validation;
  const hasValidEntry =
    Number.isFinite(entryParsed) && entryParsed > validation.minEntryPrice;
  const isLongPosition = signalData.position === "LONG";
  const hasEntryForLevelRules = Number.isFinite(entryParsed) && entryParsed > 0;
  const entryViolatesTargets =
    hasEntryForLevelRules &&
    orderedValidTargets.some((target) =>
      isLongPosition ? entryParsed >= target : entryParsed <= target,
    );
  const entryViolatesStopLoss =
    hasEntryForLevelRules &&
    stopParsed > 0 &&
    (isLongPosition ? entryParsed <= stopParsed : entryParsed >= stopParsed);
  const chartEntryPoint =
    hasValidEntry && !entryViolatesTargets && !entryViolatesStopLoss
      ? entryParsed
      : 0;
  const chartTakeProfits = hasEntryForLevelRules
    ? orderedValidTargets.filter((target) =>
        isLongPosition ? target > entryParsed : target < entryParsed,
      )
    : orderedValidTargets;
  const chartStopLoss =
    hasEntryForLevelRules &&
    stopParsed > 0 &&
    (isLongPosition ? stopParsed < entryParsed : stopParsed > entryParsed)
      ? stopParsed
      : 0;
  const hasManualConfiguredLevels =
    entryParsed > 0 || stopParsed > 0 || validTargets.length > 0;

  // Debounced values for validation feedback (wait for user to stop typing)
  const debouncedEntryDisplay = useDebounce(entryPointDisplay, 500);
  const debouncedTargetsDisplay = useDebounce(targetsDisplay, 500);
  const debouncedStopLossDisplay = useDebounce(stopLossDisplay, 500);

  const debouncedEntryParsed = parseNum(debouncedEntryDisplay);
  const debouncedTargetsParsed = debouncedTargetsDisplay.map(parseNum);
  const debouncedStopParsed = parseNum(debouncedStopLossDisplay);
  const debouncedHasEntry = Number.isFinite(debouncedEntryParsed) && debouncedEntryParsed > 0;

  // Individual Field Errors for UI feedback (using debounced values)
  const entryFieldError = !hasValidEntry && debouncedEntryDisplay !== "" && debouncedEntryDisplay !== "0" 
    ? mergedConfig.messages.invalidEntryPrice 
    : "";

  const tpFieldErrors = debouncedTargetsParsed.map((tp, idx) => {
    if (tp <= 0) return "";
    if (!debouncedHasEntry) return "";
    const isInvalid = isLongPosition ? tp <= debouncedEntryParsed : tp >= debouncedEntryParsed;
    return isInvalid 
      ? (isLongPosition ? mergedConfig.messages.invalidTpLong : mergedConfig.messages.invalidTpShort)
      : "";
  });

  const slFieldError = (debouncedStopParsed > 0 && debouncedHasEntry) && 
    (isLongPosition ? debouncedStopParsed >= debouncedEntryParsed : debouncedStopParsed <= debouncedEntryParsed)
    ? (isLongPosition ? mergedConfig.messages.invalidSlLong : mergedConfig.messages.invalidSlShort)
    : "";

  useEffect(() => {
    const shouldWarnBeforeUnload =
      step === "analyzing" ||
      (creationMode === "manual" && hasManualConfiguredLevels);

    if (!shouldWarnBeforeUnload) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [creationMode, hasManualConfiguredLevels, step]);

  useEffect(() => {
    setManualDirty(creationMode === "manual" && hasManualConfiguredLevels);
    return () => setManualDirty(false);
  }, [creationMode, hasManualConfiguredLevels, setManualDirty]);

  const hasValidTargets =
    !validation.requireTakeProfit || validTargets.length > 0;

  const hasValidStopLoss =
    !validation.requireStopLoss || stopParsed > 0;

  const hasValidDescription =
    !validation.requireDescription || description.trim().length > 0;

  const isPublishDisabled =
    !hasValidEntry ||
    !hasValidTargets ||
    !hasValidStopLoss ||
    !hasValidDescription ||
    (creationMode === "manual" && !!manualLevelValidationMessage);

  const handleToggleManualChartSelection = () => {
    setPublishError("");
    setManualChartAlert("");
    setManualChartSelectionMode((prevMode) => {
      const nextMode = prevMode ? null : "entry";
      if (nextMode === null) {
        setSelectedManualTpIndex(null);
      }
      return nextMode;
    });
  };

  const applyManualPositionChange = (change: PendingManualPositionChange) => {
    const { nextPosition, removedTargetsCount, resetStopLoss } = change;
    if (entryParsed <= 0) {
      setSignalData({ ...signalData, position: nextPosition });
      setManualChartAlert("");
      setPublishError("");
      return;
    }

    const shouldKeepTarget = (target: number) =>
      nextPosition === "LONG" ? target > entryParsed : target < entryParsed;
    const nextTargets = validTargets.filter(shouldKeepTarget);
    const sortedTargets = sortTargetsByEntryDistance({
      targets: nextTargets,
      entry: entryParsed,
      side: nextPosition,
    });

    setSignalData({ ...signalData, position: nextPosition });
    setTargetsDisplay(sortedTargets.map((target) => String(target)));
    if (resetStopLoss) {
      setStopLossDisplay("0");
    }
    setManualChartAlert("");
    setPublishError("");

    if (removedTargetsCount > 0 || resetStopLoss) {
      const changeParts = [
        removedTargetsCount > 0
          ? `${toPersianDigits(removedTargetsCount)} ${mergedConfig.messages.positionChangeTargetsRemoved}`
          : null,
        resetStopLoss ? mergedConfig.labels.stopLoss : null,
      ].filter(Boolean);
      pushToast(
        `${changeParts.join(" و ")} ${mergedConfig.messages.positionChangeNoTargetsRemoved.includes("ناسازگار") ? "" : "ناسازگار با جهت جدید حذف/بازنشانی شد."}`,
        "success",
      );
    }
  };

  const handleManualPositionChange = (nextPosition: "LONG" | "SHORT") => {
    if (nextPosition === signalData.position) return;

    if (entryParsed <= 0) {
      applyManualPositionChange({
        nextPosition,
        removedTargetsCount: 0,
        resetStopLoss: false,
      });
      return;
    }

    const shouldKeepTarget = (target: number) =>
      nextPosition === "LONG" ? target > entryParsed : target < entryParsed;
    const nextTargets = validTargets.filter(shouldKeepTarget);
    const removedTargetsCount = validTargets.length - nextTargets.length;
    const resetStopLoss =
      stopParsed > 0 &&
      (nextPosition === "LONG"
        ? stopParsed >= entryParsed
        : stopParsed <= entryParsed);

    if (removedTargetsCount > 0 || resetStopLoss) {
      setPendingManualPositionChange({
        nextPosition,
        removedTargetsCount,
        resetStopLoss,
      });
      setIsManualPositionChangeConfirmOpen(true);
      return;
    }

    applyManualPositionChange({
      nextPosition,
      removedTargetsCount: 0,
      resetStopLoss: false,
    });
  };

  const handleConfirmManualPositionChange = () => {
    if (!pendingManualPositionChange) {
      setIsManualPositionChangeConfirmOpen(false);
      return;
    }
    applyManualPositionChange(pendingManualPositionChange);
    setPendingManualPositionChange(null);
    setIsManualPositionChangeConfirmOpen(false);
  };

  const handleSelectManualChartMode = (mode: ChartSelectionMode) => {
    setPublishError("");
    setManualChartAlert("");

    // Toggle off if clicking the same mode
    if (manualChartSelectionMode === mode) {
      setManualChartSelectionMode(null);
      return;
    }

    if (mode && mode !== "entry" && entryParsed <= 0) {
      setManualChartAlert(mergedConfig.messages.setEntryFirst);
      if (isMobileViewport) {
        pushToast(mergedConfig.messages.setEntryFirst, "error");
      }
      return;
    }

    setManualChartSelectionMode(mode);
    if (mode !== "tp") {
      setSelectedManualTpIndex(null);
    }
  };

  const clearManualLevels = () => {
    setEntryPointDisplay("0");
    setTargetsDisplay([]);
    setStopLossDisplay("0");
    setManualChartSelectionMode(null);
    setSelectedManualTpIndex(null);
    setManualChartAlert("");
    setPublishError("");
  };

  const handleRemoveSelectedTp = (index: number) => {
    if (index < 0 || index >= orderedValidTargets.length) return;
    const nextTargets = orderedValidTargets.filter(
      (_, tpIndex) => tpIndex !== index,
    );
    setTargetsDisplay(nextTargets.map((target) => String(target)));
    setSelectedManualTpIndex(null);
    setManualChartAlert("");
    setPublishError("");
  };

  const formatLevelPrice = (value: number) => {
    if (!Number.isFinite(value)) return "-";
    return toEnglishDigits(
      value.toLocaleString("en-US", {
        minimumFractionDigits: value >= 1000 ? 2 : 4,
        maximumFractionDigits: value >= 1000 ? 2 : 4,
      }),
    );
  };

  const isDistanceFromEntryExceeded = (
    price: number,
    entry: number,
    maxPercent?: number,
  ) => {
    if (!maxPercent || maxPercent >= 100) return false;
    if (!Number.isFinite(price) || !Number.isFinite(entry) || entry <= 0) {
      return false;
    }

    const distancePercent = (Math.abs(price - entry) / entry) * 100;
    return distancePercent > maxPercent;
  };

  const buildManualPublishPreview = (): ManualPublishPreview | null => {
    if (isPublishDisabled || isPublishing) return null;
    if (manualLevelValidationMessage) {
      setPublishError(manualLevelValidationMessage);
      return null;
    }

    if (!hasValidEntry) {
      setPublishError(mergedConfig.messages.invalidEntryPrice);
      return null;
    }

    if (!hasValidTargets) {
      setPublishError(mergedConfig.messages.requiredFieldsError);
      return null;
    }

    if (!hasValidStopLoss) {
      setPublishError(mergedConfig.messages.requiredFieldsError);
      return null;
    }

    if (!hasValidDescription) {
      setPublishError(mergedConfig.messages.descriptionRequired);
      return null;
    }

    const isTakeProfitTooFar = orderedValidTargets.some((target) =>
      isDistanceFromEntryExceeded(
        target,
        entryParsed,
        mergedConfig.validation.maxDistanceFromEntryPercent.takeProfit,
      ),
    );

    const isStopLossTooFar =
      stopParsed > 0 &&
      isDistanceFromEntryExceeded(
        stopParsed,
        entryParsed,
        mergedConfig.validation.maxDistanceFromEntryPercent.stopLoss,
      );

    if (isTakeProfitTooFar) {
      setPublishError(mergedConfig.messages.takeProfitTooFar);
      return null;
    }

    if (isStopLossTooFar) {
      setPublishError(mergedConfig.messages.stopLossTooFar);
      return null;
    }

    return {
      symbol: manualApiSymbol,
      timeframe: manualTimeframeText,
      side: signalData.position,
      entry: entryParsed,
      stopLoss: stopParsed,
      takeProfits: orderedValidTargets,
      description: description.trim() || undefined,
    };
  };

  const requestManualSymbolChange = (nextSymbol: string) => {
    if (nextSymbol === manualSymbol) return;
    if (!hasManualConfiguredLevels) {
      setManualSymbol(nextSymbol);
      return;
    }
    setPendingManualSymbol(nextSymbol);
    setIsSymbolChangeConfirmOpen(true);
  };

  const handleConfirmManualSymbolChange = () => {
    if (!pendingManualSymbol) {
      setIsSymbolChangeConfirmOpen(false);
      return;
    }
    clearManualLevels();
    setManualSymbol(pendingManualSymbol);
    setPendingManualSymbol(null);
    setIsSymbolChangeConfirmOpen(false);
  };

  const canSetEntry = (nextEntry: number) => {
    if (!Number.isFinite(nextEntry) || nextEntry <= 0) return true;
    const isLong = signalData.position === "LONG";
    const hasInvalidTarget = orderedValidTargets.some((target) =>
      isLong ? target <= nextEntry : target >= nextEntry,
    );
    if (hasInvalidTarget) {
      setManualChartAlert(
        isLong
          ? mergedConfig.messages.invalidTpLong
          : mergedConfig.messages.invalidTpShort,
      );
      return false;
    }
    if (stopParsed > 0) {
      const invalidStop = isLong
        ? stopParsed >= nextEntry
        : stopParsed <= nextEntry;
      if (invalidStop) {
        setManualChartAlert(
          isLong
            ? mergedConfig.messages.invalidSlLong
            : mergedConfig.messages.invalidSlShort,
        );
        return false;
      }
    }
    return true;
  };

  const handleManualChartPriceSelect = ({
    mode,
    price,
  }: {
    mode: ChartSelectionMode;
    price: number;
  }) => {
    const selectedPrice = normalizeSelectedPrice(price);
    if (selectedPrice <= 0) return;

    const isLong = signalData.position === "LONG";
    if (mode === "entry") {
      if (!canSetEntry(selectedPrice)) return;
      setEntryPointDisplay(String(selectedPrice));
      setManualChartAlert("");
      setPublishError("");
      if (isMobileViewport) {
        // Removed toast per user request
      }
      return;
    }

    if (entryParsed <= 0) {
      setManualChartAlert(mergedConfig.messages.setEntryFirst);
      if (isMobileViewport) {
        pushToast(mergedConfig.messages.setEntryFirst, "error");
      }
      return;
    }

    if (mode === "tp") {
      const isInvalidTp = isLong
        ? selectedPrice <= entryParsed
        : selectedPrice >= entryParsed;
      if (isInvalidTp) {
        setManualChartAlert(
          isLong
            ? mergedConfig.messages.invalidTpLong
            : mergedConfig.messages.invalidTpShort,
        );
        return;
      }
      const precision = selectedPrice >= 1000 ? 0.01 : 0.0001;
      const duplicated = orderedValidTargets.some((target, index) => {
        if (selectedManualTpIndex !== null && index === selectedManualTpIndex)
          return false;
        return Math.abs(target - selectedPrice) < precision;
      });
      if (duplicated) {
        setManualChartAlert(mergedConfig.messages.duplicateTp);
        return;
      }
      const nextTargets =
        selectedManualTpIndex !== null &&
        selectedManualTpIndex >= 0 &&
        selectedManualTpIndex < orderedValidTargets.length
          ? orderedValidTargets.map((target, index) =>
              index === selectedManualTpIndex ? selectedPrice : target,
            )
          : [...orderedValidTargets, selectedPrice];
      const sortedTargets = sortTargetsByEntryDistance({
        targets: nextTargets,
        entry: entryParsed,
        side: signalData.position,
      });
      setTargetsDisplay(sortedTargets.map((target) => String(target)));
      setManualChartAlert("");
      setPublishError("");
      if (selectedManualTpIndex !== null) {
        const movedToIndex = sortedTargets.findIndex(
          (target) => Math.abs(target - selectedPrice) < precision,
        );
        setSelectedManualTpIndex(movedToIndex >= 0 ? movedToIndex : null);
      }
      if (isMobileViewport) {
        // Removed toast per user request
      }
      return;
    }

    const isInvalidStopLoss = isLong
      ? selectedPrice >= entryParsed
      : selectedPrice <= entryParsed;
    if (isInvalidStopLoss) {
      setManualChartAlert(
        isLong
          ? mergedConfig.messages.invalidSlLong
          : mergedConfig.messages.invalidSlShort,
      );
      return;
    }

    setStopLossDisplay(String(selectedPrice));
    setManualChartAlert("");
    setPublishError("");
    if (isMobileViewport) {
      // Removed toast per user request
    }
  };

  useEffect(() => {
    if (selectedManualTpIndex === null) return;
    if (selectedManualTpIndex < orderedValidTargets.length) return;
    setSelectedManualTpIndex(null);
  }, [selectedManualTpIndex, orderedValidTargets.length]);

  const handleOpenManualPublishConfirm = () => {
    const preview = buildManualPublishPreview();
    if (!preview) return;
    setPublishError("");
    setManualPublishPreview(preview);
    setIsManualPublishConfirmOpen(true);
  };

  const handlePublishManual = async () => {
    if (!manualPublishPreview || isPublishing) return;
    setIsPublishing(true);
    setPublishError("");
    try {
      await services.submitSignalFromUserInput({
        direction: manualPublishPreview.side,
        symbol: manualPublishPreview.symbol,
        entryPoint: manualPublishPreview.entry,
        stopLoss: manualPublishPreview.stopLoss,
        takeProfits: manualPublishPreview.takeProfits,
        description: manualPublishPreview.description,
      });
      setEntryPointDisplay("0");
      setTargetsDisplay([]);
      setStopLossDisplay("0");
      setDescription("");
      setIsManualPublishConfirmOpen(false);
      setManualPublishPreview(null);
      pushToast(mergedConfig.messages.submitSuccessManual, "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : mergedConfig.messages.submitErrorManual;
      setPublishError(message);
      pushToast(message, "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTradingViewLink(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const effectiveManualLayoutMode: ManualLayoutMode = isMobileViewport
    ? "default"
    : manualLayoutMode;
  const manualGridClass = cn(
    "grid gap-4 md:gap-6 items-start",
    effectiveManualLayoutMode === "default" && "grid-cols-1 lg:grid-cols-12",
    effectiveManualLayoutMode === "focus" && "grid-cols-1",
  );
  const manualChartWrapperClass = cn(
    "w-full relative",
    effectiveManualLayoutMode === "default" &&
      (isMobileViewport
        ? "order-1"
        : "lg:col-span-7 order-2 lg:order-last sticky top-6"),
    effectiveManualLayoutMode === "focus" &&
      "order-1 lg:order-first h-[65vh] min-h-[500px]",
  );
  const manualFormWrapperClass = cn(
    "space-y-4 md:space-y-6",
    effectiveManualLayoutMode === "default" &&
      (isMobileViewport ? "order-2" : "lg:col-span-5 order-1 lg:order-first"),
    effectiveManualLayoutMode === "focus" &&
      "order-2 lg:order-last w-full mt-2 lg:mt-4",
  );
  const manualChartCardClass = cn(
    styles.card,
    "w-full p-1.5 md:p-2 flex flex-col border-[#542C85]/40 backdrop-blur-md transition-all duration-500",
    effectiveManualLayoutMode === "default" &&
      (isMobileViewport
        ? "h-[60vh] min-h-[400px] max-h-[600px] shadow-[0_0_24px_-14px_rgba(84,44,133,0.45)] bg-[#02000B]/35 p-0"
        : "h-[550px] shadow-[0_0_30px_-10px_rgba(84,44,133,0.3)] bg-[#02000B]/30"),
    effectiveManualLayoutMode === "focus" &&
      "h-full shadow-[0_0_50px_-10px_rgba(84,44,133,0.5)] bg-gradient-to-br from-[#02000B]/80 to-[#542C85]/10 border-[#542C85]/60",
  );
  const mobileModeManualLabel = mergedConfig.labels.modeManual.replace(
    /\s*\([^)]*\)\s*/g,
    "",
  );
  const mobileModeAiLabel = mergedConfig.labels.modeAi.replace(
    /\s*\([^)]*\)\s*/g,
    "",
  );

  return (
    <div
      className={cn(
        "container mx-auto px-2 py-4 md:p-8 min-h-screen rtl font-sans text-white transition-all duration-500",
        effectiveManualLayoutMode === "focus" && creationMode === "manual"
          ? "max-w-[1400px]"
          : "max-w-6xl",
      )}
      dir="rtl"
    >
      <div className="flex bg-[#02000B]/50 border border-white/10 p-1.5 rounded-3xl w-fit mx-auto mb-5 md:mb-6 backdrop-blur-sm">
        <button
          className={cn(
            "px-8 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer",
            creationMode === "manual"
              ? "bg-[#542C85]/10 text-white shadow-lg border border-[#542C85]/50"
              : "text-white/50 hover:text-white",
          )}
          onClick={() => setCreationMode("manual")}
        >
          {isMobileViewport ? mobileModeManualLabel : mergedConfig.labels.modeManual}
        </button>
        <button
          className={cn(
            "px-8 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer",
            creationMode === "ai"
              ? "bg-[#542C85] text-white shadow-lg"
              : "text-white/50 hover:text-white",
          )}
          onClick={() => setCreationMode("ai")}
        >
          {isMobileViewport ? mobileModeAiLabel : mergedConfig.labels.modeAi}
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {creationMode === "ai" ? mergedConfig.labels.titleAi : mergedConfig.labels.titleManual}
          </h1>
          {creationMode === "ai" && step === "input" && (
            <p className={cn("mt-2", styles.textMuted)}>
              {mergedConfig.labels.subtitleAi}
            </p>
          )}
          {creationMode === "manual" && (
            <p className={cn("mt-2", styles.textMuted)}>
              {mergedConfig.labels.subtitleManual}
            </p>
          )}
        </div>
        {creationMode === "ai" && (step === "editing" || step === "error") && (
          <Button
            variant="tertiary"
            onClick={() => {
              setStep("input");
              setErrorMessage("");
            }}
            className={cn(
              "gap-1 h-10 px-4 md:h-12 md:px-6 rounded-2xl border text-sm md:text-base font-bold shadow-sm transition-colors duration-200",
              isDark
                ? "bg-white/5 border-white/10 text-white/85 hover:bg-white/10 hover:text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {mergedConfig.labels.newAnalysis}
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isManualSectionMounted && (
        <div
          className={cn(
            "space-y-6 overflow-hidden transition-all ease-out",
            isManualSectionVisible
              ? "max-h-[2600px] translate-y-0 opacity-100 duration-500"
              : "max-h-0 -translate-y-2 opacity-0 pointer-events-none duration-300",
          )}
        >
          <div className="mx-auto mb-3 md:mb-4 flex w-fit flex-wrap items-center justify-center gap-2 md:gap-3">
            <div className="flex bg-[#02000B]/50 border border-white/10 p-1 rounded-3xl backdrop-blur-sm">
              {mergedConfig.availableSymbols.map((s) => (
                <button
                  key={s.value}
                  className={cn(
                    "px-10 py-1.5 rounded-2xl text-sm font-bold transition-all cursor-pointer",
                    manualSymbol === s.value
                      ? "bg-[#542C85] text-white shadow-md border border-[#542C85]/50"
                      : "text-white/50 hover:text-white",
                  )}
                  onClick={() => requestManualSymbolChange(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {!isMobileViewport && (
              <div className="rounded-2xl border border-white/10 bg-[#02000B]/45 p-1.5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  {MANUAL_LAYOUT_OPTIONS.map((layoutOption) => (
                    <button
                      key={layoutOption.value}
                      type="button"
                      onClick={() => setManualLayoutMode(layoutOption.value)}
                      aria-label={mergedConfig.labels[layoutOption.labelKey]}
                      title={mergedConfig.labels[layoutOption.labelKey]}
                      className={cn(
                        "h-8 w-10 inline-flex items-center justify-center rounded-lg border transition-all cursor-pointer",
                        manualLayoutMode === layoutOption.value
                          ? "bg-[#542C85] border-[#8B5CF6]/70 text-white shadow-[0_0_14px_-8px_rgba(139,92,246,0.85)]"
                          : "bg-black/20 border-white/10 text-white/65 hover:text-white hover:border-[#542C85]/55",
                      )}
                    >
                      <layoutOption.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={cn(manualGridClass, "mt-4 md:mt-8")}>
            <div className={manualChartWrapperClass}>
              <Card className={manualChartCardClass}>
                <LightweightChart
                  data={manualChartData}
                  title={manualSymbol}
                  manualModeLabel={mergedConfig.labels.manualModeLabel}
                  timeframeOptions={manualChartTimeframeOptions}
                  activeTimeframe={manualTimeframe}
                  onTimeframeChange={(timeframeValue) =>
                    setManualTimeframe(timeframeValue)
                  }
                  onToggleSelectionMode={handleToggleManualChartSelection}
                  onSelectSelectionMode={handleSelectManualChartMode}
                  selectedTpIndex={selectedManualTpIndex}
                  onSelectTpIndex={setSelectedManualTpIndex}
                  onRemoveTpIndex={handleRemoveSelectedTp}
                  loading={isManualChartLoading}
                  entryPoint={chartEntryPoint}
                  stopLoss={chartStopLoss}
                  takeProfits={chartTakeProfits}
                  side={signalData.position}
                  selectionMode={manualChartSelectionMode}
                  onSelectPrice={handleManualChartPriceSelect}
                  entryColor={manualEntryColor}
                  tpColor={manualTpColor}
                  slColor={manualSlColor}
                  hideToolbar={isMobileViewport}
                  isMobile={isMobileViewport}
                  fitContentTrigger={fitContentTrigger}
                />
              </Card>
            </div>

            {/* Mobile Chart Toolbar */}
            {isMobileViewport && creationMode === "manual" && (
              <div className="flex flex-col gap-3 mt-1 mb-4">
                {manualChartSelectionMode === null ? (
                  <button
                    onClick={() => handleSelectManualChartMode("entry")}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#542C85] to-[#63359d] text-white font-bold shadow-lg shadow-[#542C85]/30 flex items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-500 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span>فعال‌سازی ثبت دستی روی چارت</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2 bg-[#02000B]/40 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-1.5 p-1 bg-black/30 rounded-xl">
                      <button
                        onClick={() => handleSelectManualChartMode("entry")}
                        className={cn(
                          "h-10 px-3 rounded-lg text-xs font-bold transition-all",
                          manualChartSelectionMode === "entry"
                            ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                            : "text-white/50 hover:text-white"
                        )}
                      >
                        Entry
                      </button>
                      <button
                        onClick={() => handleSelectManualChartMode("tp")}
                        className={cn(
                          "h-10 px-3 rounded-lg text-xs font-bold transition-all",
                          manualChartSelectionMode === "tp"
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : "text-white/50 hover:text-white"
                        )}
                      >
                        TP
                      </button>
                      <button
                        onClick={() => handleSelectManualChartMode("sl")}
                        className={cn(
                          "h-10 px-3 rounded-lg text-xs font-bold transition-all",
                          manualChartSelectionMode === "sl"
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                            : "text-white/50 hover:text-white"
                        )}
                      >
                        SL
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimeframeSheetOpen(true)}
                        className="h-10 px-3 flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs font-bold transition-active active:scale-95"
                      >
                        <Clock className="w-4 h-4 text-[#A87FF3]" />
                        {manualTimeframe.toUpperCase()}
                      </button>
                      
                      <button
                        onClick={() => setManualChartSelectionMode(null)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 transition-active active:scale-95"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TP Index Selector (Mobile) */}
                {manualChartSelectionMode === "tp" && (
                  <div className="flex items-center gap-2 p-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden animate-in slide-in-from-top-2 duration-300">
                    <span className="text-[10px] font-bold text-emerald-400/70 px-2 shrink-0">Select TP:</span>
                    <div className="flex items-center gap-1.5">
                      {targetsDisplay.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedManualTpIndex(i)}
                          className={cn(
                            "h-10 min-w-[44px] px-3 rounded-lg font-bold text-xs transition-all",
                            selectedManualTpIndex === i
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                              : "bg-white/5 text-white/40 border border-white/5"
                          )}
                        >
                          T{i + 1}
                        </button>
                      ))}
                      {targetsDisplay.length < 5 && (
                        <button
                          onClick={() => setSelectedManualTpIndex(null)}
                          className={cn(
                            "h-10 w-10 flex items-center justify-center rounded-lg border border-dashed transition-all",
                            selectedManualTpIndex === null
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                              : "border-white/20 text-white/30"
                          )}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {manualChartSelectionMode && (
                  <div className="bg-[#542C85]/20 border border-[#542C85]/30 rounded-xl px-4 py-2 text-[11px] text-[#E9DDFF] text-center animate-in fade-in slide-in-from-top-1 duration-300">
                    {manualChartSelectionMode === "entry" ? "نقطه ورود" : manualChartSelectionMode === "sl" ? "حد ضرر" : "حد سود"} فعال است. روی چارت کلیک کنید.
                  </div>
                )}
              </div>
            )}

            <div className={manualFormWrapperClass}>
              <Card
                className={cn(
                  styles.card,
                  "flex flex-col border-[#542C85]/20 bg-gradient-to-b from-white/[0.02] to-transparent shadow-xl relative overflow-hidden transition-all duration-500",
                  effectiveManualLayoutMode === "focus" &&
                    "border-[#542C85]/40 shadow-[0_0_40px_-5px_rgba(84,44,133,0.3)] bg-gradient-to-br from-[#02000B]/90 to-[#120721]/95 backdrop-blur-2xl",
                )}
              >
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#542C85]/40 to-transparent" />

                {effectiveManualLayoutMode === "default" && (
                  <CardHeader
                    className={cn(
                      styles.cardHeader,
                      "border-white/5 pt-6 px-7",
                    )}
                  >
                    <CardTitle className="text-lg flex justify-between items-center text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#542C85]/20 flex items-center justify-center border border-[#542C85]/30">
                          <FileText className="w-4 h-4 text-[#A87FF3]" />
                        </div>
                        <span className="font-bold tracking-wide">
                          {mergedConfig.labels.titleManual} {manualSymbol}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                )}

                <CardContent
                  className={cn(
                    "flex flex-col flex-1",
                    effectiveManualLayoutMode === "focus"
                      ? "pt-6 lg:pt-8 px-6 lg:px-8 pb-6 lg:pb-8 gap-6 lg:gap-6"
                      : "pt-5 px-4 md:px-7 pb-6 md:pb-8",
                  )}
                >
                  <div
                    className={cn(
                      "flex-1",
                      effectiveManualLayoutMode === "focus"
                        ? "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                        : "space-y-6",
                    )}
                  >
                    <div
                      className={cn(
                        effectiveManualLayoutMode === "focus" &&
                          "flex flex-col justify-between space-y-5 bg-gradient-to-br from-white/[0.03] to-[#542C85]/5 border border-[#542C85]/20 rounded-3xl p-5 shadow-[inset_0_1px_15px_rgba(84,44,133,0.1)]",
                      )}
                    >
                      <div
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="text-xs font-medium text-white/70 mb-2 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-white/40" />{" "}
                            {mergedConfig.labels.symbol}
                          </label>
                          <Input
                            value={manualSymbol}
                            readOnly
                            className="bg-black/20 border-white/5 text-white/60 h-11 pointer-events-none cursor-not-allowed shadow-inner"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-white/70 mb-2 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-white/40" />
                            {mergedConfig.labels.timeframe}
                          </label>
                          <Input
                            value={
                              effectiveManualLayoutMode === "focus"
                                ? manualTimeframeText
                                : `${manualTimeframeText} (${manualTimeframe.toUpperCase()})`
                            }
                            readOnly
                            className="bg-black/20 border-white/5 text-white/60 h-11 pointer-events-none cursor-not-allowed shadow-inner"
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <div
                        className={cn(
                          effectiveManualLayoutMode !== "focus" && "mt-6",
                        )}
                      >
                        <div className="mb-2">
                          <label className="text-xs font-medium text-white/70">
                            {mergedConfig.labels.side}
                          </label>
                        </div>
                        <div className="flex bg-black/40 rounded-xl p-1.5 border border-white/5 shadow-inner">
                          <button
                            className={cn(
                              "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 cursor-pointer",
                              signalData.position === "LONG"
                                ? "bg-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] text-white"
                                : "text-white/40 hover:bg-white/5 hover:text-white/70",
                            )}
                            onClick={() => handleManualPositionChange("LONG")}
                          >
                            {mergedConfig.labels.long}
                          </button>
                          <button
                            className={cn(
                              "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 cursor-pointer",
                              signalData.position === "SHORT"
                                ? "bg-rose-500 shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)] text-white"
                                : "text-white/40 hover:bg-white/5 hover:text-white/70",
                            )}
                            onClick={() => handleManualPositionChange("SHORT")}
                          >
                            {mergedConfig.labels.short}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "p-5 rounded-3xl border shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] space-y-5 relative overflow-hidden",
                        effectiveManualLayoutMode === "focus"
                          ? "border-[#542C85]/20 bg-gradient-to-bl from-white/[0.03] to-[#542C85]/5 shadow-[inset_0_1px_15px_rgba(84,44,133,0.1)]"
                          : "bg-black/20 rounded-2xl border-white/5 backdrop-blur-xl",
                      )}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#542C85]/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                      <div className="relative z-10">
                        <label className="text-xs font-medium text-white/70 mb-2 flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-[#A87FF3]" /> {mergedConfig.labels.entryPoint}
                        </label>
                        <Input
                          inputMode="decimal"
                          value={entryPointDisplay}
                          onFocus={() =>
                            clearZeroValueOnFocus(
                              entryPointDisplay,
                              setEntryPointDisplay,
                            )
                          }
                          onChange={(e) => {
                            const cleaned = cleanNumericString(e.target.value);
                            setEntryPointDisplay(cleaned);
                            setManualChartAlert("");
                            setPublishError("");
                          }}
                          className={cn(
                            styles.input,
                            "h-11 bg-white/5 focus-visible:bg-white/10 font-mono text-left placeholder:text-white/20 border-white/10 shadow-inner",
                            entryFieldError && "border-rose-500/50 focus-visible:border-rose-500 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]"
                          )}
                          dir="ltr"
                          placeholder="مثال: 2350.5"
                        />
                        {entryFieldError && (
                          <span className="text-[10px] text-rose-400 mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
                            <AlertTriangle className="w-3 h-3" /> {entryFieldError}
                          </span>
                        )}
                      </div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />{" "}
                            {mergedConfig.labels.takeProfits}
                          </label>
                          <button
                            onClick={handleAddTarget}
                            disabled={targetsDisplay.length > 0 && parseDisplayNumber(targetsDisplay[targetsDisplay.length - 1] ?? "") <= 0}
                            className={cn(
                              "text-xs font-medium flex items-center gap-1 transition-all px-2 py-1 rounded-md shadow-sm border cursor-pointer",
                              targetsDisplay.length > 0 && parseDisplayNumber(targetsDisplay[targetsDisplay.length - 1] ?? "") <= 0
                                ? "opacity-40 grayscale cursor-not-allowed border-white/5 text-white/40"
                                : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 bg-emerald-500/5 border-emerald-500/20"
                            )}
                          >
                            <Plus className="w-3 h-3" />
                            {mergedConfig.labels.addTarget}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {targetsDisplay.map((target, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-1 w-full relative group"
                            >
                              <span className="text-[10px] text-white/40 px-1 font-medium">
                                هدف {index + 1}
                              </span>
                              <div className="flex relative">
                                <Input
                                  ref={(el) => {
                                    targetInputRefs.current[index] = el;
                                  }}
                                  inputMode="decimal"
                                  value={target}
                                  onChange={(e) =>
                                    handleUpdateTarget(index, e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    handleTargetInputNavigation(e, index, target)
                                  }
                                  className={cn(
                                    styles.input,
                                    "h-10 bg-emerald-500/5 focus-visible:bg-emerald-500/10 font-mono text-left text-sm border-emerald-500/20 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 transition-all text-emerald-100 placeholder:text-emerald-500/30 shadow-inner",
                                    tpFieldErrors[index] && "border-rose-500/50 focus-visible:border-rose-500 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)] bg-rose-500/5"
                                  )}
                                  dir="ltr"
                                  placeholder="مثال: 2370.0"
                                />
                                <button
                                  onClick={() => handleRemoveTarget(index)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-rose-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all bg-black/60 hover:bg-rose-500/20 rounded-md backdrop-blur-md"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {tpFieldErrors[index] && (
                                <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
                                  <AlertTriangle className="w-2.5 h-2.5" /> {tpFieldErrors[index]}
                                </span>
                              )}
                            </div>
                          ))}
                          {targetsDisplay.length === 0 && (
                            <div className="col-span-1 text-center py-4 border border-dashed border-white/10 bg-white/[0.02] rounded-xl text-white/30 text-[11px] shadow-inner">
                              {mergedConfig.labels.noTargets}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative z-10 pt-1">
                        <label className="text-xs font-medium text-white/70 mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />{" "}
                          {mergedConfig.labels.stopLoss}
                        </label>
                        <Input
                          inputMode="decimal"
                          value={stopLossDisplay}
                          onFocus={() =>
                            clearZeroValueOnFocus(
                              stopLossDisplay,
                              setStopLossDisplay,
                            )
                          }
                          onChange={(e) => {
                            setStopLossDisplay(
                              cleanNumericString(e.target.value),
                            );
                            setManualChartAlert("");
                            setPublishError("");
                          }}
                          className={cn(
                            styles.input,
                            "border-rose-500/20 focus-visible:border-rose-500 focus-visible:ring-rose-500/20 text-rose-100 font-mono text-left h-11 placeholder:text-rose-500/30 bg-rose-500/5 focus-visible:bg-rose-500/10 shadow-inner",
                            slFieldError && "border-rose-500/60 focus-visible:border-rose-500 shadow-[0_0_15px_-3px_rgba(244,63,94,0.4)] bg-rose-500/10"
                          )}
                          dir="ltr"
                          placeholder="مثال: 2320.0"
                        />
                        {slFieldError && (
                          <span className="text-[10px] text-rose-400 mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
                            <AlertTriangle className="w-3 h-3" /> {slFieldError}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div
                      className={cn(
                        "flex flex-col",
                        effectiveManualLayoutMode === "focus" && "min-h-[110px]",
                      )}
                    >
                      <textarea
                        className="w-full flex-1 min-h-[80px] p-4 rounded-xl border border-white/5 bg-black/20 shadow-inner text-sm text-white resize-none focus:border-[#A87FF3]/50 focus:ring-1 focus:ring-[#A87FF3]/50 focus:bg-white/[0.03] outline-none transition-all placeholder:text-white/20 scrollbar-thin scrollbar-thumb-white/10"
                        placeholder={mergedConfig.labels.descriptionPlaceholder}
                        value={description}
                        maxLength={DESCRIPTION_MAX_LENGTH}
                        onChange={(e) =>
                          setDescription(normalizeDescription(e.target.value))
                        }
                      />
                      <div className="mt-2 text-xs text-white/45 text-left" dir="ltr">
                        {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex flex-col justify-end",
                      effectiveManualLayoutMode === "focus"
                        ? "pt-5 mt-2 border-t border-white/10"
                        : "pt-8 mt-auto",
                    )}
                  >
                    {(manualAlertMessage || publishError) && (
                      <div className="mb-4 flex flex-col gap-2">
                        {manualAlertMessage && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm shadow-inner break-words">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="flex-1">{manualAlertMessage}</span>
                          </div>
                        )}
                        {publishError && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm shadow-inner break-words">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="flex-1">{publishError}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      onClick={handleOpenManualPublishConfirm}
                      disabled={isPublishDisabled || isPublishing}
                      className={cn(
                        "w-full text-white transition-all duration-300",
                        effectiveManualLayoutMode === "focus"
                          ? "h-14 text-base rounded-2xl bg-gradient-to-r from-[#542C85] to-[#7C4DCC] shadow-[0_0_30px_-5px_rgba(124,77,204,0.5)] border border-white/10 hover:shadow-[0_0_40px_-5px_rgba(124,77,204,0.7)] hover:scale-[1.02]"
                          : cn("h-12 text-base", styles.buttonPrimary),
                      )}
                    >
                      {isPublishing
                        ? mergedConfig.labels.submitting
                        : mergedConfig.labels.submit}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {creationMode === "ai" && step === "input" && (
        <div className="max-w-2xl mx-auto mt-12">
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className="text-xl text-white">
                {mergedConfig.labels.linkTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder={mergedConfig.labels.linkPlaceholder}
                    value={tradingViewLink}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTradingViewLink(e.target.value)
                    }
                    className={cn(
                      styles.input,
                      "ltr text-lg pr-12",
                      displayLinkError &&
                        "border-red-500/50 focus-visible:border-red-500",
                    )}
                    dir="ltr"
                  />
                  <button
                    onClick={handlePaste}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                    title={mergedConfig.labels.paste}
                    type="button"
                  >
                    <Clipboard className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-white/50">
                  {mergedConfig.labels.linkHint}
                </p>
                {displayLinkError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{displayLinkError}</span>
                  </div>
                )}
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!trimmedLink || !isLinkValid}
                className={cn("w-full", styles.buttonPrimary)}
              >
                {mergedConfig.labels.processAi}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {creationMode === "ai" && step === "error" && (
        <div className="max-w-2xl mx-auto mt-12">
          <Card className={cn(styles.card, "border-red-500/30")}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className="text-xl text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {mergedConfig.labels.errorTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-white/80">{errorMessage}</p>
              <Button
                onClick={() => setStep("input")}
                className={cn("w-full", styles.buttonSecondary)}
              >
                {mergedConfig.labels.retry}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {creationMode === "ai" && step === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-24 space-y-8 text-center">
          <AISparkleLoader
            text={mergedConfig.labels.processingAi}
            className="text-[#542C85]"
            size={56}
          />
          <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
            {mergedConfig.labels.processingAiHint}
          </p>
        </div>
      )}

      {creationMode === "ai" && step === "editing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Card className={cn(styles.card, "overflow-hidden")}>
              <div className="aspect-video bg-[#542C85]/5 relative group">
                <img
                  src={signalData.chartImage}
                  alt="Chart Analysis"
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02000B]/80 via-transparent to-transparent opacity-60" />
              </div>
              <div className="flex gap-2 p-3 border-t border-[#542C85]/20">
                <Button
                  variant="tertiary"
                  onClick={handleSaveChart}
                  className={cn(
                    "flex-1 gap-2 h-10 px-4 md:h-12 md:px-6 rounded-2xl border text-sm md:text-base font-bold shadow-sm transition-colors duration-200",
                    isDark
                      ? "bg-white/5 border-white/10 text-white/85 hover:bg-white/10 hover:text-white"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Download className="w-4 h-4" />
                  {mergedConfig.labels.saveChart}
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => setIsChartZoomed(true)}
                  className={cn(
                    "flex-1 gap-2 h-10 px-4 md:h-12 md:px-6 rounded-2xl border text-sm md:text-base font-bold shadow-sm transition-colors duration-200",
                    isDark
                      ? "bg-white/5 border-white/10 text-white/85 hover:bg-white/10 hover:text-white"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <ZoomIn className="w-4 h-4" />
                  {mergedConfig.labels.zoomChart}
                </Button>
              </div>
            </Card>

            {isChartZoomed &&
              createPortal(
                <div
                  className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                  onClick={() => setIsChartZoomed(false)}
                >
                  <button
                    onClick={() => setIsChartZoomed(false)}
                    className="absolute top-4 end-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label={mergedConfig.labels.cancel}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <img
                    src={signalData.chartImage}
                    alt={mergedConfig.labels.chartZoomAriaLabel}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>,
                document.body,
              )}

            <Card className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-[#542C85]" />
                  {mergedConfig.labels.descriptionTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <textarea
                  className={cn(
                    "w-full min-h-[160px] p-4 rounded-xl border border-[#542C85]/30 bg-[#542C85]/10 text-white placeholder:text-white/50 focus:bg-[#542C85]/20 transition-all text-sm leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-[#542C85]",
                    "scrollbar-thin scrollbar-thumb-[#542C85]/50 scrollbar-track-transparent",
                  )}
                  placeholder={mergedConfig.labels.descriptionAiPlaceholder}
                  value={description}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(normalizeDescription(e.target.value))
                  }
                />
                <div className="mt-2 text-xs text-white/45 text-left" dir="ltr">
                  {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card
              className={cn(
                styles.card,
                "bg-gradient-to-br from-[#542C85]/20 to-[#02000B]/50 border-[#542C85]/30 relative overflow-hidden",
              )}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#542C85]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <CardContent className="p-6 relative z-10 flex flex-row items-center justify-between">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {signalData.symbol}
                </h2>
                <div
                  className={cn(
                    "px-4 py-2 rounded-xl text-base font-bold flex items-center gap-2 shadow-lg border backdrop-blur-sm",
                    signalData.position === "LONG"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20",
                  )}
                >
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full animate-pulse",
                      signalData.position === "LONG"
                        ? "bg-green-500"
                        : "bg-red-500",
                    )}
                  />
                  {signalData.position === "LONG"
                    ? mergedConfig.labels.long
                    : mergedConfig.labels.short}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card
                className={cn(
                  styles.card,
                  "border-r-2 border-r-green-600/60 border-slate-700/50 bg-slate-800/20",
                )}
              >
                <CardHeader
                  className={cn(
                    styles.cardHeader,
                    "flex flex-row items-center justify-between pt-6 border-slate-600/30",
                  )}
                >
                  <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                    {mergedConfig.labels.targetsTitle}
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={handleAddTarget}
                    className="h-8 w-8 p-0 rounded-full bg-slate-600/50 hover:bg-slate-500/50 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {targetsDisplay.map((target, index) => (
                    <div key={index} className="group flex items-center gap-3">
                      <div className="relative flex-1">
                        <Input
                          ref={(el) => {
                            targetInputRefs.current[index] = el;
                          }}
                          value={target}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleUpdateTarget(index, e.target.value)
                          }
                          onKeyDown={(e) =>
                            handleTargetInputNavigation(e, index, target)
                          }
                          placeholder="0"
                          inputMode="decimal"
                          className={cn(
                            styles.input,
                            "font-mono text-left pl-10 border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 focus:border-green-600/70 focus:ring-green-600/10 placeholder:text-slate-500",
                          )}
                          dir="ltr"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600/80">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTarget(index)}
                        className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        aria-label={mergedConfig.labels.deleteTargetAriaLabel}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {targetsDisplay.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-slate-600/40 rounded-xl text-slate-500 text-sm bg-slate-800/30">
                      {mergedConfig.labels.noTargets}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card
                className={cn(
                  styles.card,
                  "border-slate-700/50 bg-slate-800/20",
                )}
              >
                <CardHeader
                  className={cn(styles.cardHeader, "border-slate-600/30 pt-6")}
                >
                  <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-300">
                    <Wallet className="w-4 h-4 text-slate-500" />
                    {mergedConfig.labels.entryTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="relative">
                    <Input
                      value={entryPointDisplay}
                      onFocus={() =>
                        clearZeroValueOnFocus(
                          entryPointDisplay,
                          setEntryPointDisplay,
                        )
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const cleaned = cleanNumericString(e.target.value);
                        setEntryPointDisplay(cleaned);
                        setManualChartAlert("");
                        setPublishError("");
                      }}
                      inputMode="decimal"
                      className={cn(
                        styles.input,
                        "font-mono text-left pl-10 border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 focus:border-slate-500 focus:ring-slate-500/20 placeholder:text-slate-500",
                      )}
                      dir="ltr"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  styles.card,
                  "border-r-2 border-r-red-600/60 border-slate-700/50 bg-slate-800/20",
                )}
              >
                <CardHeader
                  className={cn(styles.cardHeader, "border-slate-600/30 pt-6")}
                >
                  <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-300">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    {mergedConfig.labels.slTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="relative">
                    <Input
                      value={stopLossDisplay}
                      onFocus={() =>
                        clearZeroValueOnFocus(
                          stopLossDisplay,
                          setStopLossDisplay,
                        )
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setStopLossDisplay(cleanNumericString(e.target.value));
                        setPublishError("");
                      }}
                      inputMode="decimal"
                      className={cn(
                        styles.input,
                        "font-mono text-left pl-10 border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 focus:border-red-600/70 focus:ring-red-600/10 placeholder:text-slate-500 transition-colors",
                      )}
                      dir="ltr"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600/80">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-4 flex flex-col gap-3 pb-8">
              {publishError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {publishError}
                </div>
              )}
              <Button
                className={cn("w-full", styles.buttonPrimary)}
                disabled={isPublishDisabled || isPublishing}
                onClick={handleOpenManualPublishConfirm}
              >
                {isPublishing ? mergedConfig.labels.publishing : mergedConfig.labels.submit}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog
        open={isManualPositionChangeConfirmOpen}
        onOpenChange={(open) => {
          setIsManualPositionChangeConfirmOpen(open);
          if (!open) setPendingManualPositionChange(null);
        }}
      >
        <AlertDialogContent className="bg-[#1A1A2E] border-white/10" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {mergedConfig.labels.confirmPositionChangeTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 leading-7">
              با تغییر جهت از {signalData.position === "LONG" ? mergedConfig.labels.long : mergedConfig.labels.short}{" "}
              به{" "}
              {pendingManualPositionChange?.nextPosition === "LONG"
                ? mergedConfig.labels.long
                : mergedConfig.labels.short}
              ، {mergedConfig.labels.confirmPositionChangeDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80">
            {pendingManualPositionChange?.removedTargetsCount
              ? `${toPersianDigits(
                  pendingManualPositionChange.removedTargetsCount,
                )} ${mergedConfig.messages.positionChangeTargetsRemoved}`
              : mergedConfig.messages.positionChangeNoTargetsRemoved}{" "}
            {pendingManualPositionChange?.resetStopLoss
              ? mergedConfig.messages.positionChangeSlReset
              : mergedConfig.messages.positionChangeValidSl}
          </div>
          <AlertDialogFooter className="gap-3">
            <button
              onClick={handleConfirmManualPositionChange}
              className="inline-flex h-11 items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 bg-[#542C85] hover:bg-purple-700 text-white cursor-pointer"
            >
              {mergedConfig.labels.yes}
            </button>
            <AlertDialogCancel
              onClick={() => {
                setIsManualPositionChangeConfirmOpen(false);
                setPendingManualPositionChange(null);
              }}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
            >
              {mergedConfig.labels.cancel}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isSymbolChangeConfirmOpen}
        onOpenChange={(open) => {
          setIsSymbolChangeConfirmOpen(open);
          if (!open) setPendingManualSymbol(null);
        }}
      >
        <AlertDialogContent
          className="w-[calc(100%-2rem)] max-w-md rounded-2xl border-white/10 bg-[radial-gradient(120%_120%_at_80%_0%,rgba(124,77,204,0.28),rgba(26,26,46,0.94)_45%,rgba(12,8,25,0.98)_100%)] backdrop-blur-xl sm:w-full"
          dir="rtl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                <AlertTriangle className="h-4 w-4" />
              </span>
              {mergedConfig.labels.confirmSymbolChangeTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/75 leading-7">
              {mergedConfig.labels.confirmSymbolChangeDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <button
              onClick={handleConfirmManualSymbolChange}
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-[#6B3FA5] to-[#542C85] hover:brightness-110 text-white shadow-[0_0_24px_-8px_rgba(124,77,204,0.95)] cursor-pointer"
            >
              {mergedConfig.labels.yes}
            </button>
            <AlertDialogCancel
              onClick={() => {
                setIsSymbolChangeConfirmOpen(false);
                setPendingManualSymbol(null);
              }}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
            >
              {mergedConfig.labels.cancel}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isManualPublishConfirmOpen}
        onOpenChange={(open) => {
          setIsManualPublishConfirmOpen(open);
          if (!open) setManualPublishPreview(null);
        }}
      >
        <AlertDialogContent
          className="bg-gradient-to-br from-[#120721] via-[#1B0D33] to-[#0B1020] border-[#8D5AE2]/40 text-white shadow-[0_0_80px_-20px_rgba(141,90,226,0.7)] max-w-xl"
          dir="rtl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              {mergedConfig.labels.publishTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/75 leading-7">
              {mergedConfig.labels.confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {manualPublishPreview && (
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <span className="text-white/50">{mergedConfig.labels.symbol}</span>
                  <p className="font-bold mt-1">
                    {manualPublishPreview.symbol}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <span className="text-white/50">{mergedConfig.labels.timeframe}</span>
                  <p className="font-bold font-mono mt-1 ltr text-left">
                    {toEnglishDigits(manualPublishPreview.timeframe)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <span className="text-white/50">{mergedConfig.labels.side}</span>
                  <p
                    className={cn(
                      "font-bold mt-1",
                      manualPublishPreview.side === "LONG"
                        ? "text-emerald-400"
                        : "text-rose-400",
                    )}
                  >
                    {manualPublishPreview.side === "LONG"
                      ? mergedConfig.labels.long
                      : mergedConfig.labels.short}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <span className="text-white/50">Entry</span>
                  <p className="font-bold font-mono mt-1 ltr text-left">
                    {formatLevelPrice(manualPublishPreview.entry)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <span className="text-white/50">SL</span>
                  <p className="font-bold font-mono mt-1 text-rose-300 ltr text-left">
                    {formatLevelPrice(manualPublishPreview.stopLoss)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">TP</span>
                    {manualPublishPreview.takeProfits.length > 1 && (
                      <span className="text-[11px] font-medium text-white/40 font-mono">
                        {manualPublishPreview.takeProfits.length} :TP
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(168,127,243,0.55)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-300/45 [&::-webkit-scrollbar-thumb:hover]:bg-blue-300/65">
                    {manualPublishPreview.takeProfits.map((tp, index) => (
                      <div
                        key={`${tp}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-emerald-400/20 bg-emerald-500/5 px-2.5 py-1.5"
                      >
                        <span className="text-[11px] font-bold text-emerald-200/90">
                          TP{index + 1}
                        </span>
                        <span className="font-bold font-mono text-emerald-300 ltr text-left">
                          {formatLevelPrice(tp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {manualPublishPreview.description && (
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm leading-7 overflow-hidden">
                  <span className="text-white/50">{mergedConfig.labels.descriptionTitle}</span>
                  <p className="mt-1 text-white/90 whitespace-pre-wrap break-all [overflow-wrap:anywhere] max-h-24 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(168,127,243,0.55)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-300/45 [&::-webkit-scrollbar-thumb:hover]:bg-blue-300/65">
                    {manualPublishPreview.description}
                  </p>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter className="gap-3">
            <button
              onClick={handlePublishManual}
              disabled={isPublishing}
              className="inline-flex h-12 items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-200 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black shadow-[0_0_25px_-6px_rgba(16,185,129,0.8)] hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPublishing ? mergedConfig.labels.publishing : mergedConfig.labels.confirmTitle}
            </button>
            <AlertDialogCancel
              onClick={() => {
                setIsManualPublishConfirmOpen(false);
                setManualPublishPreview(null);
              }}
              className="h-12 border-white/20 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
            >
              {mergedConfig.labels.cancel}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile Timeframe Sheet */}
      {isMobileViewport && isTimeframeSheetOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-end justify-center animate-in fade-in duration-300">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsTimeframeSheetOpen(false)}
            />
            <div className="relative w-full max-w-md bg-[#05070F] border-t border-white/10 rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-6 text-center font-bold">انتخاب تایم‌فریم</h3>
              <div className="grid grid-cols-3 gap-3">
                {mergedConfig.availableTimeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => {
                      setManualTimeframe(tf.value);
                      setIsTimeframeSheetOpen(false);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 h-20 rounded-2xl border transition-all",
                      manualTimeframe === tf.value
                        ? "bg-[#542C85] border-[#A87FF3] text-white"
                        : "bg-white/5 border-white/10 text-white/50"
                    )}
                  >
                    <span className="text-lg font-bold">{tf.label}</span>
                    <span className="text-[10px] opacity-60">{tf.fullLabel}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsTimeframeSheetOpen(false)}
                className="w-full mt-6 h-14 rounded-2xl bg-white/5 text-white font-bold"
              >
                انصراف
              </button>
            </div>
          </div>,
          document.body
        )
      }

      {/* Mobile More Tools Sheet */}
      {isMobileViewport && isMoreToolsSheetOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-end justify-center animate-in fade-in duration-300">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsMoreToolsSheetOpen(false)}
            />
            <div className="relative w-full max-w-md bg-[#05070F] border-t border-white/10 rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-6 text-center">ابزارهای چارت</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    fetchChartData();
                    setIsMoreToolsSheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-5 h-16 rounded-2xl bg-white/5 border border-white/10 text-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#542C85]/20 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-[#A87FF3]" />
                    </div>
                    <span className="font-bold">بروزرسانی چارت</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 opacity-40" />
                </button>

                <button
                  onClick={() => {
                    setFitContentTrigger(prev => prev + 1);
                    setIsMoreToolsSheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-5 h-16 rounded-2xl bg-white/5 border border-white/10 text-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#542C85]/20 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-[#A87FF3]" />
                    </div>
                    <span className="font-bold">بازنشانی دید چارت</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 opacity-40" />
                </button>

                <button
                  onClick={() => {
                     setCreationMode("ai");
                     setIsMoreToolsSheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-5 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                      <X className="w-5 h-5" />
                    </div>
                    <span className="font-bold">خروج از حالت دستی</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 opacity-40" />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      }

      {toasts.length > 0 &&
        createPortal(
          <div
            className="fixed bottom-5 right-5 z-[120] space-y-2 w-[320px]"
            dir="rtl"
          >
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className="rounded-xl border border-[#A87FF3]/40 bg-[#542C85]/25 p-3 text-sm text-white shadow-xl backdrop-blur-md flex items-start gap-2"
              >
                {toast.kind === "success" ? (
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#CDB7FF]" />
                ) : (
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#CDB7FF]" />
                )}
                <p className="leading-6">{toast.message}</p>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
