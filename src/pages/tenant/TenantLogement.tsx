import {
  Home,
  MapPin,
  Ruler,
  DoorOpen,
  Building,
  Car,
  Fence,
  Waves,
  FileText,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const propertyDetails = [
  { label: "Type de bien", value: "Appartement", icon: Home },
  { label: "Surface", value: "65 m²", icon: Ruler },
  { label: "Pièces", value: "3 pièces", icon: DoorOpen },
  { label: "Étage", value: "3ème étage", icon: Building },
];

const amenities = [
  { label: "Parking", available: true, icon: Car },
  { label: "Balcon", available: true, icon: Fence },
  { label: "Ascenseur", available: true, icon: ArrowUpRight },
  { label: "Cave", available: false, icon: Waves },
];

const documents = [
  { name: "Contrat de location", type: "PDF", size: "2.4 MB", date: "15/01/2024" },
  { name: "Règlement intérieur", type: "PDF", size: "856 KB", date: "15/01/2024" },
  { name: "État des lieux", type: "PDF", size: "3.1 MB", date: "15/01/2024" },
];

export default function TenantLogement() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon logement</h1>
        <p className="text-muted-foreground mt-1">
          Informations détaillées sur votre logement
        </p>
      </div>

      {/* Hero Image */}
      <Card className="overflow-hidden border-border/50 shadow-soft animate-fade-up">
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 to-secondary/20">
          <img
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=600&fit=crop"
            alt="Appartement"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-bold">Appartement Montmartre</h2>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-white/90">
                15 Rue Lepic, 75018 Paris
              </span>
            </div>
          </div>
          <Badge className="absolute top-6 right-6 bg-success text-white">
            Actif
          </Badge>
        </div>
      </Card>

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {propertyDetails.map((detail, index) => (
          <Card
            key={detail.label}
            className="border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <detail.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{detail.label}</p>
                  <p className="text-lg font-semibold text-foreground">
                    {detail.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Amenities */}
        <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {amenities.map((amenity) => (
                <div
                  key={amenity.label}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    amenity.available
                      ? "bg-success/5 border border-success/20"
                      : "bg-muted/50 border border-border"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      amenity.available
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <amenity.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        amenity.available
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {amenity.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {amenity.available ? "Inclus" : "Non disponible"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary/10 hover:text-secondary"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address Card */}
      <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-400">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" />
            Adresse complète
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p className="font-medium text-foreground">15 Rue Lepic</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Code postal</p>
              <p className="font-medium text-foreground">75018</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ville</p>
              <p className="font-medium text-foreground">Paris</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
