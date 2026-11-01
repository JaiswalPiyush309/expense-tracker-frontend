/** Categorical chart palette: --chart-1..7 in globals.css (light + dark). */
export type ChartColor = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const chartVar = (c: ChartColor) => `var(--chart-${c})`;

/** Literal class names so Tailwind can detect them. */
export const chartBg: Record<ChartColor, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
  6: "bg-chart-6",
  7: "bg-chart-7",
};

/** Default colour for the i-th segment (cycles through the first six). */
export const chartColorAt = (i: number): ChartColor =>
  ((i % 6) + 1) as ChartColor;
