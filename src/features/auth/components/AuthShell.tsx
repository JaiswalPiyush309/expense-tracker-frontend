import { BrandMark } from "@/components/common/BrandMark";
import ThemeToggle from "@/components/common/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/15"
      />
    </label>
  );
}

const receipt = [
  ["Rent", "18,000"],
  ["Groceries", "3,200"],
  ["Electricity", "2,100"],
  ["Movie night", "1,200"],
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-bg text-ink transition-colors lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
      <aside className="hidden min-h-screen flex-col bg-accent-soft px-8 py-8 text-ink transition-colors dark:border-r dark:border-line sm:px-12 lg:flex lg:px-14 xl:px-20">
        <Link
          href="/"
          aria-label="LedgerFlow home"
          className="w-fit rounded-lg focus-visible:outline-offset-4"
        >
          <BrandMark />
        </Link>
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-surface/70 px-3 py-1.5 text-xs font-semibold text-accent">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-accent"
            />
            A clearer view of your money
          </span>
          <h2 className="max-w-lg font-display text-4xl font-bold leading-tight sm:text-5xl">
            Know where every rupee goes.
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-muted">
            Track income and expenses, plan monthly budgets, and understand your
            spending at a glance.
          </p>
          <div className="mt-9 max-w-lg rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  This month
                </p>
                <p className="mt-1 font-display text-3xl font-bold text-ink">
                  ₹24,500
                </p>
              </div>
              <span className="pb-1 text-xs text-muted">4 categories</span>
            </div>
            <div className="border-t border-line">
              {receipt.map(([name, amount]) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-4 border-b border-line py-2.5 text-sm last:border-b-0"
                >
                  <span className="text-muted">{name}</span>
                  <span className="font-medium tabular-nums text-ink">
                    ₹{amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted">
          Simple expense tracking, designed for rupees.
        </p>
      </aside>
      <section className="flex min-h-screen flex-col bg-bg px-6 py-5 text-ink transition-colors sm:px-10 lg:px-12 xl:px-20">
        <header className="flex h-10 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </header>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <Link
            href="/"
            aria-label="LedgerFlow home"
            className="mb-9 inline-flex w-fit lg:hidden"
          >
            <BrandMark />
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-muted">{subtitle}</p>
          {children}
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </div>
      </section>
    </main>
  );
}
