import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle2, 
  Handshake,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Award,
  BarChart3,
  Headphones
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  {
    icon: TrendingUp,
    title: "Augmentez vos revenus",
    description: "Accédez à un portefeuille de biens plus large et diversifiez vos sources de revenus."
  },
  {
    icon: Shield,
    title: "Outils de gestion avancés",
    description: "Bénéficiez d'une plateforme complète pour gérer vos biens et vos clients efficacement."
  },
  {
    icon: Users,
    title: "Réseau de professionnels",
    description: "Rejoignez une communauté de gestionnaires et propriétaires pour partager les meilleures pratiques."
  },
  {
    icon: Building2,
    title: "Visibilité accrue",
    description: "Vos annonces sont mises en avant sur notre plateforme visitée par des milliers d'utilisateurs."
  }
];

const partnerTypes = [
  {
    title: "Agence immobilière",
    description: "Pour les agences souhaitant élargir leur portefeuille",
    features: [
      "Gestion multi-propriétaires",
      "Tableau de bord personnalisé",
      "Rapports détaillés",
      "Support dédié"
    ]
  },
  {
    title: "Gestionnaire indépendant",
    description: "Pour les professionnels de la gestion locative",
    features: [
      "Outils de suivi des paiements",
      "Gestion des maintenances",
      "Communication propriétaires",
      "Formation incluse"
    ]
  },
  {
    title: "Propriétaire bailleur",
    description: "Pour les propriétaires avec plusieurs biens",
    features: [
      "Gestion simplifiée",
      "Suivi des loyers",
      "Documents automatisés",
      "Tarif préférentiel"
    ]
  }
];

const stats = [
  { value: "500+", label: "Partenaires actifs" },
  { value: "15K", label: "Biens gérés" },
  { value: "98%", label: "Taux de satisfaction" },
  { value: "24/7", label: "Support disponible" }
];

const DevenirPartenaire = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    partnerType: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demande envoyée !",
      description: "Nous vous contacterons dans les plus brefs délais.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mb-6">
                <Handshake className="w-4 h-4" />
                <span className="text-sm font-medium">Programme Partenaires</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Développez votre activité avec{" "}
                <span className="text-primary">ImmoGestion</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Rejoignez notre réseau de partenaires et bénéficiez d'outils performants 
                pour gérer et développer votre portefeuille immobilier.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="secondary" size="lg" className="font-semibold">
                  Devenir partenaire
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="font-semibold">
                  <Phone className="mr-2 w-5 h-5" />
                  Nous contacter
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-primary-foreground/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pourquoi devenir partenaire ?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez les avantages exclusifs réservés à nos partenaires
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-border/50 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Types Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choisissez votre profil
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des solutions adaptées à chaque type de partenaire
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerTypes.map((type) => (
                <Card key={type.title} className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {type.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-6">
                      En savoir plus
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Des outils puissants pour votre réussite
                </h2>
                <p className="text-muted-foreground mb-8">
                  Notre plateforme vous offre tout ce dont vous avez besoin pour gérer 
                  efficacement votre activité immobilière.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: BarChart3, text: "Tableau de bord analytique complet" },
                    { icon: Clock, text: "Automatisation des tâches récurrentes" },
                    { icon: Award, text: "Programme de fidélité et récompenses" },
                    { icon: Headphones, text: "Support prioritaire 24/7" }
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="w-24 h-24 text-primary/50 mx-auto mb-4" />
                    <span className="text-muted-foreground">Tableau de bord partenaire</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Rejoignez-nous
                </h2>
                <p className="text-muted-foreground">
                  Remplissez le formulaire ci-dessous et notre équipe vous contactera rapidement
                </p>
              </div>
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nom de l'entreprise</Label>
                        <Input 
                          id="companyName" 
                          placeholder="Votre entreprise"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Nom du contact</Label>
                        <Input 
                          id="contactName" 
                          placeholder="Jean Dupont"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email professionnel</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            id="email" 
                            type="email"
                            placeholder="contact@entreprise.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            id="phone" 
                            type="tel"
                            placeholder="+33 1 23 45 67 89"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (optionnel)</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Décrivez votre activité et vos attentes..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <Button type="submit" variant="primary" size="lg" className="w-full font-semibold">
                      Envoyer ma demande
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DevenirPartenaire;
