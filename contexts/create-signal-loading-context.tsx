"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type LeaveModalRequest =
  | { type: "navigate"; target: string }
  | { type: "back" };

interface CreateSignalLoadingContextValue {
  isAnalyzing: boolean;
  setAnalyzing: (v: boolean) => void;
  isManualDirty: boolean;
  setManualDirty: (v: boolean) => void;
  leaveModalRequest: LeaveModalRequest | null;
  setLeaveModalRequest: (r: LeaveModalRequest | null) => void;
}

const CreateSignalLoadingContext =
  createContext<CreateSignalLoadingContextValue | undefined>(undefined);

export function CreateSignalLoadingProvider({ children }: { children: ReactNode }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isManualDirty, setIsManualDirty] = useState(false);
  const [leaveModalRequest, setLeaveModalRequest] = useState<LeaveModalRequest | null>(null);
  const setAnalyzing = useCallback((v: boolean) => setIsAnalyzing(v), []);
  const setManualDirty = useCallback((v: boolean) => setIsManualDirty(v), []);

  return (
    <CreateSignalLoadingContext.Provider
      value={{
        isAnalyzing,
        setAnalyzing,
        isManualDirty,
        setManualDirty,
        leaveModalRequest,
        setLeaveModalRequest,
      }}
    >
      {children}
    </CreateSignalLoadingContext.Provider>
  );
}

export function useCreateSignalLoading(): CreateSignalLoadingContextValue {
  const ctx = useContext(CreateSignalLoadingContext);
  if (ctx === undefined) {
    return {
      isAnalyzing: false,
      setAnalyzing: () => {},
      isManualDirty: false,
      setManualDirty: () => {},
      leaveModalRequest: null,
      setLeaveModalRequest: () => {},
    };
  }
  return ctx;
}
