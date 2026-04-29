import { SidebarProvider } from "@/contexts/sidebar-context";
import { CreateSignalLoadingProvider } from "@/contexts/create-signal-loading-context";
import { DashboardLayoutClient } from "@/components/layout/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <CreateSignalLoadingProvider>
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </CreateSignalLoadingProvider>
    </SidebarProvider>
  );
}
