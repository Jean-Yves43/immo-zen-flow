import {
  Euro,
  Calendar,
  Home,
  Bell,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const kpiCards = [
  {
    title: "Loyer mensuel",
    value: "850€",
    status: "Payé",
    statusColor: "success",
    icon: Euro,
    iconColor: "bg-secondary/10 text-secondary",
  },
  {
    title: "Prochaine échéance",
    value: "1er Février",
    status: "Dans 24 jours",
    statusColor: "warning",
    icon: Calendar,
    iconColor: "bg-warning/10 text-warning",
  },
  {
    title: "Mon logement",
    value: "Apt. Montmartre",
    status: "3 pièces • 65m²",
    statusColor: "muted",
    icon: Home,
    iconColor: "bg-primary/10 text-primary",
  },
  {
    title: "Notifications",
    value: "3",
    status: "Non lues",
    statusColor: "destructive",
    icon: Bell,
    iconColor: "bg-destructive/10 text-destructive",
  },
];

const recentPayments = [
  {
    id: 1,
    month: "Janvier 2024",
    amount: "850€",
    date: "02/01/2024",
    status: "paid",
  },
  {
    id: 2,
    month: "Décembre 2023",
    amount: "850€",
    date: "01/12/2023",
    status: "paid",
  },
  {
    id: 3,
    month: "Novembre 2023",
    amount: "850€",
    date: "01/11/2023",
    status: "paid",
  },
  {
    id: 4,
    month: "Février 2024",
    amount: "850€",
    date: "01/02/2024",
    status: "upcoming",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Payé
        </Badge>
      );
    case "upcoming":
      return (
        <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">
          <Clock className="w-3 h-3 mr-1" />
          À venir
        </Badge>
      );
    case "late":
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          En retard
        </Badge>
      );
    default:
      return null;
  }
};

export default function TenantDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bonjour, Marie 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre situation locative
          </p>
        </div>
        <Button
          asChild
          className="bg-secondary hover:bg-secondary-light text-white shadow-glow transition-all hover:scale-105"
        >
          <Link to="/tenant/paiements">
            <Euro className="w-4 h-4 mr-2" />
            Payer mon loyer
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <Card
            key={card.title}
            className="border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      card.statusColor === "success"
                        ? "bg-success/10 text-success border-success/20"
                        : card.statusColor === "warning"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : card.statusColor === "destructive"
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {card.status}
                  </Badge>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconColor}`}
                >
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payments */}
        <Card className="lg:col-span-2 border-border/50 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Historique des paiements
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tenant/recus">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment, index) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Euro className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {payment.month}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-foreground">
                      {payment.amount}
                    </span>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-all"
              asChild
            >
              <Link to="/tenant/maintenance">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-warning" />
                </div>
                Signaler un problème
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-all"
              asChild
            >
              <Link to="/tenant/recus">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                Télécharger mes reçus
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-all"
              asChild
            >
              <Link to="/tenant/logement">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Home className="w-4 h-4 text-secondary" />
                </div>
                Voir mon logement
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
