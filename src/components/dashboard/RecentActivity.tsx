import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wrench, UserPlus, FileText, CheckCircle } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "payment",
    title: "Paiement reçu",
    description: "Loyer de Marie Martin - Apt 3B",
    time: "Il y a 2 heures",
    icon: CreditCard,
    color: "success",
  },
  {
    id: 2,
    type: "maintenance",
    title: "Demande de maintenance",
    description: "Fuite d'eau - 15 Rue de la Paix",
    time: "Il y a 4 heures",
    icon: Wrench,
    color: "warning",
  },
  {
    id: 3,
    type: "tenant",
    title: "Nouveau locataire",
    description: "Pierre Durand a signé le bail",
    time: "Hier",
    icon: UserPlus,
    color: "primary",
  },
  {
    id: 4,
    type: "document",
    title: "Document généré",
    description: "Quittance de loyer - Juin 2024",
    time: "Hier",
    icon: FileText,
    color: "secondary",
  },
  {
    id: 5,
    type: "maintenance",
    title: "Maintenance terminée",
    description: "Réparation chauffage - Apt 2A",
    time: "Il y a 2 jours",
    icon: CheckCircle,
    color: "success",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-border/50 shadow-soft h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Activité Récente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.color === "success"
                    ? "bg-success/10 text-success"
                    : activity.color === "warning"
                    ? "bg-warning/10 text-warning"
                    : activity.color === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
