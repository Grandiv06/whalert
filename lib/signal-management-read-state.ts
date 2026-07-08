import type { SignalManagementMessageDto } from "@/lib/api/client";

const STORAGE_KEY = "whalert.signalManagementReadState.v1";
export const SIGNAL_MANAGEMENT_READ_UPDATED_EVENT =
  "signal-management-read-updated";

type SignalReadState = {
  lastSeenMessageId: number;
  messageCount: number;
  lastSeenAt: string;
};

type ReadStateMap = Record<string, SignalReadState>;

function readStorage(): ReadStateMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ReadStateMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStorage(state: ReadStateMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getLatestSignalManagementMessageMeta(
  messages: SignalManagementMessageDto[],
) {
  if (!messages.length) {
    return { latestId: 0, count: 0 };
  }

  const latestId = Math.max(...messages.map((message) => message.id ?? 0));
  return { latestId, count: messages.length };
}

export function getUnreadSignalManagementMessageCount(
  tradingSignalId: number,
  messages: SignalManagementMessageDto[],
): number {
  if (!messages.length) return 0;

  const stored = readStorage()[String(tradingSignalId)];
  if (!stored) return messages.length;

  const unreadById = messages.filter(
    (message) => typeof message.id === "number" && message.id > stored.lastSeenMessageId,
  ).length;
  if (unreadById > 0) return unreadById;

  const { count } = getLatestSignalManagementMessageMeta(messages);
  return Math.max(0, count - stored.messageCount);
}

export function hasUnreadSignalManagementMessages(
  tradingSignalId: number,
  messages: SignalManagementMessageDto[],
): boolean {
  return getUnreadSignalManagementMessageCount(tradingSignalId, messages) > 0;
}

export function markSignalManagementMessagesAsRead(
  tradingSignalId: number,
  messages: SignalManagementMessageDto[],
) {
  const { latestId, count } = getLatestSignalManagementMessageMeta(messages);
  const state = readStorage();
  state[String(tradingSignalId)] = {
    lastSeenMessageId: latestId,
    messageCount: count,
    lastSeenAt: new Date().toISOString(),
  };
  writeStorage(state);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(SIGNAL_MANAGEMENT_READ_UPDATED_EVENT, {
        detail: { tradingSignalId },
      }),
    );
  }
}
