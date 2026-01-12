// src/features/admin-dashboard/pages/AdminProperties.jsx
import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Building2,
  MapPin,
  User,
  Euro,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Badge } from "../../../components/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/Dialog";
import { Label } from "../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";

const properties = [
  { id: "1", reference: "APT-001", type: "Appartement", address: "12 Rue de la Paix", city: "Paris 75002", owner: "François Leroy", manager: "Pierre Dubois", status: "rented", rent: 1200, surface: 65 },
  { id: "2", reference: "APT-002", type: "Appartement", address: "45 Avenue Victor Hugo", city: "Lyon 69006", owner: "Catherine Moreau", manager: "Marie Martin", status: "rented", rent: 950, surface: 55 },
  { id: "3", reference: "VIL-001", type: "Villa", address: "8 Chemin des Pins", city: "Nice 06000", owner: "André Simon", manager: "Jean Bernard", status: "vacant", rent: 2500, surface: 180 },
  { id: "4", reference: "STU-001", type: "Studio", address: "22 Rue Nationale", city: "Marseille 13001", owner: "Isabelle Laurent", manager: "Sophie Petit", status: "rented", rent: 650, surface: 28 },
  { id: "5", reference: "MAI-001", type: "Maison", address: "15 Rue du Moulin", city: "Bordeaux 33000", owner: "Michel Girard", manager: "Luc Robert", status: "for_sale", rent: 0, surface: 120 },
  { id: "6", reference: "APT-003", type: "Appartement", address: "78 Boulevard Haussmann", city: "Paris 75008", owner: "François Leroy", manager: "Pierre Dubois", status: "rented", rent: 1800, surface: 85 },
  { id: "7", reference: "LOF-001", type: "Loft", address: "5 Rue de l'Industrie", city: "Nantes 44000", owner: "Catherine Moreau", manager: "Marie Martin", status: "vacant", rent: 1400, surface: 95 },
];

export default function AdminProperties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const badges = {
      rented: { class: "bg-success/10 text-success border-success/20", text: "Louée" },
      vacant: { class: "bg-warning/10 text-warning border-warning/20", text: "Vacante" },
      for_sale: { class: "bg-primary/10 text-primary border-primary/20", text: "En vente" }
    };
    const badge = badges[status];
    return badge ? <Badge className={badge.class}>{badge.text}</Badge> : null;
  };

  const propertyTypes = [...new Set(properties.map((p) => p.type))];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Propriétés</h1>
          <p className="text-muted-foreground">
            Gérez l'ensemble des propriétés de la plateforme
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une propriété
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter une propriété</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour ajouter une nouvelle propriété.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input id="reference" placeholder="APT-XXX" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="12 Rue de la Paix" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" placeholder="Paris 75002" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surface">Surface (m²)</Label>
                  <Input id="surface" type="number" placeholder="65" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="owner">Propriétaire</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">François Leroy</SelectItem>
                      <SelectItem value="2">Catherine Moreau</SelectItem>
                      <SelectItem value="3">André Simon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="manager">Gestionnaire</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Pierre Dubois</SelectItem>
                      <SelectItem value="2">Marie Martin</SelectItem>
                      <SelectItem value="3">Jean Bernard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rent">Loyer mensuel (€)</Label>
                  <Input id="rent" type="number" placeholder="1200" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rented">Louée</SelectItem>
                      <SelectItem value="vacant">Vacante</SelectItem>
                      <SelectItem value="for_sale">En vente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-primary" onClick={() => setIsCreateDialogOpen(false)}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <User className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Louées</p>
                <p className="text-2xl font-bold text-success">
                  {properties.filter((p) => p.status === "rented").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vacantes</p>
                <p className="text-2xl font-bold text-warning">
                  {properties.filter((p) => p.status === "vacant").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Euro className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenus/mois</p>
                <p className="text-2xl font-bold">
                  €{properties.filter((p) => p.status === "rented").reduce((sum, p) => sum + p.rent, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="border-border/50 shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une propriété..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="rented">Louée</SelectItem>
                  <SelectItem value="vacant">Vacante</SelectItem>
                  <SelectItem value="for_sale">En vente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Gestionnaire</TableHead>
                <TableHead>Loyer</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id} className="hover:bg-muted/50">
                  <TableCell>
                    <span className="font-mono font-medium text-primary">
                      {property.reference}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{property.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm">{property.address}</p>
                        <p className="text-xs text-muted-foreground">{property.city}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{property.owner}</TableCell>
                  <TableCell className="text-muted-foreground">{property.manager}</TableCell>
                  <TableCell>
                    {property.rent > 0 ? (
                      <span className="font-medium">€{property.rent.toLocaleString()}/mois</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="w-4 h-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Supprimer
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
    </div>
  );
}