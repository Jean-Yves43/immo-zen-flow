import { PropertyCard } from "./PropertyCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/Button";
import { useEffect } from "react";

/**
 * Données mockées
 * ----------------
 * À remplacer plus tard par :
 * - une API
 * - React Query
 * - ou un backend Spring / Django
 */
const mockProperties = [
  {
    id: 1,
    title: "Appartement lumineux avec balcon",
    address: "15 Rue de la Paix, Paris 2ème",
    price: 1450,
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    images: 8,
    type: "Appartement",
    featured: true,
  },
  {
    id: 2,
    title: "Studio moderne centre-ville",
    address: "8 Place Bellecour, Lyon 2ème",
    price: 680,
    bedrooms: 1,
    bathrooms: 1,
    area: 28,
    images: 6,
    type: "Studio",
    featured: false,
  },
  {
    id: 3,
    title: "Maison avec jardin",
    address: "42 Avenue des Platanes, Bordeaux",
    price: 1850,
    bedrooms: 4,
    bathrooms: 2,
    area: 120,
    images: 12,
    type: "Maison",
    featured: true,
  },
  {
    id: 4,
    title: "Loft industriel rénové",
    address: "5 Rue des Usines, Nantes",
    price: 1200,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    images: 10,
    type: "Loft",
    featured: false,
  },
  {
    id: 5,
    title: "Duplex avec terrasse",
    address: "23 Boulevard Haussmann, Paris 9ème",
    price: 2400,
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    images: 15,
    type: "Duplex",
    featured: true,
  },
  {
    id: 6,
    title: "Appartement vue mer",
    address: "12 Promenade des Anglais, Nice",
    price: 1650,
    bedrooms: 2,
    bathrooms: 1,
    area: 55,
    images: 9,
    type: "Appartement",
    featured: false,
  },
  {
    id: 7,
    title: "T3 proche transports",
    address: "7 Rue de la Gare, Toulouse",
    price: 890,
    bedrooms: 2,
    bathrooms: 1,
    area: 58,
    images: 7,
    type: "Appartement",
    featured: false,
  },
  {
    id: 8,
    title: "Villa contemporaine",
    address: "18 Chemin des Collines, Marseille",
    price: 2800,
    bedrooms: 5,
    bathrooms: 3,
    area: 180,
    images: 20,
    type: "Villa",
    featured: true,
  },
  {
    id: 9,
    title: "Studio étudiant équipé",
    address: "3 Rue des Facultés, Montpellier",
    price: 450,
    bedrooms: 1,
    bathrooms: 1,
    area: 22,
    images: 5,
    type: "Studio",
    featured: false,
  },
];

/**
 * Composant PropertyGrid
 * ---------------------
 * Affiche :
 * - le nombre total de biens
 * - le tri
 * - la grille de PropertyCard
 * - une pagination visuelle
 */
export const PropertyGrid = ({ sortBy, setSortBy }) => {
  /**
   * Log au montage
   */
  useEffect(() => {
    console.log("🏘️ PropertyGrid mounted");
    console.log("🔢 Nombre de biens:", mockProperties.length);
    console.log("↕️ Tri actuel:", sortBy);
  }, [sortBy]);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* ================= HEADER RÉSULTATS ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Nous avons trouvé{" "}
              <span className="text-primary">
                {mockProperties.length} biens
              </span>
            </h2>
            <p className="text-muted-foreground italic mt-1">
              À un clic de votre futur logement
            </p>
          </div>

          {/* ================= TRI ================= */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Trier par :</span>

            <Select
              value={sortBy}
              onValueChange={(value) => {
                console.log("🔀 Changement de tri:", value);
                setSortBy(value);
              }}
            >
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

        {/* ================= GRILLE DE BIENS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => console.log("⬅️ Page précédente")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "primary" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => console.log(`📄 Page ${page}`)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => console.log("➡️ Page suivante")}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
