"use client";

import { useMemo, useState } from "react";
import type { AuditEntry } from "../types";

export const ALL = "all";

export function useAuditFilters(entries: readonly AuditEntry[]) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [account, setAccount] = useState<string>(ALL);
  const [type, setType] = useState<string>(ALL);

  const options = useMemo(
    () => ({
      categories: Array.from(new Set(entries.map((e) => e.category))),
      accounts: Array.from(new Set(entries.map((e) => e.account))),
      types: Array.from(new Set(entries.map((e) => e.type))),
    }),
    [entries],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (!q ||
          e.merchant.toLowerCase().includes(q) ||
          e.ref.toLowerCase().includes(q)) &&
        (category === ALL || e.category === category) &&
        (account === ALL || e.account === account) &&
        (type === ALL || e.type === type),
    );
  }, [entries, search, category, account, type]);

  const hasFilters =
    search.trim().length > 0 ||
    category !== ALL ||
    account !== ALL ||
    type !== ALL;

  const clearFilters = () => {
    setSearch("");
    setCategory(ALL);
    setAccount(ALL);
    setType(ALL);
  };

  return {
    search,
    setSearch,
    category,
    setCategory,
    account,
    setAccount,
    type,
    setType,
    ...options,
    rows,
    hasFilters,
    clearFilters,
  };
}
