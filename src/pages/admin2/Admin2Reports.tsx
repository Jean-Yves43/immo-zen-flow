import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingUp, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Users, Building2, FileText,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

// Data arrays
const monthlyData = [
  { month: "Jan", paiements: 125000, locataires: 120, proprietes: 85 },
  { month: "Fév", paiements: 132000, locataires: 125, proprietes: 88 },
  { month: "Mar", paiements: 145000, locataires: 135, proprietes: 92 },
  { month: "Avr", paiements: 138000, locataires: 140, proprietes: 95 },
  { month: "Mai", paiements: 152000, locataires: 148, proprietes: 98 },
  { month: "Jun", paiements: 168000, locataires: 155, proprietes: 102 },
  { month: "Jul", paiements: 175000, locataires: 160, proprietes: 108 },
  { month: "Aoû", paiements: 162000, locataires: 158, proprietes: 112 },
  { month: "Sep", paiements: 185000, locataires: 168, proprietes: 118 },
  { month: "Oct", paiements: 192000, locataires: 175, proprietes: 125 },
  { month: "Nov", paiements: 205000, locataires: 182, proprietes: 130 },
  { month: "Déc", paiements: 218000, locataires: 190, proprietes: 138 },
];

const yearlyData = [
  { year: "2020", revenus: 1250000, depenses: 450000, benefice: 800000 },
  { year: "2021", revenus: 1580000, depenses: 520000, benefice: 1060000 },
  { year: "2022", revenus: 1920000, depenses: 620000, benefice: 1300000 },
  { year: "2023", revenus: 2350000, depenses: 750000, benefice: 1600000 },
  { year: "2024", revenus: 2890000, depenses: 880000, benefice: 2010000 },
];

const paymentMethodsData = [
  { name: "Carte bancaire", value: 45, color: "#10b981" },
  { name: "Virement", value: 30, color: "#3b82f6" },
  { name: "Prélèvement", value: 20, color: "#8b5cf6" },
  { name: "Chèque", value: 5, color: "#f59e0b" },
];

const paymentStatusData = [
  { name: "À temps", value: 78, color: "#10b981" },
  { name: "En retard", value: 15, color: "#f59e0b" },
  { name: "Impayés", value: 7, color: "#ef4444" },
];

const globalStats = [
  { title: "Revenus Totaux 2024", value: "€2,890,000", change: "+23%", trend: "up", icon: DollarSign },
  { title: "Paiements ce mois", value: "€218,000", change: "+6.3%", trend: "up", icon: TrendingUp },
  { title: "Nouveaux Locataires", value: "190", change: "+4.4%", trend: "up", icon: Users },
  { title: "Propriétés Gérées", value: "138", change: "+6.2%", trend: "up", icon: Building2 },
];

const routeToTab: Record<string, string> = {
  "/admin2/reports": "monthly",
  "/admin2/reports/monthly": "monthly",
  "/admin2/reports/yearly": "yearly",
};

export default function Admin2Reports() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("monthly");

  useEffect(() => {
    const tab = routeToTab[location.pathname] || "monthly";
    setActiveTab(tab);
  }, [location.pathname]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Rapports & Statistiques</h1>
          <p className="text-slate-400 mt-1">Analysez les performances de votre plateforme</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm px-4 py-2">
          <Calendar className="w-4 h-4 mr-2" />Données mises à jour il y a 5 min
        </Badge>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalStats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500"><stat.icon className="w-6 h-6 text-white" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="monthly" className="data-[state=active]:bg-emerald-500">Mensuel</TabsTrigger>
          <TabsTrigger value="yearly" className="data-[state=active]:bg-emerald-500">Annuel</TabsTrigger>
          <TabsTrigger value="global" className="data-[state=active]:bg-emerald-500">Statistiques Globales</TabsTrigger>
        </TabsList>

        {/* Monthly */}
        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-400" />Paiements Mensuels 2024</CardTitle></CardHeader>
              <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} formatter={(value: number) => [`€${value.toLocaleString()}`, "Paiements"]} /><Bar dataKey="paiements" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} /><defs><linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs></BarChart></ResponsiveContainer></div></CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-400" />Croissance Locataires & Propriétés</CardTitle></CardHeader>
              <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} /><Line type="monotone" dataKey="locataires" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} /><Line type="monotone" dataKey="proprietes" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} /></LineChart></ResponsiveContainer></div><div className="flex justify-center gap-8 mt-4"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-sm text-slate-400">Locataires</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500" /><span className="text-sm text-slate-400">Propriétés</span></div></div></CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader><CardTitle className="text-white">Répartition des Moyens de Paiement</CardTitle></CardHeader>
              <CardContent><div className="h-64 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={paymentMethodsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">{paymentMethodsData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} formatter={(value: number) => [`${value}%`, ""]} /></PieChart></ResponsiveContainer></div><div className="flex flex-wrap justify-center gap-4 mt-4">{paymentMethodsData.map((item, index) => (<div key={index} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-sm text-slate-400">{item.name} ({item.value}%)</span></div>))}</div></CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader><CardTitle className="text-white">Statut des Paiements</CardTitle></CardHeader>
              <CardContent><div className="h-64 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">{paymentStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} formatter={(value: number) => [`${value}%`, ""]} /></PieChart></ResponsiveContainer></div><div className="flex flex-wrap justify-center gap-4 mt-4">{paymentStatusData.map((item, index) => (<div key={index} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-sm text-slate-400">{item.name} ({item.value}%)</span></div>))}</div></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Yearly */}
        <TabsContent value="yearly" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><FileText className="w-5 h-5 text-purple-400" />Évolution Annuelle des Revenus</CardTitle></CardHeader>
            <CardContent><div className="h-96"><ResponsiveContainer width="100%" height="100%"><AreaChart data={yearlyData}><defs><linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient><linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="year" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} formatter={(value: number) => [`€${value.toLocaleString()}`, ""]} /><Area type="monotone" dataKey="revenus" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenus)" strokeWidth={2} /><Area type="monotone" dataKey="depenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorDepenses)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div><div className="flex justify-center gap-8 mt-4"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-sm text-slate-400">Revenus</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-sm text-slate-400">Dépenses</span></div></div></CardContent>
          </Card>
          <div className="grid grid-cols-5 gap-4">
            {yearlyData.map((year, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><p className="text-lg font-bold text-white mb-2">{year.year}</p><p className="text-emerald-400 font-semibold">€{(year.revenus / 1000000).toFixed(2)}M</p><p className="text-xs text-slate-400">Revenus</p><p className="text-purple-400 font-semibold mt-2">€{(year.benefice / 1000000).toFixed(2)}M</p><p className="text-xs text-slate-400">Bénéfice</p></CardContent></Card>
            ))}
          </div>
        </TabsContent>

        {/* Global */}
        <TabsContent value="global" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50 lg:col-span-2">
              <CardHeader><CardTitle className="text-white">Résumé Global de la Plateforme</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"><p className="text-sm text-emerald-400 mb-2">Total Revenus (All Time)</p><p className="text-4xl font-bold text-white">€9,990,000</p><p className="text-sm text-slate-400 mt-2">Depuis 2020</p></div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"><p className="text-sm text-blue-400 mb-2">Transactions Totales</p><p className="text-4xl font-bold text-white">45,892</p><p className="text-sm text-slate-400 mt-2">Paiements traités</p></div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30"><p className="text-sm text-purple-400 mb-2">Taux de Recouvrement</p><p className="text-4xl font-bold text-white">93%</p><p className="text-sm text-slate-400 mt-2">Paiements à temps</p></div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30"><p className="text-sm text-orange-400 mb-2">Croissance Annuelle</p><p className="text-4xl font-bold text-white">+23%</p><p className="text-sm text-slate-400 mt-2">Par rapport à 2023</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader><CardTitle className="text-white">Top Villes</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[{ name: "Paris", pct: 35, color: "bg-emerald-500" }, { name: "Lyon", pct: 22, color: "bg-blue-500" }, { name: "Marseille", pct: 15, color: "bg-purple-500" }, { name: "Nice", pct: 12, color: "bg-orange-500" }, { name: "Bordeaux", pct: 8, color: "bg-pink-500" }, { name: "Autres", pct: 8, color: "bg-slate-500" }].map((city) => (
                    <div key={city.name}>
                      <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{city.name}</span><span className="text-slate-400">{city.pct}%</span></div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full ${city.color} rounded-full`} style={{ width: `${city.pct}%` }} /></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
