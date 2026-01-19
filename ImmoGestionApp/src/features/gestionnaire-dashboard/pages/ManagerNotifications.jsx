// src/features/gestionnaire-dashboard/pages/ManagerNotifications.jsx
import { useState } from "react";
import { Bell, Check, Trash2, CreditCard, Wrench, Users, Home } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { initialNotifications } from "../api/manager";

const iconMap = {
  payment: CreditCard,
  maintenance: Wrench,
  owner: Users,
  property: Home,
};

export default function ManagerNotifications() {
  const [notificationsList, setNotificationsList] = useState(initialNotifications);
  
  const unreadCount = notificationsList.filter(n => !n.read).length;

  const getIcon = (type) => {
    return iconMap[type] || Bell;
  };

  const markAsRead = (id) => {
    setNotificationsList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  const kpiData = [
    { 
      title: "Non lues", 
      value: unreadCount,
      icon: Bell
    },
    { 
      title: "Urgentes", 
      value: notificationsList.filter(n => n.urgent).length,
      icon: Bell,
      valueColor: "text-destructive"
    },
    { 
      title: "Total", 
      value: notificationsList.length,
      icon: Bell
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} non lues`}
        actions={
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="space-y-3">
        {notificationsList.map((notification) => {
          const Icon = getIcon(notification.type);
          
          return (
            <Card 
              key={notification.id} 
              className={`hover-lift ${!notification.read ? "bg-secondary/5 border-secondary/20" : ""}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    notification.urgent 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{notification.title}</h3>
                      {notification.urgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                      {!notification.read && (
                        <Badge className="bg-secondary text-secondary-foreground">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteNotification(notification.id)}
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
    </div>
  );
}