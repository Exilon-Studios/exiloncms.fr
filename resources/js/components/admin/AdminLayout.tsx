import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface AdminLayoutTitleProps {
  title: string;
  description?: string;
  className?: string;
}

interface AdminLayoutActionsProps {
  children: React.ReactNode;
  className?: string;
}

interface AdminLayoutFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {children}
    </div>
  );
}

// Export as default for easier importing
export default AdminLayout;

export function AdminLayoutTitle({ title, description, className }: AdminLayoutTitleProps) {
  return (
    <div className={cn("flex-1", className)}>
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">{description}</p>
      )}
    </div>
  );
}

export function AdminLayoutActions({ children, className }: AdminLayoutActionsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

export function AdminLayoutHeader({ children, className }: AdminLayoutProps) {
  return (
    <div className={cn("flex items-start justify-between gap-6", className)}>
      {children}
    </div>
  );
}

export function AdminLayoutContent({ children, className }: AdminLayoutProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

export function AdminLayoutFooter({ children, className }: AdminLayoutFooterProps) {
  return (
    <div className={cn("flex items-center justify-between pt-6 mt-6", className)}>
      {children}
    </div>
  );
}
