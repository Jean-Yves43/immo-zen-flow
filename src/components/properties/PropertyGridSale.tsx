import { PropertyCard } from "./PropertyCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyFilters } from "@/pages/Vendre";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGridSaleProps {
  filters: PropertyFilters;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const mockPropertiesSale = [
  {
    id: 101,
    title: "Appartement Haussmannien d'exception",
    address: "16 Avenue Montaigne, Paris 8ème",
    price: 1250000,
    bedrooms: 4,
    bathrooms: 2,
    area: 145,
    images: 18,
    type: "Appartement",
    featured: true,
    forSale: true,
  },
  {
    id: 102,
    title: "Villa moderne avec piscine",
    address: "25 Chemin des Oliviers, Cannes",
    price: 2850000,
    bedrooms: 6,
    bathrooms: 4,
    area: 320,
    images: 25,
    type: "Villa",
    featured: true,
    forSale: true,
  },
  {
    id: 103,
    title: "Loft design Marais",
    address: "8 Rue des Archives, Paris 4ème",
    price: 890000,
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    images: 12,
    type: "Loft",
    featured: false,
    forSale: true,
  },
  {
    id: 104,
    title: "Maison de ville avec jardin",
    address: "42 Rue Saint-Michel, Bordeaux",
    price: 675000,
    bedrooms: 5,
    bathrooms: 2,
    area: 180,
    images: 15,
    type: "Maison",
    featured: false,
    forSale: true,
  },
  {
    id: 105,
    title: "Penthouse vue panoramique",
    address: "1 Place de l'Étoile, Lyon 2ème",
    price: 1450000,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: 20,
    type: "Penthouse",
    featured: true,
    forSale: true,
  },
  {
    id: 106,
    title: "Appartement neuf éco-responsable",
    address: "15 Allée Verte, Nantes",
    price: 385000,
    bedrooms: 3,
    bathrooms: 1,
    area: 78,
    images: 10,
    type: "Appartement",
    featured: false,
    forSale: true,
  },
  {
    id: 107,
    title: "Domaine viticole",
    address: "Route des Châteaux, Saint-Émilion",
    price: 4500000,
    bedrooms: 8,
    bathrooms: 5,
    area: 450,
    images: 30,
    type: "Domaine",
    featured: true,
    forSale: true,
  },
  {
    id: 108,
    title: "Studio investissement locatif",
    address: "3 Rue des Étudiants, Toulouse",
    price: 125000,
    bedrooms: 1,
    bathrooms: 1,
    area: 25,
    images: 6,
    type: "Studio",
    featured: false,
    forSale: true,
  },
  {
    id: 109,
    title: "Duplex contemporain",
    address: "28 Quai de la Garonne, Marseille",
    price: 720000,
    bedrooms: 4,
    bathrooms: 2,
    area: 135,
    images: 14,
    type: "Duplex",
    featured: false,
    forSale: true,
  },
];

export const PropertyGridSale = ({ sortBy, setSortBy }: PropertyGridSaleProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              <span className="text-primary">{mockPropertiesSale.length} biens</span> à vendre
            </h2>
            <p className="text-muted-foreground italic mt-1">
              Investissez dans votre avenir
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Trier par:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="area-desc">Surface décroissante</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPropertiesSale.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              delay={index * 0.1}
              isSale
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "primary" : "outline"}
              size="icon"
              className="h-10 w-10"
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
