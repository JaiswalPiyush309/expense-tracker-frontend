"use client";

import { useState } from "react";
import { AddTransactionDialog } from "@/components/transactions/add-transaction";
import { TransactionsTable } from "@/features/dashboard/components/TransactionsTable";
import type { Transaction } from "@/features/dashboard/types";
import { TransactionsHeader } from "./components/TransactionsHeader";

export function TransactionsView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const transactions: Transaction[] = [];

  return (
    <main className="mx-auto w-full max-w-350 space-y-6 p-4 pb-10 sm:p-6">
      <TransactionsHeader
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
      />
      <TransactionsTable
        transactions={transactions}
        total={transactions.length}
        pageSize={transactions.length || 1}
        page={page}
        onPageChange={setPage}
      />
      <AddTransactionDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </main>
  );
}
