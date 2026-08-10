"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  UserDashboardService,
  type BaleConnectLinkOutput,
  type BaleConnectSyncOutput,
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

type ConnectBaleProps = {
  className?: string;
  /** Called after Bale is successfully linked. */
  onConnected?: (baleId: string) => void;
  /** Optional custom error handler (e.g. parent toast). */
  onError?: (message: string) => void;
};

function unwrapAbp<T>(res: unknown): T {
  const w = res as AbpWrapper<T>;
  return (w?.result ?? res) as T;
}

function isSafeBaleUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host === "ble.ir" ||
      host.endsWith(".ble.ir") ||
      host === "bale.ai" ||
      host.endsWith(".bale.ai")
    );
  } catch {
    return false;
  }
}

function openBaleUrl(url: string) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(url);
  }
}

function BaleBrandMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/images/brands/bale-color.svg"
      alt="بله"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      priority={false}
    />
  );
}

export function ConnectBale({
  className,
  onConnected,
  onError,
}: ConnectBaleProps) {
  const [status, setStatus] = useState<ConnectStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectLink, setConnectLink] = useState<BaleConnectLinkOutput | null>(
    null,
  );
  const [baleId, setBaleId] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const pollRef = useRef<number | null>(null);
  const connectedNotifiedRef = useRef(false);

  const isConnected = Boolean(baleId) || status === "connected";

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const markConnected = useCallback(
    (id: string) => {
      clearPoll();
      setBaleId(id);
      setStatus("connected");
      setErrorMessage(null);
      setConnectLink(null);
      if (!connectedNotifiedRef.current) {
        connectedNotifiedRef.current = true;
        onConnected?.(id);
      }
    },
    [clearPoll, onConnected],
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

  const syncFromBot = useCallback(async (): Promise<string | null> => {
    try {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardSyncbaleconnectPost();
      const sync = unwrapAbp<BaleConnectSyncOutput>(res);
      if (sync?.connected) {
        return sync.baleId?.trim() || "connected";
      }
    } catch {
      // Sync is best-effort while waiting.
    }
    return null;
  }, []);

  const checkConnection = useCallback(async () => {
    const syncedId = await syncFromBot();
    if (syncedId) {
      markConnected(syncedId);
      return true;
    }

    if (connectLink?.expiresAtUtc) {
      const expiresAt = new Date(connectLink.expiresAtUtc).getTime();
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
  }, [clearPoll, connectLink?.expiresAtUtc, markConnected, syncFromBot]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsBootstrapping(true);
      try {
        const id = await syncFromBot();
        if (cancelled) return;
        if (id) {
          setBaleId(id);
          setStatus("connected");
          connectedNotifiedRef.current = true;
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [syncFromBot]);

  useEffect(() => {
    if (status !== "waiting") {
      clearPoll();
      return;
    }

    void checkConnection();
    pollRef.current = window.setInterval(() => {
      void checkConnection();
    }, 3000);

    return clearPoll;
  }, [status, checkConnection, clearPoll]);

  const handleConnect = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    setConnectLink(null);
    connectedNotifiedRef.current = false;
    clearPoll();

    try {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetbaleconnectlinkGet();
      const link = unwrapAbp<BaleConnectLinkOutput>(res);
      const url = link?.url?.trim();

      if (!url || !isSafeBaleUrl(url)) {
        throw new Error("invalid-link");
      }

      setConnectLink(link);
      openBaleUrl(url);
      setStatus("waiting");
    } catch {
      fail("دریافت لینک اتصال بله ناموفق بود. دوباره تلاش کنید.");
    }
  }, [clearPoll, fail]);

  const handleManualSync = useCallback(async () => {
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const connectedNow = await checkConnection();
      if (!connectedNow && status === "waiting") {
        setErrorMessage(
          "هنوز متصل نشده‌اید. در بله روی Start بزنید، سپس دوباره بررسی کنید.",
        );
      }
    } finally {
      setIsSyncing(false);
    }
  }, [checkConnection, status]);

  const botLabel = connectLink?.botUsername
    ? `@${connectLink.botUsername.replace(/^@/, "")}`
    : "ربات بله والرت";

  if (isBootstrapping) {
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
            <div className="h-4 w-28 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-3 w-52 animate-pulse rounded bg-white/[0.04]" />
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(76,235,180,0.12)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors",
              isConnected
                ? "border-emerald-400/25 bg-emerald-500/10"
                : "border-[#4CEBB4]/25 bg-[#4CEBB4]/[0.08]",
            )}
          >
            <BaleBrandMark size={28} />
            {isConnected ? (
              <span className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#050505] bg-emerald-500 text-white shadow-sm">
                <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
              </span>
            ) : null}
          </div>

          <div className="min-w-0 space-y-1.5 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold tracking-tight text-white">
                اتصال بله
              </h3>
              {isConnected ? (
                <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                  متصل
                </span>
              ) : null}
            </div>

            {isConnected ? (
              <p className="text-sm leading-6 text-white/55">
                حساب بله شما متصل است و سیگنال‌ها به ربات ارسال می‌شوند.
                {baleId && baleId !== "connected" ? (
                  <span
                    className="mt-1 block font-mono text-xs text-white/35"
                    dir="ltr"
                  >
                    ID · {baleId}
                  </span>
                ) : null}
              </p>
            ) : status === "waiting" ? (
              <div className="space-y-1.5 text-sm leading-6 text-white/60">
                <p>
                  بله را باز کنید، روی{" "}
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
                برای دریافت سیگنال‌ها در بله، یک‌بار حساب خود را به ربات متصل
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
              <BaleBrandMark size={16} />
              متصل به بله
            </div>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => void handleConnect()}
                disabled={status === "loading"}
                className={cn(
                  "h-9 w-full rounded-xl border-0 px-3 text-xs font-semibold text-white transition-all duration-300",
                  "bg-gradient-to-l from-[#2E2E74] to-[#00A693] hover:brightness-110 hover:shadow-[0_0_24px_rgba(76,235,180,0.25)]",
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
                    باز کردن دوباره بله
                  </>
                ) : status === "expired" || status === "error" ? (
                  <>
                    <RefreshCw className="ml-2 h-4 w-4" />
                    تلاش مجدد
                  </>
                ) : (
                  <>
                    <BaleBrandMark size={16} className="ml-2" />
                    اتصال به بله
                  </>
                )}
              </Button>

              {status === "waiting" ? (
                <div className="flex w-full flex-col gap-2">
                  {connectLink?.url ? (
                    <button
                      type="button"
                      onClick={() => openBaleUrl(connectLink.url!)}
                      className="text-xs text-white/40 underline-offset-4 transition-colors hover:text-white/70 hover:underline"
                    >
                      لینک باز نشد؟ اینجا کلیک کنید
                    </button>
                  ) : null}
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
                        Start زدم — بررسی اتصال
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

export default ConnectBale;
