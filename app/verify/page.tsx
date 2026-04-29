"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubscriptionPurchaseService } from "@/lib/api/client";

type VerifyResult = {
  isPaymentVerified?: boolean;
  referenceId?: string | null;
};

type AbpWrapper<T> = { result?: T };

function unwrapAbp<T>(value: unknown): T | null {
  if (!value || typeof value !== "object") return null;
  const wrapper = value as AbpWrapper<T>;
  if (wrapper.result && typeof wrapper.result === "object") return wrapper.result;
  return value as T;
}

export default function VerifyPage() {
  const router = useRouter();
  const [secondsToRedirect, setSecondsToRedirect] = useState(5);
  const params = useMemo(
    () => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""),
    [],
  );

  const authority = params.get("authority") ?? undefined;
  const status = params.get("status") ?? undefined;
  const paymentIdRaw = params.get("paymentId");
  const paymentId = paymentIdRaw ? Number(paymentIdRaw) : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["verify-subscription-payment", authority, status, paymentId],
    enabled: Boolean(authority || paymentId),
    queryFn: async () => {
      const response = await SubscriptionPurchaseService.apiServicesAppSubscriptionpurchaseVerifypaymentGet(
        authority,
        status,
        Number.isFinite(paymentId) ? paymentId : undefined,
      );
      return unwrapAbp<VerifyResult>(response);
    },
  });

  const isSuccess = data?.isPaymentVerified === true;

  useEffect(() => {
    if (isLoading) return;
    const intervalId = window.setInterval(() => {
      setSecondsToRedirect((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          router.push("/dashboard/subscription");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isLoading, router]);

  return (
    <main
      dir="rtl"
      className="min-h-screen w-full bg-[#070014] text-white flex items-center justify-center px-4"
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">نتیجه پرداخت</h1>

        {isLoading && <p className="text-white/70">در حال بررسی پرداخت...</p>}

        {!isLoading && isError && (
          <p className="text-rose-300">بررسی پرداخت با خطا مواجه شد.</p>
        )}

        {!isLoading && !isError && (
          <>
            <p className={isSuccess ? "text-emerald-300" : "text-amber-300"}>
              {isSuccess ? "پرداخت با موفقیت تایید شد." : "پرداخت تایید نشد."}
            </p>
            {data?.referenceId && (
              <p className="text-sm text-white/70">
                کد پیگیری: <span className="font-semibold">{data.referenceId}</span>
              </p>
            )}
          </>
        )}

        {!isLoading && (
          <p className="text-xs text-white/60">
            انتقال خودکار به صفحه اشتراک من تا {secondsToRedirect} ثانیه دیگر
          </p>
        )}

        <div className="pt-3">
          <Link
            href="/dashboard/subscription"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#5D31A0] px-6 text-white hover:bg-[#6A3D9C]"
          >
            بازگشت به اشتراک من
          </Link>
        </div>
      </div>
    </main>
  );
}
