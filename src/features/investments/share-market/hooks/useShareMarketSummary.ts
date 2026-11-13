"use client";
import { useCallback, useEffect, useState } from "react";

export interface PortfolioSummary {
  totalInvestment: number;
  portfolioValue: number;
  totalReturns: number;
  totalReturnsPercent: number;
  todaysPnl: number;
  todaysPnlPercent: number;
  realizedPnl: number;
  unrealizedPnl: number;
}

// TODO: Replace with your real API call, e.g.:
// const response = await fetch('/api/investments/summary');
// const data: PortfolioSummary = await response.json();
const MOCK_SUMMARY: PortfolioSummary = {
  totalInvestment: 500000,
  portfolioValue: 585000,
  totalReturns: 85000,
  totalReturnsPercent: 17.0,
  todaysPnl: 4250,
  todaysPnlPercent: 0.73,
  realizedPnl: 25000,
  unrealizedPnl: 60000,
};

interface State {
  summary: PortfolioSummary | null;
  isLoading: boolean;
  error: string | null;
}

export function useShareMarketSummary() {
  const [state, setState] = useState<State>({
    summary: null,
    isLoading: true,
    error: null,
  });

  const load = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    Promise.resolve(MOCK_SUMMARY)
      .then((summary) => setState({ summary, isLoading: false, error: null }))
      .catch(() =>
        setState({
          summary: null,
          isLoading: false,
          error: "Could not load your portfolio summary.",
        }),
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
}
