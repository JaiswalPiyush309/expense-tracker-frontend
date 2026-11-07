"use client";

import { useEffect, useState } from "react";
import { getIncomeTransactions, invalidateIncomeTransactions, type IncomeTransaction } from "../income-api";

export function useIncomeAnalytics() {
  const [transactions, setTransactions] = useState<IncomeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = () => {
      setIsLoading(true);
      setError("");
      getIncomeTransactions()
        .then((items) => { if (active) setTransactions(items); })
        .catch((reason: unknown) => {
          if (active) setError(reason instanceof Error ? reason.message : "Unable to load income data.");
        })
        .finally(() => { if (active) setIsLoading(false); });
    };
    const refresh = () => { invalidateIncomeTransactions(); load(); };
    load();
    window.addEventListener("transactions:created", refresh);
    return () => {
      active = false;
      window.removeEventListener("transactions:created", refresh);
    };
  }, []);

  return { transactions, isLoading, error };
}
