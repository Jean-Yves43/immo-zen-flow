// src/features/admin-dashboard/components/AlertCard.jsx
import { Clock } from "lucide-react";
import { Badge } from "../../../components/Badge";

export function AlertCard({ alert }) {
  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      default:
        return "bg-success/10 text-success";
    }
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      high: { text: "Urgent", class: "border-destructive/50 text-destructive" },
      medium: { text: "Attention", class: "border-warning/50 text-warning" },
      low: { text: "Info", class: "border-success/50 text-success" }
    };
    return badges[severity] || badges.low;
  };

  const AlertIcon = alert.icon;
  const badge = getSeverityBadge(alert.severity);

  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityClass(alert.severity)}`}>
        <AlertIcon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium truncate">{alert.title}</p>
          <Badge variant="outline" className={badge.class}>
            {badge.text}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {alert.description}
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {alert.time}
        </p>
      </div>
    </div>
  );
}