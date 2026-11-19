"use client";

import { useMemo } from "react";
import {
  Banknote,
  Building2,
  CreditCard,
  Landmark,
  RefreshCw,
  Search,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import type { BankAccount } from "@/features/profile/accounts-api";
import type { AccountCategoryTab } from "../types";

interface BankAccountsFilterToolbarProps {
  accounts: BankAccount[];
  loading: boolean;
  activeTab: AccountCategoryTab;
  onTabChange: (tab: AccountCategoryTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  institutionFilter: string;
  onInstitutionChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

const ACCOUNT_TABS = [
  { id: "all", label: "All accounts", icon: Landmark },
  { id: "bank", label: "Bank accounts", icon: Building2 },
  { id: "credit-cards", label: "Credit cards", icon: CreditCard },
  { id: "wallets", label: "Wallets", icon: Wallet },
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "investments", label: "Investments", icon: TrendingUp },
] as const satisfies readonly {
  id: AccountCategoryTab;
  label: string;
  icon: LucideIcon;
}[];

function accountMatchesTab(account: BankAccount, tab: AccountCategoryTab) {
  switch (tab) {
    case "bank":
      return account.type === "BANK";
    case "credit-cards":
      return account.type === "CREDIT_CARD";
    case "wallets":
      return account.type === "WALLET";
    case "cash":
      return account.type === "CASH";
    case "investments":
      return account.type === "INVESTMENT";
    default:
      return true;
  }
}

export function BankAccountsFilterToolbar({
  accounts,
  loading,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  institutionFilter,
  onInstitutionChange,
  statusFilter,
  onStatusChange,
  onReset,
}: BankAccountsFilterToolbarProps) {
  const statusAccounts = useMemo(
    () =>
      accounts.filter((account) =>
        statusFilter === "Archived" ? account.isArchived : !account.isArchived,
      ),
    [accounts, statusFilter],
  );

  const tabOptions = useMemo(
    () =>
      ACCOUNT_TABS.map(({ id, label, icon: Icon }) => ({
        value: id,
        label: `${label} (${statusAccounts.filter((account) =>
          accountMatchesTab(account, id),
        ).length})`,
        icon: <Icon aria-hidden="true" className="h-3.5 w-3.5" />,
      })),
    [statusAccounts],
  );

  const institutions = useMemo(
    () =>
      [
        ...new Set(
          accounts.map((account) => account.bankName?.trim() || account.name),
        ),
      ]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [accounts],
  );

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto pb-1">
        <SegmentedControl
          options={tabOptions}
          value={activeTab}
          onChange={onTabChange}
          label="Filter accounts by type"
          className="min-w-max"
        />
      </div>

      <Card className="flex flex-col gap-2 p-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search bank or account name"
          aria-label="Search bank accounts"
          icon={<Search aria-hidden="true" className="h-4 w-4" />}
          className="min-w-0 flex-1 sm:min-w-60"
        />

        <Select
          value={institutionFilter}
          onChange={(event) => onInstitutionChange(event.target.value)}
          aria-label="Filter by institution"
          className="w-full sm:w-auto sm:min-w-44"
        >
          <option value="All Banks">All institutions</option>
          {institutions.map((institution) => (
            <option key={institution} value={institution}>
              {institution}
            </option>
          ))}
        </Select>

        <Select
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter by account status"
          className="w-full sm:w-auto sm:min-w-36"
        >
          <option value="Active">Active accounts</option>
          <option value="Archived">Archived accounts</option>
        </Select>

        <IconButton
          type="button"
          label="Clear filters"
          onClick={onReset}
          className="h-10 w-10 shrink-0"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
        </IconButton>
      </Card>

      {loading && (
        <p role="status" className="flex items-center gap-2 text-xs text-muted">
          Loading account filters…
        </p>
      )}
    </div>
  );
}
