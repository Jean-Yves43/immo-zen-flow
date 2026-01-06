import { Home, CreditCard, Wrench, TrendingUp, Receipt, Bell, Clock, Users } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Acheter & Louer",
    description: "Trouvez le bien idéal parmi notre sélection de propriétés vérifiées. Location ou achat, nous vous accompagnons.",
    color: "primary",
  },
  {
    icon: CreditCard,
    title: "Paiement de loyer",
    description: "Payez votre loyer en ligne en toute sécurité. Reçus automatiques et historique complet disponibles.",
    color: "secondary",
    features: [
      { icon: Receipt, text: "Reçus automatiques" },
      { icon: Bell, text: "Rappels de paiement" },
    ],
  },
  {
    icon: Wrench,
    title: "Demandes de maintenance",
    description: "Signalez un problème en quelques clics. Suivez l'avancement de votre demande en temps réel.",
    color: "primary",
    features: [
      { icon: Clock, text: "Suivi en temps réel" },
      { icon: Users, text: "Gestion prestataires" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Vente immobilière",
    description: "Mettez votre bien en vente et gérez les visites, offres et documents depuis une seule plateforme.",
    color: "secondary",
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-4">
            Nos Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tout ce dont vous avez besoin pour{" "}
            <span className="gradient-text">gérer vos biens</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Une suite complète d'outils pour simplifier la gestion immobilière au quotidien.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-large transition-all duration-300 border border-border hover:border-secondary/30 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                  service.color === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <service.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Features */}
              {service.features && (
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  {service.features.map((feature) => (
                    <div key={feature.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <feature.icon className="w-4 h-4 text-secondary" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
