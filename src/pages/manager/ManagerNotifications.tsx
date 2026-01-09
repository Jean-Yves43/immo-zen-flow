import { useState } from "react";
import { Bell, Check, Trash2, CreditCard, Wrench, Users, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const notifications = [
  { id: 1, type: "payment", title: "Loyer en retard", message: "Marie Lambert - Studio Leclerc", time: "Il y a 2h", read: false, urgent: true },
  { id: 2, type: "maintenance", title: "Urgence plomberie", message: "Apt T3 Victor Hugo - Fuite importante", time: "Il y a 4h", read: false, urgent: true },
  { id: 3, type: "owner", title: "Nouveau propriétaire", message: "M. Robert a accepté votre invitation", time: "Hier", read: false, urgent: false },
  { id: 4, type: "payment", title: "Paiement reçu", message: "Jean Dupont - 1200€", time: "Hier", read: true, urgent: false },
  { id: 5, type: "property", title: "Bien mis en vente", message: "T2 Rue de la Paix - 320 000€", time: "Il y a 2 jours", read: true, urgent: false },
];

export default function ManagerNotifications() {
  const [notificationsList, setNotificationsList] = useState(notifications);
  const unreadCount = notificationsList.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "payment": return <CreditCard className="h-5 w-5" />;
      case "maintenance": return <Wrench className="h-5 w-5" />;
      case "owner": return <Users className="h-5 w-5" />;
      case "property": return <Home className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-foreground">Notifications</h1><p className="text-muted-foreground mt-1">{unreadCount} non lues</p></div>
        <Button variant="outline" onClick={markAllAsRead}><Check className="mr-2 h-4 w-4" />Tout marquer comme lu</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Non lues</CardTitle><Bell className="h-5 w-5 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{unreadCount}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Urgentes</CardTitle><Bell className="h-5 w-5 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{notificationsList.filter(n => n.urgent).length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle><Bell className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{notificationsList.length}</div></CardContent></Card>
      </div>

      <div className="space-y-3">
        {notificationsList.map((notification) => (
          <Card key={notification.id} className={`hover-lift ${!notification.read ? "bg-secondary/5 border-secondary/20" : ""}`}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${notification.urgent ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    {notification.urgent && <Badge variant="destructive">Urgent</Badge>}
                    {!notification.read && <Badge className="bg-secondary text-secondary-foreground">Nouveau</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                </div>
                <div className="flex gap-2">
                  {!notification.read && <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)}><Check className="h-4 w-4" /></Button>}
                  <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
