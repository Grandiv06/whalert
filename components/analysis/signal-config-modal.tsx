"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, TestTube, Zap, Plus, Minus } from "lucide-react";
import { cn, toEnglishDigits } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface SignalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: SignalConfig) => void | Promise<void>;
  initialConfig?: SignalConfig;
  providerName?: string;
}

export interface SignalConfig {
  margin: number;
  autoRegisterPosition: boolean;
  executionType: "Demo" | "Real";
}

const DEFAULT_CONFIG: SignalConfig = {
  margin: 0.2,
  autoRegisterPosition: false,
  executionType: "Demo",
};

function SignalConfigForm({
  initialConfig,
  onSave,
  onClose,
  providerName,
}: {
  initialConfig: SignalConfig;
  onSave: (config: SignalConfig) => void | Promise<void>;
  onClose: () => void;
  providerName?: string;
}) {
  const [localConfig, setLocalConfig] = useState<SignalConfig>(initialConfig);
  const [marginInput, setMarginInput] = useState<string>(
    initialConfig.margin.toString()
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { theme } = useTheme();

  const validateMargin = (value: string): boolean => {
    const normalized = toEnglishDigits(value);
    const num = parseFloat(normalized);
    if (isNaN(num)) {
      setError("لطفاً فقط عدد وارد کنید.");
      return false;
    }
    if (num < 0.01 || num > 1.0) {
      setError("مقدار مارجین باید بین ۰.۰۱ و ۱.۰ باشد.");
      return false;
    }
    if (normalized.includes(".") && normalized.split(".")[1].length > 2) {
      setError("حداکثر ۲ رقم اعشار مجاز است.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMarginInput(val);
    if (val) {
      validateMargin(val);
    } else {
      setError("لطفاً مقدار مارجین را وارد کنید.");
    }
  };

  const handleIncrement = () => {
    let current = parseFloat(toEnglishDigits(marginInput));
    if (isNaN(current)) current = 0;
    const next = Math.min(1.0, current + 0.01);
    const nextStr = next.toFixed(2);
    setMarginInput(nextStr);
    validateMargin(nextStr);
    setLocalConfig((prev) => ({ ...prev, margin: next }));
  };

  const handleDecrement = () => {
    let current = parseFloat(toEnglishDigits(marginInput));
    if (isNaN(current)) current = 0;
    const next = Math.max(0.01, current - 0.01);
    const nextStr = next.toFixed(2);
    setMarginInput(nextStr);
    validateMargin(nextStr);
    setLocalConfig((prev) => ({ ...prev, margin: next }));
  };

  const handleSave = async () => {
    if (!validateMargin(marginInput)) return;
    setIsSaving(true);
    try {
      const value = parseFloat(toEnglishDigits(marginInput));
      await onSave({ ...localConfig, margin: value });
      onClose();
    } catch (err) {
      console.error("Failed to save config:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isMarginCheckInvalid = () => {
    const num = parseFloat(toEnglishDigits(marginInput));
    return isNaN(num) || num < 0.01 || num > 1.0;
  };

  const isDark = theme === "dark";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-right">تنظیمات اجرای سیگنال</DialogTitle>
        {providerName && (
          <p className="text-sm text-muted-foreground text-right mt-1">
            تنظیمات برای: {providerName}
          </p>
        )}
      </DialogHeader>

      <div className="grid gap-6 py-4">
        <div className="grid gap-2">
          <label
            htmlFor="margin"
            className="text-sm font-medium leading-none text-right"
          >
            ضریب مارجین (Margin Ratio)
          </label>
          <div
            className={cn(
              "flex items-stretch overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/30 focus-within:border-purple-500/60",
              isDark
                ? "border-purple-500/40 bg-gradient-to-r from-purple-500/10 via-white/5 to-purple-500/10 shadow-purple-500/15"
                : "border-purple-200 bg-gradient-to-r from-purple-50 via-white to-purple-50 shadow-purple-200/20",
              error &&
                "border-red-500/50 shadow-red-500/10 focus-within:ring-red-500/30 focus-within:border-red-500"
            )}
            dir="ltr"
          >
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className={cn(
                "h-12 w-12 shrink-0 rounded-none border-0 border-r transition-all duration-200",
                isDark
                  ? "bg-transparent border-white/10 text-purple-200 hover:bg-purple-500/25 hover:text-purple-100"
                  : "bg-transparent border-purple-100 text-purple-600 hover:bg-purple-100 hover:text-purple-700"
              )}
              onClick={handleDecrement}
              disabled={parseFloat(toEnglishDigits(marginInput)) <= 0.01}
            >
              <Minus className="h-5 w-5" strokeWidth={2.5} />
            </Button>
            <div className="relative flex-1 flex items-center min-w-0">
              <Input
                id="margin"
                type="text"
                inputMode="decimal"
                placeholder="۰.۲"
                value={marginInput}
                onChange={handleMarginChange}
                dir="ltr"
                className={cn(
                  "h-12 rounded-none border-0 border-x text-center text-lg font-semibold px-4 font-sans tabular-nums bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                  isDark
                    ? "border-white/10 placeholder:text-white/30"
                    : "border-purple-100 placeholder:text-gray-400",
                  error ? "text-red-400" : isDark ? "text-white" : "text-gray-900"
                )}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className={cn(
                "h-12 w-12 shrink-0 rounded-none border-0 border-l transition-all duration-200",
                isDark
                  ? "bg-transparent border-white/10 text-purple-200 hover:bg-purple-500/25 hover:text-purple-100"
                  : "bg-transparent border-purple-100 text-purple-600 hover:bg-purple-100 hover:text-purple-700"
              )}
              onClick={handleIncrement}
              disabled={parseFloat(toEnglishDigits(marginInput)) >= 1.0}
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </div>
          {error ? (
            <p className="text-xs text-red-500 text-right">{error}</p>
          ) : (
            <p className="text-xs text-muted-foreground text-right">
              عدد وارد شده ضریبی از کل موجودی است. (مثال: ۰.۲ معادل ۲۰٪ سرمایه
              است)
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex items-center justify-between gap-4 border rounded-xl p-4 transition-colors",
            isDark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50/80 border-purple-200"
          )}
        >
          <div className="space-y-0.5">
            <label className="text-sm font-medium leading-none block text-right">
              ثبت خودکار سیگنال (Auto Execute)
            </label>
            <p className="text-xs text-muted-foreground text-right">
              اجرای بلافاصله سیگنال‌ها بدون تایید دستی
            </p>
          </div>
          <Switch
            checked={localConfig.autoRegisterPosition}
            onCheckedChange={(checked) =>
              setLocalConfig((prev) => ({ ...prev, autoRegisterPosition: checked }))
            }
            className="data-[state=checked]:bg-[#542C85] data-[state=unchecked]:bg-white/10"
          />
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-medium leading-none block text-right">
            نوع اجرا (Execution Type)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all",
                localConfig.executionType === "Demo"
                  ? isDark
                    ? "border-purple-500 bg-purple-500/20 text-purple-100"
                    : "border-purple-500 bg-purple-100 text-purple-700"
                  : isDark
                    ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() =>
                setLocalConfig((prev) => ({ ...prev, executionType: "Demo" }))
              }
            >
              <TestTube
                className={cn(
                  "size-6",
                  localConfig.executionType === "Demo"
                    ? isDark
                      ? "text-purple-300"
                      : "text-purple-600"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium">آزمایشی (Demo)</span>
            </div>

            <div
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all",
                localConfig.executionType === "Real"
                  ? "border-amber-500 bg-amber-500/20 text-amber-100"
                  : isDark
                    ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() =>
                setLocalConfig((prev) => ({ ...prev, executionType: "Real" }))
              }
            >
              <Zap
                className={cn(
                  "size-6",
                  localConfig.executionType === "Real"
                    ? "text-amber-400"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium">واقعی (Real)</span>
            </div>
          </div>

          {localConfig.executionType === "Real" && (
            <div
              className="mt-2 rounded-md bg-amber-500/15 p-3 text-sm text-amber-600 dark:text-amber-400 flex items-start gap-2"
              dir="rtl"
            >
              <AlertTriangle className="size-5 shrink-0" />
              <span>
                <b>توجه:</b> در حالت «واقعی»، معاملات با سرمایه اصلی شما انجام
                می‌شود و ریسک از دست رفتن سرمایه وجود دارد.
              </span>
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="gap-3 sm:gap-4 pt-2">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isSaving}
          className={cn(
            "rounded-xl !border-0",
            isDark
              ? "!bg-purple-500/20 text-purple-100 hover:!bg-purple-500/30"
              : "!bg-purple-100 text-purple-700 hover:!bg-purple-200"
          )}
        >
          انصراف
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            !!error || isSaving || !marginInput || isMarginCheckInvalid()
          }
          className="rounded-xl bg-[#542C85] hover:bg-purple-700 text-white border-0"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function SignalConfigModal({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  providerName,
}: SignalConfigModalProps) {
  const config = initialConfig || DEFAULT_CONFIG;
  const isDemoFeatureDisabled = true;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[425px] dark:bg-[#02000B]/90 dark:border-purple-500/20"
        dir="rtl"
      >
        <div className="relative">
          <div className={cn(isDemoFeatureDisabled && "pointer-events-none select-none blur-[2px] opacity-40")}>
            {isOpen && (
              <SignalConfigForm
                key={`${providerName ?? "default"}-${config.margin}-${config.executionType}`}
                initialConfig={config}
                onSave={onSave}
                onClose={onClose}
                providerName={providerName}
              />
            )}
          </div>

          {isDemoFeatureDisabled && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/35 backdrop-blur-[3px] px-6 text-center">
              <p className="text-sm font-semibold text-white">
                این فیچر در دموی پروژه فعال نمی‌باشد
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
