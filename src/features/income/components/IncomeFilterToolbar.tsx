"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  RotateCcw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getCategoryOptions,
  type CategoryOption,
} from "@/features/categories/categories-api";
import {
  getAccountDropdownOptions,
  type AccountDropdownOption,
} from "@/features/profile/accounts-api";

interface IncomeFilterToolbarProps {
  startDateTime: string;
  onStartDateTimeChange: (value: string) => void;
  endDateTime: string;
  onEndDateTimeChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  modeFilter: string;
  onModeChange: (mode: string) => void;
  accountFilter: string;
  onAccountChange: (acc: string) => void;
  statusFilter: string;
  onStatusToggle: () => void;
  onReset: () => void;
}

const PAYMENT_MODES = ["NEFT", "UPI", "ECS", "SWIFT"];

export function IncomeFilterToolbar({
  startDateTime,
  onStartDateTimeChange,
  endDateTime,
  onEndDateTimeChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  modeFilter,
  onModeChange,
  accountFilter,
  onAccountChange,
  statusFilter,
  onStatusToggle,
  onReset,
}: IncomeFilterToolbarProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [accounts, setAccounts] = useState<AccountDropdownOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [accountError, setAccountError] = useState("");

  useEffect(() => {
    let active = true;
    getCategoryOptions("INCOME")
      .then((items) => {
        if (active) setCategories(items);
      })
      .catch((error: unknown) => {
        if (active)
          setCategoryError(
            error instanceof Error
              ? error.message
              : "Unable to load categories.",
          );
      })
      .finally(() => {
        if (active) setLoadingCategories(false);
      });
    getAccountDropdownOptions()
      .then((items) => {
        if (active) setAccounts(items);
      })
      .catch((error: unknown) => {
        if (active)
          setAccountError(
            error instanceof Error ? error.message : "Unable to load accounts.",
          );
      })
      .finally(() => {
        if (active) setLoadingAccounts(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const statusIsReceived = statusFilter.toLowerCase() === "received";

  return (
    <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-line bg-white p-3 shadow-sm dark:bg-slate-950 sm:p-4">
      <label className="relative min-w-48 flex-1 basis-full sm:basis-64">
        <span className="sr-only">
          Search income by source, payer, or reference
        </span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search income by source, payer, or ref..."
          className="h-11 w-full rounded-lg border border-transparent bg-surface-muted/70 pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-focus focus:bg-surface focus:ring-2 focus:ring-focus/20"
        />
      </label>

      <label className="flex h-11 min-w-52 flex-1 items-center gap-2 rounded-lg border border-line bg-surface-muted/70 px-3 text-xs text-muted">
        <span className="shrink-0 font-medium">From</span>
        <input type="datetime-local" aria-label="Income start date and time" value={startDateTime} onChange={(event) => onStartDateTimeChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none" />
      </label>
      <label className="flex h-11 min-w-52 flex-1 items-center gap-2 rounded-lg border border-line bg-surface-muted/70 px-3 text-xs text-muted">
        <span className="shrink-0 font-medium">To</span>
        <input type="datetime-local" aria-label="Income end date and time" value={endDateTime} onChange={(event) => onEndDateTimeChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none" />
      </label>

      <FilterSelect
        label="Category"
        value={categoryFilter}
        onChange={onCategoryChange}
        loading={loadingCategories}
        error={categoryError}
        emptyLabel="No income categories"
        options={categories.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
      />
      <FilterSelect
        label="Mode"
        value={modeFilter}
        onChange={onModeChange}
        options={PAYMENT_MODES.map((item) => ({ value: item, label: item }))}
      />
      <FilterSelect
        label="Account"
        value={accountFilter}
        onChange={onAccountChange}
        loading={loadingAccounts}
        error={accountError}
        emptyLabel="No accounts"
        options={accounts.map((item) => ({
          value: item.id,
          label:
            item.displayLabel ||
            `${item.name}${item.accountNumberLast4 ? ` · •••• ${item.accountNumberLast4}` : ""}`,
        }))}
      />

      <Button
        type="button"
        variant={statusIsReceived ? "soft" : "secondary"}
        size="sm"
        onClick={onStatusToggle}
        aria-label={`Status filter: ${statusFilter}. Activate to change status filter.`}
        className={
          statusIsReceived
            ? "h-11 min-h-11 shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
            : "h-11 min-h-11 shrink-0 rounded-lg px-3 text-sm"
        }
      >
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
        <span className="whitespace-nowrap">
          Status: {statusFilter || "All"}
          {statusIsReceived ? " (Active)" : ""}
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="h-11 min-h-11 shrink-0 rounded-lg px-3 text-sm text-muted"
      >
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
        <span>Reset</span>
      </Button>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  loading = false,
  error = "",
  emptyLabel = "No options",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  loading?: boolean;
  error?: string;
  emptyLabel?: string;
}) {
  return (
    <label className="relative min-w-32 flex-1 sm:flex-none">
      <span className="sr-only">Filter by {label.toLowerCase()}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || (options.length === 0 && Boolean(error))}
        title={error || undefined}
        className="h-11 w-full appearance-none rounded-lg border border-line bg-surface-muted/70 py-2 pl-3 pr-9 text-sm text-ink outline-none transition hover:bg-surface focus:border-focus focus:ring-2 focus:ring-focus/20 disabled:cursor-wait disabled:opacity-70 sm:min-w-32"
      >
        <option value="All">{label}: All</option>
        {loading && (
          <option disabled value="__loading">
            Loading…
          </option>
        )}
        {!loading && options.length === 0 && error && (
          <option disabled value="__error">
            Unable to load
          </option>
        )}
        {!loading && options.length === 0 && !error && label !== "Mode" && (
          <option disabled value="__empty">
            {emptyLabel}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading ? (
        <LoaderCircle
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted"
        />
      ) : (
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        />
      )}
      {error && <span className="sr-only">{error}</span>}
    </label>
  );
}
