"use client";

import { User, Lock, Mail, Phone, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TokenAuthService, ApiError } from "@/lib/api/client";

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
  const [referral, setReferral] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const toEnglishDigits = (value: string) =>
    value
      .replace(/[۰-۹]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1584));

  const normalizePhoneNumber = (value: string) => {
    const normalized = toEnglishDigits(value).replace(/[^\d+]/g, "");
    if (normalized.startsWith("+98")) {
      return `0${normalized.slice(3)}`;
    }
    if (normalized.startsWith("98")) {
      return `0${normalized.slice(2)}`;
    }
    return normalized;
  };

  const isValidIranMobile = (value: string) => /^09\d{9}$/.test(normalizePhoneNumber(value));

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setReferral(q);
  }, [searchParams]);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      setToasts((prev) =>
        prev.filter((t) => current - t.createdAt < t.durationMs),
      );
    }, 200);
    return () => window.clearInterval(timer);
  }, [toasts.length]);

  const pushToast = (message: string, kind: "success" | "error") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [
      ...prev,
      { id, message, kind, createdAt: Date.now(), durationMs: 4000 },
    ].slice(-3));
  };

  const inputClass = (hasError: boolean, hasLeftIcon: boolean = false) =>
    `w-full min-w-0 px-4 py-3 sm:py-4 pr-10 ${hasLeftIcon ? "pl-11" : ""} rounded-xl bg-[#2e165b]/80 border text-white text-sm sm:text-base placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#542C85]/30 text-right transition-all duration-200 ${
      hasError ? "border-red-500" : "border-[#542C85]/20 focus:border-[#542C85]/40"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "نام الزامی است";
    if (!formData.lastName.trim()) newErrors.lastName = "نام خانوادگی الزامی است";
    if (!formData.email.trim()) newErrors.email = "ایمیل الزامی است";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "ایمیل معتبر وارد کنید";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "شماره موبایل الزامی است";
    else if (!isValidIranMobile(formData.phoneNumber))
      newErrors.phoneNumber = "شماره موبایل معتبر وارد کنید (مثال: 09123456789)";
    if (!formData.password.trim()) newErrors.password = "رمز عبور الزامی است";
    else if (formData.password.length < 6)
      newErrors.password = "رمز عبور حداقل ۶ کاراکتر باشد";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await TokenAuthService.apiTokenauthAppregisterPost({
        name: formData.name.trim(),
        surname: formData.lastName.trim(),
        emailAddress: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        referalCode: referral || undefined,
      });
      
      pushToast("ثبت‌نام با موفقیت انجام شد. در حال انتقال به صفحه ورود...", "success");
      
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      let message = "ثبت‌نام با خطا مواجه شد. دوباره تلاش کنید.";
      if (err instanceof ApiError) {
        const body = err.body as any;
        if (body?.error?.message) {
          message = body.error.message;
        } else if (body?.message) {
          message = body.message;
        }
      }
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
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
            <h3 className="text-3xl font-bold text-white">ثبت‌ نام</h3>
            <p className="text-sm sm:text-base md:text-lg text-white/50 leading-relaxed">
              حساب کاربری خود را ایجاد کنید! برای شروع، فیلدهای زیر را پر کنید.
            </p>
          </div>
          <form
            className="space-y-4 sm:space-y-5 md:space-y-6 w-full lg:w-1/2"
            onSubmit={handleSubmit}
            noValidate
          >
            {errors.submit && (
              <p className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/30">
                {errors.submit}
              </p>
            )}

            {(["name", "lastName", "phoneNumber", "email", "password"] as const).map(
              (field) => (
                <div key={field} className="w-full md:w-9/12">
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                      {field === "email" ? (
                        <Mail className="w-5 h-5" />
                      ) : field === "password" ? (
                        <Lock className="w-5 h-5" />
                      ) : field === "phoneNumber" ? (
                        <Phone className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "password"
                            ? (showPassword ? "text" : "password")
                            : field === "phoneNumber"
                              ? "tel"
                              : "text"
                      }
                      className={inputClass(!!errors[field], field === "password")}
                      inputMode={field === "phoneNumber" ? "numeric" : undefined}
                      autoComplete={field === "phoneNumber" ? "tel-national" : field === "password" ? "new-password" : undefined}
                      maxLength={field === "phoneNumber" ? 11 : undefined}
                      dir={(field === "phoneNumber" || field === "password" || field === "email") ? "ltr" : "rtl"}
                      placeholder={
                        field === "name"
                          ? "نام شما"
                          : field === "lastName"
                            ? "نام خانوادگی شما"
                            : field === "phoneNumber"
                              ? "شماره موبایل"
                              : field === "email"
                                ? "ایمیل"
                                : "رمز عبور"
                      }
                      value={formData[field]}
                      onChange={(e) => {
                        const nextValue =
                          field === "phoneNumber"
                            ? normalizePhoneNumber(e.target.value).slice(0, 11)
                            : e.target.value;
                        setFormData((p) => ({ ...p, [field]: nextValue }));
                        if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
                      }}
                    />
                    {field === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors focus:outline-none p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" /> }
                      </button>
                    )}
                  </div>
                  {errors[field] && (
                    <p className="text-red-400 text-xs mt-1 pr-1">{errors[field]}</p>
                  )}
                </div>
              )
            )}

            <div className="w-full md:w-9/12">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-[58px] cursor-pointer rounded-xl text-base sm:text-lg font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-[#501794] to-[#3e70a1]"
              >
                {loading ? "در حال ثبت‌نام..." : "ثبت‌ نام"}
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

      {typeof document !== "undefined" && toasts.length > 0 &&
        createPortal(
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
        )}
    </div>
  );
}
