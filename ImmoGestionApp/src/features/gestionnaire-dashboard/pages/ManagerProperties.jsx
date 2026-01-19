// src/features/gestionnaire-dashboard/pages/ManagerProperties.jsx
import { useState, useEffect } from "react";
import { Home, Users, Euro, MapPin, MoreHorizontal, Eye, Edit, Loader2, Building2, Bed, Bath, Maximize, Calendar, X, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/DropdownMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/Dialog";
import { Separator } from "../../../components/Separator";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { useAuth } from "../../../contexts/Authcontext";
import { bienGestionnaireService } from "../api/bienGestionnaire";

export default function ManagerProperties() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour le popup de détails
  const [selectedBien, setSelectedBien] = useState(null);
  const [bienDetails, setBienDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // États pour la galerie d'images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Charger les biens au montage du composant
  useEffect(() => {
    loadBiens();
  }, [user?.userId]);

  const loadBiens = async () => {
    if (!user?.userId) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await bienGestionnaireService.getBiens(user.userId);
      setBiens(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des biens:", err);
      setError(err.message || "Erreur lors du chargement des biens");
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails d'un bien
  const handleViewDetails = async (bien) => {
    setSelectedBien(bien);
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    setCurrentImageIndex(0); // Réinitialiser l'index de l'image

    try {
      if (bienGestionnaireService.getDetailsBien) {
        const details = await bienGestionnaireService.getDetailsBien(bien.id);
        setBienDetails(details);
      } else {
        // Si la fonction n'existe pas, utiliser les données de base
        setBienDetails(bien);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des détails:", err);
      // En cas d'erreur, utiliser les données de base
      setBienDetails(bien);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Navigation dans la galerie d'images
  const handleNextImage = (images) => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (images) => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Filtrer les biens
  let filteredBiens = bienGestionnaireService.searchBiens(biens, searchQuery);
  
  if (statusFilter !== "all") {
    filteredBiens = bienGestionnaireService.filterByStatut(filteredBiens, statusFilter);
  }
  
  if (typeFilter !== "all") {
    filteredBiens = bienGestionnaireService.filterByType(filteredBiens, typeFilter);
  }

  // Trier les biens
  const sortedBiens = bienGestionnaireService.sortBiens(filteredBiens, 'dateAjout', 'desc');

  // Calculer les statistiques
  const stats = bienGestionnaireService.getStatistics(biens);

  // Obtenir la liste unique des types de biens
  const uniqueTypes = [...new Set(biens.map(b => b.typeBien).filter(Boolean))];

  const kpiData = [
    { 
      title: "Total biens", 
      value: stats.total,
      icon: Home
    },
    { 
      title: "Loués", 
      value: stats.loues,
      icon: Users,
      valueColor: "text-secondary"
    },
    { 
      title: "Disponibles", 
      value: stats.disponibles,
      icon: Home,
      valueColor: "text-green-500"
    },
    { 
      title: "Valeur totale", 
      value: `${(stats.totalValeur / 1000000).toFixed(1)}M`,
      icon: Euro,
      valueColor: "text-secondary"
    },
  ];

  const filterOptions = [
    {
      value: statusFilter,
      onChange: setStatusFilter,
      placeholder: "Statut",
      showIcon: true,
      width: "w-[180px]",
      options: [
        { value: "all", label: "Tous les statuts" },
        { value: "DISPONIBLE", label: "Disponible" },
        { value: "LOUE", label: "Loué" },
        { value: "RESERVE", label: "Réservé" },
        { value: "VENDU", label: "Vendu" },
        { value: "EN_TRAVAUX", label: "En travaux" }
      ]
    },
    {
      value: typeFilter,
      onChange: setTypeFilter,
      placeholder: "Type",
      showIcon: false,
      width: "w-[180px]",
      options: [
        { value: "all", label: "Tous les types" },
        ...uniqueTypes.map(type => ({ value: type, label: type }))
      ]
    }
  ];

  // Composant Badge pour le statut
  const StatusBadge = ({ statut }) => {
    const config = bienGestionnaireService.getStatutConfig(statut);
    return (
      <Badge className={`${config.bgColor} ${config.color} border`}>
        {config.label}
      </Badge>
    );
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement des biens...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Biens"
          description="Tous les biens sous votre gestion"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <Button 
                onClick={() => loadBiens()} 
                variant="outline"
              >
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Biens"
        description={`${stats.total} bien${stats.total > 1 ? 's' : ''} sous votre gestion`}
      />

      <div className="grid gap-4 md:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filterOptions}
        placeholder="Rechercher par référence, type, propriétaire, quartier..."
      />

      {sortedBiens.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 space-y-4">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Aucun bien trouvé pour ces critères" 
                  : "Aucun bien enregistré"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bien</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Surface</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBiens.map((bien) => (
                  <TableRow key={bien.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{bien.ref || "Sans réf"}</p>
                        <p className="text-sm text-muted-foreground">
                          {bien.typeBien || "N/A"}
                          {bien.nbrChambres > 0 && ` • ${bien.nbrChambres} ch.`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {bien.proprietaireNom || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {bien.quartierNom || bien.villeNom || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {bienGestionnaireService.formatSurface(bien.surface)}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {bienGestionnaireService.formatMontant(bien.prixApt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusBadge statut={bien.statut} />
                        {bien.estLoue && (
                          <Badge variant="outline" className="text-xs">
                            Loué
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(bien)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour les détails du bien */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Détails du bien</DialogTitle>
            </div>
            <DialogDescription>
              Informations complètes sur le bien immobilier
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bienDetails ? (
            <div className="space-y-6">
              {/* En-tête du bien */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{bienDetails.ref}</h3>
                      <p className="text-muted-foreground">{bienDetails.typeBien}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge statut={bienDetails.statut} />
                      {bienDetails.estLoue && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                          Actuellement loué
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-lg">
                    <span className="font-bold text-secondary">
                      {bienGestionnaireService.formatMontant(bienDetails.prixApt)}
                    </span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                </CardContent>
              </Card>

              {/* Galerie d'images */}
              {bienDetails.photos && bienDetails.photos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Photos du bien
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Image principale */}
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                        <img
                          src={bienDetails.photos[currentImageIndex].url || bienDetails.photos[currentImageIndex]}
                          alt={`Photo ${currentImageIndex + 1} du bien`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="18"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        
                        {/* Boutons de navigation */}
                        {bienDetails.photos.length > 1 && (
                          <>
                            <button
                              onClick={() => handlePrevImage(bienDetails.photos)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Image précédente"
                            >
                              <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                              onClick={() => handleNextImage(bienDetails.photos)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Image suivante"
                            >
                              <ChevronRight className="h-6 w-6" />
                            </button>
                          </>
                        )}

                        {/* Indicateur de position */}
                        {bienDetails.photos.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {bienDetails.photos.length}
                          </div>
                        )}
                      </div>

                      {/* Miniatures */}
                      {bienDetails.photos.length > 1 && (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {bienDetails.photos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                currentImageIndex === index
                                  ? 'border-primary scale-95'
                                  : 'border-transparent hover:border-muted-foreground/50'
                              }`}
                            >
                              <img
                                src={photo.url || photo}
                                alt={`Miniature ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3C/svg%3E';
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Message si pas de photos */}
              {(!bienDetails.photos || bienDetails.photos.length === 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Photos du bien
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">Aucune photo disponible pour ce bien</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Informations principales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Maximize className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Surface</p>
                        <p className="font-semibold">
                          {bienGestionnaireService.formatSurface(bienDetails.surface)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Bed className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Chambres</p>
                        <p className="font-semibold">{bienDetails.nbrChambres || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Bath className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Salles de bain</p>
                        <p className="font-semibold">{bienDetails.nbrSalleBain || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Étage</p>
                        <p className="font-semibold">{bienDetails.etage || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Localisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Localisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {bienGestionnaireService.getAdresseComplete(bienDetails)}
                      </p>
                      {bienDetails.localisationGps && (
                        <p className="text-sm text-muted-foreground mt-1">
                          GPS: {bienDetails.localisationGps}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {bienDetails.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {bienDetails.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Équipements */}
              {bienGestionnaireService.getEquipements(bienDetails).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Équipements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {bienGestionnaireService.getEquipements(bienDetails).map((eq) => (
                        <div key={eq.key} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <span className="text-xl">{eq.icon}</span>
                          <span className="text-sm font-medium">{eq.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Propriétaire */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Propriétaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{bienDetails.proprietaireNom || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">Propriétaire</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations complémentaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations complémentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date d'ajout</p>
                      <p className="font-medium">
                        {bienGestionnaireService.formatDate(bienDetails.dateAjout)}
                      </p>
                    </div>
                    {bienDetails.caution && (
                      <div>
                        <p className="text-sm text-muted-foreground">Caution</p>
                        <p className="font-medium text-secondary">
                          {bienGestionnaireService.formatMontant(bienDetails.caution)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Disponible</p>
                      <p className="font-semibold text-lg">
                        {bienDetails.disponible ? "Oui" : "Non"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Vendu</p>
                      <p className="font-semibold text-lg">
                        {bienDetails.estVendu ? "Oui" : "Non"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Loué</p>
                      <p className="font-semibold text-lg">
                        {bienDetails.estLoue ? "Oui" : "Non"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-destructive">Impossible de charger les détails du bien</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}