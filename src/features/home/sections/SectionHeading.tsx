export const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="mx-auto mb-12 max-w-2xl text-center">
    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {subtitle}
      </p>
    )}
  </div>
);
