import { Bell, Search, ChevronDown, Moon, Sun, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function Admin2Header() {
  const [isDark, setIsDark] = useState(true);

  return (
    <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Rechercher utilisateurs, propriétés, transactions..."
          className="pl-11 bg-slate-800/50 border-slate-700/50 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-xl text-white placeholder:text-slate-500"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="rounded-xl hover:bg-slate-800 text-slate-400"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Settings Quick Access */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hover:bg-slate-800 text-slate-400"
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2.5 hover:bg-slate-800 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                5
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-700">
            <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 text-white hover:bg-slate-800">
              <span className="font-medium text-sm">Nouveau propriétaire inscrit</span>
              <span className="text-xs text-slate-400">Jean Martin - Il y a 5 min</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 text-white hover:bg-slate-800">
              <span className="font-medium text-sm">Paiement en retard</span>
              <span className="text-xs text-slate-400">Appartement 12B - 3 jours</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 text-white hover:bg-slate-800">
              <span className="font-medium text-sm">Demande de maintenance urgente</span>
              <span className="text-xs text-slate-400">Villa Les Pins - Il y a 1h</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="justify-center text-emerald-400 font-medium hover:bg-slate-800">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-700 hover:bg-slate-800/50 rounded-xl px-4 py-2 transition-colors">
              <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-white">Super Admin</p>
                <p className="text-xs text-slate-400">admin@immo.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
            <DropdownMenuLabel className="text-white">Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-white">
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-white">
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-white">
              Journal d'activité
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
