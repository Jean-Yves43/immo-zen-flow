import {
  TrendingUp,
  Home,
  Euro,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import PageHeader from "../components/PageHeader";
import { 
  revenueDataFull, 
  occupancyDataFull, 
  propertyPerformance, 
  expenseBreakdown 
} from "../api/owner";

export default function OwnerStatistics() {
  const totalRevenue = revenueDataFull.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = revenueDataFull.reduce((sum, d) => sum + d.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  const avgOccupancy = Math.round(
    occupancyDataFull.reduce((sum, d) => sum + d.rate, 0) / occupancyDataFull.length
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
          <p className="text-muted-foreground mt-1">
            Analysez la performance de vos investissements
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-[120px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus annuels
            </CardTitle>
            <Euro className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalRevenue / 1000).toFixed(1)}K €
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-secondary" />
              <span className="text-xs text-secondary font-medium">+12.5%</span>
              <span className="text-xs text-muted-foreground">vs année dernière</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalExpenses / 1000).toFixed(1)}K €
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-4 w-4 text-secondary" />
              <span className="text-xs text-secondary font-medium">-5.2%</span>
              <span className="text-xs text-muted-foreground">vs année dernière</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenu net
            </CardTitle>
            <Euro className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {(netIncome / 1000).toFixed(1)}K €
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-secondary" />
              <span className="text-xs text-secondary font-medium">+15.8%</span>
              <span className="text-xs text-muted-foreground">vs année dernière</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux d'occupation
            </CardTitle>
            <Home className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{avgOccupancy}%</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-secondary" />
              <span className="text-xs text-secondary font-medium">+3%</span>
              <span className="text-xs text-muted-foreground">vs année dernière</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus vs Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenus", color: "hsl(var(--secondary))" },
                expenses: { label: "Dépenses", color: "hsl(var(--destructive))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueDataFull}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Taux d'occupation</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: { label: "Taux", color: "hsl(var(--primary))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyDataFull}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Property Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par bien</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenus", color: "hsl(var(--primary))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyPerformance} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ChartContainer
                config={{
                  value: { label: "Pourcentage" },
                }}
                className="h-[250px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {expenseBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}