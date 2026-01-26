// src/features/proprietaire-dashboard/pages/OwnerDashboard.jsx
import {
  Home,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/Chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { 
  kpiCards, 
  revenueData, 
  occupancyData, 
  paymentDelayData, 
  recentPayments 
} from "../api/owner";

const iconMap = {
  Home,
  TrendingUp: ArrowUpRight,
  AlertTriangle: ArrowUpRight,
  Wrench: ArrowUpRight,
};

export default function OwnerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue, Pierre. Voici un aperçu de vos biens immobiliers.
          </p>
        </div>
        <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <Home className="mr-2 h-4 w-4" />
          Ajouter un bien
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = iconMap[card.icon] || Home;
          return (
            <Card key={card.title} className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {card.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-secondary" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-secondary" />
                  )}
                  <span className="text-xs text-secondary font-medium">
                    {card.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {card.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Evolution */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenus", color: "hsl(var(--primary))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des biens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ChartContainer
                config={{
                  value: { label: "Biens" },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {occupancyData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Delays & Recent Payments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Delays Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Retards de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                onTime: { label: "À temps", color: "hsl(var(--secondary))" },
                late: { label: "En retard", color: "hsl(var(--destructive))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentDelayData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="onTime" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Derniers paiements</CardTitle>
            <Button variant="outline" size="sm">
              Voir tout
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{payment.tenant}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.property}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount} €</p>
                    <Badge
                      variant={
                        payment.status === "paid"
                          ? "default"
                          : payment.status === "late"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        payment.status === "paid"
                          ? "bg-secondary text-secondary-foreground"
                          : ""
                      }
                    >
                      {payment.status === "paid"
                        ? "Payé"
                        : payment.status === "late"
                        ? "En retard"
                        : "En attente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}