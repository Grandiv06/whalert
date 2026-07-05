"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateSignalPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/");
  }, [router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-white/70">
      در حال انتقال...
    </div>
  );
}
