import { useState } from "react";
import {
  Home,
  Plus,
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
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/DropdownMenu";
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
import SearchAndFilter from "../components/Searchandfilter";
import { properties, getStatusBadge, filterItems } from "../api/owner";

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "rented", label: "Loué" },
  { value: "vacant", label: "Vacant" },
  { value: "for_sale", label: "En vente" },
];

export default function OwnerProperties() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const renderStatusBadge = (status) => {
    const badgeConfig = getStatusBadge(status, "property");
    if (!badgeConfig) return null;
    
    return (
      <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
        {badgeConfig.label}
      </Badge>
    );
  };

  const filteredProperties = filterItems(
    properties,
    searchQuery,
    ["name", "address"],
    statusFilter
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Mes biens"
        description={`Gérez vos ${properties.length} biens immobiliers`}
        action={
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
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={statusOptions}
            placeholder="Rechercher un bien..."
          >
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
          </SearchAndFilter>
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
                  {renderStatusBadge(property.status)}
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
                    {renderStatusBadge(property.status)}
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