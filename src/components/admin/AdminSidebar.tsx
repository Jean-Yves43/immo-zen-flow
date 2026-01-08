import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCog,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Home,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Gestion Utilisateurs",
    icon: Users,
    submenu: [
      { title: "Gestionnaires", path: "/admin/users/managers", icon: UserCog },
      { title: "Propriétaires", path: "/admin/users/owners", icon: UserCheck },
      { title: "Locataires", path: "/admin/users/tenants", icon: User },
    ],
  },
  {
    title: "Propriétés",
    icon: Building2,
    path: "/admin/properties",
  },
  {
    title: "Aperçu Gestionnaires",
    icon: UserCog,
    path: "/admin/managers-overview",
  },
  {
    title: "Statistiques",
    icon: BarChart3,
    path: "/admin/statistics",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    title: "Paramètres",
    icon: Settings,
    path: "/admin/settings",
  },
];

export function AdminSidebar() {
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Home className="w-8 h-8 text-secondary" />
        <span className="ml-3 text-xl font-bold">ImmoGestion</span>
      </div>

      {/* Admin Badge */}
      <div className="px-6 py-3">
        <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded-full">
          Admin Panel
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200",
                      isSubmenuActive(item.submenu)
                        ? "bg-secondary/20 text-secondary"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
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
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              isActive(subItem.path)
                                ? "bg-secondary text-slate-900 font-medium"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive(item.path!)
                      ? "bg-secondary text-slate-900 font-medium"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.title}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
