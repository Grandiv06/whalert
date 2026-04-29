"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import { INDICATOR_COLORS } from "@/lib/market/constants";
import type {
  IndicatorSet,
  IndicatorToggles,
  MarketCandle,
} from "@/types/market";

interface PriceChartProps {
  candles: MarketCandle[];
  indicators: IndicatorSet;
  toggles: IndicatorToggles;
}

export function PriceChart({ candles, indicators, toggles }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const candleData = useMemo(
    () =>
      candles.map((candle) => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      })),
    [candles],
  );

  const volumeData = useMemo(
    () =>
      candles.map((candle) => ({
        time: candle.time,
        value: candle.volume,
        color:
          candle.close >= candle.open
            ? "rgba(16, 185, 129, 0.45)"
            : "rgba(239, 68, 68, 0.45)",
      })),
    [candles],
  );

  const smaData = useMemo(
    () =>
      indicators.sma20
        .filter((point) => point.value != null)
        .map((point) => ({
          time: point.time,
          value: point.value as number,
        })),
    [indicators.sma20],
  );

  const emaData = useMemo(
    () =>
      indicators.ema20
        .filter((point) => point.value != null)
        .map((point) => ({
          time: point.time,
          value: point.value as number,
        })),
    [indicators.ema20],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#05070F" },
        textColor: "#9CA3AF",
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.08)" },
        horzLines: { color: "rgba(148, 163, 184, 0.08)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(148, 163, 184, 0.45)",
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: "rgba(148, 163, 184, 0.45)",
          style: LineStyle.Dashed,
        },
      },
      rightPriceScale: {
        borderColor: "rgba(148, 163, 184, 0.25)",
      },
      timeScale: {
        borderColor: "rgba(148, 163, 184, 0.25)",
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
      priceLineVisible: true,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "",
      priceLineVisible: false,
      lastValueVisible: false,
      base: 0,
    });

    chart.priceScale("").applyOptions({
      visible: true,
      scaleMargins: {
        top: 0.78,
        bottom: 0,
      },
    });

    const smaSeries = chart.addSeries(LineSeries, {
      color: INDICATOR_COLORS.sma,
      lineWidth: 2,
      priceLineVisible: false,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
    });

    const emaSeries = chart.addSeries(LineSeries, {
      color: INDICATOR_COLORS.ema,
      lineWidth: 2,
      priceLineVisible: false,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    smaSeriesRef.current = smaSeries;
    emaSeriesRef.current = emaSeries;

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !chartRef.current) return;

      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      smaSeriesRef.current = null;
      emaSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

    candleSeriesRef.current.setData(candleData);

    if (toggles.volume) {
      volumeSeriesRef.current.setData(volumeData);
      chartRef.current?.priceScale("").applyOptions({ visible: true });
    } else {
      volumeSeriesRef.current.setData([]);
      chartRef.current?.priceScale("").applyOptions({ visible: false });
    }

    chartRef.current?.timeScale().fitContent();
  }, [candleData, volumeData, toggles.volume]);

  useEffect(() => {
    if (!smaSeriesRef.current || !emaSeriesRef.current) return;

    smaSeriesRef.current.setData(toggles.sma ? smaData : []);
    emaSeriesRef.current.setData(toggles.ema ? emaData : []);
  }, [emaData, smaData, toggles.ema, toggles.sma]);

  return <div ref={containerRef} className="h-full w-full" />;
}
