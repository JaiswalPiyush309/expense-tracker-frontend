export type StagedAuditStatus =
  | "VERIFIED_MATCH"
  | "VALID"
  | "DUPLICATE"
  | "NEEDS_REVIEW";

export type StagedTransactionType = "CREDIT" | "DEBIT";

export type ImportFilterTab = "all" | "valid" | "duplicates" | "needs-review";

export interface UploadStatementDTO {
  sourceType?: "BANK_STATEMENT" | "UPI_HISTORY";
  providerName?: string;
  accountId: string;
}

export interface UpdateStagedTransactionDto {
  category?: string;
  accountId?: string;
  amount?: number;
  narration?: string;
  isSelected?: boolean;
  taxTag?: string;
}

export interface StagedTransactionRow {
  id: string;
  batchId: string;
  date: string; // e.g., "01 Apr 2025"
  time: string; // e.g., "10:04 AM"
  entityName: string; // e.g., "TechCorp Solutions India Pvt Ltd"
  narration: string; // e.g., "NEFT-TECHCORP-SAL-APR25-0029148"
  isVerifiedEntity?: boolean;
  isUnknownEntity?: boolean;
  taxBadge?: string; // e.g., "80GG / HRA" | "SIP Direct"
  channel: string; // e.g., "Corp NEFT" | "UPI / GPay"
  utrNumber: string; // e.g., "UTR #CMS8829140"
  category: string | null;
  type: StagedTransactionType;
  amount: number; // Positive number; sign derived from `type` or signed value
  closingBalance?: number;
  auditStatus: StagedAuditStatus;
  duplicateConfidence?: number; // e.g., 98 for "Duplicate (98%)"
  isSelected: boolean;
}

export interface StagedBatchResponse {
  id: string;
  sourceEntity: string; // e.g., "HDFC Bank Ltd. (Salary Account)"
  destinationAccountId: string;
  destinationAccountName: string; // e.g., "HDFC Sal ••4821"
  destinationBalance: number; // e.g., 342150
  fileName: string; // e.g., "HDFC_Stmt_01Apr_15Apr_2025.xlsx"
  fileSizeLabel: string; // e.g., "148 KB"
  mappedColumnsCount: number; // e.g., 9
  totalColumnsCount: number; // e.g., 9
  rows: StagedTransactionRow[];
}

export interface CommitBatchResponse {
  committedCount: number;
  batchId: string;
  message?: string;
}
