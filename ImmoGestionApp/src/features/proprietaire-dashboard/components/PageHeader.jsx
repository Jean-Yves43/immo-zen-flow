//src/features/proprietaire-dashboard/components/PageHeader.jsx

export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      {action && action}
    </div>
  );
}