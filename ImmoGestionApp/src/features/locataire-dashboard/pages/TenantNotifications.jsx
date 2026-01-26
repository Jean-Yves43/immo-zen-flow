// src/features/locataire-dashboard/pages/TenantNotifications.jsx

import { useState } from "react";
import {
  Bell,
  Euro,
  Home,
  Wrench,
  FileText,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  CreditCard,
  Users,
  AlertTriangle,
  Loader2,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/DropdownMenu";
import { cn } from "../../../utils/utils";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotifications } from "../../../hooks/useNotifications";
import { toast } from "../../../hooks/UseToast";

// Map des icônes selon le type
const iconMap = {
  Euro,
  Wrench,
  Clock,
  FileText,
  Home,
  CreditCard,
  Users,
  AlertTriangle,
  Bell,
};

// Configuration des icônes par type de notification
const getIconConfig = (type) => {
  const config = {
    PAIEMENT: {
      icon: 'CreditCard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    MAINTENANCE: {
      icon: 'Wrench',
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    PROPRIETAIRE: {
      icon: 'Users',
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    BIEN: {
      icon: 'Home',
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    LOCATION: {
      icon: 'FileText',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500/10',
    },
    EXPULSION: {
      icon: 'AlertTriangle',
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
    },
  };

  return config[type] || {
    icon: 'Bell',
    color: 'text-gray-600',
    bgColor: 'bg-gray-500/10',
  };
};

// Composant Loading
const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto" />
      <div>
        <p className="text-lg font-medium text-foreground">Chargement...</p>
        <p className="text-sm text-muted-foreground">Récupération de vos notifications</p>
      </div>
    </div>
  </div>
);

// Composant Error State
const ErrorState = ({ error, onRetry }) => (
  <Card className="border-destructive/50">
    <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <XCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Erreur de chargement
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {error || "Une erreur s'est produite lors du chargement de vos notifications."}
      </p>
      <Button onClick={onRetry} variant="outline">
        Réessayer
      </Button>
    </CardContent>
  </Card>
);

// Composant Empty State
const EmptyState = () => (
  <Card className="border-border/50 shadow-soft">
    <CardContent className="py-12 text-center">
      <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
      <h3 className="font-semibold text-foreground mb-2">
        Aucune notification
      </h3>
      <p className="text-muted-foreground">
        Vous n'avez pas de nouvelles notifications pour le moment.
      </p>
    </CardContent>
  </Card>
);

export default function TenantNotifications() {
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Utiliser le hook useNotifications
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications(user?.id);

  // Gestion du marquage comme lu
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive"
      });
    }
  };

  // Gestion du marquage de toutes comme lues
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast({
        title: "Succès",
        description: `${unreadCount} notification${unreadCount > 1 ? 's marquées' : ' marquée'} comme lue${unreadCount > 1 ? 's' : ''}`,
        className: "bg-success text-white"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        variant: "destructive"
      });
    }
  };

  // Gestion de la suppression
  const handleDelete = async (notificationId, event) => {
    event.stopPropagation();
    
    try {
      setDeletingId(notificationId);
      await deleteNotification(notificationId);
      toast({
        title: "Succès",
        description: "Notification supprimée",
        className: "bg-success text-white"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  // État de chargement initial
  if (loading && notifications.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Restez informé de l'activité de votre compte
            </p>
          </div>
        </div>
        <LoadingState />
      </div>
    );
  }

  // État d'erreur
  if (error && notifications.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Restez informé de l'activité de votre compte
            </p>
          </div>
        </div>
        <ErrorState error={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Restez informé de l'activité de votre compte
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge className="bg-secondary text-white">
            {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
          </Badge>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-0 divide-y divide-border">
            {notifications.map((notification, index) => {
              const iconConfig = getIconConfig(notification.type);
              const Icon = iconMap[iconConfig.icon];
              
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-5 transition-colors cursor-pointer animate-fade-up",
                    !notification.lue
                      ? "bg-secondary/5 hover:bg-secondary/10"
                      : "hover:bg-muted/50",
                    deletingId === notification.id && "opacity-50 pointer-events-none"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => !notification.lue && handleMarkAsRead(notification.id)}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      iconConfig.bgColor
                    )}
                  >
                    {Icon && (
                      <Icon className={cn("w-6 h-6", iconConfig.color)} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={cn(
                            "font-semibold",
                            !notification.lue
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {notification.titre}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.tempsRelatif || new Date(notification.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        {notification.urgente && (
                          <Badge className="mt-2 bg-red-500/10 text-red-700 border-red-500/20">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.lue && (
                          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.lue && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Marquer comme lu
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={(e) => handleDelete(notification.id, e)}
                            >
                              {deletingId === notification.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Suppression...
                                </>
                              ) : (
                                "Supprimer"
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}