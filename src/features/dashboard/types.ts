import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export interface SidebarSectionProps {
  group: SidebarGroup;
  collapsed: boolean;
  onNavigate?: () => void;
}

export interface SidebarNavItemProps {
  item: SidebarItem;
  collapsed: boolean;
  onNavigate?: () => void;
}
