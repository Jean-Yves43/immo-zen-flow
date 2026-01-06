import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-cityscape.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern cityscape with luxury buildings"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/85 via-primary-dark/70 to-primary-dark/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-light mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-soft" />
            <span className="text-sm font-medium">Plateforme immobilière tout-en-un</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
            Gérez, louez et vendez vos biens{" "}
            <span className="text-secondary-light">en toute simplicité</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-up animation-delay-200">
            Une plateforme complète pour locataires, propriétaires et agences immobilières.
            Simplifiez votre gestion immobilière dès aujourd'hui.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-300">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto font-semibold shadow-glow">
              Découvrir la plateforme
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="hero" size="lg" className="w-full sm:w-auto font-semibold">
              <Play className="mr-2 w-5 h-5" />
              Voir la démo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/10 animate-fade-up animation-delay-400">
            {[
              { value: "5,000+", label: "Biens gérés" },
              { value: "98%", label: "Satisfaction client" },
              { value: "24/7", label: "Support disponible" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-secondary-light mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  );
};
