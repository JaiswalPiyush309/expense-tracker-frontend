// India-only money helpers. Amounts are plain numbers in rupees.
const inr0 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const inr2 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₹1,23,456 (or ₹1,23,456.50 with decimals) – uses lakh/crore grouping */
export const formatINR = (n: number, decimals = false) =>
  (decimals ? inr2 : inr0).format(n);

/** ₹4.5K · ₹12.5L · ₹1.2Cr – for tight spaces like chart labels and stat cards */
export function formatINRCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const trim = (v: number) => Number(v.toFixed(2));
  if (abs >= 1e7) return `${sign}₹${trim(abs / 1e7)}Cr`;
  if (abs >= 1e5) return `${sign}₹${trim(abs / 1e5)}L`;
  if (abs >= 1e4) return `${sign}₹${trim(abs / 1e3)}K`;
  return formatINR(n);
}

/** "₹1,200" or "1,200.50" -> 1200.5 (NaN if invalid) */
export const parseINR = (s: string) => Number(s.replace(/[₹,\s]/g, ""));
