import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { PREVIEW } from "../data/home-content";
import { formatINR } from "@/lib/currency";

interface LivePreviewProps {
  onOpenApp: () => void;
}

const cardClass =
  "rounded-2xl border border-line bg-surface p-4 shadow-sm transition-colors sm:p-5";

const labelClass = "text-xs font-medium text-muted";

const valueClass =
  "mt-2 font-mono text-xl font-bold tracking-tight tabular-nums text-ink sm:text-2xl";

export function LivePreview({ onOpenApp }: LivePreviewProps) {
  const { inflow, outflow, entries, rows } = PREVIEW;

  const savingsRate = inflow > 0 ? ((inflow - outflow) / inflow) * 100 : 0;

  const savingsRateLabel = inflow > 0 ? `${savingsRate.toFixed(1)}%` : "—";

  return (
    <section
      id="preview"
      aria-labelledby="preview-heading"
      className="mx-auto max-w-5xl scroll-mt-20"
    >
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>

            <span className="truncate font-mono text-xs text-muted">
              ledgerflow / overview
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenApp}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent-soft focus-visible:outline-offset-2"
          >
            Open workspace
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="bg-bg/60 p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted">YOUR FINANCES</p>

              <h2
                id="preview-heading"
                className="mt-1 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl"
              >
                Monthly overview
              </h2>
            </div>

            <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              Sample data
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <article className={cardClass}>
              <div className="flex items-center justify-between gap-2">
                <p className={labelClass}>Total spent</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-bad-soft text-bad">
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>

              <p className={valueClass}>{formatINR(outflow)}</p>

              <p className="mt-2 text-xs text-muted">
                {entries} recorded entries
              </p>
            </article>

            <article className={cardClass}>
              <div className="flex items-center justify-between gap-2">
                <p className={labelClass}>Total income</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-good-soft text-good">
                  <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>

              <p className={`${valueClass} text-good`}>{formatINR(inflow)}</p>

              <p className="mt-2 text-xs text-muted">Money received</p>
            </article>

            <article className={cardClass}>
              <div className="flex items-center justify-between gap-2">
                <p className={labelClass}>Savings rate</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-accent">
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>

              <p className={valueClass}>{savingsRateLabel}</p>

              <p className="mt-2 text-xs text-muted">
                {inflow > 0
                  ? "Income remaining after spending"
                  : "Add income to calculate savings"}
              </p>
            </article>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
              <h3 className="text-sm font-semibold text-ink">
                Recent activity
              </h3>

              <span className="text-xs text-muted">Example transactions</span>
            </div>

            <ul className="divide-y divide-line">
              {rows.map((row, index) => {
                const isIncome = row.type === "in";

                return (
                  <li
                    key={`${row.name}-${row.category}-${row.type}-${row.amount}-${index}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-bg/70 sm:px-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                          isIncome
                            ? "bg-good-soft text-good"
                            : "bg-surface-muted text-muted"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
                          {row.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-muted">
                          {row.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 font-mono text-sm font-semibold tabular-nums ${
                        isIncome ? "text-good" : "text-ink"
                      }`}
                    >
                      {isIncome ? "+" : "−"}
                      {formatINR(row.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
