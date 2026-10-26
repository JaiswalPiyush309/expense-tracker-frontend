import { FEATURES } from "../data/home-content";
import { SectionHeading } from "./SectionHeading";

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-label="LedgerFlow features"
      className="scroll-mt-20 bg-bg px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Simple tools for everyday money."
          subtitle="Record what comes in, understand what goes out, and build better money habits without unnecessary complexity."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }, index) => (
            <article
              key={title}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-card motion-reduce:transform-none motion-reduce:transition-none sm:p-7"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>

                <span
                  aria-hidden="true"
                  className="text-xs font-semibold tracking-widest text-muted/70"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mb-3 text-base font-bold tracking-tight text-ink sm:text-lg">
                {title}
              </h3>

              <p className="mb-0 text-sm leading-7 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
