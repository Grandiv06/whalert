"use client";

import { useEffect, useState } from "react";
import {
  isSignalManagementDialogOpen,
  subscribeSignalManagementDialogState,
} from "@/lib/signal-management-polling-state";

export function useSignalManagementPollingPaused(
  tradingSignalId?: number | null,
) {
  const [, setVersion] = useState(0);

  useEffect(() => subscribeSignalManagementDialogState(() => {
    setVersion((value) => value + 1);
  }), []);

  if (!tradingSignalId) return false;
  return isSignalManagementDialogOpen(tradingSignalId);
}
