import { SidebarSectionProps } from "../../types";
import SidebarNavItem from "./SidebarNavItem";

export default function SidebarSection({
  group,
  collapsed,
  onNavigate,
}: SidebarSectionProps) {
  return (
    <section className="mb-3">
      {!collapsed && (
        <h2 className="mb-1.5 px-2.5 pt-2 text-[12px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-600">
          {group.title}
        </h2>
      )}

      <nav aria-label={group.title} className="space-y-0.5">
        {group.items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </section>
  );
}
