/**
 * Semantic colour tones mapped onto your design tokens (globals.css).
 * Full class strings are written out so Tailwind can detect them.
 */
export type Tone = "good" | "bad" | "accent" | "neutral" | "ink";

/** Text colour only. */
export const toneText: Record<Tone, string> = {
  good: "text-good",
  bad: "text-bad",
  accent: "text-accent",
  neutral: "text-muted",
  ink: "text-ink",
};

/** Soft tinted background + matching text (badges, icon tiles). */
export const toneSoft: Record<Tone, string> = {
  good: "bg-good-soft text-good",
  bad: "bg-bad-soft text-bad",
  accent: "bg-accent-soft text-accent",
  neutral: "bg-surface-muted text-muted",
  ink: "bg-surface-muted text-ink",
};

/** Solid fill (progress bars, dots). */
export const toneBar: Record<Tone, string> = {
  good: "bg-good",
  bad: "bg-bad",
  accent: "bg-accent",
  neutral: "bg-muted",
  ink: "bg-ink",
};
