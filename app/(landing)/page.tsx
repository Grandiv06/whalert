import { LandingPage } from "@/components/landing";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense>
      <LandingPage />
    </Suspense>
  );
}
