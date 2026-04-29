"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Menu, User } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";
import { dashboardSettingsHref } from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";
import {
  UserDashboardService,
  type GetCurrentAppUserProfilePictureOutput,
} from "@/lib/api/client";

type AbpWrapper<T> = { result?: T };

function unwrapAbp<T>(res: unknown): T {
  const w = res as AbpWrapper<T>;
  return (w?.result ?? res) as T;
}

function profileImageSrc(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }
  return `data:image/jpeg;base64,${raw}`;
}

export function DashboardHeader() {
  const { toggleMobileMenu } = useSidebar();
  const { data: pictureOut } = useQuery({
    queryKey: ["profilePicture"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetcurrentappuserprofilepictureGet();
      return unwrapAbp<GetCurrentAppUserProfilePictureOutput>(res);
    },
  });
  const avatarSrc = profileImageSrc(pictureOut?.profilePicture ?? undefined);

  return (
    <header
      className="lg:hidden flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4 sticky top-0 z-30 bg-background/80 backdrop-blur-md"
      dir="rtl"
    >
      <button
        type="button"
        onClick={toggleMobileMenu}
        className="p-2 rounded-xl transition-all duration-200 hover:bg-white/10 text-foreground"
        aria-label="باز کردن منو"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-2">
        <Link href={dashboardSettingsHref} className="flex items-center">
          <div
            className={cn(
              "w-9 h-9 rounded-full overflow-hidden border border-primary/50",
              "flex items-center justify-center bg-primary/20"
            )}
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="پروفایل کاربر"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
