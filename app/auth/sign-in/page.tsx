"use client";

import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError, TokenAuthService, UserDashboardService, type UserSubscriptionPlanDetailsDto } from "@/lib/api/client";
import { getAccessToken, storeAuthSession } from "@/lib/auth-session";
import { OtpCodeInput } from "@/components/auth/otp-code-input";

type Step = 1 | 2;
type ToastKind = "success" | "error";
type ToastItem = {
  id: number;
  message: string;
  kind: ToastKind;
  createdAt: number;
  durationMs: number;
};

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;

type AbpWrapper<T> = { result?: T };

function unwrapAbp<T>(res: unknown): T {
  const wrapped = res as AbpWrapper<T>;
  return (wrapped?.result ?? res) as T;
}

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
    const rawMessage =
      body?.error?.message || body?.error?.details || body?.message || fallback;

    if (rawMessage === "No active user found for this phone number.") {
      return "برای این شماره موبایل کاربری فعال پیدا نشد.";
    }

    if (
      rawMessage === "The otp code is invalid." ||
      rawMessage === "OTP code is invalid." ||
      rawMessage === "Invalid OTP" ||
      rawMessage === "Invalid verification code."
    ) {
      return "کد تایید وارد شده صحیح نیست یا منقضی شده است.";
    }

    if (
      rawMessage === "Please wait before requesting a new code." ||
      rawMessage === "OTP was recently sent."
    ) {
      return "لطفا قبل از درخواست کد جدید کمی صبر کنید.";
    }

    return "در هنگام ارسال درخواست، خطای داخلی رخ داد.";
  }

  return fallback;
}

function maskPhoneNumber(phoneNumber: string) {
  return phoneNumber;
}

function hasActiveSubscription(details?: UserSubscriptionPlanDetailsDto | null) {
  if (!details?.hasSubscription) return false;
  if (typeof details.remainingDays === "number") {
    return details.remainingDays > 0;
  }
  if (details.endDateUtc) {
    return new Date(details.endDateUtc).getTime() > Date.now();
  }
  return false;
}

export default function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [redirectTimer, setRedirectTimer] = useState(0);
  const [redirectPending, setRedirectPending] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const normalizedPhone = useMemo(
    () => normalizePhoneNumber(phoneNumber).slice(0, 11),
    [phoneNumber],
  );

  useEffect(() => {
    if (!getAccessToken()) return;

    void (async () => {
      try {
        const res =
          await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
        const subscriptionDetails = unwrapAbp<UserSubscriptionPlanDetailsDto>(res);
        router.replace(
          hasActiveSubscription(subscriptionDetails)
            ? "/dashboard/"
            : "/dashboard/analysis/",
        );
      } catch {
        router.replace("/dashboard/");
      }
    })();
  }, [router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = window.setTimeout(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (redirectTimer <= 0) return;
    const timer = window.setTimeout(() => {
      setRedirectTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [redirectTimer]);

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

  const fieldWidthClass = "w-full md:w-[480px]";

  const inputClass = (hasError: boolean) =>
    `${fieldWidthClass} px-4 py-3 sm:py-4 pr-10 rounded-xl bg-[#2e165b]/80 border text-white text-sm sm:text-base placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#542C85]/30 text-right transition-all ${
      hasError ? "border-red-500" : "border-[#542C85]/20 focus:border-[#542C85]/40"
    }`;

  const clearMessages = () => {
    setErrorMessage("");
  };

  const pushToast = useCallback((message: string, kind: ToastKind) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [
      ...prev,
      { id, message, kind, createdAt: Date.now(), durationMs: 4000 },
    ].slice(-3));
  }, []);

  const resetOtp = () => {
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
  };

  const redirectAfterLogin = useCallback(async () => {
    setRedirectPending(false);
    setRedirectTimer(0);
    queryClient.clear();
    try {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
      const subscriptionDetails = unwrapAbp<UserSubscriptionPlanDetailsDto>(res);
      router.replace(
        hasActiveSubscription(subscriptionDetails)
          ? "/dashboard/"
          : "/dashboard/analysis/",
      );
    } catch {
      router.replace("/dashboard/");
    }
  }, [queryClient, router]);

  useEffect(() => {
    if (!redirectPending || redirectTimer > 0) return;
    void redirectAfterLogin();
  }, [redirectAfterLogin, redirectPending, redirectTimer]);

  const sendOtp = async () => {
    clearMessages();

    if (!normalizedPhone) {
      setErrorMessage("شماره موبایل الزامی است.");
      return;
    }

    if (!isValidIranMobile(normalizedPhone)) {
      setErrorMessage("شماره موبایل معتبر وارد کنید. مثال: 09123456789");
      return;
    }

    setIsSendingOtp(true);
    try {
      await TokenAuthService.apiTokenauthAppsendotpPost({
        phoneNumber: normalizedPhone,
      });
      setCurrentStep(2);
      resetOtp();
      setResendTimer(RESEND_SECONDS);
      pushToast(`کد تایید به ${maskPhoneNumber(normalizedPhone)} ارسال شد.`, "success");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "ارسال کد تایید با خطا مواجه شد. دوباره تلاش کنید."),
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (otpValue = otpDigits.join("")) => {
    clearMessages();
    const normalizedOtp = toEnglishDigits(otpValue).replace(/\D/g, "");

    if (normalizedOtp.length !== OTP_LENGTH) {
      setErrorMessage("کد تایید ۵ رقمی را کامل وارد کنید.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await TokenAuthService.apiTokenauthAppverifyotpPost({
        phoneNumber: normalizedPhone,
        otp: normalizedOtp,
      });
      const result = unwrapAbp<{
        accessToken?: string | null;
        refreshToken?: string | null;
        expireInSeconds?: number;
      }>(response);

      if (!result?.accessToken) {
        setErrorMessage("ورود موفق بود اما توکن دریافت نشد.");
        return;
      }

      storeAuthSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken ?? undefined,
        expireInSeconds: result.expireInSeconds,
      });
      setRedirectPending(true);
      setRedirectTimer(3);
      pushToast("در حال ورود به پنل", "success");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "کد تایید صحیح نیست یا منقضی شده است."),
      );
      resetOtp();
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSendingOtp || isVerifyingOtp) return;
    if (currentStep === 1) {
      await sendOtp();
    } else {
      await verifyOtp();
    }
  };

  const goToPhoneStep = () => {
    if (isSendingOtp || isVerifyingOtp) return;
    setCurrentStep(1);
    setErrorMessage("");
    resetOtp();
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(normalizePhoneNumber(value).slice(0, 11));
    clearMessages();
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
            {currentStep === 2 ? (
              <button
                type="button"
                onClick={goToPhoneStep}
                className="inline-flex w-fit items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به ورود
              </button>
            ) : null}
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {currentStep === 1 ? "ورود" : "ورود با کد تایید"}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-white/50 leading-relaxed">
              {currentStep === 1
                ? "شماره موبایل خود را وارد کنید تا کد تایید برای شما ارسال شود."
                : `کد تایید به شماره ${maskPhoneNumber(normalizedPhone)} ارسال شد.`}
            </p>
          </div>

          <form
            className="space-y-4 sm:space-y-5 md:space-y-6 w-full lg:w-1/2"
            onSubmit={handleSubmit}
            noValidate
          >
            {errorMessage ? (
              <p className={`${fieldWidthClass} text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/30`}>
                {errorMessage}
              </p>
            ) : null}

            {currentStep === 1 ? (
              <div className={fieldWidthClass}>
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
                    disabled={isSendingOtp}
                    onChange={(event) => handlePhoneChange(event.target.value)}
                  />
                </div>
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="space-y-5 pt-2 pb-2">
                <div className="w-full md:w-9/12 py-2 sm:py-3">
                  <OtpCodeInput
                    value={otpDigits}
                    onChange={setOtpDigits}
                    onComplete={verifyOtp}
                    loading={isVerifyingOtp}
                    error={!!errorMessage}
                    isActive={currentStep === 2}
                    otpLength={OTP_LENGTH}
                  />
                  {isVerifyingOtp ? (
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
                      <ShieldCheck className="h-4 w-4 animate-pulse" />
                      در حال بررسی کد تایید...
                    </div>
                  ) : null}
                </div>
                <div className="flex w-full md:w-9/12 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    disabled={isSendingOtp || isVerifyingOtp}
                    onClick={goToPhoneStep}
                    className="w-fit text-sm text-white/50 transition-colors hover:text-white/80 disabled:opacity-60"
                  >
                    ویرایش شماره موبایل
                  </button>
                  <button
                    type="button"
                    disabled={isSendingOtp || isVerifyingOtp || resendTimer > 0}
                    onClick={sendOtp}
                    className="w-fit text-sm text-[#CDB7FF] transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/35"
                  >
                    {resendTimer > 0
                      ? `ارسال مجدد تا ${resendTimer} ثانیه`
                      : "ارسال مجدد کد"}
                  </button>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSendingOtp || isVerifyingOtp}
              className={`${fieldWidthClass} block h-12 sm:h-[58px] cursor-pointer rounded-xl text-base sm:text-lg font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-[#501794] to-[#3e70a1]`}
            >
              {isSendingOtp
                ? "در حال ارسال..."
                : isVerifyingOtp
                  ? "در حال بررسی..."
                  : currentStep === 1
                    ? "ارسال کد تایید"
                    : "تایید و ورود"}
            </button>

            <Link
              href="/auth/sign-up"
              className="block w-fit text-base text-white/50 hover:text-white/70 transition-colors"
            >
              اکانت ندارید ؟ ثبت نام کنید
            </Link>
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
            <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-[99999] flex w-auto sm:w-[min(92vw,360px)] flex-col gap-2">
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
