import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
export function deepMerge<T extends object>(target: T, source: any): T {
  if (!source) return target;
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    const sourceObj = source as Record<string, any>;
    Object.keys(sourceObj).forEach((key) => {
      if (sourceObj[key] === undefined) return;
      if (isObject(sourceObj[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceObj[key] });
        } else {
          (output as any)[key] = deepMerge((target as any)[key], sourceObj[key]);
        }
      } else {
        Object.assign(output, { [key]: sourceObj[key] });
      }
    });
  }
  return output;
}

function isObject(item: any): item is object {
  return item && typeof item === "object" && !Array.isArray(item);
}
