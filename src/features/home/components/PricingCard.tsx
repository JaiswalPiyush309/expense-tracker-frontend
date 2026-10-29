import { formatINR } from "@/lib/currency";
import { Plan } from "../data/home-content";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const PricingCard = ({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: () => void;
}) => (
  <article
    className={`flex flex-col justify-between rounded-xl bg-white p-7 dark:bg-slate-900 ${
      plan.featured
        ? "border-2 border-slate-900 shadow-xs dark:border-slate-100"
        : "border border-slate-200 dark:border-slate-800"
    }`}
  >
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {plan.name}
        </h3>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100">
          {plan.badge}
        </span>
      </div>
      <p className="font-mono text-3xl font-bold text-slate-900 dark:text-white">
        {formatINR(plan.price)}{" "}
        <span className="font-sans text-xs font-normal text-slate-500 dark:text-slate-400">
          / month
        </span>
      </p>
      <p className="text-xs text-slate-600 dark:text-slate-400">{plan.blurb}</p>
      <ul className="space-y-2.5 border-t border-slate-100 pt-2 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <Check
              className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />{" "}
            {f}
          </li>
        ))}
      </ul>
    </div>
    <Button
      variant={plan.featured ? "primary" : "soft"}
      onClick={onSelect}
      className="mt-8 w-full py-2.5"
    >
      {plan.cta.label}
    </Button>
  </article>
);
