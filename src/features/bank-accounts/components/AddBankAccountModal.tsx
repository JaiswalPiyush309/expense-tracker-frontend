"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import {
  getSupportedBanks,
  type AccountType,
  type CreateBankAccountInput,
  type SupportedBank,
} from "@/features/profile/accounts-api";

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: CreateBankAccountInput) => Promise<unknown>;
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "BANK", label: "Bank account" },
  { value: "CREDIT_CARD", label: "Credit card" },
  { value: "WALLET", label: "Wallet / UPI" },
  { value: "CASH", label: "Cash" },
  { value: "INVESTMENT", label: "Investment" },
];

const INITIAL_FORM = {
  bankCode: "",
  name: "",
  type: "BANK" as AccountType,
  accountNumberLast4: "",
  upiId: "",
  openingBalance: "0",
  isDefault: false,
};

export function AddBankAccountModal({
  isOpen,
  onClose,
  onAdd,
}: AddBankAccountModalProps) {
  const [banks, setBanks] = useState<SupportedBank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const orderedBanks = useMemo(
    () =>
      [...banks].sort(
        (a, b) =>
          Number(b.isPopular) - Number(a.isPopular) ||
          a.bankName.localeCompare(b.bankName),
      ),
    [banks],
  );

  useEffect(() => {
    if (!isOpen) return;

    let isCurrent = true;
    setIsLoadingBanks(true);
    setBankError(null);
    getSupportedBanks()
      .then((result) => {
        if (isCurrent) setBanks(result.all);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setBankError(
            error instanceof Error
              ? error.message
              : "Unable to load supported banks.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoadingBanks(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const setValue = <K extends keyof typeof INITIAL_FORM>(
    key: K,
    value: (typeof INITIAL_FORM)[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const close = () => {
    if (isSaving) return;
    setForm(INITIAL_FORM);
    setFormError(null);
    onClose();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!form.bankCode) {
      setFormError("Select a bank or financial institution.");
      return;
    }
    if (form.accountNumberLast4 && !/^\d{4}$/.test(form.accountNumberLast4)) {
      setFormError("Enter exactly the last 4 digits of the account or card.");
      return;
    }

    const openingBalance = Number(form.openingBalance);
    if (
      !Number.isFinite(openingBalance) ||
      Math.abs(openingBalance * 100 - Math.round(openingBalance * 100)) > 1e-7
    ) {
      setFormError("Enter a valid opening balance with up to 2 decimal places.");
      return;
    }

    setIsSaving(true);
    try {
      await onAdd({
        bankCode: form.bankCode,
        name: form.name.trim() || undefined,
        type: form.type,
        accountNumberLast4: form.accountNumberLast4 || undefined,
        upiId: form.upiId.trim() || undefined,
        openingBalance,
        isDefault: form.isDefault,
      });
      setForm(INITIAL_FORM);
      onClose();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to add this account.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-bank-account-title"
        aria-describedby="add-bank-account-description"
        className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 id="add-bank-account-title" className="text-lg font-bold text-ink">
              Add financial account
            </h2>
            <p id="add-bank-account-description" className="mt-1 text-sm text-muted">
              Connect a bank account, card, wallet, or cash account to your ledger.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close dialog"
            disabled={isSaving}
            onClick={close}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </header>

        <form onSubmit={submit} noValidate className="space-y-5 p-5 sm:p-6">
          {formError && (
            <p role="alert" className="rounded-xl bg-bad/10 px-4 py-3 text-sm font-medium text-bad">
              {formError}
            </p>
          )}

          {bankError ? (
            <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl bg-bad/10 px-4 py-3 text-sm text-bad">
              <p className="min-w-0 flex-1">{bankError}</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setBankError(null);
                  setIsLoadingBanks(true);
                  getSupportedBanks()
                    .then((result) => setBanks(result.all))
                    .catch((error: unknown) => setBankError(error instanceof Error ? error.message : "Unable to load supported banks."))
                    .finally(() => setIsLoadingBanks(false));
                }}
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bank or institution" htmlFor="add-account-bank">
                <Select
                  id="add-account-bank"
                  required
                  value={form.bankCode}
                  disabled={isLoadingBanks || isSaving}
                  onChange={(event) => {
                    const bank = banks.find((item) => item.code === event.target.value);
                    setForm((current) => ({
                      ...current,
                      bankCode: event.target.value,
                      type: bank?.defaultAccountType ?? current.type,
                    }));
                  }}
                >
                  <option value="">
                    {isLoadingBanks ? "Loading institutions…" : "Select an institution"}
                  </option>
                  {orderedBanks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.isPopular ? `★ ${bank.bankName}` : bank.bankName}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Account type" htmlFor="add-account-type">
                <Select
                  id="add-account-type"
                  value={form.type}
                  disabled={isSaving}
                  onChange={(event) => setValue("type", event.target.value as AccountType)}
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Account nickname" htmlFor="add-account-name" hint="Optional">
                <Input
                  id="add-account-name"
                  value={form.name}
                  maxLength={100}
                  autoComplete="off"
                  disabled={isSaving}
                  onChange={(event) => setValue("name", event.target.value)}
                  placeholder="e.g. Salary account"
                />
              </Field>

              <Field label="Last 4 digits" htmlFor="add-account-last4" hint="Never enter the full account number">
                <Input
                  id="add-account-last4"
                  value={form.accountNumberLast4}
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="off"
                  disabled={isSaving}
                  onChange={(event) => setValue("accountNumberLast4", event.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="4582"
                />
              </Field>

              <Field label="UPI ID" htmlFor="add-account-upi" hint="Optional">
                <Input
                  id="add-account-upi"
                  value={form.upiId}
                  maxLength={100}
                  autoComplete="off"
                  disabled={isSaving}
                  onChange={(event) => setValue("upiId", event.target.value)}
                  placeholder="name@bank"
                />
              </Field>

              <Field label="Opening balance" htmlFor="add-account-balance" hint="Use the current balance when you start tracking this account">
                <Input
                  id="add-account-balance"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={form.openingBalance}
                  disabled={isSaving}
                  onChange={(event) => setValue("openingBalance", event.target.value)}
                />
              </Field>
            </div>
          )}

          <Switch
            checked={form.isDefault}
            onChange={(checked) => setValue("isDefault", checked)}
            className="pt-1"
          >
            Make this my default account
          </Switch>

          <footer className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" disabled={isSaving} onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isLoadingBanks || Boolean(bankError)}>
              {isSaving && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {isSaving ? "Adding account…" : "Add account"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
