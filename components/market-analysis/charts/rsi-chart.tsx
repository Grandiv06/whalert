"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  ColorType,
  LineSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
} from "lightweight-charts";
import { INDICATOR_COLORS } from "@/lib/market/constants";
import type { IndicatorPoint } from "@/types/market";

interface RsiChartProps {
  points: IndicatorPoint[];
}

export function RsiChart({ points }: RsiChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);

  const lineData = useMemo(
    () =>
      points
        .filter((point) => point.value != null)
        .map((point) => ({
          time: point.time,
          value: point.value as number,
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

    const series = chart.addSeries(LineSeries, {
      color: INDICATOR_COLORS.rsi,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    priceLinesRef.current = [
      series.createPriceLine({
        price: 70,
        color: "rgba(239, 68, 68, 0.6)",
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: "70",
        axisLabelVisible: false,
      }),
      series.createPriceLine({
        price: 30,
        color: "rgba(16, 185, 129, 0.6)",
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: "30",
        axisLabelVisible: false,
      }),
    ];

    chartRef.current = chart;
    seriesRef.current = series;

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
      seriesRef.current = null;
      priceLinesRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(lineData);
    chartRef.current?.timeScale().fitContent();
  }, [lineData]);

  return <div ref={containerRef} className="h-full w-full" />;
}
