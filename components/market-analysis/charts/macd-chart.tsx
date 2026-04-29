"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  ColorType,
  HistogramSeries,
  LineSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import { INDICATOR_COLORS } from "@/lib/market/constants";
import type { MacdPoint } from "@/types/market";

interface MacdChartProps {
  points: MacdPoint[];
}

export function MacdChart({ points }: MacdChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const histogramRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const macdLineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const signalLineRef = useRef<ISeriesApi<"Line"> | null>(null);

  const histogramData = useMemo(
    () =>
      points
        .filter((point) => point.histogram != null)
        .map((point) => ({
          time: point.time,
          value: point.histogram as number,
          color:
            (point.histogram as number) >= 0
              ? "rgba(16, 185, 129, 0.55)"
              : "rgba(239, 68, 68, 0.55)",
        })),
    [points],
  );

  const macdData = useMemo(
    () =>
      points
        .filter((point) => point.macd != null)
        .map((point) => ({
          time: point.time,
          value: point.macd as number,
        })),
    [points],
  );

  const signalData = useMemo(
    () =>
      points
        .filter((point) => point.signal != null)
        .map((point) => ({
          time: point.time,
          value: point.signal as number,
        })),
    [points],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#05070F" },
        textColor: "#94A3B8",
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.06)" },
        horzLines: { color: "rgba(148, 163, 184, 0.06)" },
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
      },
    });

    const histogram = chart.addSeries(HistogramSeries, {
      base: 0,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const macdLine = chart.addSeries(LineSeries, {
      color: INDICATOR_COLORS.macd,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const signalLine = chart.addSeries(LineSeries, {
      color: INDICATOR_COLORS.macdSignal,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    histogramRef.current = histogram;
    macdLineRef.current = macdLine;
    signalLineRef.current = signalLine;

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
      histogramRef.current = null;
      macdLineRef.current = null;
      signalLineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!histogramRef.current || !macdLineRef.current || !signalLineRef.current) return;

    histogramRef.current.setData(histogramData);
    macdLineRef.current.setData(macdData);
    signalLineRef.current.setData(signalData);

    chartRef.current?.timeScale().fitContent();
  }, [histogramData, macdData, signalData]);

  return <div ref={containerRef} className="h-full w-full" />;
}
