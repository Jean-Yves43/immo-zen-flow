// src/features/gestionnaire-dashboard/pages/ManagerDashboard.jsx
import { useState, useEffect } from "react";
import { Users, Home, CreditCard, Wrench, Loader2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/Chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../../../contexts/Authcontext";
import { statsService } from "../api/stats";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [revenus, setRevenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les statistiques et revenus au montage
  useEffect(() => {
    loadData();
  }, [user?.userId]);

  const loadData = async () => {
    if (!user?.userId) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Charger les statistiques et les revenus en parallèle
      const [statsData, revenusData] = await Promise.all([
        statsService.getStatistiques(user.userId),
        statsService.getRevenus(user.userId)
      ]);
      
      setStats(statsData);
      setRevenus(revenusData.revenus || []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Tableau de bord"
          description="Bienvenue. Voici un aperçu de votre portefeuille."
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <Button 
                onClick={() => loadData()} 
                variant="outline"
              >
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  // Préparer les données pour les graphiques
  const biensChartData = statsService.getBiensChartData(stats);
  const revenusChartData = statsService.getRevenusChartData(revenus);

  // KPIs
  const kpiCards = [
    { 
      title: "Biens gérés", 
      value: stats.totalBiens || 0,
      change: `${stats.totalBiensLoues || 0} loués`,
      icon: Home
    },
    { 
      title: "Taux d'occupation", 
      value: `${statsService.getTauxOccupation(stats).toFixed(1)}%`,
      icon: TrendingUp,
      valueColor: statsService.getOccupationColor(statsService.getTauxOccupation(stats))
    },
    { 
      title: "Taux de recouvrement", 
      value: `${(stats.tauxRecouvrement || 0).toFixed(1)}%`,
      icon: CreditCard,
      valueColor: statsService.getRecouvrementColor(stats.tauxRecouvrement || 0)
    },
    { 
      title: "Maintenances actives", 
      value: (stats.maintenancesEnCours || 0) + (stats.maintenancesEnAttente || 0),
      change: `${stats.maintenancesEnAttente || 0} en attente`,
      icon: Wrench
    },
  ];

  // Alertes récentes (générées depuis les stats)
  const recentAlerts = [];
  
  if (stats.totalPaiementsAttendus > 5) {
    recentAlerts.push({
      type: "payment",
      message: `${stats.totalPaiementsAttendus} paiements en attente`,
      time: "Aujourd'hui",
      urgent: stats.totalPaiementsAttendus > 10
    });
  }

  if (stats.maintenancesEnAttente > 3) {
    recentAlerts.push({
      type: "maintenance",
      message: `${stats.maintenancesEnAttente} demandes de maintenance en attente`,
      time: "Aujourd'hui",
      urgent: stats.maintenancesEnAttente > 5
    });
  }

  if (stats.totalBiensDisponibles > 3) {
    recentAlerts.push({
      type: "property",
      message: `${stats.totalBiensDisponibles} biens disponibles à la location`,
      time: "Aujourd'hui",
      urgent: false
    });
  }

  if (statsService.getTauxOccupation(stats) < 60) {
    recentAlerts.push({
      type: "warning",
      message: "Taux d'occupation faible - Action recommandée",
      time: "Aujourd'hui",
      urgent: true
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Tableau de bord"
        description={`Bienvenue${user?.nom ? ', ' + user.nom : ''}. Voici un aperçu de votre portefeuille.`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenus par propriétaire - données de l'API */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus par propriétaire (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            {revenusChartData.length > 0 ? (
              <div style={{ width: '100%', height: 300 }}>
                <ChartContainer 
                  config={{ revenue: { label: "Revenus", color: "hsl(var(--primary))" } }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenusChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Aucune donnée de revenus disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Répartition des biens */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des biens</CardTitle>
          </CardHeader>
          <CardContent>
            {biensChartData.length > 0 ? (
              <>
                <div style={{ width: '100%', height: 250 }}>
                  <ChartContainer config={{ value: { label: "Biens" } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={biensChartData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={60} 
                          outerRadius={100} 
                          paddingAngle={5} 
                          dataKey="value"
                        >
                          {biensChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {biensChartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Aucune donnée de biens disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertes et notifications */}
      {recentAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertes et notifications</CardTitle>
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
      )}

      {/* Analyse rapide */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(statsService.getAnalyse(stats)).map(([key, analyse]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg border ${
                  analyse.status === 'success' 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : analyse.status === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <p className={`text-sm font-medium ${
                  analyse.status === 'success' 
                    ? 'text-green-700' 
                    : analyse.status === 'warning'
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}>
                  {analyse.message}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}