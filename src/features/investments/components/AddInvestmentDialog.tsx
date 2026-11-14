"use client";

import { type FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  createInvestmentTransaction,
  type CreateInvestmentTransactionInput,
} from "../share-market/api/investments-api";

type ActivityType = CreateInvestmentTransactionInput["tradeType"];

function localDateTime(): { date: string; time: string } {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const fieldClassName = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

export function AddInvestmentDialog({ isOpen, onClose, onSaved }: Props) {
  const [tradeType, setTradeType] = useState<ActivityType>("BUY");
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [segment, setSegment] = useState<"DELIVERY" | "MTF">("DELIVERY");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [charges, setCharges] = useState("0");
  const [broker, setBroker] = useState("Groww");
  const [tradeDate, setTradeDate] = useState("");
  const [tradeTime, setTradeTime] = useState("");
  const [maxTradeDate, setMaxTradeDate] = useState("");
  const [maxTradeTime, setMaxTradeTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTradeType("BUY");
    setTickerSymbol("");
    setSegment("DELIVERY");
    setQuantity("");
    setPrice("");
    setAmount("");
    setCharges("0");
    setBroker("Groww");
    const now = localDateTime();
    setTradeDate(now.date);
    setTradeTime(now.time);
    setMaxTradeDate(now.date);
    setMaxTradeTime(now.time);
    setError(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const isTrade = tradeType === "BUY" || tradeType === "SELL";
  const isDividend = tradeType === "DIVIDEND";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const needsTicker = tradeType !== "MTF_INTEREST";
    if (needsTicker && !tickerSymbol.trim()) {
      setError("Enter the investment symbol.");
      return;
    }
    if (!tradeDate || !tradeTime) {
      setError("Choose the transaction date and time.");
      return;
    }
    const localTradeDate = new Date(`${tradeDate}T${tradeTime}:00`);
    if (Number.isNaN(localTradeDate.getTime())) {
      setError("Enter a valid transaction date and time.");
      return;
    }
    const tradeDateIso = localTradeDate.toISOString();

    let payload: CreateInvestmentTransactionInput;
    if (tradeType === "MTF_INTEREST") {
      const interest = Number(amount);
      if (!Number.isFinite(interest) || interest <= 0) {
        setError("Enter an interest amount greater than zero.");
        return;
      }
      payload = {
        tickerSymbol: "MTF INTEREST",
        tradeType,
        tradeDate: tradeDateIso,
        chargesAndTaxes: interest,
        broker: broker.trim() || "Groww",
      };
    } else if (isDividend) {
      const dividend = Number(amount);
      const transactionCharges = Number(charges);
      if (!Number.isFinite(dividend) || dividend <= 0) {
        setError("Enter a dividend amount greater than zero.");
        return;
      }
      if (!Number.isFinite(transactionCharges) || transactionCharges < 0) {
        setError("Charges must be zero or more.");
        return;
      }
      payload = {
        tickerSymbol: tickerSymbol.trim().toUpperCase(),
        tradeType,
        tradeDate: tradeDateIso,
        quantity: 1,
        executionPrice: dividend,
        chargesAndTaxes: transactionCharges,
        broker: broker.trim() || "Groww",
      };
    } else {
      const shares = Number(quantity);
      const executionPrice = Number(price);
      const transactionCharges = Number(charges);
      if (!Number.isFinite(shares) || shares <= 0) {
        setError("Quantity must be greater than zero.");
        return;
      }
      if (!Number.isFinite(executionPrice) || executionPrice <= 0) {
        setError("Price per share must be greater than zero.");
        return;
      }
      if (!Number.isFinite(transactionCharges) || transactionCharges < 0) {
        setError("Charges must be zero or more.");
        return;
      }
      payload = {
        tickerSymbol: tickerSymbol.trim().toUpperCase(),
        tradeType,
        tradeDate: tradeDateIso,
        segment,
        quantity: shares,
        executionPrice,
        chargesAndTaxes: transactionCharges,
        broker: broker.trim() || "Groww",
      };
    }

    setIsSaving(true);
    try {
      await createInvestmentTransaction(payload);
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save the investment activity.");
    } finally {
      setIsSaving(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-investment-title"
        className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="h-1 bg-indigo-600" />
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100dvh-8rem)] space-y-5 overflow-y-auto p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="add-investment-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  Record investment activity
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add a completed transaction to your investment ledger. This does not place a market order.
                </p>
              </div>
              <button type="button" onClick={onClose} disabled={isSaving} aria-label="Close dialog" className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800">✕</button>
            </div>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Activity type
              <select value={tradeType} onChange={(event) => setTradeType(event.target.value as ActivityType)} className={fieldClassName}>
                <option value="BUY">Buy completed shares</option>
                <option value="SELL">Sell completed shares</option>
                <option value="DIVIDEND">Dividend received</option>
                <option value="MTF_INTEREST">MTF interest paid</option>
              </select>
            </label>

            {tradeType !== "MTF_INTEREST" && (
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Stock symbol
                <input value={tickerSymbol} onChange={(event) => setTickerSymbol(event.target.value)} placeholder="e.g. RELIANCE" autoComplete="off" className={fieldClassName} />
              </label>
            )}

            {isTrade && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Quantity (shares)
                    <input type="number" min="0.0001" step="0.0001" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClassName} />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Price per share (₹)
                    <input type="number" min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className={fieldClassName} />
                  </label>
                </div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Holding segment
                  <select value={segment} onChange={(event) => setSegment(event.target.value as "DELIVERY" | "MTF")} className={fieldClassName}>
                    <option value="DELIVERY">Delivery</option>
                    <option value="MTF">Margin (MTF)</option>
                  </select>
                </label>
              </>
            )}

            {(isDividend || tradeType === "MTF_INTEREST") && (
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isDividend ? "Dividend amount (₹)" : "Interest paid (₹)"}
                <input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className={fieldClassName} />
              </label>
            )}

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Broker
              <input value={broker} onChange={(event) => setBroker(event.target.value)} maxLength={100} placeholder="e.g. Groww or Upstox" className={fieldClassName} />
            </label>

            {tradeType !== "MTF_INTEREST" && (
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Charges and taxes (₹)
                <input type="number" min="0" step="0.01" value={charges} onChange={(event) => setCharges(event.target.value)} className={fieldClassName} />
              </label>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Transaction date
                <input type="date" value={tradeDate} max={maxTradeDate || undefined} onChange={(event) => setTradeDate(event.target.value)} className={fieldClassName} />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Transaction time
                <input type="time" value={tradeTime} max={tradeDate === maxTradeDate ? maxTradeTime : undefined} onChange={(event) => setTradeTime(event.target.value)} className={fieldClassName} />
              </label>
            </div>

            {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={isSaving} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
              {isSaving ? "Saving…" : "Save activity"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  );
}
