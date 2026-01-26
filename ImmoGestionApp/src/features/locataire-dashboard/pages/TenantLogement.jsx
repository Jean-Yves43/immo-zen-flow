// src/features/locataire-dashboard/pages/TenantLogement.jsx

import { useEffect, useMemo, useState } from "react";
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
  Loader2,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { toast } from "../../../hooks/UseToast";

import { useAuth } from "../../../contexts/AuthContext";
import {
  getBiensLouesActifs,
  getBienLoueDetails,
  getContratsByLocataire,
  downloadContrat,
} from "../api/bienLoueService";

// Mapping des icônes
const iconMap = {
  Home,
  Ruler,
  DoorOpen,
  Building,
  Car,
  Fence,
  ArrowUpRight,
  Waves,
};

// ===== Loading State =====
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto" />
      <p className="text-lg font-medium text-foreground">Chargement du logement...</p>
    </div>
  </div>
);

// ===== Error State =====
const ErrorState = ({ error, onRetry }) => (
  <Card className="border-destructive/50">
    <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <XCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Erreur</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{error}</p>
      <Button onClick={onRetry} variant="outline">
        Réessayer
      </Button>
    </CardContent>
  </Card>
);

// ===== Empty State =====
const EmptyState = () => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <Home className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Aucun logement trouvé
      </h3>
      <p className="text-muted-foreground max-w-sm">
        Vous n'avez actuellement aucun bien en location active.
      </p>
    </CardContent>
  </Card>
);

export default function TenantLogement() {
  const { user, loading: authLoading } = useAuth();

  const [biensLoues, setBiensLoues] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bienLoue, setBienLoue] = useState(null);
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingContrats, setLoadingContrats] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [downloadingContrat, setDownloadingContrat] = useState(null);

  // ID locataire robuste
  const locataireId = useMemo(() => {
    return user?.id ?? user?.userId ?? user?.locataireId ?? null;
  }, [user]);

  // Charge la liste de biens actifs et les détails du premier
  useEffect(() => {
    if (authLoading) return;

    const fetchBiens = async () => {
      setLoading(true);
      setError(null);
      setBienLoue(null);

      if (!locataireId) {
        setError("Utilisateur non identifié.");
        setLoading(false);
        return;
      }

      try {
        console.log('📦 Chargement des biens actifs pour locataireId:', locataireId);
        const biens = await getBiensLouesActifs(locataireId);
        console.log('✅ Biens actifs reçus:', biens);
        setBiensLoues(biens);

        if (Array.isArray(biens) && biens.length > 0) {
          const { bienId } = biens[0];
          console.log('🔍 Chargement des détails du bien:', bienId);
          const details = await getBienLoueDetails(locataireId, bienId);
          console.log('✅ Détails du bien reçus:', details);
          setBienLoue(details);
          setCurrentIndex(0);

          // Charger les contrats
          await loadContrats(locataireId);
        } else {
          setError("Aucun bien en location active.");
        }
      } catch (err) {
        console.error('❌ Erreur chargement biens:', err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchBiens();
  }, [authLoading, locataireId]);

  // Charger les contrats
  const loadContrats = async (locId) => {
    setLoadingContrats(true);
    try {
      console.log('📄 Chargement des contrats pour locataireId:', locId);
      const contratsData = await getContratsByLocataire(locId);
      console.log('✅ Contrats reçus:', contratsData);
      setContrats(Array.isArray(contratsData) ? contratsData : []);
    } catch (err) {
      console.error('❌ Erreur chargement contrats:', err);
      // Ne pas bloquer l'affichage si les contrats échouent
      setContrats([]);
    } finally {
      setLoadingContrats(false);
    }
  };

  // Change de bien et charge ses détails
  const changeBien = async (newIndex) => {
    if (newIndex < 0 || newIndex >= biensLoues.length) return;
    setLoading(true);
    setError(null);

    try {
      const { bienId } = biensLoues[newIndex];
      const details = await getBienLoueDetails(locataireId, bienId);
      setBienLoue(details);
      setCurrentIndex(newIndex);
      setCurrentImageIndex(0); // Reset image index
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Télécharger un contrat
  const handleDownloadContrat = async (locationId, nomFichier) => {
    if (!locataireId || !locationId) return;

    setDownloadingContrat(locationId);
    try {
      console.log('⬇️ Téléchargement du contrat pour locationId:', locationId);
      const blob = await downloadContrat(locataireId, locationId);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nomFichier || `contrat-location-${locationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi ! 📄",
        description: "Le contrat a été téléchargé.",
        className: "bg-success text-white"
      });
    } catch (err) {
      console.error('❌ Erreur téléchargement contrat:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible de télécharger le contrat",
        variant: "destructive"
      });
    } finally {
      setDownloadingContrat(null);
    }
  };

  // Liste d'images du bien
  const images = useMemo(() => {
    if (!bienLoue || !bienLoue.image) return [];
    
    if (Array.isArray(bienLoue.image)) {
      return bienLoue.image.map((img) =>
        typeof img === "string" && img.startsWith("data:")
          ? img
          : `data:image/jpeg;base64,${img}`
      );
    }
    
    return [
      typeof bienLoue.image === "string" && bienLoue.image.startsWith("data:")
        ? bienLoue.image
        : `data:image/jpeg;base64,${bienLoue.image}`,
    ];
  }, [bienLoue]);

  // Image principale pour la section héro
  const heroImage = useMemo(() => {
    if (images.length > 0 && currentImageIndex < images.length) {
      return images[currentImageIndex];
    }
    return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=600&fit=crop";
  }, [images, currentImageIndex]);

  // Détails du bien
  const propertyDetails = useMemo(() => {
    return [
      { label: "Type de bien", value: bienLoue?.typeBienLibelle || "Non spécifié", icon: "Home" },
      { label: "Surface", value: bienLoue?.surface ? `${bienLoue.surface} m²` : "Non spécifiée", icon: "Ruler" },
      { label: "Pièces", value: bienLoue?.nbrPieces ?? "Non spécifié", icon: "DoorOpen" },
      { label: "Chambres", value: bienLoue?.nbrChambres ?? "Non spécifié", icon: "Building" },
    ];
  }, [bienLoue]);

  // Équipements
  const amenities = useMemo(() => {
    return [
      { label: "Parking", available: !!bienLoue?.parking, icon: "Car" },
      { label: "Jardin", available: !!bienLoue?.jardin, icon: "Fence" },
      { label: "Piscine", available: !!bienLoue?.piscine, icon: "Waves" },
      { label: "Ascenseur", available: !!bienLoue?.ascenseur, icon: "ArrowUpRight" },
    ];
  }, [bienLoue]);

  // UI states
  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <ErrorState 
          error={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  if (!bienLoue || biensLoues.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Mon logement</h1>
        <p className="text-muted-foreground mt-1">
          Informations détaillées sur votre logement
        </p>
      </div>

      <div className="px-6 space-y-6">
        {/* Hero Image */}
        <Card className="overflow-hidden border-border/50 shadow-soft animate-fade-up">
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 to-secondary/20">
            <img
              src={heroImage}
              alt={bienLoue?.typeBienLibelle || "Logement"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-2xl font-bold">
                {bienLoue?.ref || bienLoue?.typeBienLibelle || "Mon Logement"}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                <span className="text-white/90">
                  {bienLoue?.quartierNom || "Quartier"},{" "}
                  {bienLoue?.communeNom || bienLoue?.villeNom || "Ville"}
                </span>
              </div>
            </div>

            <Badge className="absolute top-6 right-6 bg-success text-white">
              {bienLoue?.statutLocation || "Actif"}
            </Badge>
          </div>
        </Card>

        {/* Bullet slider pour plusieurs images */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Voir l'image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {propertyDetails.map((detail, index) => {
            const Icon = iconMap[detail.icon];
            return (
              <Card
                key={detail.label}
                className="border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      {Icon ? <Icon className="w-6 h-6 text-primary" /> : null}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{detail.label}</p>
                      <p className="text-lg font-semibold text-foreground">{detail.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Amenities */}
          <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity) => {
                  const Icon = iconMap[amenity.icon];
                  return (
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
                        {Icon ? <Icon className="w-5 h-5" /> : null}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            amenity.available ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {amenity.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {amenity.available ? "Inclus" : "Non disponible"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Documents / Contrats */}
          <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingContrats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Chargement des contrats...
                  </span>
                </div>
              ) : contrats.length > 0 ? (
                <div className="space-y-3">
                  {contrats.map((contrat) => (
                    <div
                      key={contrat.locationId}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {contrat.nomFichier || `Contrat Location #${contrat.locationId}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF
                            {contrat.dateDebut && ` • Début: ${new Date(contrat.dateDebut).toLocaleDateString('fr-FR')}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={downloadingContrat === contrat.locationId}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary/10 hover:text-secondary"
                        onClick={() => handleDownloadContrat(contrat.locationId, contrat.nomFichier)}
                      >
                        {downloadingContrat === contrat.locationId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">Aucun document disponible</p>
                </div>
              )}
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
                <p className="text-sm text-muted-foreground">Quartier</p>
                <p className="font-medium text-foreground">
                  {bienLoue?.quartierNom || "Non spécifié"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commune / Ville</p>
                <p className="font-medium text-foreground">
                  {bienLoue?.communeNom || bienLoue?.villeNom || "Non spécifié"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pays</p>
                <p className="font-medium text-foreground">
                  {bienLoue?.pays || "Non spécifié"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {biensLoues.length > 1 && (
          <div className="flex items-center justify-between mt-6 p-4 rounded-xl bg-muted/30">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => changeBien(currentIndex - 1)}
            >
              Bien précédent
            </Button>
            <span className="text-sm font-medium">
              Bien {currentIndex + 1} sur {biensLoues.length}
            </span>
            <Button
              variant="outline"
              disabled={currentIndex === biensLoues.length - 1}
              onClick={() => changeBien(currentIndex + 1)}
            >
              Bien suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}