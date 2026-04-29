import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Plus,
  Trophy,
  TrendingUp,
  Sparkles,
  UserPlus,
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
  { label: "مشاهده تحلیل", href: "/dashboard/analysis/", icon: TrendingUp },
  { label: "موقعیت های پیشنهادی", href: "/dashboard/suggested/", icon: Sparkles },
  { label: "دعوت از دوستان", href: "/dashboard/invite-friends/", icon: UserPlus },
];

export const dashboardSettingsHref = "/dashboard/settings/account-setting/";
