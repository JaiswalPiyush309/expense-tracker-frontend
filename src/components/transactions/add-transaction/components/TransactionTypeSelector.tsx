"use client";

import { TRANSACTION_TYPES } from "../model/data";
import { TransactionType } from "../model/types";

interface TransactionTypeSelectorProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

function TypeIcon({
  type,
  active,
}: {
  type: TransactionType;
  active: boolean;
}) {
  const strokeClass = active
    ? "stroke-rose-600 dark:stroke-rose-400"
    : "stroke-slate-500 dark:stroke-slate-400";

  switch (type) {
    case "expense":
      return (
        <svg
          className={`h-3.5 w-3.5 ${strokeClass}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      );
    case "income":
      return (
        <svg
          className={`h-3.5 w-3.5 ${active ? "stroke-emerald-600 dark:stroke-emerald-400" : strokeClass}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case "transfer":
      return (
        <svg
          className={`h-3.5 w-3.5 ${active ? "stroke-indigo-600 dark:stroke-indigo-400" : strokeClass}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10L12 5L17 10" />
          <path d="M17 14L12 19L7 14" />
        </svg>
      );
    case "invest":
      return (
        <svg
          className={`h-3.5 w-3.5 ${active ? "stroke-violet-600 dark:stroke-violet-400" : strokeClass}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 17l6-6 4 4 8-8" />
        </svg>
      );
    case "lending":
      return (
        <svg
          className={`h-3.5 w-3.5 ${active ? "stroke-amber-600 dark:stroke-amber-400" : strokeClass}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M8 12h8M13 9l3 3-3 3" />
        </svg>
      );
    case "borrowing":
      return (
        <svg
          className={`h-3.5 w-3.5 ${active ? "stroke-cyan-600 dark:stroke-cyan-400" : strokeClass}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M16 12H8M11 9l-3 3 3 3" />
        </svg>
      );
  }
}

export function TransactionTypeSelector({
  value,
  onChange,
}: TransactionTypeSelectorProps) {
  return (
    <div className="grid grid-cols-6 gap-1 rounded-xl bg-slate-100/90 p-1.5 dark:bg-slate-800/80">
      {TRANSACTION_TYPES.map((item) => {
        const isActive = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 px-1 text-xs font-medium transition-all ${
              isActive
                ? `bg-white shadow-sm dark:bg-slate-900 ${item.accentColor}`
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <TypeIcon type={item.id} active={isActive} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
