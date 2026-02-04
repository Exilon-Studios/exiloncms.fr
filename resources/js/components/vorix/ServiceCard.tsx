/**
 * ServiceCard Component - Placeholder
 */
export default function ServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
