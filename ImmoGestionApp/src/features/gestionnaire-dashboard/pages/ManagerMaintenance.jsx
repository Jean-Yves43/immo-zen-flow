import { useState, useEffect } from "react";
import { Wrench, AlertTriangle, CheckCircle, Clock, User, Home, Calendar, Loader2, Eye, X, Mail, Phone, MapPin, FileText, DollarSign } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import { Badge } from "../../../components/Badge";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { useAuth } from "../../../contexts/Authcontext";
import { maintenanceService } from "../api/list_maintenance";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
};

// Modal de détails de maintenance
const MaintenanceDetailsModal = ({ maintenance, isOpen, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && maintenance) {
      loadDetails();
    }
  }, [isOpen, maintenance?.id]);

  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await maintenanceService.getDetailsMaintenance(maintenance.id);
      setDetails(data);
    } catch (err) {
      setError("Erreur lors du chargement des détails");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const urgenceConfig = maintenanceService.getUrgenceConfig(maintenance.urgence);
  const statutConfig = maintenanceService.getStatutDetailsConfig(maintenance.statut);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Détails de la maintenance</h2>
          <p className="text-sm text-muted-foreground mt-1">Référence #{maintenance.id}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadDetails} variant="outline">Réessayer</Button>
          </div>
        ) : details ? (
          <div className="space-y-6">
            {/* En-tête avec badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${urgenceConfig.bgColor} ${urgenceConfig.color} border`}>
                <span className={`inline-block w-2 h-2 rounded-full ${urgenceConfig.dotColor} mr-1.5`}></span>
                {urgenceConfig.label}
              </Badge>
              <Badge className={`${statutConfig.bgColor} ${statutConfig.color} border`}>
                <span className="mr-1">{statutConfig.icon}</span>
                {statutConfig.label}
              </Badge>
              <Badge variant="outline">{details.typeMaintenance}</Badge>
            </div>

            {/* Titre et description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{details.titre}</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{details.description}</p>
              </div>
            </div>

            {/* Informations du bien */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <Home className="h-5 w-5" />
                <span>Informations du bien</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Référence:</span>
                  <span className="ml-2 font-medium">{details.bienRef}</span>
                </div>
                {details.bienType && (
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium">{details.bienType}</span>
                  </div>
                )}
                {details.bienAdresse && (
                  <div className="md:col-span-2 flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{details.bienAdresse}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contacts */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Locataire */}
              {details.locataireNom && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <User className="h-5 w-5" />
                    <span>Locataire</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{details.locataireNom}</p>
                    {details.locataireEmail && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{details.locataireEmail}</span>
                      </div>
                    )}
                    {details.locataireTel && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{details.locataireTel}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Propriétaire */}
              {details.proprietaireNom && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <User className="h-5 w-5" />
                    <span>Propriétaire</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{details.proprietaireNom}</p>
                    {details.proprietaireEmail && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{details.proprietaireEmail}</span>
                      </div>
                    )}
                    {details.proprietaireTel && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{details.proprietaireTel}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Prestataire */}
            {details.prestataireNom && (
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <Wrench className="h-5 w-5" />
                  <span>Prestataire assigné</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nom:</span>
                    <span className="ml-2 font-medium">{details.prestataireNom}</span>
                  </div>
                  {details.prestataireSpecialite && (
                    <div>
                      <span className="text-muted-foreground">Spécialité:</span>
                      <span className="ml-2 font-medium">{details.prestataireSpecialite}</span>
                    </div>
                  )}
                  {details.prestataireEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{details.prestataireEmail}</span>
                    </div>
                  )}
                  {details.prestataireTel && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{details.prestataireTel}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <Calendar className="h-5 w-5" />
                <span>Chronologie</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="font-medium">Demande créée</p>
                    <p className="text-muted-foreground">
                      {maintenanceService.formatDate(details.dateDemande)}
                    </p>
                  </div>
                </div>
                {details.dateIntervention && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <p className="font-medium">Intervention prévue</p>
                      <p className="text-muted-foreground">
                        {maintenanceService.formatDate(details.dateIntervention)}
                      </p>
                    </div>
                  </div>
                )}
                {details.dateResolution && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="font-medium">Résolue</p>
                      <p className="text-muted-foreground">
                        {maintenanceService.formatDate(details.dateResolution)}
                      </p>
                      {maintenanceService.getDureeResolution(details) && (
                        <p className="text-xs text-muted-foreground">
                          Résolu en {maintenanceService.getDureeResolution(details)} jour(s)
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informations financières */}
            {(details.coutEstime || details.coutFinal) && (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <DollarSign className="h-5 w-5" />
                  <span>Informations financières</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  {details.coutEstime && (
                    <div>
                      <span className="text-muted-foreground">Coût estimé:</span>
                      <span className="ml-2 font-medium">{details.coutEstime?.toFixed(2)} €</span>
                    </div>
                  )}
                  {details.coutFinal && (
                    <div>
                      <span className="text-muted-foreground">Coût final:</span>
                      <span className="ml-2 font-medium">{details.coutFinal?.toFixed(2)} €</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {(details.notesDemande || details.notesIntervention || details.notesResolution) && (
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2 font-semibold">
                  <FileText className="h-5 w-5" />
                  <span>Notes et commentaires</span>
                </div>
                <div className="space-y-3 text-sm">
                  {details.notesDemande && (
                    <div>
                      <p className="font-medium mb-1">Notes de la demande:</p>
                      <p className="bg-muted/50 rounded p-3">{details.notesDemande}</p>
                    </div>
                  )}
                  {details.notesIntervention && (
                    <div>
                      <p className="font-medium mb-1">Notes d'intervention:</p>
                      <p className="bg-muted/50 rounded p-3">{details.notesIntervention}</p>
                    </div>
                  )}
                  {details.notesResolution && (
                    <div>
                      <p className="font-medium mb-1">Notes de résolution:</p>
                      <p className="bg-green-50 dark:bg-green-950/20 rounded p-3">{details.notesResolution}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-muted/50 border-t px-6 py-4 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Fermer</Button>
        <Button>Modifier</Button>
      </div>
    </Modal>
  );
};

export default function ManagerMaintenance() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [maintenances, setMaintenances] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour le modal
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadMaintenances();
  }, [user?.userId]);

  const loadMaintenances = async () => {
    if (!user?.userId) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiFilters = {};
      if (statusFilter !== "all") apiFilters.statut = statusFilter;
      if (urgencyFilter !== "all") apiFilters.urgence = urgencyFilter;
      if (typeFilter !== "all") apiFilters.categorie = typeFilter;

      const data = await maintenanceService.getMaintenances(user.userId, apiFilters);
      setMaintenances(data.maintenances || []);
      setStats(data.nbrParStatut || {});
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des maintenances:", err);
      setError(err.message || "Erreur lors du chargement des maintenances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      loadMaintenances();
    }
  }, [statusFilter, urgencyFilter, typeFilter]);

  const filteredMaintenances = maintenanceService.searchMaintenances(maintenances, searchQuery);
  const sortedMaintenances = maintenanceService.sortMaintenances(filteredMaintenances, 'dateDemande', 'desc');

  // Fonctions pour gérer le modal
  const handleOpenDetails = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMaintenance(null), 200);
  };

  const kpiData = [
    { title: "En attente", value: stats?.EN_ATTENTE || 0, icon: Clock, valueColor: "text-orange-500" },
    { title: "En cours", value: stats?.EN_COURS || 0, icon: Wrench, valueColor: "text-blue-500" },
    { title: "Terminées", value: stats?.TERMINEE || 0, icon: CheckCircle, valueColor: "text-secondary" },
    { 
      title: "Urgentes", 
      value: maintenances.filter(m => (m.urgence === "CRITIQUE" || m.urgence === "HAUTE") && m.statut !== "TERMINEE").length,
      icon: AlertTriangle,
      valueColor: "text-destructive"
    },
  ];

  const filterOptions = [
    {
      value: statusFilter,
      onChange: setStatusFilter,
      placeholder: "Statut",
      showIcon: true,
      width: "w-[160px]",
      options: [
        { value: "all", label: "Tous les statuts" },
        { value: "EN_ATTENTE", label: "En attente" },
        { value: "EN_COURS", label: "En cours" },
        { value: "TERMINEE", label: "Terminée" },
        { value: "ANNULEE", label: "Annulée" }
      ]
    },
    {
      value: urgencyFilter,
      onChange: setUrgencyFilter,
      placeholder: "Urgence",
      showIcon: true,
      width: "w-[150px]",
      options: [
        { value: "all", label: "Toutes urgences" },
        { value: "CRITIQUE", label: "Critique" },
        { value: "HAUTE", label: "Haute" },
        { value: "MOYENNE", label: "Moyenne" },
        { value: "FAIBLE", label: "Faible" }
      ]
    },
    {
      value: typeFilter,
      onChange: setTypeFilter,
      placeholder: "Type",
      showIcon: false,
      width: "w-[150px]",
      options: [
        { value: "all", label: "Tous types" },
        { value: "PLOMBERIE", label: "Plomberie" },
        { value: "ELECTRICITE", label: "Électricité" },
        { value: "PEINTURE", label: "Peinture" },
        { value: "MENUISERIE", label: "Menuiserie" },
        { value: "SERRURERIE", label: "Serrurerie" },
        { value: "CLIMATISATION", label: "Climatisation" },
        { value: "AUTRE", label: "Autre" }
      ]
    }
  ];

  const UrgencyBadge = ({ urgence }) => {
    const config = maintenanceService.getUrgenceConfig(urgence);
    return (
      <Badge className={`${config.bgColor} ${config.color} border`}>
        <span className={`inline-block w-2 h-2 rounded-full ${config.dotColor} mr-1.5`}></span>
        {config.label}
      </Badge>
    );
  };

  const StatusBadge = ({ statut }) => {
    const config = maintenanceService.getStatutConfig(statut);
    return (
      <Badge className={`${config.bgColor} ${config.color} border`}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement des maintenances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="Maintenance" description="Toutes les demandes de maintenance" />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => loadMaintenances()} variant="outline">Réessayer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Maintenance"
        description={`${maintenances.length} demande${maintenances.length > 1 ? 's' : ''} de maintenance`}
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
        placeholder="Rechercher par titre, bien, locataire ou prestataire..."
      />

      {sortedMaintenances.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 space-y-4">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || urgencyFilter !== "all" || typeFilter !== "all"
                  ? "Aucune maintenance trouvée pour ces critères" 
                  : "Aucune demande de maintenance"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedMaintenances.map((maintenance) => {
            const isOverdue = maintenanceService.isOverdue(maintenance);
            const daysSince = maintenanceService.getDaysSinceDemande(maintenance.dateDemande);

            return (
              <Card key={maintenance.id} className={`hover-lift ${isOverdue ? 'border-destructive/50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{maintenance.titre || "Sans titre"}</h3>
                        <UrgencyBadge urgence={maintenance.urgence} />
                        <StatusBadge statut={maintenance.statut} />
                        {isOverdue && (
                          <Badge variant="destructive" className="animate-pulse">En retard</Badge>
                        )}
                      </div>

                      {maintenance.typeMaintenance && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-muted/50">
                            {maintenance.typeMaintenance}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Home className="h-4 w-4" />
                          {maintenance.bienRef || "N/A"}
                        </span>
                        {maintenance.nomLocataire && (
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {maintenance.nomLocataire}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {maintenanceService.formatDate(maintenance.dateDemande)}
                          {daysSince > 0 && (
                            <span className="text-xs">
                              (il y a {daysSince} jour{daysSince > 1 ? 's' : ''})
                            </span>
                          )}
                        </span>
                      </div>

                      {maintenance.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {maintenance.description}
                        </p>
                      )}

                      {maintenance.prestataireNom && (
                        <div className="flex items-center gap-2 pt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {maintenance.prestataireNom[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Prestataire: </span>
                            <span className="font-medium">{maintenance.prestataireNom}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenDetails(maintenance)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de détails */}
      {selectedMaintenance && (
        <MaintenanceDetailsModal
          maintenance={selectedMaintenance}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}