"use client";

import { redirect, useSearchParams } from "next/navigation";
import { hasSignalCreatorPermission } from "@/lib/auth-session";
import { CreateSignalContent } from "./create-signal-content";

export default function CreateSignalPage() {
  const searchParams = useSearchParams();
  const canAccessCreateSignal = hasSignalCreatorPermission();

  if (!canAccessCreateSignal) {
    redirect("/dashboard/");
  }

  const initialManualEditDraft =
    searchParams.get("edit") === "1"
      ? {
          symbolApi: searchParams.get("symbol") || undefined,
          side: searchParams.get("side") === "SHORT" ? ("SHORT" as const) : ("LONG" as const),
          entry: searchParams.get("entry") ? Number(searchParams.get("entry")) : undefined,
          stopLoss: searchParams.get("stopLoss")
            ? Number(searchParams.get("stopLoss"))
            : undefined,
          takeProfits: (searchParams.get("takeProfits") || "")
            .split(",")
            .map((v) => Number(v.trim()))
            .filter((v) => Number.isFinite(v) && v > 0),
          description: searchParams.get("description") || undefined,
        }
      : null;

  return <CreateSignalContent initialManualEditDraft={initialManualEditDraft} />;
}
