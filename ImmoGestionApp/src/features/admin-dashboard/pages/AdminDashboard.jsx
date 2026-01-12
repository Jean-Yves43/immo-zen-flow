// src/features/admin-dashboard/pages/AdminDashboard.jsx
import {
  Users,
  Building2,
  Euro,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CreditCard,
  Wrench,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { StatsCard } from "../components/StatsCard";
import { AlertCard } from "../components/AlertCard";

const kpiData = [
  {
    title: "Total Utilisateurs",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: Users,
    breakdown: "45 Gestionnaires • 128 Propriétaires • 1,111 Locataires",
  },
  {
    title: "Total Propriétés",
    value: "847",
    change: "+8%",
    trend: "up",
    icon: Building2,
    breakdown: "712 Louées • 89 Vacantes • 46 En vente",
  },
  {
    title: "Revenus Mensuels",
    value: "€284,500",
    change: "+15.3%",
    trend: "up",
    icon: Euro,
    breakdown: "Commission moyenne: €285/bien",
  },
  {
    title: "Paiements en Retard",
    value: "23",
    change: "-5",
    trend: "down",
    icon: AlertTriangle,
    breakdown: "Montant total: €18,450",
  },
];

const revenueData = [
  { month: "Jan", revenue: 245000, payments: 238000 },
  { month: "Fév", revenue: 252000, payments: 248000 },
  { month: "Mar", revenue: 268000, payments: 260000 },
  { month: "Avr", revenue: 275000, payments: 270000 },
  { month: "Mai", revenue: 282000, payments: 275000 },
  { month: "Juin", revenue: 284500, payments: 280000 },
];

const propertyStatusData = [
  { name: "Louées", value: 712, color: "hsl(var(--success))" },
  { name: "Vacantes", value: 89, color: "hsl(var(--warning))" },
  { name: "En vente", value: 46, color: "hsl(var(--primary))" },
];

const managerPerformance = [
  { name: "M. Dubois", properties: 45, revenue: 42500 },
  { name: "Mme. Martin", properties: 38, revenue: 36200 },
  { name: "M. Bernard", properties: 52, revenue: 48900 },
  { name: "Mme. Petit", properties: 41, revenue: 39100 },
  { name: "M. Robert", properties: 35, revenue: 33200 },
];

const recentAlerts = [
  {
    id: 1,
    type: "payment",
    title: "Paiement en retard - Apt 12B",
    description: "Locataire: Pierre Durand - 850€ - 5 jours de retard",
    time: "Il y a 2h",
    severity: "high",
    icon: CreditCard,
  },
  {
    id: 2,
    type: "maintenance",
    title: "Urgence maintenance - Villa Les Pins",
    description: "Fuite d'eau signalée - Intervention requise",
    time: "Il y a 3h",
    severity: "high",
    icon: Wrench,
  },
  {
    id: 3,
    type: "user",
    title: "Nouveau propriétaire inscrit",
    description: "Jean-Marc Lefebvre - En attente de validation",
    time: "Il y a 5h",
    severity: "medium",
    icon: UserPlus,
  },
  {
    id: 4,
    type: "payment",
    title: "Paiement reçu - Résidence Étoile",
    description: "Mme. Sophie Lambert - 1,200€",
    time: "Il y a 6h",
    severity: "low",
    icon: CreditCard,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de la plateforme ImmoGestion
          </p>
        </div>
        <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2">
          <TrendingUp className="w-4 h-4" />
          Exporter le rapport
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <StatsCard key={kpi.title} {...kpi} delay={index * 0.1} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-border/50 shadow-soft">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Évolution des Revenus
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Revenus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">Paiements</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `€${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`€${value.toLocaleString()}`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="payments"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    fill="url(#colorPayments)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Property Status Pie Chart */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Statut des Propriétés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {propertyStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
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

      {/* Manager Performance & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manager Performance */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Performance par Gestionnaire
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Voir tout <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={managerPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `€${value / 1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`€${value.toLocaleString()}`, "Revenus"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Alertes & Activité Récente
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Voir tout <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}