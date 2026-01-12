import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  CreditCard,
  FileText,
  Wrench,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { cn } from "../../../utils/utils";
import { useState } from "react";
import { Button } from "../../../components/Button";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/tenant" },
  { title: "Mon logement", icon: Home, path: "/tenant/logement" },
  { title: "Paiements", icon: CreditCard, path: "/tenant/paiements" },
  { title: "Reçus", icon: FileText, path: "/tenant/recus" },
  { title: "Maintenance", icon: Wrench, path: "/tenant/maintenance" },
  { title: "Notifications", icon: Bell, path: "/tenant/notifications" },
  { title: "Mon profil", icon: User, path: "/tenant/profil" },
];

export function TenantSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-primary-dark transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold text-white tracking-tight">
            ImmoGestion
          </span>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110",
          collapsed && "rotate-180"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-secondary text-white shadow-glow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive && "text-white"
                )}
              />
              {!collapsed && (
                <span className="font-medium text-sm">{item.title}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10 px-4 py-3",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Déconnexion</span>}
        </Button>
      </div>
    </aside>
  );
}