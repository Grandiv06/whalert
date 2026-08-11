import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse a backend UTC datetime string.
 * Many APIs send `2026-08-12T10:46:00` without `Z`; browsers treat that as local time.
 * This forces UTC when no timezone offset is present.
 */
export function parseUtcDate(value: string): Date {
  const trimmed = value.trim().replace(" ", "T");
  if (/[zZ]$/.test(trimmed) || /[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return new Date(trimmed);
  }
  return new Date(`${trimmed}Z`);
}

/** Convert ASCII digits to Persian digits (for RTL display). */
export function toPersianDigits(str: string | number): string {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;
  return String(str).replace(/\d/g, (d) => map[parseInt(d, 10)] ?? d);
}

/** Convert Persian/Arabic digits to English (including decimal separator) */
export function toEnglishDigits(str: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  return str
    .replace(/[۰-۹٠-٩]/g, (d) => {
      const idx = persian.indexOf(d);
      if (idx !== -1) return String(idx);
      return String(arabic.indexOf(d));
    })
    .replace(/[٫٬]/g, ".");
}

/** Normalize Arabic forms of Persian letters for consistent UI rendering. */
export function normalizePersianText(str: string): string {
  return str
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c+/g, "\u200c");
}

/** Deeply merge two objects. */
export function deepMerge<T extends object>(target: T, source: unknown): T {
  if (source == null) return target;
  if (!isObject(source)) return target;

  // `target` یک آبجکت جنریکه؛ spread نتیجه از نظر TS الزاماً index signature نداره.
  // برای مپ‌کردن کلیدها، نوع خروجی رو به صورت امن cast می‌کنیم.
  const output = { ...target } as Record<string, unknown>;

  const sourceObj = source;
  Object.keys(sourceObj).forEach((key) => {
    const sourceValue = sourceObj[key];
    if (sourceValue === undefined) return;

    if (isObject(sourceValue)) {
      const targetValue = (target as Record<string, unknown>)[key];

      if (targetValue !== undefined && isObject(targetValue)) {
        output[key] = deepMerge(targetValue as object, sourceValue);
      } else {
        output[key] = sourceValue;
      }
      return;
    }

    output[key] = sourceValue;
  });

  return output as T;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item != null && typeof item === "object" && !Array.isArray(item);
}
