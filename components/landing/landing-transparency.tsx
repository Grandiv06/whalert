"use client";

import { Eye, FileCheck, Shield } from "lucide-react";

const items = [
  {
    icon: Eye,
    title: "شفافیت کامل",
    desc: "همه سیگنال‌ها با سابقه و نتیجه ثبت می‌شن",
  },
  {
    icon: FileCheck,
    title: "آرشیو معاملات",
    desc: "دسترسی به تاریخچه و آمار عملکرد",
  },
  {
    icon: Shield,
    title: "مسئولیت‌پذیری",
    desc: "هر سیگنال با سناریوی مدیریت ریسک",
  },
];

export function LandingTransparency() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
        شفافیت و مسئولیت
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="p-6 rounded-2xl bg-[#542C85]/10 border border-[#542C85]/20 text-center"
          >
            <item.icon className="w-14 h-14 text-[#542C85] mx-auto mb-4" />
            <h3 className="font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-white/60">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
