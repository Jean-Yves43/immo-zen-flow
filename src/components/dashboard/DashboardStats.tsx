import { Building, Users, Euro, Wrench, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total Biens",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Building,
    color: "primary",
  },
  {
    title: "Locataires Actifs",
    value: "18",
    change: "+3",
    trend: "up",
    icon: Users,
    color: "secondary",
  },
  {
    title: "Revenus Mensuels",
    value: "14,580€",
    change: "+8.2%",
    trend: "up",
    icon: Euro,
    color: "success",
  },
  {
    title: "Maintenance en cours",
    value: "3",
    change: "-1",
    trend: "down",
    icon: Wrench,
    color: "warning",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="border-border/50 shadow-soft hover:shadow-medium transition-shadow animate-fade-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-success" />
                  )}
                  <span className="text-sm text-success font-medium">{stat.change}</span>
                  <span className="text-xs text-muted-foreground">ce mois</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "primary"
                    ? "bg-primary/10 text-primary"
                    : stat.color === "secondary"
                    ? "bg-secondary/10 text-secondary"
                    : stat.color === "success"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
