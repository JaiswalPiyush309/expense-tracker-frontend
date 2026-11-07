"use client";

import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import type { IncomeTransaction } from "../income-api";

interface IncomeLedgerTableProps {
  items: IncomeTransaction[];
  total: number;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: string;
}

const currency = (amount: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2,
}).format(amount);

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function IncomeLedgerTable({
  items,
  total,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  sortBy,
  onSortChange,
  pageSize,
  onPageSizeChange,
  currentPage,
  onPageChange,
  isLoading = false,
  error = "",
}: IncomeLedgerTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const firstItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, total);
  const allSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm dark:bg-slate-900" aria-label="Income transactions">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-3 text-xs">
          <label className="inline-flex cursor-pointer items-center gap-2 font-medium text-muted">
            <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} aria-label="Select all visible income transactions" className="h-4 w-4 rounded border-line text-indigo-600 focus:ring-focus" />
            <span>Select visible ({selectedIds.length})</span>
          </label>
          <span className="hidden text-muted sm:inline">|</span>
          <label className="flex items-center gap-1 text-muted"><span>Sort:</span><select value={sortBy} onChange={(event) => onSortChange(event.target.value)} className="bg-transparent font-semibold text-ink outline-none"><option value="Date (Newest)">Newest</option><option value="Amount (High to Low)">Highest amount</option></select></label>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted"><span>Rows</span><select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} className="rounded-md border border-line bg-surface px-2 py-1 font-semibold text-ink"><option value={15}>15</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option></select></label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead><tr className="border-b border-line bg-surface-muted/60 text-[10px] font-bold uppercase tracking-wider text-muted"><th className="w-10 py-3 pl-4" scope="col" /><th className="px-3 py-3" scope="col">Date &amp; time</th><th className="px-3 py-3" scope="col">Description / source</th><th className="px-3 py-3" scope="col">Category</th><th className="px-3 py-3" scope="col">Destination account</th><th className="px-4 py-3 text-right" scope="col">Amount</th></tr></thead>
          <tbody className="divide-y divide-line text-xs">
            {isLoading ? <tr><td colSpan={6} className="px-4 py-14 text-center text-muted"><span className="inline-flex items-center gap-2"><LoaderCircle className="h-4 w-4 animate-spin" />Loading income transactions…</span></td></tr>
              : error ? <tr><td colSpan={6} className="px-4 py-14 text-center text-bad" role="alert">{error}</td></tr>
                : items.length === 0 ? <tr><td colSpan={6} className="px-4 py-14 text-center"><p className="font-semibold text-ink">No income transactions found</p><p className="mt-1 text-xs text-muted">Try changing the filters or record an income transaction.</p></td></tr>
                  : items.map((item) => {
                    const merchant = item.merchant?.trim() || item.note?.trim() || "Income";
                    const selected = selectedIds.includes(item.id);
                    return <tr key={item.id} className="transition hover:bg-surface-muted/40">
                      <td className="py-3.5 pl-4"><input type="checkbox" checked={selected} onChange={() => onToggleSelectRow(item.id)} aria-label={`Select ${merchant}`} className="h-4 w-4 rounded border-line text-indigo-600 focus:ring-focus" /></td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-muted">{formatDate(item.transactionDate)}</td>
                      <td className="px-3 py-3.5"><p className="font-semibold text-ink">{merchant}</p>{item.note && item.merchant && <p className="mt-1 max-w-64 truncate text-[11px] text-muted">{item.note}</p>}</td>
                      <td className="px-3 py-3.5">{item.category ? <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-muted/60 px-2.5 py-1 text-[11px] font-semibold text-ink"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.category.color || "#10b981" }} />{item.category.name}</span> : <span className="text-muted">Uncategorized</span>}</td>
                      <td className="px-3 py-3.5"><p className="font-medium text-ink">{item.account?.name || "Account unavailable"}</p>{item.account?.bankName && <p className="mt-1 text-[11px] text-muted">{item.account.bankName}</p>}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold text-emerald-700 dark:text-emerald-300">+{currency(Number(item.amount))}</td>
                    </tr>;
                  })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-muted">
        <span>Showing <strong className="font-semibold text-ink">{firstItem}–{lastItem}</strong> of <strong className="font-semibold text-ink">{total}</strong> transactions</span>
        <div className="flex items-center gap-1.5">
          <button type="button" disabled={currentPage <= 1 || isLoading} onClick={() => onPageChange(Math.max(1, currentPage - 1))} className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 font-medium text-ink hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /><span>Previous</span></button>
          <span className="px-2">{currentPage} / {totalPages}</span>
          <button type="button" disabled={currentPage >= totalPages || isLoading} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 font-medium text-ink hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"><span>Next</span><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </section>
  );
}
