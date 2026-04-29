"use client";

import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  pending: { label: "در انتظار", color: "#3b82f6" },
  active: { label: "فعال", color: "#14b8a6" },
  lost: { label: "از دست رفته", color: "#f59e0b" },
};

const colorMap: Record<string, string> = {
  "در انتظار": chartConfig.pending.color,
  فعال: chartConfig.active.color,
  "از دست رفته": chartConfig.lost.color,
};

function CustomTooltipContent({
  active,
  payload,
  className,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: { fill?: string };
    color?: string;
  }>;
  className?: string;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const color = item.payload?.fill || item.color;
  const name = item.name || "";
  const value = item.value || 0;

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-md",
        className,
      )}
    >
      <div className="flex w-full flex-wrap items-center gap-2">
        <div
          className="h-3 w-3 shrink-0 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-1 items-center justify-between gap-2">
          <span className="text-muted-foreground">{name}</span>
          <span className="font-mono font-semibold tabular-nums text-foreground">
            {value.toLocaleString("fa-IR")}
          </span>
        </div>
      </div>
    </div>
  );
}

export type ChartPieDonutTextProps = {
  data?: Array<{ name: string; value: number }>;
  isLoading?: boolean;
};

export function ChartPieDonutText({
  data: propData,
  isLoading = false,
}: ChartPieDonutTextProps) {
  const hasData = Boolean(propData && propData.length > 0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = React.useState({
    innerRadius: 140,
    outerRadius: 210,
  });

  React.useEffect(() => {
    const updateChartSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        let innerRadius = 80;
        let outerRadius = 120;
        if (width >= 640) {
          innerRadius = 140;
          outerRadius = 210;
        } else if (width >= 480) {
          innerRadius = 110;
          outerRadius = 165;
        }
        setChartSize({ innerRadius, outerRadius });
      }
    };
    updateChartSize();
    window.addEventListener("resize", updateChartSize);
    return () => window.removeEventListener("resize", updateChartSize);
  }, []);

  const chartData = React.useMemo(() => {
    if (hasData && propData) {
      return propData.map((item) => ({
        ...item,
        fill: colorMap[item.name] ?? chartConfig.pending.color,
      }));
    }
    return [];
  }, [hasData, propData]);

  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData],
  );

  const percentages = React.useMemo(
    () =>
      chartData.map((item) => ({
        ...item,
        percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
      })),
    [chartData, total],
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative flex min-h-[300px] w-full max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] px-6 py-8">
          <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[#14b8a6]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#3b82f6]/10 blur-3xl" />

          <div className="relative h-44 w-72 sm:w-80">
            <div className="absolute inset-x-0 bottom-0 mx-auto h-40 w-72 sm:w-80 rounded-t-[999px] border-[26px] border-b-0 border-white/10 animate-pulse" />
            <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 text-3xl font-black text-white/30 animate-pulse">
              …
            </div>
          </div>

          <div className="mt-2 flex w-full flex-wrap items-start justify-center gap-6 sm:gap-8 md:gap-12">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
                <div className="h-7 w-10 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-12 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex min-h-[300px] w-full max-w-full flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/[0.03]">
            <span className="text-2xl text-white/60">◌</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white/85">
              داده‌ای برای نمایش نمودار وجود ندارد
            </p>
            <p className="text-xs text-white/50">
              با تغییر بازه زمانی یا وضعیت، دوباره بررسی کنید
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full justify-center w-full">
      <div
        ref={containerRef}
        className="flex w-full max-w-full flex-col items-center"
      >
        <ChartContainer
          config={chartConfig}
          className="h-48 sm:h-56 md:h-60 w-full"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={chartSize.innerRadius}
              outerRadius={chartSize.outerRadius}
              stroke="none"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="text-after-edge"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl sm:text-2xl md:text-3xl font-bold"
                        >
                          {total.toLocaleString("fa-IR")}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={
                            (viewBox.cy || 0) +
                            (chartSize.innerRadius < 100 ? 20 : 24)
                          }
                          className="fill-muted-foreground text-xs sm:text-sm"
                        >
                          تعداد
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex w-full flex-col items-center gap-2 pt-2 text-sm">
          <div className="flex w-full flex-wrap items-start justify-center gap-6 sm:gap-8 md:gap-12 mt-2">
            {percentages.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-3 h-3 shrink-0",
                      item.name === "در انتظار" ? "rounded-full" : "rounded-sm",
                    )}
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="font-medium text-sm text-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-base text-foreground">
                  {item.value.toLocaleString("fa-IR")}
                </span>
                <span className="text-muted-foreground text-xs">
                  ({item.percentage.toLocaleString("fa-IR")}٪)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
