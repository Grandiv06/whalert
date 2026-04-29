"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number
): [number, number, number] {
  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDaysInMonth[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    return [jy, jm, 1 + (days % 31)];
  }
  jm = 7 + Math.floor((days - 186) / 30);
  return [jy, jm, 1 + ((days - 186) % 30)];
}

function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number
): [number, number, number] {
  jy += 1595;
  let days =
    -355668 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const gdm = [
    0, 31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ];
  let gm = 0;
  for (gm = 0; gm < 13 && gd > gdm[gm]; gm++) gd -= gdm[gm];
  return [gy, gm, gd];
}

function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  const rem = ((((jy - (jy > 0 ? 474 : 473)) % 2820) + 2820) % 2820) + 474;
  return ((rem + 38) * 682) % 2816 < 682 ? 30 : 29;
}

function getDayOfWeekJalali(jy: number, jm: number, jd: number): number {
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  return (new Date(gy, gm - 1, gd).getDay() + 1) % 7;
}

const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];
const persianWeekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function toPersianDigits(n: number | string): string {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/\d/g, (d) => map[parseInt(d)]);
}

export interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export function Calendar({ className, selected, onSelect }: CalendarProps) {
  const now = new Date();
  const [todayJy, todayJm, todayJd] = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
  const [initialJy, initialJm] = selected
    ? gregorianToJalali(
        selected.getFullYear(),
        selected.getMonth() + 1,
        selected.getDate()
      )
    : [todayJy, todayJm];

  const [viewYear, setViewYear] = React.useState(initialJy);
  const [viewMonth, setViewMonth] = React.useState(initialJm);

  const goNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const goPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const daysInMonth = jalaliMonthLength(viewYear, viewMonth);
  const firstDayOfWeek = getDayOfWeekJalali(viewYear, viewMonth, 1);
  const calendarCells: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const handleSelectDay = (day: number) => {
    if (!onSelect) return;
    const [gy, gm, gd] = jalaliToGregorian(viewYear, viewMonth, day);
    onSelect(new Date(gy, gm - 1, gd));
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    const [sJy, sJm, sJd] = gregorianToJalali(
      selected.getFullYear(),
      selected.getMonth() + 1,
      selected.getDate()
    );
    return sJy === viewYear && sJm === viewMonth && sJd === day;
  };

  const isToday = (day: number) =>
    todayJy === viewYear && todayJm === viewMonth && todayJd === day;

  return (
    <div className={cn("p-3 w-[280px]", className)}>
      <div className="flex items-center justify-between mb-4 px-1" dir="rtl">
        <Button variant="ghost" size="icon" onClick={goPrevMonth} className="h-7 w-7">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {persianMonths[viewMonth - 1]} {toPersianDigits(viewYear)}
        </span>
        <Button variant="ghost" size="icon" onClick={goNextMonth} className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {persianWeekDays.map((d) => (
          <span key={d} className="text-[0.8rem] text-muted-foreground">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((day, i) => {
          if (!day) return <div key={i} className="h-8 w-8" />;
          const selectedDay = isSelected(day);
          const today = isToday(day);
          return (
            <Button
              key={i}
              variant={selectedDay ? "default" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 p-0 font-normal text-sm",
                today && !selectedDay && "border border-primary"
              )}
              onClick={() => handleSelectDay(day)}
            >
              {toPersianDigits(day)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
