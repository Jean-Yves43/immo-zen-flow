import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Heart,
  Share2,
  Printer,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Calendar,
  Home,
  Car,
  Waves,
  Wifi,
  Wind,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  User,
  Shield,
  CheckCircle2,
  Building,
  Trees,
  Thermometer,
  Eye
} from "lucide-react";
import { useState } from "react";

// Mock data - in real app this would come from API
const mockPropertyDetails = {
  1: {
    id: 1,
    title: "Appartement lumineux avec balcon",
    address: "15 Rue de la Paix, Paris 2ème",
    city: "Paris",
    postalCode: "75002",
    price: 1450,
    priceType: "month",
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    floor: 3,
    totalFloors: 5,
    type: "Appartement",
    featured: true,
    forSale: false,
    description: `Magnifique appartement de 65m² situé au cœur du 2ème arrondissement de Paris. 
    
    Cet appartement lumineux bénéficie d'une exposition sud-ouest et comprend :
    - Un séjour spacieux avec accès au balcon
    - Une cuisine équipée et aménagée
    - Deux chambres dont une avec placard intégré
    - Une salle de bain avec baignoire
    - WC séparés
    
    L'appartement a été entièrement rénové en 2022 avec des matériaux de qualité. Parquet massif dans tout l'appartement, double vitrage, et isolation phonique renforcée.
    
    Situé dans un immeuble haussmannien avec gardien, ascenseur et local vélos. Proche de toutes commodités : métro, commerces, écoles.`,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    features: [
      "Balcon",
      "Parquet",
      "Double vitrage",
      "Ascenseur",
      "Gardien",
      "Cave",
      "Interphone",
      "Digicode"
    ],
    amenities: {
      heating: "Chauffage collectif",
      water: "Eau chaude collective",
      parking: false,
      elevator: true,
      balcony: true,
      terrace: false,
      garden: false,
      pool: false,
      airConditioning: false,
      internet: true,
    },
    energyClass: "C",
    gasEmission: "D",
    availableDate: "2024-02-01",
    deposit: 2900,
    charges: 150,
    agencyFees: 1450,
    agent: {
      name: "Sophie Martin",
      phone: "+33 1 23 45 67 89",
      email: "sophie.martin@immogestion.fr",
      agency: "ImmoGestion Paris Centre"
    },
    nearbyTransit: [
      { name: "Opéra", distance: "200m", time: "3 min" },
      { name: "Quatre-Septembre", distance: "350m", time: "5 min" },
      { name: "Pyramides", distance: "400m", time: "5 min" }
    ],
    coordinates: { lat: 48.8698, lng: 2.3311 },
    views: 245,
    createdAt: "2024-01-15"
  }
};

// Create entries for all properties
const allProperties: Record<string, typeof mockPropertyDetails[1]> = {
  ...mockPropertyDetails,
  "2": { ...mockPropertyDetails[1], id: 2, title: "Studio moderne centre-ville", address: "8 Place Bellecour, Lyon 2ème", city: "Lyon", price: 680, bedrooms: 1, bathrooms: 1, area: 28, type: "Studio" },
  "3": { ...mockPropertyDetails[1], id: 3, title: "Maison avec jardin", address: "42 Avenue des Platanes, Bordeaux", city: "Bordeaux", price: 1850, bedrooms: 4, bathrooms: 2, area: 120, type: "Maison" },
  "4": { ...mockPropertyDetails[1], id: 4, title: "Loft industriel rénové", address: "5 Rue des Usines, Nantes", city: "Nantes", price: 1200, bedrooms: 2, bathrooms: 1, area: 85, type: "Loft" },
  "5": { ...mockPropertyDetails[1], id: 5, title: "Duplex avec terrasse", address: "23 Boulevard Haussmann, Paris 9ème", city: "Paris", price: 2400, bedrooms: 3, bathrooms: 2, area: 95, type: "Duplex" },
  "6": { ...mockPropertyDetails[1], id: 6, title: "Appartement vue mer", address: "12 Promenade des Anglais, Nice", city: "Nice", price: 1650, bedrooms: 2, bathrooms: 1, area: 55, type: "Appartement" },
  "7": { ...mockPropertyDetails[1], id: 7, title: "T3 proche transports", address: "7 Rue de la Gare, Toulouse", city: "Toulouse", price: 890, bedrooms: 2, bathrooms: 1, area: 58, type: "Appartement" },
  "8": { ...mockPropertyDetails[1], id: 8, title: "Villa contemporaine", address: "18 Chemin des Collines, Marseille", city: "Marseille", price: 2800, bedrooms: 5, bathrooms: 3, area: 180, type: "Villa" },
  "9": { ...mockPropertyDetails[1], id: 9, title: "Studio étudiant équipé", address: "3 Rue des Facultés, Montpellier", city: "Montpellier", price: 450, bedrooms: 1, bathrooms: 1, area: 22, type: "Studio" },
  // Sale properties
  "101": { ...mockPropertyDetails[1], id: 101, title: "Appartement Haussmannien d'exception", address: "16 Avenue Montaigne, Paris 8ème", city: "Paris", price: 1250000, priceType: "total", bedrooms: 4, bathrooms: 2, area: 145, type: "Appartement", forSale: true },
  "102": { ...mockPropertyDetails[1], id: 102, title: "Villa moderne avec piscine", address: "25 Chemin des Oliviers, Cannes", city: "Cannes", price: 2850000, priceType: "total", bedrooms: 6, bathrooms: 4, area: 320, type: "Villa", forSale: true },
  "103": { ...mockPropertyDetails[1], id: 103, title: "Loft design Marais", address: "8 Rue des Archives, Paris 4ème", city: "Paris", price: 890000, priceType: "total", bedrooms: 2, bathrooms: 1, area: 95, type: "Loft", forSale: true },
  "104": { ...mockPropertyDetails[1], id: 104, title: "Maison de ville avec jardin", address: "42 Rue Saint-Michel, Bordeaux", city: "Bordeaux", price: 675000, priceType: "total", bedrooms: 5, bathrooms: 2, area: 180, type: "Maison", forSale: true },
  "105": { ...mockPropertyDetails[1], id: 105, title: "Penthouse vue panoramique", address: "1 Place de l'Étoile, Lyon 2ème", city: "Lyon", price: 1450000, priceType: "total", bedrooms: 3, bathrooms: 2, area: 120, type: "Penthouse", forSale: true },
  "106": { ...mockPropertyDetails[1], id: 106, title: "Appartement neuf éco-responsable", address: "15 Allée Verte, Nantes", city: "Nantes", price: 385000, priceType: "total", bedrooms: 3, bathrooms: 1, area: 78, type: "Appartement", forSale: true },
  "107": { ...mockPropertyDetails[1], id: 107, title: "Domaine viticole", address: "Route des Châteaux, Saint-Émilion", city: "Saint-Émilion", price: 4500000, priceType: "total", bedrooms: 8, bathrooms: 5, area: 450, type: "Domaine", forSale: true },
  "108": { ...mockPropertyDetails[1], id: 108, title: "Studio investissement locatif", address: "3 Rue des Étudiants, Toulouse", city: "Toulouse", price: 125000, priceType: "total", bedrooms: 1, bathrooms: 1, area: 25, type: "Studio", forSale: true },
  "109": { ...mockPropertyDetails[1], id: 109, title: "Duplex contemporain", address: "28 Quai de la Garonne, Marseille", city: "Marseille", price: 720000, priceType: "total", bedrooms: 4, bathrooms: 2, area: 135, type: "Duplex", forSale: true },
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const property = allProperties[id || "1"];

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Bien non trouvé</h1>
          <p className="text-muted-foreground mb-6">Ce bien n'existe pas ou n'est plus disponible.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number, priceType?: string) => {
    const formatted = new Intl.NumberFormat('fr-FR').format(price);
    if (priceType === "total" || property.forSale) {
      return `${formatted}€`;
    }
    return `${formatted}€/mois`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux annonces
          </Button>
        </div>

        {/* Image Gallery */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Image */}
              <div className="lg:col-span-2 relative aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building className="w-24 h-24 text-primary/30" />
                </div>
                
                {/* Navigation arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/70 text-white text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.featured && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      À la une
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/90">
                    {property.forSale ? "Vente" : "Location"}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-2 gap-2">
                {property.images.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 transition-all ${
                      currentImageIndex === index ? 'ring-2 ring-primary' : 'hover:opacity-80'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home className="w-8 h-8 text-primary/30" />
                    </div>
                    {index === 3 && property.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold">+{property.images.length - 4}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2">{property.type}</Badge>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={isFavorite ? "text-red-500" : ""}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Printer className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                    <Maximize className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-lg font-bold">{property.area}m²</p>
                      <p className="text-xs text-muted-foreground">Surface</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                    <Bed className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-lg font-bold">{property.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Chambre{property.bedrooms > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                    <Bath className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-lg font-bold">{property.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Salle{property.bathrooms > 1 ? 's' : ''} d'eau</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                    <Building className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-lg font-bold">{property.floor}/{property.totalFloors}</p>
                      <p className="text-xs text-muted-foreground">Étage</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                  {property.description}
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Caractéristiques</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Équipements</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.amenities.elevator ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      <Building className="w-5 h-5" />
                    </div>
                    <span className={property.amenities.elevator ? '' : 'text-muted-foreground line-through'}>Ascenseur</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.amenities.parking ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <span className={property.amenities.parking ? '' : 'text-muted-foreground line-through'}>Parking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.amenities.balcony ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      <Wind className="w-5 h-5" />
                    </div>
                    <span className={property.amenities.balcony ? '' : 'text-muted-foreground line-through'}>Balcon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.amenities.terrace ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      <Home className="w-5 h-5" />
                    </div>
                    <span className={property.amenities.terrace ? '' : 'text-muted-foreground line-through'}>Terrasse</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.amenities.garden ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      <Trees className="w-5 h-5" />
                    </div>
                    <span className={property.amenities.garden ? '' : 'text-muted-foreground line-through'}>Jardin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.amenities.pool ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      <Waves className="w-5 h-5" />
                    </div>
                    <span className={property.amenities.pool ? '' : 'text-muted-foreground line-through'}>Piscine</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.amenities.airConditioning ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <span className={property.amenities.airConditioning ? '' : 'text-muted-foreground line-through'}>Climatisation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.amenities.internet ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      <Wifi className="w-5 h-5" />
                    </div>
                    <span className={property.amenities.internet ? '' : 'text-muted-foreground line-through'}>Internet/Fibre</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Energy */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Diagnostic énergétique</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">Classe énergétique</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                        property.energyClass === 'A' ? 'bg-green-500' :
                        property.energyClass === 'B' ? 'bg-green-400' :
                        property.energyClass === 'C' ? 'bg-yellow-400' :
                        property.energyClass === 'D' ? 'bg-orange-400' :
                        'bg-red-500'
                      }`}>
                        {property.energyClass}
                      </span>
                      <span className="font-medium">Classe {property.energyClass}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">Émissions GES</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                        property.gasEmission === 'A' ? 'bg-purple-300' :
                        property.gasEmission === 'B' ? 'bg-purple-400' :
                        property.gasEmission === 'C' ? 'bg-purple-500' :
                        property.gasEmission === 'D' ? 'bg-purple-600' :
                        'bg-purple-700'
                      }`}>
                        {property.gasEmission}
                      </span>
                      <span className="font-medium">Classe {property.gasEmission}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Map */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Emplacement</h2>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                      <p className="text-muted-foreground">Carte interactive</p>
                      <p className="text-sm text-muted-foreground mt-1">{property.address}</p>
                    </div>
                  </div>
                </div>

                {/* Nearby Transit */}
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">Transports à proximité</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.nearbyTransit.map((transit) => (
                      <Badge key={transit.name} variant="outline" className="py-2 px-3">
                        <span className="w-2 h-2 rounded-full bg-secondary mr-2" />
                        {transit.name} • {transit.distance} • {transit.time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card className="sticky top-24 border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {property.forSale ? "À vendre" : "À louer"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{property.views} vues</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(property.price, property.priceType)}
                    </p>
                    {!property.forSale && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Charges: {property.charges}€/mois
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!property.forSale && (
                    <>
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dépôt de garantie</span>
                          <span className="font-medium">{property.deposit}€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Frais d'agence</span>
                          <span className="font-medium">{property.agencyFees}€</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Disponible le {new Date(property.availableDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </>
                  )}

                  <Separator />

                  <Button variant="secondary" size="lg" className="w-full font-semibold">
                    <Phone className="mr-2 w-4 h-4" />
                    {property.forSale ? "Demander une visite" : "Planifier une visite"}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    <MessageSquare className="mr-2 w-4 h-4" />
                    Envoyer un message
                  </Button>

                  <Separator />

                  {/* Agent Card */}
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{property.agent.name}</p>
                        <p className="text-sm text-muted-foreground">{property.agent.agency}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Phone className="w-4 h-4" />
                        {property.agent.phone}
                      </a>
                      <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Mail className="w-4 h-4" />
                        {property.agent.email}
                      </a>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Annonce vérifiée par ImmoGestion</span>
                  </div>
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

export default PropertyDetail;
