"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionPurchaseService, type VerifySubscriptionPaymentOutput } from "@/lib/api/client";
import { toPersianDigits } from "@/lib/utils";

type AbpWrapper<T> = { result?: T; success?: boolean; error?: any };

function unwrapAbp<T>(res: unknown): T | null {
  const w = res as AbpWrapper<T>;
  if (w && typeof w === "object") {
    if (w.result !== undefined) return w.result;
    if (w.success === false) return null;
  }
  return res as T;
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifySubscriptionPaymentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get("paymentId");
  const authority = searchParams.get("Authority") || searchParams.get("authority");
  const status = searchParams.get("Status") || searchParams.get("status");

  useEffect(() => {
    async function verify() {
      if (!authority || !paymentId) {
        setError("اطلاعات پرداخت یافت نشد.");
        setLoading(false);
        return;
      }

      try {
        const res = await SubscriptionPurchaseService.apiServicesAppSubscriptionpurchaseVerifypaymentGet(
          authority,
          status || "",
          Number(paymentId)
        );
        const data = unwrapAbp<VerifySubscriptionPaymentOutput>(res);
        setResult(data);
      } catch (err) {
        console.error("Verification error:", err);
        setError("خطا در تایید پرداخت. لطفا با پشتیبانی تماس بگیرید.");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [authority, paymentId, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02000B] text-white p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-[#542C85]/40 rounded-full animate-pulse" />
            <Loader2 className="w-16 h-16 text-[#B57CFF] animate-spin relative mx-auto" />
          </div>
          <h1 className="text-2xl font-bold">در حال تایید پرداخت...</h1>
          <p className="text-white/60">لطفا شکیبا باشید، در حال استعلام از درگاه بانکی هستیم.</p>
        </div>
      </div>
    );
  }

  const isSuccess = result?.isPaymentVerified && status?.toUpperCase() === "OK";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02000B] bg-[url('/images/landing-bg.svg')] bg-cover bg-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <Card className="relative w-full max-w-lg overflow-hidden rounded-4xl border-white/10 bg-gradient-to-br from-[#120A24]/90 to-[#02000B]/95 shadow-2xl shadow-[#542C85]/20">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl ${isSuccess ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />
          <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl ${isSuccess ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />
        </div>

        <CardContent className="p-8 md:p-10 relative">
          <div className="flex flex-col items-center text-center space-y-6">
            {isSuccess ? (
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-rose-400" />
              </div>
            )}

            <div className="space-y-2">
              <h2 className={`text-3xl font-black ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSuccess ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}
              </h2>
              <p className="text-white/70">
                {isSuccess 
                  ? "اشتراک شما با موفقیت فعال گردید. از امکانات جدید لذت ببرید!"
                  : error || "متاسفانه فرآیند پرداخت با خطا مواجه شد یا توسط شما لغو گردید."}
              </p>
            </div>

            {result && (
              <div className="w-full space-y-3 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">شماره تراکنش</span>
                  <span className="text-white font-mono">{toPersianDigits(result.paymentId?.toString() || "—")}</span>
                </div>
                {result.referenceId && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">کد رهگیری</span>
                    <span className="text-white font-mono">{toPersianDigits(result.referenceId)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">وضعیت</span>
                  <span className={isSuccess ? "text-emerald-400" : "text-rose-400"}>
                    {isSuccess ? "تایید شده" : "ناموفق / لغو شده"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
              <Button 
                onClick={() => router.push("/dashboard/subscription")}
                className="flex-1 h-12 rounded-2xl bg-[#542C85] hover:bg-[#6b3ca8] text-white border-0 shadow-lg shadow-[#542C85]/30 group"
              >
                <span>مشاهده اشتراک</span>
                <ArrowRight className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1 h-12 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Home className="w-4 h-4 ml-2" />
                <span>بازگشت به داشبورد</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#02000B] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#B57CFF]" />
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
