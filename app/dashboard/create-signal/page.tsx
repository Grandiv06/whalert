"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateSignalContent } from "./create-signal-content";
import { hasSignalCreatorPermission } from "@/lib/auth-session";

export default function CreateSignalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (!hasSignalCreatorPermission()) {
      router.replace("/dashboard/opportunities/");
    }
  }, [router]);

  if (!hasSignalCreatorPermission()) {
    return null;
  }

  return <CreateSignalContent initialManualEditDraft={initialManualEditDraft} />;
}
