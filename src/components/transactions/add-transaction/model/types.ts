export type TransactionType =
  | "expense"
  | "income"
  | "transfer"
  | "invest"
  | "lending"
  | "borrowing";

export interface BankAccountOption {
  id: string;
  bankName: string;
  maskedNumber: string;
  accountType: string;
  balance: number;
  shortLabel: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  subCategory: string;
  type: TransactionType | "all";
  iconBg: string;
  iconColor: string;
}

export interface TransactionTag {
  id: string;
  label: string;
  tone?: "blue" | "emerald" | "slate";
}

export interface AttachedInvoice {
  name: string;
  sizeLabel: string;
  file?: File;
}

export interface AddTransactionFormValues {
  type: TransactionType;
  amount: number;
  title: string;
  date: string;
  time: string;
  accountId: string;
  toAccountId: string;
  categoryId: string;
  merchant: string;
  isAutoTagged: boolean;
  tags: TransactionTag[];
  utrNumber: string;
  notes: string;
  attachment: AttachedInvoice | null;
  isRecurring: boolean;
}
