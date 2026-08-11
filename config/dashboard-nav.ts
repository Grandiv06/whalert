import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Trophy,
  TrendingUp,
  Sparkles,
  Radio
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "آمار سود و ضرر روزانه", href: "/dashboard/", icon: LayoutDashboard },
  { label: "لایو ترید", href: "/dashboard/live/", icon: Radio },
  { label: "فرصت های من", href: "/dashboard/opportunities/", icon: Trophy },
  { label: "استیتمنت والرت", href: "/dashboard/analysis/", icon: TrendingUp },
  { label: "لیست سیگنال ها", href: "/dashboard/suggested/", icon: Sparkles },
];

export const dashboardSettingsHref = "/dashboard/settings/account-setting/";
