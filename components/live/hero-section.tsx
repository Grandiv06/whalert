"use client";

import { ArrowLeftIcon } from "@/components/icons/landing-icons";
import { Button } from "@/components/landing/ui/button/button";
import { LineChart, MessageSquare, PieChart } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const scrollToSessions = () => {
    const tableElement = document.getElementById("sessions-table");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="flex flex-col-reverse xl:flex-row items-center justify-between gap-12 xl:gap-16 w-full pt-8 lg:pt-12 pb-16 relative z-10">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-[#3b0764]/20 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Main Text Content (First element in RTL -> Appears on the RIGHT side) */}
      <div className="flex flex-col items-start text-right w-full max-w-[600px] pt-8 xl:pt-0">
        
        {/* Top Pill */}
        <div className="flex items-center gap-2 mb-8 bg-[#0a0514] px-4 py-1.5 rounded-full border border-purple-500/40 shadow-[0_0_20px_rgba(84,44,133,0.25)] backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)] animate-pulse" />
          <span className="text-[13px] font-medium text-purple-200/90 iranyekan-medium tracking-wide">
            لایو هفتگی بازار طلا (XAUUSD)
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-extrabold mb-6 iranyekan-black text-white leading-[1.3] tracking-tight">
          تحلیل زنده بازار{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#fcd34d] via-[#f59e0b] to-[#b45309] drop-shadow-[0_2px_20px_rgba(245,158,11,0.35)]">
            طلا
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-[19px] text-[#9b8fb0] mb-10 iranyekan-regular leading-[2] max-w-xl">
          همراه با تحلیل لحظه‌ای، بررسی فرصت‌های معاملاتی و پاسخ به سوالات شما
          <br className="hidden sm:block" />
          جلسه‌ای حرفه‌ای برای تریدرهایی که به دنبال رشد واقعی هستند.
        </p>

        {/* Features List */}
        <div className="flex flex-row items-center justify-start gap-2 sm:gap-4 mb-12 w-full flex-nowrap overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 mask-linear-fade">
          <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-sm transition-all hover:bg-purple-500/20 hover:border-purple-500/30 shrink-0">
            <LineChart className="text-purple-300 w-4 sm:w-5 h-4 sm:h-5 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] shrink-0" />
            <span className="text-purple-100 iranyekan-medium text-[13px] sm:text-sm font-semibold whitespace-nowrap">تحلیل زنده</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-sm transition-all hover:bg-purple-500/20 hover:border-purple-500/30 shrink-0">
            <MessageSquare className="text-purple-300 w-4 sm:w-5 h-4 sm:h-5 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] shrink-0" />
            <span className="text-purple-100 iranyekan-medium text-[13px] sm:text-sm font-semibold whitespace-nowrap">پرسش و پاسخ</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-sm transition-all hover:bg-purple-500/20 hover:border-purple-500/30 shrink-0">
            <PieChart className="text-purple-300 w-4 sm:w-5 h-4 sm:h-5 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] shrink-0" />
            <span className="text-purple-100 iranyekan-medium text-[13px] sm:text-sm font-semibold whitespace-nowrap">مدیریت سرمایه</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full flex justify-center mt-2">
          <Button
            onClick={scrollToSessions}
            size="lg"
            className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl px-10 h-[58px] text-[17px] iranyekan-demibold w-full sm:w-auto flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(147,51,234,0.55)] border border-purple-400/40 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 font-bold">مشاهده‌ی جلسات</span>
            <ArrowLeftIcon size={20} className="relative z-10 transition-transform group-hover:-translate-x-1.5 text-purple-200" />
          </Button>
        </div>
      </div>

      {/* Simple Minimalist Image with Perfect CSS Transparency and Masking */}
      <div className="group relative w-full max-w-[500px] xl:max-w-[580px] flex-shrink-0">
        
        {/* Deep background ambient glows */}
        <div className="pointer-events-none absolute -left-12 -top-12 h-80 w-80 rounded-full bg-purple-600/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-80 w-80 rounded-full bg-amber-500/15 blur-[110px]" />

        {/* Clean Image Container - mix-blend-screen plus radial mask to completely erase faint square backgrounds */}
        <div 
          className="relative aspect-[16/9] w-full overflow-visible mix-blend-screen"
          style={{ 
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)', 
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)' 
          }}
        >
          <Image
            src="/images/whalert-hero-simple.jpg"
            alt="گرافیک تریدینگ والرت"
            fill
            className="object-contain object-center transition-transform duration-700 group-hover:scale-103"
            sizes="(max-width: 768px) 100vw, 580px"
            priority
          />
        </div>
      </div>

    </section>
  );
}
