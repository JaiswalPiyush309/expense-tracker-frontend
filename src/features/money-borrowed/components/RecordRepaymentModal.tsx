"use client";

import { useEffect, useState } from "react";
import { Check, LoaderCircle, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatINR } from "@/lib/format";
import type { BorrowedLoanItem } from "../types";

interface RecordRepaymentModalProps {
  loan: BorrowedLoanItem | null;
  onClose: () => void;
  onSubmit: (
    loanId: string,
    repayment: {
      amount: number;
      date: string;
      paymentMode: "UPI" | "BANK_TRANSFER" | "CASH" | "CHEQUE";
      notes?: string;
    },
  ) => Promise<void>;
}

export function RecordRepaymentModal({
  loan,
  onClose,
  onSubmit,
}: RecordRepaymentModalProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr);
  const [paymentMode, setPaymentMode] = useState<
    "UPI" | "BANK_TRANSFER" | "CASH" | "CHEQUE"
  >("UPI");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loan) {
      setAmount(String(loan.balanceDue));
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMode("UPI");
      setNotes("");
      setError(null);
    }
  }, [loan]);

  if (!loan) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid payment amount greater than ₹0.");
      return;
    }

    if (parsedAmount > loan.balanceDue) {
      setError(
        `Payment cannot exceed remaining balance due of ₹${loan.balanceDue.toLocaleString(
          "en-IN",
        )}.`,
      );
      return;
    }
    if (Math.abs(parsedAmount * 100 - Math.round(parsedAmount * 100)) > 1e-7) {
      setError("Payment amount must have no more than 2 decimal places.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(loan.id, {
        amount: parsedAmount,
        date,
        paymentMode,
        notes: notes.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFullSettlementClick = () => {
    setAmount(String(loan.balanceDue));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="repay-borrowed-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-good-soft text-good">
              <Check className="h-5 w-5" />
            </span>
            <div>
              <h2
                id="repay-borrowed-title"
                className="text-base font-bold text-ink"
              >
                Make Debt Payment
              </h2>
              <p className="text-xs text-muted">
                Record a repayment transfer made to {loan.lenderName}
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

        {/* Loan Balance Context Header */}
        <div className="mt-4 rounded-xl border border-line bg-surface-muted/50 p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">Total Borrowed Principal</span>
            <span className="font-semibold text-ink">
              {formatINR(loan.originalAmount, { decimals: false })}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-muted">Repaid to Date</span>
            <span className="font-semibold text-good">
              {formatINR(loan.repaidAmount, { decimals: false })}
            </span>
          </div>
          <div className="mt-2 border-t border-line pt-2 flex items-center justify-between">
            <span className="font-bold text-ink">Remaining Payable</span>
            <span className="text-base font-bold text-bad">
              {formatINR(loan.balanceDue, { decimals: false })}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-bad-soft p-3 text-xs font-semibold text-bad">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label="Payment Amount (₹) *" htmlFor="repay-borrow-amount">
            <div className="space-y-1.5">
              <Input
                id="repay-borrow-amount"
                type="number"
                min="1"
                max={loan.balanceDue}
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹10,000"
              />
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted">
                  Max: {formatINR(loan.balanceDue, { decimals: false })}
                </span>
                <button
                  type="button"
                  onClick={handleFullSettlementClick}
                  className="font-semibold text-accent hover:underline"
                >
                  Pay Full Balance (₹{loan.balanceDue.toLocaleString("en-IN")})
                </button>
              </div>
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Payment Date" htmlFor="repay-borrow-date">
              <Input
                id="repay-borrow-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>

            <Field label="Payment Mode" htmlFor="repay-borrow-mode">
              <Select
                id="repay-borrow-mode"
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(
                    e.target.value as
                      | "UPI"
                      | "BANK_TRANSFER"
                      | "CASH"
                      | "CHEQUE",
                  )
                }
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="BANK_TRANSFER">Bank IMPS / NEFT</option>
                <option value="CASH">Cash in Hand</option>
                <option value="CHEQUE">Bank Cheque</option>
              </Select>
            </Field>
          </div>

          <Field
            label="Reference / Transaction ID (Optional)"
            htmlFor="repay-borrow-notes"
          >
            <Input
              id="repay-borrow-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via UPI Txn ID #50482019..."
            />
          </Field>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" className="px-5 shadow-xs" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span>{isSubmitting ? "Saving…" : "Confirm Payment"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
