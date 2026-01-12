import { useState } from "react";
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Home,
  Calendar,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../components/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { Label } from "../../../components/Label";
import { Textarea } from "../../../components/Textarea";
import { Input } from "../../../components/Input";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import SearchAndFilter from "../components/Searchandfilter";
import { maintenanceRequests, providers, getUrgencyBadge, getStatusBadge, filterItems } from "../api/owner";

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "assigned", label: "Assigné" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Terminé" },
];

const iconMap = {
  Clock,
  User,
  Wrench,
  CheckCircle,
};

export default function OwnerMaintenance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredRequests = filterItems(
    maintenanceRequests,
    searchQuery,
    ["title", "property"],
    statusFilter
  );

  const pendingCount = maintenanceRequests.filter((r) => r.status === "pending").length;
  const inProgressCount = maintenanceRequests.filter(
    (r) => r.status === "in_progress" || r.status === "assigned"
  ).length;
  const completedCount = maintenanceRequests.filter((r) => r.status === "completed").length;

  const renderStatusBadge = (status) => {
    const badgeConfig = getStatusBadge(status, "maintenance");
    if (!badgeConfig) return null;
    
    const Icon = iconMap[badgeConfig.icon];
    return (
      <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
        {Icon && <Icon className="h-3 w-3 mr-1" />}
        {badgeConfig.label}
      </Badge>
    );
  };

  const renderUrgencyBadge = (urgency) => {
    const badgeConfig = getUrgencyBadge(urgency);
    if (!badgeConfig) return null;
    
    return (
      <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
        {badgeConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Maintenance"
        description="Gérez les demandes de maintenance et prestataires"
        action={
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
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="En attente"
          value={pendingCount}
          icon={AlertTriangle}
          valueClassName="text-orange-500"
        />
        <StatCard
          title="En cours"
          value={inProgressCount}
          icon={Wrench}
        />
        <StatCard
          title="Terminées"
          value={completedCount}
          icon={CheckCircle}
          valueClassName="text-secondary"
        />
        <StatCard
          title="Prestataires"
          value={providers.length}
          icon={User}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={statusOptions}
            placeholder="Rechercher..."
          />
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
                      {renderUrgencyBadge(request.urgency)}
                      {renderStatusBadge(request.status)}
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