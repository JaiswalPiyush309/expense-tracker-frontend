"use client";

import { formatINRNumber } from "../model/utils";
import type { BankAccountOption } from "../model/types";

interface AccountSelectorProps {
  accountId: string;
  accounts: BankAccountOption[];
  loading: boolean;
  error: string;
  onChange: (accountId: string) => void;
}

export function AccountSelector({ accountId, accounts, loading, error, onChange }: AccountSelectorProps) {
  const currentAccount =
    accounts.find((a) => a.id === accountId);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Account / Payment Source
        </label>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {currentAccount ? `Bal: ₹${formatINRNumber(currentAccount.balance, 0, 0)}` : ""}
        </span>
      </div>

      <div className="relative flex items-center rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
        <svg
          className="mr-2 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
        </svg>
        <select
          value={accountId}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || accounts.length === 0}
          className="w-full appearance-none bg-transparent pr-5 text-xs font-medium text-slate-800 outline-none dark:text-slate-200"
        >
          {accounts.length === 0 && <option value="">{loading ? "Loading accounts…" : "No accounts available"}</option>}
          {accounts.map((acc) => (
            <option
              key={acc.id}
              value={acc.id}
              className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
            >
              {acc.shortLabel} · {acc.bankName}{acc.maskedNumber ? ` ${acc.maskedNumber}` : ""} ({acc.accountType})
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
        </svg>
      </div>
      {error && <p role="alert" className="mt-1 text-[11px] text-rose-600">{error}</p>}
      {!loading && !error && accounts.length === 0 && <p className="mt-1 text-[11px] text-slate-500">Add an account in Profile before recording a transaction.</p>}
    </div>
  );
}
