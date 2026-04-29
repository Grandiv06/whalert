"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/icons/landing-icons";
import { useRouter } from "next/navigation";

export function LandingCta() {
  const router = useRouter();

  return (
    <div className="py-16 px-6 rounded-2xl bg-[#542C85]/20 border border-[#542C85]/30 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        همین الان شروع کنید
      </h2>
      <p className="text-white/70 mb-8 max-w-xl mx-auto">
        با ثبت‌نام رایگان به سیگنال‌های هوشمند، ابزارهای تحلیلی و پشتیبانی تخصصی
        دسترسی پیدا کنید.
      </p>
      <Button
        size="lg"
        onClick={() => router.push("/auth/sign-up")}
        className="gap-2 h-[50px] px-8 rounded-full bg-[#542C85] hover:bg-[#542C85]/90 text-white"
      >
        ثبت‌نام رایگان
        <ArrowLeftIcon size={20} className="w-5 h-5" />
      </Button>
    </div>
  );
}
