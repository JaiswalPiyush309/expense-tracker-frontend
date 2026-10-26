import { AuthMode } from "@/features/auth/types";
import { SectionHeading } from "./SectionHeading";
import { PLANS } from "../data/home-content";
import { PricingCard } from "../components/PricingCard";

interface PricingSectionProps {
  onOpenApp: () => void;
  onOpenAuth: (mode?: AuthMode) => void;
}

export function PricingSection({ onOpenApp, onOpenAuth }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="scroll-mt-20 border-t border-line bg-bg px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Straightforward pricing."
          subtitle="Start with the free tracker. Additional paid features are planned for the future."
        />

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {PLANS.map((plan) => {
            const handleSelect =
              plan.cta.action === "app"
                ? onOpenApp
                : () => onOpenAuth("signup");

            return (
              <PricingCard
                key={plan.name}
                plan={plan}
                onSelect={handleSelect}
              />
            );
          })}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-6 text-muted">
          Planned features and prices are indicative only. A paid plan is not
          available for purchase unless explicitly enabled in the application.
        </p>
      </div>
    </section>
  );
}
