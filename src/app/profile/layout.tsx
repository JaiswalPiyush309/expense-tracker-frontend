"use client";

import { Navbar } from "@/features/dashboard/components/Navbar/Navbar";
import Sidebar from "@/features/dashboard/components/Sidebar/Sidebar";
import { useState, type ReactNode } from "react";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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
  );
}
