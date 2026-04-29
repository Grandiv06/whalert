"use client";

import * as React from "react";
import { format } from "date-fns-jalali";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

function toPersianDigits(n: string) {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.replace(/\d/g, (d) => map[parseInt(d)]);
}

interface DateRangeTwoButtonsProps {
  fromDate?: Date | null;
  toDate?: Date | null;
  onChange?: (value: { fromDate?: Date | null; toDate?: Date | null }) => void;
}

function DateButton({
  label,
  date,
  onSelect,
  className,
}: {
  label: string;
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const displayDate = date ? toPersianDigits(format(date, "yyyy/MM/dd")) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-10 md:h-12 min-w-[130px] px-4 md:px-6 rounded-2xl flex items-center justify-center gap-2",
            "bg-[#542C85] text-white font-medium transition-all cursor-pointer",
            "hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
            displayDate ? "py-1" : "text-base",
            className
          )}
        >
          {displayDate ? (
            <div className="flex flex-col items-center leading-tight">
              <span className="text-[10px] opacity-80 font-normal">{label}</span>
              <span className="text-base font-bold">{displayDate}</span>
            </div>
          ) : (
            <span>{label}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none rounded-xl" align="center" sideOffset={8}>
        <div className="bg-white dark:bg-[#1a0a2e] rounded-xl border border-purple-100 dark:border-purple-500/20 shadow-2xl overflow-hidden">
          <Calendar
            selected={date}
            onSelect={(d) => {
              onSelect(d);
              setOpen(false);
            }}
            className="p-3"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DateRangeTwoButtons({
  fromDate,
  toDate,
  onChange,
}: DateRangeTwoButtonsProps) {
  const handleChange = (newFrom: Date | undefined, newTo: Date | undefined) => {
    let finalFrom = newFrom;
    let finalTo = newTo;
    if (finalFrom && finalTo && finalFrom > finalTo) {
      [finalFrom, finalTo] = [finalTo, finalFrom];
    }
    onChange?.({ fromDate: finalFrom ?? null, toDate: finalTo ?? null });
  };

  return (
    <div
      className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 shrink-0 w-full md:w-auto"
      dir="rtl"
    >
      <DateButton
        label="از تاریخ"
        date={fromDate ?? undefined}
        onSelect={(d) => handleChange(d, toDate ?? undefined)}
        className="w-full min-w-0 md:w-[130px] md:min-w-[130px] lg:w-[150px] shrink-0"
      />
      <DateButton
        label="تا تاریخ"
        date={toDate ?? undefined}
        onSelect={(d) => handleChange(fromDate ?? undefined, d)}
        className="w-full min-w-0 md:w-[130px] md:min-w-[130px] lg:w-[150px] shrink-0"
      />
    </div>
  );
}
