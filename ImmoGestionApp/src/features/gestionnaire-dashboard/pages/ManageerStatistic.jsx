// src/features/gestionnaire-dashboard/pages/ManagerStatistics.jsx
import { useState, useEffect } from "react";
import { TrendingUp, Home, Euro, Users, Calendar, Download, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/Select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/Chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../../../contexts/Authcontext";
import { statsService } from "../api/stats";

export default function ManagerStatistics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [revenus, setRevenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periode, setPeriode] = useState(statsService.PERIODES.MOIS);

  // Charger les statistiques au montage et quand la période change
  useEffect(() => {
    loadData();
  }, [user?.userId, periode]);

  const loadData = async () => {
    if (!user?.userId) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Obtenir les dates selon la période sélectionnée
      const dates = statsService.getDatesForPeriode(periode);
      
      // Charger les statistiques et les revenus en parallèle
      const [statsData, revenusData] = await Promise.all([
        statsService.getStatistiques(user.userId, dates),
        statsService.getRevenus(user.userId, dates)
      ]);
      
      setStats(statsData);
      setRevenus(revenusData.revenus || []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
      setError(err.message || "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  // Exporter le rapport
  const handleExport = () => {
    if (!stats) return;
    
    const rapport = statsService.genererRapport(stats);
    const blob = new Blob([rapport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-statistiques-${periode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Statistiques"
          description="Performance de votre portefeuille"
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
  const paiementsChartData = statsService.getPaiementsChartData(stats);
  const maintenancesChartData = statsService.getMaintenancesChartData(stats);
  const revenusChartData = statsService.getRevenusChartData(revenus);

  const headerActions = (
    <>
      <Select value={periode} onValueChange={setPeriode}>
        <SelectTrigger className="w-[150px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={statsService.PERIODES.AUJOURD_HUI}>Aujourd'hui</SelectItem>
          <SelectItem value={statsService.PERIODES.SEMAINE}>Cette semaine</SelectItem>
          <SelectItem value={statsService.PERIODES.MOIS}>Ce mois</SelectItem>
          <SelectItem value={statsService.PERIODES.TRIMESTRE}>Ce trimestre</SelectItem>
          <SelectItem value={statsService.PERIODES.ANNEE}>Cette année</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleExport}>
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

      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          title="Biens totaux"
          value={stats.totalBiens || 0}
          change={`${stats.totalBiensLoues || 0} loués`}
          icon={Home}
        />
        <KpiCard
          title="Taux d'occupation"
          value={`${statsService.getTauxOccupation(stats).toFixed(1)}%`}
          icon={TrendingUp}
          valueColor={statsService.getOccupationColor(statsService.getTauxOccupation(stats))}
        />
        <KpiCard
          title="Propriétaires"
          value={stats.totalProprietaires || 0}
          icon={Users}
        />
        <KpiCard
          title="Taux de recouvrement"
          value={`${(stats.tauxRecouvrement || 0).toFixed(1)}%`}
          icon={Euro}
          valueColor={statsService.getRecouvrementColor(stats.tauxRecouvrement || 0)}
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenus par propriétaire - données de l'API */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus par propriétaire (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            {revenusChartData.length > 0 ? (
              <ChartContainer 
                config={{ revenue: { label: "Revenus", color: "hsl(var(--primary))" } }} 
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenusChartData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
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
                <ChartContainer config={{ value: { label: "Biens" } }} className="h-[300px]">
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
                <div className="flex justify-center gap-6 mt-4 flex-wrap">
                  {biensChartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({item.value}) - {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Aucune donnée de biens disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Graphiques secondaires */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Statut des paiements */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            {paiementsChartData.length > 0 ? (
              <>
                <ChartContainer config={{ value: { label: "Paiements" } }} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={paiementsChartData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={50} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                      >
                        {paiementsChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {paiementsChartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({item.value}) - {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Aucune donnée de paiements disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statut des maintenances */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des maintenances</CardTitle>
          </CardHeader>
          <CardContent>
            {maintenancesChartData.length > 0 ? (
              <>
                <ChartContainer config={{ value: { label: "Maintenances" } }} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maintenancesChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {maintenancesChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                  {maintenancesChartData.map((item) => (
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
                Aucune donnée de maintenances disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analyse détaillée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Analyse de la période
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(statsService.getAnalyse(stats)).map(([key, analyse]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg border-2 ${
                  analyse.status === 'success' 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : analyse.status === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <h4 className="font-semibold mb-2 capitalize">{key}</h4>
                <p className={`text-sm ${
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

      {/* Détails numériques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Biens disponibles</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalBiensDisponibles || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Locataires actifs</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalLocataires || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Paiements effectués</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalPaiementsEffectues || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Maintenances terminées</p>
              <p className="text-3xl font-bold text-secondary">{stats.maintenancesTerminees || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}