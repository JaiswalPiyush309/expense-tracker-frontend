"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FAQS } from "../data/home-content";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-20 border-t border-line bg-surface py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Need to know
          </p>
          <h2
            id="faq-heading"
            className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">
            Learn how LedgerFlow handles your records, currency, backups, and
            planned features.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {FAQS.map((faq, index) => {
            const isOpen = open === index;
            const buttonId = `faq-btn-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div key={faq.q} className="border-b border-line last:border-b-0">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-ink transition-colors hover:bg-bg focus-visible:outline focus-visible:outline-inset focus-visible:outline-accent sm:px-6"
                  >
                    <span>{faq.q}</span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 motion-reduce:transition-none ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-4 pb-5 sm:px-6"
                >
                  <p className="text-sm leading-7 text-muted">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Still have questions? Check which features are available in your
          current version before relying on them.
        </p>
      </div>
    </section>
  );
}
