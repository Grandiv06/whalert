"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSignalManagementMessages } from "@/lib/signal-management-messages";
import {
  getUnreadSignalManagementMessageCount,
  SIGNAL_MANAGEMENT_READ_UPDATED_EVENT,
} from "@/lib/signal-management-read-state";
import { useSignalManagementPollingPaused } from "@/hooks/use-signal-management-polling-paused";

export const SIGNAL_MANAGEMENT_REFETCH_MS = 5_000;
const REFETCH_MS = SIGNAL_MANAGEMENT_REFETCH_MS;

export function signalManagementMessagesQueryKey(tradingSignalId: number) {
  return ["signal-management-messages", tradingSignalId] as const;
}

export function useSignalManagementMessages(
  tradingSignalId?: number | null,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  const enabled = (options?.enabled ?? true) && !!tradingSignalId;
  const pollingPaused = useSignalManagementPollingPaused(tradingSignalId);
  const refetchInterval =
    options?.refetchInterval === undefined
      ? pollingPaused
        ? false
        : REFETCH_MS
      : pollingPaused
        ? false
        : options.refetchInterval;

  return useQuery({
    queryKey: signalManagementMessagesQueryKey(tradingSignalId!),
    enabled,
    refetchInterval,
    refetchOnWindowFocus: false,
    queryFn: () => fetchSignalManagementMessages(tradingSignalId!),
  });
}

export function useSignalManagementUnreadCount(tradingSignalId?: number | null) {
  const [readVersion, setReadVersion] = useState(0);
  const { data: messages } = useSignalManagementMessages(tradingSignalId, {
    enabled: !!tradingSignalId,
    refetchInterval: REFETCH_MS,
  });

  useEffect(() => {
    if (!tradingSignalId) return;

    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ tradingSignalId?: number }>;
      if (custom.detail?.tradingSignalId === tradingSignalId) {
        setReadVersion((value) => value + 1);
      }
    };

    window.addEventListener(SIGNAL_MANAGEMENT_READ_UPDATED_EVENT, handler);
    return () => {
      window.removeEventListener(SIGNAL_MANAGEMENT_READ_UPDATED_EVENT, handler);
    };
  }, [tradingSignalId]);

  return useMemo(() => {
    void readVersion;
    if (!tradingSignalId || !messages) return 0;
    return getUnreadSignalManagementMessageCount(tradingSignalId, messages);
  }, [tradingSignalId, messages, readVersion]);
}
