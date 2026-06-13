"use client";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ApiError, TokenAuthService } from "@/lib/api/client";

type Step = 1 | 2 | 3;
type ToastKind = "success" | "error";
type ToastItem = {
  id: number;
  message: string;
  kind: ToastKind;
  createdAt: number;
  durationMs: number;
};

const RESEND_SECONDS = 60;
const OTP_LENGTH = 5;

function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1584));
}

function normalizePhoneNumber(value: string) {
  const normalized = toEnglishDigits(value).replace(/[^\d+]/g, "");
  if (normalized.startsWith("+98")) return `0${normalized.slice(3)}`;
  if (normalized.startsWith("98")) return `0${normalized.slice(2)}`;
  return normalized;
}

function isValidIranMobile(value: string) {
  return /^09\d{9}$/.test(normalizePhoneNumber(value));
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    const body = error.body as {
      error?: { message?: string; details?: string };
      message?: string;
    };
    return body?.error?.message || body?.error?.details || body?.message || fallback;
  }
  return fallback;
}

function maskPhoneNumber(phoneNumber: string) {
  return phoneNumber;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = window.setTimeout(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      setToasts((prev) =>
        prev.filter((toast) => current - toast.createdAt < toast.durationMs),
      );
    }, 200);
    return () => window.clearInterval(timer);
  }, [toasts.length]);

  useEffect(() => {
    if (currentStep !== 2) return;
    window.setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 0);
  }, [currentStep]);

  const inputClass = (hasError: boolean, hasLeftPadding = false) =>
    `w-full md:w-9/12 px-4 py-3 sm:py-4 pr-10 ${hasLeftPadding ? "pl-10" : ""} rounded-xl bg-[#2e165b]/80 border text-white text-sm sm:text-base placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#542C85]/30 text-right transition-all ${
      hasError ? "border-red-500" : "border-[#542C85]/20 focus:border-[#542C85]/40"
    }`;

  const passwordInputClass = (hasError: boolean) =>
    `w-full px-4 py-3 sm:py-4 pr-10 pl-12 rounded-xl bg-[#2e165b]/80 border text-white text-sm sm:text-base placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#542C85]/30 text-right transition-all ${
      hasError ? "border-red-500" : "border-[#542C85]/20 focus:border-[#542C85]/40"
    }`;

  const clearMessages = () => {
    setErrorMessage("");
  };

  const pushToast = (message: string, kind: ToastKind) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [
      ...prev,
      { id, message, kind, createdAt: Date.now(), durationMs: 4000 },
    ].slice(-3));
  };

  const resetOtpInputs = () => {
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    window.setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 0);
  };

  const focusOtpInput = (index: number) => {
    window.setTimeout(() => {
      otpInputRefs.current[index]?.focus();
      otpInputRefs.current[index]?.select();
    }, 0);
  };

  const fillOtpDigits = (digits: string[], startIndex = 0) => {
    const next = [...otpDigits];
    digits.slice(0, OTP_LENGTH - startIndex).forEach((digit, offset) => {
      next[startIndex + offset] = digit;
    });
    const joinedOtp = next.join("");

    setOtpDigits(next);

    const nextIndex = Math.min(startIndex + digits.length, OTP_LENGTH - 1);
    focusOtpInput(nextIndex);

    if (!loading && joinedOtp.length === OTP_LENGTH && next.every(Boolean)) {
      window.setTimeout(() => {
        void verifyOtp(joinedOtp);
      }, 0);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    clearMessages();
    const digits = toEnglishDigits(value).replace(/\D/g, "").slice(0, OTP_LENGTH).split("");

    if (digits.length > 1) {
      fillOtpDigits(digits, index);
      return;
    }

    const next = [...otpDigits];
    next[index] = digits[0] ?? "";
    const joinedOtp = next.join("");

    setOtpDigits(next);

    if (digits[0] && index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
    }

    if (!loading && joinedOtp.length === OTP_LENGTH && next.every(Boolean)) {
      window.setTimeout(() => {
        void verifyOtp(joinedOtp);
      }, 0);
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      event.preventDefault();
      const next = [...otpDigits];
      next[index - 1] = "";
      setOtpDigits(next);
      focusOtpInput(index - 1);
    }
  };

  const handleOtpPaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    clearMessages();
    const digits = toEnglishDigits(event.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");
    if (digits.length > 0) {
      fillOtpDigits(digits, index);
    }
  };

  const sendOtp = async (isResend = false) => {
    clearMessages();
    const normalizedPhone = normalizePhoneNumber(phoneNumber).slice(0, 11);

    if (!normalizedPhone) {
      setErrorMessage("شماره موبایل الزامی است.");
      return;
    }

    if (!isValidIranMobile(normalizedPhone)) {
      setErrorMessage("شماره موبایل معتبر وارد کنید. مثال: 09123456789");
      return;
    }

    setLoading(true);
    try {
      await TokenAuthService.apiTokenauthAppsendforgotpasswordotpPost({
        phoneNumber: normalizedPhone,
      });
      setPhoneNumber(normalizedPhone);
      resetOtpInputs();
      pushToast(
        isResend ? "کد تایید دوباره ارسال شد." : "کد تایید ارسال شد.",
        "success",
      );
      setCurrentStep(2);
      setResendTimer(RESEND_SECONDS);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "ارسال کد تایید با خطا مواجه شد. دوباره تلاش کنید."),
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpValue = otpDigits.join("")) => {
    clearMessages();
    const normalizedOtp = toEnglishDigits(otpValue).replace(/\D/g, "");

    if (normalizedOtp.length !== OTP_LENGTH) {
      setErrorMessage("کد تایید ۵ رقمی را کامل وارد کنید.");
      focusOtpInput(Math.min(normalizedOtp.length, OTP_LENGTH - 1));
      return;
    }

    setLoading(true);
    try {
      const response =
        await TokenAuthService.apiTokenauthAppverifyforgotpasswordotpPost({
          phoneNumber,
          otp: normalizedOtp,
        });
      const result = (
        response as { result?: { isOtpValid?: boolean }; isOtpValid?: boolean }
      ).result ?? response;

      if (result?.isOtpValid === false) {
        setErrorMessage("کد تایید وارد شده صحیح نیست.");
        resetOtpInputs();
        return;
      }

      pushToast("کد تایید با موفقیت بررسی شد.", "success");
      setCurrentStep(3);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "کد تایید صحیح نیست یا منقضی شده است."),
      );
      resetOtpInputs();
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    clearMessages();

    if (!password.trim()) {
      setErrorMessage("رمز عبور جدید الزامی است.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("رمز عبور حداقل ۶ کاراکتر باشد.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setLoading(true);
    try {
      const resetPhoneNumber = phoneNumber;
      await TokenAuthService.apiTokenauthAppresetpasswordbyphonePost({
        phoneNumber: resetPhoneNumber,
        password,
      });
      pushToast("رمز عبور شما با موفقیت تغییر کرد.", "success");
      setPhoneNumber("");
      resetOtpInputs();
      setPassword("");
      setConfirmPassword("");
      setCurrentStep(1);
      setResendTimer(0);

      window.setTimeout(() => {
        router.push(`/auth/sign-in?phoneNumber=${encodeURIComponent(resetPhoneNumber)}`);
      }, 1500);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "تغییر رمز عبور با خطا مواجه شد. دوباره تلاش کنید."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (currentStep === 1) await sendOtp();
    if (currentStep === 2) await verifyOtp();
    if (currentStep === 3) await resetPassword();
  };

  const goToStep = (step: Step) => {
    if (loading) return;
    clearMessages();
    setCurrentStep(step);
  };

  return (
    <div
      className="min-h-screen relative overflow-y-auto bg-[#1a0c35] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/authbg.svg)" }}
      dir="rtl"
    >
      <div className="absolute inset-0 flex items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-24">
        <div className="w-full max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12">
            <Link
              href="/auth/sign-in"
              className="inline-flex w-fit items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به ورود
            </Link>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              بازیابی رمز عبور
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-white/50 leading-relaxed">
              شماره موبایل حساب خود را وارد کنید و مراحل تایید را کامل کنید.
            </p>
          </div>

          <div className="mb-6 w-full lg:w-1/2">
            <div className="flex w-full md:w-9/12 gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full ${
                    currentStep >= step ? "bg-[#8b5cf6]" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>

          <form
            className="space-y-4 sm:space-y-5 md:space-y-6 w-full lg:w-1/2"
            onSubmit={handleSubmit}
            noValidate
          >
            {errorMessage && currentStep === 3 ? (
              <p className="w-full md:w-9/12 text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/30">
                {errorMessage}
              </p>
            ) : null}

            {currentStep === 1 ? (
              <div>
                <div className="relative">
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={11}
                    dir="ltr"
                    className={inputClass(!!errorMessage)}
                    placeholder="09123456789"
                    value={phoneNumber}
                    disabled={loading}
                    onChange={(event) => {
                      setPhoneNumber(
                        normalizePhoneNumber(event.target.value).slice(0, 11),
                      );
                      clearMessages();
                    }}
                  />
                </div>
                {errorMessage ? (
                  <p className="w-full md:w-9/12 text-red-400 text-xs mt-2 pr-1">
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="space-y-3">
                <p className="w-full md:w-9/12 text-sm text-white/60">
                  کد تایید به {maskPhoneNumber(phoneNumber)} ارسال شد.
                </p>
                <div className="w-full md:w-9/12">
                  <div dir="ltr" className="flex items-center justify-between gap-2 sm:gap-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(node) => {
                          otpInputRefs.current[index] = node;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        aria-label={`رقم ${index + 1} کد تایید`}
                        className={`h-12 w-11 rounded-xl border bg-[#2e165b]/80 text-center text-lg font-bold text-white outline-none transition-all placeholder:text-white/50 focus:ring-2 focus:ring-[#542C85]/30 sm:h-14 sm:w-14 sm:text-xl ${
                          errorMessage
                            ? "border-red-500"
                            : "border-[#542C85]/20 focus:border-[#542C85]/40"
                        }`}
                        value={digit}
                        disabled={loading}
                        onChange={(event) => handleOtpChange(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        onPaste={(event) => handleOtpPaste(index, event)}
                      />
                    ))}
                  </div>
                  {loading ? (
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                      <ShieldCheck className="h-4 w-4 animate-pulse" />
                      در حال بررسی کد تایید...
                    </div>
                  ) : null}
                </div>
                {errorMessage ? (
                  <p className="w-full md:w-9/12 text-red-400 text-xs mt-2 pr-1">
                    {errorMessage}
                  </p>
                ) : null}
                <div className="flex w-full md:w-9/12 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => goToStep(1)}
                    className="w-fit text-sm text-white/50 transition-colors hover:text-white/80 disabled:opacity-60"
                  >
                    ویرایش شماره موبایل
                  </button>
                  <button
                    type="button"
                    disabled={loading || resendTimer > 0}
                    onClick={() => sendOtp(true)}
                    className="w-fit text-sm text-[#CDB7FF] transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/35"
                  >
                    {resendTimer > 0
                      ? `ارسال مجدد تا ${resendTimer} ثانیه`
                      : "ارسال مجدد کد"}
                  </button>
                </div>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="space-y-4">
                <div className="relative w-full md:w-9/12">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    dir="ltr"
                    className={passwordInputClass(!!errorMessage)}
                    placeholder="رمز عبور جدید"
                    value={password}
                    disabled={loading}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      clearMessages();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-white/50 hover:text-white/80 transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative w-full md:w-9/12">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    dir="ltr"
                    className={passwordInputClass(!!errorMessage)}
                    placeholder="تکرار رمز عبور جدید"
                    value={confirmPassword}
                    disabled={loading}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      clearMessages();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-white/50 hover:text-white/80 transition-colors focus:outline-none cursor-pointer"
                    aria-label={showConfirmPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full block md:w-9/12 h-12 sm:h-[58px] cursor-pointer rounded-xl text-base sm:text-lg font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-[#501794] to-[#3e70a1]"
            >
              {loading
                ? "در حال ارسال..."
                : currentStep === 1
                  ? "ارسال کد تایید"
                  : currentStep === 2
                    ? "تایید کد"
                    : "تغییر رمز عبور"}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:block fixed bottom-20 font-bold left-20 z-50 text-white text-4xl px-4 md:px-8">
        به پلتفرم{" "}
        <Link href="/" className="hover:text-white/80 transition-colors">
          والرت
        </Link>{" "}
        <span className="block my-2 bg-gradient-to-r from-[#501794] to-[#AE69FF] bg-clip-text text-transparent">
          خوش آمدید
        </span>
      </div>

      {typeof document !== "undefined" && toasts.length > 0
        ? createPortal(
            <div className="fixed bottom-6 right-6 z-[99999] flex w-[min(92vw,360px)] flex-col gap-2">
              {toasts.map((toast) => {
                const elapsed = nowMs - toast.createdAt;
                const remainingMs = Math.max(0, toast.durationMs - elapsed);
                const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
                const progressPercent = Math.max(0, (remainingMs / toast.durationMs) * 100);

                return (
                  <div
                    key={toast.id}
                    className={`relative overflow-hidden rounded-xl border px-3 py-2.5 text-sm shadow-lg backdrop-blur-md transition-all duration-300 ${
                      toast.kind === "success"
                        ? "border-[#A87FF3]/40 bg-[#542C85]/25 text-white"
                        : "border-[#A87FF3]/30 bg-[#2F1A4D]/60 text-white/90"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {toast.kind === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#CDB7FF]" />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="leading-6 font-medium">{toast.message}</p>
                      </div>
                      <span className="shrink-0 rounded-md bg-black/25 px-1.5 py-0.5 text-[11px] font-medium">
                        {remainingSec}s
                      </span>
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-[width] duration-200 ${
                          toast.kind === "success" ? "bg-[#A87FF3]" : "bg-[#7C4DCC]"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
