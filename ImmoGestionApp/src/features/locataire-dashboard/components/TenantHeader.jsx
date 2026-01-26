import { useEffect, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { Input } from "../../../components/Input";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/Avatar";
import { Badge } from "../../../components/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/DropdownMenu";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import notificationService from "../../../services/notificationService";

export function TenantHeader() {
  // Auth
  const { user, logout } = useAuth();

  // État local (JS pur, sans types)
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user?.id) {
        try {
          const count = await notificationService.countNotificationsNonLues(user.id);
          setUnreadCount(count);
        } catch (error) {
          console.error("Erreur lors de la récupération des notifications non lues:", error);
        }
      }
    };

    fetchUnreadCount();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-10 w-80 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-secondary"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <Link
          to="/tenant/notifications"
          className="relative p-2.5 rounded-xl hover:bg-muted transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive border-2 border-card">
              {unreadCount}
            </Badge>
          )}
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {user?.nom || "Utilisateur"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.roleLibelle || "Locataire"}
                </p>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-secondary/20">
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback className="bg-secondary text-white font-semibold">
                  {user?.nom ? user.nom.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/tenant/profil" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive cursor-pointer"
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
