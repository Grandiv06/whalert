"use client";

import SectionHeader from "./section-header";
import { Skeleton } from "@/components/ui/skeleton";
import ToolCard from "./tool-card";
import { queryKeys } from "@/config/landing-query-keys";
import { toolsApi } from "@/lib/landing-api/tools";
import { useQuery } from "@tanstack/react-query";

const Tools = () => {
  const {
    data: tools,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.tools.list(),
    queryFn: toolsApi.getAll,
  });

  return (
    <div id="tools">
      <SectionHeader
        title="فرآیند تولید سیگنال‌های والرت"
        description="خدمات ما"
      />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 rounded-lg">
              <Skeleton className="w-full border-none h-[100px] mb-4 bg-primary-400/20" />
              <Skeleton className="border-none h-6 w-3/4 mb-2 bg-primary-400/20" />
              <Skeleton className="border-none h-4 w-full bg-primary-400/20" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="grid my-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "ماشین‌حساب مارجین", desc: "محاسبه لات و مارجین" },
            { title: "تحلیل تکنیکال", desc: "نمودارها و اندیکاتورها" },
            { title: "گزارش عملکرد", desc: "سابقه معاملات" },
            { title: "تنظیمات سیگنال", desc: "حد ضرر و سود" },
          ].map((t) => (
            <ToolCard
              key={t.title}
              title={t.title}
              description={t.desc}
              image="/images/monyHand.svg"
            />
          ))}
        </div>
      ) : !tools || tools.length === 0 ? (
        <div className="grid my-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "ثبت و آرشیو عملکرد", desc: "تمام سیگنالها ذخیره میشن تا قابل بررسی و مقایسه باشن" },
            { title: "تحلیل تکنیکال", desc: "نمودارها و اندیکاتورها" },
            { title: "گزارش عملکرد", desc: "سابقه معاملات" },
            { title: "تنظیمات سیگنال", desc: "حد ضرر و سود" },
          ].map((t) => (
            <ToolCard
              key={t.title}
              title={t.title}
              description={t.desc}
              image="/images/monyHand.svg"
            />
          ))}
        </div>
      ) : (
        <div className="grid my-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title || ""}
              description={tool.description || ""}
              image={tool.imageAddress || "/images/monyHand.svg"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tools;
