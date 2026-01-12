// src/features/gestionnaire-dashboard/pages/ManagerDashboard.jsx
import { Users, Home, CreditCard, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/Chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";

const kpiCards = [
  { title: "Propriétaires gérés", value: "8", change: "+2", icon: Users },
  { title: "Biens sous gestion", value: "45", change: "+5", icon: Home },
  { title: "Paiements ce mois", value: "42/45", change: "93%", icon: CreditCard },
  { title: "Maintenances ouvertes", value: "7", change: "-2", icon: Wrench },
];

const revenueByOwner = [
  { name: "Martin", revenue: 18450 },
  { name: "Durand", revenue: 12300 },
  { name: "Bernard", revenue: 9800 },
  { name: "Petit", revenue: 7500 },
  { name: "Robert", revenue: 5200 },
];

const propertyStatus = [
  { name: "Loués", value: 38, color: "hsl(var(--secondary))" },
  { name: "Vacants", value: 5, color: "hsl(var(--muted))" },
  { name: "En vente", value: 2, color: "hsl(var(--primary))" },
];

const recentAlerts = [
  { type: "payment", message: "Loyer en retard - Jean Dupont", time: "Il y a 2h", urgent: true },
  { type: "maintenance", message: "Urgence plomberie - Apt Victor Hugo", time: "Il y a 4h", urgent: true },
  { type: "owner", message: "Nouveau propriétaire ajouté - M. Robert", time: "Hier", urgent: false },
  { type: "payment", message: "Paiement reçu - Marie Lambert", time: "Hier", urgent: false },
];

export default function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Tableau de bord"
        description="Bienvenue, Marc. Voici un aperçu de votre portefeuille."
        actions={
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Users className="mr-2 h-4 w-4" />
            Ajouter un propriétaire
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par propriétaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{ revenue: { label: "Revenus", color: "hsl(var(--primary))" } }} 
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByOwner}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des biens</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ value: { label: "Biens" } }} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={propertyStatus} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={100} 
                    paddingAngle={5} 
                    dataKey="value"
                  >
                    {propertyStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center gap-6 mt-4">
              {propertyStatus.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  alert.urgent ? "bg-destructive/10" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.urgent && <Badge variant="destructive">Urgent</Badge>}
                  <span className="font-medium text-sm">{alert.message}</span>
                </div>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}