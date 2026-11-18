"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { Navbar } from "@/features/dashboard/components/Navbar/Navbar";
import Sidebar from "@/features/dashboard/components/Sidebar/Sidebar";
import { ReactNode, useState } from "react";

export default function ExpensesLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setMobileOpen(true)} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
