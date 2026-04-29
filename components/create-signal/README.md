# کامپوننت قدرتمند ساخت سیگنال (CreateSignalContent)

این کامپوننت یک ماژول کاملاً مستقل و قابل‌حمل (Portable) برای پروژه‌های معاملاتی است که دو قابلیت کلیدی را ترکیب می‌کند:
1.  **استخراج هوشمند سیگنال**: تحلیل و استخراج خودکار سطوح (Entry, TP, SL) از لینک‌های چارت TradingView با استفاده از هوش مصنوعی.
2.  **ساخت دستی روی چارت**: یک محیط تعاملی با استفاده از `lightweight-charts` برای تعیین دقیق سطوح معاملاتی.

---

## 🚀 ویژگی‌های کلیدی

-   **Portable & Decoupled**: کاملاً مستقل از Router، Context یا APIهای خاص پروژه. تمام وابستگی‌ها از طریق Props تزریق می‌شوند.
-   **Config-Driven Design**: تمام متن‌ها (Labels)، پیام‌ها (Messages)، قوانین اعتبارسنجی (Validation Rules) و مقادیر پیش‌فرض از بیرون قابل تنظیم هستند.
-   **Deep Customization**: استفاده از سیستم `Deep Merge` که اجازه می‌دهد فقط بخش‌های مورد نیاز از تنظیمات را تغییر دهید و بقیه از مقادیر پیش‌فرض (Persian/Gold Standard) استفاده کنند.
-   **Dual Layout Modes**: پشتیبانی از حالت نمایش معمولی (Default) و حالت متمرکز بر چارت (Focus/Wide Chart).
-   **RTL & LTR Support**: بهینه‌سازی شده برای محیط‌های راست‌چین با اعداد فارسی/انگلیسی خودکار.

---

## 🛠 نصب و وابستگی‌ها

برای استفاده از این کامپوننت در یک پروژه جدید، موارد زیر را کپی کنید:

1.  **فایل اصلی**: `components/create-signal/create-signal-content.tsx`
2.  **چارت**: `components/charts/lightweight-chart.tsx`
3.  **کتابخانه‌ها**:
    -   `lucide-react` (آیکون‌ها)
    -   `lightweight-charts` (موتور چارت)
4.  **پیش‌نیازهای UI (Shadcn)**:
    -   Button, Input, Card, AlertDialog, Tooltip
5.  **توابع کمکی**:
    -   `lib/utils.ts`: توابع `cn`, `toPersianDigits`, `toEnglishDigits` و `deepMerge`.

---

## 📖 راهنمای Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `services` | `CreateSignalServices` | **اجباری**. متدهای ارتباط با API (چارت و ثبت). |
| `config` | `CreateSignalConfig` | اختیاری. برای شخصی‌سازی تمام رفتارها و متون. |
| `isDark` | `boolean` | حالت دارک/لایت (پیش‌فرض: `true`). |
| `pathname` | `string` | مسیر جاری برای کنترل دکمه Back. |
| `onAnalyzingChange` | `(val: boolean) => void` | اعلام وضعیت در حال پردازش AI به والد. |
| `onLeaveModalRequest` | `(req: ...) => void` | مدیریت خروج از صفحه در حالت پردازش. |

---

## ⚙️ ساختار تنظیمات (Config)

شما می‌توانید شیء `config` را برای تغییر رفتارهای زیر پاس دهید:

### ۱. قوانین اعتبارسنجی (Validation)
```tsx
validation: {
  minEntryPrice: 0,
  requireTakeProfit: true,
  requireStopLoss: true,
  maxDistanceFromEntryPercent: {
    takeProfit: 50, // حداکثر فاصله مجاز TP از ورودی
    stopLoss: 20    // حداکثر فاصله مجاز SL از ورودی
  }
}
```

### ۲. بومی‌سازی (Labels & Messages)
تمام رشته‌های متنی از جمله عنوان‌ها، Placeholders و Tooltipها از طریق `config.labels` و پیام‌های خطا/موفقیت از طریق `config.messages` قابل تغییر هستند.

---

## 💻 نمونه پیاده‌سازی (Adapter)

```tsx
import { CreateSignalContent } from "@/components/create-signal/create-signal-content";

const myServices = {
  getDynamicPrice: async (symbol, tf, from, to) => { /* fetch from your API */ },
  fetchDataFromImageFromUrl: async (payload) => { /* call AI service */ },
  submitSignalFromUserInput: async (payload) => { /* save manual signal */ },
  // ...
};

const myCustomConfig = {
  defaults: { symbol: "XAUUSD", timeframe: "1H" },
  validation: { requireDescription: true },
  labels: { submit: "تایید و ارسال سیگنال" }
};

export default function CreateSignalPage() {
  return (
    <CreateSignalContent 
      services={myServices}
      config={myCustomConfig}
      pathname="/create"
    />
  );
}
```

---

## 📝 نکات فنی

-   **DeepRequired Helper**: این کامپوننت از یک تایپ کمکی برای اطمینان از وجود تمام فیلدهای Config در زمان رندر استفاده می‌کند.
-   **Memoization**: تنظیمات ورودی با استفاده از `useMemo` با تنظیمات پیش‌فرض ترکیب می‌شوند تا از رندرهای اضافی جلوگیری شود.
-   **RTL Layout**: در حالت چارت دستی، تمام مودال‌ها و پیام‌ها به صورت RTL و با استایل Glassmorphism رندر می‌شوند.
---

## 🤖 راهنمای استفاده برای هوش مصنوعی (AI Integration Prompt)

اگر می‌خواهید از یک دستیار هوش مصنوعی (مثل Cursor یا ChatGPT) برای نصب این کامپوننت کمک بگیرید، این متن را برایش بفرستید:

> "I have a portable 'CreateSignalContent' component. Please integrate it into my project:
> 1.  **Files**: The component is at `@/components/create-signal/create-signal-content`.
> 2.  **Services**: Implement an adapter for the `services` prop using my project's API (getDynamicPrice, submitSignal, etc.).
> 3.  **Config**: Use the `config` prop to customize symbols, timeframe options, and validation rules (like min/max price distances) if needed.
> 4.  **UI**: Ensure Shadcn UI components and `lightweight-charts` are set up. The component is RTL-ready, so ensure the page container supports it."
