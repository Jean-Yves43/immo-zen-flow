import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Target, 
  Heart, 
  Award, 
  TrendingUp,
  Shield,
  Lightbulb,
  Globe,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Shield,
    title: "Confiance",
    description: "Nous bâtissons des relations durables basées sur la transparence et l'intégrité."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Nous repoussons les limites de la technologie pour simplifier la gestion immobilière."
  },
  {
    icon: Heart,
    title: "Engagement",
    description: "Nous sommes dédiés à la réussite de nos clients et partenaires."
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Nous croyons en la force du collectif et du partage des connaissances."
  }
];

const milestones = [
  { year: "2018", title: "Création", description: "Fondation d'ImmoGestion avec une vision claire" },
  { year: "2019", title: "Première levée", description: "2M€ levés pour accélérer le développement" },
  { year: "2020", title: "1000 utilisateurs", description: "Cap symbolique franchi en pleine crise" },
  { year: "2021", title: "Expansion", description: "Ouverture dans 5 nouvelles villes" },
  { year: "2022", title: "Partenariats", description: "Accords avec les leaders du secteur" },
  { year: "2023", title: "5000+ biens", description: "Plus de 5000 biens gérés sur la plateforme" },
  { year: "2024", title: "Nouvelle version", description: "Refonte complète de la plateforme" }
];

const team = [
  {
    name: "Marie Durand",
    role: "CEO & Co-fondatrice",
    description: "15 ans d'expérience dans l'immobilier"
  },
  {
    name: "Pierre Martin",
    role: "CTO & Co-fondateur",
    description: "Expert en solutions SaaS"
  },
  {
    name: "Sophie Lefebvre",
    role: "Directrice Commerciale",
    description: "Spécialiste de la relation client"
  },
  {
    name: "Thomas Bernard",
    role: "Directeur Produit",
    description: "Passionné d'UX et d'innovation"
  }
];

const stats = [
  { value: "5,000+", label: "Biens gérés" },
  { value: "500+", label: "Partenaires" },
  { value: "50K+", label: "Utilisateurs" },
  { value: "15", label: "Villes" }
];

const APropos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Notre histoire</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Révolutionner la{" "}
                <span className="text-primary">gestion immobilière</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Depuis 2018, nous développons des solutions innovantes pour simplifier 
                la vie des propriétaires, gestionnaires et locataires.
              </p>
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

        {/* Mission Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                  <Target className="w-4 h-4" />
                  Notre mission
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Simplifier la gestion immobilière pour tous
                </h2>
                <p className="text-muted-foreground mb-6">
                  Nous croyons que la gestion immobilière ne devrait pas être une source de stress. 
                  Notre mission est de fournir des outils intuitifs et puissants qui permettent à 
                  chacun de gérer son patrimoine immobilier en toute sérénité.
                </p>
                <p className="text-muted-foreground mb-8">
                  Que vous soyez propriétaire d'un appartement ou gestionnaire d'un grand parc 
                  immobilier, ImmoGestion s'adapte à vos besoins et vous accompagne au quotidien.
                </p>
                <div className="space-y-3">
                  {[
                    "Plateforme tout-en-un pour la gestion locative",
                    "Automatisation des tâches répétitives",
                    "Communication simplifiée entre tous les acteurs",
                    "Suivi financier en temps réel"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 rounded-3xl flex items-center justify-center">
                  <Globe className="w-32 h-32 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nos valeurs
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Les principes qui guident chacune de nos décisions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="text-center border-border/50 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Notre parcours
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Les étapes clés de notre développement
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
                
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.year} 
                    className={`relative flex items-start gap-6 mb-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10" />
                    
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
                    }`}>
                      <div className={`inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-2`}>
                        {milestone.year}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{milestone.title}</h3>
                      <p className="text-muted-foreground text-sm">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Notre équipe
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des experts passionnés au service de votre réussite
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="text-center border-border/50 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardContent className="pt-6 pb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-primary/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Contactez-nous
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Notre équipe est à votre disposition pour répondre à toutes vos questions.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Adresse</p>
                        <p className="text-muted-foreground text-sm">123 Avenue des Champs-Élysées, 75008 Paris</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Téléphone</p>
                        <p className="text-muted-foreground text-sm">+33 1 23 45 67 89</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-muted-foreground text-sm">contact@immogestion.fr</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <Card className="border-border/50">
                    <CardContent className="p-8 text-center">
                      <Award className="w-16 h-16 text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Rejoignez l'aventure
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Devenez partenaire et développez votre activité avec nous
                      </p>
                      <Link to="/devenir-partenaire">
                        <Button variant="primary" className="font-semibold">
                          Devenir partenaire
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default APropos;
