"use client";

import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TokenAuthService } from "@/lib/api/client";
import { storeAuthSession } from "@/lib/auth-session";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const inputClass = (hasError: boolean) =>
    `w-full md:w-9/12 px-4 py-3 sm:py-4 pr-10 rounded-xl bg-[#2e165b]/80 border text-white text-sm sm:text-base placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#542C85]/30 text-right ${
      hasError ? "border-red-500" : "border-[#542C85]/20 focus:border-[#542C85]/40"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "ایمیل الزامی است";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "ایمیل معتبر وارد کنید";
    if (!formData.password.trim()) newErrors.password = "رمز عبور الزامی است";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await TokenAuthService.apiTokenauthAppauthenticatePost({
        email: formData.email.trim(),
        password: formData.password,
      });
      
      const result = (
        response as {
          result?: {
            accessToken?: string;
            refreshToken?: string;
            expireInSeconds?: number;
          };
        }
      ).result ?? response;
      const token = result?.accessToken;
      if (token) {
        storeAuthSession({
          accessToken: token,
          refreshToken: result?.refreshToken,
          expireInSeconds: result?.expireInSeconds,
        });
        router.push("/dashboard");
      } else {
        setErrors({ submit: "ورود موفق بود اما توکن دریافت نشد." });
      }
    } catch {
      setErrors({ submit: "ورود با خطا مواجه شد. دوباره تلاش کنید." });
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
            <h3 className="text-2xl sm:text-3xl font-bold text-white">ورود</h3>
            <p className="text-sm sm:text-base md:text-lg text-white/50 leading-relaxed">
              لطفا اطلاعات حساب خود را وارد کنید
            </p>
          </div>
          <form
            className="space-y-4 sm:space-y-5 md:space-y-6 w-full lg:w-1/2"
            onSubmit={handleSubmit}
          >
            {errors.submit && (
              <p className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/30">
                {errors.submit}
              </p>
            )}

            <div>
              <div className="relative">
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  className={inputClass(!!errors.email)}
                  placeholder="ایمیل"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, email: e.target.value }));
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  className={inputClass(!!errors.password)}
                  placeholder="رمز عبور"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, password: e.target.value }));
                    if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                  }}
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full block md:w-9/12 h-12 sm:h-[58px] cursor-pointer rounded-xl text-base sm:text-lg font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-[#501794] to-[#3e70a1]"
            >
              {loading ? "در حال ورود..." : "ورود"}
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
    </div>
  );
}
