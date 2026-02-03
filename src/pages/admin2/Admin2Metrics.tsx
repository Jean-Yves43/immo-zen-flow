import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Globe,
  Zap,
  Shield,
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

const generateServerData = () => {
  const data = [];
  for (let i = 59; i >= 0; i--) {
    data.push({
      time: `${i}s`,
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 20) + 50,
      requests: Math.floor(Math.random() * 100) + 150,
    });
  }
  return data;
};

const uptimeData = [
  { service: "API Principal", status: "operational", uptime: 99.99, latency: 45 },
  { service: "Base de données", status: "operational", uptime: 99.98, latency: 12 },
  { service: "Authentification", status: "operational", uptime: 100, latency: 28 },
  { service: "Stockage fichiers", status: "degraded", uptime: 99.85, latency: 120 },
  { service: "Notifications", status: "operational", uptime: 99.95, latency: 35 },
  { service: "Paiements", status: "operational", uptime: 100, latency: 52 },
];

const errorLogs = [
  { time: "14:32:15", level: "error", message: "Database connection timeout", count: 3 },
  { time: "14:28:42", level: "warning", message: "High memory usage detected", count: 1 },
  { time: "14:15:08", level: "info", message: "Scheduled backup completed", count: 1 },
  { time: "13:58:22", level: "warning", message: "Rate limit exceeded for IP", count: 12 },
  { time: "13:45:00", level: "info", message: "Cache cleared successfully", count: 1 },
];

const securityEvents = [
  { type: "login_failed", count: 23, trend: "down" },
  { type: "suspicious_activity", count: 5, trend: "stable" },
  { type: "blocked_ips", count: 48, trend: "up" },
  { type: "api_abuse", count: 2, trend: "down" },
];

export default function Admin2Metrics() {
  const [serverData, setServerData] = useState(generateServerData());
  const [currentLoad, setCurrentLoad] = useState({ cpu: 35, memory: 62, disk: 45, network: 78 });

  useEffect(() => {
    const interval = setInterval(() => {
      setServerData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: "0s",
          cpu: Math.floor(Math.random() * 30) + 20,
          memory: Math.floor(Math.random() * 20) + 50,
          requests: Math.floor(Math.random() * 100) + 150,
        });
        return newData;
      });
      setCurrentLoad({
        cpu: Math.floor(Math.random() * 30) + 25,
        memory: Math.floor(Math.random() * 15) + 55,
        disk: Math.floor(Math.random() * 5) + 43,
        network: Math.floor(Math.random() * 20) + 70,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Métriques & Monitoring</h1>
          <p className="text-slate-400 mt-1">Surveillez l'état de santé de votre plateforme en temps réel</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
          Tous les systèmes opérationnels
        </Badge>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-slate-400">CPU</span>
              </div>
              <span className="text-2xl font-bold text-white">{currentLoad.cpu}%</span>
            </div>
            <Progress value={currentLoad.cpu} className="h-2" />
            <p className="text-xs text-slate-500 mt-2">4 cores @ 2.4GHz</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-slate-400">Mémoire</span>
              </div>
              <span className="text-2xl font-bold text-white">{currentLoad.memory}%</span>
            </div>
            <Progress value={currentLoad.memory} className="h-2" />
            <p className="text-xs text-slate-500 mt-2">12.4 GB / 16 GB</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-slate-400">Disque</span>
              </div>
              <span className="text-2xl font-bold text-white">{currentLoad.disk}%</span>
            </div>
            <Progress value={currentLoad.disk} className="h-2" />
            <p className="text-xs text-slate-500 mt-2">225 GB / 500 GB</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Wifi className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-slate-400">Réseau</span>
              </div>
              <span className="text-2xl font-bold text-white">{currentLoad.network}%</span>
            </div>
            <Progress value={currentLoad.network} className="h-2" />
            <p className="text-xs text-slate-500 mt-2">78 Mbps / 100 Mbps</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Performance Serveur (60s)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serverData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                  />
                  <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-400">CPU</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-slate-400">Mémoire</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              Requêtes par Seconde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serverData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              État des Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uptimeData.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    {service.status === "operational" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="text-white font-medium">{service.service}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">{service.latency}ms</span>
                    <Badge className={service.status === "operational" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}>
                      {service.uptime}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Logs */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Logs Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {errorLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      log.level === "error" ? "bg-red-500/20 text-red-400" :
                      log.level === "warning" ? "bg-amber-500/20 text-amber-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-slate-300 text-sm">{log.message}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {log.count > 1 && (
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        x{log.count}
                      </Badge>
                    )}
                    <span className="text-xs text-slate-500">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Overview */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Aperçu Sécurité (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            {securityEvents.map((event, index) => (
              <div key={index} className="p-4 rounded-xl bg-slate-900/50 text-center">
                <p className="text-3xl font-bold text-white mb-2">{event.count}</p>
                <p className="text-sm text-slate-400 mb-2">{event.type.replace("_", " ").toUpperCase()}</p>
                <Badge className={
                  event.trend === "down" ? "bg-emerald-500/20 text-emerald-400" :
                  event.trend === "up" ? "bg-red-500/20 text-red-400" :
                  "bg-slate-500/20 text-slate-400"
                }>
                  {event.trend === "down" ? "↓ En baisse" : event.trend === "up" ? "↑ En hausse" : "→ Stable"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">1,247</p>
            <p className="text-sm text-slate-400">Utilisateurs connectés</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">45ms</p>
            <p className="text-sm text-slate-400">Latence moyenne</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">99.97%</p>
            <p className="text-sm text-slate-400">Uptime (30 jours)</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">2.4s</p>
            <p className="text-sm text-slate-400">Temps de chargement</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
