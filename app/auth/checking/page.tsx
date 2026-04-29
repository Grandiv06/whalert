"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ensureValidAccessToken } from "@/lib/auth-session";

/**
 * Shown when user tries to access dashboard without auth cookie.
 * Shows spinner, checks localStorage (for users who logged in before cookie was added),
 * then redirects to dashboard or sign-in.
 */
export default function AuthCheckingPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const token = await ensureValidAccessToken();
      if (!isMounted) return;
      router.replace(token ? "/dashboard" : "/auth/sign-in");
    };

    void checkSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#1a0c35] dark-bg-gradient"
      dir="rtl"
    >
      <div
        className="h-14 w-14 animate-spin rounded-full border-4 border-[#542C85]/25 border-t-[#542C85] border-r-[#8445C2]"
        role="status"
        aria-label="در حال بررسی"
      />
      <p className="text-sm font-medium text-white/70">در حال بررسی...</p>
    </div>
  );
}
