//src/features/proprietaire-dashboard/components/StatCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";

export default function StatCard({ title, value, icon: Icon, valueClassName }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-5 w-5 text-primary" />}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName || ""}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}