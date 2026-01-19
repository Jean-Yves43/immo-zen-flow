// src/features/gestionnaire-dashboard/pages/ManagerOwners.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, Plus, Home, Euro, MoreHorizontal, Eye, UserMinus, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Badge } from "../../../components/Badge";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/DropdownMenu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../../components/Dialog";
import { Label } from "../../../components/Label";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../../../contexts/Authcontext";
import { proprietairesService } from "../api/list_proprietaires";
import { revenueByOwner } from "../api/manager";

export default function ManagerOwners() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les propriétaires au montage du composant
  useEffect(() => {
    const loadProprietaires = async () => {
      if (!user?.userId) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await proprietairesService.getProprietaires(user.userId);
        
        // Mapper les données de l'API vers le format attendu
        const mappedOwners = data.proprietaires.map(prop => ({
          id: prop.userId,
          name: prop.nom,
          email: prop.email,
          properties: prop.nbrTotalBiens || 0,
          tenants: prop.nbrTotalLocataires || 0,
          // Les revenus viennent des mockdata car l'API ne les fournit pas
          revenue: getRevenueForOwner(prop.nom),
          paymentRate: calculatePaymentRate(prop)
        }));

        setOwners(mappedOwners);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des propriétaires:", err);
        setError(err.message || "Erreur lors du chargement des propriétaires");
      } finally {
        setLoading(false);
      }
    };

    loadProprietaires();
  }, [user?.userId]);

  // Fonction pour obtenir le revenu depuis les mockdata (car l'API ne le fournit pas)
  const getRevenueForOwner = (ownerName) => {
    const revenueData = revenueByOwner.find(r => 
      r.name.toLowerCase() === ownerName.split(' ')[0].toLowerCase()
    );
    return revenueData ? revenueData.revenue : 0;
  };

  // Calculer le taux de paiement (placeholder - à adapter selon vos données)
  const calculatePaymentRate = (proprietaire) => {
    // Si vous avez des données de paiement dans l'API, utilisez-les ici
    // Sinon, retournez une valeur par défaut
    return 95; // Valeur par défaut
  };

  const handleManageOwner = (owner) => {
    navigate(`/owner?managedBy=manager&managerName=${encodeURIComponent(owner.name)}`);
  };

  // Filtrer les propriétaires selon la recherche
  const filteredOwners = owners.filter((owner) =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const kpiData = [
    { 
      title: "Total propriétaires", 
      value: owners.length, 
      icon: Users 
    },
    { 
      title: "Total biens", 
      value: owners.reduce((sum, o) => sum + o.properties, 0), 
      icon: Home,
      valueColor: "text-secondary"
    },
    { 
      title: "Revenus totaux", 
      value: `${(owners.reduce((sum, o) => sum + o.revenue, 0) / 1000).toFixed(1)}K €`, 
      icon: Euro 
    },
  ];

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement des propriétaires...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Propriétaires"
          description="Gérez vos propriétaires"
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
        title="Propriétaires"
        description={`Gérez vos ${owners.length} propriétaire${owners.length > 1 ? 's' : ''}`}
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un propriétaire
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un propriétaire</DialogTitle>
                <DialogDescription>
                  Invitez un nouveau propriétaire à rejoindre votre portefeuille.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nom complet</Label>
                  <Input placeholder="Pierre Martin" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="pierre@email.com" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Envoyer l'invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un propriétaire..." 
              className="pl-10" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </CardContent>
      </Card>

      {filteredOwners.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Aucun propriétaire trouvé pour cette recherche" 
                  : "Aucun propriétaire enregistré"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOwners.map((owner) => (
            <Card key={owner.id} className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {owner.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{owner.name}</h3>
                      <p className="text-sm text-muted-foreground">{owner.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleManageOwner(owner)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Gérer ce propriétaire
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <UserMinus className="mr-2 h-4 w-4" />
                        Retirer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{owner.properties}</p>
                    <p className="text-xs text-muted-foreground">Biens</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{owner.tenants}</p>
                    <p className="text-xs text-muted-foreground">Locataires</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1">
                    <Euro className="h-4 w-4 text-secondary" />
                    <span className="font-semibold text-secondary">
                      {owner.revenue.toLocaleString()} €
                    </span>
                    <span className="text-xs text-muted-foreground">/mois</span>
                  </div>
                  <Badge className={
                    owner.paymentRate >= 95 
                      ? "bg-secondary text-secondary-foreground" 
                      : owner.paymentRate >= 85 
                      ? "bg-orange-500" 
                      : "bg-destructive"
                  }>
                    {owner.paymentRate}% payés
                  </Badge>
                </div>
                
                <Button 
                  onClick={() => handleManageOwner(owner)} 
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Gérer ce propriétaire
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}