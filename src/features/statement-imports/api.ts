import {
  CommitBatchResponse,
  StagedBatchResponse,
  StagedTransactionRow,
  UpdateStagedTransactionDto,
  UploadStatementDTO,
} from "./types";
import { getApiBaseUrl } from "@/lib/api-config";
import { getAccessToken } from "@/lib/storage";

function getAuthHeaders(isMultipart = false): HeadersInit {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

/**
 * Normalizes raw backend row payloads into the strict UI StagedTransactionRow contract
 */
function normalizeRow(raw: any): StagedTransactionRow {
  const rawStatus = String(
    raw.auditStatus || raw.status || "VALID",
  ).toUpperCase();

  let auditStatus: StagedTransactionRow["auditStatus"] = "VALID";
  if (rawStatus.includes("VERIFIED")) auditStatus = "VERIFIED_MATCH";
  else if (rawStatus.includes("DUP")) auditStatus = "DUPLICATE";
  else if (rawStatus.includes("REVIEW") || !raw.category)
    auditStatus = "NEEDS_REVIEW";

  const numericAmount = Number(raw.amount ?? 0);
  const type: "CREDIT" | "DEBIT" =
    raw.type === "CREDIT" ||
    raw.type === "INCOME" ||
    (numericAmount > 0 && raw.isCredit)
      ? "CREDIT"
      : raw.type === "DEBIT" || raw.type === "EXPENSE"
        ? "DEBIT"
        : numericAmount >= 0 && raw.direction === "IN"
          ? "CREDIT"
          : "DEBIT";

  return {
    id: String(raw.id),
    batchId: String(raw.batchId ?? ""),
    date: raw.date || raw.transactionDate || "01 Apr 2025",
    time: raw.time || raw.transactionTime || "10:00 AM",
    entityName:
      raw.entityName || raw.merchant || raw.payee || "Parsed Counterparty",
    narration: raw.narration || raw.description || raw.rawNarration || "",
    isVerifiedEntity: Boolean(
      raw.isVerifiedEntity ?? auditStatus === "VERIFIED_MATCH",
    ),
    isUnknownEntity: Boolean(
      raw.isUnknownEntity ?? auditStatus === "NEEDS_REVIEW",
    ),
    taxBadge: raw.taxBadge || raw.taxTag || undefined,
    channel: raw.channel || raw.paymentMode || "UPI / NEFT",
    utrNumber: raw.utrNumber || raw.referenceNumber || "Ref #N/A",
    category: raw.category ?? null,
    type,
    amount: Math.abs(numericAmount),
    closingBalance:
      raw.closingBalance !== undefined ? Number(raw.closingBalance) : undefined,
    auditStatus,
    duplicateConfidence: raw.duplicateConfidence
      ? Number(raw.duplicateConfidence)
      : auditStatus === "DUPLICATE"
        ? 98
        : undefined,
    isSelected:
      raw.isSelected !== undefined
        ? Boolean(raw.isSelected)
        : auditStatus !== "DUPLICATE",
  };
}

/**
 * Normalizes the batch payload from GET /transactions/import/batch/:id or POST /upload
 */
export function normalizeBatchResponse(raw: any): StagedBatchResponse {
  const rawRows = Array.isArray(raw?.rows)
    ? raw.rows
    : Array.isArray(raw?.transactions)
      ? raw.transactions
    : Array.isArray(raw?.stagedTransactions)
      ? raw.stagedTransactions
      : Array.isArray(raw?.records)
        ? raw.records
      : [];

  return {
    id: String(raw?.id || raw?.batchId || ""),
    sourceType: raw?.sourceType === "UPI" ? "UPI" : "BANK",
    upiApp: raw?.upiApp ?? null,
    bankCode: raw?.bankCode ?? null,
    sourceEntity:
      raw?.sourceEntity ||
      raw?.providerName ||
      "HDFC Bank Ltd. (Salary Account)",
    destinationAccountId: String(
      raw?.destinationAccountId || raw?.accountId || "hdfc-4821",
    ),
    destinationAccountName: raw?.destinationAccountName || "HDFC Sal ••4821",
    destinationBalance: Number(raw?.destinationBalance ?? 342150),
    fileName: raw?.fileName || raw?.originalName || "Statement_Import.xlsx",
    fileSizeLabel: raw?.fileSizeLabel || "148 KB",
    mappedColumnsCount: Number(raw?.mappedColumnsCount ?? 9),
    totalColumnsCount: Number(raw?.totalColumnsCount ?? 9),
    rows: rawRows.map(normalizeRow),
  };
}

// 1. POST /transactions/import/upload
export async function uploadStatementFile(
  file: File,
  dto: UploadStatementDTO,
): Promise<StagedBatchResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sourceType", dto.sourceType);
  if (dto.upiApp) formData.append("upiApp", dto.upiApp);
  if (dto.bankCode) formData.append("bankCode", dto.bankCode);

  const response = await fetch(`${getApiBaseUrl()}/transactions/import/upload`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Upload failed (${response.status})`);
  }

  const data = await response.json();
  return normalizeBatchResponse(data);
}

// 2. GET /transactions/import/batch/:id
export async function fetchStagedBatch(
  batchId: string,
): Promise<StagedBatchResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/transactions/import/batch/${batchId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Failed to fetch batch (${response.status})`);
  }

  const data = await response.json();
  return normalizeBatchResponse(data);
}

// 3. PATCH /transactions/import/row/:id
export async function patchStagedRow(
  rowId: string,
  dto: UpdateStagedTransactionDto,
): Promise<StagedTransactionRow> {
  const response = await fetch(
    `${getApiBaseUrl()}/transactions/import/row/${rowId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(dto),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Failed to update row (${response.status})`);
  }

  const data = await response.json();
  return normalizeRow(data);
}

// 4. DELETE /transactions/import/row/:id
export async function removeStagedRow(rowId: string): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/transactions/import/row/${rowId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Failed to delete row (${response.status})`);
  }
}

// 5. POST /transactions/import/batch/:id/commit
export async function commitStagedBatch(
  batchId: string,
): Promise<CommitBatchResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/transactions/import/batch/${batchId}/commit`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Failed to commit batch (${response.status})`);
  }

  return response.json();
}
