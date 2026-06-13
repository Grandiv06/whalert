"use client";

import { ArrowRight, CheckCircle2, KeyRound, Lock, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, TokenAuthService } from "@/lib/api/client";

type Step = 1 | 2 | 3;

const RESEND_SECONDS = 60;

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
  if (phoneNumber.length < 7) return phoneNumber;
  return `${phoneNumber.slice(0, 4)}xxx${phoneNumber.slice(-4)}`;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = window.setTimeout(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  const inputClass = (hasError: boolean, hasLeftPadding = false) =>
    `w-full md:w-9/12 px-4 py-3 sm:py-4 pr-10 ${hasLeftPadding ? "pl-10" : ""} rounded-xl bg-[#2e165b]/80 border text-white text-sm sm:text-base placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#542C85]/30 text-right transition-all ${
      hasError ? "border-red-500" : "border-[#542C85]/20 focus:border-[#542C85]/40"
    }`;

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
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
      setSuccessMessage(
        isResend ? "کد تایید دوباره ارسال شد." : "کد تایید ارسال شد.",
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

  const verifyOtp = async () => {
    clearMessages();
    const normalizedOtp = toEnglishDigits(otp).replace(/\D/g, "");

    if (!normalizedOtp) {
      setErrorMessage("کد تایید الزامی است.");
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
        return;
      }

      setOtp(normalizedOtp);
      setSuccessMessage("کد تایید با موفقیت بررسی شد.");
      setCurrentStep(3);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "کد تایید صحیح نیست یا منقضی شده است."),
      );
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
      setSuccessMessage("رمز عبور شما با موفقیت تغییر کرد.");
      setPhoneNumber("");
      setOtp("");
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

          <div className="mb-6 flex w-full md:w-9/12 lg:w-1/2 gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full ${
                  currentStep >= step ? "bg-[#8b5cf6]" : "bg-white/15"
                }`}
              />
            ))}
          </div>

          <form
            className="space-y-4 sm:space-y-5 md:space-y-6 w-full lg:w-1/2"
            onSubmit={handleSubmit}
            noValidate
          >
            {successMessage ? (
              <p className="w-full md:w-9/12 flex items-center gap-2 text-emerald-300 text-sm bg-emerald-500/10 rounded-xl px-4 py-2 border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {successMessage}
              </p>
            ) : null}

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
                <div className="relative">
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    dir="ltr"
                    className={inputClass(!!errorMessage)}
                    placeholder="کد تایید"
                    value={otp}
                    disabled={loading}
                    onChange={(event) => {
                      setOtp(toEnglishDigits(event.target.value).replace(/\D/g, ""));
                      clearMessages();
                    }}
                  />
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
                <div className="relative">
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    autoComplete="new-password"
                    dir="ltr"
                    className={inputClass(!!errorMessage)}
                    placeholder="رمز عبور جدید"
                    value={password}
                    disabled={loading}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      clearMessages();
                    }}
                  />
                </div>
                <div className="relative">
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    autoComplete="new-password"
                    dir="ltr"
                    className={inputClass(!!errorMessage)}
                    placeholder="تکرار رمز عبور جدید"
                    value={confirmPassword}
                    disabled={loading}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      clearMessages();
                    }}
                  />
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => goToStep(2)}
                  className="w-fit text-sm text-white/50 transition-colors hover:text-white/80 disabled:opacity-60"
                >
                  بازگشت به تایید کد
                </button>
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
    </div>
  );
}
