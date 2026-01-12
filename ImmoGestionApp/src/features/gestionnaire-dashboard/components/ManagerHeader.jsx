// src/features/gestionnaire-dashboard/components/ManagerHeader.jsx
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

export function ManagerHeader({ sidebarCollapsed = false }) {
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
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                  5
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">Nouveau propriétaire</span>
                <span className="text-sm text-muted-foreground">
                  M. Durand a accepté votre invitation
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">Retard de paiement</span>
                <span className="text-sm text-muted-foreground">
                  3 loyers en retard ce mois
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    MG
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">Marc Gestionnaire</span>
                  <span className="text-xs text-muted-foreground">Gestionnaire</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
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