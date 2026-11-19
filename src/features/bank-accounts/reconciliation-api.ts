import { getBankAccounts } from "@/features/profile/accounts-api";
import { fetchAllTransactions } from "@/features/transactions/transactions-api";

const BALANCE_TOLERANCE = 0.005;

export interface AccountReconciliationResult {
  checkedAccounts: number;
  checkedTransactions: number;
  discrepancies: Array<{
    accountName: string;
    expectedBalance: number;
    actualBalance: number;
    difference: number;
    currency: string;
  }>;
}

/** Compare API account balances with opening balances and their recorded ledger activity. */
export async function reconcileBankAccounts(): Promise<AccountReconciliationResult> {
  const [accounts, transactions] = await Promise.all([
    getBankAccounts(true),
    fetchAllTransactions(),
  ]);

  const balanceDeltas = new Map(accounts.map((account) => [account.id, 0]));

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);
    if (!Number.isFinite(amount)) {
      throw new Error("Reconciliation stopped because a transaction has an invalid amount.");
    }

    const sourceDelta = transaction.type === "INCOME" ? amount : -amount;
    const sourceBalance = balanceDeltas.get(transaction.accountId);
    if (sourceBalance === undefined) {
      throw new Error("Reconciliation stopped because a transaction references an unknown account.");
    }
    balanceDeltas.set(transaction.accountId, sourceBalance + sourceDelta);

    if (transaction.type === "TRANSFER") {
      if (!transaction.toAccountId) {
        throw new Error("Reconciliation stopped because a transfer has no destination account.");
      }
      const destinationBalance = balanceDeltas.get(transaction.toAccountId);
      if (destinationBalance === undefined) {
        throw new Error("Reconciliation stopped because a transfer references an unknown destination account.");
      }
      balanceDeltas.set(transaction.toAccountId, destinationBalance + amount);
    }
  }

  const discrepancies = accounts.flatMap((account) => {
    const expectedBalance = Number(account.openingBalance) + (balanceDeltas.get(account.id) ?? 0);
    const actualBalance = Number(account.balance);
    if (!Number.isFinite(expectedBalance) || !Number.isFinite(actualBalance)) {
      throw new Error(`Reconciliation stopped because ${account.name} has an invalid balance.`);
    }

    const difference = actualBalance - expectedBalance;
    if (Math.abs(difference) <= BALANCE_TOLERANCE) return [];

    return [{
      accountName: account.name,
      expectedBalance,
      actualBalance,
      difference,
      currency: account.currency,
    }];
  });

  return {
    checkedAccounts: accounts.length,
    checkedTransactions: transactions.length,
    discrepancies,
  };
}
