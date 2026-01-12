// src/features/gestionnaire-dashboard/components/KpiCard.jsx
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";

export function KpiCard({ title, value, change, icon: Icon, valueColor, changeColor }) {
  return (
    <Card className="hover-lift">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor || ""}`}>
          {value}
        </div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className={`h-4 w-4 ${changeColor || "text-secondary"}`} />
            <span className={`text-xs font-medium ${changeColor || "text-secondary"}`}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}