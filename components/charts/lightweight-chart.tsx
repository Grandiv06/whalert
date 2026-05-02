"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  LineStyle,
  CandlestickSeries,
  CrosshairMode,
  type CandlestickData,
  type IPriceLine,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCcw, Trash2, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export type ChartDataElement = CandlestickData<Time> & { value?: number };
export type ChartSelectionMode = "entry" | "tp" | "sl";
export type ChartTimeframeOption = { value: string; label: string };

const isSameTime = (left: Time, right: Time) => {
  if (typeof left === "object" && typeof right === "object") {
    return left.year === right.year && left.month === right.month && left.day === right.day;
  }
  return String(left) === String(right);
};

interface LightweightChartProps {
  data: ChartDataElement[];
  entryPoint?: number;
  stopLoss?: number;
  takeProfits?: number[];
  title?: string;
  side?: "LONG" | "SHORT";
  symbolLabel?: string;
  manualModeLabel?: string;
  timeframeOptions?: ChartTimeframeOption[];
  activeTimeframe?: string;
  onTimeframeChange?: (timeframeValue: string) => void;
  onToggleSelectionMode?: () => void;
  onSelectSelectionMode?: (mode: ChartSelectionMode) => void;
  selectedTpIndex?: number | null;
  onSelectTpIndex?: (index: number | null) => void;
  onRemoveTpIndex?: (index: number) => void;
  loading?: boolean;
  selectionMode?: ChartSelectionMode | null;
  onSelectPrice?: (payload: { mode: ChartSelectionMode; price: number }) => void;
  entryColor?: string;
  tpColor?: string;
  slColor?: string;
}

const DEFAULT_ENTRY_COLOR = "#38bdf8";
const DEFAULT_TP_COLOR = "#22c55e";
const DEFAULT_SL_COLOR = "#ef4444";
const HEX_COLOR_REGEX = /^#([\da-f]{3}|[\da-f]{6})$/i;
const normalizeColor = (color: string | undefined, fallbackColor: string) =>
  color && HEX_COLOR_REGEX.test(color) ? color : fallbackColor;

export function LightweightChart({
  data,
  entryPoint,
  stopLoss,
  takeProfits,
  title,
  side,
  manualModeLabel,
  timeframeOptions = [],
  activeTimeframe,
  onTimeframeChange,
  onToggleSelectionMode,
  onSelectSelectionMode,
  selectedTpIndex = null,
  onSelectTpIndex,
  onRemoveTpIndex,
  loading = false,
  selectionMode = null,
  onSelectPrice,
  entryColor = DEFAULT_ENTRY_COLOR,
  tpColor = DEFAULT_TP_COLOR,
  slColor = DEFAULT_SL_COLOR,
}: LightweightChartProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const linesRef = useRef<IPriceLine[]>([]);
  const selectionModeRef = useRef<ChartSelectionMode | null>(selectionMode);
  const onSelectPriceRef = useRef<LightweightChartProps["onSelectPrice"]>(onSelectPrice);
  const lastCrosshairPriceRef = useRef<number | null>(null);
  const tpScrollRef = useRef<HTMLDivElement | null>(null);
  const tpAutoScrollDelayRef = useRef<number | null>(null);
  const tpAutoScrollFrameRef = useRef<number | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<ChartDataElement | null>(null);
  const [canScrollTp, setCanScrollTp] = useState(false);
  const [tpAtStart, setTpAtStart] = useState(true);
  const [tpAtEnd, setTpAtEnd] = useState(true);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);
  const [fallbackFullscreenHeight, setFallbackFullscreenHeight] = useState(0);
  const { theme } = useTheme();

  const isDark = theme !== "light";
  const isIPhone = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iPhone|iPod/i.test(navigator.userAgent);
  }, []);
  const isFullscreen = isNativeFullscreen || isFallbackFullscreen;
  const useCssFullscreenFallback = isFallbackFullscreen;
  const latestCandle = useMemo(
    () => (data.length > 0 ? data[data.length - 1] : null),
    [data],
  );
  const normalizedTakeProfits = useMemo(() => {
    if (!takeProfits?.length) return [];
    return takeProfits.filter(
      (tp): tp is number => typeof tp === "number" && Number.isFinite(tp) && tp > 0,
    );
  }, [takeProfits]);
  const selectionModeLabel = useMemo(() => {
    if (selectionMode === "entry") return "انتخاب Entry";
    if (selectionMode === "tp") return "انتخاب TP";
    if (selectionMode === "sl") return "انتخاب SL";
    return "";
  }, [selectionMode]);
  const normalizedEntryColor = useMemo(
    () => normalizeColor(entryColor, DEFAULT_ENTRY_COLOR),
    [entryColor],
  );
  const normalizedTpColor = useMemo(
    () => normalizeColor(tpColor, DEFAULT_TP_COLOR),
    [tpColor],
  );
  const normalizedSlColor = useMemo(
    () => normalizeColor(slColor, DEFAULT_SL_COLOR),
    [slColor],
  );

  const activeCandle = useMemo(() => {
    if (!hoveredCandle) return latestCandle;
    const matched = data.find((candle) => isSameTime(candle.time, hoveredCandle.time));
    return matched ?? latestCandle;
  }, [data, hoveredCandle, latestCandle]);
  const formatPrice = (value?: number) =>
    typeof value === "number" && Number.isFinite(value)
      ? value.toLocaleString("en-US", { maximumFractionDigits: 2 })
      : "-";
  const formatCandleTime = (timestamp?: Time) => {
    if (!timestamp) return "--";
    const date = typeof timestamp === "number"
      ? new Date(Number(timestamp) * 1000)
      : typeof timestamp === "string"
        ? new Date(timestamp)
        : new Date(Date.UTC(timestamp.year, timestamp.month - 1, timestamp.day));

    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleString("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const priceDelta = useMemo(() => {
    if (!latestCandle) return { value: 0, percent: 0 };
    const open = latestCandle.open;
    const close = latestCandle.close;
    const value = close - open;
    const percent = open === 0 ? 0 : (value / open) * 100;
    return { value, percent };
  }, [latestCandle]);
  
  const toggleFullscreen = async () => {
    if (!rootRef.current) return;

    const canUseNativeFullscreen =
      typeof rootRef.current.requestFullscreen === "function" &&
      typeof document.exitFullscreen === "function";

    if (isFallbackFullscreen) {
      setIsFallbackFullscreen(false);
      return;
    }

    if (isNativeFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsFallbackFullscreen(false);
      }
      return;
    }

    if (isIPhone || !canUseNativeFullscreen) {
      setIsFallbackFullscreen(true);
      return;
    }

    try {
      await rootRef.current.requestFullscreen();
    } catch {
      setIsFallbackFullscreen(true);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!useCssFullscreenFallback) return;

    const updateHeight = () => {
      const nextHeight = window.visualViewport?.height ?? window.innerHeight;
      setFallbackFullscreenHeight(Math.round(nextHeight));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("resize", updateHeight);
    };
  }, [useCssFullscreenFallback]);

  useEffect(() => {
    selectionModeRef.current = selectionMode;
    onSelectPriceRef.current = onSelectPrice;
  }, [selectionMode, onSelectPrice]);

  useEffect(() => {
    const el = tpScrollRef.current;
    if (!el || selectionMode !== "tp") return;

    const updateScrollState = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const hasOverflow = maxScrollLeft > 2;
      setCanScrollTp(hasOverflow);
      setTpAtStart(el.scrollLeft <= 2);
      setTpAtEnd(el.scrollLeft >= maxScrollLeft - 2);
    };

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [selectionMode, normalizedTakeProfits.length]);

  const stopTpAutoScroll = () => {
    if (tpAutoScrollDelayRef.current !== null) {
      window.clearTimeout(tpAutoScrollDelayRef.current);
      tpAutoScrollDelayRef.current = null;
    }
    if (tpAutoScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(tpAutoScrollFrameRef.current);
      tpAutoScrollFrameRef.current = null;
    }
  };

  const startTpAutoScroll = (direction: "left" | "right") => {
    stopTpAutoScroll();

    tpAutoScrollDelayRef.current = window.setTimeout(() => {
      const step = direction === "right" ? 2.4 : -2.4;
      const tick = () => {
        const el = tpScrollRef.current;
        if (!el) {
          stopTpAutoScroll();
          return;
        }

        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, el.scrollLeft + step));
        el.scrollLeft = nextScrollLeft;

        const reachedStart = nextScrollLeft <= 0;
        const reachedEnd = nextScrollLeft >= maxScrollLeft;
        if ((direction === "left" && reachedStart) || (direction === "right" && reachedEnd)) {
          stopTpAutoScroll();
          return;
        }

        tpAutoScrollFrameRef.current = window.requestAnimationFrame(tick);
      };

      tpAutoScrollFrameRef.current = window.requestAnimationFrame(tick);
    }, 500);
  };

  useEffect(() => {
    return () => {
      stopTpAutoScroll();
    };
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight || 400
        });
      }
    });

    const container = chartContainerRef.current;
    resizeObserver.observe(container);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight || 400,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: isDark ? "#A39CB1" : "#111111",
        fontSize: isMobile ? 10 : 12,
      },
      grid: {
        vertLines: { color: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.04)" },
        horzLines: { color: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.04)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { width: 1, color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", style: LineStyle.LargeDashed },
        horzLine: { width: 1, color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", style: LineStyle.LargeDashed },
      },
      timeScale: {
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.1)",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.1)",
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });
    seriesRef.current = candlestickSeries;

    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      const barData = param.seriesData.get(candlestickSeries);
      if (param.point) {
        const crosshairPrice = candlestickSeries.coordinateToPrice(param.point.y);
        lastCrosshairPriceRef.current =
          typeof crosshairPrice === "number" && Number.isFinite(crosshairPrice) && crosshairPrice > 0
            ? crosshairPrice
            : null;
      }
      if (!barData || !("open" in barData)) {
        setHoveredCandle(null);
        return;
      }

      setHoveredCandle({
        time: barData.time,
        open: barData.open,
        high: barData.high,
        low: barData.low,
        close: barData.close,
      });
    };
    const handleChartClick = (param: MouseEventParams<Time>) => {
      const activeMode = selectionModeRef.current;
      const onSelect = onSelectPriceRef.current;
      if (!activeMode || !onSelect || !param.point) return;
      const clickedPrice = candlestickSeries.coordinateToPrice(param.point.y);
      if (typeof clickedPrice !== "number" || !Number.isFinite(clickedPrice) || clickedPrice <= 0) {
        return;
      }
      onSelect({
        mode: activeMode,
        price: clickedPrice,
      });
    };

    const handleTouchEnd = () => {
      const activeMode = selectionModeRef.current;
      const onSelect = onSelectPriceRef.current;
      const touchPrice = lastCrosshairPriceRef.current;
      if (!activeMode || !onSelect || touchPrice == null) return;
      onSelect({
        mode: activeMode,
        price: touchPrice,
      });
    };
    chart.subscribeCrosshairMove(handleCrosshairMove);
    chart.subscribeClick(handleChartClick);
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      resizeObserver.disconnect();
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.unsubscribeClick(handleChartClick);
      container.removeEventListener("touchend", handleTouchEnd);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      linesRef.current = [];
      setHoveredCandle(null);
    };
  }, [isDark]);

  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(data);
    if (data.length > 0) {
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  useEffect(() => {
    if (!seriesRef.current) return;
    const series = seriesRef.current;

    linesRef.current.forEach((line) => series.removePriceLine(line));
    linesRef.current = [];

    if (entryPoint && entryPoint > 0) {
      const line = series.createPriceLine({
        price: entryPoint,
        color: normalizedEntryColor,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: side === "SHORT" ? "Entry Short" : "Entry Long",
      });
      linesRef.current.push(line);
    }

    if (stopLoss && stopLoss > 0) {
      const line = series.createPriceLine({
        price: stopLoss,
        color: normalizedSlColor,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: "Stop Loss",
      });
      linesRef.current.push(line);
    }

    normalizedTakeProfits.forEach((tp, i) => {
      const isSelectedTp = selectedTpIndex === i;
      const line = series.createPriceLine({
        price: tp,
        color: isSelectedTp
          ? (isDark ? "rgba(52, 211, 153, 1)" : "rgba(5, 150, 105, 1)")
          : normalizedTpColor,
        lineWidth: isSelectedTp ? 2 : 2,
        lineStyle: isSelectedTp ? LineStyle.Dashed : LineStyle.Solid,
        axisLabelVisible: true,
        title: `TP${i + 1}`,
      });
      linesRef.current.push(line);
    });
  }, [
    entryPoint,
    stopLoss,
    normalizedTakeProfits,
    selectedTpIndex,
    side,
    normalizedEntryColor,
    normalizedTpColor,
    normalizedSlColor,
    isDark,
  ]);

  const handleFitContent = () => {
    chartRef.current?.timeScale().fitContent();
  };

  const chartBody = (
    <div
      className={`w-full h-full relative overflow-hidden rounded-xl ${
        isFullscreen ? "rounded-none" : ""
      } ${
        selectionMode ? "cursor-cell" : "cursor-crosshair"
      }`}
    >
      <div
        className="absolute inset-x-3 top-3 z-20 flex items-start gap-3 pointer-events-none"
        dir="ltr"
      >
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {manualModeLabel && (
            <button
              type="button"
              onClick={onToggleSelectionMode}
              className={`h-7 md:h-8 px-2 md:px-3 inline-flex items-center rounded-lg border text-[10px] md:text-[11px] font-medium transition-colors cursor-pointer ${
                selectionMode
                  ? "border-[#A87FF3]/70 bg-[#542C85]/40 text-white"
                  : "border-[#542C85]/40 bg-[#542C85]/15 text-[#C2A8FF] hover:bg-[#542C85]/30"
              }`}
            >
              {selectionMode ? "خروج از حالت دستی" : manualModeLabel}
            </button>
          )}
          {selectionMode && (
            <div className="h-7 md:h-8 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#02000B]/75 px-1 cursor-pointer">
              <button
                type="button"
                onClick={() => onSelectSelectionMode?.("entry")}
                className={`h-5 md:h-6 rounded-md px-1.5 md:px-2.5 text-[9px] md:text-[10px] transition-colors cursor-pointer ${
                  selectionMode === "entry"
                    ? "bg-sky-500/25 text-sky-100 border border-sky-400/40"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                Entry
              </button>
              <button
                type="button"
                onClick={() => onSelectSelectionMode?.("tp")}
                className={`h-5 md:h-6 rounded-md px-1.5 md:px-2.5 text-[9px] md:text-[10px] transition-colors cursor-pointer ${
                  selectionMode === "tp"
                    ? "bg-emerald-500/25 text-emerald-100 border border-emerald-400/40"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                TP
              </button>
              <button
                type="button"
                onClick={() => onSelectSelectionMode?.("sl")}
                className={`h-5 md:h-6 rounded-md px-1.5 md:px-2.5 text-[9px] md:text-[10px] transition-colors cursor-pointer ${
                  selectionMode === "sl"
                    ? "bg-rose-500/25 text-rose-100 border border-rose-400/40"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                SL
              </button>
            </div>
          )}
          {selectionMode === "tp" && normalizedTakeProfits.length > 0 && (
            <div className="relative inline-flex items-center">
              <div
                ref={tpScrollRef}
                className="h-7 md:h-8 max-w-[120px] md:max-w-[144px] inline-flex items-center gap-1 rounded-lg border border-emerald-400/20 bg-[#02000B]/75 px-1 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-thin"
              >
                {normalizedTakeProfits.map((_, index) => {
                  const isSelected = selectedTpIndex === index;
                  return (
                    <button
                      key={`tp-select-${index}`}
                      type="button"
                      onClick={() => onSelectTpIndex?.(isSelected ? null : index)}
                      className={`h-5 md:h-6 min-w-[36px] md:min-w-[42px] shrink-0 rounded-md px-0.5 md:px-1 text-[9px] md:text-[10px] transition-colors ${
                        isSelected
                          ? "bg-emerald-500/25 text-emerald-100 border border-emerald-400/50"
                          : "text-emerald-200/75 hover:bg-emerald-500/15 hover:text-emerald-100"
                      }`}
                    >
                      {`TP${index + 1}`}
                    </button>
                  );
                })}
              </div>
              {canScrollTp && !tpAtStart && (
                <div className="pointer-events-none absolute inset-y-[2px] left-[1px] w-4 rounded-l-md bg-gradient-to-r from-[#02000B] to-transparent" />
              )}
              {canScrollTp && !tpAtEnd && (
                <div className="pointer-events-none absolute inset-y-[2px] right-[1px] w-4 rounded-r-md bg-gradient-to-l from-[#02000B] to-transparent" />
              )}
              {canScrollTp && !tpAtStart && (
                <button
                  type="button"
                  onMouseEnter={() => startTpAutoScroll("left")}
                  onMouseLeave={stopTpAutoScroll}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-200/70 hover:text-emerald-100 transition-colors"
                  aria-label="اسکرول به چپ"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              {canScrollTp && !tpAtEnd && (
                <button
                  type="button"
                  onMouseEnter={() => startTpAutoScroll("right")}
                  onMouseLeave={stopTpAutoScroll}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-200/70 hover:text-emerald-100 transition-colors"
                  aria-label="اسکرول به راست"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
          {selectionMode === "tp" && selectedTpIndex !== null && (
            <div className="h-7 md:h-8 inline-flex items-center gap-1 rounded-lg border border-rose-400/25 bg-rose-500/10 px-1">
              <button
                type="button"
                onClick={() => onRemoveTpIndex?.(selectedTpIndex)}
                className="h-6 w-6 inline-flex items-center justify-center rounded-md text-rose-200 hover:bg-rose-500/25 transition-colors"
                title="حذف TP انتخاب‌شده"
                aria-label="حذف TP انتخاب‌شده"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelectTpIndex?.(null)}
                className="h-6 w-6 inline-flex items-center justify-center rounded-md text-rose-200 hover:bg-white/10 transition-colors"
                title="خروج از انتخاب TP"
                aria-label="خروج از انتخاب TP"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {timeframeOptions.length > 0 && (
            <div
              className="h-7 md:h-8 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#02000B]/65 px-1 font-mono [font-variant-numeric:tabular-nums] cursor-pointer"
              dir="ltr"
              lang="en"
            >
              {timeframeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onTimeframeChange?.(option.value)}
                  lang="en"
                  className={`h-5 md:h-6 rounded-md px-1.5 md:px-2.5 text-[9px] md:text-[10px] transition-colors font-mono cursor-pointer ${
                    activeTimeframe === option.value
                      ? "bg-[#542C85] text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
          {title && (
            <span className="h-7 md:h-8 px-2 md:px-3 inline-flex items-center rounded-lg border border-white/10 bg-[#02000B]/70 text-white/85 text-[10px] md:text-xs font-semibold ms-1 md:ms-2 cursor-pointer">
              {title}
            </span>
          )}
          <button
            onClick={handleFitContent}
            type="button"
            className="h-7 md:h-8 w-7 md:w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-[#02000B]/70 hover:bg-[#542C85]/30 text-white/80 transition-colors cursor-pointer"
            aria-label="بازنشانی دید"
            title="بازنشانی دید"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            type="button"
            className="h-7 md:h-8 w-7 md:w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-[#02000B]/70 hover:bg-[#542C85]/30 text-white/80 transition-colors cursor-pointer"
            aria-label={isFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
            title={isFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="hidden md:block absolute left-2 bottom-8 z-20 bg-[#02000B]/96 border border-white/10 backdrop-blur-xl rounded-lg p-2.5 pointer-events-none shadow-[0_8px_24px_-12px_rgba(0,0,0,0.92)]">
        <div className="flex items-center gap-2 text-[11px] mb-1.5 text-white/70" dir="ltr">
          <span>{formatCandleTime(activeCandle?.time)}</span>
          {latestCandle && (
            <span
              className={
                priceDelta.value >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }
            >
              {priceDelta.value >= 0 ? "+" : ""}
              {priceDelta.percent.toFixed(2)}%
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-white/75" dir="ltr">
          <span>O: {formatPrice(activeCandle?.open)}</span>
          <span>H: {formatPrice(activeCandle?.high)}</span>
          <span>L: {formatPrice(activeCandle?.low)}</span>
          <span>C: {formatPrice(activeCandle?.close)}</span>
        </div>
      </div>

      {selectionMode && (
        <div className="absolute right-[4.5rem] bottom-8 z-20 pointer-events-none">
          <div className="rounded-lg border border-[#A87FF3]/40 bg-[#542C85]/20 px-3 py-1.5 text-[11px] text-[#E9DDFF]">
            {selectionModeLabel} فعال است. روی چارت کلیک کنید.
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#542C85]/5 to-transparent pointer-events-none rounded-xl" />

      <div ref={chartContainerRef} className="w-full h-full relative z-10" />

      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#02000B]/45 backdrop-blur-[2px]">
          <div className="px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white/75 text-sm">
            در حال دریافت دیتای چارت...
          </div>
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white/75 text-sm">
            دیتایی برای نمایش وجود ندارد.
          </div>
        </div>
      )}
    </div>
  );

  if (useCssFullscreenFallback && typeof document !== "undefined") {
    return createPortal(
      <div
        ref={rootRef}
        className="fixed inset-0 z-[9999] bg-[#05070F]"
        style={{
          width: "100vw",
          height:
            fallbackFullscreenHeight > 0
              ? `${fallbackFullscreenHeight}px`
              : "100dvh",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {chartBody}
      </div>
      ,
      document.body,
    );
  }

  return (
    <div
      ref={rootRef}
      className={`w-full h-full relative ${isFullscreen ? "fixed inset-0 z-[9999] bg-[#05070F]" : ""}`}
    >
      {chartBody}
    </div>
  );
}
