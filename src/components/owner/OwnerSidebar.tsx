import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Users,
  CreditCard,
  FileText,
  Wrench,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { title: "Dashboard", url: "/owner", icon: LayoutDashboard },
  { title: "Mes biens", url: "/owner/properties", icon: Home },
  { title: "Locataires", url: "/owner/tenants", icon: Users },
  { title: "Paiements & loyers", url: "/owner/payments", icon: CreditCard },
  { title: "Reçus & contrats", url: "/owner/receipts", icon: FileText },
  { title: "Maintenance", url: "/owner/maintenance", icon: Wrench },
  { title: "Ventes", url: "/owner/sales", icon: TrendingUp },
  { title: "Statistiques", url: "/owner/statistics", icon: BarChart3 },
  { title: "Paramètres", url: "/owner/settings", icon: Settings },
];

export function OwnerSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-primary transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-foreground/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-secondary" />
            <span className="text-xl font-bold text-primary-foreground">
              ImmoGestion
            </span>
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
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <span className="text-xs font-medium text-secondary bg-secondary/20 px-2 py-1 rounded-full">
            Propriétaire
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.url ||
              (item.url !== "/owner" && location.pathname.startsWith(item.url));

            const linkContent = (
              <NavLink
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-secondary-foreground" : ""
                  )}
                />
                {!collapsed && (
                  <span className="font-medium truncate">{item.title}</span>
                )}
              </NavLink>
            );

            if (collapsed) {
              return (
                <li key={item.title}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return <li key={item.title}>{linkContent}</li>;
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-primary-foreground/10">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-full text-primary-foreground/70 hover:text-red-400 hover:bg-red-400/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Déconnexion</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-primary-foreground/70 hover:text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </Button>
        )}
      </div>
    </aside>
  );
}
