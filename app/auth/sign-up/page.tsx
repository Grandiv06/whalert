"use client";

import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { OtpCodeInput } from "@/components/auth/otp-code-input";
import {
  formatIranMobileForApi,
  normalizeOtp,
  sanitizeIranMobileInput,
} from "@/lib/auth-phone";
import { buildRegisterPayload } from "@/lib/auth-register";
import {
  ApiError,
  TokenAuthService,
  UserDashboardService,
  type UserSubscriptionPlanDetailsDto,
} from "@/lib/api/client";
import { getAccessToken, storeAuthSession } from "@/lib/auth-session";

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

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    const body = error.body as {
      error?: { message?: string; details?: string };
      message?: string;
    };
    const rawMessage =
      body?.error?.message || body?.error?.details || body?.message || fallback;

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

    return rawMessage;
  }

  return fallback;
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

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center bg-[#1a0c35] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/authbg.svg)" }}
        >
          <div className="text-white/70">در حال بارگذاری...</div>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [referral, setReferral] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [registeredPhone, setRegisteredPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const apiPhone = useMemo(() => {
    const source = registeredPhone || formData.phoneNumber;
    return formatIranMobileForApi(source) ?? "";
  }, [formData.phoneNumber, registeredPhone]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setReferral(q);
  }, [searchParams]);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace("/dashboard/");
    }
  }, [router]);

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

  const fieldWidthClass = "w-full md:w-9/12";

  const inputClass = (hasError: boolean) =>
    `${fieldWidthClass} min-w-0 px-4 py-3 sm:py-4 pr-10 rounded-xl bg-[#2e165b]/80 border text-white text-sm sm:text-base placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#542C85]/30 text-right transition-all duration-200 ${
      hasError ? "border-red-500" : "border-[#542C85]/20 focus:border-[#542C85]/40"
    }`;

  const pushToast = useCallback((message: string, kind: ToastKind) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) =>
      [
        ...prev,
        { id, message, kind, createdAt: Date.now(), durationMs: 4000 },
      ].slice(-3),
    );
  }, []);

  const resetOtp = () => {
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
  };

  const redirectAfterLogin = useCallback(async () => {
    queryClient.clear();
    try {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
      const subscriptionDetails =
        unwrapAbp<UserSubscriptionPlanDetailsDto>(res);
      router.replace(
        hasActiveSubscription(subscriptionDetails)
          ? "/dashboard/"
          : "/dashboard/analysis/",
      );
    } catch {
      router.replace("/dashboard/");
    }
  }, [queryClient, router]);

  const sendOtp = async (phoneNumber: string) => {
    await TokenAuthService.apiTokenauthAppsendotpPost({ phoneNumber });
    setResendTimer(RESEND_SECONDS);
    pushToast(`کد تایید به ${phoneNumber} ارسال شد.`, "success");
  };

  const validateRegistrationForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "نام الزامی است";
    if (!formData.lastName.trim()) newErrors.lastName = "نام خانوادگی الزامی است";

    const phone = formatIranMobileForApi(formData.phoneNumber);
    if (!phone) {
      newErrors.phoneNumber = formData.phoneNumber.trim()
        ? "شماره موبایل معتبر وارد کنید (مثال: 09123456789)"
        : "شماره موبایل الزامی است";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "ایمیل معتبر وارد کنید";
    }

    return { newErrors, phone };
  };

  const registerAccount = async () => {
    setErrors({});
    const { newErrors, phone } = validateRegistrationForm();
    if (Object.keys(newErrors).length > 0 || !phone) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await TokenAuthService.apiTokenauthAppregisterPost(
        buildRegisterPayload(
          {
            name: formData.name,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: phone,
            referral,
          },
          phone,
        ),
      );

      setRegisteredPhone(phone);
      setFormData((prev) => ({ ...prev, phoneNumber: phone }));
      await sendOtp(phone);
      setCurrentStep(2);
      resetOtp();
      pushToast("ثبت‌نام با موفقیت انجام شد. کد تایید را وارد کنید.", "success");
    } catch (error) {
      setErrors({
        submit: getErrorMessage(
          error,
          "ثبت‌نام با خطا مواجه شد. دوباره تلاش کنید.",
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpValue = otpDigits.join("")) => {
    setErrors({});
    const phone = formatIranMobileForApi(registeredPhone);
    const normalizedOtp = normalizeOtp(otpValue);

    if (!phone) {
      setErrors({ submit: "شماره موبایل معتبر نیست. لطفا دوباره ثبت‌نام کنید." });
      return;
    }

    if (normalizedOtp.length !== OTP_LENGTH) {
      setErrors({ submit: "کد تایید ۵ رقمی را کامل وارد کنید." });
      return;
    }

    setLoading(true);
    try {
      const response = await TokenAuthService.apiTokenauthAppverifyotpPost({
        phoneNumber: phone,
        otp: normalizedOtp,
      });
      const result = unwrapAbp<{
        accessToken?: string | null;
        refreshToken?: string | null;
        expireInSeconds?: number;
      }>(response);

      if (!result?.accessToken) {
        setErrors({ submit: "ورود موفق بود اما توکن دریافت نشد." });
        return;
      }

      storeAuthSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken ?? undefined,
        expireInSeconds: result.expireInSeconds,
      });
      pushToast("در حال ورود به پنل", "success");
      await redirectAfterLogin();
    } catch (error) {
      setErrors({
        submit: getErrorMessage(
          error,
          "کد تایید صحیح نیست یا منقضی شده است.",
        ),
      });
      resetOtp();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (currentStep === 1) {
      await registerAccount();
    } else {
      await verifyOtp();
    }
  };

  const goToRegistrationStep = () => {
    if (loading) return;
    setCurrentStep(1);
    setErrors({});
    resetOtp();
  };

  const handleResendOtp = async () => {
    const phone = formatIranMobileForApi(registeredPhone);
    if (loading || resendTimer > 0 || !phone) return;
    setLoading(true);
    setErrors({});
    try {
      await sendOtp(phone);
    } catch (error) {
      setErrors({
        submit: getErrorMessage(
          error,
          "ارسال مجدد کد با خطا مواجه شد. دوباره تلاش کنید.",
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { key: "name" as const, icon: User, placeholder: "نام شما", dir: "rtl" as const },
    {
      key: "lastName" as const,
      icon: User,
      placeholder: "نام خانوادگی شما",
      dir: "rtl" as const,
    },
    {
      key: "phoneNumber" as const,
      icon: Phone,
      placeholder: "شماره موبایل",
      dir: "ltr" as const,
      type: "tel" as const,
    },
    {
      key: "email" as const,
      icon: Mail,
      placeholder: "ایمیل (اختیاری)",
      dir: "ltr" as const,
      type: "email" as const,
    },
  ];

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
                onClick={goToRegistrationStep}
                className="inline-flex w-fit items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به ثبت‌نام
              </button>
            ) : null}
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {currentStep === 1 ? "ثبت‌نام" : "تایید شماره موبایل"}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-white/50 leading-relaxed">
              {currentStep === 1
                ? "حساب کاربری خود را ایجاد کنید. برای شروع، فیلدهای زیر را پر کنید."
                : `کد ۵ رقمی ارسال‌شده به ${apiPhone} را وارد کنید تا وارد پنل شوید.`}
            </p>
          </div>

          <form
            className="space-y-4 sm:space-y-5 md:space-y-6 w-full lg:w-1/2"
            onSubmit={handleSubmit}
            noValidate
          >
            {errors.submit ? (
              <p className={`${fieldWidthClass} text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/30`}>
                {errors.submit}
              </p>
            ) : null}

            {currentStep === 1
              ? formFields.map(({ key, icon: Icon, placeholder, dir, type }) => (
                  <div key={key}>
                    <div className="relative">
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                        <Icon className="w-5 h-5" />
                      </div>
                      <input
                        type={type ?? "text"}
                        className={inputClass(!!errors[key])}
                        inputMode={key === "phoneNumber" ? "numeric" : undefined}
                        autoComplete={
                          key === "phoneNumber"
                            ? "tel-national"
                            : key === "email"
                              ? "email"
                              : undefined
                        }
                        maxLength={key === "phoneNumber" ? 11 : undefined}
                        dir={dir}
                        placeholder={placeholder}
                        value={formData[key]}
                        disabled={loading}
                        onChange={(event) => {
                          const nextValue =
                            key === "phoneNumber"
                              ? sanitizeIranMobileInput(event.target.value)
                              : event.target.value;
                          setFormData((prev) => ({ ...prev, [key]: nextValue }));
                          if (errors[key]) {
                            setErrors((prev) => ({ ...prev, [key]: "" }));
                          }
                        }}
                      />
                    </div>
                    {errors[key] ? (
                      <p className={`${fieldWidthClass} text-red-400 text-xs mt-1 pr-1`}>
                        {errors[key]}
                      </p>
                    ) : null}
                  </div>
                ))
              : null}

            {currentStep === 2 ? (
              <div className="space-y-5 pt-2 pb-2">
                <div className={`${fieldWidthClass} py-2 sm:py-3`}>
                  <OtpCodeInput
                    value={otpDigits}
                    onChange={setOtpDigits}
                    onComplete={verifyOtp}
                    loading={loading}
                    error={!!errors.submit}
                    isActive={currentStep === 2}
                    otpLength={OTP_LENGTH}
                  />
                  {loading ? (
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
                      <ShieldCheck className="h-4 w-4 animate-pulse" />
                      در حال بررسی کد تایید...
                    </div>
                  ) : null}
                </div>
                <div className={`${fieldWidthClass} flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between`}>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={goToRegistrationStep}
                    className="w-fit text-sm text-white/50 transition-colors hover:text-white/80 disabled:opacity-60"
                  >
                    ویرایش اطلاعات
                  </button>
                  <button
                    type="button"
                    disabled={loading || resendTimer > 0}
                    onClick={() => void handleResendOtp()}
                    className="w-fit text-sm text-[#CDB7FF] transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/35"
                  >
                    {resendTimer > 0
                      ? `ارسال مجدد تا ${resendTimer} ثانیه`
                      : "ارسال مجدد کد"}
                  </button>
                </div>
              </div>
            ) : null}

            <div className={fieldWidthClass}>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-[58px] cursor-pointer rounded-xl text-base sm:text-lg font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-[#501794] to-[#3e70a1]"
              >
                {loading
                  ? currentStep === 1
                    ? "در حال ثبت‌نام..."
                    : "در حال بررسی..."
                  : currentStep === 1
                    ? "ثبت‌نام"
                    : "تایید و ورود"}
              </button>
            </div>

            <Link
              href="/auth/sign-in"
              className="block w-fit text-base text-white/50 hover:text-white/70 transition-colors"
            >
              قبلا ثبت نام کرده اید؟
            </Link>
          </form>
        </div>
      </div>

      <div className="hidden md:block fixed bottom-0 lg:bottom-20 lg:left-20 left-0 z-50 text-white text-4xl px-4 md:px-8 font-bold">
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
                const progressPercent = Math.max(
                  0,
                  (remainingMs / toast.durationMs) * 100,
                );

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
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#CDB7FF]" />
                      )}
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
