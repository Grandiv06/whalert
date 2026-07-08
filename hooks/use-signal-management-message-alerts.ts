"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchSignalManagementMessages } from "@/lib/signal-management-messages";
import {
  getUnreadSignalManagementMessageCount,
  SIGNAL_MANAGEMENT_READ_UPDATED_EVENT,
} from "@/lib/signal-management-read-state";
import {
  SIGNAL_MANAGEMENT_REFETCH_MS,
  signalManagementMessagesQueryKey,
} from "@/hooks/use-signal-management-unread";
import {
  isSignalManagementDialogOpen,
  subscribeSignalManagementDialogState,
} from "@/lib/signal-management-polling-state";

export type SignalManagementAlertTarget = {
  tradingSignalId: number;
  title: string;
};

export type SignalManagementAlertToast = {
  id: number;
  tradingSignalId: number;
  title: string;
  newCount: number;
  createdAt: number;
  durationMs: number;
};

const TOAST_DURATION_MS = 8_000;

export function useSignalManagementMessageAlerts(
  signals: SignalManagementAlertTarget[],
  onView: (tradingSignalId: number, title: string) => void,
) {
  const [toasts, setToasts] = useState<SignalManagementAlertToast[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [pollingVersion, setPollingVersion] = useState(0);
  const prevCountsRef = useRef<Record<number, number>>({});
  const initializedRef = useRef<Set<number>>(new Set());

  useEffect(
    () =>
      subscribeSignalManagementDialogState(() => {
        setPollingVersion((value) => value + 1);
      }),
    [],
  );

  const uniqueSignals = useMemo(() => {
    const map = new Map<number, string>();
    for (const signal of signals) {
      if (signal.tradingSignalId > 0) {
        map.set(signal.tradingSignalId, signal.title);
      }
    }
    return Array.from(map.entries()).map(([tradingSignalId, title]) => ({
      tradingSignalId,
      title,
    }));
  }, [signals]);

  const queries = useQueries({
    queries: uniqueSignals.map(({ tradingSignalId }) => ({
      queryKey: signalManagementMessagesQueryKey(tradingSignalId),
      queryFn: () => fetchSignalManagementMessages(tradingSignalId),
      refetchInterval: isSignalManagementDialogOpen(tradingSignalId)
        ? false
        : SIGNAL_MANAGEMENT_REFETCH_MS,
      refetchOnWindowFocus: false,
      enabled: tradingSignalId > 0,
    })),
  });

  void pollingVersion;

  const watchedMessages = useMemo(
    () =>
      uniqueSignals.map((signal, index) => ({
        tradingSignalId: signal.tradingSignalId,
        title: signal.title,
        messages: queries[index]?.data,
      })),
    [uniqueSignals, queries],
  );

  useEffect(() => {
    for (const { tradingSignalId, title, messages } of watchedMessages) {
      if (!messages) continue;

      const unreadCount = getUnreadSignalManagementMessageCount(
        tradingSignalId,
        messages,
      );

      if (!initializedRef.current.has(tradingSignalId)) {
        initializedRef.current.add(tradingSignalId);
        prevCountsRef.current[tradingSignalId] = unreadCount;
        continue;
      }

      const previousCount = prevCountsRef.current[tradingSignalId] ?? 0;
      if (unreadCount > previousCount) {
        const newCount = unreadCount - previousCount;
        setToasts((current) =>
          [
            ...current.filter((toast) => toast.tradingSignalId !== tradingSignalId),
            {
              id: Date.now() + tradingSignalId,
              tradingSignalId,
              title,
              newCount,
              createdAt: Date.now(),
              durationMs: TOAST_DURATION_MS,
            },
          ].slice(-3),
        );
      }

      prevCountsRef.current[tradingSignalId] = unreadCount;
    }
  }, [watchedMessages]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ tradingSignalId?: number }>;
      const tradingSignalId = custom.detail?.tradingSignalId;
      if (!tradingSignalId) return;

      setToasts((current) =>
        current.filter((toast) => toast.tradingSignalId !== tradingSignalId),
      );
    };

    window.addEventListener(SIGNAL_MANAGEMENT_READ_UPDATED_EVENT, handler);
    return () => {
      window.removeEventListener(SIGNAL_MANAGEMENT_READ_UPDATED_EVENT, handler);
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      setToasts((prev) =>
        prev.filter((toast) => current - toast.createdAt < toast.durationMs),
      );
    }, 200);

    return () => window.clearInterval(timer);
  }, [toasts.length]);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const viewToast = (toast: SignalManagementAlertToast) => {
    dismissToast(toast.id);
    onView(toast.tradingSignalId, toast.title);
  };

  return { toasts, nowMs, viewToast, dismissToast };
}
