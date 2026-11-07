"use client";

interface TransactionDatePickerProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function TransactionDatePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: TransactionDatePickerProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Date &amp; Time
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
          <svg
            className="h-4 w-4 shrink-0 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label="Transaction date"
            required
            className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
          <svg
            className="h-4 w-4 shrink-0 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            aria-label="Transaction time"
            required
            className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
}
