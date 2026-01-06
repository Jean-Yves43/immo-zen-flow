import { LayoutDashboard, Building2, Users, CreditCard, Wrench, BarChart3, Settings, Bell, Search, ChevronDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Building2, label: "Mes biens" },
  { icon: Users, label: "Locataires" },
  { icon: CreditCard, label: "Paiements" },
  { icon: Wrench, label: "Maintenance" },
  { icon: BarChart3, label: "Statistiques" },
  { icon: Settings, label: "Paramètres" },
];

const stats = [
  { label: "Revenus mensuels", value: "45,250 €", change: "+12%", positive: true },
  { label: "Taux d'occupation", value: "94%", change: "+3%", positive: true },
  { label: "Biens gérés", value: "32", change: "2 nouveaux", positive: true },
  { label: "Demandes ouvertes", value: "7", change: "-4", positive: true },
];

const properties = [
  { name: "Appartement Haussmann", location: "Paris 8ème", status: "Loué", rent: "2,800 €" },
  { name: "Studio Marais", location: "Paris 4ème", status: "Loué", rent: "1,450 €" },
  { name: "Maison Versailles", location: "Versailles", status: "Disponible", rent: "3,200 €" },
];

export const DashboardPreview = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-4">
            Interface moderne
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Un dashboard conçu pour{" "}
            <span className="gradient-text">l'efficacité</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Interface intuitive et élégante pour une gestion immobilière sans effort.
          </p>
        </div>

        {/* Dashboard Mock */}
        <div className="rounded-2xl overflow-hidden shadow-large border border-border bg-card">
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden md:flex w-64 bg-muted/30 border-r border-border flex-col p-4">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">ImmoGestion</span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1">
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      item.active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-[500px]">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                  </button>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center text-secondary-foreground font-semibold text-sm">
                      JD
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-muted/30 rounded-xl p-4 border border-border">
                      <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <Badge variant="success" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Properties Table */}
                <div className="bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-foreground">Mes biens récents</h3>
                    <button className="text-sm text-primary hover:underline">Voir tout</button>
                  </div>
                  <div className="divide-y divide-border">
                    {properties.map((property) => (
                      <div key={property.name} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground text-sm">{property.name}</div>
                            <div className="text-xs text-muted-foreground">{property.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={property.status === "Loué" ? "default" : "secondary"}>
                            {property.status}
                          </Badge>
                          <div className="text-sm font-medium text-foreground w-20 text-right">{property.rent}</div>
                          <button className="p-1 hover:bg-muted rounded">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
