"use client";

/**
 * PageLoader — Full-screen app-level loading screen for LedgerFlow.
 *
 * Shows:
 *  - Animated brand logo with pulsing ring
 *  - Finance-themed animated bar chart (rising bars)
 *  - Flowing ticker strip (mocked indices)
 *  - Optional status message
 *
 * Usage:
 *   <PageLoader />
 *   <PageLoader message="Syncing your portfolio…" />
 */

import { cn } from "@/lib/cn";

interface PageLoaderProps {
  /** Optional status message shown below the logo */
  message?: string;
  className?: string;
}

const BARS = [
  { delay: "0ms",   height: "30%" },
  { delay: "120ms", height: "55%" },
  { delay: "240ms", height: "45%" },
  { delay: "360ms", height: "75%" },
  { delay: "480ms", height: "60%" },
  { delay: "600ms", height: "85%" },
  { delay: "720ms", height: "50%" },
];

const TICKER_ITEMS = [
  { label: "NIFTY 50",  value: "22,485",  up: true  },
  { label: "SENSEX",    value: "74,119",  up: true  },
  { label: "NIFTY IT",  value: "35,420",  up: true  },
  { label: "NIFTY BANK",value: "48,125",  up: false },
  { label: "MIDCAP 100",value: "49,850",  up: true  },
  { label: "GOLD",      value: "₹72,480", up: true  },
  { label: "USD/INR",   value: "₹83.42",  up: false },
];

export function PageLoader({ message, className }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-label={message ?? "Loading LedgerFlow…"}
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10",
        "bg-bg",
        className,
      )}
    >
      {/* ── Brand + Animated Ring ───────────────────────────────────── */}
      <div className="relative flex items-center justify-center">
        {/* Outer slow-spin ring */}
        <svg
          className="absolute animate-spin"
          style={{ animationDuration: "3s" }}
          width="88"
          height="88"
          viewBox="0 0 88 88"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="44"
            cy="44"
            r="40"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="62 190"
            opacity="0.5"
          />
        </svg>

        {/* Inner counter-spin ring */}
        <svg
          className="absolute"
          style={{
            animation: "spin 2s linear infinite reverse",
          }}
          width="70"
          height="70"
          viewBox="0 0 70 70"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="35"
            cy="35"
            r="30"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="20 170"
            opacity="0.25"
          />
        </svg>

        {/* Brand mark */}
        <div
          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black tracking-tighter text-white shadow-lg"
          style={{ background: "var(--accent)" }}
        >
          LF
        </div>
      </div>

      {/* ── Animated Bar Chart ──────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-end gap-1.5"
          style={{ height: 48 }}
          aria-hidden="true"
        >
          {BARS.map((bar, i) => (
            <div
              key={i}
              className="w-3 rounded-t-sm"
              style={{
                height: bar.height,
                background: "var(--accent)",
                opacity: 0.15 + i * 0.12,
                animation: `ledger-bar-bounce 1.2s ease-in-out infinite alternate`,
                animationDelay: bar.delay,
              }}
            />
          ))}
        </div>

        {/* Brand name */}
        <span
          className="text-sm font-bold tracking-widest uppercase"
          style={{ color: "var(--muted)", letterSpacing: "0.18em" }}
        >
          Ledger Flow
        </span>

        {/* Status message */}
        {message && (
          <p
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            {message}
          </p>
        )}
      </div>

      {/* ── Ticker Strip ────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden border-t py-2"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        aria-hidden="true"
      >
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{ animation: "ledger-ticker 18s linear infinite" }}
        >
          {/* Duplicate for seamless loop */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <span style={{ color: "var(--muted)" }}>{item.label}</span>
              <span style={{ color: "var(--ink)" }}>{item.value}</span>
              <span
                style={{
                  color: item.up ? "var(--good)" : "var(--bad)",
                  fontSize: "10px",
                }}
              >
                {item.up ? "▲" : "▼"}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes ledger-bar-bounce {
          from { transform: scaleY(0.4); opacity: 0.3; }
          to   { transform: scaleY(1);   opacity: 1;   }
        }
        @keyframes ledger-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
