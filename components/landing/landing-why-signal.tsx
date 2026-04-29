"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingWhySignal() {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-10">
      <div className="w-full lg:max-w-[55%] order-2 lg:order-1">
        <Link href="/auth/sign-up">
          <Button
            variant="outline"
            className="mb-4 rounded-full border-[#542C85]/50 text-[#542C85] hover:bg-[#542C85]/20"
          >
            ورود/ثبت‌نام
          </Button>
        </Link>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          چرا بیشتر سیگنال‌ها به ضرر ختم می‌شن؟
        </h2>
        <p className="text-white/80 mb-4">
          مشکل بازار سیگنال، خود سیگنال نیست؛ روش ارائه و مدیریتشه.
        </p>
        <p className="text-sm text-white/60 leading-relaxed">
          بیشتر سیگنال‌هایی که در بازار منتشر می‌شن، صرفاً یک عدد یا نقطه ورود
          هستن؛ بدون اینکه سناریوی مشخصی برای مدیریت معامله، حد ضرر یا خروج
          ارائه بدن. این نوع سیگنال‌ها نه سابقه قابل بررسی دارن، نه شفافیتی در
          عملکرد گذشته، و نه مسئولیتی در قبال نتیجه معامله. ما در این پلتفرم،
          انتشار سیگنال رو صرفاً ارسال یک عدد نمی‌دونیم. هر سیگنال با سناریوی
          کامل ورود و خروج، مدیریت ریسک و ثبت در آرشیو منتشر می‌شه تا کاربر
          بتونه تصمیم آگاهانه بگیره و عملکرد گذشته رو بررسی کنه.
        </p>
      </div>
      <div className="w-full lg:max-w-[45%] mt-12 lg:mt-0 order-1 lg:order-2 flex justify-center">
        <div className="w-full max-w-md lg:max-w-none aspect-square rounded-2xl bg-[#542C85]/20 border border-[#542C85]/30 flex items-center justify-center">
          <span className="text-6xl">📈</span>
        </div>
      </div>
    </div>
  );
}
