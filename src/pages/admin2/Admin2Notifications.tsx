import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell, CheckCircle, AlertTriangle, Info, XCircle, Trash2, CheckCheck, Filter,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "success", title: "Paiement reçu", message: "Jean Dupont a effectué un paiement de €1,250", time: "Il y a 5 min", read: false },
  { id: 2, type: "warning", title: "Paiement en retard", message: "Le loyer de l'appartement 12B est en retard de 3 jours", time: "Il y a 15 min", read: false },
  { id: 3, type: "info", title: "Nouveau locataire", message: "Marie Martin a créé un compte locataire", time: "Il y a 1h", read: false },
  { id: 4, type: "error", title: "Échec de paiement", message: "Le prélèvement de Sophie Bernard a échoué", time: "Il y a 2h", read: true },
  { id: 5, type: "success", title: "Maintenance terminée", message: "La demande de maintenance #423 a été clôturée", time: "Il y a 3h", read: true },
  { id: 6, type: "info", title: "Nouvelle propriété", message: "Pierre Durand a ajouté une nouvelle propriété", time: "Il y a 5h", read: true },
  { id: 7, type: "warning", title: "Contrat expirant", message: "Le bail de l'appartement 8A expire dans 30 jours", time: "Il y a 6h", read: true },
];

const getTypeConfig = (type: string) => {
  switch (type) {
    case "success": return { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" };
    case "warning": return { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/20" };
    case "error": return { icon: XCircle, color: "text-red-400", bg: "bg-red-500/20" };
    default: return { icon: Info, color: "text-blue-400", bg: "bg-blue-500/20" };
  }
};

export default function Admin2Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filterType, setFilterType] = useState<string>("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filterType === "all" ? notifications : notifications.filter(n => n.type === filterType);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Toutes les notifications marquées comme lues");
  };

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification supprimée");
  };

  const cycleFilter = () => {
    const types = ["all", "success", "warning", "error", "info"];
    const idx = types.indexOf(filterType);
    const next = types[(idx + 1) % types.length];
    setFilterType(next);
    toast.info(`Filtre: ${next === "all" ? "Toutes" : next}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">Gérez vos alertes et notifications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700 gap-2" onClick={cycleFilter}>
            <Filter className="w-4 h-4" />
            {filterType === "all" ? "Filtrer" : filterType}
          </Button>
          <Button variant="outline" className="border-slate-700 gap-2" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-white">{unreadCount}</p><p className="text-sm text-slate-400">Non lues</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-emerald-400">{notifications.filter(n => n.type === "success").length}</p><p className="text-sm text-slate-400">Succès</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-amber-400">{notifications.filter(n => n.type === "warning").length}</p><p className="text-sm text-slate-400">Alertes</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-red-400">{notifications.filter(n => n.type === "error").length}</p><p className="text-sm text-slate-400">Erreurs</p></CardContent></Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-white flex items-center gap-2"><Bell className="w-5 h-5 text-blue-400" />Toutes les notifications ({filtered.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((notification) => {
            const config = getTypeConfig(notification.type);
            return (
              <div key={notification.id} className={`flex items-start justify-between p-4 rounded-xl transition-all cursor-pointer ${notification.read ? "bg-slate-900/30" : "bg-slate-900/70 border border-slate-700"}`} onClick={() => toggleRead(notification.id)}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${config.bg}`}><config.icon className={`w-5 h-5 ${config.color}`} /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{notification.title}</p>
                      {!notification.read && <Badge className="bg-blue-500/20 text-blue-400 text-xs">Nouveau</Badge>}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={e => { e.stopPropagation(); deleteNotification(notification.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-center text-slate-400 py-8">Aucune notification</p>}
        </CardContent>
      </Card>
    </div>
  );
}
