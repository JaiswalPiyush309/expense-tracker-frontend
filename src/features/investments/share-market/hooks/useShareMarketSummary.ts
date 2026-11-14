"use client";
import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboardMetrics,
  ShareMarketDashboardResponse,
} from "../api/investments-api";

// ─── useShareMarketSummary ────────────────────────────────────────────────────

interface DashboardState {
  data: ShareMarketDashboardResponse | null;
  isLoading: boolean;
  error: string | null;
}
export function useShareMarketSummary() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const load = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    fetchDashboardMetrics()
      .then((data) => setState({ data, isLoading: false, error: null }))
      .catch((err: unknown) =>
        setState({
          data: null,
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : "Could not load your portfolio summary.",
        }),
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
}
