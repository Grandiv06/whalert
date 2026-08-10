"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import PlansSection from "@/components/shared/plans-section";
import { cn } from "@/lib/utils";

type PlansModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description?: string;
  title?: string;
  /** Show only plans that include live trade access. */
  onlyLiveSessions?: boolean;
};

export function PlansModal({
  open,
  onOpenChange,
  title = "انتخاب پلن اشتراک",
  description = "پلن مناسب خود را انتخاب کنید و اشتراک خود را فعال کنید.",
  onlyLiveSessions = false,
}: PlansModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[92vh] w-[95vw] overflow-hidden border border-white/15 bg-[#0b0518] p-0 text-white shadow-[0_28px_110px_rgba(93,49,160,0.5)] sm:rounded-3xl",
          onlyLiveSessions ? "max-w-lg" : "max-w-6xl",
        )}
        dir="rtl"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(181,124,255,0.22)_0%,transparent_55%),radial-gradient(90%_70%_at_0%_100%,rgba(79,70,229,0.16)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-l from-transparent via-[#D6B4FF]/70 to-transparent" />

        <div className="relative hidden sm:block border-b border-white/10 px-5 pb-4 pt-6 sm:px-7 sm:pt-7">
          <h2 className="text-right text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1.5 text-right text-sm text-white/55">{description}</p>
        </div>

        <div className="relative max-h-[calc(92vh-100px)] overflow-y-auto overflow-x-hidden px-4 pb-5 pt-10 sm:px-6 sm:py-6 custom-scrollbar">
          <PlansSection
            showHeader={false}
            onlyLiveSessions={onlyLiveSessions}
            onPurchaseSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
