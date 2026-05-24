"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateSignalContent } from "./create-signal-content";
import { hasSignalCreatorPermission } from "@/lib/auth-session";

export default function CreateSignalPage() {
  const router = useRouter();

  useEffect(() => {
    if (!hasSignalCreatorPermission()) {
      router.replace("/dashboard/opportunities/");
    }
  }, [router]);

  if (!hasSignalCreatorPermission()) {
    return null;
  }

  return <CreateSignalContent />;
}
