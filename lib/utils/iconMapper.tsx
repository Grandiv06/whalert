import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Trophy,
  TrendingUp,
  Building2,
  Sparkles,
  Calendar,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  User,
  UserPlus,
  Plus,
  type LucideIcon,
} from "lucide-react";
import type { SVGProps } from "react";

export const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  wallet: Wallet,
  swap: ArrowLeftRight,
  trophy: Trophy,
  trending: TrendingUp,
  building: Building2,
  sparkles: Sparkles,
  calendar: Calendar,
  bell: Bell,
  message: MessageSquare,
  sun: Sun,
  moon: Moon,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  user: User,
  userplus: UserPlus,
  plus: Plus,
};

export const getIcon = (
  iconName?: string,
  defaultIcon: LucideIcon = LayoutDashboard
): LucideIcon => {
  if (!iconName) return defaultIcon;
  return iconMap[iconName.toLowerCase()] ?? defaultIcon;
};

export const renderIcon = (
  iconName?: string,
  props?: Partial<SVGProps<SVGSVGElement>>
) => {
  const IconComponent = getIcon(iconName);
  const defaultProps = {
    size: 20,
    strokeWidth: 1.5,
    className: "flex-shrink-0",
    ...props,
  };
  return <IconComponent {...defaultProps} />;
};
