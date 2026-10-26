import { HIGHLIGHTS } from "../data/home-content";

export const HighlightsSection = () => (
  <section
    id="highlights"
    className="scroll-mt-20 border-y border-slate-200 bg-white py-16 transition-colors dark:border-slate-800 dark:bg-slate-900/50"
  >
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 lg:grid-cols-4 lg:px-8">
      {HIGHLIGHTS.map((h) => (
        <div key={h.label}>
          <p className="font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white sm:text-4xl">
            {h.value}
          </p>
          <p className="mx-auto mt-1 max-w-[16rem] text-xs text-slate-500 dark:text-slate-400">
            {h.label}
          </p>
        </div>
      ))}
    </div>
  </section>
);
