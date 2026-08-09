"use client";

import { ArrowLeftIcon } from "@/components/icons/landing-icons";
import { Button } from "@/components/landing/ui/button/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export function BottomCta() {
  const scrollToSessions = () => {
    const tableElement = document.getElementById("sessions-table");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative mt-12 w-full pt-6 sm:pt-10 md:pt-16">
      {/* Main Glassmorphic Banner Box */}
      <div className="group relative w-full rounded-3xl border border-purple-500/25 bg-gradient-to-br from-[#120726]/95 via-[#090317]/98 to-[#04010a]/98 shadow-[0_25px_60px_-15px_rgba(84,44,133,0.45)] backdrop-blur-xl transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_30px_70px_-10px_rgba(147,51,234,0.5)]">
        {/* Top neon glow border line */}
        <div className="pointer-events-none absolute inset-x-12 top-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent shadow-[0_0_15px_rgba(192,132,252,0.9)]" />

        {/* Ambient background light spheres */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-[100px] transition-all duration-700 group-hover:bg-amber-500/25" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-purple-600/15 blur-[100px]" />

        <div className="relative flex min-h-[260px] w-full flex-col md:min-h-[300px] md:flex-row">
          {/* Background texture overlay */}
          <Image
            src="/images/live-cta-bg.jpg"
            alt=""
            fill
            className="rounded-3xl object-cover object-center opacity-25 mix-blend-overlay"
            sizes="100vw"
          />
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-l from-[#090317] via-[#090317]/90 to-transparent" />

          {/* Text & Content (Right Side in RTL) */}
          <div className="relative z-10 flex w-full flex-col items-center justify-center p-8 text-center md:w-[55%] md:items-start md:p-12 md:text-right">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-500/15 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span className="iranyekan-medium text-[12px] font-semibold text-amber-200 tracking-wide">
                فرصت استثنایی آموزش و تحلیل زنده
              </span>
            </div>

            <h2 className="iranyekan-black mb-4 text-2xl font-black leading-[1.3] text-white sm:text-3xl md:text-[34px] lg:text-[38px]">
              آماده‌ای بازار را{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-purple-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                مثل یک معامله‌گر حرفه‌ای
              </span>{" "}
              ببینی؟
            </h2>

            <p className="iranyekan-regular mb-8 max-w-lg text-[14px] leading-relaxed text-purple-200/70 sm:text-[15px]">
              فرصت یادگیری، کشف موقعیت‌های معاملاتی و پاسخ به سوالات در جلسات لایو را از دست نده!
            </p>

            <Button
              onClick={scrollToSessions}
              size="lg"
              className="iranyekan-demibold group/btn relative flex h-13 items-center gap-3 overflow-hidden rounded-2xl border border-purple-400/40 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 px-8 text-base font-semibold text-white shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] cursor-pointer"
            >
              <span>مشاهده‌ی جلسات</span>
              <ArrowLeftIcon size={20} className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
            </Button>
          </div>

          {/* 3D Pop-Out Bitcoin Bull */}
          <div className="pointer-events-none relative z-30 flex h-[280px] w-full items-center justify-center md:absolute md:-top-16 md:left-[2%] md:h-[380px] md:w-[48%] lg:-top-20 lg:left-[3%] lg:h-[420px] lg:w-[48%]">
            {/* Glowing aura directly behind the pop-out bull */}
            <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.35)_0%,rgba(168,85,247,0.25)_50%,transparent_75%)] blur-3xl md:h-80 md:w-80" />

            {/* The Cutout PNG Bull */}
            <div className="relative h-full w-full drop-shadow-[0_20px_35px_rgba(245,158,11,0.35)]">
              <Image
                src="/images/bitcoin-bull-cutout.png"
                alt="گاو بیت‌کوین تری‌دی بدون بک‌گراند"
                fill
                className="object-contain object-center scale-110 transition-transform duration-700 group-hover:scale-115 md:object-left-bottom"
                sizes="(max-width: 768px) 100vw, 48vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
