"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ImportFilterTab,
  StagedBatchResponse,
  UpdateStagedTransactionDto,
  UploadStatementDTO,
} from "../types";
import {
  commitStagedBatch,
  fetchStagedBatch,
  patchStagedRow,
  removeStagedRow,
  uploadStatementFile,
} from "../api";

export function useStatementImport(initialBatchId?: string) {
  const [batch, setBatch] = useState<StagedBatchResponse | null>(null);
  const [activeStep, setActiveStep] = useState<number>(initialBatchId ? 5 : 3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [updatingRowId, setUpdatingRowId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commitSuccessMessage, setCommitSuccessMessage] = useState<
    string | null
  >(null);

  // Filters
  const [activeTab, setActiveTab] = useState<ImportFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [channelFilter, setChannelFilter] = useState("ALL");

  // 2. Fetch Staged Batch on mount if batchId is provided
  const loadBatch = useCallback(async (batchId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStagedBatch(batchId);
      setBatch(data);
      setActiveStep(5);
    } catch (err: any) {
      setError(err?.message || "Failed to load staged import batch.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialBatchId) {
      loadBatch(initialBatchId);
    }
  }, [initialBatchId, loadBatch]);

  // 1. Upload CSV/XLSX -> Creates Staged Batch -> Hydrates UI Preview Table
  const handleFileUpload = useCallback(
    async (file: File, dto: UploadStatementDTO) => {
      setIsUploading(true);
      setError(null);
      setCommitSuccessMessage(null);
      try {
        const uploadedBatch = await uploadStatementFile(file, dto);
        // If backend upload returns only `{ id / batchId }` without rows, immediately call GET /batch/:id
        if (uploadedBatch.id && uploadedBatch.rows.length === 0) {
          const fullBatch = await fetchStagedBatch(uploadedBatch.id);
          setBatch(fullBatch);
        } else {
          setBatch(uploadedBatch);
        }
        setActiveStep(5);
      } catch (err: any) {
        setError(err?.message || "Failed to upload and parse statement.");
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  // 3. Edit a single staged row (PATCH /transactions/import/row/:id)
  const handleUpdateRow = useCallback(
    async (rowId: string, dto: UpdateStagedTransactionDto) => {
      if (!batch) return;
      setUpdatingRowId(rowId);
      setError(null);

      // Optimistic UI update
      const previousRows = batch.rows;
      setBatch((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          rows: prev.rows.map((r) => {
            if (r.id !== rowId) return r;
            const nextCategory =
              dto.category !== undefined ? dto.category : r.category;
            const nextStatus =
              nextCategory && r.auditStatus === "NEEDS_REVIEW"
                ? "VALID"
                : r.auditStatus;
            return {
              ...r,
              ...dto,
              category: nextCategory,
              auditStatus: nextStatus,
            };
          }),
        };
      });

      try {
        const updatedRow = await patchStagedRow(rowId, dto);
        setBatch((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            rows: prev.rows.map((r) =>
              r.id === rowId ? { ...r, ...updatedRow } : r,
            ),
          };
        });
      } catch (err: any) {
        // Rollback on failure
        setBatch((prev) => (prev ? { ...prev, rows: previousRows } : prev));
        setError(err?.message || "Failed to update staged transaction row.");
      } finally {
        setUpdatingRowId(null);
      }
    },
    [batch],
  );

  // 4. Delete/discard a single staged row (DELETE /transactions/import/row/:id)
  const handleDeleteRow = useCallback(
    async (rowId: string) => {
      if (!batch) return;
      setUpdatingRowId(rowId);
      setError(null);

      const previousRows = batch.rows;
      setBatch((prev) =>
        prev
          ? { ...prev, rows: prev.rows.filter((r) => r.id !== rowId) }
          : prev,
      );

      try {
        await removeStagedRow(rowId);
      } catch (err: any) {
        setBatch((prev) => (prev ? { ...prev, rows: previousRows } : prev));
        setError(err?.message || "Failed to discard staged row.");
      } finally {
        setUpdatingRowId(null);
      }
    },
    [batch],
  );

  // 5. Commit verified batch (POST /transactions/import/batch/:id/commit)
  const handleCommitBatch = useCallback(async () => {
    if (!batch?.id) return;
    setIsCommitting(true);
    setError(null);
    try {
      const res = await commitStagedBatch(batch.id);
      setCommitSuccessMessage(
        res.message ||
          `Successfully imported ${
            res.committedCount ?? batch.rows.filter((r) => r.isSelected).length
          } transactions into your ledger.`,
      );
    } catch (err: any) {
      setError(err?.message || "Failed to commit staged batch.");
    } finally {
      setIsCommitting(false);
    }
  }, [batch]);

  // Bulk Actions in Toolbar
  const toggleRowSelection = useCallback((rowId: string) => {
    setBatch((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rows: prev.rows.map((r) =>
          r.id === rowId ? { ...r, isSelected: !r.isSelected } : r,
        ),
      };
    });
  }, []);

  const selectAllValid = useCallback(() => {
    setBatch((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rows: prev.rows.map((r) => ({
          ...r,
          isSelected:
            r.auditStatus === "VALID" || r.auditStatus === "VERIFIED_MATCH",
        })),
      };
    });
  }, []);

  const excludeDuplicates = useCallback(async () => {
    if (!batch) return;
    const duplicateRows = batch.rows.filter(
      (r) => r.auditStatus === "DUPLICATE",
    );
    // Deselect immediately and optionally discard via DELETE endpoint
    setBatch((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rows: prev.rows.map((r) =>
          r.auditStatus === "DUPLICATE" ? { ...r, isSelected: false } : r,
        ),
      };
    });
    for (const dup of duplicateRows) {
      try {
        await patchStagedRow(dup.id, { isSelected: false });
      } catch {
        // Ignore individual non-blocking sync errors
      }
    }
  }, [batch]);

  // Computed KPI Metrics matching the 6 cards in the screenshot
  const stats = useMemo(() => {
    const rows = batch?.rows ?? [];
    const totalRecords = rows.length;
    const validRows = rows.filter(
      (r) => r.auditStatus === "VALID" || r.auditStatus === "VERIFIED_MATCH",
    );
    const duplicateRows = rows.filter((r) => r.auditStatus === "DUPLICATE");
    const needsReviewRows = rows.filter(
      (r) => r.auditStatus === "NEEDS_REVIEW",
    );

    const creditRows = rows.filter((r) => r.type === "CREDIT");
    const debitRows = rows.filter((r) => r.type === "DEBIT");

    const totalInflow = creditRows.reduce((acc, r) => acc + r.amount, 0);
    const totalOutflow = debitRows.reduce((acc, r) => acc + r.amount, 0);

    const selectedRows = rows.filter((r) => r.isSelected);
    const netImpact = selectedRows.reduce(
      (acc, r) => acc + (r.type === "CREDIT" ? r.amount : -r.amount),
      0,
    );

    const readyCount = validRows.length;
    const readyPercent =
      totalRecords > 0 ? ((readyCount / totalRecords) * 100).toFixed(1) : "0.0";

    return {
      totalRecords,
      readyCount,
      readyPercent,
      totalInflow,
      creditCount: creditRows.length,
      totalOutflow,
      debitCount: debitRows.length,
      duplicatesCount: duplicateRows.length,
      needsReviewCount: needsReviewRows.length,
      selectedCount: selectedRows.length,
      netImpact,
    };
  }, [batch]);

  // Filtered rows for table
  const filteredRows = useMemo(() => {
    const rows = batch?.rows ?? [];
    return rows.filter((row) => {
      if (activeTab === "valid") {
        if (row.auditStatus !== "VALID" && row.auditStatus !== "VERIFIED_MATCH")
          return false;
      } else if (activeTab === "duplicates") {
        if (row.auditStatus !== "DUPLICATE") return false;
      } else if (activeTab === "needs-review") {
        if (row.auditStatus !== "NEEDS_REVIEW") return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          row.entityName.toLowerCase().includes(q) ||
          row.narration.toLowerCase().includes(q) ||
          row.utrNumber.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (typeFilter !== "ALL" && row.type !== typeFilter) return false;
      if (categoryFilter !== "ALL" && row.category !== categoryFilter)
        return false;
      if (
        channelFilter !== "ALL" &&
        !row.channel.toLowerCase().includes(channelFilter.toLowerCase())
      )
        return false;

      return true;
    });
  }, [
    batch,
    activeTab,
    searchQuery,
    typeFilter,
    categoryFilter,
    channelFilter,
  ]);

  return {
    batch,
    setBatch,
    activeStep,
    setActiveStep,
    isLoading,
    isUploading,
    isCommitting,
    updatingRowId,
    error,
    setError,
    commitSuccessMessage,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    channelFilter,
    setChannelFilter,
    stats,
    filteredRows,
    loadBatch,
    handleFileUpload,
    handleUpdateRow,
    handleDeleteRow,
    handleCommitBatch,
    toggleRowSelection,
    selectAllValid,
    excludeDuplicates,
  };
}
