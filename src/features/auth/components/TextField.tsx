import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes, ReactNode, useId } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export const TextField = ({
  label,
  icon: Icon,
  error,
  hint,
  trailing,
  id,
  className = "",
  ...input
}: TextFieldProps) => {
  const uid = useId();
  const inputId = id ?? uid;
  const noteId = `${inputId}-note`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? noteId : undefined}
          className={`w-full rounded-lg border bg-white py-2 pl-9 ${trailing ? "pr-9" : "pr-3"} text-base text-slate-900 focus:outline-none focus:ring-1 dark:bg-slate-800/90 dark:text-white sm:text-sm ${
            error
              ? "border-rose-400 focus:ring-rose-500 dark:border-rose-700"
              : "border-slate-200 focus:ring-slate-900 dark:border-slate-700 dark:focus:ring-white"
          } ${className}`}
          {...input}
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {(error || hint) && (
        <p
          id={noteId}
          className={`mt-1 text-[11px] ${error ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
};
