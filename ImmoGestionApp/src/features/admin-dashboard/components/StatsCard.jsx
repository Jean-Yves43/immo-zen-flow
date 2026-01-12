// src/features/admin-dashboard/components/StatsCard.jsx
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";

export function StatsCard({ title, value, change, trend, icon: Icon, breakdown, delay = 0 }) {
  const isNegativeMetric = title.includes("Retard") || title.includes("Impayé");
  
  const getTrendColor = () => {
    if (trend === "up") {
      return isNegativeMetric ? "text-destructive" : "text-success";
    }
    return "text-success";
  };

  const getIconBg = () => {
    return isNegativeMetric 
      ? "bg-destructive/10 text-destructive" 
      : "bg-primary/10 text-primary";
  };

  return (
    <Card
      className="border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconBg()}`}>
            <Icon className="w-6 h-6" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {change}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground mb-2">{value}</p>
        {breakdown && <p className="text-xs text-muted-foreground">{breakdown}</p>}
      </CardContent>
    </Card>
  );
}