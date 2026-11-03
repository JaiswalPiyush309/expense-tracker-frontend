import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { toneSoft } from "@/lib/tone";
import type { Tone } from "@/lib/tone";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CircleMinus,
  CirclePlus,
  Handshake,
} from "lucide-react";

interface WelcomeCardProps {
  name: string;
  netWorth: number;
  netWorthChange: string;
  periodLabel: string;
  onAddExpense?: () => void;
  onAddIncome?: () => void;
  onRecordLending?: () => void;
  onImportStatement?: () => void;
}

export function WelcomeCard({
  name,
  netWorth,
  netWorthChange,
  periodLabel,
  onAddExpense,
  onAddIncome,
  onRecordLending,
  onImportStatement,
}: WelcomeCardProps) {
  const changeTone: Tone =
    netWorthChange.trim().startsWith("-")
      ? "bad"
      : netWorthChange.trim().startsWith("+")
        ? "good"
        : "neutral";

  return (
    <Card className="relative isolate flex flex-col gap-7 overflow-hidden p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
          Your financial snapshot
        </p>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.1rem]">
          Welcome back, {name} <span className="inline-block" aria-hidden="true">👋</span>
        </h1>

        <p
          aria-label={`Net worth change: ${netWorthChange}`}
          className={cn(
            "mt-4 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-current/10 px-3.5 py-2 text-sm font-semibold sm:text-base",
            toneSoft[changeTone],
          )}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full bg-current"
          />
          <span className="opacity-80">Net worth</span>
          <span className="font-bold tabular-nums">
            {formatINR(netWorth, { decimals: false })}
          </span>
          <span className="font-medium tabular-nums opacity-75">
            ({netWorthChange})
          </span>
        </p>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Your unified financial health overview
          {periodLabel ? ` for ${periodLabel}` : ""}, across your accounts,
          investments, and personal ledgers.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 lg:w-auto lg:min-w-100 lg:max-w-112">
        <Button
          size="md"
          onClick={onAddExpense}
          disabled={!onAddExpense}
          className="h-12 justify-start px-4 sm:px-5"
        >
          <CircleMinus aria-hidden="true" className="h-[18px] w-[18px]" />
          Add Expense
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onAddIncome}
          disabled={!onAddIncome}
          className="h-12 justify-start px-4 sm:px-5"
        >
          <CirclePlus aria-hidden="true" className="h-[18px] w-[18px] text-accent" />
          Add Income
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={onRecordLending}
          disabled={!onRecordLending}
          className="h-12 justify-start px-4 sm:px-5"
        >
          <Handshake aria-hidden="true" className="h-[18px] w-[18px] text-accent" />
          Record Lending
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onImportStatement}
          disabled={!onImportStatement}
          className="h-12 justify-start px-4 sm:px-5"
        >
          <ArrowDownToLine aria-hidden="true" className="h-[18px] w-[18px] text-accent" />
          Import Statement
          <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 text-muted" />
        </Button>
      </div>
    </Card>
  );
}
