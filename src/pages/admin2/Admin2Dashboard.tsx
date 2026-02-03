import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useEffect, useState } from "react";

// Données simulées pour le graphique temps réel
const generateRealtimeData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      paiements: Math.floor(Math.random() * 50000) + 10000,
      transactions: Math.floor(Math.random() * 20) + 5,
    });
  }
  return data;
};

// Données pour la carte des utilisateurs
const userLocations = [
  { city: "Paris", lat: 48.8566, lng: 2.3522, users: 1250, color: "from-emerald-500 to-cyan-500" },
  { city: "Lyon", lat: 45.764, lng: 4.8357, users: 850, color: "from-blue-500 to-purple-500" },
  { city: "Marseille", lat: 43.2965, lng: 5.3698, users: 620, color: "from-orange-500 to-red-500" },
  { city: "Bordeaux", lat: 44.8378, lng: -0.5792, users: 480, color: "from-pink-500 to-rose-500" },
  { city: "Toulouse", lat: 43.6047, lng: 1.4442, users: 390, color: "from-violet-500 to-purple-500" },
  { city: "Nantes", lat: 47.2184, lng: -1.5536, users: 310, color: "from-teal-500 to-emerald-500" },
  { city: "Nice", lat: 43.7102, lng: 7.262, users: 280, color: "from-amber-500 to-orange-500" },
  { city: "Lille", lat: 50.6292, lng: 3.0573, users: 245, color: "from-cyan-500 to-blue-500" },
];

const stats = [
  {
    title: "Utilisateurs Actifs",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    title: "Propriétés",
    value: "3,428",
    change: "+8.2%",
    trend: "up",
    icon: Building2,
    gradient: "from-blue-500 to-purple-500",
  },
  {
    title: "Revenus Mensuels",
    value: "€847,320",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Taux d'Occupation",
    value: "94.2%",
    change: "-2.4%",
    trend: "down",
    icon: TrendingUp,
    gradient: "from-pink-500 to-rose-500",
  },
];

const recentActivity = [
  { type: "payment", user: "Jean Dupont", action: "Paiement reçu", amount: "€1,250", time: "Il y a 2 min" },
  { type: "user", user: "Marie Martin", action: "Nouveau compte créé", amount: "", time: "Il y a 5 min" },
  { type: "property", user: "Pierre Durand", action: "Propriété ajoutée", amount: "", time: "Il y a 12 min" },
  { type: "payment", user: "Sophie Bernard", action: "Paiement reçu", amount: "€890", time: "Il y a 18 min" },
  { type: "maintenance", user: "Luc Petit", action: "Demande maintenance", amount: "", time: "Il y a 25 min" },
];

export default function Admin2Dashboard() {
  const [realtimeData, setRealtimeData] = useState(generateRealtimeData());
  const [liveIndicator, setLiveIndicator] = useState(true);

  // Simulation de données temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData((prev) => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          paiements: Math.floor(Math.random() * 50000) + 10000,
          transactions: Math.floor(Math.random() * 20) + 5,
        });
        return newData;
      });
      setLiveIndicator((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Bienvenue, Super Admin. Voici un aperçu de votre plateforme.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${liveIndicator ? "bg-emerald-500" : "bg-emerald-500/50"} animate-pulse`} />
          <span className="text-sm text-slate-400">Données en temps réel</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden group hover:border-slate-600/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span className="text-sm font-medium">{stat.change}</span>
                    <span className="text-xs text-slate-500">vs mois dernier</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Payment Chart */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Paiements en Temps Réel
                </CardTitle>
                <p className="text-sm text-slate-400 mt-1">Flux de paiements sur les dernières 24 minutes</p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realtimeData}>
                  <defs>
                    <linearGradient id="colorPaiements" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value: number) => [`€${value.toLocaleString()}`, "Montant"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="paiements"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPaiements)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Locations Map */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Répartition Géographique
                </CardTitle>
                <p className="text-sm text-slate-400 mt-1">Utilisateurs par ville</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {userLocations.reduce((acc, loc) => acc + loc.users, 0).toLocaleString()} utilisateurs
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 h-72 overflow-y-auto pr-2">
              {userLocations.map((location, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${location.color} flex items-center justify-center`}>
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {location.city}
                      </p>
                      <p className="text-sm text-slate-400">{location.users.toLocaleString()} utilisateurs</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${location.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(location.users / 1250) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "payment" ? "bg-emerald-500/20 text-emerald-400" :
                    activity.type === "user" ? "bg-blue-500/20 text-blue-400" :
                    activity.type === "property" ? "bg-purple-500/20 text-purple-400" :
                    "bg-orange-500/20 text-orange-400"
                  }`}>
                    {activity.type === "payment" ? <DollarSign className="w-5 h-5" /> :
                     activity.type === "user" ? <Users className="w-5 h-5" /> :
                     activity.type === "property" ? <Building2 className="w-5 h-5" /> :
                     <Activity className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-white">{activity.user}</p>
                    <p className="text-sm text-slate-400">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="font-semibold text-emerald-400">{activity.amount}</p>
                  )}
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
