// src/features/gestionnaire-dashboard/pages/ManagerTenants.jsx
import { useState, useEffect } from "react";
import { Users, Home, Mail, MoreHorizontal, Eye, MessageSquare, Loader2, Phone, MapPin, Calendar, Euro, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/DropdownMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/Dialog";
import { Badge } from "../../../components/Badge";
import { Separator } from "../../../components/Separator";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { useAuth } from "../../../contexts/Authcontext";
import { locatairesService } from "../api/list_locataires";

export default function ManagerTenants() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour le popup de détails
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Charger les locataires au montage du composant
  useEffect(() => {
    const loadLocataires = async () => {
      if (!user?.userId) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await locatairesService.getLocataires(user.userId);
        setTenants(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des locataires:", err);
        setError(err.message || "Erreur lors du chargement des locataires");
      } finally {
        setLoading(false);
      }
    };

    loadLocataires();
  }, [user?.userId]);

  // Charger les détails d'un locataire
  const handleViewProfile = async (tenant) => {
    setSelectedTenant(tenant);
    setIsDetailsOpen(true);
    setDetailsLoading(true);

    try {
      // Vérifier si la fonction existe dans le service
      if (locatairesService && locatairesService.getDetailsLocataire) {
        const details = await locatairesService.getDetailsLocataire(tenant.userId);
        setTenantDetails(details);
      } else {
        // Si la fonction n'existe pas, utiliser les données de base du locataire
        console.warn("getDetailsLocataire non disponible, utilisation des données de base");
        setTenantDetails({
          userId: tenant.userId,
          nom: tenant.nom,
          email: tenant.email,
          tel: tenant.tel || "N/A",
          dob: tenant.dob || null,
          adresse: tenant.adresse || "N/A",
          profession: tenant.profession || "N/A",
          statut: tenant.statut,
          biensLoues: tenant.biensLoues || []
        });
      }
    } catch (err) {
      console.error("Erreur lors du chargement des détails:", err);
      // En cas d'erreur, utiliser les données de base disponibles
      setTenantDetails({
        userId: tenant.userId,
        nom: tenant.nom,
        email: tenant.email,
        tel: tenant.tel || "N/A",
        dob: tenant.dob || null,
        adresse: tenant.adresse || "N/A",
        profession: tenant.profession || "N/A",
        statut: tenant.statut,
        biensLoues: tenant.biensLoues || []
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Filtrer les locataires
  const filteredTenants = locatairesService.filterByStatut(
    locatairesService.searchLocataires(tenants, searchQuery),
    statusFilter === "all" ? null : statusFilter
  );

  // Calculer les statistiques
  const stats = locatairesService.getStatistics(tenants);

  const kpiData = [
    { 
      title: "Total locataires", 
      value: stats.total,
      icon: Users
    },
    { 
      title: "Actifs", 
      value: stats.actifs,
      icon: Users,
      valueColor: "text-secondary"
    },
    { 
      title: "Inactifs", 
      value: stats.inactifs,
      icon: Users,
      valueColor: "text-destructive"
    },
  ];

  const filterOptions = [
    {
      value: statusFilter,
      onChange: setStatusFilter,
      placeholder: "Statut",
      showIcon: true,
      options: [
        { value: "all", label: "Tous" },
        { value: "ACTIF", label: "Actif" },
        { value: "INACTIF", label: "Inactif" }
      ]
    }
  ];

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement des locataires...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Locataires"
          description="Tous les locataires sous votre gestion"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
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
        title="Locataires"
        description="Tous les locataires sous votre gestion"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filterOptions}
        placeholder="Rechercher un locataire..."
      />

      <Card>
        <CardContent className="p-0">
          {filteredTenants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter 
                  ? "Aucun locataire trouvé pour cette recherche" 
                  : "Aucun locataire enregistré"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Bien</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {tenant.nom?.split(" ").map(n => n[0]).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{tenant.nom || "N/A"}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {tenant.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        {tenant.bienRef || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>{tenant.proprietaireNom || "N/A"}</TableCell>
                    <TableCell className="font-semibold">
                      {locatairesService.formatMontant(tenant.loyer)}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        tenant.statut === "ACTIF" 
                          ? "bg-secondary text-secondary-foreground" 
                          : "bg-muted text-muted-foreground"
                      }>
                        {tenant.statut || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(tenant)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir profil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contacter
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour les détails du locataire */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Profil du locataire</DialogTitle>
              
            </div>
            <DialogDescription>
              Informations détaillées du locataire et ses biens loués
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tenantDetails ? (
            <div className="space-y-6">
              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {tenantDetails.nom?.split(" ").map(n => n[0]).join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{tenantDetails.nom}</h3>
                      <p className="text-sm text-muted-foreground">{tenantDetails.email}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Téléphone
                      </p>
                      <p className="font-medium">{tenantDetails.tel || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date de naissance
                      </p>
                      <p className="font-medium">
                        {tenantDetails.dob 
                          ? `${locatairesService.formatDate(tenantDetails.dob)} (${locatairesService.calculateAge(tenantDetails.dob)} ans)`
                          : "N/A"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Adresse
                      </p>
                      <p className="font-medium">{tenantDetails.adresse || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Profession
                      </p>
                      <p className="font-medium">{tenantDetails.profession || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Biens loués */}
              {tenantDetails.biensLoues && tenantDetails.biensLoues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Biens loués</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tenantDetails.biensLoues.map((bien, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Home className="h-5 w-5 text-primary" />
                              <h4 className="font-semibold">{bien.bienRef || "N/A"}</h4>
                            </div>
                            <Badge className={
                              bien.statut === "ACTIVE" 
                                ? "bg-secondary text-secondary-foreground" 
                                : "bg-muted"
                            }>
                              {bien.statut || "N/A"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Propriétaire</p>
                              <p className="font-medium">{bien.proprietaireNom || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Loyer</p>
                              <p className="font-medium text-secondary">
                                {locatairesService.formatMontant(bien.loyer)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date début</p>
                              <p className="font-medium">
                                {locatairesService.formatDate(bien.dateDebut)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date fin</p>
                              <p className="font-medium">
                                {bien.dateFin 
                                  ? locatairesService.formatDate(bien.dateFin)
                                  : "En cours"}
                              </p>
                            </div>
                          </div>

                          {bien.caution && (
                            <div className="pt-2 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Caution</span>
                                <span className="font-semibold">
                                  {locatairesService.formatMontant(bien.caution)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {tenantDetails.biensLoues?.length || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Biens loués</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-secondary">
                        {tenantDetails.biensLoues?.filter(b => b.statut === "ACTIVE").length || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Locations actives</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">
                        {tenantDetails.biensLoues
                          ?.filter(b => b.statut === "ACTIVE")
                          .reduce((sum, b) => sum + (b.loyer || 0), 0)
                          .toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Loyer total (FCFA)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-destructive">Impossible de charger les détails du locataire</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}