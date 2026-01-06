import { BarChart3, Building, Users, DollarSign, ClipboardCheck, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardImage from "@/assets/dashboard-preview.jpg";

const features = [
  { icon: BarChart3, text: "Dashboard avec KPIs" },
  { icon: Building, text: "Gestion des biens" },
  { icon: Users, text: "Gestion locataires" },
  { icon: DollarSign, text: "Suivi des paiements" },
  { icon: ClipboardCheck, text: "Maintenance" },
  { icon: TrendingUp, text: "Statistiques avancées" },
];

export const CRMSection = () => {
  return (
    <section id="crm" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Pour les professionnels
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Un CRM puissant pour{" "}
              <span className="gradient-text">propriétaires & agences</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Gérez l'ensemble de votre parc immobilier depuis un tableau de bord centralisé. 
              Revenus, locataires, maintenance — tout est à portée de main.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-secondary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" size="lg" className="font-semibold">
              Devenir partenaire
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-large border border-border">
              <img
                src={dashboardImage}
                alt="ImmoGestion Dashboard Preview"
                className="w-full h-auto"
              />
              {/* Overlay with floating elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/20 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-large border border-border animate-float hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">+24%</div>
                  <div className="text-sm text-muted-foreground">Revenus ce mois</div>
                </div>
              </div>
            </div>

            {/* Floating Users Card */}
            <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-large border border-border animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">156</div>
                  <div className="text-sm text-muted-foreground">Locataires actifs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
