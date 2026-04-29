import { LandingFooter } from "@/components/layout/landing/landing-footer";
import { LandingHeader } from "@/components/layout/landing/landing-header";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#1a0c35]" dir="rtl">
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}
