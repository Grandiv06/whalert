"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSignalManagementMessages } from "@/lib/signal-management-messages";
import {
  hasUnreadSignalManagementMessages,
  SIGNAL_MANAGEMENT_READ_UPDATED_EVENT,
} from "@/lib/signal-management-read-state";

const REFETCH_MS = 30_000;

export function signalManagementMessagesQueryKey(tradingSignalId: number) {
  return ["signal-management-messages", tradingSignalId] as const;
}

export function useSignalManagementMessages(
  tradingSignalId?: number | null,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  const enabled = (options?.enabled ?? true) && !!tradingSignalId;

  return useQuery({
    queryKey: signalManagementMessagesQueryKey(tradingSignalId!),
    enabled,
    refetchInterval:
      options?.refetchInterval === undefined
        ? REFETCH_MS
        : options.refetchInterval,
    queryFn: () => fetchSignalManagementMessages(tradingSignalId!),
  });
}

export function useSignalManagementUnread(tradingSignalId?: number | null) {
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
    if (!tradingSignalId || !messages) return false;
    return hasUnreadSignalManagementMessages(tradingSignalId, messages);
  }, [tradingSignalId, messages, readVersion]);
}
