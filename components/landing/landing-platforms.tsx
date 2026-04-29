"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Shield, Zap } from "lucide-react";

const platforms = [
  {
    icon: BarChart3,
    title: "سیگنال طلا",
    desc: "تحلیل تخصصی انس طلا",
  },
  {
    icon: TrendingUp,
    title: "سیگنال ارز",
    desc: "فارکس و جفت ارزها",
  },
  {
    icon: Shield,
    title: "مدیریت ریسک",
    desc: "حد ضرر و سود هوشمند",
  },
  {
    icon: Zap,
    title: "هوش مصنوعی",
    desc: "تحلیل خودکار بازار",
  },
];

export function LandingPlatforms() {
  return (
    <div className="w-full min-h-[72px] relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl sm:rounded-full bg-[#542C85] px-4 sm:px-6 py-4 sm:py-0 sm:h-[72px] items-center justify-between gap-4">
      {platforms.map((p) => (
        <Card
          key={p.title}
          className="w-full rounded-3xl relative -top-2 bg-[#02000B]/90 border-[#542C85]/30 flex justify-between items-center px-6 py-4"
        >
          <p.icon className="w-10 h-10 text-[#542C85]" />
          <div className="text-center flex-1">
            <p className="font-bold text-white">{p.title}</p>
            <p className="text-sm text-white/70">{p.desc}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
