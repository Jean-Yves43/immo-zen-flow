import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  CreditCard,
  Wrench,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { title: "Dashboard", url: "/manager", icon: LayoutDashboard },
  { title: "Propriétaires", url: "/manager/owners", icon: UserCircle },
  { title: "Biens", url: "/manager/properties", icon: Home },
  { title: "Locataires", url: "/manager/tenants", icon: Users },
  { title: "Paiements", url: "/manager/payments", icon: CreditCard },
  { title: "Maintenance", url: "/manager/maintenance", icon: Wrench },
  { title: "Statistiques", url: "/manager/statistics", icon: BarChart3 },
  { title: "Notifications", url: "/manager/notifications", icon: Bell },
  { title: "Paramètres", url: "/manager/settings", icon: Settings },
];

export function ManagerSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-primary transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary-foreground/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-secondary" />
            <span className="text-xl font-bold text-primary-foreground">ImmoGestion</span>
          </div>
        )}
        {collapsed && <Building2 className="h-8 w-8 text-secondary mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10",
            collapsed && "mx-auto mt-2"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3">
          <span className="text-xs font-medium text-secondary bg-secondary/20 px-2 py-1 rounded-full">
            Gestionnaire
          </span>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url || (item.url !== "/manager" && location.pathname.startsWith(item.url));
            const linkContent = (
              <NavLink
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium truncate">{item.title}</span>}
              </NavLink>
            );

            if (collapsed) {
              return (
                <li key={item.title}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                </li>
              );
            }
            return <li key={item.title}>{linkContent}</li>;
          })}
        </ul>
      </nav>

      <div className="p-2 border-t border-primary-foreground/10">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full text-primary-foreground/70 hover:text-red-400 hover:bg-red-400/10">
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Déconnexion</TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="ghost" className="w-full justify-start gap-3 text-primary-foreground/70 hover:text-red-400 hover:bg-red-400/10">
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </Button>
        )}
      </div>
    </aside>
  );
}
