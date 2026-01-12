// src/features/admin-dashboard/pages/AdminStatistics.jsx
import { useState } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  Euro,
  Building2,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const revenueByManager = [
  { name: "P. Dubois", revenue: 42500, target: 45000 },
  { name: "M. Martin", revenue: 36200, target: 35000 },
  { name: "J. Bernard", revenue: 48900, target: 50000 },
  { name: "S. Petit", revenue: 39100, target: 40000 },
  { name: "L. Robert", revenue: 33200, target: 38000 },
];

const occupancyByArea = [
  { area: "Paris", rate: 94 },
  { area: "Lyon", rate: 88 },
  { area: "Marseille", rate: 82 },
  { area: "Nice", rate: 91 },
  { area: "Bordeaux", rate: 86 },
  { area: "Nantes", rate: 79 },
];

const latePaymentsData = [
  { month: "Jan", count: 12, amount: 8500 },
  { month: "Fév", count: 15, amount: 10200 },
  { month: "Mar", count: 10, amount: 7800 },
  { month: "Avr", count: 18, amount: 12500 },
  { month: "Mai", count: 14, amount: 9800 },
  { month: "Juin", count: 11, amount: 8100 },
];

const propertyPerformance = [
  { type: "Appartements", revenue: 125000, count: 245 },
  { type: "Maisons", revenue: 85000, count: 78 },
  { type: "Villas", revenue: 62000, count: 25 },
  { type: "Studios", revenue: 45000, count: 120 },
  { type: "Lofts", revenue: 32000, count: 18 },
];

const monthlyTrends = [
  { month: "Jan", revenue: 245000, occupancy: 89 },
  { month: "Fév", revenue: 252000, occupancy: 90 },
  { month: "Mar", revenue: 268000, occupancy: 91 },
  { month: "Avr", revenue: 275000, occupancy: 92 },
  { month: "Mai", revenue: 282000, occupancy: 93 },
  { month: "Juin", revenue: 284500, occupancy: 94 },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
];

export default function AdminStatistics() {
  const [dateRange, setDateRange] = useState("6months");

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Statistiques & Rapports</h1>
          <p className="text-muted-foreground">
            Analyses avancées et indicateurs de performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 mois</SelectItem>
              <SelectItem value="3months">3 mois</SelectItem>
              <SelectItem value="6months">6 mois</SelectItem>
              <SelectItem value="1year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2">
            <Download className="w-4 h-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Euro className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenus totaux</p>
                <p className="text-xl font-bold">€1,606,500</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux d'occupation</p>
                <p className="text-xl font-bold">89.5%</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2.3%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux locataires</p>
                <p className="text-xl font-bold">127</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Impayés</p>
                <p className="text-xl font-bold">€56,900</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> -8.2%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Manager */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Revenus par Gestionnaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByManager} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `€${value / 1000}k`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`€${value.toLocaleString()}`, ""]}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Réalisé" />
                  <Bar dataKey="target" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} name="Objectif" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Réalisé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-sm text-muted-foreground">Objectif</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy by Area */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Taux d'Occupation par Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyByArea}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="area"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Occupation"]}
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {occupancyByArea.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.rate >= 90 ? "hsl(var(--success))" : entry.rate >= 80 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Late Payments Analysis */}
        <Card className="lg:col-span-2 border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Analyse des Retards de Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latePaymentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `€${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="count" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ fill: "hsl(var(--destructive))" }} name="Nombre" />
                  <Line yAxisId="right" type="monotone" dataKey="amount" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ fill: "hsl(var(--warning))" }} name="Montant (€)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Nombre de retards</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-sm text-muted-foreground">Montant total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Performance Pie */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Performance par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="revenue"
                  >
                    {propertyPerformance.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`€${value.toLocaleString()}`, "Revenus"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {propertyPerformance.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{item.type}</span>
                  </div>
                  <span className="font-medium">€{(item.revenue / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Tendances Mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorRevenueStats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `€${value / 1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenueStats)" name="Revenus (€)" />
                <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ fill: "hsl(var(--secondary))" }} name="Occupation (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Revenus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-sm text-muted-foreground">Taux d'occupation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}