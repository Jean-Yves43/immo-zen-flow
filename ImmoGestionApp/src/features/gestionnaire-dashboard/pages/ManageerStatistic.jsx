import { TrendingUp, Home, Euro, Users, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/Select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/Chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";

const revenueByOwner = [
  { name: "Martin", revenue: 18450 },
  { name: "Durand", revenue: 12300 },
  { name: "Bernard", revenue: 9800 },
  { name: "Petit", revenue: 24500 },
  { name: "Robert", revenue: 5200 },
];

const occupancyData = [
  { month: "Jan", rate: 88 },
  { month: "Fév", rate: 90 },
  { month: "Mar", rate: 85 },
  { month: "Avr", rate: 92 },
  { month: "Mai", rate: 95 },
  { month: "Juin", rate: 93 },
];

const paymentStatus = [
  { name: "À temps", value: 42, color: "hsl(var(--secondary))" },
  { name: "En retard", value: 3, color: "hsl(var(--destructive))" },
];

export default function ManagerStatistics() {
  const totalRevenue = revenueByOwner.reduce((sum, d) => sum + d.revenue, 0);
  const avgOccupancy = Math.round(occupancyData.reduce((sum, d) => sum + d.rate, 0) / occupancyData.length);

  const headerActions = (
    <>
      <Select defaultValue="2024">
        <SelectTrigger className="w-[120px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exporter
      </Button>
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Statistiques"
        description="Performance de votre portefeuille"
        actions={headerActions}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          title="Revenus totaux"
          value={`${(totalRevenue / 1000).toFixed(1)}K €`}
          change="+12.5%"
          icon={Euro}
          changeColor="text-secondary"
        />
        <KpiCard
          title="Taux d'occupation"
          value={`${avgOccupancy}%`}
          icon={Home}
        />
        <KpiCard
          title="Propriétaires"
          value={revenueByOwner.length}
          icon={Users}
        />
        <KpiCard
          title="Taux de recouvrement"
          value="93%"
          icon={TrendingUp}
          valueColor="text-secondary"
        />
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
                <BarChart data={revenueByOwner} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux d'occupation</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{ rate: { label: "Taux", color: "hsl(var(--secondary))" } }} 
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyData}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={3} 
                    dot={{ fill: "hsl(var(--secondary))", r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statut des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ChartContainer 
              config={{ value: { label: "Paiements" } }} 
              className="h-[200px] w-full max-w-md"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={paymentStatus} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={80} 
                    paddingAngle={5} 
                    dataKey="value"
                  >
                    {paymentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {paymentStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}