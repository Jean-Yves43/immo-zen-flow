import { useState } from "react";
import {
  Bell,
  Check,
  Trash2,
  Filter,
  CreditCard,
  Wrench,
  UserPlus,
  AlertTriangle,
  Building2,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Notification {
  id: string;
  type: "payment" | "maintenance" | "user" | "alert" | "property" | "system";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  severity: "info" | "warning" | "error";
}

const initialNotifications: Notification[] = [
  { id: "1", type: "payment", title: "Paiement en retard critique", description: "Locataire Pierre Durand - Apt 12B - 850€ - 15 jours de retard", time: "Il y a 10 min", isRead: false, severity: "error" },
  { id: "2", type: "maintenance", title: "Urgence maintenance signalée", description: "Fuite d'eau importante - Villa Les Pins, Nice - Intervention immédiate requise", time: "Il y a 30 min", isRead: false, severity: "error" },
  { id: "3", type: "user", title: "Nouveau propriétaire inscrit", description: "Jean-Marc Lefebvre - En attente de validation de compte", time: "Il y a 1h", isRead: false, severity: "warning" },
  { id: "4", type: "payment", title: "Paiement reçu", description: "Sophie Lambert - Résidence Étoile - 1,200€ confirmé", time: "Il y a 2h", isRead: true, severity: "info" },
  { id: "5", type: "property", title: "Nouvelle propriété ajoutée", description: "Appartement T3 - 78 Boulevard Haussmann, Paris - Par Pierre Dubois", time: "Il y a 3h", isRead: true, severity: "info" },
  { id: "6", type: "alert", title: "Taux d'occupation en baisse", description: "Zone Marseille - Taux passé sous 80% - Action recommandée", time: "Il y a 5h", isRead: false, severity: "warning" },
  { id: "7", type: "user", title: "Gestionnaire désactivé", description: "Compte de Luc Robert marqué comme inactif - 0 activité depuis 30 jours", time: "Il y a 6h", isRead: true, severity: "warning" },
  { id: "8", type: "system", title: "Mise à jour système", description: "Nouvelle version disponible - Améliorations de sécurité incluses", time: "Il y a 1 jour", isRead: true, severity: "info" },
];

const iconMap = {
  payment: CreditCard,
  maintenance: Wrench,
  user: UserPlus,
  alert: AlertTriangle,
  property: Building2,
  system: Settings,
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const markAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.includes(n.id) ? { ...n, isRead: true } : n))
    );
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "border-l-destructive bg-destructive/5";
      case "warning":
        return "border-l-warning bg-warning/5";
      default:
        return "border-l-primary bg-transparent";
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount} notification{unreadCount !== 1 ? "s" : ""} non lue
            {unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card className="border-border/50 shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={
                  selectedIds.length === filteredNotifications.length &&
                  filteredNotifications.length > 0
                }
                onCheckedChange={selectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedIds.length > 0
                  ? `${selectedIds.length} sélectionné(s)`
                  : "Sélectionner tout"}
              </span>
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={markAsRead}>
                    <Check className="w-4 h-4 mr-1" />
                    Marquer comme lu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={deleteSelected}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="unread">Non lues</SelectItem>
                <SelectItem value="payment">Paiements</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="user">Utilisateurs</SelectItem>
                <SelectItem value="alert">Alertes</SelectItem>
                <SelectItem value="property">Propriétés</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="border-border/50 shadow-soft">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = iconMap[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 border-l-4 transition-colors hover:bg-muted/30 ${getSeverityColor(
                      notification.severity
                    )} ${!notification.isRead ? "bg-secondary/5" : ""}`}
                  >
                    <Checkbox
                      checked={selectedIds.includes(notification.id)}
                      onCheckedChange={() => toggleSelect(notification.id)}
                    />
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.severity === "error"
                          ? "bg-destructive/10 text-destructive"
                          : notification.severity === "warning"
                          ? "bg-warning/10 text-warning"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`text-sm font-medium ${
                            !notification.isRead ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <Badge className="bg-secondary/20 text-secondary text-xs">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        notification.severity === "error"
                          ? "border-destructive/50 text-destructive"
                          : notification.severity === "warning"
                          ? "border-warning/50 text-warning"
                          : "border-primary/50 text-primary"
                      }
                    >
                      {notification.severity === "error"
                        ? "Critique"
                        : notification.severity === "warning"
                        ? "Attention"
                        : "Info"}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
