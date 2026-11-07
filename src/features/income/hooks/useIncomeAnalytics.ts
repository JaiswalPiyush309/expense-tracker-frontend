"use client";

import { useEffect, useState } from "react";
import { getIncomeTransactions, type IncomeTransaction } from "../income-api";

export function useIncomeAnalytics() {
  const [transactions, setTransactions] = useState<IncomeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getIncomeTransactions()
      .then((items) => { if (active) setTransactions(items); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load income data.");
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return { transactions, isLoading, error };
}
