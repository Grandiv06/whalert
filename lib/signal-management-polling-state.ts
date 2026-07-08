type Listener = () => void;

const openSignalIds = new Set<number>();
const listeners = new Set<Listener>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function setSignalManagementDialogOpen(
  tradingSignalId: number,
  open: boolean,
) {
  if (open) {
    openSignalIds.add(tradingSignalId);
  } else {
    openSignalIds.delete(tradingSignalId);
  }
  notifyListeners();
}

export function isSignalManagementDialogOpen(tradingSignalId: number) {
  return openSignalIds.has(tradingSignalId);
}

export function subscribeSignalManagementDialogState(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
