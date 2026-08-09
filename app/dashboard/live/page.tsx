import type { Metadata } from "next";
import { LiveContent } from "./live-content";

export const metadata: Metadata = {
  title: "تحلیل زنده بازار طلا | والرت",
  description: "همراه با تحلیل لحظه‌ای، بررسی فرصت‌های معاملاتی و پاسخ به سوالات شما",
};

export default function LiveAnalysisPage() {
  return (
    <div className="relative flex min-h-full w-full flex-col items-center">
      {/* Full-viewport background — extends behind the sidebar */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#02000b]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13072e]/40 via-[#02000b] to-[#02000b]" />

      <LiveContent />
    </div>
  );
}
