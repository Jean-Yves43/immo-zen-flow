import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserCog,
  UserCheck,
  User,
  FileText,
  Activity,
  CreditCard,
  PlusCircle,
  TrendingUp,
  Globe,
  Shield,
  Megaphone,
  Wallet,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin2",
  },
  {
    title: "Gestion Utilisateurs",
    icon: Users,
    submenu: [
      { title: "Tous les utilisateurs", path: "/admin2/users", icon: Users },
      { title: "Gestionnaires", path: "/admin2/users/managers", icon: UserCog },
      { title: "Propriétaires", path: "/admin2/users/owners", icon: UserCheck },
      { title: "Locataires", path: "/admin2/users/tenants", icon: User },
      { title: "Utilisateurs standard", path: "/admin2/users/standard", icon: User },
      { title: "Créer un utilisateur", path: "/admin2/users/create", icon: PlusCircle },
    ],
  },
  {
    title: "Propriétés",
    icon: Building2,
    submenu: [
      { title: "Toutes les propriétés", path: "/admin2/properties", icon: Building2 },
      { title: "Ajouter une propriété", path: "/admin2/properties/create", icon: PlusCircle },
    ],
  },
  {
    title: "Paiements",
    icon: CreditCard,
    submenu: [
      { title: "Transactions", path: "/admin2/payments", icon: Wallet },
      { title: "Moyens de paiement", path: "/admin2/payments/methods", icon: CreditCard },
      { title: "Configuration API", path: "/admin2/payments/api", icon: Shield },
    ],
  },
  {
    title: "Rapports",
    icon: FileText,
    submenu: [
      { title: "Vue d'ensemble", path: "/admin2/reports", icon: BarChart3 },
      { title: "Paiements mensuels", path: "/admin2/reports/monthly", icon: TrendingUp },
      { title: "Paiements annuels", path: "/admin2/reports/yearly", icon: FileText },
    ],
  },
  {
    title: "Métriques",
    icon: Activity,
    path: "/admin2/metrics",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/admin2/notifications",
  },
  {
    title: "Paramètres",
    icon: Settings,
    submenu: [
      { title: "Paramètres généraux", path: "/admin2/settings", icon: Settings },
      { title: "Notifications", path: "/admin2/settings/notifications", icon: Bell },
      { title: "Publicités", path: "/admin2/settings/ads", icon: Megaphone },
      { title: "Authentification", path: "/admin2/settings/auth", icon: Shield },
      { title: "Géolocalisation", path: "/admin2/settings/geo", icon: Globe },
    ],
  },
];

export function Admin2Sidebar() {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Gestion Utilisateurs"]);

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isSubmenuActive = (submenu: { path: string }[]) =>
    submenu.some((item) => location.pathname === item.path);

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col z-50 border-r border-white/5">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ImmoGestion
            </span>
            <p className="text-xs text-slate-500">Admin Pro</p>
          </div>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="px-6 py-4">
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/30">
          <span className="text-sm font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ✨ Admin Panel v2.0
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                    isSubmenuActive(item.submenu)
                      ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  {expandedMenus.includes(item.title) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedMenus.includes(item.title) && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.path}>
                        <NavLink
                          to={subItem.path}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300",
                            isActive(subItem.path)
                              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium shadow-lg shadow-emerald-500/25"
                              : "text-slate-500 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <subItem.icon className="w-4 h-4" />
                          {subItem.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path!}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                  isActive(item.path!)
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium shadow-lg shadow-emerald-500/25"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
