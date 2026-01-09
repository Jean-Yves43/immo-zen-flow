import { useState } from "react";
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Home,
  Calendar,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const maintenanceRequests = [
  {
    id: 1,
    title: "Fuite robinet cuisine",
    property: "Apt T3 - Rue Victor Hugo",
    tenant: "Jean Dupont",
    urgency: "medium",
    status: "in_progress",
    provider: "Plombier Express",
    createdAt: "10 Jan 2024",
    description: "Le robinet de la cuisine fuit depuis 2 jours.",
  },
  {
    id: 2,
    title: "Panne chauffage",
    property: "Studio - Rue Leclerc",
    tenant: "Marie Lambert",
    urgency: "high",
    status: "pending",
    provider: null,
    createdAt: "12 Jan 2024",
    description: "Le chauffage ne fonctionne plus du tout.",
  },
  {
    id: 3,
    title: "Serrure porte entrée",
    property: "Maison T5 - Avenue Foch",
    tenant: "Paul Bernard",
    urgency: "low",
    status: "completed",
    provider: "Serrurier Pro",
    createdAt: "05 Jan 2024",
    description: "La serrure est difficile à tourner.",
  },
  {
    id: 4,
    title: "Volet roulant bloqué",
    property: "T2 - Rue de la Paix",
    tenant: "Sophie Martin",
    urgency: "low",
    status: "assigned",
    provider: "Multi-Services",
    createdAt: "08 Jan 2024",
    description: "Le volet de la chambre est bloqué en position haute.",
  },
];

const providers = [
  { id: 1, name: "Plombier Express", specialty: "Plomberie", phone: "06 11 22 33 44" },
  { id: 2, name: "Électricité Plus", specialty: "Électricité", phone: "06 22 33 44 55" },
  { id: 3, name: "Serrurier Pro", specialty: "Serrurerie", phone: "06 33 44 55 66" },
  { id: 4, name: "Multi-Services", specialty: "Général", phone: "06 44 55 66 77" },
];

export default function OwnerMaintenance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge variant="destructive">Urgent</Badge>;
      case "medium":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Moyen</Badge>;
      case "low":
        return <Badge variant="outline">Faible</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case "assigned":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <User className="h-3 w-3 mr-1" />
            Assigné
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            <Wrench className="h-3 w-3 mr-1" />
            En cours
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-secondary text-secondary-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Terminé
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredRequests = maintenanceRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = maintenanceRequests.filter((r) => r.status === "pending").length;
  const inProgressCount = maintenanceRequests.filter(
    (r) => r.status === "in_progress" || r.status === "assigned"
  ).length;
  const completedCount = maintenanceRequests.filter((r) => r.status === "completed").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les demandes de maintenance et prestataires
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer une demande de maintenance</DialogTitle>
              <DialogDescription>
                Décrivez le problème rencontré.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Ex: Fuite robinet" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property">Bien concerné</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apt1">Apt T3 - Rue Victor Hugo</SelectItem>
                      <SelectItem value="apt2">Studio - Rue Leclerc</SelectItem>
                      <SelectItem value="apt3">Maison T5 - Avenue Foch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgence</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="high">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Décrivez le problème en détail..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Créer la demande
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En cours
            </CardTitle>
            <Wrench className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Terminées
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prestataires
            </CardTitle>
            <User className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="assigned">Assigné</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Maintenance Requests */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Demandes de maintenance</h2>
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{request.title}</h3>
                      {getUrgencyBadge(request.urgency)}
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        {request.property}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {request.tenant}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {request.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.description}
                    </p>
                    {request.provider && (
                      <div className="flex items-center gap-2 pt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {request.provider[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{request.provider}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Providers */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Mes prestataires</h2>
          {providers.map((provider) => (
            <Card key={provider.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {provider.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                  </div>
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un prestataire
          </Button>
        </div>
      </div>
    </div>
  );
}
