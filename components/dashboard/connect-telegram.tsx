"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  ProfileService,
  UserDashboardService,
  type CurrentUserProfileEditDto,
  type TelegramConnectLinkOutput,
  type TelegramConnectSyncOutput,
} from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AbpWrapper<T> = { result?: T };

type ConnectStatus =
  | "idle"
  | "loading"
  | "waiting"
  | "connected"
  | "expired"
  | "error";

type ConnectTelegramProps = {
  className?: string;
  /** Called after Telegram is successfully linked. */
  onConnected?: (telegramId: string) => void;
  /** Optional custom error handler (e.g. parent toast). */
  onError?: (message: string) => void;
};

function unwrapAbp<T>(res: unknown): T {
  const w = res as AbpWrapper<T>;
  return (w?.result ?? res) as T;
}

function isSafeTelegramUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "t.me" || parsed.hostname.endsWith(".t.me"))
    );
  } catch {
    return false;
  }
}

function openTelegramUrl(url: string) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(url);
  }
}

function TelegramBrandMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/images/brands/telegram-logo.png"
      alt="تلگرام"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      priority={false}
    />
  );
}

export function ConnectTelegram({
  className,
  onConnected,
  onError,
}: ConnectTelegramProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ConnectStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectLink, setConnectLink] =
    useState<TelegramConnectLinkOutput | null>(null);
  const [linkedTelegramId, setLinkedTelegramId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const pollRef = useRef<number | null>(null);
  const checkingRef = useRef(false);
  const connectedNotifiedRef = useRef(false);
  const connectLinkRef = useRef<TelegramConnectLinkOutput | null>(null);

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["currentUserProfileForEdit"],
    queryFn: async () => {
      const res =
        await ProfileService.apiServicesAppProfileGetcurrentuserprofileforeditGet();
      return unwrapAbp<CurrentUserProfileEditDto>(res);
    },
  });

  const profileTelegramId = profile?.telegramId?.trim() || null;
  const telegramId = linkedTelegramId || profileTelegramId;
  const isConnected =
    Boolean(telegramId) || status === "connected";

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const markConnected = useCallback(
    (id: string) => {
      clearPoll();
      setLinkedTelegramId(id === "connected" ? null : id);
      setStatus("connected");
      setErrorMessage(null);
      setConnectLink(null);
      connectLinkRef.current = null;
      void queryClient.invalidateQueries({
        queryKey: ["currentUserProfileForEdit"],
      });
      if (!connectedNotifiedRef.current) {
        connectedNotifiedRef.current = true;
        onConnected?.(id);
      }
    },
    [clearPoll, onConnected, queryClient],
  );

  const fail = useCallback(
    (message: string) => {
      clearPoll();
      setStatus("error");
      setErrorMessage(message);
      onError?.(message);
    },
    [clearPoll, onError],
  );

  useEffect(() => {
    if (profileTelegramId) {
      setLinkedTelegramId(profileTelegramId);
      setStatus("connected");
      connectedNotifiedRef.current = true;
    }
  }, [profileTelegramId]);

  const syncFromBot = useCallback(async (): Promise<string | null> => {
    try {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardSynctelegramconnectPost();
      const sync = unwrapAbp<TelegramConnectSyncOutput>(res);
      if (sync?.connected) {
        return sync.telegramId?.trim() || "connected";
      }
    } catch {
      // Sync is best-effort while waiting; profile poll remains the fallback.
    }
    return null;
  }, []);

  const checkConnection = useCallback(async () => {
    if (checkingRef.current) return false;
    checkingRef.current = true;
    try {
      const syncedId = await syncFromBot();
      if (syncedId) {
        markConnected(syncedId);
        return true;
      }

      const { data: updated } = await refetchProfile();
      const id = updated?.telegramId?.trim();
      if (id) {
        markConnected(id);
        return true;
      }

      const expiresAtUtc = connectLinkRef.current?.expiresAtUtc;
      if (expiresAtUtc) {
        const expiresAt = new Date(expiresAtUtc).getTime();
        if (Number.isFinite(expiresAt) && Date.now() > expiresAt) {
          clearPoll();
          setStatus("expired");
          setErrorMessage(
            "لینک اتصال منقضی شده است. لطفاً دوباره اتصال را شروع کنید.",
          );
          return true;
        }
      }

      return false;
    } finally {
      checkingRef.current = false;
    }
  }, [clearPoll, markConnected, refetchProfile, syncFromBot]);

  useEffect(() => {
    if (status !== "waiting") {
      clearPoll();
      return;
    }

    void checkConnection();
    pollRef.current = window.setInterval(() => {
      void checkConnection();
    }, 1500);

    return clearPoll;
  }, [status, checkConnection, clearPoll]);

  // When user returns from Telegram, sync immediately.
  useEffect(() => {
    if (status !== "waiting") return;

    const onResume = () => {
      void checkConnection();
    };

    window.addEventListener("focus", onResume);
    document.addEventListener("visibilitychange", onResume);
    return () => {
      window.removeEventListener("focus", onResume);
      document.removeEventListener("visibilitychange", onResume);
    };
  }, [status, checkConnection]);

  const handleConnect = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    setConnectLink(null);
    connectLinkRef.current = null;
    connectedNotifiedRef.current = false;
    clearPoll();

    try {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGettelegramconnectlinkGet();
      const link = unwrapAbp<TelegramConnectLinkOutput>(res);
      const url = link?.url?.trim();

      if (!url || !isSafeTelegramUrl(url)) {
        throw new Error("invalid-link");
      }

      connectLinkRef.current = link;
      setConnectLink(link);
      openTelegramUrl(url);
      setStatus("waiting");
    } catch {
      fail("دریافت لینک اتصال تلگرام ناموفق بود. دوباره تلاش کنید.");
    }
  }, [clearPoll, fail]);

  const handleReopenLink = useCallback(() => {
    const url = connectLinkRef.current?.url?.trim() || connectLink?.url?.trim();
    if (url && isSafeTelegramUrl(url)) {
      openTelegramUrl(url);
      return;
    }
    void handleConnect();
  }, [connectLink?.url, handleConnect]);

  const handleManualSync = useCallback(async () => {
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const connectedNow = await checkConnection();
      if (!connectedNow && status === "waiting") {
        setErrorMessage(
          "هنوز متصل نشده‌اید. در تلگرام روی Start بزنید، سپس دوباره بررسی کنید.",
        );
      }
    } finally {
      setIsSyncing(false);
    }
  }, [checkConnection, status]);

  const botLabel = connectLink?.botUsername
    ? `@${connectLink.botUsername.replace(/^@/, "")}`
    : "@signal_studio_alert_bot";

  if (profileLoading && !profile) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050505] p-6",
          className,
        )}
        dir="rtl"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-3 w-56 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050505] p-5 sm:p-6",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_50px_-30px_rgba(0,0,0,0.9)]",
        className,
      )}
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(36,161,222,0.12)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors",
              isConnected
                ? "border-emerald-400/25 bg-emerald-500/10"
                : "border-[#24A1DE]/25 bg-[#24A1DE]/10",
            )}
          >
            <TelegramBrandMark size={28} />
            {isConnected ? (
              <span className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#050505] bg-emerald-500 text-white shadow-sm">
                <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
              </span>
            ) : null}
          </div>

          <div className="min-w-0 space-y-1.5 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold tracking-tight text-white">
                اتصال تلگرام
              </h3>
              {isConnected ? (
                <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                  متصل
                </span>
              ) : null}
            </div>

            {isConnected ? (
              <p className="text-sm leading-6 text-white/55">
                حساب تلگرام شما متصل است و سیگنال‌ها به ربات ارسال می‌شوند.
                {telegramId && telegramId !== "connected" ? (
                  <span
                    className="mt-1 block font-mono text-xs text-white/35"
                    dir="ltr"
                  >
                    ID · {telegramId}
                  </span>
                ) : null}
              </p>
            ) : status === "waiting" ? (
              <div className="space-y-1.5 text-sm leading-6 text-white/60">
                <p>
                  تلگرام را باز کنید، روی{" "}
                  <span className="font-medium text-white">Start</span> بزنید،
                  سپس به همین صفحه برگردید.
                </p>
                <p className="text-xs text-white/40" dir="ltr">
                  Bot · {botLabel}
                </p>
              </div>
            ) : status === "loading" ? (
              <p className="text-sm leading-6 text-white/55">
                در حال آماده‌سازی لینک امن اتصال...
              </p>
            ) : status === "expired" ? (
              <p className="text-sm leading-6 text-amber-200/80">
                لینک قبلی منقضی شده است. برای دریافت لینک جدید دوباره تلاش کنید.
              </p>
            ) : (
              <p className="text-sm leading-6 text-white/55">
                برای دریافت سیگنال‌ها در تلگرام، یک‌بار حساب خود را به ربات متصل
                کنید.
              </p>
            )}

            {errorMessage ? (
              <p className="pt-1 text-sm leading-6 text-rose-300/90">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-[140px] sm:items-stretch">
          {isConnected ? (
            <div className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] px-3 text-xs font-semibold text-emerald-300">
              <TelegramBrandMark size={16} />
              متصل به تلگرام
            </div>
          ) : (
            <>
              <Button
                type="button"
                onClick={() =>
                  status === "waiting"
                    ? handleReopenLink()
                    : void handleConnect()
                }
                disabled={status === "loading"}
                className={cn(
                  "h-9 w-full rounded-xl border-0 px-3 text-xs font-semibold text-white transition-all duration-300",
                  "bg-[#24A1DE] hover:bg-[#1b8fc7] hover:shadow-[0_0_24px_rgba(36,161,222,0.35)]",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال اتصال...
                  </>
                ) : status === "waiting" ? (
                  <>
                    <ExternalLink className="ml-2 h-4 w-4" />
                    باز کردن دوباره
                  </>
                ) : status === "expired" || status === "error" ? (
                  <>
                    <RefreshCw className="ml-2 h-4 w-4" />
                    تلاش مجدد
                  </>
                ) : (
                  <>
                    <TelegramBrandMark size={16} className="ml-2" />
                    اتصال به تلگرام
                  </>
                )}
              </Button>

              {status === "waiting" ? (
                <div className="flex w-full flex-col gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void handleManualSync()}
                    disabled={isSyncing}
                    className="h-9 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-white/75 hover:bg-white/[0.06] hover:text-white"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        در حال بررسی...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="ml-2 h-4 w-4" />
                        Start زدم — بررسی
                      </>
                    )}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectTelegram;
