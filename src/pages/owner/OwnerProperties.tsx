import { useState } from "react";
import {
  Home,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Users,
  Euro,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const properties = [
  {
    id: 1,
    name: "Appartement T3 - Rue Victor Hugo",
    type: "Appartement",
    address: "15 Rue Victor Hugo, 75001 Paris",
    surface: 72,
    rooms: 3,
    rent: 1200,
    status: "rented",
    tenant: "Jean Dupont",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Studio - Rue Leclerc",
    type: "Studio",
    address: "8 Rue Leclerc, 75015 Paris",
    surface: 28,
    rooms: 1,
    rent: 650,
    status: "vacant",
    tenant: null,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Maison T5 - Avenue Foch",
    type: "Maison",
    address: "42 Avenue Foch, 75016 Paris",
    surface: 150,
    rooms: 5,
    rent: 3200,
    status: "rented",
    tenant: "Marie Lambert",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "T2 - Rue de la Paix",
    type: "Appartement",
    address: "23 Rue de la Paix, 75002 Paris",
    surface: 45,
    rooms: 2,
    rent: 980,
    status: "for_sale",
    tenant: null,
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Loft - Rue du Marais",
    type: "Loft",
    address: "5 Rue du Marais, 75004 Paris",
    surface: 95,
    rooms: 3,
    rent: 2100,
    status: "rented",
    tenant: "Paul Bernard",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "T4 - Boulevard Haussmann",
    type: "Appartement",
    address: "78 Boulevard Haussmann, 75008 Paris",
    surface: 110,
    rooms: 4,
    rent: 2800,
    status: "rented",
    tenant: "Sophie Martin",
    image: "/placeholder.svg",
  },
];

export default function OwnerProperties() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "rented":
        return <Badge className="bg-secondary text-secondary-foreground">Loué</Badge>;
      case "vacant":
        return <Badge variant="outline">Vacant</Badge>;
      case "for_sale":
        return <Badge className="bg-primary text-primary-foreground">En vente</Badge>;
      default:
        return null;
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes biens</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos {properties.length} biens immobiliers
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un bien
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau bien</DialogTitle>
              <DialogDescription>
                Remplissez les informations de votre nouveau bien immobilier.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du bien</Label>
                  <Input id="name" placeholder="Ex: Appartement T3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="Adresse complète" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="surface">Surface (m²)</Label>
                  <Input id="surface" type="number" placeholder="72" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rooms">Pièces</Label>
                  <Input id="rooms" type="number" placeholder="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent">Loyer (€)</Label>
                  <Input id="rent" type="number" placeholder="1200" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Description du bien..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Créer le bien
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un bien..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="rented">Loué</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="for_sale">En vente</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover-lift">
              <div className="aspect-video bg-muted relative">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(property.status)}
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {property.address}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {property.surface} m² • {property.rooms} pièces
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-primary font-semibold">
                      <Euro className="h-4 w-4 mr-1" />
                      {property.rent}/mois
                    </div>
                    {property.tenant && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {property.tenant}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {property.surface} m² • {property.rooms} pièces
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-primary">{property.rent} €/mois</p>
                      {property.tenant && (
                        <p className="text-sm text-muted-foreground">
                          {property.tenant}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(property.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
