"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ZapIcon } from "@/components/icons/landing-icons";
import { useRouter } from "next/navigation";

export function LandingHero() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-extrabold flex flex-wrap justify-center gap-x-2 gap-y-1 mx-auto px-1 text-white">
        والرت اولین پلتفرم هوشمند سیگنال معاملاتی{" "}
        <span className="text-[#7e4eac]">به ویژه انس طلا</span>
      </h1>
      <p className="text-center text-sm sm:text-base md:text-lg text-white/60 font-medium max-w-2xl mx-auto px-2">
        ترکیبی از تحلیل انسانی و قدرت هوش مصنوعی؛ برای ارائه دقیق‌ترین
        سیگنال‌های معاملاتی
      </p>
      <div className="w-full max-w-sm sm:max-w-none sm:w-fit mx-auto my-6 sm:my-8 md:my-11 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center px-2">
        <Button
          size="lg"
          onClick={() => router.push("/dashboard/create-signal")}
          className="gap-2 h-[50px] px-6 rounded-full bg-[#542C85] hover:bg-[#542C85]/90 text-white"
        >
          دریافت اولین سیگنال
          <ArrowLeftIcon size={20} className="w-5 h-5" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push("/auth/sign-up")}
          className="gap-2 h-[50px] px-6 rounded-full border-white/30 bg-white/10 hover:bg-white/20 text-white"
        >
          <ZapIcon size={20} className="w-5 h-5" />
          مشاهده سیگنال ها
        </Button>
      </div>
    </div>
  );
}
