"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<string, string>;
  };
};

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within ChartContainer");
  return ctx;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none",
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipPayloadItem = {
  name?: string;
  value?: unknown;
  dataKey?: string;
  color?: string;
  payload?: Record<string, unknown>;
};

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string;
  hideLabel?: boolean;
  labelFormatter?: (
    label: string,
    payload: ChartTooltipPayloadItem[],
  ) => React.ReactNode;
  valueFormatter?: (value: unknown, dataKey?: string) => React.ReactNode;
  nameFormatter?: (
    name: string,
    dataKey: string | undefined,
    payload: ChartTooltipPayloadItem[],
  ) => React.ReactNode;
}

function formatChartNumber(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });
}

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  labelFormatter,
  valueFormatter,
  nameFormatter,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  const resolvedLabel = labelFormatter
    ? labelFormatter(label ?? "", payload)
    : label;

  const formatValue = (value: unknown, dataKey?: string) => {
    if (valueFormatter) return valueFormatter(value, dataKey);
    if (typeof value === "number") return formatChartNumber(value);
    return String(value ?? "-");
  };

  const formatName = (entry: ChartTooltipPayloadItem) => {
    const dataKey = entry.dataKey;
    const fallbackName = entry.name ?? dataKey ?? "";
    if (nameFormatter) {
      return nameFormatter(fallbackName, dataKey, payload);
    }
    if (dataKey && config[dataKey]?.label) return config[dataKey].label;
    return fallbackName;
  };

  return (
    <div
      className="rounded-lg border bg-background px-3 py-2 shadow-md text-right"
      dir="rtl"
    >
      {!hideLabel && resolvedLabel ? (
        <p className="mb-2 text-sm font-medium">{resolvedLabel}</p>
      ) : null}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={entry.dataKey ?? i} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {formatName(entry)}:{" "}
              <span className="font-mono font-semibold tabular-nums text-foreground">
                {formatValue(entry.value, entry.dataKey)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  formatChartNumber,
  useChart,
};
export type { ChartTooltipPayloadItem };
