"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, UserCheck, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { BorrowedLoanItem, LenderRelationshipCategory } from "../types";
import {
  searchRegisteredMembers,
  type MemberSearchResult,
} from "../../money-lent/api/ledgers-api";
import {
  getAccountDropdownOptions,
  type AccountDropdownOption,
} from "@/features/profile/accounts-api";

interface RecordBorrowedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    loan: Omit<
      BorrowedLoanItem,
      "id" | "repayments" | "repaidAmount" | "balanceDue" | "lenderInitials"
    >,
  ) => Promise<void>;
}

export function RecordBorrowedModal({
  isOpen,
  onClose,
  onSubmit,
}: RecordBorrowedModalProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const nextMonthStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [lenderName, setLenderName] = useState("");
  const [counterpartyUserId, setCounterpartyUserId] = useState<string | null>(
    null,
  );
  const [counterpartyEmail, setCounterpartyEmail] = useState("");
  const [memberResults, setMemberResults] = useState<MemberSearchResult[]>([]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [accounts, setAccounts] = useState<AccountDropdownOption[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountLoadError, setAccountLoadError] = useState<string | null>(null);
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [relationship, setRelationship] =
    useState<LenderRelationshipCategory>("Friend");
  const [contactNumber, setContactNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [borrowedDate, setBorrowedDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(nextMonthStr);
  const [notes, setNotes] = useState("");
  const [interestRate, setInterestRate] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isCurrent = true;
    setIsLoadingAccounts(true);
    setAccountLoadError(null);
    getAccountDropdownOptions()
      .then((options) => {
        if (isCurrent) {
          setAccounts(options);
          setSourceAccountId((current) =>
            options.some((account) => account.id === current)
              ? current
              : options.find((account) => account.isDefault)?.id || "",
          );
        }
      })
      .catch((err: unknown) => {
        if (isCurrent) {
          setAccountLoadError(
            err instanceof Error ? err.message : "Unable to load accounts.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoadingAccounts(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [isOpen]);

  // Search members dynamically when user types lender name
  useEffect(() => {
    if (lenderName.trim().length < 2 || counterpartyUserId) {
      setMemberResults([]);
      setShowMemberDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchRegisteredMembers(lenderName);
        setMemberResults(results);
        setShowMemberDropdown(results.length > 0);
      } catch {
        setMemberResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [lenderName, counterpartyUserId]);

  const selectMember = (member: MemberSearchResult) => {
    setLenderName(member.name);
    setCounterpartyUserId(member.id);
    setCounterpartyEmail(member.email);
    setContactNumber(member.phone || "");
    setShowMemberDropdown(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLenderName(e.target.value);
    if (counterpartyUserId) {
      setCounterpartyUserId(null); // Reset linked member if user changes typed name
      setCounterpartyEmail("");
      setContactNumber("");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!lenderName.trim()) {
      setError("Please enter the lender's name or institution.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid loan amount greater than ₹0.");
      return;
    }
    if (Math.abs(parsedAmount * 100 - Math.round(parsedAmount * 100)) > 1e-7) {
      setError("Loan amount must have no more than 2 decimal places.");
      return;
    }
    const parsedInterestRate = Number(interestRate);
    if (
      !Number.isFinite(parsedInterestRate) ||
      parsedInterestRate < 0 ||
      Math.abs(parsedInterestRate * 100 - Math.round(parsedInterestRate * 100)) > 1e-7
    ) {
      setError("Enter a valid interest rate with up to 2 decimal places.");
      return;
    }

    const tones = ["accent", "good", "neutral"] as const;
    const randomTone = tones[Math.floor(Math.random() * tones.length)];

    setIsSubmitting(true);
    try {
      await onSubmit({
        lenderName: lenderName.trim(),
        lenderAvatarTone: randomTone,
        relationship,
        contactNumber: contactNumber.trim() || undefined,
        counterpartyUserId: counterpartyUserId || undefined,
        counterpartyEmail: counterpartyEmail.trim() || undefined,
        counterpartyPhone: contactNumber.trim() || undefined,
        originalAmount: parsedAmount,
        borrowedDate,
        dueDate,
        status: "PENDING",
        receivingAccount: accounts.find((account) => account.id === sourceAccountId)?.displayLabel || "Cash / external account",
        sourceAccountId: sourceAccountId || undefined,
        notes: notes.trim() || undefined,
        interestRate: parsedInterestRate,
      });
      setLenderName("");
      setCounterpartyUserId(null);
      setCounterpartyEmail("");
      setRelationship("Friend");
      setContactNumber("");
      setAmount("");
      setSourceAccountId("");
      setBorrowedDate(todayStr);
      setDueDate(nextMonthStr);
      setNotes("");
      setInterestRate("0");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to record this borrowing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="record-borrowed-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <h2
                id="record-borrowed-title"
                className="text-base font-bold text-ink"
              >
                Record Borrowed Money
              </h2>
              <p className="text-xs text-muted">
                Add a personal loan liability &amp; deposit tracking entry
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-ink"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-bad-soft p-3 text-xs font-semibold text-bad">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative">
              <Field label="Lender / Creditor *" htmlFor="borrow-lender-name">
                <div className="relative">
                  <Input
                    id="borrow-lender-name"
                    required
                    value={lenderName}
                    onChange={handleNameChange}
                    onFocus={() =>
                      memberResults.length > 0 && setShowMemberDropdown(true)
                    }
                    placeholder="e.g. Deepak Verma"
                  />
                  {counterpartyUserId && (
                    <span className="absolute right-2 top-2.5 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                      <UserCheck className="h-3 w-3" />
                      Member
                    </span>
                  )}
                </div>
              </Field>

              {/* Member Search Dropdown */}
              {showMemberDropdown && memberResults.length > 0 && (
                <div className="absolute left-0 right-0 top-[66px] z-20 max-h-48 overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-lg">
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Registered Members Found
                  </div>
                  {memberResults.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => selectMember(m)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-surface-muted"
                    >
                      <div className="truncate">
                        <p className="font-semibold text-ink">{m.name}</p>
                        <p className="truncate text-[11px] text-muted">
                          {m.email}
                        </p>
                      </div>
                      <span className="shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent">
                        Link
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Field label="Relationship" htmlFor="borrow-relationship">
              <Select
                id="borrow-relationship"
                value={relationship}
                onChange={(e) =>
                  setRelationship(
                    e.target.value as LenderRelationshipCategory,
                  )
                }
              >
                <option value="Friend">Friend</option>
                <option value="Family">Family</option>
                <option value="Colleague">Colleague</option>
                <option value="Bank/NBFC">Bank / NBFC</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Amount Borrowed (₹) *" htmlFor="borrow-amount">
              <Input
                id="borrow-amount"
                type="number"
                min="1"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹50,000"
              />
            </Field>

            <Field
              label="Deposit / Receiving Account"
              htmlFor="borrow-account"
              hint={accountLoadError || (isLoadingAccounts ? "Loading your accounts…" : "Select an account or use cash / external.")}
            >
              <Select
                id="borrow-account"
                value={sourceAccountId}
                disabled={isSubmitting || isLoadingAccounts}
                onChange={(e) => setSourceAccountId(e.target.value)}
              >
                <option value="">Cash / external account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.displayLabel}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Date Borrowed" htmlFor="borrow-date">
              <Input
                id="borrow-date"
                type="date"
                required
                value={borrowedDate}
                onChange={(e) => setBorrowedDate(e.target.value)}
              />
            </Field>

            <Field label="Agreed Due Date" htmlFor="borrow-due-date">
              <Input
                id="borrow-due-date"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Phone / Contact (Optional)" htmlFor="borrow-contact">
              <Input
                id="borrow-contact"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </Field>

            <Field label="Interest Rate (% p.a.)" htmlFor="borrow-interest">
              <Input
                id="borrow-interest"
                type="number"
                min="0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>

          <Field label="Notes / Terms (Optional)" htmlFor="borrow-notes">
            <Textarea
              id="borrow-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Contractor advance support; promised payback upon quarterly bonus"
            />
          </Field>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" className="px-5 shadow-xs" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving…" : "Save Borrowed Debt"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
