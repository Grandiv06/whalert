"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BarChart2, FileText, Settings } from "lucide-react";

const tools = [
  { icon: Calculator, title: "ماشین‌حساب مارجین", desc: "محاسبه لات و مارجین" },
  { icon: BarChart2, title: "تحلیل تکنیکال", desc: "نمودارها و اندیکاتورها" },
  { icon: FileText, title: "گزارش عملکرد", desc: "سابقه معاملات" },
  { icon: Settings, title: "تنظیمات سیگنال", desc: "حد ضرر و سود" },
];

export function LandingTools() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
        ابزارهای معاملاتی
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((t) => (
          <Card
            key={t.title}
            className="bg-[#02000B]/30 border-[#542C85]/20 hover:border-[#542C85]/40 transition-colors"
          >
            <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
              <t.icon className="w-12 h-12 text-[#542C85]" />
              <h3 className="font-bold text-white">{t.title}</h3>
              <p className="text-sm text-white/60">{t.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
