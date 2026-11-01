"use client";

import { useMemo, useState } from "react";
import { Transaction } from "../types";

export const ALL = "all";

export function useTransactionFilters(transactions: Transaction[]) {
  const [category, setCategory] = useState<string>(ALL);
  const [account, setAccount] = useState<string>(ALL);

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))),
    [transactions],
  );
  const accounts = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.account))),
    [transactions],
  );
  const rows = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (category === ALL || t.category === category) &&
          (account === ALL || t.account === account),
      ),
    [transactions, category, account],
  );

  return {
    category,
    setCategory,
    account,
    setAccount,
    categories,
    accounts,
    rows,
  };
}
