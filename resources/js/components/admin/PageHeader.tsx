interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
        )}
      </div>
      {actions && <div className="ml-6 flex items-center gap-3">{actions}</div>}
    </div>
  );
}
