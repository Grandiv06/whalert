"use client";

import { Clock, Headset, MessageSquareText, Wifi } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "سوالات خود را بپرسید",
      description: "در پایان جلسه، به سوالات شما به صورت زنده پاسخ داده می‌شود.",
      icon: <MessageSquareText className="w-6 h-6 text-primary-300" />
    },
    {
      title: "اینترنت پایدار",
      description: "برای تجربه بهتر از اینترنت پایدار و سرعت مناسب استفاده کنید",
      icon: <Wifi className="w-6 h-6 text-primary-300" />
    },
    {
      title: "صرفه‌جویی در زمان",
      description: "ده دقیقه زودتر وارد شوید و آماده شروع باشید.",
      icon: <Clock className="w-6 h-6 text-primary-300" />
    },
    {
      title: "پشتیبانی و پاسخگویی",
      description: "در طول جلسات سوالات شما پاسخ داده می‌شود.",
      icon: <Headset className="w-6 h-6 text-primary-300" />
    }
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-primary-500/30 my-4">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center text-center group">
          <div className="w-14 h-14 rounded-full bg-primary-700 border border-primary-500/50 flex items-center justify-center mb-4 group-hover:border-primary-400 group-hover:shadow-[0_0_15px_rgba(126,78,172,0.3)] transition-all duration-300">
            {feature.icon}
          </div>
          <h4 className="text-white iranyekan-medium text-lg mb-2">
            {feature.title}
          </h4>
          <p className="text-font-light iranyekan-regular text-sm px-2">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
