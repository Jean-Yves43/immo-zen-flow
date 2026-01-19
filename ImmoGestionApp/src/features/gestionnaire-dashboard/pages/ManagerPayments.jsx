// src/features/gestionnaire-dashboard/pages/ManagerPayments.jsx
import { useState, useEffect } from "react";
import { CreditCard, Download, TrendingUp, AlertTriangle, Clock, Bell, Loader2, X, Send, FileText, Calendar, Home, User, Euro } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/Table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/Dialog";
import { Label } from "../../../components/Label";
import { Textarea } from "../../../components/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/Select";
import { Separator } from "../../../components/Separator";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { useAuth } from "../../../contexts/Authcontext";
import { paiementsService } from "../api/paiements";

export default function ManagerPayments() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le popup de détails
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [paiementDetails, setPaiementDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // États pour le popup de relance
  const [isRelanceOpen, setIsRelanceOpen] = useState(false);
  const [relanceLoading, setRelanceLoading] = useState(false);
  const [typeRelance, setTypeRelance] = useState(paiementsService.TYPE_RELANCE.EMAIL);
  const [messageRelance, setMessageRelance] = useState("");

  // Charger les paiements au montage du composant
  useEffect(() => {
    loadPaiements();
  }, [user?.userId]);

  const loadPaiements = async () => {
    if (!user?.userId) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await paiementsService.getPaiements(user.userId);
      setPaiements(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des paiements:", err);
      setError(err.message || "Erreur lors du chargement des paiements");
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails d'un paiement
  const handleViewDetails = async (paiement) => {
    setSelectedPaiement(paiement);
    setIsDetailsOpen(true);
    setDetailsLoading(true);

    try {
      if (paiementsService.getDetailsPaiement) {
        const details = await paiementsService.getDetailsPaiement(paiement.id);
        setPaiementDetails(details);
      } else {
        setPaiementDetails(paiement);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des détails:", err);
      setPaiementDetails(paiement);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Ouvrir le popup de relance
  const handleOpenRelance = (paiement) => {
    setSelectedPaiement(paiement);
    setMessageRelance(paiementsService.genererMessageRelance(paiement));
    setTypeRelance(paiementsService.TYPE_RELANCE.EMAIL);
    setIsRelanceOpen(true);
  };

  // Envoyer une relance
  const handleSendRelance = async () => {
    if (!selectedPaiement || !messageRelance.trim()) return;

    try {
      setRelanceLoading(true);
      await paiementsService.envoyerRelance(selectedPaiement.id, {
        typeRelance,
        messagePersonnalise: messageRelance,
      });
      
      // Fermer le popup et rafraîchir
      setIsRelanceOpen(false);
      // Optionnel : afficher un message de succès
      alert("Relance envoyée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'envoi de la relance:", err);
      alert("Erreur lors de l'envoi de la relance : " + err.message);
    } finally {
      setRelanceLoading(false);
    }
  };

  // Télécharger le reçu
  const handleDownloadRecu = () => {
    // TODO: Implémenter la génération et le téléchargement du reçu
    alert("Téléchargement du reçu en cours...");
  };

  // Filtrer les paiements
  let filteredPaiements = paiementsService.searchPaiements(paiements, searchQuery);
  
  if (statusFilter !== "all") {
    filteredPaiements = paiementsService.filterByStatut(filteredPaiements, statusFilter);
  }

  // Trier les paiements
  const sortedPaiements = paiementsService.sortPaiements(filteredPaiements, 'dateEcheance', 'desc');

  // Calculer les statistiques
  const stats = paiementsService.getStatistics(paiements);

  const kpiData = [
    { 
      title: "Revenus ce mois", 
      value: paiementsService.formatMontant(stats.montantPaye),
      icon: TrendingUp,
      valueColor: "text-secondary"
    },
    { 
      title: "En retard", 
      value: paiementsService.formatMontant(stats.montantEnRetard),
      icon: AlertTriangle,
      valueColor: "text-destructive"
    },
    { 
      title: "Taux de recouvrement", 
      value: `${Math.round(stats.tauxPaiement)}%`,
      icon: CreditCard
    },
    { 
      title: "Paiements en attente", 
      value: stats.enAttente,
      icon: Clock
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
        { value: "PAYE", label: "Payé" },
        { value: "EN_ATTENTE", label: "En attente" },
        { value: "EN_RETARD", label: "En retard" },
        { value: "PARTIEL", label: "Partiel" }
      ]
    }
  ];

  // Composant Badge pour le statut
  const StatusBadge = ({ statut }) => {
    const config = paiementsService.getStatutConfig(statut);
    return (
      <Badge className={`${config.bgColor} ${config.color} border`}>
        <span className="mr-1">{config.icon}</span>
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
          <p className="text-muted-foreground">Chargement des paiements...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Paiements"
          description="Suivi de tous les paiements"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <Button 
                onClick={() => loadPaiements()} 
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
        title="Paiements"
        description={`${stats.total} paiement${stats.total > 1 ? 's' : ''} • ${Math.round(stats.tauxPaiement)}% payés`}
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </>
        }
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
        placeholder="Rechercher par locataire, bien, propriétaire..."
      />

      {sortedPaiements.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 space-y-4">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Aucun paiement trouvé pour ces critères" 
                  : "Aucun paiement enregistré"}
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
                  <TableHead>Locataire</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Bien</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPaiements.map((paiement) => {
                  const joursRetard = paiementsService.getJoursRetard(paiement.dateEcheance);
                  
                  return (
                    <TableRow key={paiement.id}>
                      <TableCell className="font-medium">{paiement.nomLocataire || "N/A"}</TableCell>
                      <TableCell>{paiement.proprietaireNom || "N/A"}</TableCell>
                      <TableCell>{paiement.bienRef || "N/A"}</TableCell>
                      <TableCell className="font-semibold">
                        {paiementsService.formatMontant(paiement.montant)}
                      </TableCell>
                      <TableCell>
                        <div>
                          {paiementsService.formatDate(paiement.dateEcheance)}
                          {joursRetard > 0 && (
                            <p className="text-xs text-destructive mt-1">
                              Retard: {joursRetard} jour{joursRetard > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge statut={paiement.statut} />
                      </TableCell>
                      <TableCell className="text-right">
                        {paiement.statut === "PAYE" ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(paiement)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Reçu
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenRelance(paiement)}
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            Relancer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour les détails du paiement */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Détails du paiement</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDetailsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              Informations complètes et reçu de paiement
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paiementDetails ? (
            <div className="space-y-6">
              {/* Informations principales */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Montant payé</p>
                      <p className="text-3xl font-bold text-secondary">
                        {paiementsService.formatMontant(paiementDetails.montant)}
                      </p>
                    </div>
                    <StatusBadge statut={paiementDetails.statut} />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Locataire
                      </p>
                      <p className="font-medium">{paiementDetails.nomLocataire}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Bien
                      </p>
                      <p className="font-medium">{paiementDetails.bienRef}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Propriétaire
                      </p>
                      <p className="font-medium">{paiementDetails.proprietaireNom}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date d'échéance
                      </p>
                      <p className="font-medium">
                        {paiementsService.formatDate(paiementDetails.dateEcheance)}
                      </p>
                    </div>
                  </div>

                  {paiementDetails.datePaiement && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">Date de paiement</p>
                        <p className="font-medium">
                          {paiementsService.formatDate(paiementDetails.datePaiement)}
                        </p>
                      </div>
                    </>
                  )}

                  {paiementDetails.methodePaiement && (
                    <div>
                      <p className="text-sm text-muted-foreground">Méthode de paiement</p>
                      <p className="font-medium">{paiementDetails.methodePaiement}</p>
                    </div>
                  )}

                  {paiementDetails.reference && (
                    <div>
                      <p className="text-sm text-muted-foreground">Référence</p>
                      <p className="font-mono text-sm">{paiementDetails.reference}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bouton de téléchargement */}
              <Button 
                className="w-full bg-secondary hover:bg-secondary/90"
                onClick={handleDownloadRecu}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le reçu
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-destructive">Impossible de charger les détails du paiement</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour la relance */}
      <Dialog open={isRelanceOpen} onOpenChange={setIsRelanceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Envoyer une relance</DialogTitle>
            <DialogDescription>
              Relance de paiement pour {selectedPaiement?.nomLocataire}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Informations du paiement */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Montant dû</p>
                    <p className="font-semibold text-lg">
                      {paiementsService.formatMontant(selectedPaiement?.montant)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Échéance</p>
                    <p className="font-medium">
                      {paiementsService.formatDate(selectedPaiement?.dateEcheance)}
                    </p>
                  </div>
                  {selectedPaiement && paiementsService.getJoursRetard(selectedPaiement.dateEcheance) > 0 && (
                    <div className="col-span-2">
                      <Badge variant="destructive">
                        Retard de {paiementsService.getJoursRetard(selectedPaiement.dateEcheance)} jour(s)
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Type de relance */}
            <div className="space-y-2">
              <Label>Type de relance</Label>
              <Select value={typeRelance} onValueChange={setTypeRelance}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={paiementsService.TYPE_RELANCE.EMAIL}>
                    Email
                  </SelectItem>
                  <SelectItem value={paiementsService.TYPE_RELANCE.SMS}>
                    SMS
                  </SelectItem>
                  <SelectItem value={paiementsService.TYPE_RELANCE.COURRIER}>
                    Courrier
                  </SelectItem>
                  <SelectItem value={paiementsService.TYPE_RELANCE.TELEPHONE}>
                    Téléphone
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message personnalisé */}
            <div className="space-y-2">
              <Label>Message de relance</Label>
              <Textarea
                value={messageRelance}
                onChange={(e) => setMessageRelance(e.target.value)}
                rows={8}
                placeholder="Saisissez votre message de relance..."
              />
              <p className="text-xs text-muted-foreground">
                {messageRelance.length} caractères
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRelanceOpen(false)}
              disabled={relanceLoading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendRelance}
              disabled={relanceLoading || !messageRelance.trim()}
              className="bg-secondary hover:bg-secondary/90"
            >
              {relanceLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer la relance
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}