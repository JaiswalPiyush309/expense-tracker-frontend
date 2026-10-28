import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarProps } from "../../types";
import { sidebarGroups } from "../../data/sidebar-config";
import { PanelLeftClose, PanelLeftOpen, WalletCards } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import SidebarSection from "./SidebarSection";

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-[width,transform] duration-200 dark:border-slate-800 dark:bg-slate-950 md:static md:z-auto md:translate-x-0 ${
          collapsed ? "md:w-18" : "md:w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-3 dark:border-slate-800">
          <div className="flex min-w-0 items-center">
            {collapsed ? (
              <WalletCards className="mx-1 size-6 text-slate-900 dark:text-white" />
            ) : (
              <BrandMark />
            )}
          </div>

          {/* Desktop collapse control */}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden size-8 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:flex"
          >
            {collapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <PanelLeftClose size={17} />
            )}
          </button>
        </div>

        <nav
          aria-label="Main navigation"
          className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
        >
          {sidebarGroups.map((group) => (
            <SidebarSection
              key={group.title}
              group={group}
              collapsed={collapsed}
              onNavigate={onMobileClose}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
