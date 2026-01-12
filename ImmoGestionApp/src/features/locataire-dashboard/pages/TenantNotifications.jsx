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
import { notifications as notificationsData } from "../api/tenant";

const iconMap = {
  Euro,
  Wrench,
  Clock,
  FileText,
  Home,
};

export default function TenantNotifications() {
  const [notificationList, setNotificationList] = useState(notificationsData);

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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
            onClick={markAllAsRead}
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
      <Card className="border-border/50 shadow-soft">
        <CardContent className="p-0 divide-y divide-border">
          {notificationList.map((notification, index) => {
            const Icon = iconMap[notification.icon];
            return (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-4 p-5 transition-colors cursor-pointer animate-fade-up",
                  !notification.read
                    ? "bg-secondary/5 hover:bg-secondary/10"
                    : "hover:bg-muted/50"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => markAsRead(notification.id)}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    notification.iconBg
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn("w-6 h-6", notification.iconColor)}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className={cn(
                          "font-semibold",
                          !notification.read
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
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
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            Marquer comme lu
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Supprimer
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

      {/* Empty State */}
      {notificationList.length === 0 && (
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
      )}
    </div>
  );
}