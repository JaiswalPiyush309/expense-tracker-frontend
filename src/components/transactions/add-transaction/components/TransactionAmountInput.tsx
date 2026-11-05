"use client";

import { useState } from "react";
import { QUICK_ADD_AMOUNTS, TRANSACTION_TYPES } from "../model/data";
import { TransactionType } from "../model/types";
import { formatINRNumber } from "../model/utils";

interface TransactionAmountInputProps {
  amount: number;
  type: TransactionType;
  accountShortLabel: string;
  onChange: (value: number) => void;
  onQuickAdd: (delta: number) => void;
  onClear: () => void;
}

export function TransactionAmountInput({
  amount,
  type,
  accountShortLabel,
  onChange,
  onQuickAdd,
  onClear,
}: TransactionAmountInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rawInput, setRawInput] = useState(amount.toFixed(2));

  const typeMeta =
    TRANSACTION_TYPES.find((t) => t.id === type) ?? TRANSACTION_TYPES[0];

  const badgeTone =
    type === "expense"
      ? "bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
      : type === "income"
        ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
        : "bg-indigo-100/80 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300";

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Transaction Amount
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeTone}`}
        >
          {typeMeta.badgeTextPrefix} {accountShortLabel}
        </span>
      </div>

      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-400 dark:text-slate-500">
          ₹
        </span>
        {isEditing ? (
          <input
            type="number"
            step="0.01"
            autoFocus
            value={rawInput}
            onChange={(e) => {
              setRawInput(e.target.value);
              const parsed = parseFloat(e.target.value);
              onChange(Number.isNaN(parsed) ? 0 : parsed);
            }}
            onBlur={() => setIsEditing(false)}
            className="w-full bg-transparent text-3xl font-bold tracking-tight text-slate-900 outline-none dark:text-white"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setRawInput(amount.toFixed(2));
              setIsEditing(true);
            }}
            className="text-left text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {formatINRNumber(amount)}
          </button>
        )}
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Quick Add:
          </span>
          {QUICK_ADD_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onQuickAdd(val)}
              className="rounded-md border border-slate-200/90 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500"
            >
              + ₹{val.toLocaleString("en-IN")}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md bg-slate-200/70 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-300/70 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
