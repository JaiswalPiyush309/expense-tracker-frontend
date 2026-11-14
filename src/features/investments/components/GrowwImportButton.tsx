"use client";

import { useRef, useState } from "react";
import { importGrowwTrades, type GrowwImportResult } from "../share-market/api/investments-api";

interface Props {
  onImported: () => void;
}

export function GrowwImportButton({ onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GrowwImportResult | null>(null);

  async function handleFile(file?: File) {
    if (!file) return;
    setError(null);
    setResult(null);
    setIsImporting(true);
    try {
      const imported = await importGrowwTrades(file);
      setResult(imported);
      onImported();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to import this file.");
    } finally {
      setIsImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="sr-only"
        aria-label="Choose a Groww trade book"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <button
        type="button"
        disabled={isImporting}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <span aria-hidden="true">↑</span>
        <span>{isImporting ? "Importing…" : "Import Groww trades"}</span>
      </button>

      {(error || result) && (
        <div
          role="status"
          className={`absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border p-3 text-xs shadow-lg ${error
            ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300"
            : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"}`}
        >
          {error ? (
            error
          ) : (
            <>
              Imported {result?.successful} of {result?.totalProcessed} rows.
              {result?.failed ? ` ${result.failed} rows need review.` : ""}
              {Boolean(result?.errors.length) && (
                <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto">
                  {result?.errors.slice(0, 5).map((item) => (
                    <li key={`${item.row}-${item.symbol}`}>Row {item.row}: {item.error}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
