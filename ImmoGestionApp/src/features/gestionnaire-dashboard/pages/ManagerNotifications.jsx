// src/features/gestionnaire-dashboard/pages/ManagerNotifications.jsx
import { Bell, Check, Trash2, CreditCard, Wrench, Users, Home, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { useNotifications } from "../../../hooks/useNotifications";
import { useAuth } from "../../../contexts/AuthContext"; // ← CORRECTION: Authcontext avec 'c' minuscule

const iconMap = {
  PAIEMENT: CreditCard,
  MAINTENANCE: Wrench,
  PROPRIETAIRE: Users,
  BIEN: Home,
  LOCATION: Home,
  EXPULSION: AlertTriangle,
};

export default function ManagerNotifications() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications(user?.userId); // ← Utiliser user?.userId

  const getIcon = (type) => {
    return iconMap[type] || Bell;
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  const kpiData = [
    { 
      title: "Non lues", 
      value: unreadCount,
      icon: Bell
    },
    { 
      title: "Urgentes", 
      value: notifications.filter(n => n.urgente).length,
      icon: Bell,
      valueColor: "text-destructive"
    },
    { 
      title: "Total", 
      value: notifications.length,
      icon: Bell
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
        actions={
          unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune notification pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            
            return (
              <Card 
                key={notification.id} 
                className={`hover-lift ${!notification.lue ? "bg-secondary/5 border-secondary/20" : ""}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notification.urgente 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{notification.titre}</h3>
                        {notification.urgente && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                        {!notification.lue && (
                          <Badge className="bg-secondary text-secondary-foreground">
                            Nouveau
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.tempsRelatif}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.lue && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Marquer comme lu"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}