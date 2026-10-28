import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNavItemProps } from "../../types";

export default function SidebarNavItem({
  item,
  collapsed,
  onNavigate,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={`group flex min-h-9 items-center gap-2.5 rounded-md px-2.5 text-xs font-bold transition-colors ${
        isActive
          ? "bg-indigo-400 text-white shadow-sm"
          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      } ${collapsed ? "justify-center px-0" : ""}`}
    >
      <Icon
        size={16}
        strokeWidth={1.8}
        className="shrink-0"
        aria-hidden="true"
      />

      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}
