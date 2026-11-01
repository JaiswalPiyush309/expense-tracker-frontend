import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { toneSoft } from "@/lib/tone";
import type { Tone } from "@/lib/tone";
import { CircleMinus, CirclePlus, Download, Handshake } from "lucide-react";

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
    <Card className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          Welcome back, {name} <span aria-hidden="true">👋</span>
        </h1>

        <p
          aria-label={`Net worth change: ${netWorthChange}`}
          className={cn(
            "mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            toneSoft[changeTone],
          )}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-current"
          />
          Net Worth: {formatINR(netWorth, { decimals: false })}
          <span className="font-medium tabular-nums opacity-80">
            ({netWorthChange})
          </span>
        </p>

        <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
          Here is your unified financial health overview
          {periodLabel ? ` for ${periodLabel}` : ""} across all bank accounts,
          investments, and personal ledgers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap lg:max-w-108 lg:justify-end">
        <Button
          size="md"
          onClick={onAddExpense}
          disabled={!onAddExpense}
          className="px-3 sm:px-5"
        >
          <CircleMinus aria-hidden="true" className="h-4 w-4" />
          Add Expense
        </Button>
        <Button
          variant="soft"
          size="md"
          onClick={onAddIncome}
          disabled={!onAddIncome}
          className="px-3 sm:px-5"
        >
          <CirclePlus aria-hidden="true" className="h-4 w-4" />
          Add Income
        </Button>

        <Button
          variant="soft"
          size="md"
          onClick={onRecordLending}
          disabled={!onRecordLending}
          className="px-3 text-ink sm:px-5"
        >
          <Handshake aria-hidden="true" className="h-4 w-4 text-accent" />
          Record Lending
        </Button>
        <Button
          variant="soft"
          size="md"
          onClick={onImportStatement}
          disabled={!onImportStatement}
          className="bg-surface-muted px-3 text-muted hover:text-ink sm:px-5"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          Import Statement
        </Button>
      </div>
    </Card>
  );
}
