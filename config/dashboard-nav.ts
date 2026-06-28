import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Plus,
  Trophy,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "پیشخوان", href: "/dashboard/", icon: LayoutDashboard },
  { label: "ایجاد سیگنال", href: "/dashboard/create-signal/", icon: Plus },
  { label: "فرصت های من", href: "/dashboard/opportunities/", icon: Trophy },
  { label: "پروفایل اساتید", href: "/dashboard/analysis/", icon: TrendingUp },
  { label: "لیست سیگنال ها", href: "/dashboard/suggested/", icon: Sparkles },
];

export const dashboardSettingsHref = "/dashboard/settings/account-setting/";
