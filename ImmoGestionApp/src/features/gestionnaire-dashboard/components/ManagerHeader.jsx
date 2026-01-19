// src/features/gestionnaire-dashboard/components/ManagerHeader.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../../../components/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/Avatar";
import { Badge } from "../../../components/Badge";
import { useAuth } from "../../../contexts/Authcontext";

export function ManagerHeader({ sidebarCollapsed = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les notifications (vous pouvez remplacer ceci par un vrai appel API)
  useEffect(() => {
    // Simuler le chargement des notifications
    // TODO: Remplacer par un vrai appel API
    const mockNotifications = [
      {
        id: 1,
        title: "Nouveau propriétaire",
        message: "M. Durand a accepté votre invitation",
        read: false,
        timestamp: new Date()
      },
      {
        id: 2,
        title: "Retard de paiement",
        message: "3 loyers en retard ce mois",
        read: false,
        timestamp: new Date()
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/manager/settings');
  };

  const handleSettingsClick = () => {
    navigate('/manager/settings');
  };

  const handleNotificationClick = (notificationId) => {
    // Marquer la notification comme lue
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Naviguer vers la page des notifications
    navigate('/manager/notifications');
  };

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user?.nom) return "U";
    const names = user.nom.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.nom.substring(0, 2).toUpperCase();
  };

  // Obtenir le nom d'affichage
  const getDisplayName = () => {
    return user?.nom || "Utilisateur";
  };

  // Obtenir le rôle d'affichage
  const getRoleDisplay = () => {
    return user?.roleLibelle || "Gestionnaire";
  };

  return (
    <header 
      className={`fixed top-0 right-0 z-30 h-16 bg-background border-b border-border transition-all duration-300 ${
        sidebarCollapsed ? "left-16" : "left-64"
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un propriétaire, bien, locataire..." 
            className="pl-10 bg-muted/50 border-0" 
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                <>
                  {notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="font-medium">{notification.title}</span>
                        {!notification.read && (
                          <Badge className="ml-auto bg-secondary text-secondary-foreground h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {notification.message}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="justify-center text-primary"
                    onClick={() => navigate('/manager/notifications')}
                  >
                    Voir toutes les notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{getDisplayName()}</span>
                  <span className="text-xs text-muted-foreground">{getRoleDisplay()}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}