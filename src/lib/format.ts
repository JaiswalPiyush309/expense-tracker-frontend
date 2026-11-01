const inr2 = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const inr0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Split into whole and decimal parts so the decimals can be styled smaller. */
export function splitAmount(value: number) {
  const [whole, decimals] = inr2.format(Math.abs(value)).split(".");
  return { whole, decimals, negative: value < 0 };
}

interface FormatINROptions {
  /** Show +/- in front of the symbol. */
  sign?: boolean;
  /** Show paise (default true). */
  decimals?: boolean;
}

/** 482650 -> "₹4,82,650.00" */
export function formatINR(
  value: number,
  { sign = false, decimals = true }: FormatINROptions = {},
) {
  const body = (decimals ? inr2 : inr0).format(Math.abs(value));
  const prefix = value < 0 ? "-" : sign ? "+" : "";
  return `${prefix}₹${body}`;
}

/** Axis labels: 250000 -> "₹2.5L", 12500 -> "₹12.5K". */
export function formatCompactINR(value: number) {
  const abs = Math.abs(value);
  const trim = (n: number) => String(Number(n.toFixed(1)));
  if (abs >= 100000) return `₹${trim(value / 100000)}L`;
  if (abs >= 1000) return `₹${trim(value / 1000)}K`;
  return `₹${Math.round(value)}`;
}

export function formatPct(value: number, digits = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2025-04-14" -> "14 Apr 2025" (no Date parsing, so no timezone surprises). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}
