import { Shield } from "lucide-react";

export const PrivacyNote = () => (
  <p className="mt-6 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-4 text-center text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
    <Shield
      className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500"
      aria-hidden="true"
    />
    Accounts and data stay in this browser. Nothing is sent to a server.
  </p>
);
