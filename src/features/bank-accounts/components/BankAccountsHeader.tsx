"use client";

import { ArrowLeftRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ImportStatementButton } from "@/features/statement-imports";

interface BankAccountsHeaderProps {
  onOpenAddAccount: () => void;
  onOpenTransferMoney: () => void;
}

export function BankAccountsHeader({
  onOpenAddAccount,
  onOpenTransferMoney,
}: BankAccountsHeaderProps) {
  return (
    <PageHeader
      title="Bank Accounts"
      description="Manage your bank accounts, credit cards, and digital wallets. Track balances, monitor account activity, and manage connected financial accounts."
      breadcrumbs={[
        { label: "FY 2025–26" },
        { label: "Bank Accounts & Liabilities" },
      ]}
      actions={
        <>
          <ImportStatementButton />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onOpenTransferMoney}
          >
            <ArrowLeftRight aria-hidden="true" className="h-4 w-4" />
            <span>Transfer Money</span>
          </Button>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={onOpenAddAccount}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            <span>Add Account</span>
          </Button>
        </>
      }
    />
  );
}
