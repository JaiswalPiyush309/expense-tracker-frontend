import { Button } from "@/components/ui/Button";
import { AuthMode } from "@/features/auth/types";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { LivePreview } from "./LivePreview";

interface HeroSectionProps {
  onOpenApp: () => void;
  onOpenAuth: (mode?: AuthMode) => void;
}

export function HeroSection({ onOpenApp, onOpenAuth }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-surface transition-colors">
      {/* Decorative background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-80 w-2xl -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-24 top-48 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-accent"
            />
            A clearer view of your money
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            Know where every <span className="text-accent">rupee</span> goes.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Track income and expenses, plan monthly budgets, and understand your
            spending habits with one simple, thoughtfully designed money
            tracker.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button
              size="md"
              onClick={onOpenApp}
              className="w-full justify-center gap-2 shadow-lg shadow-accent/20 sm:w-auto"
            >
              Open expense tracker
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>

            <Button
              size="md"
              variant="secondary"
              onClick={() => onOpenAuth("signup")}
              className="w-full justify-center font-semibold sm:w-auto"
            >
              Create a free account
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-good" />
              Simple expense tracking
            </span>

            <span className="inline-flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-good" />
              Designed for rupees
            </span>

            <span className="inline-flex items-center gap-2">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-good" />
              CSV export
            </span>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-6xl sm:mt-16 lg:mt-20">
          <div className="rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 sm:rounded-3xl sm:p-3">
            <LivePreview onOpenApp={onOpenApp} />
          </div>

          <p className="mt-4 text-center text-xs text-muted">
            A preview of your money at a glance
          </p>
        </div>
      </div>
    </section>
  );
}
