"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Banknote, Check, LoaderCircle, Plus, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  createBankAccount,
  deleteBankAccount,
  getBankAccounts,
  getSupportedBanks,
  updateBankAccount,
  type AccountType,
  type BankAccount,
  type SupportedBank,
} from "../accounts-api";

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "BANK", label: "Bank account" },
  { value: "WALLET", label: "Wallet / UPI" },
  { value: "CREDIT_CARD", label: "Credit card" },
  { value: "CASH", label: "Cash" },
  { value: "INVESTMENT", label: "Investment" },
];

const initialForm = {
  bankCode: "",
  name: "",
  type: "BANK" as AccountType,
  accountNumberLast4: "",
  upiId: "",
  openingBalance: "0",
  isDefault: false,
};

function amount(value: number | string, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export function BankAccountsCard() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [banks, setBanks] = useState<SupportedBank[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const popularCodes = useMemo(() => new Set(banks.filter((bank) => bank.isPopular).map((bank) => bank.code)), [banks]);
  const sortedBanks = useMemo(
    () => [...banks].sort((a, b) => Number(popularCodes.has(b.code)) - Number(popularCodes.has(a.code)) || a.bankName.localeCompare(b.bankName)),
    [banks, popularCodes],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accountResult, bankResult] = await Promise.all([getBankAccounts(), getSupportedBanks()]);
      setAccounts(accountResult.filter((account) => !account.isArchived));
      setBanks(bankResult.all);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load your bank accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setValue = (key: keyof typeof initialForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (!form.bankCode) {
      setError("Select a bank or wallet.");
      return;
    }
    if (form.accountNumberLast4 && !/^\d{4}$/.test(form.accountNumberLast4)) {
      setError("Enter exactly the last 4 digits of the account number.");
      return;
    }
    const openingBalance = Number(form.openingBalance);
    if (!Number.isFinite(openingBalance)) {
      setError("Enter a valid opening balance.");
      return;
    }

    setSaving(true);
    try {
      const account = await createBankAccount({
        bankCode: form.bankCode,
        name: form.name.trim() || undefined,
        type: form.type,
        accountNumberLast4: form.accountNumberLast4 || undefined,
        upiId: form.upiId.trim() || undefined,
        openingBalance,
        isDefault: form.isDefault,
      });
      setAccounts((current) => form.isDefault ? [account, ...current.map((item) => ({ ...item, isDefault: false }))] : [account, ...current]);
      setForm(initialForm);
      setShowForm(false);
      setNotice("Bank account added successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add this account.");
    } finally {
      setSaving(false);
    }
  };

  const makeDefault = async (account: BankAccount) => {
    if (account.isDefault) return;
    setBusyId(account.id);
    setError(null);
    try {
      await updateBankAccount(account.id, { isDefault: true });
      setAccounts((current) => current.map((item) => ({ ...item, isDefault: item.id === account.id })));
      setNotice(`${account.name} is now your default account.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change the default account.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (account: BankAccount) => {
    if (!window.confirm(`Remove ${account.name}?`)) return;
    setBusyId(account.id);
    setError(null);
    try {
      await deleteBankAccount(account.id);
      setAccounts((current) => current.filter((item) => item.id !== account.id));
      setNotice("Bank account removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove this account.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card className="p-5 sm:p-6">
      <CardHeader
        title="Bank Accounts & Wallets"
        description="Connect the accounts you use for expenses, income, and balances."
        icon={<Banknote aria-hidden="true" className="h-5 w-5" />}
        actions={
          <Button variant="soft" onClick={() => { setShowForm((current) => !current); setError(null); }}>
            {showForm ? <X aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
            {showForm ? "Close" : "Add account"}
          </Button>
        }
      />

      {error && <p role="alert" className="mt-4 rounded-xl bg-bad/10 px-4 py-3 text-sm font-medium text-bad">{error}</p>}
      {notice && <p role="status" className="mt-4 rounded-xl bg-good-soft px-4 py-3 text-sm font-medium text-good">{notice}</p>}

      {showForm && (
        <form className="mt-6 grid gap-5 border-t border-line pt-6 sm:grid-cols-2" onSubmit={submit} noValidate>
          <Field label="Bank or wallet" htmlFor="profile-bank-code">
            <Select id="profile-bank-code" value={form.bankCode} onChange={(event) => {
              const bank = banks.find((item) => item.code === event.target.value);
              setForm((current) => ({ ...current, bankCode: event.target.value, type: bank?.defaultAccountType ?? current.type }));
            }}>
              <option value="">Select a bank</option>
              {sortedBanks.map((bank) => <option key={bank.code} value={bank.code}>{bank.bankName}</option>)}
            </Select>
          </Field>
          <Field label="Account type" htmlFor="profile-account-type">
            <Select id="profile-account-type" value={form.type} onChange={(event) => setValue("type", event.target.value as AccountType)}>
              {ACCOUNT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </Select>
          </Field>
          <Field label="Account nickname" htmlFor="profile-account-name" hint="Optional, e.g. Salary account">
            <Input id="profile-account-name" value={form.name} maxLength={100} onChange={(event) => setValue("name", event.target.value)} placeholder="My primary account" />
          </Field>
          <Field label="Last 4 digits" htmlFor="profile-account-last4" hint="Never enter your complete account number">
            <Input id="profile-account-last4" value={form.accountNumberLast4} inputMode="numeric" maxLength={4} onChange={(event) => setValue("accountNumberLast4", event.target.value.replace(/\D/g, ""))} placeholder="4582" />
          </Field>
          <Field label="UPI ID" htmlFor="profile-account-upi" hint="Optional">
            <Input id="profile-account-upi" value={form.upiId} maxLength={100} onChange={(event) => setValue("upiId", event.target.value)} placeholder="name@bank" />
          </Field>
          <Field label="Opening balance" htmlFor="profile-account-balance">
            <Input id="profile-account-balance" type="number" min="0" step="0.01" inputMode="decimal" value={form.openingBalance} onChange={(event) => setValue("openingBalance", event.target.value)} />
          </Field>
          <label className="flex items-center gap-3 text-sm font-medium text-ink sm:col-span-2">
            <input type="checkbox" checked={form.isDefault} onChange={(event) => setValue("isDefault", event.target.checked)} className="h-4 w-4 accent-accent" />
            Make this my default account
          </label>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button variant="ghost" onClick={() => { setShowForm(false); setForm(initialForm); }}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />} {saving ? "Adding…" : "Add account"}</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p role="status" className="mt-6 text-sm text-muted">Loading your accounts…</p>
      ) : accounts.length === 0 ? (
        <EmptyState className="mt-6 p-8" icon={<Banknote aria-hidden="true" className="h-5 w-5" />} title="No accounts connected" description="Add a bank account or wallet to connect it with your transactions." action={<Button onClick={() => setShowForm(true)}>Add your first account</Button>} />
      ) : (
        <ul className="mt-6 space-y-3" aria-label="Connected bank accounts">
          {accounts.map((account) => (
            <li key={account.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-accent-soft/50 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-accent"><Banknote aria-hidden="true" className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink">
                    <span className="truncate">{account.name}</span>
                    {account.isDefault && <Badge tone="good"><Star aria-hidden="true" className="h-3 w-3" /> Default</Badge>}
                  </p>
                  <p className="mt-1 text-xs text-muted">{account.bankName ?? "Account"}{account.accountNumberLast4 ? ` · •••• ${account.accountNumberLast4}` : ""} · {account.type.replace("_", " ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold tabular-nums text-ink">{amount(account.balance, account.currency)}</p>
                <Button variant="ghost" size="icon" aria-label={`Set ${account.name} as default`} disabled={account.isDefault || busyId === account.id} onClick={() => void makeDefault(account)}><Check aria-hidden="true" className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" aria-label={`Remove ${account.name}`} disabled={busyId === account.id} onClick={() => void remove(account)} className="text-bad hover:text-bad"><Trash2 aria-hidden="true" className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
