"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { useSidebar } from "@/contexts/sidebar-context";
import { useCreateSignalLoading } from "@/contexts/create-signal-loading-context";
import { User, LogOut, X, Crown, AlertTriangle, Bell } from "lucide-react";
import { renderIcon } from "@/lib/utils/iconMapper";
import Image from "next/image";
import {
  TokenAuthService,
  ProfileService,
  NotificationService,
  UserNotificationState,
  UserDashboardService,
  type CurrentUserProfileEditDto,
  type GetCurrentAppUserProfilePictureOutput,
  type UserSubscriptionPlanDetailsDto,
} from "@/lib/api/client";
import { cn, toPersianDigits } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { clearAuthSession } from "@/lib/auth-session";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NavItem {
  label: string;
  path: string;
  iconName?: string;
}

type AbpWrapper<T> = { result?: T };
type AbpWindow = Window & {
  abp?: {
    event?: {
      on: (eventName: string, handler: () => void) => void;
      off: (eventName: string, handler: () => void) => void;
    };
  };
};

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

const defaultNavItems: NavItem[] = [
  { label: "پیشخوان", path: "/dashboard/", iconName: "dashboard" },
  { label: "لایو طلا", path: "/dashboard/live/", iconName: "radio" },
  { label: "اشتراک من", path: "/dashboard/subscription/", iconName: "calendar" },
  { label: "پروفایل اساتید", path: "/dashboard/analysis/", iconName: "trending" },
  {
    label: "لیست سیگنال ها",
    path: "/dashboard/suggested/",
    iconName: "sparkles"
  },
];
const notificationsPageHref = "/dashboard/notifications/";

export function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const {
    isAnalyzing,
    isManualDirty,
    leaveModalRequest,
    setLeaveModalRequest,
  } =
    useCreateSignalLoading();
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [pendingNavigateTo, setPendingNavigateTo] = useState<string | null>(
    null,
  );
  const queryClient = useQueryClient();

  const shouldBlockNav =
    pathname === "/dashboard/create-signal/" && (isAnalyzing || isManualDirty);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (shouldBlockNav && href !== "/dashboard/create-signal/") {
      e.preventDefault();
      setPendingNavigateTo(href);
      setLeaveModalOpen(true);
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const handleConfirmLeave = () => {
    setIsMobileMenuOpen(false);
    setLeaveModalOpen(false);
    if (leaveModalRequest?.type === "back") {
      setLeaveModalRequest(null);
      router.back();
      router.back();
    } else if (leaveModalRequest?.target || pendingNavigateTo) {
      const target = leaveModalRequest?.target ?? pendingNavigateTo;
      if (target) router.push(target);
      setPendingNavigateTo(null);
      setLeaveModalRequest(null);
    }
  };

  const { data: profile, isPending: profileLoading } = useQuery({
    queryKey: ["currentUserProfileForEdit"],
    queryFn: async () => {
      const res =
        await ProfileService.apiServicesAppProfileGetcurrentuserprofileforeditGet();
      return unwrapAbp<CurrentUserProfileEditDto>(res);
    },
  });

  const { data: pictureOut } = useQuery({
    queryKey: ["profilePicture"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetcurrentappuserprofilepictureGet();
      return unwrapAbp<GetCurrentAppUserProfilePictureOutput>(res);
    },
  });

  const { data: subscriptionDetails } = useQuery({
    queryKey: ["sidebar-mySubscriptionPlanDetails"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetmysubscriptionplandetailsGet();
      return unwrapAbp<UserSubscriptionPlanDetailsDto>(res);
    },
  });

  const displayName = profile
    ? [profile.name, profile.surname].filter(Boolean).join(" ").trim()
    : "";
  const displayPhone =
    profile?.phoneNumber && profile.phoneNumber.length > 0
      ? toPersianDigits(profile.phoneNumber)
      : "";
  const avatarSrc = profileImageSrc(pictureOut?.profilePicture ?? undefined);
  const hasActiveSubscription =
    !!subscriptionDetails?.hasSubscription &&
    (subscriptionDetails?.remainingDays ?? 0) > 0;

  const navItems = useMemo(() => defaultNavItems, []);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    data: notificationsSummary,
  } = useQuery({
    queryKey: ["sidebar-user-notifications"],
    queryFn: async () => {
      const res = await NotificationService.apiServicesAppNotificationGetusernotificationsGet(
        undefined,
        undefined,
        undefined,
        8,
        0,
      );
      const payload = (
        res as {
          result?: {
            items?: Array<{ state?: UserNotificationState }> | null;
            unreadCount?: number;
          };
          items?: Array<{ state?: UserNotificationState }> | null;
          unreadCount?: number;
        }
      ).result ?? res;
      const items = payload.items ?? [];
      const unreadCount =
        typeof payload.unreadCount === "number"
          ? payload.unreadCount
          : items.filter((item) => item.state === UserNotificationState._0).length;
      return { unreadCount };
    },
  });

  const unreadNotificationsCount = notificationsSummary?.unreadCount ?? 0;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await TokenAuthService.apiTokenauthLogoutGet();
    } catch {
      // ignore; clear local state anyway
    }
    queryClient.clear();
    clearAuthSession();
    setIsMobileMenuOpen(false);
    setLogoutModalOpen(false);
    router.push("/auth/sign-in");
  };

  const handleOpenNotificationsPage = () => {
    if (shouldBlockNav) {
      setPendingNavigateTo(notificationsPageHref);
      setLeaveModalOpen(true);
      return;
    }
    setIsMobileMenuOpen(false);
    router.push(notificationsPageHref);
  };

  useEffect(() => {
    const root = document.getElementById("__next");
    const html = document.documentElement;

    if (isMobileMenuOpen) {
      document.body.style.setProperty("overflow", "hidden", "important");
      html.style.setProperty("overflow", "hidden", "important");
      if (root) root.style.setProperty("overflow", "hidden", "important");
    } else {
      document.body.style.removeProperty("overflow");
      html.style.removeProperty("overflow");
      if (root) root.style.removeProperty("overflow");
    }

    return () => {
      document.body.style.removeProperty("overflow");
      html.style.removeProperty("overflow");
      if (root) root.style.removeProperty("overflow");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const globalAbp = (window as AbpWindow).abp;
    if (!globalAbp?.event) return;
    const abpEvent = globalAbp.event;

    const handleNotificationReceived = () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar-user-notifications"] });
    };

    abpEvent.on("abp.notifications.received", handleNotificationReceived);
    return () => {
      abpEvent.off("abp.notifications.received", handleNotificationReceived);
    };
  }, [queryClient]);

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] lg:hidden touch-none"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`
          fixed right-0 top-0 h-full z-[50] w-[294px] max-w-[85vw]
          transition-all duration-500 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div
          className={`
            h-full rounded-l-[40px] flex flex-col shadow-lg border p-2
            transition-colors duration-300
            ${
              theme === "dark"
                ? "bg-[#02000B]/30 border-white/5 backdrop-blur-sm"
                : "bg-gray-100/80 border-gray-200/50 backdrop-blur-sm"
            }
          `}
          dir="rtl"
          style={{ direction: "rtl" }}
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute right-4 top-4 z-10 p-2 rounded-lg transition-colors duration-200 text-white"
            aria-label="بستن منو"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo - links to landing */}
          <div className="flex justify-center pt-6 pb-4">
            <Link
              href="/"
              onClick={(e) => {
                if (shouldBlockNav) {
                  e.preventDefault();
                  setPendingNavigateTo("/");
                  setLeaveModalOpen(true);
                } else {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="block"
            >
              <Image
                src="/images/logo/walert.png"
                alt="Whalert"
                width={240}
                height={80}
                className="w-60 object-cover h-20"
              />
            </Link>
          </div>

          {/* User Profile */}
          <div
            className="px-4 transition-all duration-500 ease-in-out"
            dir="rtl"
          >
            <div
              className={`relative rounded-xl p-4 mb-4 ${
                theme === "dark"
                  ? "bg-[#D9D9D9]/15 border border-white/5"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-16 h-16 rounded-full border-2 overflow-hidden shrink-0 ${
                    theme === "dark" ? "border-purple-500" : "border-purple-400"
                  }`}
                >
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarSrc}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"
                      }`}
                    >
                      <User
                        size={32}
                        className="text-purple-400"
                        strokeWidth={2}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end justify-center min-w-0 flex-1">
                  {profileLoading ? (
                    <>
                      <Skeleton
                        className={`h-5 w-32 mb-2 rounded-md self-end ${
                          theme === "dark" ? "bg-white/10" : "bg-gray-200"
                        }`}
                      />
                      <Skeleton
                        className={`h-4 w-28 rounded-md self-end ${
                          theme === "dark" ? "bg-white/10" : "bg-gray-200"
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-base font-bold truncate w-full text-right ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {displayName || "کاربر"}
                      </p>
                      {displayPhone ? (
                        <p
                          className={`text-sm truncate w-full text-right tabular-nums ${
                            theme === "dark"
                              ? "text-white/70"
                              : "text-gray-600"
                          }`}
                        >
                          {displayPhone}
                        </p>
                      ) : (
                        <p
                          className={`text-sm truncate w-full text-right ${
                            theme === "dark"
                              ? "text-white/40"
                              : "text-gray-400"
                          }`}
                        >
                          —
                        </p>
                      )}
                      <div className="w-full flex justify-start mt-0.5">
                        <Link
                          href="/dashboard/subscription/"
                          onClick={(e) => {
                            if (shouldBlockNav) {
                              e.preventDefault();
                              setPendingNavigateTo("/dashboard/subscription");
                              setLeaveModalOpen(true);
                            } else {
                              setIsMobileMenuOpen(false);
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border border-[#B57CFF]/40 bg-[#542C85]/20 text-[#D8BCFF] backdrop-blur-sm hover:bg-[#542C85]/35 transition-colors"
                        >
                          <Crown className="w-2.5 h-2.5" />
                          {hasActiveSubscription ? "اشتراک فعال" : "اشتراک فعال نیست"}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-row-reverse items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleOpenNotificationsPage}
                  className={cn(
                    "relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[13px] border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03]",
                    theme === "dark"
                      ? "border-white/10 bg-white/5 text-white/90 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_10px_20px_-14px_rgba(181,124,255,0.35)]"
                      : "border-purple-100 bg-purple-50 text-purple-700 hover:border-purple-200 hover:bg-purple-100 hover:shadow-[0_10px_20px_-14px_rgba(124,58,237,0.16)]",
                  )}
                  aria-label="صفحه اعلان‌ها"
                  title="صفحه اعلان‌ها"
                >
                  <Bell className="h-3.25 w-3.25 opacity-90" strokeWidth={1.7} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-4 text-white shadow-sm">
                      {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                    </span>
                  )}
                </button>
                <Link
                  href="/dashboard/settings/account-setting/"
                  onClick={(e) => {
                    if (shouldBlockNav) {
                      e.preventDefault();
                      setPendingNavigateTo(
                        "/dashboard/settings/account-setting",
                      );
                      setLeaveModalOpen(true);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 rounded-[14px] py-2.5 px-4 transition-all duration-300 ease-out w-full
                    ${
                      theme === "dark"
                        ? "bg-[#542C85] hover:bg-[#61349B] text-white shadow-[0_10px_24px_-14px_rgba(181,124,255,0.55)] hover:shadow-[0_14px_28px_-14px_rgba(181,124,255,0.7)] hover:-translate-y-0.5"
                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-[0_10px_24px_-14px_rgba(124,58,237,0.35)] hover:shadow-[0_14px_28px_-14px_rgba(124,58,237,0.45)] hover:-translate-y-0.5"
                    }
                  `}
                >
                  <span className="text-xs font-medium">
                    تنظیمات حساب کاربری
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav
            dir="rtl"
            className="flex-1 px-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent py-3 transition-all duration-500 ease-in-out"
          >
            {navItems.map((item) => {
              const isProviderDetailsOpportunitiesPage =
                pathname === "/dashboard/opportunities/" &&
                searchParams.has("signalProviderId");
              const isActive =
                pathname === item.path &&
                !(item.path === "/dashboard/opportunities/" &&
                  isProviderDetailsOpportunitiesPage);
              const willBlock =
                shouldBlockNav && item.path !== "/dashboard/create-signal";

              return (
                <div key={item.path} className="space-y-1">
                  {willBlock ? (
                    <button
                      type="button"
                      onClick={(e) => handleNavClick(e, item.path)}
                      dir="rtl"
                      className={`
                      group relative flex items-center gap-3 ps-4 pe-4 h-12 rounded-[14px] transition-all duration-200 w-full cursor-pointer
                      ${
                        isActive
                          ? theme === "dark"
                            ? "bg-white text-[#542C85]"
                            : "bg-white text-teal-600"
                          : theme === "dark"
                            ? "text-gray-300 hover:bg-white/5 hover:text-white"
                            : "text-gray-700 hover:bg-gray-200/50 hover:text-gray-900"
                      }
                      ${isActive && `before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-[60%] before:h-[5px] before:rounded-t-full ${theme === "dark" ? "before:bg-[#542C85]" : "before:bg-teal-500"}`}
                    `}
                    >
                      <div
                        className={`flex-shrink-0 transition-transform duration-200 ${
                          isActive ? "scale-110" : "group-hover:scale-105"
                        }`}
                      >
                        {renderIcon(item.iconName, {
                          className: `flex-shrink-0 ${
                            isActive
                              ? "text-[#542C85]"
                              : theme === "dark"
                                ? "text-gray-300 group-hover:text-white"
                                : "text-gray-700"
                          }`,
                        })}
                      </div>
                      <span
                        className={`truncate text-right flex-1 min-w-0 ${
                          isActive ? "iranyekan-demibold" : "iranyekan-light"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      dir="rtl"
                      className={`
                        group relative flex items-center gap-3 ps-4 pe-4 h-12 rounded-[14px] transition-all duration-200 w-full
                        ${
                          isActive
                            ? theme === "dark"
                              ? "bg-white text-[#542C85]"
                              : "bg-white text-teal-600"
                            : theme === "dark"
                              ? "text-gray-300 hover:bg-white/5 hover:text-white"
                              : "text-gray-700 hover:bg-gray-200/50 hover:text-gray-900"
                        }
                        ${isActive && `before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-[60%] before:h-[5px] before:rounded-t-full ${theme === "dark" ? "before:bg-[#542C85]" : "before:bg-teal-500"}`}
                      `}
                    >
                      <div
                        className={`flex-shrink-0 transition-transform duration-200 ${
                          isActive ? "scale-110" : "group-hover:scale-105"
                        }`}
                      >
                        {renderIcon(item.iconName, {
                          className: `flex-shrink-0 ${
                            isActive
                              ? "text-[#542C85]"
                              : theme === "dark"
                                ? "text-gray-300 group-hover:text-white"
                                : "text-gray-700"
                          }`,
                        })}
                      </div>
                      <span
                        className={`truncate text-right flex-1 min-w-0 ${
                          isActive ? "iranyekan-demibold" : "iranyekan-light"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="px-3 pb-4 space-y-2" dir="rtl">
            <button
              onClick={() => setLogoutModalOpen(true)}
              className={`
                w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 transition-all duration-200 cursor-pointer
                ${
                  theme === "dark"
                    ? "bg-[#542C85] hover:bg-purple-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }
              `}
              aria-label="Logout"
              title="خروج از پنل کاربری"
            >
              <LogOut size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium">خروج از پنل کاربری</span>
            </button>
          </div>

          <AlertDialog
            open={logoutModalOpen}
            onOpenChange={(open) => !isLoggingOut && setLogoutModalOpen(open)}
          >
            <AlertDialogContent
              className="bg-[#1A1A2E] border-white/10"
              dir="rtl"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  خروج از پنل کاربری
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white/70">
                  آیا مطمئن هستید که می‌خواهید از پنل کاربری خارج شوید؟
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-3">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`
                    inline-flex h-11 items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${
                      isLoggingOut
                        ? "opacity-50 cursor-not-allowed"
                        : theme === "dark"
                          ? "bg-[#542C85] hover:bg-purple-700 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                    }
                  `}
                >
                  {isLoggingOut ? "در حال خروج..." : "تایید و خروج"}
                </button>
                <AlertDialogCancel
                  disabled={isLoggingOut}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
                >
                  انصراف
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={leaveModalOpen || !!leaveModalRequest}
            onOpenChange={(open) => {
              if (!open) {
                setPendingNavigateTo(null);
                setLeaveModalRequest(null);
              }
              setLeaveModalOpen(open);
            }}
          >
            <AlertDialogContent
              className="w-[calc(100%-2rem)] max-w-md rounded-2xl border-white/10 bg-[radial-gradient(120%_120%_at_80%_0%,rgba(124,77,204,0.28),rgba(26,26,46,0.94)_45%,rgba(12,8,25,0.98)_100%)] backdrop-blur-xl sm:w-full"
              dir="rtl"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  {isAnalyzing ? "لغو عملیات تحلیل" : "خروج از صفحه ایجاد سیگنال"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white/75 leading-7">
                  {isAnalyzing
                    ? "هوش مصنوعی در حال استخراج داده است. با خروج از این صفحه، فرآیند تحلیل متوقف می‌شود."
                    : "شما روی چارت نقاطی ثبت کرده‌اید. اگر خارج شوید، نقاط ورود/حدسود/حدضرر پاک می‌شوند و قابل بازگشت نیستند."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-3">
                <button
                  onClick={handleConfirmLeave}
                  disabled={!pendingNavigateTo && !leaveModalRequest}
                  className="inline-flex h-11 items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-[#6B3FA5] to-[#542C85] hover:brightness-110 text-white shadow-[0_0_24px_-8px_rgba(124,77,204,0.95)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isAnalyzing ? "بله، تحلیل لغو شود" : "بله، خارج می‌شوم"}
                </button>
                <AlertDialogCancel
                  onClick={() => setLeaveModalOpen(false)}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
                >
                  ماندن در صفحه
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
