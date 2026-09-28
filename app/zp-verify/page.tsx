import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, User, Phone, Hash, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "صحت‌سنجی درگاه زرین‌پال | والرت",
  description: "صفحه تایید هویت و احراز مالکیت درگاه پرداخت زرین‌پال",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ZarinpalVerifyPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#130728] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-lg z-10">
        {/* Verification Card */}
        <div className="bg-[#1c0f38]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary-950/60">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-primary-450/40 border border-amber-450/40 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-9 h-9 text-amber-400" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              احراز مالکیت و صحت‌سنجی وب‌سایت
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              درگاه پرداخت اینترنتی زرین‌پال
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1.5">
              این صفحه به منظور احراز مالکیت وب‌سایت والرت و اتصال درگاه زرین‌پال ایجاد شده است.
            </p>
          </div>

          {/* Details Table */}
          <div className="space-y-3.5 bg-black/25 rounded-2xl p-4 sm:p-5 border border-white/5">
            {/* Applicant Name */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-2.5 text-white/70 text-sm">
                <User className="w-4 h-4 text-primary-300" />
                <span>نام و نام خانوادگی:</span>
              </div>
              <span className="font-bold text-white text-sm sm:text-base">آرش فروغی فر</span>
            </div>

            {/* Mobile Number */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-2.5 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-primary-300" />
                <span>شماره تماس:</span>
              </div>
              <span className="font-mono font-bold text-white text-sm sm:text-base tracking-wider" dir="ltr">
                09055217652
              </span>
            </div>

            {/* Tracking Code */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-2.5 text-white/70 text-sm">
                <Hash className="w-4 h-4 text-primary-300" />
                <span>کد پذیرنده / تیکت:</span>
              </div>
              <span className="font-mono font-extrabold text-amber-400 text-sm sm:text-base tracking-wider" dir="ltr">
                zp.2849367
              </span>
            </div>

            {/* Website / Service */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5 text-white/70 text-sm">
                <Globe className="w-4 h-4 text-primary-300" />
                <span>سامانه:</span>
              </div>
              <span className="font-semibold text-white/90 text-sm">پلتفرم والرت (Whalert)</span>
            </div>
          </div>

          {/* Raw Text Box for automated inspection / crawlers */}
          <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 text-center font-mono text-xs text-white/80 select-all">
            zp.2849367 | آرش فروغی فر | 09055217652
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-primary-300/80 hover:text-primary-200 transition-colors inline-flex items-center gap-1"
            >
              بازگشت به صفحه اصلی والرت
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
