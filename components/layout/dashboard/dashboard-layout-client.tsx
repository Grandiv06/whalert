"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";
import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";
import { cn } from "@/lib/utils";
import { ensureValidAccessToken } from "@/lib/auth-session";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const token = await ensureValidAccessToken();
      if (!isMounted) return;

      if (!token) {
        setIsAuthorized(false);
        router.replace("/auth/sign-in");
        return;
      }

      setIsAuthorized(true);
    };

    void checkSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div
        className="flex min-h-screen w-full flex-col items-center justify-center gap-6 dark-bg-gradient"
        dir="rtl"
      >
        <div
          className="h-14 w-14 animate-spin rounded-full border-4 border-[#542C85]/25 border-t-[#542C85] border-r-[#8445C2]"
          role="status"
          aria-label="در حال بارگذاری"
        />
        <p className="text-sm font-medium text-white/70">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div
      className="flex min-h-screen w-full overflow-x-hidden dark-bg-gradient"
      dir="rtl"
      style={{ direction: "rtl" }}
    >
      <DashboardSidebar />
      <div
        className={cn(
          "flex flex-col flex-1 relative z-0 transition-all duration-500 ease-in-out min-w-0 max-w-full",
          isCollapsed ? "lg:mr-[100px]" : "lg:mr-[294px]",
        )}
        dir="rtl"
        style={{ direction: "rtl" }}
      >
        <DashboardHeader />
        <main
          className="flex flex-1 flex-col gap-4 p-4 md:p-4 text-right"
          dir="rtl"
          style={{ direction: "rtl" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
