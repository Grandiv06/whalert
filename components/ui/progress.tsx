"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

type ProgressSegment = {
  value: number;
  label?: string;
  color?: string;
};

type DualProgressProps = React.ComponentPropsWithoutRef<"div"> & {
  segments: [ProgressSegment, ProgressSegment];
  showLabels?: boolean;
  showValues?: boolean;
  showCounts?: boolean;
  valueFormatter?: (value: number) => string;
};

const DualProgress = React.forwardRef<HTMLDivElement, DualProgressProps>(
  (
    {
      className,
      segments,
      showLabels = true,
      showValues = true,
      showCounts = false,
      valueFormatter,
      ...props
    },
    ref
  ) => {
    const [first, second] = segments;
    const totalValue = first.value + second.value;
    const firstPercentage = totalValue > 0 ? (first.value / totalValue) * 100 : 0;
    const secondPercentage = totalValue > 0 ? (second.value / totalValue) * 100 : 0;
    const formatValue = valueFormatter || ((val: number) => val.toLocaleString("fa-IR"));

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabels && (
          <div className="flex flex-row-reverse items-center justify-between mb-2 text-sm">
            <div className="flex items-center gap-2">
              {first.label && (
                <>
                  <span className="font-medium text-foreground">{first.label}</span>
                  <div
                    className="w-1 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: first.color || "hsl(var(--chart-1))" }}
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {second.label && (
                <>
                  <div
                    className="w-1 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: second.color || "hsl(var(--chart-2))" }}
                  />
                  <span className="font-medium text-foreground">{second.label}</span>
                </>
              )}
            </div>
          </div>
        )}
        <div className="relative flex-row-reverse h-4 w-full overflow-hidden rounded-md bg-secondary flex">
          <div
            className="h-full transition-all"
            style={{
              width: `${firstPercentage}%`,
              backgroundColor: first.color || "hsl(var(--chart-1))",
            }}
          />
          <div
            className="h-full transition-all"
            style={{
              width: `${secondPercentage}%`,
              backgroundColor: second.color || "hsl(var(--chart-2))",
            }}
          />
        </div>
        {(showCounts || showValues) && (
          <div className="flex flex-row-reverse items-center justify-between mt-2 text-sm">
            <div className="flex flex-col gap-0.5 items-start">
              {showValues && showCounts && (
                <>
                  <span className="font-bold">{firstPercentage.toFixed(1)}٪</span>
                  <span className="text-muted-foreground text-xs">
                    {formatValue(first.value)} موقعیت
                  </span>
                </>
              )}
              {showValues && !showCounts && (
                <span className="font-bold">{firstPercentage.toFixed(1)}٪</span>
              )}
              {!showValues && showCounts && (
                <span className="font-bold text-xs">{formatValue(first.value)} موقعیت</span>
              )}
            </div>
            <div className="flex flex-col gap-0.5 items-end">
              {showValues && showCounts && (
                <>
                  <span className="font-bold">{secondPercentage.toFixed(1)}٪</span>
                  <span className="text-muted-foreground text-xs">
                    {formatValue(second.value)} موقعیت
                  </span>
                </>
              )}
              {showValues && !showCounts && (
                <span className="font-bold">{secondPercentage.toFixed(1)}٪</span>
              )}
              {!showValues && showCounts && (
                <span className="font-bold text-xs">{formatValue(second.value)} موقعیت</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
DualProgress.displayName = "DualProgress";

export { Progress, DualProgress };
