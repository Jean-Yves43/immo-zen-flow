import { useState } from "react";
import {
  TrendingUp,
  Search,
  Plus,
  Euro,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Badge } from "../../../components/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../components/Dialog";
import { Label } from "../../../components/Label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/DropdownMenu";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { propertiesForSale, rentedProperties } from "../api/owner";

export default function OwnerSales() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);

  const totalValue = propertiesForSale.reduce((sum, p) => sum + p.price, 0);
  const totalViews = propertiesForSale.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Ventes"
        description="Gérez vos biens en vente"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Biens en vente"
          value={propertiesForSale.length}
          icon={TrendingUp}
        />
        <StatCard
          title="Valeur totale"
          value={`${(totalValue / 1000).toFixed(0)}K €`}
          icon={Euro}
          valueClassName="text-secondary"
        />
        <StatCard
          title="Vues totales"
          value={totalViews}
          icon={Eye}
        />
        <StatCard
          title="Biens louables"
          value={rentedProperties.length}
          icon={Tag}
        />
      </div>

      {/* Properties for Sale */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Biens en vente</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {propertiesForSale.map((property) => (
            <Card key={property.id} className="overflow-hidden hover-lift">
              <div className="aspect-video bg-muted relative">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                  En vente
                </Badge>
              </div>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{property.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsPriceDialogOpen(true)}>
                        <Tag className="mr-2 h-4 w-4" />
                        Modifier le prix
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Retirer de la vente
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground">
                    {property.surface} m² • {property.rooms} pièces
                  </span>
                  <span className="text-muted-foreground">
                    {property.pricePerMeter.toLocaleString()} €/m²
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-2xl font-bold text-primary">
                    {property.price.toLocaleString()} €
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
                    {property.views} vues
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Mis en vente le {property.listedDate}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Properties available to list */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Mettre un bien en vente</h2>
        <p className="text-sm text-muted-foreground">
          Sélectionnez un bien loué pour le mettre en vente
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rentedProperties.map((property) => (
            <Card key={property.id} className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{property.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.surface} m² • {property.rooms} pièces
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Loué à: {property.tenant}
                    </p>
                    <p className="text-sm font-medium text-primary mt-1">
                      Estimation: {(property.estimatedPrice / 1000).toFixed(0)}K €
                    </p>
                  </div>
                </div>
                <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-4">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Mettre en vente
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mettre en vente</DialogTitle>
                      <DialogDescription>
                        Définissez le prix de vente pour ce bien
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Bien</Label>
                        <p className="text-sm font-medium">{property.name}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Prix de vente (€)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder={property.estimatedPrice.toString()}
                        />
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          ⚠️ Le locataire actuel ({property.tenant}) sera informé de la mise en vente.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsListDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        Confirmer la mise en vente
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Price Update Dialog */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le prix</DialogTitle>
            <DialogDescription>
              Mettez à jour le prix de vente de ce bien
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-price">Nouveau prix (€)</Label>
              <Input id="new-price" type="number" placeholder="320000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPriceDialogOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}